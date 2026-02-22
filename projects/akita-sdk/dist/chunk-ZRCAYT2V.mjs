// src/wallet/utils.ts
import algosdk, { decodeAddress } from "algosdk";
import { encodeLease } from "@algorandfoundation/algokit-utils";
function SpendAllowanceTypeFromString(type) {
  switch (type) {
    case "flat": {
      return 1n;
    }
    case "window": {
      return 2n;
    }
    case "drip": {
      return 3n;
    }
    default: {
      throw new Error(`Invalid allowance type: ${type}`);
    }
  }
}
function AllowancesToTuple(allowances) {
  return allowances.map(({ asset, type, useRounds = false, ...rest }) => {
    const max = "max" in rest ? rest.max : 0n;
    const interval = "interval" in rest ? rest.interval : 0n;
    const amount = "amount" in rest ? rest.amount : "rate" in rest ? rest.rate : 0n;
    return [asset, SpendAllowanceTypeFromString(type), amount, max, interval, useRounds];
  });
}
function AllowanceInfoTranslate(info) {
  const commonFields = {
    last: info.last,
    start: info.start,
    useRounds: info.useRounds
  };
  switch (info.type) {
    case 1:
      return {
        type: "flat",
        amount: info.amount,
        spent: info.spent,
        ...commonFields
      };
    case 2:
      return {
        type: "window",
        amount: info.amount,
        spent: info.spent,
        interval: info.interval,
        ...commonFields
      };
    case 3:
      return {
        type: "drip",
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
function executionBoxKey(lease) {
  const prefix = new Uint8Array(Buffer.from("x"));
  const encodedLease = encodeLease(lease);
  const result = new Uint8Array(prefix.length + encodedLease.length);
  result.set(prefix, 0);
  result.set(encodedLease, prefix.length);
  return result;
}
function domainBoxKey(address) {
  return new Uint8Array(
    Buffer.concat([
      Buffer.from("d"),
      typeof address === "string" ? decodeAddress(address).publicKey : address.publicKey
    ])
  );
}
function forceProperties(atc, options) {
  const group = atc.clone().buildGroup();
  const newAtc = new algosdk.AtomicTransactionComposer();
  const overWriteProperties = (txn, index, options2) => {
    var _a, _b;
    txn.txn["group"] = void 0;
    txn.txn["lease"] = options2.lease !== void 0 && index === 0 ? typeof options2.lease === "string" ? encodeLease(options2.lease) : options2.lease : txn.txn["lease"];
    txn["signer"] = options2.signer !== void 0 ? options2.signer : txn["signer"];
    txn.txn["sender"] = options2.sender !== void 0 ? typeof options2.sender === "string" ? decodeAddress(options2.sender) : options2.sender : txn.txn["sender"];
    txn.txn["firstValid"] = options2.firstValid !== void 0 ? options2.firstValid : txn.txn["firstValid"];
    txn.txn["lastValid"] = options2.lastValid !== void 0 ? options2.lastValid : txn.txn["lastValid"];
    txn.txn["fee"] = options2.fees !== void 0 && options2.fees.has(index) && ((_a = options2.fees.get(index)) == null ? void 0 : _a.microAlgo) !== void 0 ? (_b = options2.fees.get(index)) == null ? void 0 : _b.microAlgo : txn.txn["fee"];
  };
  group.forEach((t, i) => {
    overWriteProperties(t, i, options);
    newAtc.addTransaction(t);
  });
  newAtc["methodCalls"] = atc["methodCalls"];
  return newAtc;
}
var ValueMap = class {
  map = /* @__PURE__ */ new Map();
  keyGenerator;
  constructor(keyGenerator, iterable) {
    this.keyGenerator = keyGenerator;
    if (iterable) {
      for (const [key, value] of iterable) {
        this.set(key, value);
      }
    }
  }
  generateKey(key) {
    if (typeof key === "string") {
      return key;
    }
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
};
var getTxns = async ({}) => {
  return [{}];
};

export {
  AllowancesToTuple,
  AllowanceInfoTranslate,
  executionBoxKey,
  domainBoxKey,
  forceProperties,
  ValueMap,
  getTxns
};
//# sourceMappingURL=chunk-ZRCAYT2V.mjs.map