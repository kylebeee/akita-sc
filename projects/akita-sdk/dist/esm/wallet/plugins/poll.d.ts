import { BaseSDK } from "../../base";
import { PollPluginContractArgs, PollPluginContractClient } from "../../generated/PollPluginContractClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = PollPluginContractArgs["obj"];
type NewArgs = (Omit<ContractArgs['new(uint64,bool,uint8,uint64,uint64,string,string[],uint64)uint64'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type DeleteBoxesArgs = (Omit<ContractArgs['deleteBoxes(uint64,bool,uint64,address[])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type VoteArgs = (Omit<ContractArgs['vote(uint64,bool,uint64,uint64[],byte[][])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class PollPluginSDK extends BaseSDK<PollPluginContractClient> {
    constructor(params: NewContractSDKParams);
    new(): PluginSDKReturn;
    new(args: NewArgs): PluginSDKReturn;
    deleteBoxes(): PluginSDKReturn;
    deleteBoxes(args: DeleteBoxesArgs): PluginSDKReturn;
    vote(): PluginSDKReturn;
    vote(args: VoteArgs): PluginSDKReturn;
}
export {};
