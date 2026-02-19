"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaySiloPluginSDK = void 0;
const base_1 = require("../../base");
const PaySiloPluginClient_1 = require("../../generated/PaySiloPluginClient");
const utils_1 = require("../utils");
class PaySiloPluginSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: PaySiloPluginClient_1.PaySiloPluginFactory, ...params });
    }
    pay(args) {
        const methodName = 'pay';
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
exports.PaySiloPluginSDK = PaySiloPluginSDK;
//# sourceMappingURL=pay-silo.js.map