import { Contract } from "@algorandfoundation/tealscript";
import { StakeValue, Staking, StakingType } from "../staking/staking.algo";

// okay how does this shit work?

// you create a pool, set gate requirements & 

// passing the gate doesn't tell us how much you should be rewarded
// how do we determine that?

// we want to support staking multiple assets
// how do we interpret that?

// people sign up
// we call the contract and create reward disbursements based on the schedule 

export type PoolState = uint8

export const PoolStateDraft = 0;
export const PoolStateFinal = 1;
export const PoolStatePaused = 2; // not sure we should allow this

export type RewardRateType = uint64;

/**
 * disburse the rewards at the given rate based on the users % of stake in the pool
 * eg. the rate is 1000 and a users stake is 6% of the pool, they get 166.66
 */
export const RewardRateTypeStakePercentage = 0;
/**
 * disburse the rewards at the given rate using a flat amount
 * eg. each user gets 10 AKTA per day if they qualify
 */
export const RewardRateTypeFlat = 1;
/**
 * disburse the rewards at the given rate evenly among all participants
 * eg. the rate is 1000 & theres 6 stakers, each gets 166.66
 */
export const RewardRateTypeEven = 2;
/**
 * disburse the rewards randomly to a single user at the given rate
 * eg. the rate is 1000, one random qualified user gets it all
 */
export const RewardRateTypeShuffle = 3;

export type RewardID = uint64

export type RewardInfo = {
    asset: AssetID;
    type: uint64;
    strategy: uint64;
    rateType: uint64;
    rate: RewardRateType;
    quantity: uint64;
    expiration: uint64;
};

export class Pool extends Contract {
    programVersion = 10;

    /** the state the pool is in */
    state = GlobalStateKey<PoolState>({ key: 'state' });
    /** title of the staking pool */
    title = GlobalStateKey<string>({ key: 'title' });
    /** the method of staking to be used for the pool */
    // type = GlobalStateKey<StakingType>({ key: 'type' });
    /** the round the pool starts at *if applicable* */
    startingRound = GlobalStateKey<uint64>({ key: 'starting_round' });
    /** the round the pool ends at *if applicable* */
    endingRound = GlobalStateKey<uint64>({ key: 'ending_round' });
    /** the maximum entries allowed for the pool */
    maxEntries = GlobalStateKey<uint64>({ key: 'max_entries' });
    /** the name for the meta merkle asset group to validate staking */
    // stakeKey = GlobalStateKey<string>({ key: 'stake_key' });
    /** the gate id of the pool */
    gateID = GlobalStateKey<uint64>({ key: 'gate_id' });
    /** the address of the creator of the staking pool */
    creator = GlobalStateKey<Address>({ key: 'creator' });
    
    akitaStakingAppID = GlobalStateKey<AppID>({ key: 'akita_staking_app_id' });

    akitaRewardsAppID = GlobalStateKey<AppID>({ key: 'akita_rewards_app_id' });
    /** the beacon app id to use for rewards that  */
    vrfBeaconAppID = GlobalStateKey<AppID>({ key: 'vrf_beacon_app_id' });

    /** the reward id incrementor for the rewards in the pool */
    rewardID = GlobalStateKey<RewardID>({ key: 'reward_id' });

    entries = BoxMap<Address, bytes<0>>({ prefix: 'e' });

    /** the rewards to disburse from the pool */
    rewards = BoxMap<RewardID, RewardInfo>({ prefix: 'r' });

    private newRewardsID(): uint64 {
        const id = this.rewardID.value;
        this.rewardID.value += 1;
        return id;
    }

    /**
     * 
     * @returns a boolean of whether the auction is live
     */
    @abi.readonly
    isLive(): boolean {
        return (
            this.state.value === PoolStateFinal
            && (globals.round <= this.startingRound.value || this.startingRound.value === 0)
            && (globals.round >= this.endingRound.value || this.endingRound.value === 0)
        )
    }

    createApplication(
        type: StakingType,
        creator: Address,
        marketplace: Address,
        gateID: uint64,
        akitaStakingAppID: AppID,
        akitaRewardsAppID: AppID,
        vrfBeaconAppID: AppID,
    ) {
        this.state.value = PoolStateDraft;
        this.creator.value = creator;
        this.akitaStakingAppID.value = akitaStakingAppID;
        this.akitaRewardsAppID.value = akitaRewardsAppID;

        this.gateID.value = gateID;
    }

    finalize(startingRound: uint64, endingRound: uint64) {
        assert(this.txn.sender === this.creator.value, 'only the creator can finalize the pool');
        assert(this.state.value === PoolStateDraft, 'the pool must be in draft state to finalize');
        assert(startingRound === 0 || startingRound > globals.round, 'the starting round must be in the future');
        assert(
            endingRound === 0
            || (
                startingRound > globals.round 
                && endingRound > (startingRound + 10)
            ),
            'the ending round must be after the starting round'
        );
        assert(this.rewardID.value > 0, 'there must be at least one reward in the pool');

        this.state.value = PoolStateFinal;
    }

    addReward(reward: RewardInfo): RewardID {
        return 0
    }

    enter(payment: PayTxn, args: bytes[]) {
        // verify the payment
        // prove you pass the gate
        // add user to entries 
    }
}