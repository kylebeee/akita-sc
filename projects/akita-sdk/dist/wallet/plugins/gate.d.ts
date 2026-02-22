import { BaseSDK } from "../../base";
import { GatePluginArgs, GatePluginClient } from "../../generated/GatePluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = GatePluginArgs["obj"];
type RegisterArgs = (Omit<ContractArgs['register(uint64,bool,(uint64,uint64,uint8)[],byte[][])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class GatePluginSDK extends BaseSDK<GatePluginClient> {
    constructor(params: NewContractSDKParams);
    register(): PluginSDKReturn;
    register(args: RegisterArgs): PluginSDKReturn;
}
export {};
