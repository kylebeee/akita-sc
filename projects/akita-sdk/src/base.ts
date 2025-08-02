import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { DEFAULT_READER, DEFAULT_SEND_PARAMS } from "./constants";
import { NewBaseContractSDKParams } from "./types";

export abstract class BaseSDK<T> {
  public appId: bigint;
  public client: T;
  public algorand: AlgorandClient;
  public readerAccount = DEFAULT_READER;
  public sendParams = DEFAULT_SEND_PARAMS;

  constructor({ appId, algorand, factory, readerAccount, sendParams }: NewBaseContractSDKParams<T>) {
    this.appId = appId;
    this.algorand = algorand;
    this.client = new factory({ algorand: this.algorand }).getAppClientById({ appId: this.appId });
    if (readerAccount) this.readerAccount = readerAccount;
    if (sendParams) this.sendParams = sendParams;
  }

  setReaderAccount(readerAccount: string): void {
    this.readerAccount = readerAccount;
  }

  setSendParams(sendParams: typeof DEFAULT_SEND_PARAMS): void {
    this.sendParams = sendParams;
  }
}