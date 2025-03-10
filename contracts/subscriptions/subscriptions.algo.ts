import { AkitaAppIDsOptinPlugin, EMPTY_BYTES_32 } from '../../utils/constants';
import { AbstractedAccount } from '../arc58/abstracted_account.algo';
import { AkitaDAO } from '../dao/dao.algo';
import { OptInPlugin } from '../arc58/plugins/optin.algo';
import { ContractWithGate } from '../../utils/base_contracts/gate.algo';

const errs = {
    MIN_AMOUNT_IS_THREE: 'Minimum amount is 3 base units',
    MIN_INTERVAL_IS_SIXTY: 'Minimum interval is 60 seconds',
    MAX_PASSES_IS_FIVE: 'Maximum number of passes is five',
    PLUGIN_NOT_AUTH_ADDR: 'This plugin does not have control of the account',
    SERVICE_INDEX_MUST_BE_ABOVE_ZERO: 'Service indexes are always above zero',
    SERVICE_DOES_NOT_EXIST: 'Service does not exist',
    USER_ALREADY_BLOCKED: 'User is already blocked',
    USER_NOT_BLOCKED: 'User is not blocked',
    ALREADY_OPTED_IN: 'already opted into asset',
    BLOCKED: 'This account is blocked by the recipient',
    SERVICE_IS_NOT_ACTIVE: 'Service offering is not active',
    SERVICE_IS_NOT_PAUSED: 'Service offering is not paused',
    SERVICE_IS_SHUTDOWN: 'Service offering is shutdown',
    ASA_MISMATCH: 'Asset mismatch',
    FAILED_GATE: 'Gate check failed',
    BAD_WINDOW: 'Invalid payment window',
    NOT_ENOUGH_FUNDS: 'Not enough funds in escrow',
    NO_DONATIONS: "Donations aren't applicable to passes",
    SUBSCRIPTION_DOES_NOT_EXIST: 'Subscription does not exist',
    PASS_COUNT_OVERFLOW: 'More addresses than available passes',
}

const SUBSCRIPTION_SERVICE_CREATION_FEE = 'subscription_service_creation_fee';
const SUBSCRIPTION_PAYMENT_PERCENTAGE_KEY = 'subscription_payment_percentage';
const SUBSCRIPTION_TRIGGER_PERCENTAGE_KEY = 'subscription_trigger_percentage';

export const blockMBR = 28_100;
export const subscriptionsMBR = 53_700;
export const subscriptionsListMBR = 18_500;

export type ServicesKey = {
    address: Address;
    index: uint64;
};

export type ServiceStatus = uint64;

export const ServiceStatusActive: ServiceStatus = 0;
export const ServiceStatusPaused: ServiceStatus = 1;
export const ServiceStatusShutdown: ServiceStatus = 2;

export type ServicesValue = {
    status: ServiceStatus;
    interval: uint64;
    asset: AssetID;
    amount: uint64;
    passes: uint64;
    gate: uint64;
    cid: bytes<59>;
}

export type BlockListKey = {
    address: Address;
    blocked: Address;
}

export type SubscriptionKey = {
    address: Address;
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
    escrowed: uint64;
}

export type PassesKey = {
    address: Address;
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

export type Amounts = {
    akitaFee: uint64;
    triggerFee: uint64;
    leftOver: uint64;
}

// eslint-disable-next-line no-unused-vars
export class Subscriptions extends ContractWithGate {
    /** Target AVM 10 */
    programVersion = 10;

    /** version of the subscription contract */
    version = GlobalStateKey<uint64>({ key: 'version' });
    /** the app id for the Akita DAO */
    akitaDAO = GlobalStateKey<AppID>({ key: 'akita_dao' });

    // 2_500 + (400 * (40 + 88)) = 53_700
    subscriptions = BoxMap<SubscriptionKey, SubscriptionInfo>();

    /**
     * A counter for each addresses subscription index
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
    blocks = BoxMap<BlockListKey, bytes<0>>();

    passes = BoxMap<PassesKey, Address[]>({ prefix: 'p' });

    private getLatestWindowStart(startDate: uint64, interval: uint64): uint64 {
        return globals.latestTimestamp - ((globals.latestTimestamp - startDate) % interval);
    }

    private updateStreak(sender: Address, index: uint64, elseStreak: uint64): void {
        const subKey: SubscriptionKey = { address: sender, index: index };
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

    private getAmounts(amount: uint64): Amounts {
        const akitaPercentage = this.akitaDAO.value.globalState(SUBSCRIPTION_PAYMENT_PERCENTAGE_KEY) as uint64;
        let akitaFee = wideRatio([amount, akitaPercentage], [10000]);
        if (akitaFee === 0 && amount > 0) {
            akitaFee = 1;
        }

        const triggerPercentage = this.akitaDAO.value.globalState(SUBSCRIPTION_TRIGGER_PERCENTAGE_KEY) as uint64;
        let triggerFee = wideRatio([amount, triggerPercentage], [10000]);
        if (triggerFee === 0 && amount > 0) {
            triggerFee = 1;
        }

        const leftOver = amount - (akitaFee + triggerFee);

        return {
            akitaFee: akitaFee,
            triggerFee: triggerFee,
            leftOver: leftOver,
        }
    }

    private arc58OptInAkitaDAO(asset: AssetID): void {
        this.pendingGroup.addPayment({
            amount: globals.assetOptInMinBalance,
            receiver: this.app.address,
            fee: 0,
        });
        
        this.pendingGroup.addMethodCall<typeof AkitaDAO.prototype.arc58_rekeyToPlugin, void>({
            applicationID: this.akitaDAO.value,
            methodArgs: [
                AppID.fromUint64(AkitaAppIDsOptinPlugin),
                [],
                EMPTY_BYTES_32,
            ],
            fee: 0,
        });

        this.pendingGroup.addMethodCall<typeof OptInPlugin.prototype.optInToAsset, void>({
            applicationID: AppID.fromUint64(AkitaAppIDsOptinPlugin),
            methodArgs: [
                this.akitaDAO.value,
                true,
                asset,
                {
                    receiver: this.akitaDAO.value.address,
                    amount: globals.assetOptInMinBalance,
                    fee: 0,
                }
            ],
            fee: 0,
        });

        this.pendingGroup.addMethodCall<typeof AbstractedAccount.prototype.arc58_verifyAuthAddr, void>({
            applicationID: this.akitaDAO.value,
            fee: 0,
        });

        this.pendingGroup.submit();
    }

    /**
     * isBlocked checks if an address is blocked for a merchant
     * @param merchant The merchant address to be checked
     * @param address The address to be checked
     */
    @abi.readonly
    isBlocked(merchant: Address, address: Address): boolean {
        return this.blocks({ address: merchant, blocked: address }).exists;
    }

    /**
     * serviceIsActive checks if an service is shutdown
     */
    @abi.readonly
    isShutdown(merchant: Address, boxIndex: uint64): boolean {
        return this.services({ address: merchant, index: boxIndex }).value.status === ServiceStatusShutdown;
    }

    @abi.readonly
    getSubsriptionInfo(address: Address, index: uint64): SubscriptionInfoWithPasses {
        const key: SubscriptionKey = { address: address, index: index };

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

    @abi.readonly
    isFirstSubscription(address: Address): boolean {
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
        payment: PayTxn,
        interval: uint64,
        asset: AssetID,
        amount: uint64,
        passes: uint64,
        gate: uint64,
        cid: bytes<59>,
    ): uint64 {
        let index: uint64 = 0;
        if (this.serviceslist(this.txn.sender).exists) {
            index = this.serviceslist(this.txn.sender).value;
            this.serviceslist(this.txn.sender).value += 1;
        } else {
            index = 1;
            this.serviceslist(this.txn.sender).value = 1;
        }

        const boxKey: ServicesKey = { address: this.txn.sender, index: index };

        // ensure the amount is enough to take fees on
        assert(amount > 3, errs.MIN_AMOUNT_IS_THREE);
        // ensure payouts cant be too fast
        assert(interval >= 60, errs.MIN_INTERVAL_IS_SIXTY)
        // family passes have a max of 5
        assert(passes <= 5, errs.MAX_PASSES_IS_FIVE);

        const serviceCreationFee = this.akitaDAO.value.globalState(SUBSCRIPTION_SERVICE_CREATION_FEE) as uint64;

        let requiredAmount = serviceCreationFee;
        if (asset.id !== 0) {
            requiredAmount += globals.assetOptInMinBalance;
        }

        verifyPayTxn(payment, {
            amount: requiredAmount,
            receiver: this.app.address,
        });

        this.services(boxKey).value = {
            status: ServiceStatusPaused,
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
     * @param index The index of the box to be used for the subscription
     */
    pauseService(index: uint64): void {
        const boxKey: ServicesKey = { address: this.txn.sender, index: index };
        // ensure were not using zero as a box index
        // zero is reserved for non-service based subscriptions
        assert(index > 0, errs.SERVICE_INDEX_MUST_BE_ABOVE_ZERO);
        // ensure the box exists
        assert(this.services(boxKey).exists, errs.SERVICE_DOES_NOT_EXIST);
        // ensure the service isn't already shutdown
        assert(this.services(boxKey).value.status === ServiceStatusActive, errs.SERVICE_IS_NOT_ACTIVE);

        this.services(boxKey).value.status = ServiceStatusPaused;
    }

    /** 
     * activateService activates an service for a merchant
     * 
     * @param index The index of the box to be used for the subscription
     */
    activateService(index: uint64): void {
        const boxKey: ServicesKey = { address: this.txn.sender, index: index };

        // ensure the box exists
        assert(this.services(boxKey).exists, errs.SERVICE_DOES_NOT_EXIST);
        // ensure the service is currently paused
        assert(this.services(boxKey).value.status === ServiceStatusPaused, errs.SERVICE_IS_NOT_PAUSED);

        this.services(boxKey).value.status = ServiceStatusActive;
    }

    /**
     * shutdownService permanently shuts down an service for a merchant
     * it also shutsdown pre-existing subscriptions
     * @param index The index of the box to be used for the subscription
     */
    shutdownService(index: uint64): void {
        const boxKey: ServicesKey = { address: this.txn.sender, index: index };
        // ensure the box exists
        assert(this.services(boxKey).exists, errs.SERVICE_DOES_NOT_EXIST);
        // ensure the service isn't already shutdown
        assert(this.services(boxKey).value.status !== ServiceStatusShutdown, errs.SERVICE_IS_SHUTDOWN);

        this.services(boxKey).value.status = ServiceStatusShutdown;
    }

    /**
     * block blacklists an address for a merchant
     * @param payment The payment to cover mbr for blocking
     * @param address The address to be blocked
     */
    block(payment: PayTxn, address: Address): void {
        const boxKey: BlockListKey = { address: this.txn.sender, blocked: address };

        // ensure the address is not already blocked
        assert(!this.blocks(boxKey).exists, errs.USER_ALREADY_BLOCKED);

        // mbr for the blocks box map is 2_500 * (400 * 64)
        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: blockMBR,
        });

        this.blocks(boxKey).create(0)
    }

    /**
     * unblock removes an address from a merchants blocks
     * @param address The address to be unblocked
     */
    unblock(address: Address): void {
        const boxKey: BlockListKey = { address: this.txn.sender, blocked: address };

        // ensure that the address is currently blocked
        assert(this.blocks(boxKey).exists, errs.USER_NOT_BLOCKED);

        this.blocks(boxKey).delete();

        sendPayment({
            receiver: this.txn.sender,
            amount: blockMBR,
            fee: 0,
        });
    }

    subscribe(
        payment: PayTxn,
        recipient: Address,
        amount: uint64,
        interval: uint64,
        index: uint64,
        args: bytes[],
    ): void {
        // ensure the amount is enough to take fees on
        assert(amount >= 3, errs.MIN_AMOUNT_IS_THREE);
        // ensure payouts cant be too fast
        assert(interval >= 60, errs.MIN_INTERVAL_IS_SIXTY)

        const blocksKey: BlockListKey = { address: recipient, blocked: this.txn.sender };
        // ensure they aren't blocked
        assert(!this.blocks(blocksKey).exists, errs.BLOCKED);
        // gate is zero unless the service has a gate
        let gate = 0;
        // index zero is always reserved for donations
        const isDonation = index === 0;
        if (!isDonation) {
            const boxKey: ServicesKey = { address: recipient, index: index };
            // ensure the service exists
            assert(this.services(boxKey).exists, errs.SERVICE_DOES_NOT_EXIST);
            // get the service details
            const service = this.services(boxKey).value;
            // ensure the service is active
            assert(service.status === ServiceStatusActive, errs.SERVICE_IS_NOT_ACTIVE);
            // ensure its an algo subscription
            assert(service.asset.id === 0, errs.ASA_MISMATCH);
            // ensure the gate check passes
            assert(this.gate(this.txn.sender, service.gate, args), errs.FAILED_GATE);
            // overwrite the details for the subscription
            amount = service.amount;
            interval = service.interval;
            gate = service.gate;
        }

        let algoMBRFee = subscriptionsMBR;
        let subIndex = 0;
        
        const firstSubscription = this.subscriptionslist(this.txn.sender).exists;
        if (firstSubscription) {
            this.subscriptionslist(this.txn.sender).value = 0;
            algoMBRFee += subscriptionsListMBR;
        } else {
            this.subscriptionslist(this.txn.sender).value += 1;
            subIndex = this.subscriptionslist(this.txn.sender).value;
        }

        const subscriptionKey: SubscriptionKey = { address: this.txn.sender, index: subIndex };

        this.subscriptions(subscriptionKey).value = {
            recipient: recipient,
            index: index,
            startDate: globals.latestTimestamp,
            amount: amount,
            interval: interval,
            asset: AssetID.fromUint64(0),
            gate: gate,
            lastPayment: globals.latestTimestamp,
            streak: 1,
            escrowed: 0,
        };

        const amounts = this.getAmounts(amount);

        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: {
                greaterThanEqualTo: (amount + algoMBRFee),
            },
        });

        this.pendingGroup.addPayment({
            receiver: this.akitaDAO.value.address,
            amount: (amounts.akitaFee + amounts.triggerFee),
            fee: 0,
        });

        this.pendingGroup.addPayment({
            receiver: recipient,
            amount: amounts.leftOver,
            fee: 0,
        });

        this.pendingGroup.submit();
    }

    optin(payment: PayTxn, asset: AssetID): void {
        // ensure the asset is not already opted in
        assert(!this.app.address.isOptedInToAsset(asset), errs.ALREADY_OPTED_IN);

        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: globals.assetOptInMinBalance,
        });

        sendAssetTransfer({
            assetReceiver: this.app.address,
            xferAsset: asset,
            assetAmount: 0,
            fee: 0,
        });
    }

    subscribeAsa(
        payment: PayTxn,
        assetXfer: AssetTransferTxn,
        recipient: Address,
        amount: uint64,
        interval: uint64,
        index: uint64,
        args: bytes[],
    ): void {
        // ensure the amount is enough to take fees on
        assert(amount > 3, errs.MIN_AMOUNT_IS_THREE);
        // ensure payouts cant be too fast
        assert(interval >= 60, errs.MIN_INTERVAL_IS_SIXTY)

        const blocksKey: BlockListKey = { address: recipient, blocked: this.txn.sender };
        // ensure they aren't blocked
        assert(!this.blocks(blocksKey).exists, errs.BLOCKED);
        // gate is zero unless the service has a gate
        let gate = 0;
        // index zero is always reserved for donations
        const isDonation = index === 0;
        if (!isDonation) {
            const boxKey: ServicesKey = { address: recipient, index: index };
            // ensure the service exists
            assert(this.services(boxKey).exists, errs.SERVICE_DOES_NOT_EXIST);
            // get the service details
            const service = this.services(boxKey).value;
            // ensure the service is active
            assert(service.status === ServiceStatusActive, errs.SERVICE_IS_NOT_ACTIVE);
            // ensure its an algo subscription
            assert(service.asset === assetXfer.xferAsset, errs.ASA_MISMATCH);
            // ensure the gate check passes
            assert(this.gate(this.txn.sender, service.gate, args), errs.FAILED_GATE);
            // overwrite the details for the subscription
            amount = service.amount;
            interval = service.interval;
            gate = service.gate;
        }

        let algoMBRFee = subscriptionsMBR;
        let subIndex = 0;

        const firstSubscription = this.subscriptionslist(this.txn.sender).exists;
        if (firstSubscription) {
            this.subscriptionslist(this.txn.sender).value = 0;
            algoMBRFee += subscriptionsListMBR;
        } else {
            this.subscriptionslist(this.txn.sender).value += 1;
            subIndex = this.subscriptionslist(this.txn.sender).value;
        }
        
        if (!this.akitaDAO.value.address.isOptedInToAsset(assetXfer.xferAsset)) {
            this.arc58OptInAkitaDAO(assetXfer.xferAsset);
            algoMBRFee += globals.assetOptInMinBalance;
        }

        const subscriptionKey: SubscriptionKey = { address: this.txn.sender, index: subIndex };

        this.subscriptions(subscriptionKey).value = {
            recipient: recipient,
            index: index,
            startDate: globals.latestTimestamp,
            amount: amount,
            interval: interval,
            asset: assetXfer.xferAsset,
            gate: gate,
            lastPayment: globals.latestTimestamp,
            streak: 1,
            escrowed: 0,
        };

        const amounts = this.getAmounts(amount);

        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: {
                greaterThanEqualTo: algoMBRFee,
            },
        });

        verifyAssetTransferTxn(assetXfer, {
            assetReceiver: this.app.address,
            assetAmount: amount,
        });

        this.pendingGroup.addAssetTransfer({
            assetReceiver: this.akitaDAO.value.address,
            xferAsset: assetXfer.xferAsset,
            assetAmount: (amounts.akitaFee + amounts.triggerFee),
            fee: 0,
        });

        this.pendingGroup.addAssetTransfer({
            assetReceiver: recipient,
            xferAsset: assetXfer.xferAsset,
            assetAmount: amounts.leftOver,
            fee: 0,
        });

        this.pendingGroup.submit();
    }

    deposit(payment: PayTxn, index: uint64): void {
        const subKey: SubscriptionKey = { address: this.txn.sender, index: index };

        assert(this.subscriptions(subKey).exists, errs.SUBSCRIPTION_DOES_NOT_EXIST);

        const sub = this.subscriptions(subKey).value;

        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: sub.amount,
        });

        this.subscriptions(subKey).value.escrowed += sub.amount;
    }

    depositAsa(assetXfer: AssetTransferTxn, index: uint64): void {
        const subKey: SubscriptionKey = { address: this.txn.sender, index: index };

        assert(this.subscriptions(subKey).exists, errs.SUBSCRIPTION_DOES_NOT_EXIST);

        const sub = this.subscriptions(subKey).value;

        verifyAssetTransferTxn(assetXfer, {
            assetReceiver: this.app.address,
            assetAmount: sub.amount,
        });

        this.subscriptions(subKey).value.escrowed += sub.amount;
    }

    withdraw(index: uint64, amount: uint64): void {
        const subKey: SubscriptionKey = { address: this.txn.sender, index: index };

        assert(this.subscriptions(subKey).exists, errs.SUBSCRIPTION_DOES_NOT_EXIST);

        const sub = this.subscriptions(subKey).value;

        assert(sub.escrowed > amount, errs.NOT_ENOUGH_FUNDS);

        if (sub.asset.id !== 0) {
            sendAssetTransfer({
                assetReceiver: this.txn.sender,
                xferAsset: sub.asset,
                assetAmount: amount,
                fee: 0,
            })
        } else {
            sendPayment({
                receiver: this.txn.sender,
                amount: amount,
                fee: 0,
            });
        }

        this.subscriptions(subKey).value.escrowed = 0;
    }

    triggerPayment(address: Address, index: uint64, args: bytes[]): void {
        const subscriptionsKey: SubscriptionKey = { address: address, index: index };

        // ensure a subscription exists
        assert(this.subscriptions(subscriptionsKey).exists);

        const sub = this.subscriptions(subscriptionsKey).value;

        const blocksKey: BlockListKey = { address: sub.recipient, blocked: address };

        // ensure they are not blocked
        assert(!this.blocks(blocksKey).exists, errs.BLOCKED);

        if (index > 0) {
            const servicesKey: ServicesKey = { address: sub.recipient, index: sub.index };
            // ensure the service isn't shutdown
            assert(this.services(servicesKey).value.status !== ServiceStatusShutdown, errs.SERVICE_IS_SHUTDOWN);
        }

        // ensure that the current window has not already had a payment
        assert(sub.lastPayment < this.getLatestWindowStart(sub.startDate, sub.interval), errs.BAD_WINDOW);
        // ensure the user has enough funds in escrow
        assert(sub.escrowed > sub.amount, errs.NOT_ENOUGH_FUNDS);

        const isAsa = sub.asset.id !== 0;
        const amounts = this.getAmounts(sub.amount);

        if (isAsa) {
            this.pendingGroup.addAssetTransfer({
                assetReceiver: this.akitaDAO.value.address,
                xferAsset: sub.asset,
                assetAmount: amounts.akitaFee,
                fee: 0,
            });

            this.pendingGroup.addAssetTransfer({
                assetReceiver: this.txn.sender,
                xferAsset: sub.asset,
                assetAmount: amounts.triggerFee,
                fee: 0,
            });

            this.pendingGroup.addAssetTransfer({
                assetReceiver: sub.recipient,
                xferAsset: sub.asset,
                assetAmount: amounts.leftOver,
                fee: 0,
            });
        } else {
            // mbr payment for subscriptions & subscriptionslist boxes
            this.pendingGroup.addPayment({
                receiver: this.app.address,
                amount: amounts.akitaFee,
                fee: 0,
            });

            this.pendingGroup.addPayment({
                receiver: this.txn.sender,
                amount: amounts.triggerFee,
                fee: 0,
            });

            this.pendingGroup.addPayment({
                receiver: sub.recipient,
                amount: amounts.leftOver,
                fee: 0,
            });
        }

        this.pendingGroup.submit();
        this.updateStreak(address, index, 1);
        this.subscriptions(subscriptionsKey).value.lastPayment = globals.latestTimestamp;
    }

    streakCheck(sender: Address, index: uint64): void {
        this.updateStreak(sender, index, 0);
    }

    setPasses(index: uint64, addresses: Address[]): void {
        assert(index > 0, errs.NO_DONATIONS)
        const subscriptionsKey: SubscriptionKey = { address: this.txn.sender, index: index };

        assert(this.subscriptions(subscriptionsKey).exists, errs.SUBSCRIPTION_DOES_NOT_EXIST)

        const sub = this.subscriptions(subscriptionsKey).value;

        const serviceKey: ServicesKey = { address: sub.recipient, index: index };
        const service = this.services(serviceKey).value;

        assert(service.status !== ServiceStatusShutdown, errs.SERVICE_IS_SHUTDOWN);
        assert(service.passes >= addresses.length, errs.PASS_COUNT_OVERFLOW)

        for (let i = 0; i < addresses.length; i += 1) {
            assert(!this.blocks({ address: sub.recipient, blocked: addresses[i] }).exists, errs.BLOCKED);
        }

        this.passes(subscriptionsKey).value = addresses;
    }
}
