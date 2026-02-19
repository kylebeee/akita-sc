"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatePluginSDK = void 0;
const base_1 = require("../../base");
const GatePluginClient_1 = require("../../generated/GatePluginClient");
const utils_1 = require("../utils");
class GatePluginSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: GatePluginClient_1.GatePluginFactory, ...params });
    }
    register(args) {
        const methodName = 'register';
        if (args === undefined) {
            return (_spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns: utils_1.getTxns
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
exports.GatePluginSDK = GatePluginSDK;
//# sourceMappingURL=gate.js.map