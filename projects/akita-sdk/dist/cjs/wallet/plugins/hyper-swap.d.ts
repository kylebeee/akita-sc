import { BaseSDK } from "../../base";
import { HyperSwapPluginArgs, HyperSwapPluginClient } from "../../generated/HyperSwapPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = HyperSwapPluginArgs["obj"];
type OfferArgs = (Omit<ContractArgs['offer(uint64,bool,byte[32],uint64,byte[32],uint64,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type AcceptArgs = (Omit<ContractArgs['accept(uint64,bool,uint64,byte[32][])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type EscrowArgs = (Omit<ContractArgs['escrow(uint64,bool,uint64,address,uint64,uint64,byte[32][])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type DisburseArgs = (Omit<ContractArgs['disburse(uint64,bool,uint64,uint64,address,uint64,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type CancelArgs = (Omit<ContractArgs['cancel(uint64,bool,uint64,byte[32][])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type WithdrawArgs = (Omit<ContractArgs['withdraw(uint64,bool,uint64,address,uint64,uint64,byte[32][])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class HyperSwapPluginSDK extends BaseSDK<HyperSwapPluginClient> {
    constructor(params: NewContractSDKParams);
    offer(): PluginSDKReturn;
    offer(args: OfferArgs): PluginSDKReturn;
    accept(): PluginSDKReturn;
    accept(args: AcceptArgs): PluginSDKReturn;
    escrow(): PluginSDKReturn;
    escrow(args: EscrowArgs): PluginSDKReturn;
    disburse(): PluginSDKReturn;
    disburse(args: DisburseArgs): PluginSDKReturn;
    cancel(): PluginSDKReturn;
    cancel(args: CancelArgs): PluginSDKReturn;
    withdraw(): PluginSDKReturn;
    withdraw(args: WithdrawArgs): PluginSDKReturn;
}
export {};
