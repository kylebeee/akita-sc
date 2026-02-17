"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AkitaDaoDeployableSDK = exports.AkitaDaoSDK = void 0;
const wallet_1 = require("../wallet");
const dao_1 = require("../dao");
Object.defineProperty(exports, "AkitaDaoSDK", { enumerable: true, get: function () { return dao_1.AkitaDaoSDK; } });
/**
 * Extended DAO SDK that includes the setup() method for initial deployment.
 * Use this SDK when deploying and setting up a new DAO instance.
 * For interacting with an already-deployed DAO, use AkitaDaoSDK from 'akita-sdk/dao'.
 */
class AkitaDaoDeployableSDK extends dao_1.AkitaDaoSDK {
    constructor(params) {
        super(params);
    }
    async setup(params) {
        const sendParams = this.getSendParams(params);
        const group = this.client.newGroup();
        group.setup({
            ...sendParams,
            args: { nickname: 'Akita DAO' },
            maxFee: (6000).microAlgo()
        });
        group.opUp({ args: {}, maxFee: (1000).microAlgos() });
        const result = await group.send({ ...sendParams });
        if (result.returns === undefined) {
            throw new Error('Failed to setup Akita DAO');
        }
        this.wallet = new wallet_1.WalletSDK({
            algorand: this.algorand,
            factoryParams: {
                appId: result.returns[0],
                defaultSender: sendParams.sender,
                defaultSigner: sendParams.signer
            }
        });
        await this.wallet.register({ ...sendParams, escrow: '' });
        return result;
    }
}
exports.AkitaDaoDeployableSDK = AkitaDaoDeployableSDK;
//# sourceMappingURL=index.js.map