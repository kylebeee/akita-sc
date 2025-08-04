import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { DEFAULT_READER, DEFAULT_SEND_PARAMS } from "./constants";
import { ExpandedSendParams, NewBaseContractSDKParams } from "./types";

export abstract class BaseSDK<T> {
  public appId: bigint;
  public client: T;
  public algorand: AlgorandClient;
  public readerAccount: string = DEFAULT_READER;
  public sendParams: ExpandedSendParams = DEFAULT_SEND_PARAMS;

  constructor({ factoryParams, algorand, factory, readerAccount, sendParams }: NewBaseContractSDKParams<T>) {
    this.appId = factoryParams.appId;
    this.algorand = algorand;
    if (readerAccount) { this.readerAccount = readerAccount; }
    if (sendParams) { this.sendParams = sendParams; }

    if (!!factoryParams.defaultSender) {
      this.sendParams.sender = factoryParams.defaultSender;
    }
    if (!!factoryParams.defaultSigner) {
      this.sendParams.signer = factoryParams.defaultSigner;
    }

    this.client = new factory({ algorand }).getAppClientById(factoryParams);
  }

  setReaderAccount(readerAccount: string): void {
    this.readerAccount = readerAccount;
  }

  setSendParams(sendParams: ExpandedSendParams): void {
    this.sendParams = sendParams;
  }
}