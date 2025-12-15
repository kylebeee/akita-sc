import { BaseSDK } from "../../base";
import { AkitaSocialPluginArgs, AkitaSocialPluginClient } from "../../generated/AkitaSocialPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = AkitaSocialPluginArgs["obj"];
type FollowArgs = (Omit<ContractArgs['follow(uint64,bool,address)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type UnfollowArgs = (Omit<ContractArgs['unfollow(uint64,bool,address,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type PostArgs = (Omit<ContractArgs['post(uint64,bool,uint64,byte[24],byte[36],uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class SocialPluginSDK extends BaseSDK<AkitaSocialPluginClient> {
    constructor(params: NewContractSDKParams);
    follow(): PluginSDKReturn;
    follow(args: FollowArgs): PluginSDKReturn;
    unfollow(): PluginSDKReturn;
    unfollow(args: UnfollowArgs): PluginSDKReturn;
    post(): PluginSDKReturn;
    post(args: PostArgs): PluginSDKReturn;
}
export {};
