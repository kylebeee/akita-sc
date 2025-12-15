import { AbstractedAccountFactoryArgs, type AbstractedAccountFactoryClient } from '../generated/AbstractedAccountFactoryClient';
import { NewContractSDKParams, MaybeSigner } from '../types';
import { WalletSDK } from './index';
import { BaseSDK } from '../base';
export type WalletFactoryContractArgs = AbstractedAccountFactoryArgs["obj"];
export type NewParams = (Omit<WalletFactoryContractArgs['newAccount(pay,address,address,string,address)uint64'], 'payment' | 'controlledAddress' | 'admin' | 'referrer'> & MaybeSigner & Partial<Pick<WalletFactoryContractArgs['newAccount(pay,address,address,string,address)uint64'], 'controlledAddress' | 'admin' | 'referrer'>>);
export declare class WalletFactorySDK extends BaseSDK<AbstractedAccountFactoryClient> {
    constructor(params: NewContractSDKParams);
    new({ sender, signer, controlledAddress, admin, nickname, referrer }: NewParams): Promise<WalletSDK>;
    get({ appId }: {
        appId: bigint;
    }): Promise<WalletSDK>;
    cost(params?: MaybeSigner): Promise<bigint>;
}
export declare function newWallet({ factoryParams, algorand, readerAccount, sendParams, sender, signer, controlledAddress, admin, nickname, referrer }: NewContractSDKParams & NewParams): Promise<WalletSDK>;
