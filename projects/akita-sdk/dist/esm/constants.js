import { makeEmptyTransactionSigner } from "algosdk";
import { microAlgo } from "@algorandfoundation/algokit-utils";
export const DEFAULT_READER = "Y76M3MSY6DKBRHBL7C3NNDXGS5IIMQVQVUAB6MP4XEMMGVF2QWNPL226CA"; // "Y76M3MSY6DKBRHBL7C3NNDXGS5IIMQVQVUAB6MP4XEMMGVF2QWNPL226CA"
export const emptySigner = makeEmptyTransactionSigner();
export const SIMULATE_PARAMS = {
    allowMoreLogging: true,
    allowUnnamedResources: true,
    extraOpcodeBudget: 130013,
    fixSigners: true,
    allowEmptySignatures: true,
};
export const DEFAULT_SEND_PARAMS = {
    /** Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`. */
    populateAppCallResources: true,
    /** Whether to use simulate to automatically calculate required app call inner transaction fees and cover them in the parent app call transaction fee */
    coverAppCallInnerTransactionFees: true,
    /** the maximum fee to pay */
    maxFee: microAlgo(257000n)
};
export const MAX_UINT64 = BigInt("18446744073709551615"); // 2^64 - 1, the maximum value for a 64-bit unsigned integer
//# sourceMappingURL=constants.js.map