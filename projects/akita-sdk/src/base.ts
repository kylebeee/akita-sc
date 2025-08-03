import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { DEFAULT_READER, DEFAULT_SEND_PARAMS } from "./constants";
import { NewBaseContractSDKParams } from "./types";
import { SendParams } from "@algorandfoundation/algokit-utils/types/transaction";

export abstract class BaseSDK<T> {
  public appId: bigint;
  public client: T;
  public algorand: AlgorandClient;
  public readerAccount: string = DEFAULT_READER;
  public sendParams: SendParams = DEFAULT_SEND_PARAMS;

  constructor({ factoryParams, algorand, factory, readerAccount, sendParams }: NewBaseContractSDKParams<T>) {
    this.appId = factoryParams.appId;
    this.algorand = algorand;
    this.client = new factory({ algorand }).getAppClientById(factoryParams);
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