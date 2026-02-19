"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsaMintPluginSDK = void 0;
const base_1 = require("../../base");
const AsaMintPluginClient_1 = require("../../generated/AsaMintPluginClient");
const algosdk_1 = __importDefault(require("algosdk"));
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const utils_1 = require("../utils");
const assetCreateCost = 100000;
class AsaMintPluginSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: AsaMintPluginClient_1.AsaMintPluginFactory, ...params });
    }
    mint(args) {
        const methodName = 'mint';
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
                    amount: (0, algokit_utils_1.microAlgo)(assetCreateCost * assets.length),
                    receiver: spendingAddress ? spendingAddress : algosdk_1.default.getApplicationAddress(wallet),
                });
                const assetsTuple = assets.map(asset => [
                    asset.assetName,
                    asset.unitName,
                    asset.total,
                    asset.decimals,
                    asset.manager,
                    asset.reserve,
                    asset.freeze,
                    asset.clawback,
                    asset.defaultFrozen,
                    asset.url,
                ]);
                const params = (await this.client.params.mint({
                    ...sendParams,
                    args: { wallet, assets: assetsTuple, rekeyBack, mbrPayment },
                }));
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
}
exports.AsaMintPluginSDK = AsaMintPluginSDK;
//# sourceMappingURL=asa-mint.js.map