import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { SendParams } from "@algorandfoundation/algokit-utils/types/transaction";
import { TransactionSigner } from "algosdk";

export type WithSigner = { sender: string; signer: TransactionSigner };

type ClientFactory<T> = new (params: { algorand: AlgorandClient }) => {
  getAppClientById(params: { appId: bigint }): T;
};

export interface NewBaseContractSDKParams<T> extends NewContractSDKParams {
  factory: ClientFactory<T>;
}

export interface NewContractSDKParams {
  appId: bigint;
  algorand: AlgorandClient;
  readerAccount?: string
  sendParams?: SendParams
}