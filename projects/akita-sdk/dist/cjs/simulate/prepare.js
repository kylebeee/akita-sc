"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareGroupWithCost = prepareGroupWithCost;
const algosdk_1 = __importDefault(require("algosdk"));
const deltas_1 = require("./deltas");
/**
 * Get execution info from a single simulate call.
 */
async function getGroupExecutionInfo(atc, algod, sendParams, additionalAtcContext) {
    const simulateRequest = new algosdk_1.default.modelsv2.SimulateRequest({
        txnGroups: [],
        allowUnnamedResources: true,
        allowEmptySignatures: true,
        fixSigners: true,
    });
    const nullSigner = algosdk_1.default.makeEmptyTransactionSigner();
    const emptySignerAtc = atc.clone();
    const appCallIndexesWithoutMaxFees = [];
    emptySignerAtc['transactions'].forEach((t, i) => {
        t.signer = nullSigner;
        if (sendParams.coverAppCallInnerTransactionFees && t.txn.type === algosdk_1.default.TransactionType.appl) {
            if (!additionalAtcContext?.suggestedParams) {
                throw Error(`Please provide additionalAtcContext.suggestedParams when coverAppCallInnerTransactionFees is enabled`);
            }
            const maxFee = additionalAtcContext?.maxFees?.get(i)?.microAlgo;
            if (maxFee === undefined) {
                appCallIndexesWithoutMaxFees.push(i);
            }
            else {
                t.txn.fee = maxFee;
            }
        }
    });
    if (sendParams.coverAppCallInnerTransactionFees && appCallIndexesWithoutMaxFees.length > 0) {
        throw Error(`Please provide a maxFee for each app call transaction when coverAppCallInnerTransactionFees is enabled. Required for transaction ${appCallIndexesWithoutMaxFees.join(', ')}`);
    }
    const perByteTxnFee = BigInt(additionalAtcContext?.suggestedParams?.fee ?? 0n);
    const minTxnFee = BigInt(additionalAtcContext?.suggestedParams?.minFee ?? 1000n);
    const result = await emptySignerAtc.simulate(algod, simulateRequest);
    const simulateResponse = result.simulateResponse ?? result;
    const groupResponse = simulateResponse.txnGroups[0];
    if (groupResponse.failureMessage) {
        if (sendParams.coverAppCallInnerTransactionFees && groupResponse.failureMessage.match(/fee too small/)) {
            throw Error(`Fees were too small to resolve execution info via simulate. You may need to increase an app call transaction maxFee.`);
        }
        throw Error(`Error resolving execution info via simulate in transaction ${groupResponse.failedAt}: ${groupResponse.failureMessage}`);
    }
    return {
        simulateResponse,
        groupUnnamedResourcesAccessed: sendParams.populateAppCallResources ? groupResponse.unnamedResourcesAccessed : undefined,
        txns: groupResponse.txnResults.map((txn, i) => {
            const originalTxn = atc['transactions'][i].txn;
            let requiredFeeDelta = 0n;
            if (sendParams.coverAppCallInnerTransactionFees) {
                const parentPerByteFee = perByteTxnFee * BigInt(originalTxn.toByte().length + 75);
                const parentMinFee = parentPerByteFee < minTxnFee ? minTxnFee : parentPerByteFee;
                const parentFeeDelta = parentMinFee - originalTxn.fee;
                if (originalTxn.type === algosdk_1.default.TransactionType.appl) {
                    const calculateInnerFeeDelta = (itxns, acc = 0n) => {
                        return (itxns ?? []).reverse().reduce((accum, itxn) => {
                            const currentFeeDelta = (itxn.innerTxns && itxn.innerTxns.length > 0 ? calculateInnerFeeDelta(itxn.innerTxns, acc) : acc) +
                                (minTxnFee - itxn.txn.txn.fee);
                            return currentFeeDelta < 0n ? 0n : currentFeeDelta;
                        }, acc);
                    };
                    const innerFeeDelta = calculateInnerFeeDelta(txn.txnResult.innerTxns ?? []);
                    requiredFeeDelta = innerFeeDelta + parentFeeDelta;
                }
                else {
                    requiredFeeDelta = parentFeeDelta;
                }
            }
            return {
                unnamedResourcesAccessed: sendParams.populateAppCallResources ? txn.unnamedResourcesAccessed : undefined,
                requiredFeeDelta,
            };
        }),
    };
}
/**
 * Combined prepare + cost calculation using a single simulate.
 * This replaces the need for prepareGroupForSending + SimulateBuilder separately.
 */
async function prepareGroupWithCost(atc, algod, sendParams = {}, additionalAtcContext = {}, simulateAccount, simulateOptions) {
    const executionInfo = await getGroupExecutionInfo(atc, algod, sendParams, additionalAtcContext);
    const group = atc.buildGroup();
    // Calculate additional fees needed for inner transactions
    const [_, additionalTransactionFees] = sendParams.coverAppCallInnerTransactionFees
        ? executionInfo.txns
            .map((txn, i) => {
            const groupIndex = i;
            const txnInGroup = group[groupIndex].txn;
            const maxFee = additionalAtcContext?.maxFees?.get(i)?.microAlgo;
            const immutableFee = maxFee !== undefined && maxFee === txnInGroup.fee;
            const priorityMultiplier = txn.requiredFeeDelta > 0n && (immutableFee || txnInGroup.type !== algosdk_1.default.TransactionType.appl) ? 1000n : 1n;
            return {
                ...txn,
                groupIndex,
                surplusFeePriorityLevel: txn.requiredFeeDelta > 0n ? txn.requiredFeeDelta * priorityMultiplier : -1n,
            };
        })
            .sort((a, b) => {
            return a.surplusFeePriorityLevel > b.surplusFeePriorityLevel ? -1 : a.surplusFeePriorityLevel < b.surplusFeePriorityLevel ? 1 : 0;
        })
            .reduce((acc, { groupIndex, requiredFeeDelta }) => {
            if (requiredFeeDelta > 0n) {
                let surplusGroupFees = acc[0];
                const additionalFees = acc[1];
                const additionalFeeDelta = requiredFeeDelta - surplusGroupFees;
                if (additionalFeeDelta <= 0n) {
                    surplusGroupFees = -additionalFeeDelta;
                }
                else {
                    additionalFees.set(groupIndex, additionalFeeDelta);
                    surplusGroupFees = 0n;
                }
                return [surplusGroupFees, additionalFees];
            }
            return acc;
        }, [
            executionInfo.txns.reduce((acc, { requiredFeeDelta }) => {
                if (requiredFeeDelta < 0n)
                    return acc + -requiredFeeDelta;
                return acc;
            }, 0n),
            new Map(),
        ])
        : [0n, new Map()];
    // Populate resources and adjust fees
    executionInfo.txns.forEach(({ unnamedResourcesAccessed: r }, i) => {
        if (sendParams.populateAppCallResources && r !== undefined && group[i].txn.type === algosdk_1.default.TransactionType.appl) {
            if (r.boxes || r.extraBoxRefs)
                throw Error('Unexpected boxes at the transaction level');
            if (r.appLocals)
                throw Error('Unexpected app local at the transaction level');
            if (r.assetHoldings)
                throw Error('Unexpected asset holding at the transaction level');
            const tx = group[i].txn;
            tx.applicationCall = {
                ...tx.applicationCall,
                accounts: [...(tx?.applicationCall?.accounts ?? []), ...(r.accounts ?? [])],
                foreignApps: [...(tx?.applicationCall?.foreignApps ?? []), ...(r.apps ?? [])],
                foreignAssets: [...(tx?.applicationCall?.foreignAssets ?? []), ...(r.assets ?? [])],
                boxes: [...(tx?.applicationCall?.boxes ?? []), ...(r.boxes ?? [])],
            };
        }
        if (sendParams.coverAppCallInnerTransactionFees) {
            const additionalTransactionFee = additionalTransactionFees.get(i);
            if (additionalTransactionFee !== undefined) {
                if (group[i].txn.type !== algosdk_1.default.TransactionType.appl) {
                    throw Error(`An additional fee of ${additionalTransactionFee} µALGO is required for non app call transaction ${i}`);
                }
                const transactionFee = group[i].txn.fee + additionalTransactionFee;
                const maxFee = additionalAtcContext?.maxFees?.get(i)?.microAlgo;
                if (maxFee === undefined || transactionFee > maxFee) {
                    throw Error(`Calculated transaction fee ${transactionFee} µALGO is greater than max of ${maxFee ?? 'undefined'} for transaction ${i}`);
                }
                group[i].txn.fee = transactionFee;
            }
        }
    });
    // Populate group-level resources
    if (sendParams.populateAppCallResources) {
        const populateGroupResource = (txns, reference, type) => {
            const isApplBelowLimit = (t) => {
                if (t.txn.type !== algosdk_1.default.TransactionType.appl)
                    return false;
                const tx = t.txn;
                const accounts = tx.applicationCall?.accounts?.length ?? 0;
                const assets = tx.applicationCall?.foreignAssets?.length ?? 0;
                const apps = tx.applicationCall?.foreignApps?.length ?? 0;
                const boxes = tx.applicationCall?.boxes?.length ?? 0;
                return accounts + assets + apps + boxes < 8;
            };
            const txnIndex = txns.findIndex((t) => isApplBelowLimit(t));
            if (txnIndex >= 0) {
                const tx = txns[txnIndex].txn;
                if (type === 'account') {
                    tx.applicationCall = { ...tx.applicationCall, accounts: [...(tx?.applicationCall?.accounts ?? []), reference] };
                }
                else if (type === 'asset') {
                    tx.applicationCall = { ...tx.applicationCall, foreignAssets: [...(tx?.applicationCall?.foreignAssets ?? []), reference] };
                }
                else if (type === 'app') {
                    tx.applicationCall = { ...tx.applicationCall, foreignApps: [...(tx?.applicationCall?.foreignApps ?? []), reference] };
                }
                else if (type === 'box') {
                    // Convert modelsv2.BoxReference format (app, name) to transaction format (appIndex, name)
                    const boxRef = { appIndex: BigInt(reference.app ?? 0), name: reference.name };
                    tx.applicationCall = { ...tx.applicationCall, boxes: [...(tx?.applicationCall?.boxes ?? []), boxRef] };
                }
            }
        };
        executionInfo.groupUnnamedResourcesAccessed?.accounts?.forEach((a) => populateGroupResource(group, a, 'account'));
        executionInfo.groupUnnamedResourcesAccessed?.assets?.forEach((a) => populateGroupResource(group, a, 'asset'));
        executionInfo.groupUnnamedResourcesAccessed?.apps?.forEach((a) => populateGroupResource(group, a, 'app'));
        executionInfo.groupUnnamedResourcesAccessed?.boxes?.forEach((b) => populateGroupResource(group, b, 'box'));
    }
    // Calculate expected cost from the already-built group (before adding to new ATC)
    // This avoids re-validation issues when buildGroup() is called again
    const expectedCost = calculateExpectedCostFromGroup(group, simulateOptions);
    if (simulateAccount) {
        expectedCost.accountDeltas = (0, deltas_1.extractAccountDeltas)(executionInfo.simulateResponse, simulateAccount);
    }
    // Build new ATC with modified transactions
    const newAtc = new algosdk_1.default.AtomicTransactionComposer();
    group.forEach((t) => {
        t.txn.group = undefined;
        // Clean up any malformed box references that might have undefined appIndex
        if (t.txn.type === algosdk_1.default.TransactionType.appl) {
            const tx = t.txn;
            if (tx.applicationCall?.boxes) {
                tx.applicationCall.boxes = tx.applicationCall.boxes
                    .filter((b) => b !== undefined && b !== null)
                    .map((b) => ({
                    appIndex: BigInt(b.appIndex ?? b.app ?? 0),
                    name: b.name
                }));
            }
        }
        newAtc.addTransaction(t);
    });
    newAtc['methodCalls'] = atc['methodCalls'];
    return { atc: newAtc, expectedCost };
}
/**
 * Calculate expected cost directly from a transaction group without calling buildGroup()
 */
function calculateExpectedCostFromGroup(group, simulateOptions) {
    const hints = new Map();
    for (const hint of simulateOptions?.payments ?? []) {
        hints.set(hint.asset, hint);
    }
    const payments = [];
    const ZERO = 0n;
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
            const hint = hints.get(0n);
            if (hint) {
                payments.push({
                    ...base,
                    amount: hint.amount ?? base.amount,
                    mbr: hint.mbr ?? base.mbr,
                    fee: hint.fee ?? base.fee,
                    total: (hint.amount ?? base.amount) + (hint.mbr ?? base.mbr) + (hint.fee ?? base.fee),
                });
            }
            else {
                payments.push(base);
            }
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
            const hint = hints.get(assetId);
            if (hint) {
                payments.push({
                    ...base,
                    amount: hint.amount ?? base.amount,
                    mbr: hint.mbr ?? base.mbr,
                    fee: hint.fee ?? base.fee,
                    total: (hint.amount ?? base.amount) + (hint.mbr ?? base.mbr) + (hint.fee ?? base.fee),
                });
            }
            else {
                payments.push(base);
            }
        }
    }
    const networkFees = simulateOptions?.networkFeeOverride ??
        group.reduce((acc, { txn }) => acc + BigInt(txn?.fee ?? 0), ZERO);
    // Aggregate payments by asset
    const subtotals = new Map();
    for (const p of payments) {
        subtotals.set(p.asset, (subtotals.get(p.asset) ?? ZERO) + p.total);
    }
    const totalAlgo = (subtotals.get(0n) ?? ZERO) + networkFees;
    return {
        payments,
        networkFees,
        subtotals: Array.from(subtotals.entries()).map(([asset, amount]) => ({ asset, amount })),
        totalAlgo,
    };
}
//# sourceMappingURL=prepare.js.map