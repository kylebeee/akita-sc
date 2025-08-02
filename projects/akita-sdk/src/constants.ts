import { SendParams } from "@algorandfoundation/algokit-utils/types/transaction";
import { makeEmptyTransactionSigner } from "algosdk";

export const DEFAULT_READER = "Y76M3MSY6DKBRHBL7C3NNDXGS5IIMQVQVUAB6MP4XEMMGVF2QWNPL226CA"

export const emptySigner = makeEmptyTransactionSigner();

export const SIMULATE_PARAMS = {
  allowMoreLogging: true,
  allowUnnamedResources: true,
  extraOpcodeBudget: 130013,
  fixSigners: true,
  allowEmptySignatures: true,
};

export const DEFAULT_SEND_PARAMS: SendParams = {
    /** Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`. */
    populateAppCallResources: true,
    /** Whether to use simulate to automatically calculate required app call inner transaction fees and cover them in the parent app call transaction fee */
    coverAppCallInnerTransactionFees: true
}