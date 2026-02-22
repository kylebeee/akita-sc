import { BaseSDK } from "../../base";
import { UpdateAkitaDaoPluginArgs, UpdateAkitaDaoPluginClient } from "../../generated/UpdateAkitaDAOPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = UpdateAkitaDaoPluginArgs["obj"];
type DeleteBoxedContractArgs = (Omit<ContractArgs['deleteBoxedContract(uint64,bool)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type UpdateAppArgs = (Omit<ContractArgs['updateApp(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & {
    version: string;
    data: Uint8Array;
} & MaybeSigner & {
    rekeyBack?: boolean;
});
type UpdateAkitaDaoAppIDForAppArgs = (Omit<ContractArgs['updateAkitaDaoAppIDForApp(uint64,bool,uint64,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type UpdateAkitaDaoEscrowForAppArgs = (Omit<ContractArgs['updateAkitaDaoEscrowForApp(uint64,bool,uint64,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type UpdateFactoryChildContractArgs = ({
    factoryAppId: bigint | number;
    version: string;
    data: Uint8Array;
} & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class UpdateAkitaDAOPluginSDK extends BaseSDK<UpdateAkitaDaoPluginClient> {
    constructor(params: NewContractSDKParams);
    deleteBoxedContract(): PluginSDKReturn;
    deleteBoxedContract(args: DeleteBoxedContractArgs): PluginSDKReturn;
    updateApp(): PluginSDKReturn;
    updateApp(args: UpdateAppArgs): PluginSDKReturn;
    updateAkitaDaoAppIDForApp(): PluginSDKReturn;
    updateAkitaDaoAppIDForApp(args: UpdateAkitaDaoAppIDForAppArgs): PluginSDKReturn;
    updateAkitaDaoEscrowForApp(): PluginSDKReturn;
    updateAkitaDaoEscrowForApp(args: UpdateAkitaDaoEscrowForAppArgs): PluginSDKReturn;
    /**
     * Updates a factory's child contract bytecode stored in its box.
     * This allows the factory to deploy new instances with the updated contract code.
     *
     * The flow is:
     * 1. Upload contract to this plugin's box via initBoxedContract/loadBoxedContract
     * 2. Call updateFactoryChildContract which transfers the data to the factory's box
     *
     * @example
     * ```typescript
     * // Update wallet factory's child contract (AbstractedAccount)
     * await dao.wallet.usePlugin({
     *   calls: [
     *     updatePlugin.updateFactoryChildContract({
     *       sender,
     *       signer,
     *       factoryAppId: appIds.walletFactory,
     *       version: '1.0.1',
     *       data: compiledAbstractedAccount.approvalProgram,
     *     }),
     *   ],
     * });
     * ```
     */
    updateFactoryChildContract(): PluginSDKReturn;
    updateFactoryChildContract(args: UpdateFactoryChildContractArgs): PluginSDKReturn;
}
export {};
