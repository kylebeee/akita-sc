import { GroupReturn, MaybeSigner, NewContractSDKParams } from "../types";
import { AkitaDaoSDK } from "../dao";
export { AkitaDaoSDK };
/**
 * Extended DAO SDK that includes the setup() method for initial deployment.
 * Use this SDK when deploying and setting up a new DAO instance.
 * For interacting with an already-deployed DAO, use AkitaDaoSDK from 'akita-sdk/dao'.
 */
export declare class AkitaDaoDeployableSDK extends AkitaDaoSDK {
    constructor(params: NewContractSDKParams);
    setup(params?: MaybeSigner): Promise<GroupReturn>;
}
