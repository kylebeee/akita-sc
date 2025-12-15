import { BaseSDK } from "../../base";
import { UpdateAkitaDaoPluginFactory } from "../../generated/UpdateAkitaDAOPluginClient";
import { getTxns } from "../utils";
export class UpdateAkitaDAOPluginSDK extends BaseSDK {
    constructor(params) {
        super({ factory: UpdateAkitaDaoPluginFactory, ...params });
    }
    deleteBoxedContract(args) {
        const methodName = 'deleteBoxedContract';
        if (args === undefined) {
            // Called without arguments - return selector for method restrictions
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
                getTxns
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
                // max loadContract calls necessary is 4
                // max loadContract data size is 2036
                // [selector:4][offset:8][data:>=2036] = 2048 bytes (max txn args size)
                // so we need to split the data into at most 4 chunks
                for (let i = 0; i < data.length; i += 2036) {
                    const chunk = data.slice(i, i + 2036);
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
                getTxns
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
                getTxns
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
//# sourceMappingURL=update-akita-dao.js.map