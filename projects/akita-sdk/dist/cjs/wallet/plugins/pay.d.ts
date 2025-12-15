import { BaseSDK } from "../../base";
import { PayPluginArgs, PayPluginClient } from "../../generated/PayPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
type CreatePaymentParams = {
    receiver: Address | string;
    amount: bigint | number;
    asset: bigint | number;
};
type ContractArgs = PayPluginArgs["obj"];
type PayArgs = (Omit<ContractArgs['pay(uint64,bool,(address,uint64,uint64)[])void'], 'wallet' | 'rekeyBack' | 'payments'> & MaybeSigner & {
    rekeyBack?: boolean;
    payments: CreatePaymentParams[];
});
export declare class PayPluginSDK extends BaseSDK<PayPluginClient> {
    constructor(params: NewContractSDKParams);
    pay(): PluginSDKReturn;
    pay(args: PayArgs): PluginSDKReturn;
}
export {};
