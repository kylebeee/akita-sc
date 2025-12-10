import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * Get account balance in microAlgos
 */
export const getAccountBalance = async (
    algorand: AlgorandClient,
    address: string
): Promise<bigint> => {
    const info = await algorand.client.algod.accountInformation(address).do()
    return BigInt(info.amount)
}

/**
 * Transaction fee constants
 */
export const MIN_TXN_FEE = 1_000n
export const INNER_TXN_FEE = 1_000n

/**
 * Expected cost breakdown for an operation
 */
export type ExpectedCost = {
    /** The main payment amount (e.g., MBR, reward amount) */
    payment: bigint
    /** Transaction fees (base fee + inner transaction fees) */
    fees: bigint
    /** Total expected cost (payment + fees) */
    total: bigint
}

/**
 * Calculate expected fees for an operation
 * @param innerTxCount Number of inner transactions
 * @param extraFee Any extra fee specified
 */
export const calculateExpectedFees = (
    innerTxCount: number = 0,
    extraFee: bigint = 0n
): bigint => {
    return MIN_TXN_FEE + (INNER_TXN_FEE * BigInt(innerTxCount)) + extraFee
}

/**
 * Create an expected cost object
 */
export const createExpectedCost = (
    payment: bigint,
    innerTxCount: number = 0,
    extraFee: bigint = 0n
): ExpectedCost => {
    const fees = calculateExpectedFees(innerTxCount, extraFee)
    return {
        payment,
        fees,
        total: payment + fees,
    }
}

/**
 * Balance verification result
 */
export type BalanceVerification = {
    balanceBefore: bigint
    balanceAfter: bigint
    actualCost: bigint
    expectedCost: ExpectedCost
    /** Whether the actual cost matches the expected cost (within tolerance) */
    matches: boolean
}

/**
 * Verify account balance before and after an operation
 * @param algorand Algorand client
 * @param address Account address
 * @param expectedCost Expected cost breakdown
 * @param operationName Name of the operation (for error messages)
 * @returns Balance verification result
 */
export const verifyBalanceChange = async (
    algorand: AlgorandClient,
    address: string,
    expectedCost: ExpectedCost,
    operationName: string
): Promise<BalanceVerification> => {
    const balanceBefore = await getAccountBalance(algorand, address)

    // Verify account has sufficient balance
    if (balanceBefore < expectedCost.total) {
        throw new Error(
            `Insufficient balance for ${operationName}: have ${balanceBefore}, need ${expectedCost.total} (payment: ${expectedCost.payment}, fees: ${expectedCost.fees})`
        )
    }

    // Return verification object (balanceAfter will be set after operation)
    return {
        balanceBefore,
        balanceAfter: 0n, // Will be updated after operation
        actualCost: 0n, // Will be calculated after operation
        expectedCost,
        matches: false, // Will be calculated after operation
    }
}

/**
 * Complete balance verification after an operation
 * @param verification Initial verification object
 * @param algorand Algorand client
 * @param address Account address
 * @param tolerance Tolerance for cost matching (default: 1000 microAlgos for rounding)
 * @returns Updated verification with actual costs
 */
export const completeBalanceVerification = async (
    verification: BalanceVerification,
    algorand: AlgorandClient,
    address: string,
    tolerance: bigint = 1_000n
): Promise<BalanceVerification> => {
    const balanceAfter = await getAccountBalance(algorand, address)
    const actualCost = verification.balanceBefore - balanceAfter

    // Check if actual cost matches expected (within tolerance)
    const costDiff = actualCost > verification.expectedCost.total
        ? actualCost - verification.expectedCost.total
        : verification.expectedCost.total - actualCost

    const matches = costDiff <= tolerance

    return {
        ...verification,
        balanceAfter,
        actualCost,
        matches,
    }
}

/**
 * Assert that balance change matches expected cost
 * @param verification Balance verification result
 * @param operationName Name of the operation (for error messages)
 */
export const expectBalanceChange = (
    verification: BalanceVerification,
    operationName: string
): void => {
    if (!verification.matches) {
        throw new Error(
            `Balance change mismatch for ${operationName}: expected ${verification.expectedCost.total}, got ${verification.actualCost} (diff: ${verification.expectedCost.total > verification.actualCost ? verification.expectedCost.total - verification.actualCost : verification.actualCost - verification.expectedCost.total})`
        )
    }
}

