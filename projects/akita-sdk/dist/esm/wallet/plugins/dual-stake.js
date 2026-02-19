"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DualStakePluginSDK = void 0;
const base_1 = require("../../base");
const DualStakePluginClient_1 = require("../../generated/DualStakePluginClient");
const utils_1 = require("../utils");
class DualStakePluginSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: DualStakePluginClient_1.DualStakePluginFactory, ...params });
    }
    mint(args) {
        const methodName = 'mint';
        if (args === undefined) {
            return (_spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns: utils_1.getTxns
            });
        }
        const { sender, signer } = args;
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return (_spendingAddress) => ({
            appId: this.client.appId,
            selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
            getTxns: async ({ wallet }) => {
                const rekeyBack = args.rekeyBack ?? true;
                const params = await this.client.params.mint({
                    ...sendParams,
                    args: { wallet, rekeyBack, ...args },
                });
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
    redeem(args) {
        const methodName = 'redeem';
        if (args === undefined) {
            return (_spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns: utils_1.getTxns
            });
        }
        const { sender, signer } = args;
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return (_spendingAddress) => ({
            appId: this.client.appId,
            selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
            getTxns: async ({ wallet }) => {
                const rekeyBack = args.rekeyBack ?? true;
                const params = await this.client.params.redeem({
                    ...sendParams,
                    args: { wallet, rekeyBack, ...args },
                });
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
}
exports.DualStakePluginSDK = DualStakePluginSDK;
//# sourceMappingURL=dual-stake.js.map