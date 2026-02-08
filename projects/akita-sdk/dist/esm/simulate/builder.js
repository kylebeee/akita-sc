import algosdk from "algosdk";
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
/**
 * Collect payment information from a transaction group.
 * Uses typed SDK Transaction properties (txn.payment, txn.assetTransfer, etc.)
 * since this receives TransactionWithSigner[] from atc.buildGroup().
 *
 * SDK Transaction properties:
 * - Payment: txn.payment.amount, txn.payment.closeRemainderTo
 * - Asset Transfer: txn.assetTransfer.amount, txn.assetTransfer.assetIndex,
 *                   txn.assetTransfer.closeRemainderTo
 */
function collectPayments(group, hints) {
    const payments = [];
    for (const { txn } of group) {
        if (!txn)
            continue;
        const type = txn.type;
        if (type === algosdk.TransactionType.pay) {
            // Payment transaction - use typed SDK properties
            const payment = txn.payment;
            const amount = payment?.amount ?? 0n;
            // Note: closeRemainderTo amount is the remaining balance after the payment
            // It's calculated by the network and not known at build time
            // Hints can be used to provide this information if needed
            const base = {
                asset: 0n,
                amount,
                mbr: ZERO,
                fee: ZERO,
                total: amount,
            };
            payments.push(applyHint(base, hints.get(0n)));
        }
        else if (type === algosdk.TransactionType.axfer) {
            // Asset transfer - use typed SDK properties
            const assetTransfer = txn.assetTransfer;
            const assetId = assetTransfer?.assetIndex ?? 0n;
            const amount = assetTransfer?.amount ?? 0n;
            // Note: closeRemainderTo for assets also sends remaining balance to the close address
            // Hints can be used to provide this information if needed
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
export class SimulateBuilder {
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
//# sourceMappingURL=builder.js.map