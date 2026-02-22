import { BaseSDK } from "../../base";
import { AsaMintPluginArgs, AsaMintPluginClient } from "../../generated/AsaMintPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type CreateAssetParams = {
    assetName: string;
    unitName: string;
    total: bigint | number;
    decimals: bigint | number;
    manager: string;
    reserve: string;
    freeze: string;
    clawback: string;
    defaultFrozen: boolean;
    url: string;
};
type ContractArgs = AsaMintPluginArgs["obj"];
type MintArgs = (Omit<ContractArgs['mint(uint64,bool,(string,string,uint64,uint64,address,address,address,address,bool,string)[],pay)uint64[]'], 'wallet' | 'rekeyBack' | 'assets' | 'mbrPayment'> & MaybeSigner & {
    rekeyBack?: boolean;
    assets: CreateAssetParams[];
});
export declare class AsaMintPluginSDK extends BaseSDK<AsaMintPluginClient> {
    constructor(params: NewContractSDKParams);
    mint(): PluginSDKReturn;
    mint(args: MintArgs): PluginSDKReturn;
}
export {};
