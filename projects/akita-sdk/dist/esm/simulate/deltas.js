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
export function extractAccountDeltas(simResponse, account) {
    const deltas = new Map();
    const addDelta = (asset, delta) => {
        deltas.set(asset, (deltas.get(asset) ?? 0n) + delta);
    };
    const applyTxn = (txnWrapper) => {
        const t = txnWrapper?.txn ?? txnWrapper;
        if (!t)
            return;
        const type = t.type;
        if (type === "pay") {
            const snd = normalizeAddr(t.snd);
            const rcv = normalizeAddr(t.rcv ?? t.arcv ?? t.receiver);
            const amt = BigInt(t.amt ?? t.amount ?? 0);
            const fee = BigInt(t.fee ?? 0);
            if (snd === account)
                addDelta(0n, -amt - fee);
            if (rcv === account)
                addDelta(0n, amt);
        }
        else if (type === "axfer") {
            const snd = normalizeAddr(t.snd);
            const rcv = normalizeAddr(t.arcv ?? t.rcv ?? t.receiver);
            const amt = BigInt(t.aamt ?? t.assetAmount ?? 0);
            const assetId = BigInt(t.xaid ?? t["asset-id"] ?? t.assetIndex ?? 0);
            if (snd === account) {
                addDelta(assetId, -amt);
                const fee = BigInt(t.fee ?? 0);
                addDelta(0n, -fee);
            }
            if (rcv === account)
                addDelta(assetId, amt);
        }
    };
    const walkInner = (inner) => {
        for (const tx of inner ?? []) {
            applyTxn(tx.txn ?? tx);
            walkInner(tx["inner-txns"] ?? tx.innerTxns);
        }
    };
    const txnGroups = simResponse?.["txn-groups"] ?? simResponse?.txnGroups ?? [];
    for (const group of txnGroups) {
        const results = group?.["txn-results"] ?? group?.txnResults ?? [];
        for (const res of results) {
            applyTxn(res?.txn);
            walkInner(res?.["txn-result"]?.["inner-txns"] ?? res?.txnResult?.innerTxns);
        }
    }
    return Array.from(deltas.entries()).map(([asset, delta]) => ({ asset, delta }));
}
//# sourceMappingURL=deltas.js.map