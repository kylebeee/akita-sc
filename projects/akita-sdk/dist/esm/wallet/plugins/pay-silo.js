import { BaseSDK } from "../../base";
import { PaySiloPluginFactory } from "../../generated/PaySiloPluginClient";
import { getTxns } from "../utils";
export class PaySiloPluginSDK extends BaseSDK {
    constructor(params) {
        super({ factory: PaySiloPluginFactory, ...params });
    }
    pay(args) {
        const methodName = 'pay';
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
                const params = await this.client.params.pay({
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
//# sourceMappingURL=pay-silo.js.map