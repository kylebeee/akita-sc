import {
  abimethod,
  Account,
  Application,
  assert,
  assertMatch,
  BoxMap,
  bytes,
  clone,
  Global,
  gtxn,
  itxn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { Txn } from '@algorandfoundation/algorand-typescript/op'
import { Address, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import {
  Amounts,
  ServiceID,
  ServiceStatusActive,
  ServiceStatusPaused,
  ServiceStatusShutdown,
  Service,
  SubscriptionID,
  SubscriptionInfo,
  SubscriptionInfoWithPasses,
  ServicesKey,
  BlockListKey,
  PassesKey,
  SubscriptionKey,
} from './types'
import {
  SubscriptionsBoxPrefixBlocks,
  SubscriptionsBoxPrefixPasses,
  SubscriptionsBoxPrefixServices,
  SubscriptionsBoxPrefixServicesList,
  SubscriptionsBoxPrefixSubscriptions,
  SubscriptionsBoxPrefixSubscriptionsList,
} from './constants'
import {
  ERR_ASA_MISMATCH,
  ERR_BAD_WINDOW,
  ERR_BLOCKED,
  ERR_FAILED_GATE,
  ERR_INVALID_ASSET_RECEIVER,
  ERR_MAX_PASSES_IS_FIVE,
  ERR_MIN_AMOUNT_IS_THREE,
  ERR_MIN_INTERVAL_IS_SIXTY,
  ERR_NO_DONATIONS,
  ERR_NOT_A_SERVICE,
  ERR_NOT_ENOUGH_FUNDS,
  ERR_PASS_COUNT_OVERFLOW,
  ERR_SERVICE_DOES_NOT_EXIST,
  ERR_SERVICE_INDEX_MUST_BE_ABOVE_ZERO,
  ERR_SERVICE_IS_NOT_ACTIVE,
  ERR_SERVICE_IS_NOT_PAUSED,
  ERR_SERVICE_IS_SHUTDOWN,
  ERR_SUBSCRIPTION_DOES_NOT_EXIST,
  ERR_USER_ALREADY_BLOCKED,
  ERR_USER_NOT_BLOCKED,
} from './errors'
import { ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER } from '../utils/errors'
import { CID } from '../utils/types/base'
import { BaseSubscriptions } from './base'
import { ContractWithOptIn } from '../utils/base-contracts/optin'
import { classes } from 'polytype'
import { AkitaDAOEscrowAccountSubscriptions } from '../dao/constants'
import { AkitaBaseEscrow } from '../utils/base-contracts/base'
import { calcPercent, gateCheck, getSubscriptionFees, getWalletIDUsingAkitaDAO, originOrTxnSender } from '../utils/functions'
import { ERR_HAS_GATE } from '../social/errors'

export class Subscriptions extends classes(
  BaseSubscriptions,
  AkitaBaseEscrow,
  ContractWithOptIn
) {

  // BOXES ----------------------------------------------------------------------------------------

  subscriptions = BoxMap<SubscriptionKey, SubscriptionInfo>({
    keyPrefix: SubscriptionsBoxPrefixSubscriptions,
  })

  /** A counter for each addresses subscription id */
  subscriptionslist = BoxMap<Account, uint64>({ keyPrefix: SubscriptionsBoxPrefixSubscriptionsList })

  /**
   * services is a map of services a specific merchant has
   * denoted by the merchant address + index of the offer as a key
   * 32 + 8 = 40 bytes
   * 120 bytes total -> (2500 + (400 * 121)) = 0.050500
   */
  services = BoxMap<ServicesKey, Service>({ keyPrefix: SubscriptionsBoxPrefixServices })

  serviceslist = BoxMap<Account, uint64>({ keyPrefix: SubscriptionsBoxPrefixServicesList })

  /**
   * blocks allow merchants to specify which addresses cannot subscribe
   * key will be merchant address + blocked address
   * 32 + 32 = 64 bytes
   * 65 bytes total -> (2500 + (400 * 64)) = 0.028500
   */
  blocks = BoxMap<BlockListKey, bytes<0>>({ keyPrefix: SubscriptionsBoxPrefixBlocks })

  passes = BoxMap<PassesKey, Address[]>({ keyPrefix: SubscriptionsBoxPrefixPasses })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private getLatestWindowStart(startDate: uint64, interval: uint64): uint64 {
    return Global.latestTimestamp - ((Global.latestTimestamp - startDate) % interval)
  }

  private updateStreak(address: Address, id: SubscriptionID, elseStreak: uint64): void {
    const subKey: SubscriptionKey = { address, id }
    const sub = clone(this.subscriptions(subKey).value)

    const currentWindowStart: uint64 = this.getLatestWindowStart(sub.startDate, sub.interval)
    const lastWindowStart: uint64 = currentWindowStart - sub.interval

    if (sub.lastPayment < lastWindowStart) {
      // reset the streak
      this.subscriptions(subKey).value = {
        ...this.subscriptions(subKey).value,
        streak: elseStreak
      }
      return
    }

    // update the streak if this function is being called
    // after a payment was made in the last window
    // but not during the current window
    if (sub.lastPayment >= lastWindowStart && !(sub.lastPayment >= currentWindowStart)) {
      this.subscriptions(subKey).value = {
        ...this.subscriptions(subKey).value,
        streak: (sub.streak + 1)
      }
    }
  }

  private getAmounts(amount: uint64): Amounts {
    const fees = getSubscriptionFees(this.akitaDAO.value)

    let akitaFee: uint64 = 0
    if (fees.paymentPercentage > 0) {
      akitaFee = calcPercent(amount, fees.paymentPercentage)
      if (akitaFee === 0 && amount > 0) {
        akitaFee = 1
      }
    }

    let triggerFee: uint64 = 0
    if (fees.triggerPercentage > 0) {
      let triggerFee = calcPercent(amount, fees.triggerPercentage)
      if (triggerFee === 0 && amount > 0) {
        triggerFee = 1
      }
    }

    const leftOver: uint64 = amount - (akitaFee + triggerFee)

    return {
      akitaFee: akitaFee,
      triggerFee: triggerFee,
      leftOver: leftOver,
    }
  }

  private newServiceID(address: Address): ServiceID {
    const id: uint64 = this.serviceslist(address.native).exists
      ? this.serviceslist(address.native).value
      : 0
    this.serviceslist(address.native).value = id + 1
    return id
  }

  private newSubscriptionID(address: Address): SubscriptionID {
    const id: uint64 = this.subscriptionslist(address.native).exists
      ? this.subscriptionslist(address.native).value
      : 0
    this.subscriptionslist(address.native).value = id + 1
    return id
  }

  private createSubscription(
    payment: gtxn.PaymentTxn,
    recipient: Address,
    amount: uint64,
    interval: uint64,
    serviceID: ServiceID,
  ): void {
    const arc4Sender = new Address(Txn.sender)
    const blocksKey: BlockListKey = {
      address: recipient.bytes.slice(0, 16).toFixed({ length: 16 }),
      blocked: Txn.sender.bytes.slice(0, 16).toFixed({ length: 16 }),
    }
    // ensure they aren't blocked
    assert(!this.blocks(blocksKey).exists, ERR_BLOCKED)
    // gate is zero unless the service has a gate
    let gateID: uint64 = 0
    // index zero is always reserved for donations
    const isDonation = serviceID === 0
    if (!isDonation) {
      const boxKey: ServicesKey = { address: recipient, id: serviceID }
      // ensure the service exists
      assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST)
      // get the service details
      const service = clone(this.services(boxKey).value)
      // ensure the service is active
      assert(service.status === ServiceStatusActive, ERR_SERVICE_IS_NOT_ACTIVE)
      // ensure its an algo subscription
      assert(service.asset === 0, ERR_ASA_MISMATCH)
      // overwrite the details for the subscription
      amount = service.amount
      interval = service.interval
      gateID = service.gateID
    }

    const subscriptionID = this.newSubscriptionID(arc4Sender)
    const subscriptionKey: SubscriptionKey = { address: arc4Sender, id: subscriptionID }

    const amounts = this.getAmounts(amount)

    const costs = this.mbr(0)
    let mbrAmount = costs.subscriptions
    if (subscriptionID === 1) {
      mbrAmount += costs.subscriptionslist
    }

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: amount + mbrAmount,
      },
      ERR_INVALID_PAYMENT
    )

    itxn
      .payment({
        receiver: this.akitaDAOEscrow.value.address,
        amount: amounts.akitaFee + amounts.triggerFee
      })
      .submit()

    itxn
      .payment({
        receiver: recipient.native,
        amount: amounts.leftOver
      })
      .submit()

    // amounts.leftOver is the send amount after fees
    // payment.amount should be allowed to be over if
    // the user wants to provide some assets for the escrow
    // at the same time as they are subscribing
    const paymentDifference: uint64 = payment.amount - amounts.leftOver

    this.subscriptions(subscriptionKey).value = {
      recipient: recipient,
      serviceID,
      startDate: Global.latestTimestamp,
      amount,
      interval,
      asset: 0,
      gateID,
      lastPayment: Global.latestTimestamp,
      streak: 1,
      escrowed: paymentDifference,
    }
  }

  private createAsaSubscription(
    payment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    recipient: Address,
    amount: uint64,
    interval: uint64,
    serviceID: ServiceID,
  ): void {
    const arc4Sender = new Address(Txn.sender)
    const blocksKey: BlockListKey = {
      address: recipient.bytes.slice(0, 16).toFixed({ length: 16 }),
      blocked: Txn.sender.bytes.slice(0, 16).toFixed({ length: 16 }),
    }
    // ensure they aren't blocked
    assert(!this.blocks(blocksKey).exists, ERR_BLOCKED)
    // gate is zero unless the service has a gate
    let gateID: uint64 = 0
    // index zero is always reserved for donations
    const isDonation = serviceID === 0
    if (!isDonation) {
      const boxKey: ServicesKey = { address: recipient, id: serviceID }
      // ensure the service exists
      assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST)
      // get the service details
      const service = clone(this.services(boxKey).value)
      // ensure the service is active
      assert(service.status === ServiceStatusActive, ERR_SERVICE_IS_NOT_ACTIVE)
      // ensure its an algo subscription
      assert(service.asset === assetXfer.xferAsset.id, ERR_ASA_MISMATCH)
      // overwrite the details for the subscription
      amount = service.amount
      interval = service.interval
      gateID = service.gateID
    }

    const subscriptionID = this.newSubscriptionID(arc4Sender)
    const subscriptionKey = { address: arc4Sender, id: subscriptionID }

    const costs = this.mbr(0)
    let mbrAmount = costs.subscriptions
    if (subscriptionID === 1) {
      mbrAmount += costs.subscriptionslist
    }

    if (!this.akitaDAOEscrow.value.address.isOptedIn(assetXfer.xferAsset)) {
      this.optAkitaEscrowInAndSend(
        AkitaDAOEscrowAccountSubscriptions,
        assetXfer.xferAsset,
        0
      )
      mbrAmount += (Global.assetOptInMinBalance * 4)
    }

    const amounts = this.getAmounts(amount)

    // mbr payment checks
    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: mbrAmount,
      },
      ERR_INVALID_PAYMENT
    )

    // asset transfer checks
    assertMatch(
      assetXfer,
      {
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: amount,
      },
      ERR_INVALID_TRANSFER
    )

    itxn
      .assetTransfer({
        assetReceiver: this.akitaDAOEscrow.value.address,
        xferAsset: assetXfer.xferAsset,
        assetAmount: amounts.akitaFee + amounts.triggerFee
      })
      .submit()

    itxn
      .assetTransfer({
        assetReceiver: recipient.native,
        xferAsset: assetXfer.xferAsset,
        assetAmount: amounts.leftOver
      })
      .submit()

    // amounts.leftOver is the send amount after fees
    // payment.amount should be allowed to be over if
    // the user wants to provide some assets for the escrow
    // at the same time as they are subscribing
    const paymentDifference: uint64 = payment.amount - amounts.leftOver

    this.subscriptions(subscriptionKey).value = {
      recipient: recipient,
      serviceID,
      startDate: Global.latestTimestamp,
      amount,
      interval,
      asset: assetXfer.xferAsset.id,
      gateID,
      lastPayment: Global.latestTimestamp,
      streak: 1,
      escrowed: paymentDifference,
    }
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64, escrow: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
    this.akitaDAOEscrow.value = Application(escrow)
  }

  // SUBSCRIPTION METHODS -------------------------------------------------------------------------

  /**
   * newService creates a new service for a merchant
   * @param payment The payment for the service creation
   * @param interval The interval in seconds
   * @param asset The asa to be used for the subscription
   * @param amount The amount of the asa to be used for the subscription
   * @param passes The number of accounts the subscription can be shared with
   * @param gate The gate to be used for the subscription
   * @param cid The ipfs cid of the subscription contract
   * or upgrade the subscription to a different service from the user without losing their streak
   */
  newService(
    payment: gtxn.PaymentTxn,
    interval: uint64,
    asset: uint64,
    amount: uint64,
    passes: uint64,
    gateID: uint64,
    cid: CID
  ): uint64 {
    const address = new Address(Txn.sender)
    const id = this.newServiceID(address)
    const boxKey: ServicesKey = { address, id }

    // ensure the amount is enough to take fees on
    assert(amount > 3, ERR_MIN_AMOUNT_IS_THREE)
    // ensure payouts cant be too fast
    assert(interval >= 60, ERR_MIN_INTERVAL_IS_SIXTY)
    // family passes have a max of 5
    assert(passes <= 5, ERR_MAX_PASSES_IS_FIVE)

    const serviceCreationFee = getSubscriptionFees(this.akitaDAO.value).serviceCreationFee
    const costs = this.mbr(passes)

    let requiredAmount: uint64 = serviceCreationFee + costs.services
    if (asset !== 0) {
      requiredAmount += Global.assetOptInMinBalance
    }

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: requiredAmount,
      },
      ERR_INVALID_PAYMENT
    )

    itxn
      .payment({
        receiver: this.akitaDAOEscrow.value.address,
        amount: serviceCreationFee
      })
      .submit()

    this.services(boxKey).value = {
      status: ServiceStatusPaused,
      interval,
      asset,
      amount,
      passes,
      gateID,
      cid,
    }

    return id
  }

  /**
   * pauseService pauses a service for a merchant
   * it does not shutdown pre-existing subscriptions
   * it simply prevents new subscriptions from being created
   * for a specific service
   * @param index The index of the box to be used for the subscription
   */
  pauseService(id: ServiceID): void {
    const boxKey: ServicesKey = { address: new Address(Txn.sender), id }
    // ensure were not using zero as a box index
    // zero is reserved for non-service based subscriptions
    assert(id > 0, ERR_SERVICE_INDEX_MUST_BE_ABOVE_ZERO)
    // ensure the box exists
    assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST)
    // ensure the service isn't already shutdown
    assert(this.services(boxKey).value.status === ServiceStatusActive, ERR_SERVICE_IS_NOT_ACTIVE)

    this.services(boxKey).value = {
      ...this.services(boxKey).value,
      status: ServiceStatusPaused,
    }
  }

  /**
   * activateService activates an service for a merchant
   *
   * @param index The index of the box to be used for the subscription
   */
  activateService(id: ServiceID): void {
    const boxKey: ServicesKey = { address: new Address(Txn.sender), id }

    // ensure the box exists
    assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST)
    // ensure the service is currently paused
    assert(this.services(boxKey).value.status === ServiceStatusPaused, ERR_SERVICE_IS_NOT_PAUSED)

    this.services(boxKey).value = {
      ...this.services(boxKey).value,
      status: ServiceStatusActive,
    }
  }

  /**
   * shutdownService permanently shuts down an service for a merchant
   * it also shutsdown pre-existing subscriptions
   * @param index The index of the box to be used for the subscription
   */
  shutdownService(id: ServiceID): void {
    const boxKey: ServicesKey = { address: new Address(Txn.sender), id }
    // ensure the box exists
    assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST)
    // ensure the service isn't already shutdown
    assert(this.services(boxKey).value.status !== ServiceStatusShutdown, ERR_SERVICE_IS_SHUTDOWN)

    this.services(boxKey).value = {
      ...this.services(boxKey).value,
      status: ServiceStatusShutdown,
    }
  }

  /**
   * block blacklists an address for a merchant
   * @param payment The payment to cover mbr for blocking
   * @param blocked The address to be blocked
   */
  block(payment: gtxn.PaymentTxn, blocked: Address): void {
    // const origin = getOrigin(spending)
    const boxKey: BlockListKey = {
      address: Txn.sender.bytes.slice(0, 16).toFixed({ length: 16 }),
      blocked: blocked.bytes.slice(0, 16).toFixed({ length: 16 }),
    }

    // ensure the address is not already blocked
    assert(!this.blocks(boxKey).exists, ERR_USER_ALREADY_BLOCKED)
    // ensure the payment is correct
    const costs = this.mbr(0)
    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: costs.blocks,
      },
      ERR_INVALID_PAYMENT
    )

    this.blocks(boxKey).create()
  }

  /**
   * unblock removes an address from a merchants blocks
   * @param blocked The address to be unblocked
   */
  unblock(blocked: Address): void {
    const boxKey: BlockListKey = {
      address: Txn.sender.bytes.slice(0, 16).toFixed({ length: 16 }),
      blocked: blocked.bytes.slice(0, 16).toFixed({ length: 16 }),
    }

    // ensure that the address is currently blocked
    assert(this.blocks(boxKey).exists, ERR_USER_NOT_BLOCKED)

    this.blocks(boxKey).delete()

    const costs = this.mbr(0)

    itxn.payment({
      receiver: Txn.sender,
      amount: costs.blocks
    }).submit()
  }

  gatedSubscribe(
    payment: gtxn.PaymentTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    recipient: Address,
    amount: uint64,
    interval: uint64,
    serviceID: ServiceID,
  ): void {
    // ensure the amount is enough to take fees on
    assert(amount >= 3, ERR_MIN_AMOUNT_IS_THREE)
    // ensure payouts cant be too fast
    assert(interval >= 60, ERR_MIN_INTERVAL_IS_SIXTY)

    assert(serviceID !== 0, ERR_NOT_A_SERVICE)
    assert(this.services({ address: recipient, id: serviceID }).exists, ERR_SERVICE_DOES_NOT_EXIST)
    const gateID = this.services({ address: recipient, id: serviceID }).value.gateID

    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    assert(gateCheck(gateTxn, this.akitaDAO.value, origin, gateID), ERR_FAILED_GATE)

    this.createSubscription(payment, recipient, amount, interval, serviceID)
  }

  subscribe(
    payment: gtxn.PaymentTxn,
    recipient: Address,
    amount: uint64,
    interval: uint64,
    serviceID: ServiceID,
  ): void {
    // ensure the amount is enough to take fees on
    assert(amount >= 3, ERR_MIN_AMOUNT_IS_THREE)
    // ensure payouts cant be too fast
    assert(interval >= 60, ERR_MIN_INTERVAL_IS_SIXTY)

    if (serviceID !== 0) {
      assert(this.services({ address: recipient, id: serviceID }).exists, ERR_SERVICE_DOES_NOT_EXIST)
      const gateID = this.services({ address: recipient, id: serviceID }).value.gateID
      assert(gateID === 0, ERR_HAS_GATE)
    }

    this.createSubscription(payment, recipient, amount, interval, serviceID)
  }

  gatedSubscribeAsa(
    payment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    recipient: Address,
    amount: uint64,
    interval: uint64,
    serviceID: ServiceID,
  ): void {
    // ensure the amount is enough to take fees on
    assert(amount > 3, ERR_MIN_AMOUNT_IS_THREE)
    // ensure payouts cant be too fast
    assert(interval >= 60, ERR_MIN_INTERVAL_IS_SIXTY)

    assert(serviceID !== 0, ERR_NOT_A_SERVICE)
    assert(this.services({ address: recipient, id: serviceID }).exists, ERR_SERVICE_DOES_NOT_EXIST)
    const gateID = this.services({ address: recipient, id: serviceID }).value.gateID

    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    assert(gateCheck(gateTxn, this.akitaDAO.value, origin, gateID), ERR_FAILED_GATE)

    this.createAsaSubscription(
      payment,
      assetXfer,
      recipient,
      amount,
      interval,
      serviceID
    )
  }

  subscribeAsa(
    payment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    recipient: Address,
    amount: uint64,
    interval: uint64,
    serviceID: ServiceID,
  ): void {
    // ensure the amount is enough to take fees on
    assert(amount > 3, ERR_MIN_AMOUNT_IS_THREE)
    // ensure payouts cant be too fast
    assert(interval >= 60, ERR_MIN_INTERVAL_IS_SIXTY)

    if (serviceID !== 0) {
      assert(this.services({ address: recipient, id: serviceID }).exists, ERR_SERVICE_DOES_NOT_EXIST)
      const gateID = this.services({ address: recipient, id: serviceID }).value.gateID
      assert(gateID === 0, ERR_HAS_GATE)
    }

    this.createAsaSubscription(
      payment,
      assetXfer,
      recipient,
      amount,
      interval,
      serviceID
    )
  }

  deposit(payment: gtxn.PaymentTxn, id: SubscriptionID): void {
    const subKey = { address: new Address(Txn.sender), id }

    assert(this.subscriptions(subKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = clone(this.subscriptions(subKey).value)

    assert(sub.asset === 0, ERR_ASA_MISMATCH)

    assert(payment.receiver === Global.currentApplicationAddress, 'invalid payment receiver')

    const newEscrowedAmount: uint64 = sub.escrowed + payment.amount

    this.subscriptions(subKey).value = {
      ...this.subscriptions(subKey).value,
      escrowed: newEscrowedAmount
    }
  }

  depositAsa(assetXfer: gtxn.AssetTransferTxn, id: SubscriptionID): void {
    const subKey: SubscriptionKey = { address: new Address(Txn.sender), id }

    assert(this.subscriptions(subKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const { asset } = this.subscriptions(subKey).value

    assert(asset === assetXfer.xferAsset.id, ERR_ASA_MISMATCH)

    assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_ASSET_RECEIVER)

    this.subscriptions(subKey).value.escrowed += assetXfer.assetAmount
  }

  withdraw(id: SubscriptionID, amount: uint64): void {
    const subKey: SubscriptionKey = { address: new Address(Txn.sender), id }

    assert(this.subscriptions(subKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = clone(this.subscriptions(subKey).value)

    assert(sub.escrowed >= amount, ERR_NOT_ENOUGH_FUNDS)

    if (sub.asset !== 0) {
      itxn
        .assetTransfer({
          assetReceiver: Txn.sender,
          xferAsset: sub.asset,
          assetAmount: amount
        })
        .submit()
    } else {
      itxn
        .payment({
          receiver: Txn.sender,
          amount: amount
        })
        .submit()
    }

    const newEscrowAmount: uint64 = sub.escrowed - amount

    this.subscriptions(subKey).value = {
      ...this.subscriptions(subKey).value,
      escrowed: newEscrowAmount
    }
  }

  gatedTriggerPayment(gateTxn: gtxn.ApplicationCallTxn, address: Address, id: SubscriptionID): void {
    const subscriptionsKey: SubscriptionKey = { address, id }
    // ensure a subscription exists
    assert(this.subscriptions(subscriptionsKey).exists)

    const { serviceID, recipient } = this.subscriptions(subscriptionsKey).value

    assert(serviceID !== 0, ERR_NOT_A_SERVICE)
    assert(this.services({ address: recipient, id: serviceID }).exists, ERR_SERVICE_DOES_NOT_EXIST)
    const gateID = this.services({ address: recipient, id: serviceID }).value.gateID

    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    assert(gateCheck(gateTxn, this.akitaDAO.value, origin, gateID), ERR_FAILED_GATE)

    this.triggerPayment(address, id)
  }

  triggerPayment(address: Address, id: SubscriptionID): void {
    const subscriptionsKey: SubscriptionKey = { address, id }

    // ensure a subscription exists
    assert(this.subscriptions(subscriptionsKey).exists)

    const { recipient, serviceID, lastPayment, startDate, interval, escrowed, amount, gateID, asset } = this.subscriptions(subscriptionsKey).value

    const blocksKey: BlockListKey = {
      address: recipient.bytes.slice(0, 16).toFixed({ length: 16 }),
      blocked: address.bytes.slice(0, 16).toFixed({ length: 16 })
    }

    // ensure they are not blocked
    assert(!this.blocks(blocksKey).exists, ERR_BLOCKED)

    if (serviceID > 0) {
      const servicesKey: ServicesKey = { address: recipient, id: serviceID }
      // ensure the service isn't shutdown
      assert(this.services(servicesKey).value.status !== ServiceStatusShutdown, ERR_SERVICE_IS_SHUTDOWN)
    }

    // ensure that the current window has not already had a payment
    assert(
      lastPayment < this.getLatestWindowStart(startDate, interval),
      ERR_BAD_WINDOW
    )
    // ensure the user has enough funds in escrow
    assert(escrowed >= amount, ERR_NOT_ENOUGH_FUNDS)

    // assert(gateCall(this.akitaDAO.value, address.native, sub.gateID, args), ERR_FAILED_GATE)
    if (gateID !== 0) {
      assert(Txn.applicationArgs(0) === methodSelector(this.gatedTriggerPayment), ERR_HAS_GATE)
    }

    const isAsa = asset !== 0
    const amounts = this.getAmounts(amount)

    if (isAsa) {
      // we know the escrow will be opted in because it would be opted in
      // when the subscription was created
      itxn
        .assetTransfer({
          assetReceiver: this.akitaDAOEscrow.value.address,
          xferAsset: asset,
          assetAmount: amounts.akitaFee
        })
        .submit()

      itxn
        .assetTransfer({
          assetReceiver: Txn.sender,
          xferAsset: asset,
          assetAmount: amounts.triggerFee
        })
        .submit()

      itxn
        .assetTransfer({
          assetReceiver: recipient.native,
          xferAsset: asset,
          assetAmount: amounts.leftOver
        })
        .submit()
    } else {
      // mbr payment for subscriptions & subscriptionslist boxes
      itxn
        .payment({
          receiver: this.akitaDAOEscrow.value.address,
          amount: amounts.akitaFee
        })
        .submit()

      itxn
        .payment({
          receiver: Txn.sender,
          amount: amounts.triggerFee
        })
        .submit()

      itxn
        .payment({
          receiver: recipient.native,
          amount: amounts.leftOver
        })
        .submit()
    }

    this.updateStreak(address, id, 1)

    this.subscriptions(subscriptionsKey).value.escrowed -= amount
    this.subscriptions(subscriptionsKey).value.lastPayment = Global.latestTimestamp
  }

  streakCheck(sender: Address, id: SubscriptionID): void {
    this.updateStreak(sender, id, 0)
  }

  setPasses(id: SubscriptionID, addresses: Address[]): void {
    const arc4Sender = new Address(Txn.sender)
    const subscriptionsKey: SubscriptionKey = { address: arc4Sender, id }

    assert(this.subscriptions(subscriptionsKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const { serviceID, recipient } = clone(this.subscriptions(subscriptionsKey).value)

    assert(serviceID > 0, ERR_NO_DONATIONS)

    const serviceKey: ServicesKey = { address: recipient, id: serviceID }

    assert(this.services(serviceKey).exists, ERR_SERVICE_DOES_NOT_EXIST)

    const { status, passes } = this.services(serviceKey).value

    assert(status !== ServiceStatusShutdown, ERR_SERVICE_IS_SHUTDOWN)
    assert(passes >= addresses.length, ERR_PASS_COUNT_OVERFLOW)

    for (let i: uint64 = 0; i < addresses.length; i += 1) {
      const blockKey: BlockListKey = {
        address: recipient.bytes.slice(0, 16).toFixed({ length: 16 }),
        blocked: addresses[i].bytes.slice(0, 16).toFixed({ length: 16 }),
      }
      assert(!this.blocks(blockKey).exists, ERR_BLOCKED)
    }

    this.passes({ address: arc4Sender, id }).value = clone(addresses)
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  /**
   * isBlocked checks if an address is blocked for a merchant
   * @param merchant The merchant address to be checked
   * @param address The address to be checked
   */
  @abimethod({ readonly: true })
  isBlocked(address: Address, blocked: Address): boolean {
    return this.blocks({
      address: address.bytes.slice(0, 16).toFixed({ length: 16 }),
      blocked: blocked.bytes.slice(0, 16).toFixed({ length: 16 }),
    }).exists
  }

  /**
   * serviceIsActive checks if an service is shutdown
   */
  @abimethod({ readonly: true })
  isShutdown(address: Address, id: uint64): boolean {
    return this.services({ address, id }).value.status === ServiceStatusShutdown
  }

  @abimethod({ readonly: true })
  getService(address: Address, id: uint64): Service {
    const key: ServicesKey = { address, id }
    assert(this.services(key).exists, ERR_SERVICE_DOES_NOT_EXIST)
    return this.services(key).value
  }

  @abimethod({ readonly: true })
  getSubscription(address: Address, id: uint64): SubscriptionInfo {
    const key: SubscriptionKey = { address, id }
    assert(this.subscriptions(key).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)
    return this.subscriptions(key).value
  }

  @abimethod({ readonly: true })
  getSubscriptionInfo(address: Address, id: uint64): SubscriptionInfoWithPasses {
    const key = { address, id }

    assert(this.subscriptions(key).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = clone(this.subscriptions(key).value)

    const passesKey = { address, id }
    let passes: Address[] = []
    if (this.passes(passesKey).exists) {
      passes = [...passes, ...this.passes(passesKey).value]
    }

    return { ...sub, passes }
  }

  @abimethod({ readonly: true })
  isFirstSubscription(address: Address): boolean {
    return !this.subscriptionslist(address.native).exists
  }
}
