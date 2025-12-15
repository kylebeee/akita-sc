import { BaseSDK } from "../../base";
import { AsaMintPluginFactory } from "../../generated/AsaMintPluginClient";
import algosdk from "algosdk";
import { microAlgo } from "@algorandfoundation/algokit-utils";
import { getTxns } from "../utils";
const assetCreateCost = 100000;
export class AsaMintPluginSDK extends BaseSDK {
    constructor(params) {
        super({ factory: AsaMintPluginFactory, ...params });
    }
    mint(args) {
        const methodName = 'mint';
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
                    amount: microAlgo(assetCreateCost * assets.length),
                    receiver: spendingAddress ? spendingAddress : algosdk.getApplicationAddress(wallet),
                });
                const assetsTuple = assets.map(asset => [
                    asset.assetName,
                    asset.unitName,
                    asset.total,
                    asset.decimals,
                    asset.manager,
                    asset.reserve,
                    asset.freeze,
                    asset.clawback,
                    asset.defaultFrozen,
                    asset.url,
                ]);
                const params = (await this.client.params.mint({
                    ...sendParams,
                    args: { wallet, assets: assetsTuple, rekeyBack, mbrPayment },
                }));
                return [{
                        type: 'methodCall',
                        ...params
                    }];
            }
        });
    }
}
//# sourceMappingURL=asa-mint.js.map