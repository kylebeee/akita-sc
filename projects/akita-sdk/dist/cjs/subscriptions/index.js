"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsSDK = void 0;
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const algokit_utils_2 = require("@algorandfoundation/algokit-utils");
const algosdk_1 = require("algosdk");
const base_1 = require("../base");
const config_1 = require("../config");
const SubscriptionsClient_1 = require("../generated/SubscriptionsClient");
const utils_1 = require("../wallet/utils");
const utils_2 = require("./utils");
const utils_3 = require("../utils");
const constants_1 = require("./constants");
__exportStar(require("./constants"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./utils"), exports);
class SubscriptionsSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: SubscriptionsClient_1.SubscriptionsFactory, ...params }, config_1.ENV_VAR_NAMES.SUBSCRIPTIONS_APP_ID);
        this.serviceMapKeyGenerator = ({ address, id }) => (`${address}${id}`);
        this.services = new utils_1.ValueMap(this.serviceMapKeyGenerator);
    }
    /**
     * Get the cost to create a new service from the contract
     */
    async newServiceCost({ sender, signer, asset = 0n } = {}) {
        const sendParams = this.getSendParams({ sender, signer });
        return (await this.client.newServiceCost({ ...sendParams, args: { asset } }));
    }
    async blockCost({ sender, signer } = {}) {
        const sendParams = this.getSendParams({ sender, signer });
        return await this.client.blockCost({ ...sendParams, args: [] });
    }
    /**
     * Get the cost to create a new subscription from the contract
     */
    async newSubscriptionCost({ sender, signer, recipient, asset = 0n, serviceId = 0n }) {
        const sendParams = this.getSendParams({ sender, signer });
        return (await this.client.newSubscriptionCost({ ...sendParams, args: { recipient, asset, serviceId } }));
    }
    async isBlocked({ sender, signer, address, blocked }) {
        const sendParams = this.getSendParams({ sender, signer });
        return (await this.client.isBlocked({ ...sendParams, args: { address, blocked } }));
    }
    async isShutdown({ sender, signer, address, id }) {
        const sendParams = this.getSendParams({ sender, signer });
        return (await this.client.isShutdown({ ...sendParams, args: { address, id } }));
    }
    async getServices() {
        const rawServices = await this.client.state.box.services.getMap();
        const transformedEntries = Array.from(rawServices.entries()).map(([key, value]) => [
            key,
            {
                ...value,
                highlightColor: (0, utils_2.bytesToHexColor)(value.highlightColor)
            }
        ]);
        this.services = new utils_1.ValueMap(this.serviceMapKeyGenerator, new Map(transformedEntries));
        return this.services;
    }
    async getService({ sender, signer, address, id }) {
        const sendParams = this.getSendParams({ sender, signer });
        const result = (await this.client.getService({ ...sendParams, args: { address, id } }));
        return {
            ...result,
            highlightColor: (0, utils_2.bytesToHexColor)(result.highlightColor)
        };
    }
    async getServicesByAddress({ sender, signer, address, start = 0n, windowSize = 20n }) {
        const sendParams = this.getSendParams({ sender, signer });
        const result = await this.client.getServicesByAddress({ ...sendParams, args: { address, start, windowSize } });
        // The return is an array of tuples, convert to Service objects
        const tuples = result;
        return tuples.map(tuple => {
            const result = (0, SubscriptionsClient_1.ServiceFromTuple)(tuple);
            return {
                ...result,
                highlightColor: (0, utils_2.bytesToHexColor)(result.highlightColor)
            };
        });
    }
    async getSubscription({ sender, signer, address, id }) {
        const sendParams = this.getSendParams({ sender, signer });
        const result = (await this.client.mustGetSubscription({ ...sendParams, args: { key: { address, id } } }));
        return {
            ...result,
            lastPayment: (0, utils_3.convertToUnixTimestamp)(result.lastPayment)
        };
    }
    async getSubscriptionWithDetails({ sender, signer, address, id }) {
        const sendParams = this.getSendParams({ sender, signer });
        const result = (await this.client.getSubscriptionWithDetails({ ...sendParams, args: { key: { address, id } } }));
        return {
            ...result,
            highlightColor: (0, utils_2.bytesToHexColor)(result.highlightColor),
            lastPayment: (0, utils_3.convertToUnixTimestamp)(result.lastPayment),
        };
    }
    async isFirstSubscription({ sender, signer, address }) {
        const sendParams = this.getSendParams({ sender, signer });
        return (await this.client.isFirstSubscription({ ...sendParams, args: { address } }));
    }
    async getSubscriptionList({ sender, signer, address }) {
        const sendParams = this.getSendParams({ sender, signer });
        return (await this.client.getSubscriptionList({ ...sendParams, args: { address } }));
    }
    async getServiceList({ sender, signer, address }) {
        const sendParams = this.getSendParams({ sender, signer });
        return (await this.client.getServiceList({ ...sendParams, args: { address } }));
    }
    async newService({ sender, signer, asset = 0n, passes = 0n, gateId = 0n, ...rest }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        (0, utils_2.validateHexColor)(rest.highlightColor);
        const highlightColor = (0, utils_2.hexColorToBytes)(rest.highlightColor);
        // Use contract method to get the exact cost
        const paymentAmount = await this.newServiceCost({ ...sendParams, asset });
        const payment = this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(paymentAmount),
            receiver: this.client.appAddress.toString(),
        });
        if (rest.description.length === 0) {
            throw new Error('Description cannot be empty');
        }
        const group = this.client.newGroup();
        group.newService({
            ...sendParams,
            args: {
                payment,
                asset,
                passes,
                gateId,
                ...rest,
                highlightColor
            }
        });
        // chunk description, max is: 3151
        if (rest.description.length > constants_1.MAX_DESCRIPTION_LENGTH) {
            throw new Error(`Description length exceeds maximum of ${constants_1.MAX_DESCRIPTION_LENGTH} characters`);
        }
        // [selector:4][offset:8][data:>=2036]
        // setServiceDescription(offset: uint64, data: bytes): void {
        if (rest.description.length > constants_1.MAX_DESCRIPTION_CHUNK_SIZE) {
            group.setServiceDescription({
                ...sendParams,
                args: {
                    offset: 0n,
                    data: Buffer.from(rest.description).subarray(0, constants_1.MAX_DESCRIPTION_CHUNK_SIZE)
                }
            });
            group.setServiceDescription({
                ...sendParams,
                args: {
                    offset: BigInt(constants_1.MAX_DESCRIPTION_CHUNK_SIZE),
                    data: Buffer.from(rest.description).subarray(constants_1.MAX_DESCRIPTION_CHUNK_SIZE)
                }
            });
        }
        else {
            group.setServiceDescription({
                ...sendParams,
                args: {
                    offset: 0n,
                    data: Buffer.from(rest.description)
                }
            });
        }
        group.activateService({
            ...sendParams,
            args: []
        });
        const result = await group.send({ ...sendParams });
        return result.returns[0];
    }
    async pauseService({ sender, signer, id }) {
        const sendParams = this.getSendParams({ sender, signer });
        const group = this.client.newGroup();
        group.pauseService({
            ...sendParams,
            args: { id }
        });
        group.opUp({
            ...sendParams,
            args: {},
            maxFee: (0, algokit_utils_2.microAlgos)(1000),
        });
        await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
    }
    async shutdownService({ sender, signer, id }) {
        const sendParams = this.getSendParams({ sender, signer });
        const group = this.client.newGroup();
        group.shutdownService({
            ...sendParams,
            args: { id }
        });
        group.opUp({
            ...sendParams,
            args: {},
            maxFee: (0, algokit_utils_2.microAlgos)(1000),
        });
        await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
    }
    async block({ sender, signer, block }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const paymentAmount = await this.blockCost({ sender, signer });
        const payment = this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(paymentAmount),
            receiver: this.client.appAddress.toString(),
        });
        const group = this.client.newGroup();
        group.block({
            ...sendParams,
            args: {
                payment,
                blocked: block
            }
        });
        group.opUp({
            ...sendParams,
            args: {},
            maxFee: (0, algokit_utils_2.microAlgos)(1000),
        });
        await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
    }
    async unblock({ sender, signer, blocked }) {
        const sendParams = this.getSendParams({ sender, signer });
        const group = this.client.newGroup();
        group.unblock({
            ...sendParams,
            args: { blocked }
        });
        group.opUp({
            ...sendParams,
            args: {},
            maxFee: (0, algokit_utils_2.microAlgos)(1000),
        });
        await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
    }
    async subscribe({ sender, signer, asset = 0n, serviceId = 0n, initialDepositAmount = 0n, amount, interval, recipient, gateTxn }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Debug address validation
        console.log('[subscribe] recipient:', recipient, 'type:', typeof recipient, 'isValidAddress:', (0, algosdk_1.isValidAddress)(recipient));
        console.log('[subscribe] sender:', sendParams.sender, 'type:', typeof sendParams.sender, 'constructor:', sendParams.sender?.constructor?.name);
        console.log('[subscribe] appAddress:', this.client.appAddress, 'type:', typeof this.client.appAddress, 'constructor:', this.client.appAddress?.constructor?.name);
        console.log('[subscribe] appAddress.toString():', this.client.appAddress?.toString?.());
        const isAlgoSubscription = asset === 0n;
        const isGated = gateTxn !== undefined;
        // Use contract method to get the exact subscription cost
        const subscribeCost = await this.newSubscriptionCost({
            ...sendParams,
            recipient,
            asset,
            serviceId
        });
        // For algo subscriptions, payment includes the subscription amount
        // For ASA subscriptions, payment only covers MBR
        const paymentAmount = isAlgoSubscription
            ? BigInt(amount) + subscribeCost + BigInt(initialDepositAmount)
            : subscribeCost;
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(paymentAmount),
            receiver: this.client.appAddress.toString(), // Convert Address to string to avoid instanceof issues
        });
        const group = this.client.newGroup();
        if (isAlgoSubscription) {
            if (isGated) {
                group.gatedSubscribe({
                    ...sendParams,
                    args: {
                        payment,
                        gateTxn,
                        amount,
                        interval: BigInt(interval),
                        recipient,
                        serviceId,
                    }
                });
            }
            else {
                group.subscribe({
                    ...sendParams,
                    args: {
                        payment,
                        amount,
                        interval: BigInt(interval),
                        recipient,
                        serviceId,
                    }
                });
            }
        }
        else {
            const assetTransfer = this.client.algorand.createTransaction.assetTransfer({
                ...sendParams,
                amount: 0n,
                assetId: asset,
                receiver: this.client.appAddress.toString(),
            });
            if (isGated) {
                group.gatedSubscribeAsa({
                    ...sendParams,
                    args: {
                        payment,
                        gateTxn,
                        amount,
                        interval: BigInt(interval),
                        recipient,
                        serviceId,
                    }
                });
            }
            else {
                group.subscribeAsa({
                    ...sendParams,
                    args: {
                        payment,
                        assetXfer: assetTransfer,
                        amount,
                        interval: BigInt(interval),
                        recipient,
                        serviceId,
                    }
                });
            }
        }
        // Add opUp calls to get more reference slots
        group.opUp({
            ...sendParams,
            args: {},
            maxFee: (0, algokit_utils_2.microAlgos)(1000),
        });
        group.opUp({
            ...sendParams,
            args: {},
            maxFee: (0, algokit_utils_2.microAlgos)(1000),
            note: '1'
        });
        const result = await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
        const subscriptionId = result.returns[0];
        if (subscriptionId === undefined) {
            throw new Error('Subscription failed, no subscription ID returned');
        }
        return subscriptionId;
    }
    async unsubscribe({ sender, signer, id }) {
        const sendParams = this.getSendParams({ sender, signer });
        const group = this.client.newGroup();
        group.unsubscribe({
            ...sendParams,
            args: { id: BigInt(id) }
        });
        group.opUp({
            ...sendParams,
            args: {},
            maxFee: (0, algokit_utils_2.microAlgos)(1000),
        });
        await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
    }
    async deposit({ sender, signer, asset = 0n, amount, id }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const group = this.client.newGroup();
        if (asset !== 0n) {
            const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
                ...sendParams,
                amount: BigInt(amount),
                assetId: BigInt(asset),
                receiver: this.client.appAddress.toString(),
            });
            group.depositAsa({
                ...sendParams,
                args: {
                    assetXfer,
                    id: BigInt(id)
                }
            });
        }
        else {
            const payment = await this.client.algorand.createTransaction.payment({
                ...sendParams,
                amount: (0, algokit_utils_1.microAlgo)(amount),
                receiver: this.client.appAddress.toString(),
            });
            group.deposit({
                ...sendParams,
                args: {
                    payment,
                    id: BigInt(id)
                }
            });
        }
        group.opUp({
            ...sendParams,
            args: {},
            maxFee: (0, algokit_utils_2.microAlgos)(1000),
        });
        await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
    }
    async withdraw({ sender, signer, asset = 0n, amount, id }) {
        const sendParams = this.getSendParams({ sender, signer });
        const group = this.client.newGroup();
        group.withdraw({
            ...sendParams,
            args: {
                amount: BigInt(amount),
                id: BigInt(id)
            }
        });
        group.opUp({
            ...sendParams,
            args: {},
            maxFee: (0, algokit_utils_2.microAlgos)(1000),
        });
        await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
    }
    async triggerPayment({ sender, signer, address, id, gateTxn }) {
        const sendParams = this.getSendParams({ sender, signer });
        const group = this.client.newGroup();
        if (gateTxn !== undefined) {
            group.gatedTriggerPayment({
                ...sendParams,
                args: {
                    gateTxn,
                    key: { address, id }
                }
            });
        }
        else {
            group.triggerPayment({
                ...sendParams,
                args: { key: { address, id } }
            });
        }
        group.opUp({
            ...sendParams,
            args: {},
            maxFee: (0, algokit_utils_2.microAlgos)(1000),
        });
        await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
    }
    async setPasses({ sender, signer, id, passes }) {
        const sendParams = this.getSendParams({ sender, signer });
        const group = this.client.newGroup();
        group.setPasses({
            ...sendParams,
            args: {
                id: BigInt(id),
                addresses: passes
            }
        });
        group.opUp({
            ...sendParams,
            args: {},
            maxFee: (0, algokit_utils_2.microAlgos)(1000),
        });
        await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
    }
}
exports.SubscriptionsSDK = SubscriptionsSDK;
//# sourceMappingURL=index.js.map