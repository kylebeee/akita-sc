import algosdk from "algosdk";
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
import { SimulateOptions } from "./builder";
import { ExpectedCost } from "./types";
export type PrepareGroupOptions = {
    coverAppCallInnerTransactionFees?: boolean;
    populateAppCallResources?: boolean;
};
export type PrepareGroupContext = {
    maxFees?: Map<number, AlgoAmount>;
    suggestedParams?: algosdk.SuggestedParams;
};
export type PrepareGroupResult = {
    atc: algosdk.AtomicTransactionComposer;
    expectedCost: ExpectedCost;
};
/**
 * Combined prepare + cost calculation using a single simulate.
 * This replaces the need for prepareGroupForSending + SimulateBuilder separately.
 */
export declare function prepareGroupWithCost(atc: algosdk.AtomicTransactionComposer, algod: algosdk.Algodv2, sendParams?: PrepareGroupOptions, additionalAtcContext?: PrepareGroupContext, simulateAccount?: string, simulateOptions?: SimulateOptions): Promise<PrepareGroupResult>;
