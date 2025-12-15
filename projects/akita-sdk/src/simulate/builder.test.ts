import { describe, expect, test } from "vitest";
import algosdk from "algosdk";
import { SimulateBuilder } from "./builder";
import { extractAccountDeltas } from "./deltas";

const dummySender = "SENDER";
const otherAddr = "OTHER";

describe("SimulateBuilder expectedCost", () => {
  test("aggregates payments and network fees", () => {
    const atc = {
      buildGroup: () => ([
        { txn: { type: "pay", amount: 1000n, fee: 1_000n } },
        { txn: { type: "axfer", assetIndex: 123n, assetAmount: 500n, fee: 200n } },
      ])
    } as unknown as algosdk.AtomicTransactionComposer;

    const result = new SimulateBuilder(atc).build().expectedCost;

    expect(result.payments).toEqual([
      { asset: 0n, amount: 1000n, mbr: 0n, fee: 0n, total: 1000n },
      { asset: 123n, amount: 500n, mbr: 0n, fee: 0n, total: 500n },
    ]);

    expect(result.subtotals).toEqual([
      { asset: 0n, amount: 1000n },
      { asset: 123n, amount: 500n },
    ]);

    expect(result.networkFees).toBe(1_200n);
    expect(result.totalAlgo).toBe(2_200n); // 1_000 ALGO payment + 1_200 fees
  });
});

describe("extractAccountDeltas", () => {
  test("captures inner transaction effects for account", () => {
    const simResponse = {
      "txn-groups": [
        {
          "txn-results": [
            {
              txn: { type: "appl" },
              "txn-result": {
                "inner-txns": [
                  { txn: { type: "pay", snd: dummySender, rcv: otherAddr, amt: 2000, fee: 1000 } },
                  { txn: { type: "pay", snd: otherAddr, rcv: dummySender, amt: 1500, fee: 0 } },
                  { txn: { type: "axfer", snd: dummySender, rcv: dummySender, aamt: 50, xaid: 77, fee: 500 } },
                ],
              },
            },
          ],
        },
      ],
    };

    const deltas = extractAccountDeltas(simResponse, dummySender);

    // pay out 2000 + 1000 fee, pay in 1500, axfer self net 0 but fee -500
    expect(deltas).toContainEqual({ asset: 0n, delta: -2000n });
    expect(deltas).toContainEqual({ asset: 77n, delta: 0n });
  });
});

