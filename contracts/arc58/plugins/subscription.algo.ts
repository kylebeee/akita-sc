import { Contract } from '@algorandfoundation/tealscript';

const errs = {
  MIN_AMOUNT_IS_THREE: 'Minimum amount is 3 base units',
  MIN_INTERVAL_IS_SIXTY: 'Minimum interval is 60 seconds',
  MAX_PASSES_IS_FIVE: 'Maximum number of passes is five',
  PLUGIN_NOT_AUTH_ADDR: 'This plugin does not have control of the account',
  SERVICE_INDEX_MUST_BE_ABOVE_ZERO: 'Service indexes are always above zero',
  SERVICE_DOES_NOT_EXIST: 'Service does not exist',
  SERVICE_MUST_NOT_BE_SHUTDOWN: 'Service must not be shutdown',
  USER_ALREADY_BLOCKED: 'User is already blocked',
  USER_NOT_BLOCKED: 'User is not blocked',
  BLOCKED: 'This account is blocked by the recipient',
  SERVICE_IS_SHUTDOWN: 'Service offering is shutdown',
  SERVICE_IS_PAUSED: 'Service offering is paused',
  BAD_WINDOW: 'Invalid payment window',
}

interface ServicesValue {
  shutdown: boolean;
  active: boolean;
  interval: uint64;
  asa: AssetID;
  amount: uint64;
  passes: uint64;
  cid: bytes<59>;
  allowTraversal: boolean;
}

interface ServicesKey {
  user: Address;
  index: uint64;
};

interface BlockListKey {
  user: Address;
  blocked: Address;
}

interface SubscriptionKey {
  user: Address;
  index: uint64;
};

interface SubscriptionValue {
  recipient: Address;
  index: uint64;
  startDate: uint64;
  amount: uint64;
  interval: uint64;
  asa: AssetID;
  lastPayment: uint64;
  streak: uint64;
}

interface PassesKey {
  user: Address;
  index: uint64;
  passIndex: uint64;
}

// eslint-disable-next-line no-unused-vars
export class SubscriptionPlugin extends Contract {
  /** Target AVM 10 */
  programVersion = 10;

  /**
   * version is the version of the contract
   */
  version = GlobalStateKey<uint64>();

  /**
   * services is a map of services a specific merchant has
   * denoted by the merchant address + index of the offer as a key
   * 32 + 8 = 40 bytes
   * 120 bytes total -> (2500 + (400 * 121)) = 0.050500
   */
  services = BoxMap<ServicesKey, ServicesValue>({ prefix: 's' });

  serviceslist = BoxMap<Address, uint64>({ prefix: 'l' })

  /**	 
   * blocks allow merchants to specify which addresses cannot subscribe
   * key will be merchant address + blocked address
   * 32 + 32 = 64 bytes
   * 65 bytes total -> (2500 + (400 * 64)) = 0.028500
   */
  blocks = BoxMap<BlockListKey, bytes<0>>();

  // 2_500 + (400 * (40 + 88)) = 53_700
  subscriptions = BoxMap<SubscriptionKey, SubscriptionValue>();

  // 2_500 + (400 * (32 + 8)) = 18_500
  subscriptionslist = BoxMap<Address, uint64>();

  passes = BoxMap<PassesKey, Address>({ prefix: 'p' });

  // passeslist = BoxMap<PassesListKey, uint64>({})

  private controls(address: Address): boolean {
    return address.authAddr === this.app.address;
  }

  private addPendingOptin(sender: Address, asa: AssetID, amount: uint64, rekeyBack: boolean): void {
    if (rekeyBack) {
      this.pendingGroup.addPayment({
        sender: sender,
        receiver: globals.currentApplicationAddress,
        amount: (globals.assetOptInMinBalance + amount),
        // always rekey the user back
        rekeyTo: sender,
        fee: 0,
      });
    } else {
      this.pendingGroup.addPayment({
        sender: sender,
        receiver: globals.currentApplicationAddress,
        amount: (globals.assetOptInMinBalance + amount),
        fee: 0,
      });
    }

    this.pendingGroup.addAssetTransfer({
      sender: globals.currentApplicationAddress,
      assetReceiver: globals.currentApplicationAddress,
      assetAmount: 0,
      xferAsset: asa,
      fee: 0,
    });
  }

  private getLatestWindowStart(startDate: uint64, interval: uint64): uint64 {
    return globals.latestTimestamp - ((globals.latestTimestamp - startDate) % interval);
  }

  private updateStreak(sender: Address, index: uint64, elseStreak: uint64): void {
    const subKey: SubscriptionKey = { user: sender, index: index };
    const sub = this.subscriptions(subKey).value;

    const currentWindowStart = this.getLatestWindowStart(sub.startDate, sub.interval);
    const lastWindowStart = (currentWindowStart - sub.interval);

    if (sub.lastPayment < lastWindowStart) {
      // reset the streak
      this.subscriptions(subKey).value.streak = elseStreak;
      return;
    }

    // update the streak if this function is being called
    // after a payment was made in the last window
    // but not during the current window
    if (sub.lastPayment >= lastWindowStart && !(sub.lastPayment >= currentWindowStart)) {
      this.subscriptions(subKey).value.streak++;
    }
  }

  /**
   * newService creates a new service for a merchant
   * @param sender The address the plugin currently controls
   * @param interval The interval in seconds
   * @param asa The asa to be used for the subscription
   * @param amount The amount of the asa to be used for the subscription
   * @param passes The number of accounts the subscription can be shared with
   * @param cid The ipfs cid of the subscription contract
   * @param allowTraversal Indicates whether the user can downgrade 
   * or upgrade the subscription to a different service from the user without losing their streak
   */
  newService(
    sender: Address,
    interval: uint64,
    asa: AssetID,
    amount: uint64,
    passes: uint64,
    cid: bytes<59>,
    allowTraversal: boolean,
  ): uint64 {

    let index: uint64 = 0;
    if (this.serviceslist(sender).exists) {
      index = this.serviceslist(sender).value;
      this.serviceslist(sender).value++;
    } else {
      index = 1;
      this.serviceslist(sender).value = 1;
    }

    const boxKey: ServicesKey = { user: sender, index: index };

    // ensure the amount is enough to take fees on
    assert(amount > 3, errs.MIN_AMOUNT_IS_THREE);
    // ensure payouts cant be too fast
    assert(interval >= 60, errs.MIN_INTERVAL_IS_SIXTY)
    // family passes have a max of 5
    assert(passes <= 5, errs.MAX_PASSES_IS_FIVE);

    if (!this.app.address.isOptedInToAsset(asa)) {
      this.addPendingOptin(sender, asa, 5_000_000, true);
      this.pendingGroup.submit();
    } else {
      // take a fee of 5 Algo
      sendPayment({
        sender: sender,
        receiver: globals.currentApplicationAddress,
        amount: 5_000_000,
        // always rekey the user back
        rekeyTo: sender,
        fee: 0,
      });
    }

    this.services(boxKey).value = {
      shutdown: false,
      active: true,
      interval: interval,
      asa: asa,
      amount: amount,
      passes: passes,
      cid: cid,
      allowTraversal: allowTraversal,
    };

    return index;
  }

  /**
   * pauseService pauses a service for a merchant
   * it does not shutdown pre-existing subscriptions
   * it simply prevents new subscriptions from being created
   * for a specific service
   * @param sender The address the plugin currently controls
   * @param index The index of the box to be used for the subscription
   */
  pauseService(sender: Address, index: uint64): void {
    const boxKey: ServicesKey = { user: sender, index: index };

    // ensure the account is currently controlled by the app
    assert(this.controls(sender), errs.PLUGIN_NOT_AUTH_ADDR);
    // ensure were not using zero as a box index
    // zero is reserved for non-service based subscriptions
    assert(index > 0, errs.SERVICE_INDEX_MUST_BE_ABOVE_ZERO);
    // ensure the box exists
    assert(this.services(boxKey).exists, errs.SERVICE_DOES_NOT_EXIST);
    // ensure the service isn't already shutdown
    assert(!this.services(boxKey).value.shutdown, errs.SERVICE_MUST_NOT_BE_SHUTDOWN);

    this.services(boxKey).value.active = false;
  }

  /** 
   * activateService activates an service for a merchant
   * @param boxIndex The index of the box to be used for the subscription
   */
  activateService(sender: Address, index: uint64): void {
    const boxKey: ServicesKey = { user: sender, index: index };

    // ensure the account is currently controlled by the app
    assert(this.controls(sender), errs.PLUGIN_NOT_AUTH_ADDR);
    // ensure the box exists
    assert(this.services(boxKey).exists, errs.SERVICE_DOES_NOT_EXIST);
    // ensure the service isn't already shutdown
    assert(!this.services(boxKey).value.shutdown, errs.SERVICE_MUST_NOT_BE_SHUTDOWN);

    this.services(boxKey).value.active = true;
  }

  /**
   * shutdownService permanently shuts down an service for a merchant
   * it also shutsdown pre-existing subscriptions
   * @param sender The address the plugin currently controls
   * @param index The index of the box to be used for the subscription
   */
  shutdownService(sender: Address, index: uint64): void {
    const boxKey: ServicesKey = { user: sender, index: index };

    // ensure the box exists
    assert(this.services(boxKey).exists, errs.SERVICE_DOES_NOT_EXIST);
    // ensure the service isn't already shutdown
    assert(!this.services(boxKey).value.shutdown, errs.SERVICE_MUST_NOT_BE_SHUTDOWN);

    this.services(boxKey).value.shutdown = true;
  }

  /**
   * serviceIsActive checks if an service is shutdown
   */
  @abi.readonly
  isShutdown(merchant: Address, boxIndex: uint64): boolean {
    return this.services({ user: merchant, index: boxIndex }).value.shutdown;
  }

  /**
   * block blacklists an address for a merchant
   * @param sender The address the plugin currently controls
   * @param address The address to be blocked
   */
  block(sender: Address, address: Address): void {
    const boxKey: BlockListKey = { user: sender, blocked: address };

    // ensure the address is not already blocked
    assert(!this.blocks(boxKey).exists, errs.USER_ALREADY_BLOCKED);

    // mbr for the blocks box map is 2_500 * (400 * 64)
    sendPayment({
      sender: sender,
      receiver: globals.currentApplicationAddress,
      amount: 28_100,
      // always rekey the user back
      rekeyTo: sender,
      fee: 0,
    })

    this.blocks(boxKey).create(0)
  }

  /**
   * unblock removes an address from a merchants blocks
   * @param address The address to be unblocked
   */
  unblock(sender: Address, address: Address): void {
    const boxKey: BlockListKey = { user: sender, blocked: address };

    // ensure that the user is currently blocked
    assert(this.blocks(boxKey).exists, errs.USER_NOT_BLOCKED);

    this.blocks(boxKey).delete();
  }

  /**
   * isBlocked checks if an address is blocked for a merchant
   * @param merchant The merchant address to be checked
   * @param address The address to be checked
   */
  @abi.readonly
  isBlocked(merchant: Address, address: Address): boolean {
    return this.blocks({ user: merchant, blocked: address }).exists;
  }

  subscribe(
    sender: Address,
    recipient: Address,
    index: uint64,
    amount: uint64,
    interval: uint64,
    asa: AssetID,
  ): void {
    const isDonation = index === 0;
    const isAsa = asa.id !== 0;

    // ensure the amount is enough to take fees on
    assert(amount > 3, errs.MIN_AMOUNT_IS_THREE);
    // ensure payouts cant be too fast
    assert(interval >= 60, errs.MIN_INTERVAL_IS_SIXTY)

    if (!isDonation) {
      const boxKey: ServicesKey = { user: recipient, index: index };
      const blocksKey: BlockListKey = { user: recipient, blocked: sender };

      // ensure the service exists
      assert(this.services(boxKey).exists, errs.SERVICE_DOES_NOT_EXIST);

      const service = this.services(boxKey).value;

      // ensure they aren't blocked
      assert(!this.blocks(blocksKey).exists, errs.BLOCKED);
      // ensure the service isn't shutdown
      assert(!service.shutdown, errs.SERVICE_IS_SHUTDOWN);
      // ensure the service isn't paused
      assert(service.active, errs.SERVICE_IS_PAUSED);

      amount = service.amount;
      interval = service.interval;
    }

    let algoMBRFee: uint64 = 53_700;
    let subIndex: uint64 = 0;
    let subscriptionsListExists: boolean = this.subscriptionslist(sender).exists;
    if (subscriptionsListExists) {
      subIndex = this.subscriptionslist(sender).value;
      this.subscriptionslist(sender).value++;
    } else {
      algoMBRFee += 18_500;
      subIndex = 0;
      this.subscriptionslist(sender).value = 0;
    }

    const subscriptionKey: SubscriptionKey = { user: sender, index: subIndex };

    this.subscriptions(subscriptionKey).value = {
      recipient: recipient,
      index: index,
      startDate: globals.latestTimestamp,
      amount: amount,
      interval: interval,
      asa: asa,
      lastPayment: globals.latestTimestamp,
      streak: 1,
    };

    const initialFee = (amount * 40 - 1) / 1000 + 1;
    const leftOver = amount - initialFee;

    if (isAsa) {
      if (!this.app.address.isOptedInToAsset(asa)) {
        this.addPendingOptin(sender, asa, algoMBRFee, false);
      } else {
        // mbr payment for subscriptions & subscriptionslist boxes
        this.pendingGroup.addPayment({
          sender: sender,
          receiver: globals.currentApplicationAddress,
          amount: algoMBRFee,
          fee: 0,
        });
      }

      this.pendingGroup.addAssetTransfer({
        sender: sender,
        assetReceiver: globals.currentApplicationAddress,
        xferAsset: asa,
        assetAmount: initialFee,
        fee: 0,
      });

      this.pendingGroup.addAssetTransfer({
        sender: sender,
        assetReceiver: recipient,
        xferAsset: asa,
        assetAmount: leftOver,
        // always rekey the user back
        rekeyTo: sender,
        fee: 0,
      });
    } else {
      // mbr payment for subscriptions & subscriptionslist boxes
      this.pendingGroup.addPayment({
        sender: sender,
        receiver: globals.currentApplicationAddress,
        amount: (algoMBRFee + initialFee),
        fee: 0,
      });

      this.pendingGroup.addPayment({
        sender: sender,
        receiver: recipient,
        amount: leftOver,
        // always rekey the user back
        rekeyTo: sender,
        fee: 0,
      });
    }

    this.pendingGroup.submit();
  }

  triggerPayment(sender: Address, index: uint64): void {
    const subscriptionsKey: SubscriptionKey = { user: sender, index: index };
    
    // ensure a subscription exists
    assert(this.subscriptions(subscriptionsKey).exists);

    const sub = this.subscriptions(subscriptionsKey).value;

    const blocksKey: BlockListKey = { user: sub.recipient, blocked: sender };

    // ensure they are not blocked
    assert(!this.blocks(blocksKey).exists, errs.BLOCKED);

    if (index > 0) {
      const servicesKey: ServicesKey = { user: sub.recipient, index: sub.index };
      // ensure the service isn't shutdown
      assert(!this.services(servicesKey).value.active, errs.SERVICE_IS_PAUSED);
    }

    // ensure that the current window has not already had a payment
    assert(sub.lastPayment < this.getLatestWindowStart(sub.startDate, sub.interval), errs.BAD_WINDOW);

    const isAsa = sub.asa.id !== 0;

    const akitaFee = (sub.amount * 35 - 1) / 1000 + 1;
    const triggerFee = (sub.amount * 5 - 1) / 1000 + 1;
    const leftOver = sub.amount - (akitaFee + triggerFee);

    if (isAsa) {
      this.pendingGroup.addAssetTransfer({
        sender: sender,
        assetReceiver: globals.currentApplicationAddress,
        xferAsset: sub.asa,
        assetAmount: akitaFee,
        fee: 0,
      });

      this.pendingGroup.addAssetTransfer({
        sender: sender,
        assetReceiver: this.txn.sender,
        xferAsset: sub.asa,
        assetAmount: triggerFee,
        fee: 0,
      });

      this.pendingGroup.addAssetTransfer({
        sender: sender,
        assetReceiver: sub.recipient,
        xferAsset: sub.asa,
        assetAmount: leftOver,
        // always rekey the user back
        rekeyTo: sender,
        fee: 0,
      });
    } else {
      // mbr payment for subscriptions & subscriptionslist boxes
      this.pendingGroup.addPayment({
        sender: sender,
        receiver: globals.currentApplicationAddress,
        amount: akitaFee,
        fee: 0,
      });

      this.pendingGroup.addPayment({
        sender: sender,
        receiver: this.txn.sender,
        amount: triggerFee,
        fee: 0,
      });

      this.pendingGroup.addPayment({
        sender: sender,
        receiver: sub.recipient,
        amount: leftOver,
        // always rekey the user back
        rekeyTo: sender,
        fee: 0,
      });
    }

    this.pendingGroup.submit();

    this.updateStreak(sender, index, 1);

    this.subscriptions(subscriptionsKey).value.lastPayment = globals.latestTimestamp;
  }

  streakCheck(sender: Address, index: uint64): void {
    this.updateStreak(sender, index, 0);
  }
}
