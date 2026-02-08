import { BaseSDK } from "../../base";
import { RewardsPluginArgs, RewardsPluginClient, RewardsPluginFactory } from "../../generated/RewardsPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { getTxns } from "../utils";

type ContractArgs = RewardsPluginArgs["obj"];

type ClaimRewardsArgs = (
  Omit<ContractArgs['claimRewards(uint64,bool,(uint64,uint64)[])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

export class RewardsPluginSDK extends BaseSDK<RewardsPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: RewardsPluginFactory, ...params });
  }

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
  private static readonly REFS_PER_CLAIM = 8;
  private static readonly BASE_REF_OVERHEAD = 10; // plugin app, rewards app, wallet app, wallet boxes, sender, contract accounts, etc.
  private static readonly REFS_PER_TXN = 8;
  private static readonly MAX_OPUP_COUNT = 14; // 16 max group size - 2 reserved (plugin call + verifyAuthAddr)

  static getMaxClaimsPerTransaction(): number {
    const totalRefs = (1 + RewardsPluginSDK.MAX_OPUP_COUNT) * RewardsPluginSDK.REFS_PER_TXN;
    return Math.floor((totalRefs - RewardsPluginSDK.BASE_REF_OVERHEAD) / RewardsPluginSDK.REFS_PER_CLAIM);
  }

  private static computeOpUpCount(numClaims: number): number {
    const refsNeeded = RewardsPluginSDK.BASE_REF_OVERHEAD + (RewardsPluginSDK.REFS_PER_CLAIM * numClaims);
    const opUpCount = Math.max(0, Math.ceil((refsNeeded - RewardsPluginSDK.REFS_PER_TXN) / RewardsPluginSDK.REFS_PER_TXN));

    if (opUpCount > RewardsPluginSDK.MAX_OPUP_COUNT) {
      const max = RewardsPluginSDK.getMaxClaimsPerTransaction();
      throw new Error(
        `Too many reward claims in a single transaction (${numClaims}). ` +
        `Maximum is ${max} claims per transaction. Split into multiple calls.`
      );
    }

    return opUpCount;
  }

  claimRewards(): PluginSDKReturn;
  claimRewards(args: ClaimRewardsArgs): PluginSDKReturn;
  claimRewards(args?: ClaimRewardsArgs): PluginSDKReturn {
    const methodName = 'claimRewards';
    if (args === undefined) {
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const numClaims = args.rewards?.length ?? 0;
    const opUpCount = RewardsPluginSDK.computeOpUpCount(numClaims);

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.claimRewards({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      },
      opUpCount
    });
  }
}

