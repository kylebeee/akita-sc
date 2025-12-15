"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulateBuilder = void 0;
const ZERO = 0n;
function applyHint(base, hint) {
    if (!hint)
        return base;
    return {
        asset: base.asset,
        amount: hint.amount ?? base.amount,
        mbr: hint.mbr ?? base.mbr,
        fee: hint.fee ?? base.fee,
        total: (hint.amount ?? base.amount) +
            (hint.mbr ?? base.mbr) +
            (hint.fee ?? base.fee),
    };
}
function aggregatePayments(payments) {
    const subtotalsMap = new Map();
    let totalAlgo = ZERO;
    for (const p of payments) {
        const current = subtotalsMap.get(p.asset) ?? ZERO;
        subtotalsMap.set(p.asset, current + p.total);
    }
    // Asset 0 (ALGO) contributes to totalAlgo; other assets only if caller
    // chooses to convert them off-chain later.
    totalAlgo = (subtotalsMap.get(0n) ?? ZERO);
    return {
        payments,
        networkFees: ZERO,
        subtotals: Array.from(subtotalsMap, ([asset, amount]) => ({ asset, amount })),
        totalAlgo,
    };
}
function collectPayments(group, hints) {
    const payments = [];
    for (const { txn } of group) {
        if (!txn)
            continue;
        const type = txn.type;
        const tx = txn;
        if (type === "pay") {
            const amount = BigInt(tx.amount ?? tx.amt ?? 0);
            const base = {
                asset: 0n,
                amount,
                mbr: ZERO,
                fee: ZERO,
                total: amount,
            };
            payments.push(applyHint(base, hints.get(0n)));
        }
        else if (type === "axfer") {
            const assetId = BigInt(tx.assetIndex ?? tx.xaid ?? 0);
            const amount = BigInt(tx.assetAmount ?? tx.aamt ?? 0);
            const base = {
                asset: assetId,
                amount,
                mbr: ZERO,
                fee: ZERO,
                total: amount,
            };
            payments.push(applyHint(base, hints.get(assetId)));
        }
    }
    // Add any hints that didn't correspond to detected txns (e.g., pure MBR).
    for (const [asset, hint] of hints.entries()) {
        const already = payments.find((p) => p.asset === asset);
        if (!already) {
            const amount = hint.amount ?? ZERO;
            payments.push(applyHint({
                asset,
                amount,
                mbr: hint.mbr ?? ZERO,
                fee: hint.fee ?? ZERO,
                total: amount +
                    (hint.mbr ?? ZERO) +
                    (hint.fee ?? ZERO),
            }, hint));
        }
    }
    return payments;
}
class SimulateBuilder {
    constructor(atc, options = {}) {
        this.atc = atc;
        this.options = options;
    }
    build() {
        const group = this.atc.buildGroup();
        const hints = new Map();
        for (const hint of this.options.payments ?? []) {
            hints.set(hint.asset, hint);
        }
        const payments = collectPayments(group, hints);
        const networkFees = this.options.networkFeeOverride ??
            group.reduce((acc, { txn }) => acc + BigInt(txn.fee ?? 0), ZERO);
        const expected = aggregatePayments(payments);
        expected.networkFees = networkFees;
        expected.totalAlgo += networkFees;
        return {
            expectedCost: expected,
            atc: this.atc,
            toSignerRequest: () => group,
        };
    }
}
exports.SimulateBuilder = SimulateBuilder;
//# sourceMappingURL=builder.js.map