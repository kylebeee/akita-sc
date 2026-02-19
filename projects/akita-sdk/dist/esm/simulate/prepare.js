"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareGroupWithCost = prepareGroupWithCost;
const algosdk_1 = __importDefault(require("algosdk"));
const deltas_1 = require("./deltas");
const MAX_APP_CALL_FOREIGN_REFERENCES = 8;
const MAX_APP_CALL_ACCOUNT_REFERENCES = 4;
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
    const groupResponse = result.simulateResponse.txnGroups[0];
    if (groupResponse.failureMessage) {
        if (sendParams.coverAppCallInnerTransactionFees && groupResponse.failureMessage.match(/fee too small/)) {
            throw Error(`Fees were too small to resolve execution info via simulate. You may need to increase an app call transaction maxFee.`);
        }
        throw Error(`Error resolving execution info via simulate in transaction ${groupResponse.failedAt}: ${groupResponse.failureMessage}`);
    }
    return {
        simulateResponse: result.simulateResponse,
        groupUnnamedResourcesAccessed: sendParams.populateAppCallResources ? groupResponse.unnamedResourcesAccessed : undefined,
        txns: groupResponse.txnResults.map((txn, i) => {
            const originalTxn = atc['transactions'][i].txn;
            let requiredFeeDelta = 0n;
            if (sendParams.coverAppCallInnerTransactionFees) {
                // Min fee calc is lifted from algosdk https://github.com/algorand/js-algorand-sdk/blob/6973ff583b243ddb0632e91f4c0383021430a789/src/transaction.ts#L710
                // 75 is the number of bytes added to a txn after signing it
                const parentPerByteFee = perByteTxnFee * BigInt(originalTxn.toByte().length + 75);
                const parentMinFee = parentPerByteFee < minTxnFee ? minTxnFee : parentPerByteFee;
                const parentFeeDelta = parentMinFee - originalTxn.fee;
                if (originalTxn.type === algosdk_1.default.TransactionType.appl) {
                    const calculateInnerFeeDelta = (itxns, acc = 0n) => {
                        // Surplus inner transaction fees do not pool up to the parent transaction.
                        // Additionally surplus inner transaction fees only pool from sibling transactions that are sent prior to a given inner transaction, hence why we iterate in reverse order.
                        return itxns.reverse().reduce((acc, itxn) => {
                            const currentFeeDelta = (itxn.innerTxns && itxn.innerTxns.length > 0 ? calculateInnerFeeDelta(itxn.innerTxns, acc) : acc) +
                                (minTxnFee - itxn.txn.txn.fee); // Inner transactions don't require per byte fees
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
                const additionalTransactionFees = acc[1];
                const additionalFeeDelta = requiredFeeDelta - surplusGroupFees;
                if (additionalFeeDelta <= 0n) {
                    surplusGroupFees = -additionalFeeDelta;
                }
                else {
                    additionalTransactionFees.set(groupIndex, additionalFeeDelta);
                    surplusGroupFees = 0n;
                }
                return [surplusGroupFees, additionalTransactionFees];
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
    executionInfo.txns.forEach(({ unnamedResourcesAccessed: r }, i) => {
        // Populate Transaction App Call Resources
        if (sendParams.populateAppCallResources && r !== undefined && group[i].txn.type === algosdk_1.default.TransactionType.appl) {
            if (r.boxes || r.extraBoxRefs)
                throw Error('Unexpected boxes at the transaction level');
            if (r.appLocals)
                throw Error('Unexpected app local at the transaction level');
            if (r.assetHoldings)
                throw Error('Unexpected asset holding at the transaction level');
            group[i].txn['applicationCall'] = {
                ...group[i].txn.applicationCall,
                accounts: [...(group[i].txn?.applicationCall?.accounts ?? []), ...(r.accounts ?? [])],
                foreignApps: [...(group[i].txn?.applicationCall?.foreignApps ?? []), ...(r.apps ?? [])],
                foreignAssets: [...(group[i].txn?.applicationCall?.foreignAssets ?? []), ...(r.assets ?? [])],
                boxes: [...(group[i].txn?.applicationCall?.boxes ?? []), ...(r.boxes ?? [])],
            };
            const accounts = group[i].txn.applicationCall?.accounts?.length ?? 0;
            if (accounts > MAX_APP_CALL_ACCOUNT_REFERENCES)
                throw Error(`Account reference limit of ${MAX_APP_CALL_ACCOUNT_REFERENCES} exceeded in transaction ${i}`);
            const assets = group[i].txn.applicationCall?.foreignAssets?.length ?? 0;
            const apps = group[i].txn.applicationCall?.foreignApps?.length ?? 0;
            const boxes = group[i].txn.applicationCall?.boxes?.length ?? 0;
            if (accounts + assets + apps + boxes > MAX_APP_CALL_FOREIGN_REFERENCES) {
                throw Error(`Resource reference limit of ${MAX_APP_CALL_FOREIGN_REFERENCES} exceeded in transaction ${i}`);
            }
        }
        // Cover App Call Inner Transaction Fees
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
    // Populate Group App Call Resources
    if (sendParams.populateAppCallResources) {
        const populateGroupResource = (txns, reference, type) => {
            const isApplBelowLimit = (t) => {
                if (t.txn.type !== algosdk_1.default.TransactionType.appl)
                    return false;
                const accounts = t.txn.applicationCall?.accounts?.length ?? 0;
                const assets = t.txn.applicationCall?.foreignAssets?.length ?? 0;
                const apps = t.txn.applicationCall?.foreignApps?.length ?? 0;
                const boxes = t.txn.applicationCall?.boxes?.length ?? 0;
                return accounts + assets + apps + boxes < MAX_APP_CALL_FOREIGN_REFERENCES;
            };
            // If this is an asset holding or app local, first try to find a transaction that already has the account available
            if (type === 'assetHolding' || type === 'appLocal') {
                const { account } = reference;
                let txnIndex = txns.findIndex((t) => {
                    if (!isApplBelowLimit(t))
                        return false;
                    return (
                    // account is in the foreign accounts array
                    t.txn.applicationCall?.accounts?.map((a) => a.toString()).includes(account.toString()) ||
                        // account is available as an app account
                        t.txn.applicationCall?.foreignApps?.map((a) => algosdk_1.default.getApplicationAddress(a).toString()).includes(account.toString()) ||
                        // account is available since it's in one of the fields
                        Object.values(t.txn).some((f) => algosdk_1.default.stringifyJSON(f, (_, v) => (v instanceof algosdk_1.default.Address ? v.toString() : v))?.includes(account.toString())));
                });
                if (txnIndex > -1) {
                    if (type === 'assetHolding') {
                        const { asset } = reference;
                        txns[txnIndex].txn['applicationCall'] = {
                            ...txns[txnIndex].txn.applicationCall,
                            foreignAssets: [...(txns[txnIndex].txn?.applicationCall?.foreignAssets ?? []), ...[asset]],
                        };
                    }
                    else {
                        const { app } = reference;
                        txns[txnIndex].txn['applicationCall'] = {
                            ...txns[txnIndex].txn.applicationCall,
                            foreignApps: [...(txns[txnIndex].txn?.applicationCall?.foreignApps ?? []), ...[app]],
                        };
                    }
                    return;
                }
                // Now try to find a txn that already has that app or asset available
                txnIndex = txns.findIndex((t) => {
                    if (!isApplBelowLimit(t))
                        return false;
                    // check if there is space in the accounts array
                    if ((t.txn.applicationCall?.accounts?.length ?? 0) >= MAX_APP_CALL_ACCOUNT_REFERENCES)
                        return false;
                    if (type === 'assetHolding') {
                        const { asset } = reference;
                        return t.txn.applicationCall?.foreignAssets?.includes(asset);
                    }
                    else {
                        const { app } = reference;
                        return t.txn.applicationCall?.foreignApps?.includes(app) || t.txn.applicationCall?.appIndex === app;
                    }
                });
                if (txnIndex > -1) {
                    const { account } = reference;
                    txns[txnIndex].txn['applicationCall'] = {
                        ...txns[txnIndex].txn.applicationCall,
                        accounts: [...(txns[txnIndex].txn?.applicationCall?.accounts ?? []), ...[account]],
                    };
                    return;
                }
            }
            // If this is a box, first try to find a transaction that already has the app available
            if (type === 'box') {
                const { app, name } = reference;
                const txnIndex = txns.findIndex((t) => {
                    if (!isApplBelowLimit(t))
                        return false;
                    // If the app is in the foreign array OR the app being called, then we know it's available
                    return t.txn.applicationCall?.foreignApps?.includes(app) || t.txn.applicationCall?.appIndex === app;
                });
                if (txnIndex > -1) {
                    txns[txnIndex].txn['applicationCall'] = {
                        ...txns[txnIndex].txn.applicationCall,
                        boxes: [...(txns[txnIndex].txn?.applicationCall?.boxes ?? []), ...[{ appIndex: app, name }]],
                    };
                    return;
                }
            }
            // Find the txn index to put the reference(s)
            const txnIndex = txns.findIndex((t) => {
                if (t.txn.type !== algosdk_1.default.TransactionType.appl)
                    return false;
                const accounts = t.txn.applicationCall?.accounts?.length ?? 0;
                if (type === 'account')
                    return accounts < MAX_APP_CALL_ACCOUNT_REFERENCES;
                const assets = t.txn.applicationCall?.foreignAssets?.length ?? 0;
                const apps = t.txn.applicationCall?.foreignApps?.length ?? 0;
                const boxes = t.txn.applicationCall?.boxes?.length ?? 0;
                // If we're adding local state or asset holding, we need space for the account and the other reference
                if (type === 'assetHolding' || type === 'appLocal') {
                    return accounts + assets + apps + boxes < MAX_APP_CALL_FOREIGN_REFERENCES - 1 && accounts < MAX_APP_CALL_ACCOUNT_REFERENCES;
                }
                // If we're adding a box, we need space for both the box ref and the app ref
                if (type === 'box' && BigInt(reference.app) !== 0n) {
                    return accounts + assets + apps + boxes < MAX_APP_CALL_FOREIGN_REFERENCES - 1;
                }
                return accounts + assets + apps + boxes < MAX_APP_CALL_FOREIGN_REFERENCES;
            });
            if (txnIndex === -1) {
                throw Error('No more transactions below reference limit. Add another app call to the group.');
            }
            if (type === 'account') {
                txns[txnIndex].txn['applicationCall'] = {
                    ...txns[txnIndex].txn.applicationCall,
                    accounts: [...(txns[txnIndex].txn?.applicationCall?.accounts ?? []), ...[reference]],
                };
            }
            else if (type === 'app') {
                txns[txnIndex].txn['applicationCall'] = {
                    ...txns[txnIndex].txn.applicationCall,
                    foreignApps: [
                        ...(txns[txnIndex].txn?.applicationCall?.foreignApps ?? []),
                        ...[typeof reference === 'bigint' ? reference : BigInt(reference)],
                    ],
                };
            }
            else if (type === 'box') {
                const { app, name } = reference;
                txns[txnIndex].txn['applicationCall'] = {
                    ...txns[txnIndex].txn.applicationCall,
                    boxes: [...(txns[txnIndex].txn?.applicationCall?.boxes ?? []), ...[{ appIndex: app, name }]],
                };
                if (app.toString() !== '0') {
                    txns[txnIndex].txn['applicationCall'] = {
                        ...txns[txnIndex].txn.applicationCall,
                        foreignApps: [...(txns[txnIndex].txn?.applicationCall?.foreignApps ?? []), ...[app]],
                    };
                }
            }
            else if (type === 'assetHolding') {
                const { asset, account } = reference;
                txns[txnIndex].txn['applicationCall'] = {
                    ...txns[txnIndex].txn.applicationCall,
                    foreignAssets: [...(txns[txnIndex].txn?.applicationCall?.foreignAssets ?? []), ...[asset]],
                    accounts: [...(txns[txnIndex].txn?.applicationCall?.accounts ?? []), ...[account]],
                };
            }
            else if (type === 'appLocal') {
                const { app, account } = reference;
                txns[txnIndex].txn['applicationCall'] = {
                    ...txns[txnIndex].txn.applicationCall,
                    foreignApps: [...(txns[txnIndex].txn?.applicationCall?.foreignApps ?? []), ...[app]],
                    accounts: [...(txns[txnIndex].txn?.applicationCall?.accounts ?? []), ...[account]],
                };
            }
            else if (type === 'asset') {
                txns[txnIndex].txn['applicationCall'] = {
                    ...txns[txnIndex].txn.applicationCall,
                    foreignAssets: [
                        ...(txns[txnIndex].txn?.applicationCall?.foreignAssets ?? []),
                        ...[typeof reference === 'bigint' ? reference : BigInt(reference)],
                    ],
                };
            }
        };
        const g = executionInfo.groupUnnamedResourcesAccessed;
        if (g) {
            // Do cross-reference resources first because they are the most restrictive in terms
            // of which transactions can be used
            g.appLocals?.forEach((a) => {
                populateGroupResource(group, a, 'appLocal');
                // Remove resources from the group if we're adding them here
                g.accounts = g.accounts?.filter((acc) => acc !== a.account);
                g.apps = g.apps?.filter((app) => BigInt(app) !== BigInt(a.app));
            });
            g.assetHoldings?.forEach((a) => {
                populateGroupResource(group, a, 'assetHolding');
                // Remove resources from the group if we're adding them here
                g.accounts = g.accounts?.filter((acc) => acc !== a.account);
                g.assets = g.assets?.filter((asset) => BigInt(asset) !== BigInt(a.asset));
            });
            // Do accounts next because the account limit is 4
            g.accounts?.forEach((a) => {
                populateGroupResource(group, a, 'account');
            });
            g.boxes?.forEach((b) => {
                populateGroupResource(group, b, 'box');
                // Remove apps as resource from the group if we're adding it here
                g.apps = g.apps?.filter((app) => BigInt(app) !== BigInt(b.app));
            });
            g.assets?.forEach((a) => {
                populateGroupResource(group, a, 'asset');
            });
            g.apps?.forEach((a) => {
                populateGroupResource(group, a, 'app');
            });
            if (g.extraBoxRefs) {
                for (let i = 0; i < g.extraBoxRefs; i += 1) {
                    const ref = new algosdk_1.default.modelsv2.BoxReference({ app: 0, name: new Uint8Array(0) });
                    populateGroupResource(group, ref, 'box');
                }
            }
        }
    }
    // Calculate expected cost from simulation response (includes inner transactions)
    const expectedCost = calculateExpectedCostFromSimulation(executionInfo.simulateResponse, group, simulateOptions);
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
 * Calculate expected cost from a simulation response.
 * This walks through ALL transactions including inner transactions created by smart contracts.
 *
 * The SDK returns simulation results with typed Transaction objects:
 * - Payment: transaction.payment.amount, transaction.payment.receiver
 * - Asset Transfer: transaction.assetTransfer.amount, transaction.assetTransfer.assetIndex
 *
 * @param simulateResponse - The raw simulation response from algod
 * @param group - The outer transaction group (used for network fee calculation)
 * @param simulateOptions - Optional hints for payment amounts
 */
function calculateExpectedCostFromSimulation(simulateResponse, group, simulateOptions) {
    const hints = new Map();
    for (const hint of simulateOptions?.payments ?? []) {
        hints.set(hint.asset, hint);
    }
    const payments = [];
    const ZERO = 0n;
    /**
     * Process a single transaction and extract payment info.
     * Uses SDK typed properties (payment.amount, assetTransfer.amount, etc.)
     * Also handles close-out amounts from the apply data.
     *
     * @param unsignedTxn - The unsigned transaction
     * @param applyData - The apply data from simulation (contains closingAmount, assetClosingAmount)
     */
    const processTxn = (unsignedTxn, applyData) => {
        if (!unsignedTxn)
            return;
        const type = unsignedTxn.type;
        if (type === "pay") {
            // Payment transaction - SDK typed properties
            const payment = unsignedTxn.payment;
            let amount = BigInt(payment?.amount ?? 0);
            // For close-outs, add the closing amount from apply data
            // closingAmount is the remaining balance sent to closeRemainderTo
            if (payment?.closeRemainderTo && applyData) {
                const closingAmount = BigInt(applyData.closingAmount ?? 0);
                amount += closingAmount;
            }
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
            // Asset transfer - SDK typed properties
            const assetTransfer = unsignedTxn.assetTransfer;
            const assetId = BigInt(assetTransfer?.assetIndex ?? 0);
            let amount = BigInt(assetTransfer?.amount ?? 0);
            // For asset close-outs, add the closing amount from apply data
            // assetClosingAmount is the remaining balance sent to closeRemainderTo
            if (assetTransfer?.closeRemainderTo && applyData) {
                const assetClosingAmount = BigInt(applyData.assetClosingAmount ?? 0);
                amount += assetClosingAmount;
            }
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
    };
    /**
     * Recursively walk inner transactions.
     * Each inner transaction has: { txn: { txn: unsignedTxn }, innerTxns: [...] }
     * The apply data (closingAmount, assetClosingAmount) is in the inner txn result itself.
     */
    const walkInner = (inner) => {
        for (const itxn of inner ?? []) {
            // Inner transaction structure: itxn.txn.txn is the unsigned transaction
            const signedTxn = itxn.txn;
            const unsignedTxn = signedTxn?.txn;
            // For inner transactions, closingAmount and assetClosingAmount are directly on itxn
            processTxn(unsignedTxn, itxn);
            // Recurse into nested inner transactions
            walkInner(itxn.innerTxns);
        }
    };
    // Walk through the simulation response
    const response = simulateResponse;
    const txnGroups = response?.txnGroups ?? [];
    for (const grp of txnGroups) {
        const results = grp?.txnResults ?? [];
        for (const res of results) {
            // Process outer transaction (signed.txn.txn is the unsigned transaction)
            const outerSignedTxn = res?.txn;
            const outerUnsignedTxn = outerSignedTxn?.txn;
            // Outer transaction apply data
            const txnResult = res?.txnResult;
            const outerApplyData = txnResult; // txnResult contains apply data fields
            processTxn(outerUnsignedTxn, outerApplyData);
            // Process all inner transactions recursively
            const innerTxns = txnResult?.innerTxns;
            walkInner(innerTxns);
        }
    }
    // Calculate network fees from the outer transaction group
    // Inner transaction fees are pooled from the outer transaction's fee
    // Note: Network fees are paid by the transaction sender, not the wallet
    const networkFees = simulateOptions?.networkFeeOverride ??
        group.reduce((acc, { txn }) => acc + BigInt(txn?.fee ?? 0), ZERO);
    // Aggregate payments by asset
    const subtotals = new Map();
    for (const p of payments) {
        subtotals.set(p.asset, (subtotals.get(p.asset) ?? ZERO) + p.total);
    }
    // totalAlgo represents the ALGO leaving the wallet (payments only)
    // Network fees are paid by the outer transaction sender, not the wallet
    const totalAlgo = subtotals.get(0n) ?? ZERO;
    return {
        payments,
        networkFees,
        subtotals: Array.from(subtotals.entries()).map(([asset, amount]) => ({ asset, amount })),
        totalAlgo,
    };
}
//# sourceMappingURL=prepare.js.map