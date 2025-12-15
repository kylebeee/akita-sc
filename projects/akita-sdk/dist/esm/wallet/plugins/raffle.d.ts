import { BaseSDK } from "../../base";
import { RafflePluginArgs, RafflePluginClient } from "../../generated/RafflePluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = RafflePluginArgs["obj"];
type NewRaffleArgs = (Omit<ContractArgs['newRaffle(uint64,bool,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,address,string,byte[32][],uint64)uint64'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type EnterArgs = (Omit<ContractArgs['enter(uint64,bool,uint64,uint64,address,byte[][])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type AddArgs = (Omit<ContractArgs['add(uint64,bool,uint64,uint64,byte[][])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class RafflePluginSDK extends BaseSDK<RafflePluginClient> {
    constructor(params: NewContractSDKParams);
    newRaffle(): PluginSDKReturn;
    newRaffle(args: NewRaffleArgs): PluginSDKReturn;
    enter(): PluginSDKReturn;
    enter(args: EnterArgs): PluginSDKReturn;
    add(): PluginSDKReturn;
    add(args: AddArgs): PluginSDKReturn;
}
export {};
