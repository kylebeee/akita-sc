import { WalletSDK } from "../wallet";
import { AkitaDaoSDK } from "../dao";
export { AkitaDaoSDK };
/**
 * Extended DAO SDK that includes the setup() method for initial deployment.
 * Use this SDK when deploying and setting up a new DAO instance.
 * For interacting with an already-deployed DAO, use AkitaDaoSDK from 'akita-sdk/dao'.
 */
export class AkitaDaoDeployableSDK extends AkitaDaoSDK {
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
        this.wallet = new WalletSDK({
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
//# sourceMappingURL=index.js.map