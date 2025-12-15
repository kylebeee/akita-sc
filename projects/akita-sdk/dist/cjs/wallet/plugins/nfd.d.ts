import { BaseSDK } from "../../base";
import { NfdPluginArgs, NfdPluginClient } from "../../generated/NFDPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = NfdPluginArgs["obj"];
type DeleteFieldsArgs = (Omit<ContractArgs['deleteFields(uint64,bool,uint64,byte[][])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type UpdateFieldsArgs = (Omit<ContractArgs['updateFields(uint64,bool,uint64,byte[][])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type OfferForSaleArgs = (Omit<ContractArgs['offerForSale(uint64,bool,uint64,uint64,address)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type CancelSaleArgs = (Omit<ContractArgs['cancelSale(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type PostOfferArgs = (Omit<ContractArgs['postOffer(uint64,bool,uint64,uint64,string)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type PurchaseArgs = (Omit<ContractArgs['purchase(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type UpdateHashArgs = (Omit<ContractArgs['updateHash(uint64,bool,uint64,byte[])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type ContractLockArgs = (Omit<ContractArgs['contractLock(uint64,bool,uint64,bool)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type SegmentLockArgs = (Omit<ContractArgs['segmentLock(uint64,bool,uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type VaultOptInLockArgs = (Omit<ContractArgs['vaultOptInLock(uint64,bool,uint64,bool)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type VaultOptInArgs = (Omit<ContractArgs['vaultOptIn(uint64,bool,uint64,uint64[])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type VaultSendArgs = (Omit<ContractArgs['vaultSend(uint64,bool,uint64,uint64,address,string,uint64,uint64[])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type RenewArgs = (Omit<ContractArgs['renew(uint64,bool,uint64,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type SetPrimaryAddressArgs = (Omit<ContractArgs['setPrimaryAddress(uint64,bool,uint64,string,address)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class NFDPluginSDK extends BaseSDK<NfdPluginClient> {
    constructor(params: NewContractSDKParams);
    deleteFields(): PluginSDKReturn;
    deleteFields(args: DeleteFieldsArgs): PluginSDKReturn;
    updateFields(): PluginSDKReturn;
    updateFields(args: UpdateFieldsArgs): PluginSDKReturn;
    offerForSale(): PluginSDKReturn;
    offerForSale(args: OfferForSaleArgs): PluginSDKReturn;
    cancelSale(): PluginSDKReturn;
    cancelSale(args: CancelSaleArgs): PluginSDKReturn;
    postOffer(): PluginSDKReturn;
    postOffer(args: PostOfferArgs): PluginSDKReturn;
    purchase(): PluginSDKReturn;
    purchase(args: PurchaseArgs): PluginSDKReturn;
    updateHash(): PluginSDKReturn;
    updateHash(args: UpdateHashArgs): PluginSDKReturn;
    contractLock(): PluginSDKReturn;
    contractLock(args: ContractLockArgs): PluginSDKReturn;
    segmentLock(): PluginSDKReturn;
    segmentLock(args: SegmentLockArgs): PluginSDKReturn;
    vaultOptInLock(): PluginSDKReturn;
    vaultOptInLock(args: VaultOptInLockArgs): PluginSDKReturn;
    vaultOptIn(): PluginSDKReturn;
    vaultOptIn(args: VaultOptInArgs): PluginSDKReturn;
    vaultSend(): PluginSDKReturn;
    vaultSend(args: VaultSendArgs): PluginSDKReturn;
    renew(): PluginSDKReturn;
    renew(args: RenewArgs): PluginSDKReturn;
    setPrimaryAddress(): PluginSDKReturn;
    setPrimaryAddress(args: SetPrimaryAddressArgs): PluginSDKReturn;
}
export {};
