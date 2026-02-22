import { BaseSDK } from "../../base";
import { OptInPluginArgs, OptInPluginClient } from "../../generated/OptInPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = OptInPluginArgs["obj"];
type OptInArgs = (Omit<ContractArgs['optIn(uint64,bool,uint64[],pay)void'], 'wallet' | 'rekeyBack' | 'mbrPayment'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class OptInPluginSDK extends BaseSDK<OptInPluginClient> {
    constructor(params: NewContractSDKParams);
    optIn(): PluginSDKReturn;
    optIn(args: OptInArgs): PluginSDKReturn;
}
export {};
