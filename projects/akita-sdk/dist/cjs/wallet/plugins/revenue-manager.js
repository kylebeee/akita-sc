"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevenueManagerPluginSDK = void 0;
const RevenueManagerPluginClient_1 = require("../../generated/RevenueManagerPluginClient");
const base_1 = require("../../base");
const algosdk_1 = __importDefault(require("algosdk"));
const utils_1 = require("../utils");
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const assetOptInCost = 100000; // This is the cost for asset opt-in, adjust as necessary
class RevenueManagerPluginSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: RevenueManagerPluginClient_1.RevenueManagerPluginFactory, ...params });
    }
    optIn(args) {
        const methodName = 'optIn';
        if (args === undefined) {
            // Called without arguments - return selector for method restrictions
            return (spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns: utils_1.getTxns
            });
        }
        const { sender, signer, assets } = args;
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return (spendingAddress) => ({
            appId: this.client.appId,
            selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
            getTxns: async ({ wallet }) => {
                const rekeyBack = args.rekeyBack ?? true;
                const mbrPayment = this.client.algorand.createTransaction.payment({
                    ...sendParams,
                    amount: (0, algokit_utils_1.microAlgo)(assetOptInCost * assets.length),
                    receiver: spendingAddress ? spendingAddress : algosdk_1.default.getApplicationAddress(wallet),
                });
                const params = (await this.client.params.optIn({
                    ...sendParams,
                    args: { wallet, rekeyBack, assets, mbrPayment }
                }));
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
    newReceiveEscrow(args) {
        const methodName = 'newReceiveEscrow';
        if (args === undefined) {
            // Called without arguments - return selector for method restrictions
            return (spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns: utils_1.getTxns
            });
        }
        const { sender, signer, escrow, source, allocatable, optinAllowed, splits } = args;
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return (spendingAddress) => ({
            appId: this.client.appId,
            selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
            getTxns: async ({ wallet }) => {
                const rekeyBack = args.rekeyBack ?? true;
                const params = (await this.client.params.newReceiveEscrow({
                    ...sendParams,
                    args: { wallet, rekeyBack, escrow, source, allocatable, optinAllowed, splits }
                }));
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
    newReceiveEscrowWithRef(args) {
        const methodName = 'newReceiveEscrowWithRef';
        if (args === undefined) {
            // Called without arguments - return selector for method restrictions
            return (spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns: utils_1.getTxns
            });
        }
        const { sender, signer, escrow, source, allocatable, optinAllowed, splitRef } = args;
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return (spendingAddress) => ({
            appId: this.client.appId,
            selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
            getTxns: async ({ wallet }) => {
                const rekeyBack = args.rekeyBack ?? true;
                const params = (await this.client.params.newReceiveEscrowWithRef({
                    ...sendParams,
                    args: { wallet, rekeyBack, escrow, source, allocatable, optinAllowed, splitRef }
                }));
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
    startEscrowDisbursement(args) {
        const methodName = 'startEscrowDisbursement';
        if (args === undefined) {
            // Called without arguments - return selector for method restrictions
            return (spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns: utils_1.getTxns
            });
        }
        const { sender, signer } = args;
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return (spendingAddress) => ({
            appId: this.client.appId,
            selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
            getTxns: async ({ wallet }) => {
                const rekeyBack = args.rekeyBack ?? true;
                const params = (await this.client.params.startEscrowDisbursement({
                    ...sendParams,
                    args: { wallet, rekeyBack }
                }));
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
    processEscrowAllocation(args) {
        const methodName = 'processEscrowAllocation';
        if (args === undefined) {
            // Called without arguments - return selector for method restrictions
            return (spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns: utils_1.getTxns
            });
        }
        const { sender, signer, ids } = args;
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return (spendingAddress) => ({
            appId: this.client.appId,
            selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
            getTxns: async ({ wallet }) => {
                const rekeyBack = args.rekeyBack ?? true;
                const params = (await this.client.params.processEscrowAllocation({
                    ...sendParams,
                    args: { wallet, rekeyBack, ids }
                }));
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
    finalizeEscrowDisbursement(args) {
        const methodName = 'finalizeEscrowDisbursement';
        if (args === undefined) {
            // Called without arguments - return selector for method restrictions
            return (spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns: utils_1.getTxns
            });
        }
        const { sender, signer, ids } = args;
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return (spendingAddress) => ({
            appId: this.client.appId,
            selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
            getTxns: async ({ wallet }) => {
                const rekeyBack = args.rekeyBack ?? true;
                const params = (await this.client.params.finalizeEscrowDisbursement({
                    ...sendParams,
                    args: { wallet, rekeyBack, ids }
                }));
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
}
exports.RevenueManagerPluginSDK = RevenueManagerPluginSDK;
//# sourceMappingURL=revenue-manager.js.map