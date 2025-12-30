import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { DEFAULT_READER, DEFAULT_SEND_PARAMS, SIMULATE_PARAMS } from "./constants";
import { resolveAppIdWithClient, ENV_VAR_NAMES, detectNetworkFromClient, getCurrentNetwork, AkitaNetwork } from "./config";
import { ExpandedSendParams, ExpandedSendParamsWithSigner, hasSenderSigner, MaybeSigner, NewBaseContractSDKParams } from "./types";
import { makeEmptyTransactionSigner } from "algosdk";

export abstract class BaseSDK<T> {
  public appId: bigint;
  public client: T;
  public algorand: AlgorandClient;
  public readerAccount: string = DEFAULT_READER;
  public sendParams: ExpandedSendParams = DEFAULT_SEND_PARAMS;
  
  /** The detected network for this SDK instance */
  public network: AkitaNetwork;

  /**
   * Override this in subclasses to specify the environment variable name for the app ID
   */
  protected static envVarName: string = '';

  constructor({ factoryParams, algorand, factory, readerAccount, sendParams }: NewBaseContractSDKParams<T>, envVarName?: string) {
    // Detect network from AlgorandClient
    this.network = detectNetworkFromClient(algorand);
    
    // Resolve app ID from provided value, environment, or network config
    const resolvedAppId = resolveAppIdWithClient(
      algorand,
      factoryParams.appId,
      envVarName || (this.constructor as typeof BaseSDK).envVarName || '',
      this.constructor.name
    );
    
    this.appId = resolvedAppId;
    this.algorand = algorand;
    if (readerAccount) { this.readerAccount = readerAccount; }
    if (sendParams) { this.sendParams = sendParams; }

    if (!!factoryParams.defaultSender) {
      this.sendParams.sender = factoryParams.defaultSender;
    }
    if (!!factoryParams.defaultSigner) {
      this.sendParams.signer = factoryParams.defaultSigner;
    }

    // Create the client with the resolved app ID
    this.client = new factory({ algorand }).getAppClientById({
      ...factoryParams,
      appId: resolvedAppId,
    });
  }

  setReaderAccount(readerAccount: string): void {
    this.readerAccount = readerAccount;
  }

  setSendParams(sendParams: ExpandedSendParams): void {
    this.sendParams = sendParams;
  }

  protected getSendParams({ sender, signer }: MaybeSigner = {}): ExpandedSendParams {
    return {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer }),
    };
  }

  protected getRequiredSendParams(params: MaybeSigner = {}): ExpandedSendParamsWithSigner {
    const sendParams = this.getSendParams(params);
    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at SDK instantiation');
    }
    return sendParams;
  }

  protected getReaderSendParams({ sender }: { sender?: string } = {}): ExpandedSendParams {
    return {
      ...this.sendParams,
      ...(sender !== undefined ? { sender } : { sender: this.readerAccount }),
      signer: makeEmptyTransactionSigner()
    };
  }
}