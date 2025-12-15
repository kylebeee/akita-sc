import algosdk from "algosdk";

/**
 * Single asset (or ALGO) payment component.
 */
export type AssetPayment = {
  /** Asset ID (use 0 for ALGO). */
  asset: bigint;
  /** Actual payment amount (what leaves the sender wallet). */
  amount: bigint;
  /** Minimum Balance Requirement (locked but potentially refundable). */
  mbr: bigint;
  /** Non-refundable protocol/service fee. */
  fee: bigint;
  /** Total for this asset (amount + mbr + fee). */
  total: bigint;
};

/**
 * Aggregated cost view across assets and network fees.
 */
export type ExpectedCost = {
  /** Itemized payments per asset (including ALGO as asset 0). */
  payments: AssetPayment[];
  /** Total network fees (sum of txn fees across the group). */
  networkFees: bigint;
  /** Quick lookup of totals by asset. */
  subtotals: { asset: bigint; amount: bigint }[];
  /** Total cost in microAlgos (ALGO payments + network fees). */
  totalAlgo: bigint;
  /** Optional fiat estimation if caller provides price data. */
  totalUsd?: number;
  /** Optional per-asset deltas for a specific account (from simulation). */
  accountDeltas?: AccountDelta[];
};

export type AccountDelta = {
  asset: bigint;
  /** Positive = received, Negative = spent. */
  delta: bigint;
};

/**
 * Callback surface for downstream signing/sending without tying to any UI.
 */
export type SimulateCallbacks = {
  sign?: (
    atc: algosdk.AtomicTransactionComposer
  ) => Promise<algosdk.SignedTransaction[] | Uint8Array[]>;
  send?: (
    signedTxns: (algosdk.SignedTransaction | Uint8Array)[]
  ) => Promise<string>;
};

/**
 * Result of a simulate/build call: cost breakdown + unsigned group.
 */
export type SimulatePayload = {
  /** Expected cost breakdown for the operation. */
  expectedCost: ExpectedCost;
  /** Group of transactions ready for signing/submission. */
  atc: algosdk.AtomicTransactionComposer;
};

export type SimulateResultWithDeltas = SimulatePayload & {
  accountDeltas?: AccountDelta[];
};

