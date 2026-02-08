import algosdk from "algosdk";
const normalizeAddr = (addr) => {
    if (!addr)
        return null;
    if (typeof addr === "string")
        return addr;
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
export function extractAccountDeltas(simResponse, account) {
    const deltas = new Map();
    const addDelta = (asset, delta) => {
        deltas.set(asset, (deltas.get(asset) ?? 0n) + delta);
    };
    // Extract close amounts from simulation state deltas if available
    const getCloseAmount = (txnResult, assetId) => {
        // Close amounts come from simulation state deltas, not transaction fields
        // The actual remaining balance is calculated by the network
        // For now, we track the close-to address but the amount would need
        // to be derived from the state delta in the simulation response
        const localStateDelta = txnResult?.['local-state-delta'];
        const globalStateDelta = txnResult?.['global-state-delta'];
        // TODO: Parse state deltas to get actual close amounts
        // This requires understanding the specific app's state schema
        return 0n;
    };
    const applyTxn = (txnWrapper, txnResult) => {
        const t = (txnWrapper?.txn ?? txnWrapper);
        if (!t)
            return;
        const type = t.type;
        if (type === "pay") {
            // Payment transaction - use codec names: snd, rcv, amt, fee, close
            const snd = normalizeAddr(t.snd);
            const rcv = normalizeAddr(t.rcv);
            const close = normalizeAddr(t.close);
            const amt = BigInt(t.amt ?? 0);
            const fee = BigInt(t.fee ?? 0);
            if (snd === account)
                addDelta(0n, -amt - fee);
            if (rcv === account)
                addDelta(0n, amt);
            // Handle close-out: if close address is set, sender loses remaining balance
            // Note: The close amount is the remaining balance after the payment,
            // which isn't a transaction field - it's calculated by the network
            if (close && close === account) {
                // The close-to address receives the remaining balance
                // We'd need simulation state deltas to know the exact amount
                const closeAmount = txnResult ? getCloseAmount(txnResult, 0n) : 0n;
                if (closeAmount > 0n)
                    addDelta(0n, closeAmount);
            }
        }
        else if (type === "axfer") {
            // Asset transfer - use codec names: snd, arcv, aamt, xaid, fee, aclose
            const snd = normalizeAddr(t.snd);
            const rcv = normalizeAddr(t.arcv);
            const close = normalizeAddr(t.aclose);
            const amt = BigInt(t.aamt ?? 0);
            const assetId = BigInt(t.xaid ?? 0);
            const fee = BigInt(t.fee ?? 0);
            if (snd === account) {
                addDelta(assetId, -amt);
                addDelta(0n, -fee);
            }
            if (rcv === account)
                addDelta(assetId, amt);
            // Handle asset close-out
            if (close && close === account) {
                const closeAmount = txnResult ? getCloseAmount(txnResult, assetId) : 0n;
                if (closeAmount > 0n)
                    addDelta(assetId, closeAmount);
            }
        }
    };
    const walkInner = (inner) => {
        for (const tx of inner ?? []) {
            applyTxn(tx.txn ?? tx, tx['txn-result']);
            walkInner((tx['inner-txns'] ?? tx.innerTxns));
        }
    };
    const response = simResponse;
    const txnGroups = (response?.['txn-groups'] ?? response?.txnGroups) ?? [];
    for (const group of txnGroups) {
        const results = (group?.['txn-results'] ?? group?.txnResults) ?? [];
        for (const res of results) {
            const txnResult = (res?.['txn-result'] ?? res?.txnResult);
            applyTxn(res?.txn, txnResult);
            walkInner((txnResult?.['inner-txns'] ?? txnResult?.innerTxns));
        }
    }
    return Array.from(deltas.entries()).map(([asset, delta]) => ({ asset, delta }));
}
//# sourceMappingURL=deltas.js.map