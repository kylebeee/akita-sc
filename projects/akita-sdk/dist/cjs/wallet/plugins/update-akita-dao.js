"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAkitaDAOPluginSDK = void 0;
const base_1 = require("../../base");
const UpdateAkitaDAOPluginClient_1 = require("../../generated/UpdateAkitaDAOPluginClient");
const utils_1 = require("../utils");
class UpdateAkitaDAOPluginSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: UpdateAkitaDAOPluginClient_1.UpdateAkitaDaoPluginFactory, ...params });
    }
    deleteBoxedContract(args) {
        const methodName = 'deleteBoxedContract';
        if (args === undefined) {
            // Called without arguments - return selector for method restrictions
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
                const params = (await this.client.params.deleteBoxedContract({
                    ...sendParams,
                    args: { wallet, rekeyBack }
                }));
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
    updateApp(args) {
        const methodNames = ['initBoxedContract', 'loadBoxedContract', 'updateApp'];
        if (args === undefined) {
            // Called without arguments - return selector for method restrictions
            return (spendingAddress) => ({
                appId: this.client.appId,
                selectors: methodNames.map(methodName => this.client.appClient.getABIMethod(methodName).getSelector()),
                getTxns: utils_1.getTxns
            });
        }
        const { sender, signer, appId, version, data } = args;
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return (spendingAddress) => ({
            appId: this.client.appId,
            selectors: methodNames.map(methodName => this.client.appClient.getABIMethod(methodName).getSelector()),
            getTxns: async ({ wallet }) => {
                const rekeyBack = args.rekeyBack ?? true;
                const txns = [];
                const initParams = (await this.client.params.initBoxedContract({
                    ...sendParams,
                    args: { wallet, version, size: data.length }
                }));
                txns.push({
                    type: 'methodCall',
                    ...initParams
                });
                // max loadContract data size is 2026 bytes
                // ABI encoding overhead: [selector:4][wallet:8][offset:8][data_length:2] = 22 bytes
                // 2048 - 22 = 2026 bytes max per chunk
                const CHUNK_SIZE = 2026;
                for (let i = 0; i < data.length; i += CHUNK_SIZE) {
                    const chunk = data.slice(i, i + CHUNK_SIZE);
                    const loadParams = (await this.client.params.loadBoxedContract({
                        ...sendParams,
                        args: { wallet, offset: i, data: chunk }
                    }));
                    txns.push({
                        type: 'methodCall',
                        ...loadParams
                    });
                }
                const updateParams = (await this.client.params.updateApp({
                    ...sendParams,
                    args: { wallet, rekeyBack, appId }
                }));
                txns.push({
                    type: 'methodCall',
                    ...updateParams
                });
                return txns;
            }
        });
    }
    updateAkitaDaoAppIDForApp(args) {
        const methodName = 'updateAkitaDaoAppIDForApp';
        if (args === undefined) {
            // Called without arguments - return selector for method restrictions
            return (spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns: utils_1.getTxns
            });
        }
        const { sender, signer, appId, newAkitaDaoAppId } = args;
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return (spendingAddress) => ({
            appId: this.client.appId,
            selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
            getTxns: async ({ wallet }) => {
                const rekeyBack = args.rekeyBack ?? true;
                const params = (await this.client.params.updateAkitaDaoAppIdForApp({
                    ...sendParams,
                    args: { wallet, rekeyBack, appId, newAkitaDaoAppId }
                }));
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
    updateAkitaDaoEscrowForApp(args) {
        const methodName = 'updateAkitaDaoEscrowForApp';
        if (args === undefined) {
            // Called without arguments - return selector for method restrictions
            return (spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns: utils_1.getTxns
            });
        }
        const { sender, signer, appId, newEscrow } = args;
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return (spendingAddress) => ({
            appId: this.client.appId,
            selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
            getTxns: async ({ wallet }) => {
                const rekeyBack = args.rekeyBack ?? true;
                const params = (await this.client.params.updateAkitaDaoEscrowForApp({
                    ...sendParams,
                    args: { wallet, rekeyBack, appId, newEscrow },
                }));
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
}
exports.UpdateAkitaDAOPluginSDK = UpdateAkitaDAOPluginSDK;
//# sourceMappingURL=update-akita-dao.js.map