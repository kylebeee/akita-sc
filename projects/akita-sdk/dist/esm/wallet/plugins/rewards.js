import { BaseSDK } from "../../base";
import { RewardsPluginFactory } from "../../generated/RewardsPluginClient";
import { getTxns } from "../utils";
export class RewardsPluginSDK extends BaseSDK {
    constructor(params) {
        super({ factory: RewardsPluginFactory, ...params });
    }
    claimRewards(args) {
        const methodName = 'claimRewards';
        if (args === undefined) {
            return (spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns
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
//# sourceMappingURL=rewards.js.map