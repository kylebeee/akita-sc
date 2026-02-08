import { AccountDelta } from "./types";
/**
 * Extract account balance deltas from a simulation response.
 * Uses codec field names from the algod API response format.
 *
 * Codec field names:
 * - Payment (pay): snd, rcv, amt, fee, close
 * - Asset Transfer (axfer): snd, arcv, aamt, xaid, fee, aclose
 */
export declare function extractAccountDeltas(simResponse: unknown, account: string): AccountDelta[];
