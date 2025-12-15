"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaySiloFactoryPluginSDK = void 0;
const base_1 = require("../../base");
const PaySiloFactoryPluginClient_1 = require("../../generated/PaySiloFactoryPluginClient");
const utils_1 = require("../utils");
class PaySiloFactoryPluginSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: PaySiloFactoryPluginClient_1.PaySiloFactoryPluginFactory, ...params });
    }
    mint(args) {
        const methodName = 'mint';
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
exports.PaySiloFactoryPluginSDK = PaySiloFactoryPluginSDK;
//# sourceMappingURL=pay-silo-factory.js.map