import { Contract } from '@algorandfoundation/tealscript';
import { AkitaAppIDsGate, bytes0, bytes59 } from '../../../utils/constants';
import { Gate } from '../../gates/gate.algo';

const errs = {
  MIN_AMOUNT_IS_THREE: 'Minimum amount is 3 base units',
  MIN_INTERVAL_IS_SIXTY: 'Minimum interval is 60 seconds',
  MAX_PASSES_IS_FIVE: 'Maximum number of passes is five',
  PLUGIN_NOT_AUTH_ADDR: 'This plugin does not have control of the account',
  SERVICE_INDEX_MUST_BE_ABOVE_ZERO: 'Service indexes are always above zero',
  SERVICE_DOES_NOT_EXIST: 'Service does not exist',
  USER_ALREADY_BLOCKED: 'User is already blocked',
  USER_NOT_BLOCKED: 'User is not blocked',
  BLOCKED: 'This account is blocked by the recipient',
  SERVICE_IS_SHUTDOWN: 'Service offering is shutdown',
  SERVICE_IS_PAUSED: 'Service offering is paused',
  FAILED_GATE: 'Gate check failed',
  BAD_WINDOW: 'Invalid payment window',
  NO_DONATIONS: "Donations aren't applicable to passes",
  SUBSCRIPTION_DOES_NOT_EXIST: 'Subscription does not exist',
  PASS_COUNT_OVERFLOW: 'More addresses than available passes',
}

const FIVE_ALGO = 5_000_000;

export type ServicesKey = {
  user: Address;
  index: uint64;
};

export type ServicesValue = {
  shutdown: boolean;
  active: boolean;
  interval: uint64;
  asset: AssetID;
  amount: uint64;
  passes: uint64;
  gate: uint64;
  cid: bytes59;
}

export type BlockListKey = {
  user: Address;
  blocked: Address;
}

export type SubscriptionKey = {
  user: Address;
  index: uint64;
};

export type SubscriptionInfo = {
  recipient: Address;
  index: uint64;
  startDate: uint64;
  amount: uint64;
  interval: uint64;
  asset: AssetID;
  gate: uint64;
  lastPayment: uint64;
  streak: uint64;
}

export type PassesKey = {
  user: Address;
  index: uint64;
}

export type SubscriptionInfoWithPasses = {
  recipient: Address;
  index: uint64;
  startDate: uint64;
  amount: uint64;
  interval: uint64;
  asset: AssetID;
  gate: uint64;
  lastPayment: uint64;
  streak: uint64;
  passes: Address[];
};

// eslint-disable-next-line no-unused-vars
export class SubscriptionPlugin extends Contract {
  /** Target AVM 10 */
  programVersion = 10;

  /**
   * version is the version of the contract
   */
  version = GlobalStateKey<uint64>({ key: 'v' });

  // 2_500 + (400 * (40 + 88)) = 53_700
  subscriptions = BoxMap<SubscriptionKey, SubscriptionInfo>();

  /**
   * A counter for each users subscription index
   * 
   * key: user address
   * key_length: 32
   * 
   * value: index
   * 
   * value_length: 8
   * 
   * 2_500 + (400 * (32 + 8)) = 18_500
   */
  subscriptionslist = BoxMap<Address, uint64>();

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
  blocks = BoxMap<BlockListKey, bytes0>();

  passes = BoxMap<PassesKey, Address[]>({ prefix: 'p' });

  private controls(address: Address): boolean {
    return address.authAddr === this.app.address;
  }

  private rekeyBack(address: Address) {
    sendPayment({
      sender: address,
      amount: 0,
      receiver: address,
      rekeyTo: address,
      fee: 0,
    });
  }

  private gate(index: uint64, args: bytes[]): boolean {
    if (index === 0) {
      return true;
    }

    return sendMethodCall<typeof Gate.prototype.check, boolean>({
      applicationID: AppID.fromUint64(AkitaAppIDsGate),
      methodArgs: [
        index,
        args,
      ],
      fee: 0
    });
  }

  private addPendingOptin(sender: AppID, rekeyBack: boolean, asset: AssetID, amount: uint64): void {
    this.pendingGroup.addAssetTransfer({
      sender: globals.currentApplicationAddress,
      assetReceiver: globals.currentApplicationAddress,
      assetAmount: 0,
      xferAsset: asset,
      fee: 0,
    });

    if (rekeyBack) {
      this.pendingGroup.addPayment({
        sender: sender.address,
        receiver: globals.currentApplicationAddress,
        amount: (globals.assetOptInMinBalance + amount),
        rekeyTo: sender.address,
        fee: 0,
      });
    } else {
      this.pendingGroup.addPayment({
        sender: sender.address,
        receiver: globals.currentApplicationAddress,
        amount: (globals.assetOptInMinBalance + amount),
        fee: 0,
      });
    }
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
      this.subscriptions(subKey).value.streak += 1;
    }
  }

  getSubsriptionInfo(user: Address, index: uint64): SubscriptionInfoWithPasses {
    const key: SubscriptionKey = { user: user, index: index };

    assert(this.subscriptions(key).exists, errs.SUBSCRIPTION_DOES_NOT_EXIST);

    const subInfo = this.subscriptions(key).value;

    let passes: Address[] = [];
    if (this.passes(key).exists) {
      passes = this.passes(key).value
    }

    return {
      recipient: subInfo.recipient,
      index: subInfo.index,
      startDate: subInfo.startDate,
      amount: subInfo.amount,
      interval: subInfo.interval,
      asset: subInfo.asset,
      gate: subInfo.gate,
      lastPayment: subInfo.lastPayment,
      streak: subInfo.streak,
      passes: passes,
    };
  }

  /**
   * newService creates a new service for a merchant
   * @param sender The address the plugin currently controls
   * @param rekeyBack Indicates whether the user wants to rekey back after the transaction
   * @param interval The interval in seconds
   * @param asset The asa to be used for the subscription
   * @param amount The amount of the asa to be used for the subscription
   * @param passes The number of accounts the subscription can be shared with
   * @param cid The ipfs cid of the subscription contract
   * or upgrade the subscription to a different service from the user without losing their streak
   */
  newService(
    sender: AppID,
    rekeyBack: boolean,
    interval: uint64,
    asset: AssetID,
    amount: uint64,
    passes: uint64,
    gate: uint64,
    cid: bytes59,
  ): uint64 {
    let index: uint64 = 0;
    if (this.serviceslist(sender.address).exists) {
      index = this.serviceslist(sender.address).value;
      this.serviceslist(sender.address).value += 1;
    } else {
      index = 1;
      this.serviceslist(sender.address).value = 1;
    }

    const boxKey: ServicesKey = { user: sender.address, index: index };

    // ensure the amount is enough to take fees on
    assert(amount > 3, errs.MIN_AMOUNT_IS_THREE);
    // ensure payouts cant be too fast
    assert(interval >= 60, errs.MIN_INTERVAL_IS_SIXTY)
    // family passes have a max of 5
    assert(passes <= 5, errs.MAX_PASSES_IS_FIVE);

    // take a fee of 5 Algo
    if (asset.id !== 0 && !this.app.address.isOptedInToAsset(asset)) {
      this.addPendingOptin(sender, rekeyBack, asset, FIVE_ALGO);
      this.pendingGroup.submit();
    } else if (rekeyBack) {
      sendPayment({
        sender: sender.address,
        receiver: globals.currentApplicationAddress,
        amount: FIVE_ALGO,
        rekeyTo: sender.address,
        fee: 0,
      });
    } else {
      sendPayment({
        sender: sender.address,
        receiver: globals.currentApplicationAddress,
        amount: FIVE_ALGO,
        fee: 0,
      });
    }

    this.services(boxKey).value = {
      shutdown: false,
      active: true,
      interval: interval,
      asset: asset,
      amount: amount,
      passes: passes,
      gate: gate,
      cid: cid,
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
  pauseService(sender: AppID, rekeyBack: boolean, index: uint64): void {
    const boxKey: ServicesKey = { user: sender.address, index: index };

    // ensure the account is currently controlled by the app
    assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
    // ensure were not using zero as a box index
    // zero is reserved for non-service based subscriptions
    assert(index > 0, errs.SERVICE_INDEX_MUST_BE_ABOVE_ZERO);
    // ensure the box exists
    assert(this.services(boxKey).exists, errs.SERVICE_DOES_NOT_EXIST);
    // ensure the service isn't already shutdown
    assert(!this.services(boxKey).value.shutdown, errs.SERVICE_IS_SHUTDOWN);

    this.services(boxKey).value.active = false;

    if (rekeyBack) {
      this.rekeyBack(sender.address);
    }
  }

  /** 
   * activateService activates an service for a merchant
   * 
   * @param sender The address the plugin currently controls
   * @param rekeyBack Indicates whether the user wants to rekey back after the transaction
   * @param index The index of the box to be used for the subscription
   */
  activateService(sender: AppID, rekeyBack: boolean, index: uint64): void {
    const boxKey: ServicesKey = { user: sender.address, index: index };

    // ensure the account is currently controlled by the app
    assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
    // ensure the box exists
    assert(this.services(boxKey).exists, errs.SERVICE_DOES_NOT_EXIST);
    // ensure the service isn't already shutdown
    assert(!this.services(boxKey).value.shutdown, errs.SERVICE_IS_SHUTDOWN);

    this.services(boxKey).value.active = true;

    if (rekeyBack) {
      this.rekeyBack(sender.address);
    }
  }

  /**
   * shutdownService permanently shuts down an service for a merchant
   * it also shutsdown pre-existing subscriptions
   * @param sender The address the plugin currently controls
   * @param index The index of the box to be used for the subscription
   */
  shutdownService(sender: AppID, rekeyBack: boolean, index: uint64): void {
    const boxKey: ServicesKey = { user: sender.address, index: index };

    // ensure the account is currently controlled by the app
    assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
    // ensure the box exists
    assert(this.services(boxKey).exists, errs.SERVICE_DOES_NOT_EXIST);
    // ensure the service isn't already shutdown
    assert(!this.services(boxKey).value.shutdown, errs.SERVICE_IS_SHUTDOWN);

    this.services(boxKey).value.shutdown = true;
    this.services(boxKey).value.active = false;

    if (rekeyBack) {
      this.rekeyBack(sender.address);
    }
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
  block(sender: AppID, rekeyBack: boolean, address: Address): void {
    const boxKey: BlockListKey = { user: sender.address, blocked: address };

    // ensure the account is currently controlled by the app
    assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
    // ensure the address is not already blocked
    assert(!this.blocks(boxKey).exists, errs.USER_ALREADY_BLOCKED);

    // mbr for the blocks box map is 2_500 * (400 * 64)
    if (rekeyBack) {
      sendPayment({
        sender: sender.address,
        receiver: globals.currentApplicationAddress,
        amount: 28_100,
        rekeyTo: sender.address,
        fee: 0,
      });
    } else {
      sendPayment({
        sender: sender.address,
        receiver: globals.currentApplicationAddress,
        amount: 28_100,
        fee: 0,
      });
    }

    this.blocks(boxKey).create(0)
  }

  /**
   * unblock removes an address from a merchants blocks
   * @param address The address to be unblocked
   */
  unblock(sender: AppID, rekeyBack: boolean, address: Address): void {
    const boxKey: BlockListKey = { user: sender.address, blocked: address };

    // ensure the account is currently controlled by the app
    assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
    // ensure that the user is currently blocked
    assert(this.blocks(boxKey).exists, errs.USER_NOT_BLOCKED);

    this.blocks(boxKey).delete();

    if (rekeyBack) {
      this.rekeyBack(sender.address);
    }
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
    sender: AppID,
    rekeyBack: boolean,
    recipient: Address,
    amount: uint64,
    interval: uint64,
    asset: AssetID,
    index: uint64,
    gate: uint64,
    args: bytes[],
  ): void {
    const isDonation = index === 0;
    const isAsa = asset.id !== 0;

    // ensure the account is currently controlled by the app
    assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
    // ensure the amount is enough to take fees on
    assert(amount > 3, errs.MIN_AMOUNT_IS_THREE);
    // ensure payouts cant be too fast
    assert(interval >= 60, errs.MIN_INTERVAL_IS_SIXTY)

    if (!isDonation) {
      const boxKey: ServicesKey = { user: recipient, index: index };
      const blocksKey: BlockListKey = { user: recipient, blocked: sender.address };

      // ensure the service exists
      assert(this.services(boxKey).exists, errs.SERVICE_DOES_NOT_EXIST);

      const service = this.services(boxKey).value;

      // ensure they aren't blocked
      assert(!this.blocks(blocksKey).exists, errs.BLOCKED);
      // ensure the service isn't shutdown
      assert(!service.shutdown, errs.SERVICE_IS_SHUTDOWN);
      // ensure the service isn't paused
      assert(service.active, errs.SERVICE_IS_PAUSED);
      // ensure the gate check passes
      assert(this.gate(service.gate, args), errs.FAILED_GATE);

      amount = service.amount;
      interval = service.interval;
      gate = service.gate;
    }

    let algoMBRFee: uint64 = 53_700;
    let subIndex: uint64 = 0;
    let subscriptionsListExists: boolean = this.subscriptionslist(sender.address).exists;
    if (subscriptionsListExists) {
      subIndex = this.subscriptionslist(sender.address).value;
      this.subscriptionslist(sender.address).value += 1;
    } else {
      algoMBRFee += 18_500;
      subIndex = 0;
      this.subscriptionslist(sender.address).value = 0;
    }

    const subscriptionKey: SubscriptionKey = { user: sender.address, index: subIndex };

    this.subscriptions(subscriptionKey).value = {
      recipient: recipient,
      index: index,
      startDate: globals.latestTimestamp,
      amount: amount,
      interval: interval,
      asset: asset,
      gate: gate,
      lastPayment: globals.latestTimestamp,
      streak: 1,
    };

    const initialFee = (amount * 40 - 1) / 1000 + 1;
    const leftOver = amount - initialFee;

    if (isAsa) {
      if (!this.app.address.isOptedInToAsset(asset)) {
        // dont rekey back here, if rekey back is true we'll do it later in the group were building
        this.addPendingOptin(sender, false, asset, algoMBRFee);
      } else {
        // mbr payment for subscriptions & subscriptionslist boxes
        this.pendingGroup.addPayment({
          sender: sender.address,
          receiver: globals.currentApplicationAddress,
          amount: algoMBRFee,
          fee: 0,
        });
      }

      this.pendingGroup.addAssetTransfer({
        sender: sender.address,
        assetReceiver: globals.currentApplicationAddress,
        xferAsset: asset,
        assetAmount: initialFee,
        fee: 0,
      });

      if (rekeyBack) {
        this.pendingGroup.addAssetTransfer({
          sender: sender.address,
          assetReceiver: recipient,
          xferAsset: asset,
          assetAmount: leftOver,
          rekeyTo: sender.address,
          fee: 0,
        });
      } else {
        this.pendingGroup.addAssetTransfer({
          sender: sender.address,
          assetReceiver: recipient,
          xferAsset: asset,
          assetAmount: leftOver,
          rekeyTo: sender.address,
          fee: 0,
        });
      }
    } else {
      // mbr payment for subscriptions & subscriptionslist boxes
      this.pendingGroup.addPayment({
        sender: sender.address,
        receiver: globals.currentApplicationAddress,
        amount: (algoMBRFee + initialFee),
        fee: 0,
      });

      if (rekeyBack) {
        this.pendingGroup.addPayment({
          sender: sender.address,
          receiver: recipient,
          amount: leftOver,
          rekeyTo: sender.address,
          fee: 0,
        });
      } else {
        this.pendingGroup.addPayment({
          sender: sender.address,
          receiver: recipient,
          amount: leftOver,
          fee: 0,
        });
      }
    }

    this.pendingGroup.submit();
  }

  triggerPayment(sender: AppID, rekeyBack: boolean, index: uint64, args: bytes[]): void {
    const subscriptionsKey: SubscriptionKey = { user: sender.address, index: index };

    // ensure a subscription exists
    assert(this.subscriptions(subscriptionsKey).exists);

    const sub = this.subscriptions(subscriptionsKey).value;

    const blocksKey: BlockListKey = { user: sub.recipient, blocked: sender.address };

    // ensure they are not blocked
    assert(!this.blocks(blocksKey).exists, errs.BLOCKED);

    if (index > 0) {
      const servicesKey: ServicesKey = { user: sub.recipient, index: sub.index };
      // ensure the service isn't shutdown
      assert(!this.services(servicesKey).value.shutdown, errs.SERVICE_IS_PAUSED);
    }

    // ensure that the current window has not already had a payment
    assert(sub.lastPayment < this.getLatestWindowStart(sub.startDate, sub.interval), errs.BAD_WINDOW);

    const isAsa = sub.asset.id !== 0;

    const akitaFee = (sub.amount * 35 - 1) / 1000 + 1;
    const triggerFee = (sub.amount * 5 - 1) / 1000 + 1;
    const leftOver = sub.amount - (akitaFee + triggerFee);

    if (isAsa) {
      this.pendingGroup.addAssetTransfer({
        sender: sender.address,
        assetReceiver: globals.currentApplicationAddress,
        xferAsset: sub.asset,
        assetAmount: akitaFee,
        fee: 0,
      });

      this.pendingGroup.addAssetTransfer({
        sender: sender.address,
        assetReceiver: this.txn.sender,
        xferAsset: sub.asset,
        assetAmount: triggerFee,
        fee: 0,
      });

      if (rekeyBack) {
        this.pendingGroup.addAssetTransfer({
          sender: sender.address,
          assetReceiver: sub.recipient,
          xferAsset: sub.asset,
          assetAmount: leftOver,
          rekeyTo: sender.address,
          fee: 0,
        });
      } else {
        this.pendingGroup.addAssetTransfer({
          sender: sender.address,
          assetReceiver: sub.recipient,
          xferAsset: sub.asset,
          assetAmount: leftOver,
          fee: 0,
        });
      }
    } else {
      // mbr payment for subscriptions & subscriptionslist boxes
      this.pendingGroup.addPayment({
        sender: sender.address,
        receiver: globals.currentApplicationAddress,
        amount: akitaFee,
        fee: 0,
      });

      this.pendingGroup.addPayment({
        sender: sender.address,
        receiver: this.txn.sender,
        amount: triggerFee,
        fee: 0,
      });

      if (rekeyBack) {
        this.pendingGroup.addPayment({
          sender: sender.address,
          receiver: sub.recipient,
          amount: leftOver,
          rekeyTo: sender.address,
          fee: 0,
        });
      } else {
        this.pendingGroup.addPayment({
          sender: sender.address,
          receiver: sub.recipient,
          amount: leftOver,
          fee: 0,
        });
      }
    }

    this.pendingGroup.submit();
    this.updateStreak(sender.address, index, 1);
    this.subscriptions(subscriptionsKey).value.lastPayment = globals.latestTimestamp;
  }

  streakCheck(sender: Address, index: uint64): void {
    this.updateStreak(sender, index, 0);
  }

  setPasses(sender: AppID, rekeyBack: boolean, index: uint64, addresses: Address[]): void {
    assert(index > 0, errs.NO_DONATIONS)
    const subscriptionsKey: SubscriptionKey = { user: sender.address, index: index };

    assert(this.subscriptions(subscriptionsKey).exists, errs.SUBSCRIPTION_DOES_NOT_EXIST)

    const sub = this.subscriptions(subscriptionsKey).value;

    const serviceKey: ServicesKey = { user: sub.recipient, index: index };
    const service = this.services(serviceKey).value;

    assert(service.active, errs.SERVICE_IS_PAUSED);
    assert(!service.shutdown, errs.SERVICE_IS_SHUTDOWN);
    assert(service.passes >= addresses.length, errs.PASS_COUNT_OVERFLOW)

    for (let i = 0; i < addresses.length; i += 1) {
      assert(!this.blocks({ user: sub.recipient, blocked: addresses[i] }).exists, errs.BLOCKED);
    }

    this.passes(subscriptionsKey).value = addresses;

    if (rekeyBack) {
      this.rekeyBack(sender.address);
    }
  }
}
