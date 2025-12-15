"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const builder_1 = require("./builder");
const deltas_1 = require("./deltas");
const dummySender = "SENDER";
const otherAddr = "OTHER";
(0, vitest_1.describe)("SimulateBuilder expectedCost", () => {
    (0, vitest_1.test)("aggregates payments and network fees", () => {
        const atc = {
            buildGroup: () => ([
                { txn: { type: "pay", amount: 1000n, fee: 1000n } },
                { txn: { type: "axfer", assetIndex: 123n, assetAmount: 500n, fee: 200n } },
            ])
        };
        const result = new builder_1.SimulateBuilder(atc).build().expectedCost;
        (0, vitest_1.expect)(result.payments).toEqual([
            { asset: 0n, amount: 1000n, mbr: 0n, fee: 0n, total: 1000n },
            { asset: 123n, amount: 500n, mbr: 0n, fee: 0n, total: 500n },
        ]);
        (0, vitest_1.expect)(result.subtotals).toEqual([
            { asset: 0n, amount: 1000n },
            { asset: 123n, amount: 500n },
        ]);
        (0, vitest_1.expect)(result.networkFees).toBe(1200n);
        (0, vitest_1.expect)(result.totalAlgo).toBe(2200n); // 1_000 ALGO payment + 1_200 fees
    });
});
(0, vitest_1.describe)("extractAccountDeltas", () => {
    (0, vitest_1.test)("captures inner transaction effects for account", () => {
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
        const deltas = (0, deltas_1.extractAccountDeltas)(simResponse, dummySender);
        // pay out 2000 + 1000 fee, pay in 1500, axfer self net 0 but fee -500
        (0, vitest_1.expect)(deltas).toContainEqual({ asset: 0n, delta: -2000n });
        (0, vitest_1.expect)(deltas).toContainEqual({ asset: 77n, delta: 0n });
    });
});
//# sourceMappingURL=builder.test.js.map