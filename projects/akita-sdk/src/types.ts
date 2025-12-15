import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
import { SendParams } from "@algorandfoundation/algokit-utils/types/transaction";
import { Address, modelsv2, Transaction, TransactionSigner } from "algosdk";
import { AppFactoryAppClientParams } from "@algorandfoundation/algokit-utils/types/app-factory";
import { Txn } from "@algorandfoundation/algokit-utils/types/composer";
import { ABIReturn, AppReturn } from "@algorandfoundation/algokit-utils/types/app";

export type MaybeSigner = {
  sender?: Address | string;
  signer?: TransactionSigner;
};

export type ClientFactory<T> = new (params: { algorand: AlgorandClient }) => {
  getAppClientById(params: AppFactoryAppClientParams): T;
};

export interface SDKClient {
  appId: bigint;
  algorand: AlgorandClient;
}

export type ExpandedSendParams = SendParams & {
  maxFee?: AlgoAmount;
  sender?: Address | string;
  signer?: TransactionSigner;
};

export type ExpandedSendParamsWithSigner = ExpandedSendParams & {
  sender: Address | string;
  signer: TransactionSigner;
};

// Type guard function
export function hasSenderSigner(params: ExpandedSendParams): params is ExpandedSendParamsWithSigner {
  return params.sender !== undefined && params.signer !== undefined;
}

// Generic type for SDK instances that extend BaseSDK
export interface AkitaSDK<TClient extends SDKClient = SDKClient> {
  appId: bigint;
  client: TClient;
  algorand: AlgorandClient;
  readerAccount: string;
  sendParams: SendParams;
  setReaderAccount(readerAccount: string): void;
  setSendParams(sendParams: SendParams): void;
}

// Helper type to extract the client type from an SDK
export type ExtractClientType<T> = T extends AkitaSDK<infer C> ? C : never;

// Helper type to extract the SDK type from a client
export type SDKFromClient<TClient extends SDKClient> = AkitaSDK<TClient>;

export interface NewBaseContractSDKParams<T> extends NewContractSDKParams {
  factory: ClientFactory<T>;
}

// Utility types for working with SDK instances

// Type guard to check if an object is an AkitaSDK instance
export type IsAkitaSDK<T> = T extends AkitaSDK<any> ? true : false;

// Union type helper for multiple SDK types
export type AnyAkitaSDK = AkitaSDK<any>;

// Type to constrain function parameters to only accept AkitaSDK instances
export type RequireAkitaSDK<T extends AkitaSDK<any>> = T;

// Type to extract method signatures from a client (for direct method usage)
export type ClientMethodSignatures<TClient> = {
  [K in keyof TClient]: TClient[K] extends (...args: any[]) => any ? TClient[K] : never;
}[keyof TClient];

// Type to extract method names from a client (useful for dynamic method calling)
export type ClientMethods<TClient> = {
  [K in keyof TClient]: TClient[K] extends (...args: any[]) => any ? K : never;
}[keyof TClient];

export type PluginHookParams = {
  wallet: bigint;
}

export type PluginSDKReturn = (spendingAddress?: Address | string) => {
  appId: bigint;
  selectors: Uint8Array[];
  getTxns: (params: PluginHookParams) => Promise<Txn[]>
}

export function isPluginSDKReturn(value: unknown): value is PluginSDKReturn {
  return typeof value === 'function';
}

// Helper type for plugin method specifications that allows both string names and method references
export type PluginMethodSpecifier = PluginSDKReturn | Uint8Array[];

// Type for SDK constructor parameters with proper client factory typing
export type SDKConstructorParams<TClient extends SDKClient> = NewContractSDKParams & {
  factory: ClientFactory<TClient>;
};

/**
 * Factory params with optional appId - can be resolved from environment
 */
export type OptionalAppIdFactoryParams = Omit<AppFactoryAppClientParams, 'appId'> & {
  appId?: bigint;
};

/**
 * Parameters for constructing SDK instances
 * appId is optional - if not provided, will be resolved from environment variables
 */
export interface NewContractSDKParams {
  factoryParams: OptionalAppIdFactoryParams;
  algorand: AlgorandClient;
  readerAccount?: string;
  sendParams?: SendParams;
}

export interface PluginCallParams {
  appId: bigint;
  method: string;
  args?: any[];
  sendParams?: ExpandedSendParams;
  readerAccount?: string;
}

export type TxnReturn<T> = Omit<{
  groupId: string;
  txIds: string[];
  returns?: ABIReturn[] | undefined;
  confirmations: modelsv2.PendingTransactionResponse[];
  transactions: Transaction[];
  confirmation: modelsv2.PendingTransactionResponse;
  transaction: Transaction;
  return?: ABIReturn | undefined;
}, "return"> & AppReturn<T>

export type GroupReturn = {
  groupId: string;
  txIds: string[];
  returns: ABIReturn[] & [];
  confirmations: modelsv2.PendingTransactionResponse[];
  transactions: Transaction[];
}