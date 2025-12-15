"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptInPluginSDK = void 0;
const base_1 = require("../../base");
const OptInPluginClient_1 = require("../../generated/OptInPluginClient");
const algosdk_1 = __importDefault(require("algosdk"));
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const utils_1 = require("../utils");
const assetOptInCost = 100000; // This is the cost for asset opt-in, adjust as necessary
class OptInPluginSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: OptInPluginClient_1.OptInPluginFactory, ...params });
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
                    args: { wallet, ...args, rekeyBack, mbrPayment },
                }));
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
}
exports.OptInPluginSDK = OptInPluginSDK;
//# sourceMappingURL=optin.js.map