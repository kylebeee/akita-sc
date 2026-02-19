"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayPluginSDK = void 0;
const base_1 = require("../../base");
const PayPluginClient_1 = require("../../generated/PayPluginClient");
const utils_1 = require("../utils");
class PayPluginSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: PayPluginClient_1.PayPluginFactory, ...params });
    }
    pay(args) {
        const methodName = 'pay';
        if (args === undefined) {
            // Called without arguments - return selector for method restrictions
            return (spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns: utils_1.getTxns
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
exports.PayPluginSDK = PayPluginSDK;
//# sourceMappingURL=pay.js.map