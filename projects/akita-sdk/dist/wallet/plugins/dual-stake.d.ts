import { BaseSDK } from "../../base";
import { DualStakePluginArgs, DualStakePluginClient } from "../../generated/DualStakePluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = DualStakePluginArgs["obj"];
type MintArgs = (Omit<ContractArgs['mint(uint64,bool,uint64,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type RedeemArgs = (Omit<ContractArgs['redeem(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class DualStakePluginSDK extends BaseSDK<DualStakePluginClient> {
    constructor(params: NewContractSDKParams);
    mint(): PluginSDKReturn;
    mint(args: MintArgs): PluginSDKReturn;
    redeem(): PluginSDKReturn;
    redeem(args: RedeemArgs): PluginSDKReturn;
}
export {};
