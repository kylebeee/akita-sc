"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardsPluginSDK = void 0;
const base_1 = require("../../base");
const RewardsPluginClient_1 = require("../../generated/RewardsPluginClient");
const utils_1 = require("../utils");
class RewardsPluginSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: RewardsPluginClient_1.RewardsPluginFactory, ...params });
    }
    claimRewards(args) {
        const methodName = 'claimRewards';
        if (args === undefined) {
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
                const params = await this.client.params.claimRewards({
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
exports.RewardsPluginSDK = RewardsPluginSDK;
//# sourceMappingURL=rewards.js.map