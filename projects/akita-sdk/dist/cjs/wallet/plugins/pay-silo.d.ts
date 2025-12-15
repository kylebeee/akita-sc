import { BaseSDK } from "../../base";
import { PaySiloPluginArgs, PaySiloPluginClient } from "../../generated/PaySiloPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = PaySiloPluginArgs["obj"];
type PayArgs = (Omit<ContractArgs['pay(uint64,bool,(uint64,uint64)[])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class PaySiloPluginSDK extends BaseSDK<PaySiloPluginClient> {
    constructor(params: NewContractSDKParams);
    pay(): PluginSDKReturn;
    pay(args: PayArgs): PluginSDKReturn;
}
export {};
