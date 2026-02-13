import { AbstractAccountBoxMbrData, AbstractedAccountArgs, AllowanceKey, EscrowInfo, PluginKey, type AbstractedAccountClient, ExecutionInfo } from '../generated/AbstractedAccountClient';
import { AddAllowanceArgs, AllowanceInfo, BuildWalletUsePluginParams, CanCallParams, ExecutionBuildGroup, MbrParams, PluginInfo, WalletAddPluginParams, WalletGlobalState, WalletUsePluginParams } from './types';
import { MaybeSigner, NewContractSDKParams, SDKClient, GroupReturn, TxnReturn } from '../types';
import { BaseSDK } from '../base';
import { ValueMap } from './utils';
export * from './constants';
export * from './factory';
export * from './plugins';
export * from "./types";
type ContractArgs = AbstractedAccountArgs["obj"];
export declare class WalletSDK extends BaseSDK<AbstractedAccountClient> {
    private pluginMapKeyGenerator;
    plugins: ValueMap<PluginKey, PluginInfo>;
    namedPlugins: Map<string, PluginKey>;
    escrows: Map<string, EscrowInfo>;
    private allowanceMapKeyGenerator;
    allowances: ValueMap<AllowanceKey, AllowanceInfo>;
    executions: Map<Uint8Array, ExecutionInfo>;
    constructor(params: NewContractSDKParams);
    private updateCache;
    private prepareUsePlugin;
    register({ sender, signer, escrow }: ContractArgs['register(string)void'] & MaybeSigner): Promise<void>;
    changeRevocationApp({ sender, signer, app }: MaybeSigner & {
        app: bigint;
    }): Promise<void>;
    setNickname({ sender, signer, nickname }: MaybeSigner & {
        nickname: string;
    }): Promise<void>;
    setAvatar({ sender, signer, avatar }: MaybeSigner & {
        avatar: bigint;
    }): Promise<void>;
    setBanner({ sender, signer, banner }: MaybeSigner & {
        banner: bigint;
    }): Promise<void>;
    setBio({ sender, signer, bio }: MaybeSigner & {
        bio: string;
    }): Promise<void>;
    changeAdmin({ sender, signer, newAdmin }: MaybeSigner & {
        newAdmin: string;
    }): Promise<void>;
    verifyAuthAddress(params?: MaybeSigner): Promise<void>;
    rekeyTo({ sender, signer, ...args }: MaybeSigner & ContractArgs['arc58_rekeyTo(address,bool)void']): Promise<void>;
    canCall({ sender, signer, ...args }: CanCallParams): Promise<boolean[]>;
    usePlugin(params: WalletUsePluginParams): Promise<GroupReturn>;
    addPlugin<TClient extends SDKClient>({ sender, signer, name, client, caller, global, methods, escrow, admin, delegationType, lastValid, cooldown, useRounds, useExecutionKey, coverFees, canReclaim, defaultToEscrow, allowances }: WalletAddPluginParams<TClient>): Promise<GroupReturn>;
    removePlugin({ sender, signer, ...args }: ContractArgs['arc58_removePlugin(uint64,address,string)void'] & MaybeSigner): Promise<TxnReturn<void>>;
    newEscrow({ sender, signer, ...args }: ContractArgs['arc58_newEscrow(string)uint64'] & MaybeSigner): Promise<TxnReturn<bigint>>;
    toggleEscrowLock({ sender, signer, ...args }: ContractArgs['arc58_toggleEscrowLock(string)(uint64,bool)'] & MaybeSigner): Promise<TxnReturn<EscrowInfo>>;
    reclaimFunds({ sender, signer, ...args }: ContractArgs['arc58_reclaim(string,(uint64,uint64,bool)[])void'] & MaybeSigner): Promise<TxnReturn<void>>;
    optinEscrow({ sender, signer, ...args }: ContractArgs['arc58_optInEscrow(string,uint64[])void'] & MaybeSigner): Promise<TxnReturn<void>>;
    addAllowances({ sender, signer, escrow, allowances }: {
        escrow: string;
        allowances: AddAllowanceArgs[];
    } & MaybeSigner): Promise<TxnReturn<void>>;
    removeAllowances({ sender, signer, ...args }: ContractArgs['arc58_removeAllowances(string,uint64[])void'] & MaybeSigner): Promise<TxnReturn<void>>;
    addExecutionKey({ sender, signer, lease, groups, firstValid, lastValid }: ContractArgs['arc58_addExecutionKey(byte[32],byte[32][],uint64,uint64)void'] & MaybeSigner): Promise<TxnReturn<void>>;
    removeExecutionKey({ sender, signer, ...args }: ContractArgs['arc58_removeExecutionKey(byte[32])void'] & MaybeSigner): Promise<TxnReturn<void>>;
    readonly build: {
        usePlugin: ({ firstValid, windowSize, consolidateFees, skipSignatures, ...args }: BuildWalletUsePluginParams) => Promise<ExecutionBuildGroup>;
    };
    getGlobalState(): Promise<WalletGlobalState>;
    getAdmin(): Promise<string>;
    getPlugins(): Promise<ValueMap<PluginKey, PluginInfo>>;
    getPluginByKey(key: PluginKey): Promise<PluginInfo>;
    getNamedPlugins(): Promise<Map<string, PluginKey>>;
    getPluginByName(name: string): Promise<PluginInfo>;
    getEscrows(): Promise<Map<string, EscrowInfo>>;
    getEscrow(escrow: string): Promise<EscrowInfo>;
    getAllowances(): Promise<ValueMap<AllowanceKey, AllowanceInfo>>;
    getAllowance(key: AllowanceKey): Promise<AllowanceInfo>;
    getExecutions(): Promise<Map<Uint8Array, ExecutionInfo>>;
    getExecution(lease: Uint8Array<ArrayBufferLike>): Promise<ExecutionInfo>;
    getMbr(args: MbrParams): Promise<AbstractAccountBoxMbrData>;
    balance(assets: bigint[]): Promise<bigint[]>;
}
