import { MaybeSigner } from "../types";
import { StakingPoolArgs, StakingPoolState, Reward, RootKey, FunderInfo, StakingPoolMbrData, EntryData } from '../generated/StakingPoolClient';
import { StakingPoolFactoryArgs } from '../generated/StakingPoolFactoryClient';
import { AppCallMethodCall } from "@algorandfoundation/algokit-utils/types/composer";
export { StakingPoolState, Reward, RootKey, FunderInfo, StakingPoolMbrData, EntryData };
type FactoryContractArgs = StakingPoolFactoryArgs["obj"];
export type NewPoolParams = MaybeSigner & Omit<FactoryContractArgs['newPool(pay,string,uint8,address,(address,string),uint64,bool,uint64,uint64)uint64'], 'payment'>;
export type DeletePoolParams = MaybeSigner & FactoryContractArgs['deletePool(uint64)void'];
type PoolContractArgs = StakingPoolArgs["obj"];
export type AddRewardParams = MaybeSigner & Omit<PoolContractArgs['addReward(pay,(uint64,uint8,uint64,uint64,uint64,uint64))void'], 'payment'>;
export type AddRewardAsaParams = MaybeSigner & Omit<PoolContractArgs['addRewardAsa(pay,axfer,(uint64,uint8,uint64,uint64,uint64,uint64))void'], 'payment' | 'assetXfer'> & {
    /** the asset ID of the reward */
    asset: bigint;
    /** The amount of the asset to transfer for the reward */
    amount: bigint;
};
export type FinalizePoolParams = MaybeSigner & PoolContractArgs['finalize(uint64,uint64,uint64)void'];
export type Entry = {
    /** The asset ID being staked */
    asset: bigint | number;
    /** The amount being entered */
    amount: bigint | number;
    /** Optional merkle proofs for gated entry */
    proofs?: Uint8Array[];
};
export type EnterPoolParams = MaybeSigner & {
    /** Array of entries (asset, amount, optional proofs) */
    entries: Entry[];
    /** Optional additional arguments for gated entry */
    gateTxn?: AppCallMethodCall;
};
export type StartDisbursementParams = MaybeSigner & PoolContractArgs['startDisbursement(uint64)void'];
export type RaffleParams = MaybeSigner & PoolContractArgs['raffle(uint64)void'];
export type DisburseRewardsParams = MaybeSigner & PoolContractArgs['disburseRewards(uint64,uint64)void'];
export type FinalizeDistributionParams = MaybeSigner & PoolContractArgs['finalizeDistribution(uint64)void'];
export type OptinAssetParams = MaybeSigner & Omit<PoolContractArgs['optIn(pay,uint64)void'], 'payment'>;
export type CheckParams = PoolContractArgs['check(address,uint64)(bool,uint64)'];
export type GateCheckParams = PoolContractArgs['gateCheck(appl,address,uint64)void'];
export type CheckResult = {
    isEligible: boolean;
    stake: bigint;
};
export type IsEnteredParams = PoolContractArgs['isEntered(address)bool'];
export type StakingPoolMbrParams = PoolContractArgs['mbr(uint64)(uint64,uint64,uint64,uint64,uint64)'];
export declare enum PoolStatus {
    Draft = 0,
    Final = 10
}
export declare enum StakingPoolStakingType {
    NONE = 0,
    HEARTBEAT = 10,
    SOFT = 20,
    HARD = 30,
    LOCK = 40
}
export declare enum DistributionType {
    Percentage = 10,
    Flat = 20,
    Even = 30,
    Shuffle = 40
}
export declare enum DisbursementPhase {
    Idle = 0,
    Preparation = 10,
    Allocation = 20,
    Finalization = 30
}
