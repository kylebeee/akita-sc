import { BaseSDK } from "../../base";
import { RewardsPluginArgs, RewardsPluginClient } from "../../generated/RewardsPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = RewardsPluginArgs["obj"];
type ClaimRewardsArgs = (Omit<ContractArgs['claimRewards(uint64,bool,(uint64,uint64)[])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class RewardsPluginSDK extends BaseSDK<RewardsPluginClient> {
    constructor(params: NewContractSDKParams);
    claimRewards(): PluginSDKReturn;
    claimRewards(args: ClaimRewardsArgs): PluginSDKReturn;
}
export {};
