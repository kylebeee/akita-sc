import { BaseSDK } from "../../base";
import { StakingPluginArgs, StakingPluginClient } from "../../generated/StakingPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = StakingPluginArgs["obj"];
type StakeArgs = (Omit<ContractArgs['stake(uint64,bool,uint64,uint8,uint64,uint64,bool)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type WithdrawArgs = (Omit<ContractArgs['withdraw(uint64,bool,uint64,uint8)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class StakingPluginSDK extends BaseSDK<StakingPluginClient> {
    constructor(params: NewContractSDKParams);
    stake(): PluginSDKReturn;
    stake(args: StakeArgs): PluginSDKReturn;
    withdraw(): PluginSDKReturn;
    withdraw(args: WithdrawArgs): PluginSDKReturn;
}
export {};
