import { SendParams } from "@algorandfoundation/algokit-utils/types/transaction";
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
export declare const DEFAULT_READER: string;
export declare const emptySigner: import("algosdk").TransactionSigner;
export declare const SIMULATE_PARAMS: {
    allowMoreLogging: boolean;
    allowUnnamedResources: boolean;
    extraOpcodeBudget: number;
    fixSigners: boolean;
    allowEmptySignatures: boolean;
};
export declare const DEFAULT_SEND_PARAMS: SendParams & {
    maxFee: AlgoAmount;
};
export declare const MAX_UINT64: bigint;
