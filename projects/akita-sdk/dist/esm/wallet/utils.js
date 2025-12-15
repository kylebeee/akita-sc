import algosdk, { decodeAddress } from "algosdk";
import { encodeLease } from "@algorandfoundation/algokit-utils";
// import { AppCallParams, AppUpdateParams, Txn } from "@algorandfoundation/algokit-utils/types/composer";
// AppCallParams | AppCreateParams | AppUpdateParams
// export function isAppCall(params: Txn): params is AppCallParams {
//   return params.type === 'appCall' && 'appId' in params;
// }
export function SpendAllowanceTypeFromString(type) {
    switch (type) {
        case 'flat': {
            return 1n;
        }
        case 'window': {
            return 2n;
        }
        case 'drip': {
            return 3n;
        }
        default: {
            throw new Error(`Invalid allowance type: ${type}`);
        }
    }
}
export function AllowancesToTuple(allowances) {
    return allowances.map(({ asset, type, useRounds = false, ...rest }) => {
        const max = 'max' in rest ? rest.max : 0n;
        const interval = 'interval' in rest ? rest.interval : 0n;
        const amount = 'amount' in rest ? rest.amount : 'rate' in rest ? rest.rate : 0n;
        return [asset, SpendAllowanceTypeFromString(type), amount, max, interval, useRounds];
    });
}
export function AllowanceInfoTranslate(info) {
    const commonFields = {
        last: info.last,
        start: info.start,
        useRounds: info.useRounds
    };
    switch (info.type) {
        case 1:
            return {
                type: 'flat',
                amount: info.amount,
                spent: info.spent,
                ...commonFields
            };
        case 2:
            return {
                type: 'window',
                amount: info.amount,
                spent: info.spent,
                interval: info.interval,
                ...commonFields
            };
        case 3:
            return {
                type: 'drip',
                lastLeftover: info.spent,
                max: info.max,
                rate: info.amount,
                interval: info.interval,
                ...commonFields
            };
        default:
            throw new Error(`Unknown allowance type ${info.type}`);
    }
}
export function executionBoxKey(lease) {
    const prefix = new Uint8Array(Buffer.from('x'));
    const encodedLease = encodeLease(lease);
    const result = new Uint8Array(prefix.length + encodedLease.length);
    result.set(prefix, 0);
    result.set(encodedLease, prefix.length);
    return result;
}
export function domainBoxKey(address) {
    return new Uint8Array(Buffer.concat([
        Buffer.from('d'),
        typeof address === 'string' ? decodeAddress(address).publicKey : address.publicKey
    ]));
}
export function forceProperties(atc, options) {
    const group = atc.clone().buildGroup();
    const newAtc = new algosdk.AtomicTransactionComposer();
    const overWriteProperties = (txn, index, options) => {
        txn.txn['group'] = undefined;
        txn.txn['lease'] = (options.lease !== undefined && index === 0)
            ? (typeof options.lease === 'string'
                ? encodeLease(options.lease)
                : options.lease)
            : txn.txn['lease'];
        txn['signer'] = options.signer !== undefined
            ? options.signer
            : txn['signer'];
        txn.txn['sender'] = options.sender !== undefined
            ? (typeof options.sender === 'string'
                ? decodeAddress(options.sender)
                : options.sender)
            : txn.txn['sender'];
        txn.txn['firstValid'] = options.firstValid !== undefined
            ? options.firstValid
            : txn.txn['firstValid'];
        txn.txn['lastValid'] = options.lastValid !== undefined
            ? options.lastValid
            : txn.txn['lastValid'];
        txn.txn['fee'] = options.fees !== undefined && options.fees.has(index) && options.fees.get(index)?.microAlgo !== undefined
            ? options.fees.get(index)?.microAlgo
            : txn.txn['fee'];
    };
    group.forEach((t, i) => {
        overWriteProperties(t, i, options);
        newAtc.addTransaction(t);
    });
    // Preserve method calls
    newAtc['methodCalls'] = atc['methodCalls'];
    return newAtc;
}
export class ValueMap {
    constructor(keyGenerator, iterable) {
        this.map = new Map();
        this.keyGenerator = keyGenerator;
        if (iterable) {
            for (const [key, value] of iterable) {
                this.set(key, value);
            }
        }
    }
    generateKey(key) {
        if (typeof key === 'string') {
            return key;
        }
        // If it's a partial key, we need to call the key generator which should handle defaults
        return this.keyGenerator(key);
    }
    set(key, value) {
        const stringKey = this.generateKey(key);
        this.map.set(stringKey, value);
        return this;
    }
    get(key) {
        const stringKey = this.generateKey(key);
        return this.map.get(stringKey);
    }
    has(key) {
        const stringKey = this.generateKey(key);
        return this.map.has(stringKey);
    }
    delete(key) {
        const stringKey = this.generateKey(key);
        return this.map.delete(stringKey);
    }
    clear() {
        this.map.clear();
    }
    get size() {
        return this.map.size;
    }
    keys() {
        return this.map.keys();
    }
    values() {
        return this.map.values();
    }
    entries() {
        return this.map.entries();
    }
    forEach(callbackfn) {
        this.map.forEach(callbackfn);
    }
    [Symbol.iterator]() {
        return this.map[Symbol.iterator]();
    }
}
export const getTxns = async ({}) => { return [{}]; };
//# sourceMappingURL=utils.js.map