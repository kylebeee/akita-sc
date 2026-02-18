import type { WalletSDK } from './index';
import { AbstractedAccountArgs } from '../generated/AbstractedAccountClient';
import { AddAllowanceArgs, WalletAddPluginParams, WalletUsePluginParams } from './types';
import { MaybeSigner, SDKClient, GroupReturn } from '../types';
import { SendParams } from '@algorandfoundation/algokit-utils/types/transaction';
type ContractArgs = AbstractedAccountArgs["obj"];
/**
 * Fluent composer returned by `wallet.group()` that queues wallet operations
 * and resolves them as a single atomic group at `send()` time.
 *
 * Tracks internal state like new escrow creation across operations so that
 * only the first addPlugin with a given escrow pays the NewEscrowFeeAmount.
 */
export declare class WalletGroupComposer {
    private wallet;
    private resolvers;
    private postProcessors;
    private newEscrows;
    private group;
    constructor(wallet: WalletSDK);
    private getSendParams;
    addPlugin<TClient extends SDKClient>(params: WalletAddPluginParams<TClient>): this;
    usePlugin(params: WalletUsePluginParams): this;
    register({ sender, signer, ...args }: ContractArgs['register(string)void'] & MaybeSigner): this;
    changeRevocationApp({ sender, signer, app }: MaybeSigner & {
        app: bigint;
    }): this;
    setNickname({ sender, signer, nickname }: MaybeSigner & {
        nickname: string;
    }): this;
    setAvatar({ sender, signer, avatar }: MaybeSigner & {
        avatar: bigint;
    }): this;
    setBanner({ sender, signer, banner }: MaybeSigner & {
        banner: bigint;
    }): this;
    setBio({ sender, signer, bio }: MaybeSigner & {
        bio: string;
    }): this;
    changeAdmin({ sender, signer, newAdmin }: MaybeSigner & {
        newAdmin: string;
    }): this;
    verifyAuthAddress(params?: MaybeSigner): this;
    rekeyTo({ sender, signer, ...args }: MaybeSigner & ContractArgs['arc58_rekeyTo(address,bool)void']): this;
    canCall({ sender, signer, ...args }: ContractArgs['arc58_canCall(uint64,bool,address,string,byte[4])bool'] & MaybeSigner): this;
    removePlugin({ sender, signer, ...args }: ContractArgs['arc58_removePlugin(uint64,address,string)void'] & MaybeSigner): this;
    newEscrow({ sender, signer, ...args }: ContractArgs['arc58_newEscrow(string)uint64'] & MaybeSigner): this;
    toggleEscrowLock({ sender, signer, ...args }: ContractArgs['arc58_toggleEscrowLock(string)(uint64,bool)'] & MaybeSigner): this;
    reclaimFunds({ sender, signer, ...args }: ContractArgs['arc58_reclaim(string,(uint64,uint64,bool)[])void'] & MaybeSigner): this;
    optInEscrow({ sender, signer, ...args }: ContractArgs['arc58_optInEscrow(string,uint64[])void'] & MaybeSigner): this;
    addAllowances({ sender, signer, escrow, allowances }: {
        escrow: string;
        allowances: AddAllowanceArgs[];
    } & MaybeSigner): this;
    removeAllowances({ sender, signer, ...args }: ContractArgs['arc58_removeAllowances(string,uint64[])void'] & MaybeSigner): this;
    addExecutionKey({ sender, signer, ...args }: ContractArgs['arc58_addExecutionKey(byte[32],byte[32][],uint64,uint64)void'] & MaybeSigner): this;
    removeExecutionKey({ sender, signer, ...args }: ContractArgs['arc58_removeExecutionKey(byte[32])void'] & MaybeSigner): this;
    send(params?: SendParams): Promise<GroupReturn>;
}
export {};
