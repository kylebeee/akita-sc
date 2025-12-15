import { BaseSDK } from "../../base";
import { PaySiloFactoryPluginFactory } from "../../generated/PaySiloFactoryPluginClient";
import { getTxns } from "../utils";
export class PaySiloFactoryPluginSDK extends BaseSDK {
    constructor(params) {
        super({ factory: PaySiloFactoryPluginFactory, ...params });
    }
    mint(args) {
        const methodName = 'mint';
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
}
//# sourceMappingURL=pay-silo-factory.js.map