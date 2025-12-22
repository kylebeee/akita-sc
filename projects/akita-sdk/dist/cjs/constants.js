"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_UINT64 = exports.DEFAULT_SEND_PARAMS = exports.SIMULATE_PARAMS = exports.emptySigner = exports.DEFAULT_READER = void 0;
const algosdk_1 = require("algosdk");
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
exports.DEFAULT_READER = "Y76M3MSY6DKBRHBL7C3NNDXGS5IIMQVQVUAB6MP4XEMMGVF2QWNPL226CA"; // "Y76M3MSY6DKBRHBL7C3NNDXGS5IIMQVQVUAB6MP4XEMMGVF2QWNPL226CA"
exports.emptySigner = (0, algosdk_1.makeEmptyTransactionSigner)();
exports.SIMULATE_PARAMS = {
    allowMoreLogging: true,
    allowUnnamedResources: true,
    extraOpcodeBudget: 130013,
    fixSigners: true,
    allowEmptySignatures: true,
};
exports.DEFAULT_SEND_PARAMS = {
    /** Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`. */
    populateAppCallResources: true,
    /** Whether to use simulate to automatically calculate required app call inner transaction fees and cover them in the parent app call transaction fee */
    coverAppCallInnerTransactionFees: true,
    /** the maximum fee to pay */
    maxFee: (0, algokit_utils_1.microAlgo)(257000n)
};
exports.MAX_UINT64 = BigInt("18446744073709551615"); // 2^64 - 1, the maximum value for a 64-bit unsigned integer
//# sourceMappingURL=constants.js.map