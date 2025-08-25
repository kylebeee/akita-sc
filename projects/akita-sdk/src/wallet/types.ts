import { GlobalKeysState, PluginInfo as ClientPluginInfo, AbstractedAccountArgs, AbstractedAccountReturns } from "../generated/AbstractedAccountClient";
import { MaybeSigner, SDKClient, AkitaSDK, PluginMethodSpecifier, PluginSDKReturn } from "../types";
import { ABIReturn, AppReturn } from "@algorandfoundation/algokit-utils/types/app";
import algosdk, { modelsv2, Transaction } from "algosdk";

type ContractArgs = AbstractedAccountArgs["obj"];

export type WalletGlobalState = GlobalKeysState;

export type MethodOffset = {
  name: Uint8Array;
  cooldown: bigint;
  lastCalled: bigint;
}

export type FundsRequest = {
  asset: bigint;
  amount: bigint;
}

export type PluginInfo = Omit<ClientPluginInfo, 'methods'> & {
  methods: MethodOffset[]
}

export type MbrParams = {
  escrow: string
  methodCount: bigint | number
  plugin: string
  groups: bigint | number
}

export type RekeyArgs = {
  global: boolean
  escrow: string
  methodOffsets: bigint[] | number[]
  fundsRequest: [number | bigint, number | bigint][]
}

export type AddPluginArgs = Omit<ContractArgs['arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool)void'], 'name'>

// Updated plugin parameters to support fluent transaction API
export type WalletUsePluginParams = (
  Omit<ContractArgs['arc58_rekeyToPlugin(uint64,bool,string,uint64[],(uint64,uint64)[])void'], 'plugin' | 'global' | 'escrow' | 'methodOffsets' | 'fundsRequest'> &
  {
    name?: string
    global?: boolean
    escrow?: string
    fundsRequest?: FundsRequest[]
    calls: PluginSDKReturn[]
    lease?: string
  }
) & MaybeSigner;

export type BuildWalletUsePluginParams = (
  WalletUsePluginParams
  & {
    lease: string,
    firstValid?: bigint,
    windowSize: bigint
  }
)

export type ExecutionBuildGroup = {
  lease: Uint8Array
  firstValid: bigint
  lastValid: bigint
  useRounds: boolean
  ids: Uint8Array[]
  atcs: algosdk.AtomicTransactionComposer[]
}

// Default values for addPlugin method
export const AddPluginDefaults = {
  escrow: '',
  name: '',
  useExecutionKey: false,
  useRounds: false,
  admin: false,
  delegationType: 0n,
}

export type CanCallParams = (
  Omit<ContractArgs['arc58_canCall(uint64,bool,address,string,byte[4])bool'], 'method'>
  & {
    method: PluginMethodSpecifier
  }
  & MaybeSigner
)

// Enhanced method specification that supports method references directly
export type PluginMethodDefinition = {
  name: PluginMethodSpecifier;
  cooldown: bigint;
};

export type SpendAllowanceType = 'flat' | 'window' | 'drip';

export type AddAllowanceArgs = {
  asset: bigint;
  useRounds?: boolean;
} & (
    | {
      type: 'flat';
      amount: bigint;
    }
    | {
      type: 'window';
      amount: bigint;
      interval: bigint;
    }
    | {
      type: 'drip';
      rate: bigint;
      max: bigint;
      interval: bigint;
    }
  );

// AllowanceInfo
export type AllowanceInfo = {
  last: bigint,
  start: bigint,
  useRounds: boolean
} & (
    | {
      type: 'flat',
      spent: bigint,
      amount: bigint,
    }
    | {
      type: 'window',
      spent: bigint,
      amount: bigint,
      interval: bigint,
    }
    | {
      type: 'drip',
      max: bigint,
      lastLeftover: bigint,
      rate: bigint,
      interval: bigint,
    }
  )

// allowance info type guards
export function isFlatAllowance(info: AllowanceInfo): info is Extract<AllowanceInfo, { type: 'flat' }> {
  return info.type === 'flat';
}

export function isWindowAllowance(info: AllowanceInfo): info is Extract<AllowanceInfo, { type: 'window' }> {
  return info.type === 'window';
}

export function isDripAllowance(info: AllowanceInfo): info is Extract<AllowanceInfo, { type: 'drip' }> {
  return info.type === 'drip';
}

type BaseWalletAddPluginParams<TClient extends SDKClient> =
  Partial<Omit<ContractArgs['arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool)void'], 'methods'>> &
  MaybeSigner &
  {
    client: AkitaSDK<TClient>
    methods?: PluginMethodDefinition[]
    allowances?: AddAllowanceArgs[]
  }

export type WalletAddPluginParams<TClient extends SDKClient> =
  BaseWalletAddPluginParams<TClient> & (
    | { global: true }
    | { global?: false | undefined; caller: string }
  )

/**
 * Type guard to check if an object is a valid AkitaSDK instance for use with plugins
 */
export function isValidPluginSDK<TClient extends SDKClient>(
  sdk: any
): sdk is AkitaSDK<TClient> {
  return (
    sdk &&
    typeof sdk === 'object' &&
    typeof sdk.appId === 'bigint' &&
    sdk.client &&
    typeof sdk.client.appId === 'bigint' &&
    typeof sdk.client.appAddress === 'string' &&
    sdk.algorand
  );
}

/**
 * Extract the app ID from a plugin SDK instance in a type-safe way
 */
export function getPluginAppId<TClient extends SDKClient>(
  plugin: AkitaSDK<TClient>
): bigint {
  return plugin.appId;
}