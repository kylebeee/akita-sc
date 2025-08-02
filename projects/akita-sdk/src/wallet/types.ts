import algosdk from "algosdk";
import { WalletSDK } from ".";
import { GlobalKeysState, PluginInfo as ClientPluginInfo, AbstractedAccountClient, AbstractedAccountArgs } from "../generated/AbstractedAccountClient";
import { WithSigner } from "../types";

export type ContractArgs = AbstractedAccountArgs["obj"];

export type ClientAndSDK = {
  client: AbstractedAccountClient;
  sdk: WalletSDK;
}

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

export type WalletPluginParams<T> = (
  Omit<ContractArgs['arc58_rekeyToPlugin(uint64,bool,string,uint64[],(uint64,uint64)[])void'], 'plugin' | 'methodOffsets' | 'fundsRequest'> &
  {
    name?: string
    client: T
    fundsRequest?: FundsRequest[]
    txns: algosdk.Transaction[][]
  }
) & WithSigner;

type MethodNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type MethodSignatures<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never;
}[keyof T];

export const AddPluginDefaults = {
  escrow: '',
  name: '',
  useExecutionKey: false,
  useRounds: false,
  admin: false,
  delegationType: 0n,
}

export type WalletAddPluginParams<T> = (
  Omit<ContractArgs['arc58_addPlugin(uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool)void'], 'methods'> &
  WithSigner &
  {
    name?: string
    client: T
    methods: {
      name: MethodNames<T> | MethodSignatures<T> | Uint8Array
      cooldown: bigint
    }[]
  }
)