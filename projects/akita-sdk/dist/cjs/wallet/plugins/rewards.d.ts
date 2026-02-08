import { BaseSDK } from "../../base";
import { RewardsPluginArgs, RewardsPluginClient } from "../../generated/RewardsPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = RewardsPluginArgs["obj"];
type ClaimRewardsArgs = (Omit<ContractArgs['claimRewards(uint64,bool,(uint64,uint64)[])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class RewardsPluginSDK extends BaseSDK<RewardsPluginClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Each claim consumes foreign references across multiple types (COMBINED limit of 8 per txn):
     *   - Boxes: allocation box on rewards contract (2 slots: box + foreignApp for non-zero app)
     *   - Assets: 1 ASA reference for the inner transfer
     *   - Asset holdings: receiver opt-in check (account + asset, ~2 slots amortized)
     *   - Accounts: receiver account for inner transfer (shared but counted per-claim)
     * The combined per-txn limit means boxes with non-zero app IDs are expensive (2 slots each).
     * Each app call in the group provides 8 pooled slots across ALL reference types.
     * The group is capped at 16 transactions, with 2 reserved (plugin call + verifyAuthAddr).
     */
    private static readonly REFS_PER_CLAIM;
    private static readonly BASE_REF_OVERHEAD;
    private static readonly REFS_PER_TXN;
    private static readonly MAX_OPUP_COUNT;
    static getMaxClaimsPerTransaction(): number;
    private static computeOpUpCount;
    claimRewards(): PluginSDKReturn;
    claimRewards(args: ClaimRewardsArgs): PluginSDKReturn;
}
export {};
