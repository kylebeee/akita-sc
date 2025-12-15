import { BaseSDK } from "../../base";
import { GatePluginFactory } from "../../generated/GatePluginClient";
import { getTxns } from "../utils";
export class GatePluginSDK extends BaseSDK {
    constructor(params) {
        super({ factory: GatePluginFactory, ...params });
    }
    register(args) {
        const methodName = 'register';
        if (args === undefined) {
            return (_spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns
            });
        }
        const { sender, signer } = args;
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return (_spendingAddress) => ({
            appId: this.client.appId,
            selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
            getTxns: async ({ wallet }) => {
                const rekeyBack = args.rekeyBack ?? true;
                const params = await this.client.params.register({
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
//# sourceMappingURL=gate.js.map