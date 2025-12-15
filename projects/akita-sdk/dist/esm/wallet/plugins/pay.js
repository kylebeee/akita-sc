import { BaseSDK } from "../../base";
import { PayPluginFactory } from "../../generated/PayPluginClient";
import { getTxns } from "../utils";
export class PayPluginSDK extends BaseSDK {
    constructor(params) {
        super({ factory: PayPluginFactory, ...params });
    }
    pay(args) {
        const methodName = 'pay';
        if (args === undefined) {
            // Called without arguments - return selector for method restrictions
            return (spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns
            });
        }
        const { sender, signer, payments } = args;
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return (spendingAddress) => ({
            appId: this.client.appId,
            selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
            getTxns: async ({ wallet }) => {
                const rekeyBack = args.rekeyBack ?? true;
                const paymentsTuple = payments.map(payment => [
                    payment.receiver.toString(),
                    payment.asset,
                    payment.amount,
                ]);
                const params = (await this.client.params.pay({
                    ...sendParams,
                    args: { wallet, payments: paymentsTuple, rekeyBack },
                }));
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
}
//# sourceMappingURL=pay.js.map