import algosdk from "algosdk";
import { AccountDelta } from "./types";

const normalizeAddr = (addr?: any): string | null => {
  if (!addr) return null;
  if (typeof addr === "string") return addr;
  if (addr instanceof Uint8Array && addr.length === 32) {
    return algosdk.encodeAddress(addr);
  }
  return null;
};

/**
 * Extract account balance deltas from a simulation response.
 * Uses codec field names from the algod API response format.
 * 
 * Codec field names:
 * - Payment (pay): snd, rcv, amt, fee, close
 * - Asset Transfer (axfer): snd, arcv, aamt, xaid, fee, aclose
 */
export function extractAccountDeltas(simResponse: unknown, account: string): AccountDelta[] {
  const deltas = new Map<bigint, bigint>();

  const addDelta = (asset: bigint, delta: bigint) => {
    deltas.set(asset, (deltas.get(asset) ?? 0n) + delta);
  };

  // Extract close amounts from simulation state deltas if available
  const getCloseAmount = (txnResult: Record<string, unknown>, assetId: bigint): bigint => {
    // Close amounts come from simulation state deltas, not transaction fields
    // The actual remaining balance is calculated by the network
    // For now, we track the close-to address but the amount would need
    // to be derived from the state delta in the simulation response
    const localStateDelta = txnResult?.['local-state-delta'] as Array<Record<string, unknown>> | undefined;
    const globalStateDelta = txnResult?.['global-state-delta'] as Array<Record<string, unknown>> | undefined;
    
    // TODO: Parse state deltas to get actual close amounts
    // This requires understanding the specific app's state schema
    return 0n;
  };

  const applyTxn = (txnWrapper: Record<string, unknown> | undefined, txnResult?: Record<string, unknown>) => {
    const t = (txnWrapper?.txn ?? txnWrapper) as Record<string, unknown> | undefined;
    if (!t) return;

    const type = t.type as string;
    
    if (type === "pay") {
      // Payment transaction - use codec names: snd, rcv, amt, fee, close
      const snd = normalizeAddr(t.snd);
      const rcv = normalizeAddr(t.rcv);
      const close = normalizeAddr(t.close);
      const amt = BigInt((t.amt as number | bigint) ?? 0);
      const fee = BigInt((t.fee as number | bigint) ?? 0);
      
      if (snd === account) addDelta(0n, -amt - fee);
      if (rcv === account) addDelta(0n, amt);
      
      // Handle close-out: if close address is set, sender loses remaining balance
      // Note: The close amount is the remaining balance after the payment,
      // which isn't a transaction field - it's calculated by the network
      if (close && close === account) {
        // The close-to address receives the remaining balance
        // We'd need simulation state deltas to know the exact amount
        const closeAmount = txnResult ? getCloseAmount(txnResult, 0n) : 0n;
        if (closeAmount > 0n) addDelta(0n, closeAmount);
      }
    } else if (type === "axfer") {
      // Asset transfer - use codec names: snd, arcv, aamt, xaid, fee, aclose
      const snd = normalizeAddr(t.snd);
      const rcv = normalizeAddr(t.arcv);
      const close = normalizeAddr(t.aclose);
      const amt = BigInt((t.aamt as number | bigint) ?? 0);
      const assetId = BigInt((t.xaid as number | bigint) ?? 0);
      const fee = BigInt((t.fee as number | bigint) ?? 0);
      
      if (snd === account) {
        addDelta(assetId, -amt);
        addDelta(0n, -fee);
      }
      if (rcv === account) addDelta(assetId, amt);
      
      // Handle asset close-out
      if (close && close === account) {
        const closeAmount = txnResult ? getCloseAmount(txnResult, assetId) : 0n;
        if (closeAmount > 0n) addDelta(assetId, closeAmount);
      }
    }
  };

  const walkInner = (inner: Array<Record<string, unknown>> | undefined) => {
    for (const tx of inner ?? []) {
      applyTxn(tx.txn as Record<string, unknown> | undefined ?? tx, tx['txn-result'] as Record<string, unknown> | undefined);
      walkInner((tx['inner-txns'] ?? tx.innerTxns) as Array<Record<string, unknown>> | undefined);
    }
  };

  const response = simResponse as Record<string, unknown>;
  const txnGroups = (response?.['txn-groups'] ?? response?.txnGroups) as Array<Record<string, unknown>> ?? [];
  for (const group of txnGroups) {
    const results = (group?.['txn-results'] ?? group?.txnResults) as Array<Record<string, unknown>> ?? [];
    for (const res of results) {
      const txnResult = (res?.['txn-result'] ?? res?.txnResult) as Record<string, unknown> | undefined;
      applyTxn(res?.txn as Record<string, unknown> | undefined, txnResult);
      walkInner((txnResult?.['inner-txns'] ?? txnResult?.innerTxns) as Array<Record<string, unknown>> | undefined);
    }
  }

  return Array.from(deltas.entries()).map(([asset, delta]) => ({ asset, delta }));
}

