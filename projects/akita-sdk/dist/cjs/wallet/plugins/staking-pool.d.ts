import { BaseSDK } from "../../base";
import { StakingPoolPluginArgs, StakingPoolPluginClient } from "../../generated/StakingPoolPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = StakingPoolPluginArgs["obj"];
type NewPoolArgs = (Omit<ContractArgs['newPool(uint64,bool,string,uint8,address,(address,string),uint64,bool,uint64,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type InitPoolArgs = (Omit<ContractArgs['initPool(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type DeletePoolArgs = (Omit<ContractArgs['deletePool(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type AddRewardArgs = (Omit<ContractArgs['addReward(uint64,bool,uint64,(uint64,uint8,uint64,uint64,uint64,uint64,uint64,uint64,uint64[],(uint64,uint64,uint64),uint64,uint8,uint64,uint64,uint64,uint64),uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type FinalizePoolArgs = (Omit<ContractArgs['finalizePool(uint64,bool,uint64,uint64,uint64,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type EnterArgs = (Omit<ContractArgs['enter(uint64,bool,uint64,(uint64,uint64,byte[32][])[],byte[][])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class StakingPoolPluginSDK extends BaseSDK<StakingPoolPluginClient> {
    constructor(params: NewContractSDKParams);
    newPool(): PluginSDKReturn;
    newPool(args: NewPoolArgs): PluginSDKReturn;
    initPool(): PluginSDKReturn;
    initPool(args: InitPoolArgs): PluginSDKReturn;
    deletePool(): PluginSDKReturn;
    deletePool(args: DeletePoolArgs): PluginSDKReturn;
    addReward(): PluginSDKReturn;
    addReward(args: AddRewardArgs): PluginSDKReturn;
    finalizePool(): PluginSDKReturn;
    finalizePool(args: FinalizePoolArgs): PluginSDKReturn;
    enter(): PluginSDKReturn;
    enter(args: EnterArgs): PluginSDKReturn;
}
export {};
