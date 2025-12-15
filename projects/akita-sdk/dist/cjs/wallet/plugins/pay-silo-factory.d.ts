import { BaseSDK } from "../../base";
import { PaySiloFactoryPluginArgs, PaySiloFactoryPluginClient } from "../../generated/PaySiloFactoryPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = PaySiloFactoryPluginArgs["obj"];
type MintArgs = (Omit<ContractArgs['mint(uint64,bool,address)uint64'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class PaySiloFactoryPluginSDK extends BaseSDK<PaySiloFactoryPluginClient> {
    constructor(params: NewContractSDKParams);
    mint(): PluginSDKReturn;
    mint(args: MintArgs): PluginSDKReturn;
}
export {};
