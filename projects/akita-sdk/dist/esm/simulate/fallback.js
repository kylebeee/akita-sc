/**
 * Estimate transaction costs when simulation fails.
 * This provides a conservative estimate based on transaction structure.
 */
export function estimateFallbackCost(txnCount, params) {
    const { fundsRequest = [] } = params;
    // Base fee: 1000 microAlgo per transaction
    const baseFee = 1000n;
    // Extra fees for rekey transaction (1000 + 1000 per fund request)
    const rekeyExtraFee = 1000n + BigInt(fundsRequest.length * 1000);
    // Total network fees estimate
    const networkFees = (BigInt(txnCount) * baseFee) + rekeyExtraFee;
    // Build payment breakdown from funds request
    const payments = fundsRequest.map(({ asset, amount }) => ({
        asset,
        amount,
        mbr: 0n,
        fee: 0n,
        total: amount,
    }));
    // Calculate subtotals by asset
    const subtotalMap = new Map();
    for (const payment of payments) {
        const current = subtotalMap.get(payment.asset) ?? 0n;
        subtotalMap.set(payment.asset, current + payment.total);
    }
    const subtotals = Array.from(subtotalMap.entries()).map(([asset, amount]) => ({
        asset,
        amount,
    }));
    // Total ALGO cost = ALGO payments + network fees
    const algoPayments = subtotalMap.get(0n) ?? 0n;
    const totalAlgo = algoPayments + networkFees;
    return {
        payments,
        networkFees,
        subtotals,
        totalAlgo,
    };
}
/**
 * Estimate costs for a simple transaction count when params aren't available.
 */
export function estimateSimpleCost(txnCount) {
    const baseFee = 1000n;
    const networkFees = BigInt(txnCount) * baseFee;
    return {
        payments: [],
        networkFees,
        subtotals: [],
        totalAlgo: networkFees,
    };
}
//# sourceMappingURL=fallback.js.map