import {
  abimethod,
  Account,
  Application,
  assert,
  assertMatch,
  Asset,
  BoxMap,
  Bytes,
  bytes,
  clone,
  Global,
  gtxn,
  itxn,
  OnCompleteAction,
  op,
  TransactionType,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { methodSelector, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { Txn } from '@algorandfoundation/algorand-typescript/op'
import { classes } from 'polytype'
import { AkitaDAOEscrowAccountSubscriptions } from '../arc58/dao/constants'
import { ERR_HAS_GATE } from '../social/errors'
import { ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER } from '../utils/errors'
import { calcPercent, gateCheck, getSubscriptionFees, getWalletIDUsingAkitaDAO, originOrTxnSender, referralFee, sendReferralPayment } from '../utils/functions'
import { CID } from '../utils/types/base'
import {
  HighlightMessageNone,
  MAX_DESCRIPTION_CHUNK_SIZE,
  MAX_DESCRIPTION_LENGTH,
  MAX_PASSES,
  MAX_TITLE_LENGTH,
  MIN_AMOUNT,
  MIN_INTERVAL,
  SubscriptionsBoxPrefixBlocks,
  SubscriptionsBoxPrefixPasses,
  SubscriptionsBoxPrefixServices,
  SubscriptionsBoxPrefixServicesList,
  SubscriptionsBoxPrefixSubscriptions,
  SubscriptionsBoxPrefixSubscriptionsList,
} from './constants'
import {
  ERR_ASA_MISMATCH,
  ERR_BAD_DESCRIPTION_LENGTH,
  ERR_BAD_OFFSET,
  ERR_BLOCKED,
  ERR_CANNOT_TRIGGER,
  ERR_FAILED_GATE,
  ERR_GROUP_INDEX_OUT_OF_BOUNDS,
  ERR_INVALID_ASSET_RECEIVER,
  ERR_INVALID_SEQUENCE,
  ERR_MAX_PASSES_IS_FIVE,
  ERR_MIN_AMOUNT_IS_THREE,
  ERR_MIN_INTERVAL_IS_SIXTY,
  ERR_NO_DONATIONS,
  ERR_NOT_A_SERVICE,
  ERR_NOT_ENOUGH_FUNDS,
  ERR_NOT_OPTED_IN,
  ERR_PASS_COUNT_OVERFLOW,
  ERR_SERVICE_DOES_NOT_EXIST,
  ERR_SERVICE_IS_NOT_ACTIVE,
  ERR_SERVICE_IS_NOT_DRAFT,
  ERR_SERVICE_IS_NOT_PAUSED,
  ERR_SERVICE_IS_SHUTDOWN,
  ERR_SERVICE_NOT_ACTIVATED,
  ERR_SUBSCRIPTION_DOES_NOT_EXIST,
  ERR_TITLE_TOO_LONG,
  ERR_USER_ALREADY_BLOCKED,
  ERR_USER_NOT_BLOCKED,
} from './errors'
import {
  Amounts,
  BlockListKey,
  Service,
  ServiceID,
  ServicesKey,
  ServiceStatus,
  ServiceStatusActive,
  ServiceStatusDraft,
  ServiceStatusNone,
  ServiceStatusPaused,
  ServiceStatusShutdown,
  SubscriptionID,
  SubscriptionInfo,
  SubscriptionInfoWithDetails,
  SubscriptionKey,
  TriggerListRequest
} from './types'

// CONTRACT IMPORTS
import { AkitaBaseFeeGeneratorContract } from '../utils/base-contracts/base'
import { ContractWithOptIn } from '../utils/base-contracts/optin'
import { BaseSubscriptions } from './base'

export class Subscriptions extends classes(
  BaseSubscriptions,
  AkitaBaseFeeGeneratorContract,
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

  passes = BoxMap<SubscriptionKey, Account[]>({ keyPrefix: SubscriptionsBoxPrefixPasses })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private getLatestWindowStart(startDate: uint64, interval: uint64): uint64 {
    return Global.latestTimestamp - ((Global.latestTimestamp - startDate) % interval)
  }

  private getBlockKey(address: Account, blocked: Account): BlockListKey {
    return {
      address: address.bytes.slice(0, 16).toFixed({ length: 16 }),
      blocked: blocked.bytes.slice(0, 16).toFixed({ length: 16 }),
    }
  }

  private updateStreak(key: SubscriptionKey, elseStreak: uint64): void {
    const sub = clone(this.subscriptions(key).value)

    const currentWindowStart: uint64 = this.getLatestWindowStart(sub.startDate, sub.interval)
    const lastWindowStart: uint64 = currentWindowStart - sub.interval

    if (sub.lastPayment < lastWindowStart) {
      // reset the streak
      this.subscriptions(key).value.streak = elseStreak
      return
    }

    // update the streak if this function is being called
    // after a payment was made in the last window
    // but not during the current window
    if (sub.lastPayment >= lastWindowStart && !(sub.lastPayment >= currentWindowStart)) {
      this.subscriptions(key).value.streak += 1
    }
  }

  private getAmounts(amount: uint64): Amounts {
    const fees = getSubscriptionFees(this.akitaDAO.value)

    let akitaFee: uint64 = 0
    if (fees.paymentPercentage > 0) {
      akitaFee = calcPercent(amount, fees.paymentPercentage)
      if (akitaFee === 0 && amount > 0) {
        akitaFee = 2
      }
    }

    let triggerFee: uint64 = 0
    if (fees.triggerPercentage > 0) {
      triggerFee = calcPercent(amount, fees.triggerPercentage)
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

  private newServiceID(address: Account): ServiceID {
    const id: uint64 = this.serviceslist(address).exists
      ? this.serviceslist(address).value
      : 1
    this.serviceslist(address).value = id + 1
    return id
  }

  private newSubscriptionID(address: Account): SubscriptionID {
    const id: uint64 = this.subscriptionslist(address).exists
      ? this.subscriptionslist(address).value
      : 1
    this.subscriptionslist(address).value = id + 1
    return id
  }

  private createSubscription(
    payment: gtxn.PaymentTxn,
    recipient: Account,
    amount: uint64,
    interval: uint64,
    serviceID: ServiceID
  ): uint64 {
    const blocksKey = this.getBlockKey(recipient, Txn.sender)
    // ensure they aren't blocked
    assert(!this.blocks(blocksKey).exists, ERR_BLOCKED)
    // gate is zero unless the service has a gate
    let gateID: uint64 = 0

    let costs = this.mbr()
    let mbrAmount = costs.subscriptions
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

      if (service.passes > 0) {
        mbrAmount += costs.passes
      }
    }

    const subscriptionID = this.newSubscriptionID(Txn.sender)
    const subscriptionKey: SubscriptionKey = { address: Txn.sender, id: subscriptionID }
    if (subscriptionID === 0) {
      mbrAmount += costs.subscriptionslist
    }

    const amounts = this.getAmounts(amount)
    const akitaFees: uint64 = amounts.akitaFee + amounts.triggerFee
    const { leftover, referralMbr } = sendReferralPayment(this.akitaDAO.value, 0, akitaFees)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: {
          greaterThanEq: (amount + mbrAmount + referralMbr)
        },
      },
      ERR_INVALID_PAYMENT
    )

    itxn
      .payment({
        receiver: this.akitaDAOEscrow.value.address,
        amount: leftover,
      })
      .submit()

    itxn
      .payment({
        receiver: recipient,
        amount: amounts.leftOver
      })
      .submit()

    // amounts.leftOver is the send amount after fees
    // payment.amount should be allowed to be over if
    // the user wants to provide some assets for the escrow
    // at the same time as they are subscribing
    const paymentDifference: uint64 = payment.amount - (amount + mbrAmount + referralMbr)

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

    return subscriptionID
  }

  private createAsaSubscription(
    mbrPayment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    recipient: Account,
    amount: uint64,
    interval: uint64,
    serviceID: ServiceID,
  ): uint64 {
    const blocksKey = this.getBlockKey(recipient, Txn.sender)
    // ensure they aren't blocked
    assert(!this.blocks(blocksKey).exists, ERR_BLOCKED)
    // gate is zero unless the service has a gate
    let gateID: uint64 = 0

    const costs = this.mbr()
    let mbrAmount = costs.subscriptions
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

      if (service.passes > 0) {
        mbrAmount += costs.passes
      }
    }

    const subscriptionID = this.newSubscriptionID(Txn.sender)
    const subscriptionKey = { address: Txn.sender, id: subscriptionID }

    if (subscriptionID === 0) {
      mbrAmount += costs.subscriptionslist
    }

    const amounts = this.getAmounts(amount)
    const akitaFees: uint64 = amounts.akitaFee + amounts.triggerFee
    const { leftover, referralMbr } = sendReferralPayment(this.akitaDAO.value, assetXfer.xferAsset.id, akitaFees)

    if (!this.akitaDAOEscrow.value.address.isOptedIn(assetXfer.xferAsset)) {
      this.optAkitaEscrowInAndSend(
        AkitaDAOEscrowAccountSubscriptions,
        assetXfer.xferAsset,
        leftover
      )
      mbrAmount += Global.assetOptInMinBalance
    } else {
      itxn
        .assetTransfer({
          assetReceiver: this.akitaDAOEscrow.value.address,
          xferAsset: assetXfer.xferAsset,
          assetAmount: leftover
        })
        .submit()
    }

    // mbr payment checks
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: mbrAmount + referralMbr,
      },
      ERR_INVALID_PAYMENT
    )

    // asset transfer checks
    assertMatch(
      assetXfer,
      {
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: {
          greaterThanEq: amount,
        }
      },
      ERR_INVALID_TRANSFER
    )

    itxn
      .assetTransfer({
        assetReceiver: recipient,
        xferAsset: assetXfer.xferAsset,
        assetAmount: amounts.leftOver
      })
      .submit()

    // amounts.leftOver is the send amount after fees
    // payment.amount should be allowed to be over if
    // the user wants to provide some assets for the escrow
    // at the same time as they are subscribing
    const paymentDifference: uint64 = assetXfer.assetAmount - amount

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

    return subscriptionID
  }

  private canTrigger(key: SubscriptionKey): boolean {
    if (!this.subscriptions(key).exists) {
      return false
    }

    const {
      recipient,
      serviceID,
      lastPayment,
      startDate,
      interval,
      escrowed,
      amount
    } = this.subscriptions(key).value

    const blocksKey = this.getBlockKey(recipient, key.address)

    // ensure they are not blocked
    if (this.blocks(blocksKey).exists) {
      return false
    }

    // ensure the service exists & isn't shutdown
    if (
      serviceID > 0 &&
      (
        !this.services({ address: recipient, id: serviceID }).exists ||
        this.services({ address: recipient, id: serviceID }).value.status === ServiceStatusShutdown
      )
    ) {
      return false
    }

    // ensure that the current window has not already had a payment
    if (lastPayment >= this.getLatestWindowStart(startDate, interval)) {
      return false
    }

    if (amount > escrowed) {
      return false
    }

    return true
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: Application, akitaDAOEscrow: Application): void {
    this.version.value = version
    this.akitaDAO.value = akitaDAO
    this.akitaDAOEscrow.value = akitaDAOEscrow
  }

  // SUBSCRIPTION METHODS -------------------------------------------------------------------------

  private verifyServiceActivation(): void {
    let activated = false
    for (let i: uint64 = (Txn.groupIndex + 1); i < Global.groupSize; i += 1) {
      const txn = gtxn.Transaction(i)
      
      if (txn.type !== TransactionType.ApplicationCall) {
        continue
      }

      assert(txn.appId === Global.currentApplicationId, ERR_INVALID_SEQUENCE)
      assert(txn.onCompletion === OnCompleteAction.NoOp, ERR_INVALID_SEQUENCE)

      if (txn.appArgs(0) === methodSelector(this.activateService)) {
        activated = true
        break
      }

      assert(txn.appArgs(0) === methodSelector(this.setServiceDescription), ERR_INVALID_SEQUENCE)
    }

    assert(activated, ERR_SERVICE_NOT_ACTIVATED)
  }

  /**
   * newService creates a new service for a merchant
   * @param payment The payment for the service creation
   * @param interval The interval in seconds
   * @param asset The asa to be used for the subscription
   * @param amount The amount of the asa to be used for the subscription
   * @param passes The number of accounts the subscription can be shared with
   * @param gate The gate to be used for the subscription
   * @param 
   * or upgrade the subscription to a different service from the user without losing their streak
   */
  newService(
    payment: gtxn.PaymentTxn,
    interval: uint64,
    asset: uint64,
    amount: uint64,
    passes: uint64,
    gateID: uint64,
    title: string,
    bannerImage: CID,
    highlightMessage: Uint8,
    highlightColor: bytes<3>
  ): uint64 {
    const id = this.newServiceID(Txn.sender)
    const boxKey: ServicesKey = { address: Txn.sender, id }

    // ensure the amount is enough to take fees on
    assert(amount >= MIN_AMOUNT, ERR_MIN_AMOUNT_IS_THREE)
    // ensure payouts cant be too fast
    assert(interval >= MIN_INTERVAL, ERR_MIN_INTERVAL_IS_SIXTY)
    // family passes have a max of 5
    assert(passes <= MAX_PASSES, ERR_MAX_PASSES_IS_FIVE)
    assert(Bytes(title).length <= MAX_TITLE_LENGTH, ERR_TITLE_TOO_LONG)

    const serviceCreationFee = getSubscriptionFees(this.akitaDAO.value).serviceCreationFee
    const costs = this.mbr()

    let requiredAmount: uint64 = serviceCreationFee + costs.services
    if (asset !== 0) {
      assert(Global.currentApplicationAddress.isOptedIn(Asset(asset)), ERR_NOT_OPTED_IN)

      if (!this.akitaDAOEscrow.value.address.isOptedIn(Asset(asset))) {
        requiredAmount += Global.assetOptInMinBalance
        this.optAkitaEscrowInAndSend(AkitaDAOEscrowAccountSubscriptions, Asset(asset), 0)
      }
    }

    const { leftover, referralMbr } = sendReferralPayment(this.akitaDAO.value, asset, serviceCreationFee)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: requiredAmount + referralMbr,
      },
      ERR_INVALID_PAYMENT
    )

    itxn
      .payment({
        receiver: this.akitaDAOEscrow.value.address,
        amount: leftover
      })
      .submit()

    this.services(boxKey).value = {
      status: ServiceStatusDraft,
      interval,
      asset,
      amount,
      passes,
      gateID,
      title,
      description: '',
      bannerImage,
      highlightMessage,
      highlightColor
    }

    this.verifyServiceActivation()

    return id
  }

  setServiceDescription(offset: uint64, data: bytes): void {
    assert(Txn.groupIndex > 0, ERR_GROUP_INDEX_OUT_OF_BOUNDS)
    const previousCalls: uint64 = offset / MAX_DESCRIPTION_CHUNK_SIZE
    const newServiceTxnIndex: uint64 = Txn.groupIndex - 1 - previousCalls
    const txn = gtxn.Transaction(newServiceTxnIndex)
    // force the call to be after newService
    assert(
      txn.type === TransactionType.ApplicationCall &&
      txn.appId === Global.currentApplicationId &&
      txn.onCompletion === OnCompleteAction.NoOp &&
      txn.appArgs(0) === methodSelector(this.newService),
      ERR_INVALID_SEQUENCE
    )

    const id: uint64 = this.serviceslist(Txn.sender).value - 1
    const key: ServicesKey = { address: Txn.sender, id }

    assert(this.services(key).exists, ERR_SERVICE_DOES_NOT_EXIST)
    assert(this.services(key).value.status === ServiceStatusDraft, ERR_SERVICE_IS_NOT_DRAFT)
    assert(offset + data.length <= MAX_DESCRIPTION_LENGTH, ERR_BAD_DESCRIPTION_LENGTH)

    let descBytes = Bytes(this.services(key).value.description)

    assert(offset <= descBytes.length, ERR_BAD_OFFSET)

    if (offset < descBytes.length) {
      descBytes = descBytes.slice(0, offset)
    }

    this.services(key).value.description = String(descBytes.concat(data))
  }

  /**
   * activateService activates an service for a merchant
   */
  activateService(): void {
    const id: uint64 = this.serviceslist(Txn.sender).value - 1

    const boxKey: ServicesKey = { address: Txn.sender, id }

    assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST)
    assert(this.services(boxKey).value.status === ServiceStatusDraft, ERR_SERVICE_IS_NOT_DRAFT)

    this.services(boxKey).value.status = ServiceStatusActive
  }

  /**
   * pauseService pauses a service for a merchant
   * it does not shutdown pre-existing subscriptions
   * it simply prevents new subscriptions from being created
   * for a specific service
   * @param index The index of the box to be used for the subscription
   */
  pauseService(id: ServiceID): void {
    const boxKey: ServicesKey = { address: Txn.sender, id }
    // ensure the box exists
    assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST)
    // ensure the service is active
    assert(this.services(boxKey).value.status === ServiceStatusActive, ERR_SERVICE_IS_NOT_ACTIVE)

    this.services(boxKey).value.status = ServiceStatusPaused
  }

  /**
   * unpauseService activates an service for a merchant
   *
   * @param index The index of the box to be used for the subscription
   */
  unpauseService(id: ServiceID): void {
    const boxKey: ServicesKey = { address: Txn.sender, id }

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
    const boxKey: ServicesKey = { address: Txn.sender, id }
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
  block(payment: gtxn.PaymentTxn, blocked: Account): void {
    // const origin = getOrigin(spending)
    const boxKey = this.getBlockKey(Txn.sender, blocked)

    // ensure the address is not already blocked
    assert(!this.blocks(boxKey).exists, ERR_USER_ALREADY_BLOCKED)
    // ensure the payment is correct
    const costs = this.mbr()
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
  unblock(blocked: Account): void {
    const boxKey = this.getBlockKey(Txn.sender, blocked)

    // ensure that the address is currently blocked
    assert(this.blocks(boxKey).exists, ERR_USER_NOT_BLOCKED)

    this.blocks(boxKey).delete()

    const costs = this.mbr()

    itxn.payment({
      receiver: Txn.sender,
      amount: costs.blocks
    }).submit()
  }

  gatedSubscribe(
    payment: gtxn.PaymentTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    recipient: Account,
    amount: uint64,
    interval: uint64,
    serviceID: ServiceID,
  ): uint64 {
    // ensure the amount is enough to take fees on
    assert(amount >= MIN_AMOUNT, ERR_MIN_AMOUNT_IS_THREE)
    // ensure payouts cant be too fast
    assert(interval >= MIN_INTERVAL, ERR_MIN_INTERVAL_IS_SIXTY)

    assert(serviceID !== 0, ERR_NOT_A_SERVICE)
    assert(this.services({ address: recipient, id: serviceID }).exists, ERR_SERVICE_DOES_NOT_EXIST)
    const gateID = this.services({ address: recipient, id: serviceID }).value.gateID

    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    assert(gateCheck(gateTxn, this.akitaDAO.value, origin, gateID), ERR_FAILED_GATE)

    return this.createSubscription(payment, recipient, amount, interval, serviceID)
  }

  subscribe(
    payment: gtxn.PaymentTxn,
    recipient: Account,
    amount: uint64,
    interval: uint64,
    serviceID: ServiceID,
  ): uint64 {
    // ensure the amount is enough to take fees on
    assert(amount >= MIN_AMOUNT, ERR_MIN_AMOUNT_IS_THREE)
    // ensure payouts cant be too fast
    assert(interval >= MIN_INTERVAL, ERR_MIN_INTERVAL_IS_SIXTY)

    if (serviceID !== 0) {
      assert(this.services({ address: recipient, id: serviceID }).exists, ERR_SERVICE_DOES_NOT_EXIST)
      const gateID = this.services({ address: recipient, id: serviceID }).value.gateID
      assert(gateID === 0, ERR_HAS_GATE)
    }

    return this.createSubscription(payment, recipient, amount, interval, serviceID)
  }

  gatedSubscribeAsa(
    payment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    recipient: Account,
    amount: uint64,
    interval: uint64,
    serviceID: ServiceID,
  ): uint64 {
    // ensure the amount is enough to take fees on
    assert(amount >= MIN_AMOUNT, ERR_MIN_AMOUNT_IS_THREE)
    // ensure payouts cant be too fast
    assert(interval >= MIN_INTERVAL, ERR_MIN_INTERVAL_IS_SIXTY)

    assert(serviceID !== 0, ERR_NOT_A_SERVICE)
    assert(this.services({ address: recipient, id: serviceID }).exists, ERR_SERVICE_DOES_NOT_EXIST)
    const gateID = this.services({ address: recipient, id: serviceID }).value.gateID

    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    assert(gateCheck(gateTxn, this.akitaDAO.value, origin, gateID), ERR_FAILED_GATE)

    return this.createAsaSubscription(
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
    recipient: Account,
    amount: uint64,
    interval: uint64,
    serviceID: ServiceID,
  ): uint64 {
    // ensure the amount is enough to take fees on
    assert(amount >= MIN_AMOUNT, ERR_MIN_AMOUNT_IS_THREE)
    // ensure payouts cant be too fast
    assert(interval >= MIN_INTERVAL, ERR_MIN_INTERVAL_IS_SIXTY)

    if (serviceID !== 0) {
      assert(this.services({ address: recipient, id: serviceID }).exists, ERR_SERVICE_DOES_NOT_EXIST)
      const gateID = this.services({ address: recipient, id: serviceID }).value.gateID
      assert(gateID === 0, ERR_HAS_GATE)
    }

    return this.createAsaSubscription(
      payment,
      assetXfer,
      recipient,
      amount,
      interval,
      serviceID
    )
  }

  deposit(payment: gtxn.PaymentTxn, id: SubscriptionID): void {
    const subKey = { address: Txn.sender, id }

    assert(this.subscriptions(subKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = clone(this.subscriptions(subKey).value)

    assert(sub.asset === 0, ERR_ASA_MISMATCH)

    assertMatch(
      payment,
      { receiver: Global.currentApplicationAddress },
      ERR_INVALID_PAYMENT
    )

    this.subscriptions(subKey).value.escrowed += payment.amount
  }

  depositAsa(assetXfer: gtxn.AssetTransferTxn, id: SubscriptionID): void {
    const subKey: SubscriptionKey = { address: Txn.sender, id }

    assert(this.subscriptions(subKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const { asset } = this.subscriptions(subKey).value

    assert(asset === assetXfer.xferAsset.id, ERR_ASA_MISMATCH)

    assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_ASSET_RECEIVER)

    this.subscriptions(subKey).value.escrowed += assetXfer.assetAmount
  }

  withdraw(id: SubscriptionID, amount: uint64): void {
    const subKey: SubscriptionKey = { address: Txn.sender, id }

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

    this.subscriptions(subKey).value.escrowed -= amount
  }

  unsubscribe(id: SubscriptionID): void {
    const subKey: SubscriptionKey = { address: Txn.sender, id }

    assert(this.subscriptions(subKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = clone(this.subscriptions(subKey).value)

    const costs = this.mbr()
    let mbrRefund: uint64 = costs.subscriptions
    if (sub.serviceID > 0) {
      const { passes } = this.services({ address: sub.recipient, id: sub.serviceID }).value
      if (passes > 0) {
        mbrRefund += costs.passes
      }
    }

    if (sub.asset !== 0) {
      if (sub.escrowed > 0) {
        itxn
          .assetTransfer({
            assetReceiver: Txn.sender,
            xferAsset: sub.asset,
            assetAmount: sub.escrowed
          })
          .submit()
      }

      itxn
        .payment({
          receiver: Txn.sender,
          amount: mbrRefund
        })
        .submit()
    } else {
      itxn
        .payment({
          receiver: Txn.sender,
          amount: sub.escrowed + mbrRefund
        })
        .submit()
    }

    this.subscriptions(subKey).delete()
  }

  gatedTriggerPayment(gateTxn: gtxn.ApplicationCallTxn, key: SubscriptionKey): void {
    // ensure a subscription exists
    assert(this.subscriptions(key).exists)

    const { serviceID, recipient } = this.subscriptions(key).value

    assert(serviceID !== 0, ERR_NOT_A_SERVICE)
    assert(this.services({ address: recipient, id: serviceID }).exists, ERR_SERVICE_DOES_NOT_EXIST)
    const gateID = this.services({ address: recipient, id: serviceID }).value.gateID

    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    assert(gateCheck(gateTxn, this.akitaDAO.value, origin, gateID), ERR_FAILED_GATE)

    this.triggerPayment(key)
  }

  triggerPayment(key: SubscriptionKey): void {

    assert(this.canTrigger(key), ERR_CANNOT_TRIGGER)

    const {
      recipient,
      amount,
      asset,
      gateID
    } = this.subscriptions(key).value

    if (gateID !== 0) {
      assert(Txn.applicationArgs(0) === methodSelector(this.gatedTriggerPayment))
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
          assetReceiver: recipient,
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
          receiver: recipient,
          amount: amounts.leftOver
        })
        .submit()
    }

    this.updateStreak(key, 1)

    this.subscriptions(key).value.escrowed -= amount
    this.subscriptions(key).value.lastPayment = Global.latestTimestamp
  }

  streakCheck(key: SubscriptionKey): void {
    this.updateStreak(key, 0)
  }

  setPasses(id: SubscriptionID, addresses: Account[]): void {
    const subscriptionsKey: SubscriptionKey = { address: Txn.sender, id }

    assert(this.subscriptions(subscriptionsKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const { serviceID, recipient } = clone(this.subscriptions(subscriptionsKey).value)

    assert(serviceID > 0, ERR_NO_DONATIONS)

    const serviceKey: ServicesKey = { address: recipient, id: serviceID }

    assert(this.services(serviceKey).exists, ERR_SERVICE_DOES_NOT_EXIST)

    const { status, passes } = this.services(serviceKey).value

    assert(status !== ServiceStatusShutdown, ERR_SERVICE_IS_SHUTDOWN)
    assert(passes >= addresses.length, ERR_PASS_COUNT_OVERFLOW)

    for (let i: uint64 = 0; i < addresses.length; i += 1) {
      assert(!this.blocks(this.getBlockKey(recipient, addresses[i])).exists, ERR_BLOCKED)
    }

    this.passes({ address: Txn.sender, id }).value = clone(addresses)
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  @abimethod({ readonly: true })
  triggerList(req: TriggerListRequest[]): boolean[] {
    const results: boolean[] = []
    for (let i: uint64 = 0; i < req.length; i += 1) {
      for (let j: uint64 = 0; j < req[i].ids.length; j += 1) {
        const key: SubscriptionKey = { address: req[i].address, id: req[i].ids[j] }
        results.push(this.canTrigger(key))
      }
    }
    return results
  }

  /**
   * isBlocked checks if an address is blocked for a merchant
   * @param merchant The merchant address to be checked
   * @param address The address to be checked
   */
  @abimethod({ readonly: true })
  isBlocked(address: Account, blocked: Account): boolean {
    return this.blocks(this.getBlockKey(address, blocked)).exists
  }

  /**
   * serviceIsActive checks if an service is shutdown
   */
  @abimethod({ readonly: true })
  isShutdown(address: Account, id: uint64): boolean {
    return (
      this.services({ address, id }).exists &&
      this.services({ address, id }).value.status === ServiceStatusShutdown
    )
  }

  @abimethod({ readonly: true })
  newServiceCost(asset: uint64): uint64 {
    const serviceCreationFee = getSubscriptionFees(this.akitaDAO.value).serviceCreationFee
    const costs = this.mbr()
    
    let requiredAmount: uint64 = serviceCreationFee + costs.services
    if (asset !== 0 && !this.akitaDAOEscrow.value.address.isOptedIn(Asset(asset))) {
      requiredAmount += Global.assetOptInMinBalance
    }

    const referralCost = referralFee(this.akitaDAO.value, asset)

    return requiredAmount + referralCost
  }

  @abimethod({ readonly: true })
  newSubscriptionCost(
    recipient: Account,
    asset: uint64,
    serviceID: ServiceID
  ): uint64 {
    const costs = this.mbr()
    let mbrAmount = costs.subscriptions
    // index zero is always reserved for donations
    const isDonation = serviceID === 0
    if (!isDonation) {
      const boxKey: ServicesKey = { address: recipient, id: serviceID }
      // ensure the service exists
      assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST)
      // get the service details
      const service = clone(this.services(boxKey).value)

      if (service.passes > 0) {
        mbrAmount += costs.passes
      }
    }

    const subscriptionID = this.newSubscriptionID(Txn.sender)

    if (subscriptionID === 0) {
      mbrAmount += costs.subscriptionslist
    }

    const referralCost = referralFee(this.akitaDAO.value, asset)

    if (asset !== 0 && !this.akitaDAOEscrow.value.address.isOptedIn(Asset(asset))) {
      mbrAmount += Global.assetOptInMinBalance
    }

    return mbrAmount + referralCost
  }

  @abimethod({ readonly: true })
  blockCost(): uint64 {
    return this.mbr().blocks
  }

  @abimethod({ readonly: true })
  getService(address: Account, id: uint64): Service {
    const key: ServicesKey = { address, id }
    assert(this.services(key).exists, ERR_SERVICE_DOES_NOT_EXIST)
    return this.services(key).value
  }

  @abimethod({ readonly: true })
  getServicesByAddress(address: Account, start: uint64, windowSize: uint64): Service[] {
    const services: Service[] = []
    for (let i: uint64 = start; i < start + windowSize; i += 1) {
      const key: ServicesKey = { address, id: i }
      if (this.services(key).exists) {
        services.push(this.services(key).value)
      } else {
        break
      }
    }
    return services
  }

  @abimethod({ readonly: true })
  getSubscription(key: SubscriptionKey): SubscriptionInfo {
    assert(this.subscriptions(key).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)
    return this.subscriptions(key).value
  }

  @abimethod({ readonly: true })
  getSubscriptionWithDetails(key: SubscriptionKey): SubscriptionInfoWithDetails {
    assert(this.subscriptions(key).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = clone(this.subscriptions(key).value)

    let status: ServiceStatus = ServiceStatusNone
    let title: string = ''
    let description: string = ''  
    let bannerImage: CID = op.bzero(36)
    let highlightMessage: Uint8 = HighlightMessageNone
    let highlightColor: bytes<3> = Bytes('000').toFixed({ length: 3 })
    if (sub.serviceID !== 0) {
      const serviceKey: ServicesKey = { address: sub.recipient, id: sub.serviceID }
      assert(this.services(serviceKey).exists, ERR_SERVICE_DOES_NOT_EXIST);
      ({ status, title, description, bannerImage, highlightMessage, highlightColor } = clone(this.services(serviceKey).value))
    }

    let passes: Account[] = []
    if (this.passes(key).exists) {
      passes = [...passes, ...this.passes(key).value]
    }

    return {
      ...sub,
      status,
      title,
      description,
      bannerImage,
      highlightMessage,
      highlightColor,
      passes
    }
  }

  @abimethod({ readonly: true })
  isFirstSubscription(address: Account): boolean {
    return !this.subscriptionslist(address).exists
  }

  @abimethod({ readonly: true })
  getServiceList(address: Account): uint64 {
    return this.serviceslist(address).exists ? this.serviceslist(address).value : 0
  }

  @abimethod({ readonly: true })
  getSubscriptionList(address: Account): uint64 {
    return this.subscriptionslist(address).exists ? this.subscriptionslist(address).value : 0
  }
}
