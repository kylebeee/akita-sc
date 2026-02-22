import { ExpectedCost } from "./types";
import { WalletUsePluginParams } from "../wallet/types";
/**
 * Estimate transaction costs when simulation fails.
 * This provides a conservative estimate based on transaction structure.
 */
export declare function estimateFallbackCost(txnCount: number, params: WalletUsePluginParams): ExpectedCost;
/**
 * Estimate costs for a simple transaction count when params aren't available.
 */
export declare function estimateSimpleCost(txnCount: number): ExpectedCost;
