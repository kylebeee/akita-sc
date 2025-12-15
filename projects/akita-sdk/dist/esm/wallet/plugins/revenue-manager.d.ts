import { RevenueManagerPluginArgs, RevenueManagerPluginClient } from "../../generated/RevenueManagerPluginClient";
import { BaseSDK } from "../../base";
import { MaybeSigner, NewContractSDKParams, PluginSDKReturn } from "../../types";
type ContractArgs = RevenueManagerPluginArgs["obj"];
type OptInContractArgs = (Omit<ContractArgs['optIn(uint64,bool,uint64[],pay)void'], 'wallet' | 'rekeyBack' | 'mbrPayment'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type NewReceiveEscrowContractArgs = (Omit<ContractArgs['newReceiveEscrow(uint64,bool,string,address,bool,bool,((uint64,string),uint8,uint64)[])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type NewReceiveEscrowWithRefContractArgs = (Omit<ContractArgs['newReceiveEscrowWithRef(uint64,bool,string,address,bool,bool,(uint64,byte[]))void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type StartEscrowDisbursementContractArgs = (Omit<ContractArgs['startEscrowDisbursement(uint64,bool)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type ProcessEscrowAllocationContractArgs = (Omit<ContractArgs['processEscrowAllocation(uint64,bool,uint64[])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
} & {
    ids: bigint[];
});
type FinalizeEscrowDisbursementContractArgs = (Omit<ContractArgs['finalizeEscrowDisbursement(uint64,bool,uint64[])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
} & {
    ids: bigint[];
});
export declare class RevenueManagerPluginSDK extends BaseSDK<RevenueManagerPluginClient> {
    constructor(params: NewContractSDKParams);
    optIn(): PluginSDKReturn;
    optIn(args: OptInContractArgs): PluginSDKReturn;
    newReceiveEscrow(): PluginSDKReturn;
    newReceiveEscrow(args: NewReceiveEscrowContractArgs): PluginSDKReturn;
    newReceiveEscrowWithRef(): PluginSDKReturn;
    newReceiveEscrowWithRef(args: NewReceiveEscrowWithRefContractArgs): PluginSDKReturn;
    startEscrowDisbursement(): PluginSDKReturn;
    startEscrowDisbursement(args: StartEscrowDisbursementContractArgs): PluginSDKReturn;
    processEscrowAllocation(): PluginSDKReturn;
    processEscrowAllocation(args: ProcessEscrowAllocationContractArgs): PluginSDKReturn;
    finalizeEscrowDisbursement(): PluginSDKReturn;
    finalizeEscrowDisbursement(args: FinalizeEscrowDisbursementContractArgs): PluginSDKReturn;
}
export {};
