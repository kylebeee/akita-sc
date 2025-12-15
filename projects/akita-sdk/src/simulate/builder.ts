import algosdk, { TransactionWithSigner } from "algosdk";
import { AssetPayment, ExpectedCost, SimulatePayload } from "./types";

export type PaymentHint = Partial<Omit<AssetPayment, "asset">> & { asset: bigint };

export type SimulateOptions = {
  /**
   * Optional hints to fill in data the on-chain contracts cannot infer
   * (e.g., MBR for boxes being opened).
   */
  payments?: PaymentHint[];
  /** Override network fee calculation if caller has tighter bounds. */
  networkFeeOverride?: bigint;
};

export type SimulateBuildResult = SimulatePayload & {
  /** Pre-built group for wallet signer requests. */
  toSignerRequest: () => TransactionWithSigner[];
};

const ZERO = 0n;

function applyHint(base: AssetPayment, hint?: PaymentHint): AssetPayment {
  if (!hint) return base;

  return {
    asset: base.asset,
    amount: hint.amount ?? base.amount,
    mbr: hint.mbr ?? base.mbr,
    fee: hint.fee ?? base.fee,
    total:
      (hint.amount ?? base.amount) +
      (hint.mbr ?? base.mbr) +
      (hint.fee ?? base.fee),
  };
}

function aggregatePayments(payments: AssetPayment[]): ExpectedCost {
  const subtotalsMap = new Map<bigint, bigint>();
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

function collectPayments(
  group: TransactionWithSigner[],
  hints: Map<bigint, PaymentHint>
): AssetPayment[] {
  const payments: AssetPayment[] = [];

  for (const { txn } of group) {
    if (!txn) continue;

    const type = txn.type;
    const tx = txn as any;

    if (type === "pay") {
      const amount = BigInt(tx.amount ?? tx.amt ?? 0);
      const base: AssetPayment = {
        asset: 0n,
        amount,
        mbr: ZERO,
        fee: ZERO,
        total: amount,
      };
      payments.push(applyHint(base, hints.get(0n)));
    } else if (type === "axfer") {
      const assetId = BigInt(tx.assetIndex ?? tx.xaid ?? 0);
      const amount = BigInt(tx.assetAmount ?? tx.aamt ?? 0);
      const base: AssetPayment = {
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
      payments.push(
        applyHint(
          {
            asset,
            amount,
            mbr: hint.mbr ?? ZERO,
            fee: hint.fee ?? ZERO,
            total:
              amount +
              (hint.mbr ?? ZERO) +
              (hint.fee ?? ZERO),
          },
          hint
        )
      );
    }
  }

  return payments;
}

export class SimulateBuilder {
  private readonly options: SimulateOptions;

  constructor(
    private readonly atc: algosdk.AtomicTransactionComposer,
    options: SimulateOptions = {}
  ) {
    this.options = options;
  }

  build(): SimulateBuildResult {
    const group = this.atc.buildGroup();

    const hints = new Map<bigint, PaymentHint>();
    for (const hint of this.options.payments ?? []) {
      hints.set(hint.asset, hint);
    }

    const payments = collectPayments(group, hints);

    const networkFees =
      this.options.networkFeeOverride ??
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

