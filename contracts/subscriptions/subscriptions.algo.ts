import { ContractWithOptinAndArc58AndGate } from '../../utils/base_contracts/gate.algo';
import { abimethod, arc4, assert, Asset, BigUint, biguint, BoxMap, bytes, Global, gtxn, itxn, OnCompleteAction, Uint64, uint64 } from '@algorandfoundation/algorand-typescript';
import { Amounts, arc4BlockListKey, arc4PassesKey, arc4ServiceID, arc4ServicesKey, arc4ServicesValue, arc4SubscriptionID, arc4SubscriptionInfo, arc4SubscriptionInfoWithPasses, arc4SubscriptionKey, ServiceStatusActive, ServiceStatusPaused, ServiceStatusShutdown } from './types';
import { blockMBR, SubscriptionsBoxPrefixBlocks, SubscriptionsBoxPrefixPasses, SubscriptionsBoxPrefixServices, SubscriptionsBoxPrefixServicesList, SubscriptionsBoxPrefixSubscriptions, SubscriptionsBoxPrefixSubscriptionsList, subscriptionsMBR } from './constants';
import { arc4AssetAndAmount } from '../../utils/types/optin';
import { Txn } from '@algorandfoundation/algorand-typescript/op';
import { ERR_ASA_MISMATCH, ERR_BAD_WINDOW, ERR_BLOCKED, ERR_FAILED_GATE, ERR_INVALID_ASSET_AMOUNT, ERR_INVALID_ASSET_RECEIVER, ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER, ERR_MAX_PASSES_IS_FIVE, ERR_MIN_AMOUNT_IS_THREE, ERR_MIN_INTERVAL_IS_SIXTY, ERR_NO_DONATIONS, ERR_NOT_ENOUGH_FUNDS, ERR_PASS_COUNT_OVERFLOW, ERR_SERVICE_DOES_NOT_EXIST, ERR_SERVICE_INDEX_MUST_BE_ABOVE_ZERO, ERR_SERVICE_IS_NOT_ACTIVE, ERR_SERVICE_IS_NOT_PAUSED, ERR_SERVICE_IS_SHUTDOWN, ERR_SUBSCRIPTION_DOES_NOT_EXIST, ERR_USER_ALREADY_BLOCKED, ERR_USER_NOT_BLOCKED } from './errs';
import { methodSelector } from '@algorandfoundation/algorand-typescript/arc4';
import { AkitaDAO } from '../dao/dao.algo';
import { arc4Zero, DIVISOR } from '../../utils/constants';

// eslint-disable-next-line no-unused-vars
export class Subscriptions extends ContractWithOptinAndArc58AndGate {
  // 2_500 + (400 * (40 + 88)) = 53_700
  subscriptions = BoxMap<arc4SubscriptionKey, arc4SubscriptionInfo>({ keyPrefix: SubscriptionsBoxPrefixSubscriptions })

  /**
   * A counter for each addresses subscription id
   * 
   * key: user address
   * key_length: 32
   * 
   * value: id
   * 
   * value_length: 8
   * 
   * 2_500 + (400 * (32 + 8)) = 18_500
   */
  subscriptionslist = BoxMap<arc4.Address, arc4SubscriptionID>({ keyPrefix: SubscriptionsBoxPrefixSubscriptionsList })

  /**
   * services is a map of services a specific merchant has
   * denoted by the merchant address + index of the offer as a key
   * 32 + 8 = 40 bytes
   * 120 bytes total -> (2500 + (400 * 121)) = 0.050500
   */
  services = BoxMap<arc4ServicesKey, arc4ServicesValue>({ keyPrefix: SubscriptionsBoxPrefixServices })

  serviceslist = BoxMap<arc4.Address, arc4ServiceID>({ keyPrefix: SubscriptionsBoxPrefixServicesList })

  /**  
   * blocks allow merchants to specify which addresses cannot subscribe
   * key will be merchant address + blocked address
   * 32 + 32 = 64 bytes
   * 65 bytes total -> (2500 + (400 * 64)) = 0.028500
   */
  blocks = BoxMap<arc4BlockListKey, arc4.StaticBytes<0>>({ keyPrefix: SubscriptionsBoxPrefixBlocks })

  passes = BoxMap<arc4PassesKey, arc4.DynamicArray<arc4.Address>>({ keyPrefix: SubscriptionsBoxPrefixPasses })

  private getLatestWindowStart(startDate: uint64, interval: uint64): uint64 {
    return Global.latestTimestamp - ((Global.latestTimestamp - startDate) % interval)
  }

  private updateStreak(address: arc4.Address, id: arc4SubscriptionID, elseStreak: uint64): void {
    const subKey = new arc4SubscriptionKey({ address, id })
    const sub = this.subscriptions(subKey).value

    const currentWindowStart: uint64 = this.getLatestWindowStart(sub.startDate.native, sub.interval.native)
    const lastWindowStart: uint64 = (currentWindowStart - sub.interval.native)

    if (sub.lastPayment.native < lastWindowStart) {
      // reset the streak
      this.subscriptions(subKey).value.streak = new arc4.UintN64(elseStreak)
      return
    }

    // update the streak if this function is being called
    // after a payment was made in the last window
    // but not during the current window
    if (sub.lastPayment.native >= lastWindowStart && !(sub.lastPayment.native >= currentWindowStart)) {
      this.subscriptions(subKey).value.streak = new arc4.UintN64(sub.streak.native + 1)
    }
  }

  private getAmounts(amount: uint64): Amounts {
    const fees = super.getSubscriptionFees()

    // let akitaFee = wideRatio([amount, fees.paymentPercentage], [10000])
    const raisedAmount = BigUint()
    let akitaFee: uint64 = (amount * fees.paymentPercentage) / DIVISOR
    if (akitaFee === 0 && amount > 0) {
      akitaFee = 1
    }

    // let triggerFee = wideRatio([amount, fees.triggerPercentage], [10000]);
    let triggerFee: uint64 = (amount * fees.triggerPercentage) / DIVISOR
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

  private optInAkitaDAO(asset: Asset): void {
    super.arc58OptInAndSend(
      this.akitaDAO.value.id,
      new arc4.DynamicArray(new arc4AssetAndAmount({
        asset: new arc4.UintN64(asset.id),
        amount: arc4Zero
      }))
    )
  }

  private newServiceID(address: arc4.Address): arc4ServiceID {
    let id: uint64 = this.serviceslist(address).exists ? this.serviceslist(address).value.native : 0
    this.serviceslist(address).value = new arc4.UintN64(id + 1)
    return new arc4.UintN64(id)
  }

  private newSubscriptionID(address: arc4.Address): arc4SubscriptionID {
    let id: uint64 = this.subscriptionslist(address).exists ? this.subscriptionslist(address).value.native : 0
    this.subscriptionslist(address).value = new arc4.UintN64(id + 1)
    return new arc4.UintN64(id)
  }

  /**
   * isBlocked checks if an address is blocked for a merchant
   * @param merchant The merchant address to be checked
   * @param address The address to be checked
   */
  // @ts-ignore
  @abimethod({ readonly: true })
  isBlocked(address: arc4.Address, blocked: arc4.Address): boolean {
    const trimmed = new arc4.StaticBytes<31>(address.bytes.slice(0, 31))
    return this.blocks(new arc4BlockListKey({ address: trimmed, blocked })).exists
  }

  /**
   * serviceIsActive checks if an service is shutdown
   */
  // @ts-ignore
  @abimethod({ readonly: true })
  isShutdown(address: arc4.Address, id: arc4.UintN64): boolean {
    return this.services(new arc4ServicesKey({ address, id })).value.status === ServiceStatusShutdown
  }

  // @ts-ignore
  @abimethod({ readonly: true })
  getSubsriptionInfo(address: arc4.Address, id: arc4.UintN64): arc4SubscriptionInfoWithPasses {
    const key = new arc4SubscriptionKey({ address, id })

    assert(this.subscriptions(key).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const subInfo = this.subscriptions(key).value

    const passesKey = new arc4PassesKey({ address, id })
    let passes = new arc4.DynamicArray<arc4.Address>()
    if (this.passes(passesKey).exists) {
      passes = this.passes(passesKey).value.copy()
    }

    return new arc4SubscriptionInfoWithPasses({
      ...subInfo,
      passes: passes.copy(),
    })
  }

  // @ts-ignore
  @abimethod({ readonly: true })
  isFirstSubscription(address: arc4.Address): boolean {
    return !this.subscriptionslist(address).exists;
  }

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
    interval: arc4.UintN64,
    asset: arc4.UintN64,
    amount: arc4.UintN64,
    passes: arc4.UintN64,
    gate: arc4.UintN64,
    cid: arc4.StaticBytes<36>,
  ): arc4ServiceID {
    const address = new arc4.Address(Txn.sender)
    const id = this.newServiceID(address)
    const boxKey = new arc4ServicesKey({ address, id })

    // ensure the amount is enough to take fees on
    assert(amount.native > 3, ERR_MIN_AMOUNT_IS_THREE);
    // ensure payouts cant be too fast
    assert(interval.native >= 60, ERR_MIN_INTERVAL_IS_SIXTY)
    // family passes have a max of 5
    assert(passes.native <= 5, ERR_MAX_PASSES_IS_FIVE);

    const fee = super.getSubscriptionFees().serviceCreationFee;

    let requiredAmount = fee;
    if (asset.native !== 0) {
      requiredAmount += Global.assetOptInMinBalance;
    }

    assert(payment.amount === requiredAmount, ERR_INVALID_PAYMENT_AMOUNT);
    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER);

    this.services(boxKey).value = new arc4ServicesValue({
      status: ServiceStatusPaused,
      interval: interval,
      asset: asset,
      amount: amount,
      passes: passes,
      gate: gate,
      cid: cid,
    })

    return id;
  }

  /**
   * pauseService pauses a service for a merchant
   * it does not shutdown pre-existing subscriptions
   * it simply prevents new subscriptions from being created
   * for a specific service
   * @param index The index of the box to be used for the subscription
   */
  pauseService(id: arc4ServiceID): void {
    const boxKey = new arc4ServicesKey({ address: new arc4.Address(Txn.sender), id })
    // ensure were not using zero as a box index
    // zero is reserved for non-service based subscriptions
    assert(id.native > 0, ERR_SERVICE_INDEX_MUST_BE_ABOVE_ZERO);
    // ensure the box exists
    assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST);
    // ensure the service isn't already shutdown
    assert(this.services(boxKey).value.status === ServiceStatusActive, ERR_SERVICE_IS_NOT_ACTIVE);

    this.services(boxKey).value.status = ServiceStatusPaused;
  }

  /** 
   * activateService activates an service for a merchant
   * 
   * @param index The index of the box to be used for the subscription
   */
  activateService(id: arc4ServiceID): void {
    const boxKey = new arc4ServicesKey({ address: new arc4.Address(Txn.sender), id })

    // ensure the box exists
    assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST);
    // ensure the service is currently paused
    assert(this.services(boxKey).value.status === ServiceStatusPaused, ERR_SERVICE_IS_NOT_PAUSED);

    this.services(boxKey).value.status = ServiceStatusActive;
  }

  /**
   * shutdownService permanently shuts down an service for a merchant
   * it also shutsdown pre-existing subscriptions
   * @param index The index of the box to be used for the subscription
   */
  shutdownService(id: arc4ServiceID): void {
    const boxKey = new arc4ServicesKey({ address: new arc4.Address(Txn.sender), id })
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
  block(payment: gtxn.PaymentTxn, blocked: arc4.Address): void {
    const address = new arc4.StaticBytes<31>(Txn.sender.bytes.slice(0, 31))
    const boxKey = new arc4BlockListKey({ address, blocked })

    // ensure the address is not already blocked
    assert(!this.blocks(boxKey).exists, ERR_USER_ALREADY_BLOCKED)
    // ensure the payment is correct
    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(payment.amount === blockMBR, ERR_INVALID_PAYMENT_AMOUNT)

    this.blocks(boxKey).value = new arc4.StaticBytes<0>()
  }

  /**
   * unblock removes an address from a merchants blocks
   * @param blocked The address to be unblocked
   */
  unblock(blocked: arc4.Address): void {
    const address = new arc4.StaticBytes<31>(Txn.sender.bytes.slice(0, 31))
    const boxKey = new arc4BlockListKey({ address, blocked })

    // ensure that the address is currently blocked
    assert(this.blocks(boxKey).exists, ERR_USER_NOT_BLOCKED);

    this.blocks(boxKey).delete();

    itxn
      .payment({
        receiver: Txn.sender,
        amount: blockMBR,
        fee: 0,
      })
      .submit()
  }

  subscribe(
    payment: gtxn.PaymentTxn,
    recipient: arc4.Address,
    amount: arc4.UintN64,
    interval: arc4.UintN64,
    serviceID: arc4ServiceID,
    args: bytes[],
  ): void {
    // ensure the amount is enough to take fees on
    assert(amount.native >= 3, ERR_MIN_AMOUNT_IS_THREE);
    // ensure payouts cant be too fast
    assert(interval.native >= 60, ERR_MIN_INTERVAL_IS_SIXTY)

    const trimmedRecipient = new arc4.StaticBytes<31>(recipient.bytes.slice(0, 31))
    const arc4Sender = new arc4.Address(Txn.sender)
    const blocksKey = new arc4BlockListKey({ address: trimmedRecipient, blocked: arc4Sender })
    // ensure they aren't blocked
    assert(!this.blocks(blocksKey).exists, ERR_BLOCKED)
    // gate is zero unless the service has a gate
    let gate = arc4Zero
    // index zero is always reserved for donations
    const isDonation = serviceID.native === 0
    if (!isDonation) {
      const boxKey = new arc4ServicesKey({ address: recipient, id: serviceID })
      // ensure the service exists
      assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST)
      // get the service details
      const service = this.services(boxKey).value
      // ensure the service is active
      assert(service.status === ServiceStatusActive, ERR_SERVICE_IS_NOT_ACTIVE)
      // ensure its an algo subscription
      assert(service.asset.native === 0, ERR_ASA_MISMATCH)
      // ensure the gate check passes
      assert(this.gate(arc4Sender, service.gate.native, args), ERR_FAILED_GATE)
      // overwrite the details for the subscription
      amount = service.amount
      interval = service.interval
      gate = service.gate
    }

    const subscriptionID = this.newSubscriptionID(arc4Sender)
    const subscriptionKey = new arc4SubscriptionKey({ address: arc4Sender, id: subscriptionID })

    const amounts = this.getAmounts(amount.native);

    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(payment.amount >= (amount.native + subscriptionsMBR), ERR_INVALID_PAYMENT_RECEIVER)

    const daoFeePaymentTxn = itxn.payment({
      receiver: this.akitaDAO.value.address,
      amount: (amounts.akitaFee + amounts.triggerFee),
      fee: 0,
    })

    // TODO: replace this with itxn.abiCall when available
    const daoReceiveAppCallTxn = itxn.applicationCall({
      appId: this.akitaDAO.value.id,
      onCompletion: OnCompleteAction.NoOp,
      appArgs: [
        methodSelector(AkitaDAO.prototype.receivePayment),
        daoFeePaymentTxn
      ],
      fee: 0
    })

    const merchantPaymentTxn = itxn.payment({
      receiver: recipient.native,
      amount: amounts.leftOver,
      fee: 0,
    })

    itxn.submitGroup(daoReceiveAppCallTxn, merchantPaymentTxn)

    // amounts.leftOver is the send amount after fees
    // payment.amount should be allowed to be over if
    // the user wants to provide some assets for the escrow
    // at the same time as they are subscribing
    const paymentDifference = new arc4.UintN64(payment.amount - amounts.leftOver)
    const arc4LatestTimestamp = new arc4.UintN64(Global.latestTimestamp)

    this.subscriptions(subscriptionKey).value = new arc4SubscriptionInfo({
      recipient: recipient,
      serviceID,
      startDate: arc4LatestTimestamp,
      amount: amount,
      interval: interval,
      asset: arc4Zero,
      gate: gate,
      lastPayment: arc4LatestTimestamp,
      streak: new arc4.UintN64(1),
      escrowed: paymentDifference,
    })
  }

  subscribeAsa(
    payment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    recipient: arc4.Address,
    amount: arc4.UintN64,
    interval: arc4.UintN64,
    serviceID: arc4ServiceID,
    args: bytes[],
  ): void {
    // ensure the amount is enough to take fees on
    assert(amount.native > 3, ERR_MIN_AMOUNT_IS_THREE)
    // ensure payouts cant be too fast
    assert(interval.native >= 60, ERR_MIN_INTERVAL_IS_SIXTY)

    const trimmedRecipient = new arc4.StaticBytes<31>(recipient.bytes.slice(0, 31))
    const arc4Sender = new arc4.Address(Txn.sender)
    const blocksKey = new arc4BlockListKey({ address: trimmedRecipient, blocked: arc4Sender })
    // ensure they aren't blocked
    assert(!this.blocks(blocksKey).exists, ERR_BLOCKED)
    // gate is zero unless the service has a gate
    let gate = arc4Zero
    // index zero is always reserved for donations
    const isDonation = serviceID.native === 0
    if (!isDonation) {
      const boxKey = new arc4ServicesKey({ address: recipient, id: serviceID })
      // ensure the service exists
      assert(this.services(boxKey).exists, ERR_SERVICE_DOES_NOT_EXIST)
      // get the service details
      const service = this.services(boxKey).value
      // ensure the service is active
      assert(service.status === ServiceStatusActive, ERR_SERVICE_IS_NOT_ACTIVE)
      // ensure its an algo subscription
      assert(service.asset.native === assetXfer.xferAsset.id, ERR_ASA_MISMATCH)
      // ensure the gate check passes
      assert(this.gate(arc4Sender, service.gate.native, args), ERR_FAILED_GATE)
      // overwrite the details for the subscription
      amount = service.amount
      interval = service.interval
      gate = service.gate
    }

    const subscriptionID = this.newSubscriptionID(arc4Sender)
    const subscriptionKey = new arc4SubscriptionKey({ address: arc4Sender, id: subscriptionID })

    let algoMBRFee: uint64 = subscriptionsMBR

    if (!this.akitaDAO.value.address.isOptedIn(assetXfer.xferAsset)) {
      this.optInAkitaDAO(assetXfer.xferAsset)
      algoMBRFee += Global.assetOptInMinBalance
    }

    const amounts = this.getAmounts(amount.native)

    // mbr payment checks
    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(payment.amount === algoMBRFee, ERR_INVALID_PAYMENT_AMOUNT)
    // asset transfer checks
    assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_ASSET_RECEIVER)
    assert(assetXfer.assetAmount >= amount.native, ERR_INVALID_ASSET_AMOUNT)

    const daoFeeTransferTxn = itxn.assetTransfer({
      assetReceiver: this.akitaDAO.value.address,
      xferAsset: assetXfer.xferAsset,
      assetAmount: (amounts.akitaFee + amounts.triggerFee),
      fee: 0,
    })

    // TODO: replace this with itxn.abiCall when available
    const daoReceiveAppCallTxn = itxn.applicationCall({
      appId: this.akitaDAO.value.id,
      onCompletion: OnCompleteAction.NoOp,
      appArgs: [
        methodSelector(AkitaDAO.prototype.receiveAsaPayment),
        daoFeeTransferTxn
      ],
      fee: 0
    })

    const merchantTransferTxn = itxn.assetTransfer({
      assetReceiver: recipient.native,
      xferAsset: assetXfer.xferAsset,
      assetAmount: amounts.leftOver,
      fee: 0,
    })

    itxn.submitGroup(daoReceiveAppCallTxn, merchantTransferTxn)

    // amounts.leftOver is the send amount after fees
    // payment.amount should be allowed to be over if
    // the user wants to provide some assets for the escrow
    // at the same time as they are subscribing
    const paymentDifference = new arc4.UintN64(payment.amount - amounts.leftOver)
    const arc4LatestTimestamp = new arc4.UintN64(Global.latestTimestamp)

    this.subscriptions(subscriptionKey).value = new arc4SubscriptionInfo({
      recipient: recipient,
      serviceID,
      startDate: arc4LatestTimestamp,
      amount: amount,
      interval: interval,
      asset: new arc4.UintN64(assetXfer.xferAsset.id),
      gate: gate,
      lastPayment: arc4LatestTimestamp,
      streak: new arc4.UintN64(1),
      escrowed: paymentDifference,
    })
  }

  deposit(payment: gtxn.PaymentTxn, id: arc4SubscriptionID): void {
    const subKey = new arc4SubscriptionKey({ address: new arc4.Address(Txn.sender), id })

    assert(this.subscriptions(subKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = this.subscriptions(subKey).value

    assert(sub.asset.native === 0, ERR_ASA_MISMATCH)

    assert(payment.receiver === Global.currentApplicationAddress, 'invalid payment receiver')

    const newEscrowedAmount: uint64 = sub.escrowed.native + payment.amount

    this.subscriptions(subKey).value.escrowed = new arc4.UintN64(newEscrowedAmount)
  }

  depositAsa(assetXfer: gtxn.AssetTransferTxn, id: arc4SubscriptionID): void {
    const subKey = new arc4SubscriptionKey({ address: new arc4.Address(Txn.sender), id })

    assert(this.subscriptions(subKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = this.subscriptions(subKey).value

    assert(sub.asset.native === assetXfer.xferAsset.id, ERR_ASA_MISMATCH)

    assert(assetXfer.assetReceiver === Global.currentApplicationAddress, 'invalid asset receiver')

    const newEscrowedAmount: uint64 = sub.escrowed.native + assetXfer.assetAmount

    this.subscriptions(subKey).value.escrowed = new arc4.UintN64(newEscrowedAmount)
  }

  withdraw(id: arc4SubscriptionID, amount: arc4.UintN64): void {
    const subKey = new arc4SubscriptionKey({ address: new arc4.Address(Txn.sender), id })

    assert(this.subscriptions(subKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = this.subscriptions(subKey).value

    assert(sub.escrowed.native >= amount.native, ERR_NOT_ENOUGH_FUNDS)

    if (sub.asset.native !== 0) {
      itxn
        .assetTransfer({
          assetReceiver: Txn.sender,
          xferAsset: sub.asset.native,
          assetAmount: amount.native,
          fee: 0,
        })
        .submit()
    } else {
      itxn
        .payment({
          receiver: Txn.sender,
          amount: amount.native,
          fee: 0,
        })
        .submit()
    }

    const newEscrowAmount = new arc4.UintN64(sub.escrowed.native - amount.native)
    this.subscriptions(subKey).value.escrowed = newEscrowAmount
  }

  triggerPayment(address: arc4.Address, id: arc4SubscriptionID, args: bytes[]): void {
    const subscriptionsKey = new arc4SubscriptionKey({ address, id })

    // ensure a subscription exists
    assert(this.subscriptions(subscriptionsKey).exists)

    const sub = this.subscriptions(subscriptionsKey).value

    const trimmedRecipient = new arc4.StaticBytes<31>(sub.recipient.bytes.slice(0, 31))
    const blocksKey = new arc4BlockListKey({ address: trimmedRecipient, blocked: address })

    // ensure they are not blocked
    assert(!this.blocks(blocksKey).exists, ERR_BLOCKED)

    if (sub.serviceID.native > 0) {
      const servicesKey = new arc4ServicesKey({ address: sub.recipient, id: sub.serviceID })
      // ensure the service isn't shutdown
      assert(this.services(servicesKey).value.status !== ServiceStatusShutdown, ERR_SERVICE_IS_SHUTDOWN);
    }

    // ensure that the current window has not already had a payment
    assert(sub.lastPayment.native < this.getLatestWindowStart(sub.startDate.native, sub.interval.native), ERR_BAD_WINDOW);
    // ensure the user has enough funds in escrow
    assert(sub.escrowed.native >= sub.amount.native, ERR_NOT_ENOUGH_FUNDS);

    const isAsa = sub.asset.native !== 0;
    const amounts = this.getAmounts(sub.amount.native);

    if (isAsa) {
      const daoFeeTransferTxn = itxn.assetTransfer({
        assetReceiver: this.akitaDAO.value.address,
        xferAsset: sub.asset.native,
        assetAmount: amounts.akitaFee,
        fee: 0,
      })
  
      // TODO: replace this with itxn.abiCall when available
      const daoReceiveAppCallTxn = itxn.applicationCall({
        appId: this.akitaDAO.value.id,
        onCompletion: OnCompleteAction.NoOp,
        appArgs: [
          methodSelector(AkitaDAO.prototype.receiveAsaPayment),
          daoFeeTransferTxn
        ],
        fee: 0
      })

      const triggerTransferTxn = itxn.assetTransfer({
        assetReceiver: Txn.sender,
        xferAsset: sub.asset.native,
        assetAmount: amounts.triggerFee,
        fee: 0,
      })

      const merchantTransferTxn = itxn.assetTransfer({
        assetReceiver: sub.recipient.native,
        xferAsset: sub.asset.native,
        assetAmount: amounts.leftOver,
        fee: 0,
      })

      itxn.submitGroup(
        daoReceiveAppCallTxn,
        triggerTransferTxn,
        merchantTransferTxn
      )
    } else {
      // mbr payment for subscriptions & subscriptionslist boxes
      const daoFeePaymentTxn = itxn.payment({
        receiver: this.akitaDAO.value.address,
        amount: amounts.akitaFee,
        fee: 0,
      })
   
      // TODO: replace this with itxn.abiCall when available
      const daoReceiveAppCallTxn = itxn.applicationCall({
        appId: this.akitaDAO.value.id,
        onCompletion: OnCompleteAction.NoOp,
        appArgs: [
          methodSelector(AkitaDAO.prototype.receivePayment),
          daoFeePaymentTxn
        ],
        fee: 0
      })

      const triggerPaymentTxn = itxn.payment({
        receiver: Txn.sender,
        amount: amounts.triggerFee,
        fee: 0,
      })

      const merchantPaymentTxn = itxn.payment({
        receiver: sub.recipient.native,
        amount: amounts.leftOver,
        fee: 0,
      })

      itxn.submitGroup(daoReceiveAppCallTxn, triggerPaymentTxn, merchantPaymentTxn)
    }

    this.updateStreak(address, id, 1)
    const newEscrowedAmount = new arc4.UintN64(sub.escrowed.native - sub.amount.native)
    this.subscriptions(subscriptionsKey).value.escrowed = newEscrowedAmount
    const arc4LatestTimestamp = new arc4.UintN64(Global.latestTimestamp)
    this.subscriptions(subscriptionsKey).value.lastPayment = arc4LatestTimestamp
  }

  streakCheck(sender: arc4.Address, id: arc4SubscriptionID): void {
    this.updateStreak(sender, id, 0);
  }

  setPasses(id: arc4SubscriptionID, addresses: arc4.DynamicArray<arc4.Address>): void {
    const arc4Sender = new arc4.Address(Txn.sender)
    const subscriptionsKey = new arc4SubscriptionKey({ address: arc4Sender, id })

    assert(this.subscriptions(subscriptionsKey).exists, ERR_SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = this.subscriptions(subscriptionsKey).value

    assert(sub.serviceID.native > 0, ERR_NO_DONATIONS)

    const serviceKey = new arc4ServicesKey({ address: sub.recipient, id: sub.serviceID })
    
    assert(this.services(serviceKey).exists, ERR_SERVICE_DOES_NOT_EXIST)

    const service = this.services(serviceKey).value

    assert(service.status !== ServiceStatusShutdown, ERR_SERVICE_IS_SHUTDOWN)
    assert(service.passes.native >= addresses.length, ERR_PASS_COUNT_OVERFLOW)

    const trimmedRecipient = new arc4.StaticBytes<31>(sub.recipient.bytes.slice(0, 31))
    for (let i: uint64 = 0; i < addresses.length; i += 1) {
      assert(!this.blocks(new arc4BlockListKey({ address: trimmedRecipient, blocked: addresses[i] })).exists, ERR_BLOCKED)
    }

    this.passes(new arc4PassesKey({ address: arc4Sender, id })).value = addresses;
  }
}
