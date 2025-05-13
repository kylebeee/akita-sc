import {
  abimethod,
  Account,
  arc4,
  assert,
  assertMatch,
  BoxMap,
  Global,
  gtxn,
  itxn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { Txn } from '@algorandfoundation/algorand-typescript/op'
import { Address, decodeArc4, StaticBytes, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import {
  Addresses,
  Amounts,
  arc4BlockListKey,
  arc4PassesKey,
  arc4ServicesKey,
  arc4Service,
  arc4SubscriptionInfo,
  arc4SubscriptionKey,
  ServiceID,
  ServiceStatusActive,
  ServiceStatusPaused,
  ServiceStatusShutdown,
  Service,
  SubscriptionID,
  SubscriptionInfo,
  SubscriptionInfoWithPasses,
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
import { arc4Zero } from '../utils/constants'
import { ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER } from '../utils/errors'
import { GateArgs } from '../utils/types/gates'
import { bytes16, CID } from '../utils/types/base'
import { BaseSubscriptions } from './base'
import { calcPercent, gateCheck, getSubscriptionFees } from '../utils/functions'
import { ContractWithOptIn } from '../utils/base-contracts/optin'
import { classes } from 'polytype'
import { AkitaDAOEscrowAccountSubscriptions } from '../dao/constants'
import { AkitaBaseEscrow } from '../utils/base-contracts/base'

export class Subscriptions extends classes(
  BaseSubscriptions,
  AkitaBaseEscrow,
  ContractWithOptIn
) {

  // BOXES ----------------------------------------------------------------------------------------

  subscriptions = BoxMap<arc4SubscriptionKey, arc4SubscriptionInfo>({
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
  services = BoxMap<arc4ServicesKey, arc4Service>({ keyPrefix: SubscriptionsBoxPrefixServices })

  serviceslist = BoxMap<Account, uint64>({ keyPrefix: SubscriptionsBoxPrefixServicesList })

  /**
   * blocks allow merchants to specify which addresses cannot subscribe
   * key will be merchant address + blocked address
   * 32 + 32 = 64 bytes
   * 65 bytes total -> (2500 + (400 * 64)) = 0.028500
   */
  blocks = BoxMap<arc4BlockListKey, StaticBytes<0>>({ keyPrefix: SubscriptionsBoxPrefixBlocks })

  passes = BoxMap<arc4PassesKey, arc4.DynamicArray<Address>>({ keyPrefix: SubscriptionsBoxPrefixPasses })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private getLatestWindowStart(startDate: uint64, interval: uint64): uint64 {
    return Global.latestTimestamp - ((Global.latestTimestamp - startDate) % interval)
  }

  private updateStreak(address: Address, id: SubscriptionID, elseStreak: uint64): void {
    const subKey = new arc4SubscriptionKey({ address, id: new UintN64(id) })
    const sub = decodeArc4<SubscriptionInfo>(this.subscriptions(subKey).value.bytes)

    const currentWindowStart: uint64 = this.getLatestWindowStart(sub.startDate, sub.interval)
    const lastWindowStart: uint64 = currentWindowStart - sub.interval

    if (sub.lastPayment < lastWindowStart) {
      // reset the streak
      this.subscriptions(subKey).value.streak = new UintN64(elseStreak)
      return
    }

    // update the streak if this function is being called
    // after a payment was made in the last window
    // but not during the current window
    if (sub.lastPayment >= lastWindowStart && !(sub.lastPayment >= currentWindowStart)) {
      this.subscriptions(subKey).value.streak = new UintN64(sub.streak + 1)
    }
  }

  private getAmounts(amount: uint64): Amounts {
    const fees = getSubscriptionFees(this.akitaDAO.value)

    let akitaFee = calcPercent(amount, fees.paymentPercentage)
    if (akitaFee === 0 && amount > 0) {
      akitaFee = 1
    }

    let triggerFee = calcPercent(amount, fees.triggerPercentage)
    if (triggerFee === 0 && amount > 0) {
      triggerFee = 1
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

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------
  
  // TODO: create application
  
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
    gate: uint64,
    cid: CID
  ): uint64 {
    const address = new Address(Txn.sender)
    const id = this.newServiceID(address)
    const boxKey = new arc4ServicesKey({ address, id: new UintN64(id) })

    // ensure the amount is enough to take fees on
    assert(amount > 3, ERR_MIN_AMOUNT_IS_THREE)
    // ensure payouts cant be too fast
    assert(interval >= 60, ERR_MIN_INTERVAL_IS_SIXTY)
    // family passes have a max of 5
    assert(passes <= 5, ERR_MAX_PASSES_IS_FIVE)

    const fee = getSubscriptionFees(this.akitaDAO.value).serviceCreationFee

    let requiredAmount = fee
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

    this.services(boxKey).value = new arc4Service({
      status: ServiceStatusPaused,
      interval: new UintN64(interval),
      asset: new UintN64(asset),
      amount: new UintN64(amount),
      passes: new UintN64(passes),
      gate: new UintN64(gate),
      cid: cid,
    })

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
    const boxKey = new arc4ServicesKey({ address: new Address(Txn.sender), id: new UintN64(id) })
    // ensure were not using zero as a box index
    // zero is reserved for non-service based subscriptions
    assert(id > 0, ERR_SERVICE_INDEX_MUST_BE_ABOVE_ZERO)
    // ensure the box exists
    assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST)
    // ensure the service isn't already shutdown
    assert(this.services(boxKey).value.status === ServiceStatusActive, ERR_SERVICE_IS_NOT_ACTIVE)

    this.services(boxKey).value.status = ServiceStatusPaused
  }

  /**
   * activateService activates an service for a merchant
   *
   * @param index The index of the box to be used for the subscription
   */
  activateService(id: ServiceID): void {
    const boxKey = new arc4ServicesKey({ address: new Address(Txn.sender), id: new UintN64(id) })

    // ensure the box exists
    assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST)
    // ensure the service is currently paused
    assert(this.services(boxKey).value.status === ServiceStatusPaused, ERR_SERVICE_IS_NOT_PAUSED)

    this.services(boxKey).value.status = ServiceStatusActive
  }

  /**
   * shutdownService permanently shuts down an service for a merchant
   * it also shutsdown pre-existing subscriptions
   * @param index The index of the box to be used for the subscription
   */
  shutdownService(id: ServiceID): void {
    const boxKey = new arc4ServicesKey({ address: new Address(Txn.sender), id: new UintN64(id) })
    // ensure the box exists
    assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST)
    // ensure the service isn't already shutdown
    assert(this.services(boxKey).value.status !== ServiceStatusShutdown, ERR_SERVICE_IS_SHUTDOWN)

    this.services(boxKey).value.status = ServiceStatusShutdown
  }

  /**
   * block blacklists an address for a merchant
   * @param payment The payment to cover mbr for blocking
   * @param blocked The address to be blocked
   */
  block(payment: gtxn.PaymentTxn, blocked: Address): void {
    const boxKey = new arc4BlockListKey({ address: bytes16(Txn.sender.bytes), blocked: bytes16(blocked.bytes) })

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
    const boxKey = new arc4BlockListKey({ address: bytes16(Txn.sender.bytes), blocked: bytes16(blocked.bytes) })

    // ensure that the address is currently blocked
    assert(this.blocks(boxKey).exists, ERR_USER_NOT_BLOCKED)

    this.blocks(boxKey).delete()

    const costs = this.mbr(0)

    itxn.payment({
      receiver: Txn.sender,
      amount: costs.blocks,
      fee: 0,
    }).submit()
  }

  subscribe(
    payment: gtxn.PaymentTxn,
    recipient: Address,
    amount: uint64,
    interval: uint64,
    serviceID: ServiceID,
    args: GateArgs
  ): void {
    // ensure the amount is enough to take fees on
    assert(amount >= 3, ERR_MIN_AMOUNT_IS_THREE)
    // ensure payouts cant be too fast
    assert(interval >= 60, ERR_MIN_INTERVAL_IS_SIXTY)

    const arc4Sender = new Address(Txn.sender)
    const blocksKey = new arc4BlockListKey({ address: bytes16(recipient.bytes), blocked: bytes16(Txn.sender.bytes) })
    // ensure they aren't blocked
    assert(!this.blocks(blocksKey).exists, ERR_BLOCKED)
    // gate is zero unless the service has a gate
    let gate: uint64 = 0
    // index zero is always reserved for donations
    const isDonation = serviceID === 0
    if (!isDonation) {
      const boxKey = new arc4ServicesKey({ address: recipient, id: new UintN64(serviceID) })
      // ensure the service exists
      assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST)
      // get the service details
      const service = decodeArc4<Service>(this.services(boxKey).value.bytes)
      // ensure the service is active
      assert(service.status === ServiceStatusActive, ERR_SERVICE_IS_NOT_ACTIVE)
      // ensure its an algo subscription
      assert(service.asset === 0, ERR_ASA_MISMATCH)
      // ensure the gate check passes
      assert(gateCheck(this.akitaDAO.value, arc4Sender, service.gate, args), ERR_FAILED_GATE)
      // overwrite the details for the subscription
      amount = service.amount
      interval = service.interval
      gate = service.gate
    }

    const subscriptionID = this.newSubscriptionID(arc4Sender)
    const subscriptionKey = new arc4SubscriptionKey({ address: arc4Sender, id: new UintN64(subscriptionID) })

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
      receiver: this.akitaDAO.value.address,
      amount: amounts.akitaFee + amounts.triggerFee,
      fee: 0,
    })
    .submit()

    itxn
    .payment({
      receiver: recipient.native,
      amount: amounts.leftOver,
      fee: 0,
    })
    .submit()

    // amounts.leftOver is the send amount after fees
    // payment.amount should be allowed to be over if
    // the user wants to provide some assets for the escrow
    // at the same time as they are subscribing
    const paymentDifference = new UintN64(payment.amount - amounts.leftOver)
    const arc4LatestTimestamp = new UintN64(Global.latestTimestamp)

    this.subscriptions(subscriptionKey).value = new arc4SubscriptionInfo({
      recipient: recipient,
      serviceID: new UintN64(serviceID),
      startDate: arc4LatestTimestamp,
      amount: new UintN64(amount),
      interval: new UintN64(interval),
      asset: arc4Zero,
      gate: new UintN64(gate),
      lastPayment: arc4LatestTimestamp,
      streak: new UintN64(1),
      escrowed: paymentDifference,
    })
  }

  subscribeAsa(
    payment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    recipient: Address,
    amount: uint64,
    interval: uint64,
    serviceID: ServiceID,
    args: GateArgs
  ): void {
    // ensure the amount is enough to take fees on
    assert(amount > 3, ERR_MIN_AMOUNT_IS_THREE)
    // ensure payouts cant be too fast
    assert(interval >= 60, ERR_MIN_INTERVAL_IS_SIXTY)

    const arc4Sender = new Address(Txn.sender)
    const blocksKey = new arc4BlockListKey({ address: bytes16(recipient.bytes), blocked: bytes16(Txn.sender.bytes) })
    // ensure they aren't blocked
    assert(!this.blocks(blocksKey).exists, ERR_BLOCKED)
    // gate is zero unless the service has a gate
    let gate: uint64 = 0
    // index zero is always reserved for donations
    const isDonation = serviceID === 0
    if (!isDonation) {
      const boxKey = new arc4ServicesKey({ address: recipient, id: new UintN64(serviceID) })
      // ensure the service exists
      assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST)
      // get the service details
      const service = decodeArc4<Service>(this.services(boxKey).value.bytes)
      // ensure the service is active
      assert(service.status === ServiceStatusActive, ERR_SERVICE_IS_NOT_ACTIVE)
      // ensure its an algo subscription
      assert(service.asset === assetXfer.xferAsset.id, ERR_ASA_MISMATCH)
      // ensure the gate check passes
      assert(gateCheck(this.akitaDAO.value, arc4Sender, service.gate, args), ERR_FAILED_GATE)
      // overwrite the details for the subscription
      amount = service.amount
      interval = service.interval
      gate = service.gate
    }

    const subscriptionID = this.newSubscriptionID(arc4Sender)
    const subscriptionKey = new arc4SubscriptionKey({ address: arc4Sender, id: new UintN64(subscriptionID) })

    const costs = this.mbr(0)
    let mbrAmount = costs.subscriptions
    if (subscriptionID === 1) {
      mbrAmount += costs.subscriptionslist
    }

    if (!this.akitaDAO.value.address.isOptedIn(assetXfer.xferAsset)) {
      this.optAkitaEscrowInAndSend(
        AkitaDAOEscrowAccountSubscriptions,
        assetXfer.xferAsset,
        0
      )
      mbrAmount += Global.assetOptInMinBalance
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
        assetAmount: amounts.akitaFee + amounts.triggerFee,
        fee: 0,
      })
      .submit()

    itxn
      .assetTransfer({
        assetReceiver: recipient.native,
        xferAsset: assetXfer.xferAsset,
        assetAmount: amounts.leftOver,
        fee: 0,
      })
      .submit()

    // amounts.leftOver is the send amount after fees
    // payment.amount should be allowed to be over if
    // the user wants to provide some assets for the escrow
    // at the same time as they are subscribing
    const paymentDifference = new UintN64(payment.amount - amounts.leftOver)
    const arc4LatestTimestamp = new UintN64(Global.latestTimestamp)

    this.subscriptions(subscriptionKey).value = new arc4SubscriptionInfo({
      recipient: recipient,
      serviceID: new UintN64(serviceID),
      startDate: arc4LatestTimestamp,
      amount: new UintN64(amount),
      interval: new UintN64(interval),
      asset: new UintN64(assetXfer.xferAsset.id),
      gate: new UintN64(gate),
      lastPayment: arc4LatestTimestamp,
      streak: new UintN64(1),
      escrowed: paymentDifference,
    })
  }

  deposit(payment: gtxn.PaymentTxn, id: SubscriptionID): void {
    const subKey = new arc4SubscriptionKey({ address: new Address(Txn.sender), id: new UintN64(id) })

    assert(this.subscriptions(subKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = decodeArc4<SubscriptionInfo>(this.subscriptions(subKey).value.bytes)

    assert(sub.asset === 0, ERR_ASA_MISMATCH)

    assert(payment.receiver === Global.currentApplicationAddress, 'invalid payment receiver')

    const newEscrowedAmount: uint64 = sub.escrowed + payment.amount

    this.subscriptions(subKey).value.escrowed = new UintN64(newEscrowedAmount)
  }

  depositAsa(assetXfer: gtxn.AssetTransferTxn, id: SubscriptionID): void {
    const subKey = new arc4SubscriptionKey({ address: new Address(Txn.sender), id: new UintN64(id) })

    assert(this.subscriptions(subKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = decodeArc4<SubscriptionInfo>(this.subscriptions(subKey).value.bytes)

    assert(sub.asset === assetXfer.xferAsset.id, ERR_ASA_MISMATCH)

    assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_ASSET_RECEIVER)

    const newEscrowedAmount: uint64 = sub.escrowed + assetXfer.assetAmount

    this.subscriptions(subKey).value.escrowed = new UintN64(newEscrowedAmount)
  }

  withdraw(id: SubscriptionID, amount: uint64): void {
    const subKey = new arc4SubscriptionKey({ address: new Address(Txn.sender), id: new UintN64(id) })

    assert(this.subscriptions(subKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = decodeArc4<SubscriptionInfo>(this.subscriptions(subKey).value.bytes)

    assert(sub.escrowed >= amount, ERR_NOT_ENOUGH_FUNDS)

    if (sub.asset !== 0) {
      itxn.assetTransfer({
        assetReceiver: Txn.sender,
        xferAsset: sub.asset,
        assetAmount: amount,
        fee: 0,
      }).submit()
    } else {
      itxn.payment({
        receiver: Txn.sender,
        amount: amount,
        fee: 0,
      }).submit()
    }

    const newEscrowAmount = new UintN64(sub.escrowed - amount)
    this.subscriptions(subKey).value.escrowed = newEscrowAmount
  }

  triggerPayment(address: Address, id: SubscriptionID, args: GateArgs): void {
    const subscriptionsKey = new arc4SubscriptionKey({ address, id: new UintN64(id) })

    // ensure a subscription exists
    assert(this.subscriptions(subscriptionsKey).exists)

    const sub = decodeArc4<SubscriptionInfo>(this.subscriptions(subscriptionsKey).value.bytes)

    const blocksKey = new arc4BlockListKey({ address: bytes16(sub.recipient.bytes), blocked: bytes16(address.bytes) })

    // ensure they are not blocked
    assert(!this.blocks(blocksKey).exists, ERR_BLOCKED)

    if (sub.serviceID > 0) {
      const servicesKey = new arc4ServicesKey({ address: sub.recipient, id: new UintN64(sub.serviceID) })
      // ensure the service isn't shutdown
      assert(this.services(servicesKey).value.status !== ServiceStatusShutdown, ERR_SERVICE_IS_SHUTDOWN)
    }

    // ensure that the current window has not already had a payment
    assert(
      sub.lastPayment < this.getLatestWindowStart(sub.startDate, sub.interval),
      ERR_BAD_WINDOW
    )
    // ensure the user has enough funds in escrow
    assert(sub.escrowed >= sub.amount, ERR_NOT_ENOUGH_FUNDS)

    assert(gateCheck(this.akitaDAO.value, address, sub.gate, args), ERR_FAILED_GATE)

    const isAsa = sub.asset !== 0
    const amounts = this.getAmounts(sub.amount)

    if (isAsa) {
      itxn.assetTransfer({
        assetReceiver: this.akitaDAOEscrow.value.address,
        xferAsset: sub.asset,
        assetAmount: amounts.akitaFee,
        fee: 0,
      }).submit()

      itxn.assetTransfer({
        assetReceiver: Txn.sender,
        xferAsset: sub.asset,
        assetAmount: amounts.triggerFee,
        fee: 0,
      }).submit()

      itxn.assetTransfer({
        assetReceiver: sub.recipient.native,
        xferAsset: sub.asset,
        assetAmount: amounts.leftOver,
        fee: 0,
      }).submit()
    } else {
      // mbr payment for subscriptions & subscriptionslist boxes
      itxn.payment({
        receiver: this.akitaDAO.value.address,
        amount: amounts.akitaFee,
        fee: 0,
      }).submit()

      itxn.payment({
        receiver: Txn.sender,
        amount: amounts.triggerFee,
        fee: 0,
      }).submit()

      itxn.payment({
        receiver: sub.recipient.native,
        amount: amounts.leftOver,
        fee: 0,
      }).submit()
    }

    this.updateStreak(address, id, 1)
    const newEscrowedAmount = new UintN64(sub.escrowed - sub.amount)
    this.subscriptions(subscriptionsKey).value.escrowed = newEscrowedAmount
    const arc4LatestTimestamp = new UintN64(Global.latestTimestamp)
    this.subscriptions(subscriptionsKey).value.lastPayment = arc4LatestTimestamp
  }

  streakCheck(sender: Address, id: SubscriptionID): void {
    this.updateStreak(sender, id, 0)
  }

  setPasses(id: SubscriptionID, addresses: Addresses): void {
    const arc4Sender = new Address(Txn.sender)
    const subscriptionsKey = new arc4SubscriptionKey({ address: arc4Sender, id: new UintN64(id) })

    assert(this.subscriptions(subscriptionsKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = decodeArc4<SubscriptionInfo>(this.subscriptions(subscriptionsKey).value.bytes)

    assert(sub.serviceID > 0, ERR_NO_DONATIONS)

    const serviceKey = new arc4ServicesKey({ address: sub.recipient, id: new UintN64(sub.serviceID) })

    assert(this.services(serviceKey).exists, ERR_SERVICE_DOES_NOT_EXIST)

    const service = decodeArc4<Service>(this.services(serviceKey).value.bytes)

    assert(service.status !== ServiceStatusShutdown, ERR_SERVICE_IS_SHUTDOWN)
    assert(service.passes >= addresses.length, ERR_PASS_COUNT_OVERFLOW)

    for (let i: uint64 = 0; i < addresses.length; i += 1) {
      const blockKey = new arc4BlockListKey({
        address: bytes16(sub.recipient.bytes),
        blocked: bytes16(addresses[i].bytes)
      })
      assert(
        !this.blocks(blockKey).exists,
        ERR_BLOCKED
      )
    }

    this.passes(new arc4PassesKey({ address: arc4Sender, id: new UintN64(id) })).value = addresses
  }

    // READ ONLY METHODS ----------------------------------------------------------------------------

  /**
   * isBlocked checks if an address is blocked for a merchant
   * @param merchant The merchant address to be checked
   * @param address The address to be checked
   */
  @abimethod({ readonly: true })
  isBlocked(address: Address, blocked: Address): boolean {
    return this.blocks(new arc4BlockListKey({ address: bytes16(address.bytes), blocked: bytes16(blocked.bytes) })).exists
  }

  /**
   * serviceIsActive checks if an service is shutdown
   */
  @abimethod({ readonly: true })
  isShutdown(address: Address, id: uint64): boolean {
    return this.services(new arc4ServicesKey({ address, id: new UintN64(id) })).value.status === ServiceStatusShutdown
  }

  @abimethod({ readonly: true })
  getSubscriptionInfo(address: Address, id: uint64): SubscriptionInfoWithPasses {
    const key = new arc4SubscriptionKey({ address, id: new UintN64(id) })

    assert(this.subscriptions(key).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = decodeArc4<SubscriptionInfo>(this.subscriptions(key).value.bytes)

    const passesKey = new arc4PassesKey({ address, id: new UintN64(id) })
    let passes = new arc4.DynamicArray<Address>()
    if (this.passes(passesKey).exists) {
      passes = this.passes(passesKey).value.copy()
    }

    return {
      ...sub,
      passes: passes.copy(),
    }
  }

  @abimethod({ readonly: true })
  isFirstSubscription(address: Address): boolean {
    return !this.subscriptionslist(address.native).exists
  }
}
