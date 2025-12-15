import algosdk, { TransactionWithSigner } from "algosdk";
import { AssetPayment, SimulatePayload } from "./types";
export type PaymentHint = Partial<Omit<AssetPayment, "asset">> & {
    asset: bigint;
};
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
export declare class SimulateBuilder {
    private readonly atc;
    private readonly options;
    constructor(atc: algosdk.AtomicTransactionComposer, options?: SimulateOptions);
    build(): SimulateBuildResult;
}
