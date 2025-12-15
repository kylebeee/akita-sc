import { BaseSDK } from "../../base";
import { AkitaSocialPluginFactory } from "../../generated/AkitaSocialPluginClient";
import { getTxns } from "../utils";
export class SocialPluginSDK extends BaseSDK {
    constructor(params) {
        super({ factory: AkitaSocialPluginFactory, ...params });
    }
    follow(args) {
        const methodName = 'follow';
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
                const params = await this.client.params.follow({
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
    unfollow(args) {
        const methodName = 'unfollow';
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
                const params = await this.client.params.unfollow({
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
    post(args) {
        const methodName = 'post';
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
                const params = await this.client.params.post({
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
//# sourceMappingURL=social.js.map