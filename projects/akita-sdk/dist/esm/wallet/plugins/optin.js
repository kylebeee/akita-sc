import { BaseSDK } from "../../base";
import { OptInPluginFactory } from "../../generated/OptInPluginClient";
import algosdk from "algosdk";
import { microAlgo } from "@algorandfoundation/algokit-utils";
import { getTxns } from "../utils";
const assetOptInCost = 100000; // This is the cost for asset opt-in, adjust as necessary
export class OptInPluginSDK extends BaseSDK {
    constructor(params) {
        super({ factory: OptInPluginFactory, ...params });
    }
    optIn(args) {
        const methodName = 'optIn';
        if (args === undefined) {
            // Called without arguments - return selector for method restrictions
            return (spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns
            });
        }
        const { sender, signer, assets } = args;
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return (spendingAddress) => ({
            appId: this.client.appId,
            selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
            getTxns: async ({ wallet }) => {
                const rekeyBack = args.rekeyBack ?? true;
                const mbrPayment = this.client.algorand.createTransaction.payment({
                    ...sendParams,
                    amount: microAlgo(assetOptInCost * assets.length),
                    receiver: spendingAddress ? spendingAddress : algosdk.getApplicationAddress(wallet),
                });
                const params = (await this.client.params.optIn({
                    ...sendParams,
                    args: { wallet, ...args, rekeyBack, mbrPayment },
                }));
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
}
//# sourceMappingURL=optin.js.map