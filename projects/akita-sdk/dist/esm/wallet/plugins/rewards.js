"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardsPluginSDK = void 0;
const base_1 = require("../../base");
const RewardsPluginClient_1 = require("../../generated/RewardsPluginClient");
const utils_1 = require("../utils");
class RewardsPluginSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: RewardsPluginClient_1.RewardsPluginFactory, ...params });
    }
    static getMaxClaimsPerTransaction() {
        const totalRefs = (1 + RewardsPluginSDK.MAX_OPUP_COUNT) * RewardsPluginSDK.REFS_PER_TXN;
        return Math.floor((totalRefs - RewardsPluginSDK.BASE_REF_OVERHEAD) / RewardsPluginSDK.REFS_PER_CLAIM);
    }
    static computeOpUpCount(numClaims) {
        const refsNeeded = RewardsPluginSDK.BASE_REF_OVERHEAD + (RewardsPluginSDK.REFS_PER_CLAIM * numClaims);
        const opUpCount = Math.max(0, Math.ceil((refsNeeded - RewardsPluginSDK.REFS_PER_TXN) / RewardsPluginSDK.REFS_PER_TXN));
        if (opUpCount > RewardsPluginSDK.MAX_OPUP_COUNT) {
            const max = RewardsPluginSDK.getMaxClaimsPerTransaction();
            throw new Error(`Too many reward claims in a single transaction (${numClaims}). ` +
                `Maximum is ${max} claims per transaction. Split into multiple calls.`);
        }
        return opUpCount;
    }
    claimRewards(args) {
        const methodName = 'claimRewards';
        if (args === undefined) {
            return (spendingAddress) => ({
                appId: this.client.appId,
                selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
                getTxns: utils_1.getTxns
            });
        }
        const numClaims = args.rewards?.length ?? 0;
        const opUpCount = RewardsPluginSDK.computeOpUpCount(numClaims);
        const { sender, signer } = args;
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return (spendingAddress) => ({
            appId: this.client.appId,
            selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
            getTxns: async ({ wallet }) => {
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
exports.RewardsPluginSDK = RewardsPluginSDK;
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
RewardsPluginSDK.REFS_PER_CLAIM = 8;
RewardsPluginSDK.BASE_REF_OVERHEAD = 10; // plugin app, rewards app, wallet app, wallet boxes, sender, contract accounts, etc.
RewardsPluginSDK.REFS_PER_TXN = 8;
RewardsPluginSDK.MAX_OPUP_COUNT = 14; // 16 max group size - 2 reserved (plugin call + verifyAuthAddr)
//# sourceMappingURL=rewards.js.map