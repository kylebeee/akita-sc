import { GlobalKeysState, PluginInfo as ClientPluginInfo, AbstractedAccountArgs, AbstractedAccountReturns } from "../generated/AbstractedAccountClient";
import { MaybeSigner, SDKClient, AkitaSDK, PluginMethodSpecifier, PluginSDKReturn } from "../types";
import { ABIReturn, AppReturn } from "@algorandfoundation/algokit-utils/types/app";
import { ABIStruct } from "@algorandfoundation/algokit-utils/types/app-arc56";
import algosdk from "algosdk";

export type ContractArgs = AbstractedAccountArgs["obj"];

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
}

export type RekeyArgs = {
  global: boolean
  escrow: string
  methodOffsets: bigint[] | number[]
  fundsRequest: [number | bigint, number | bigint][]
}

// Updated plugin parameters to support fluent transaction API
export type WalletUsePluginParams = (
  Omit<ContractArgs['arc58_rekeyToPlugin(uint64,bool,string,uint64[],(uint64,uint64)[])void'], 'plugin' | 'escrow' | 'methodOffsets' | 'fundsRequest'> &
  {
    name?: string
    escrow?: string
    fundsRequest?: FundsRequest[]
    calls: PluginSDKReturn[]
  }
) & MaybeSigner;

// Default values for addPlugin method
export const AddPluginDefaults = {
  escrow: '',
  name: '',
  useExecutionKey: false,
  useRounds: false,
  admin: false,
  delegationType: 0n,
}

// Enhanced method specification that supports method references directly
export type PluginMethodDefinition = {
  name: PluginMethodSpecifier;
  cooldown: bigint;
};

type BaseWalletAddPluginParams<TClient extends SDKClient> =
  Partial<Omit<ContractArgs['arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool)void'], 'methods'>> &
  MaybeSigner &
  {
    client: AkitaSDK<TClient>
    methods?: PluginMethodDefinition[]
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

export type UsePluginReturn = {
  groupId: string;
  txIds: string[];
  returns: ABIReturn[] & [];
  confirmations: algosdk.modelsv2.PendingTransactionResponse[];
  transactions: algosdk.Transaction[];
}

export type AddPluginReturn = Omit<{
  groupId: string;
  txIds: string[];
  returns?: ABIReturn[] | undefined;
  confirmations: algosdk.modelsv2.PendingTransactionResponse[];
  transactions: algosdk.Transaction[];
  confirmation: algosdk.modelsv2.PendingTransactionResponse;
  transaction: algosdk.Transaction;
  return?: ABIReturn | undefined;
}, "return"> & AppReturn<(
  undefined |
  AbstractedAccountReturns['arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool)void'] |
  AbstractedAccountReturns['arc58_addPlugin(uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool)void']
)>