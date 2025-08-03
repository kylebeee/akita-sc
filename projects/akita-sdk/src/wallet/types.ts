import algosdk from "algosdk";
import { GlobalKeysState, PluginInfo as ClientPluginInfo, AbstractedAccountArgs } from "../generated/AbstractedAccountClient";
import { WithSigner, SDKClient, AkitaSDK, PluginMethodSpecifier, PluginSDKReturn } from "../types";

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
  escrow: string,
  methodCount: number
  pluginName: string
  escrowName: string
}

export type RekeyArgs = {
  global: boolean
  escrow: string
  methodOffsets: bigint[] | number[]
  fundsRequest: [number | bigint, number | bigint][]
}

// Updated plugin parameters to support fluent transaction API
export type WalletUsePluginParams<TClient extends SDKClient> = (
  Omit<ContractArgs['arc58_rekeyToPlugin(uint64,bool,string,uint64[],(uint64,uint64)[])void'], 'plugin' | 'escrow' | 'methodOffsets' | 'fundsRequest'> &
  {
    name?: string
    escrow?: string
    client: AkitaSDK<TClient>
    fundsRequest?: FundsRequest[]
    calls: PluginSDKReturn[]
  }
) & WithSigner;

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
  WithSigner &
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