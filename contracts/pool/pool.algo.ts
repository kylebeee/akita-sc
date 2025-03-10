import { ContractWithOptInCreatorOnlyAndGate } from '../../utils/base_contracts/gate.algo';
import { StakeValue, Staking, STAKING_TYPE_HEARTBEAT, STAKING_TYPE_SOFT, StakingType } from "../staking/staking.algo";
import { Rewards } from "../rewards/rewards.algo";
import { MetaMerkles, RootKey } from "../meta_merkles/meta_merkles.algo";
import { RandomnessBeacon } from "../../utils/types/vrf_beacon";
import { pcg64Init, pcg64Random } from "../../utils/types/lib_pcg/pcg64.algo";
import { AppList } from "../dao/dao.algo";
import { MAX_UINT64 } from "../../utils/constants";

const AKITA_DAO_APP_LIST_KEY = 'app_list';
const AKITA_DAO_REWARDS_DISTRIBUTION_FEE = 'rewards_distribution_fee';

const MERKLE_TREE_TYPE_ASSET = 1;

// you create a pool, set gate requirements & 
// people sign up
// we call the contract and create reward disbursements based on the schedule 
export type PoolStatus = uint8

export const PoolStatusDraft = 0;
export const PoolStatusFinal = 1;

export type DistributionType = uint64;

/**
 * disburse the rewards at the given rate based on the users % of stake in the pool
 * eg. the rate is 1000 and a users stake is 6% of the pool, they get 166.66
 */
export const DistributionTypePercentage = 0;
/**
 * disburse the rewards at the given rate using a flat amount
 * eg. each user gets 10 AKTA per day if they qualify
 */
export const DistributionTypeFlat = 1;
/**
 * disburse the rewards at the given rate evenly among all participants
 * eg. the rate is 1000 & theres 6 stakers, each gets 166.66
 */
export const DistributionTypeEven = 2;
/**
 * disburse the rewards randomly to a single user at the given rate
 * eg. the rate is 1000, one random qualified user gets it all
 */
export const DistributionTypeShuffle = 3;

export type EntryKey = {
    address: Address;
    asset: AssetID;
}

export type EntryData = EntryKey & { quantity: uint64 }

export type EntryValue = {
    id: uint64,
    quantity: uint64
}

export type Reward = {
    asset: AssetID;
    distribution: DistributionType;
    rate: uint64;
    quantity: uint64;
    expiration: uint64;
    winnerCount: uint64; // shuffle distribution only
};

export type PoolState = {
    status: PoolStatus;
    title: string;
    type: StakingType;
    reward: Reward;
    signupRound: uint64;
    startingRound: uint64;
    allowLateSignups: boolean;
    endingRound: uint64;
    maxEntries: uint64;
    entryCount: uint64;
    totalStaked: uint64;
    uniqueAssetsStaked: uint64;
    stakeKey: RootKey;
    minimumStakeAmount: uint64;
    gateID: uint64;
    creator: Address;
}

export class Pool extends ContractWithOptInCreatorOnlyAndGate {
    programVersion = 11;

    /** the state the pool is in */
    status = GlobalStateKey<PoolStatus>({ key: 'status' });
    /** title of the staking pool */
    title = GlobalStateKey<string>({ key: 'title' });
    /** the method of staking to be used for the pool */
    type = GlobalStateKey<StakingType>({ key: 'type' });
    /** the reward asset for the pool */
    reward = GlobalStateKey<Reward>({ key: 'reward' });
    /** the round sign ups for the pool are allowed */
    signupRound = GlobalStateKey<uint64>({ key: 'signup_round' });
    /** whether signups are allowed after the staking pool begins */
    allowLateSignups = GlobalStateKey<boolean>({ key: 'allow_late_signups' });
    /** the round the pool starts at *if applicable* */
    startingRound = GlobalStateKey<uint64>({ key: 'starting_round' });
    /** the round the pool ends at *if applicable* */
    endingRound = GlobalStateKey<uint64>({ key: 'ending_round' });
    /** the maximum entries allowed for the pool */
    maxEntries = GlobalStateKey<uint64>({ key: 'max_entries' });
    /** the number of entries in a pool */
    entryCount = GlobalStateKey<uint64>({ key: 'entry_count' });
    /** the total amount staked in the pool */
    totalStaked = GlobalStateKey<uint64>({ key: 'total_staked' });
    /** the total unique assets staked */
    uniqueAssetsStaked = GlobalStateKey<uint64>({ key: 'unique_assets_staked' });
    /** 
     * the name for the meta merkle asset group to validate staking
     * stake key can be empty if distribution !== DistributionTypePercentage
    */
    stakeKey = GlobalStateKey<RootKey>({ key: 'stake_key' });
    /** minimum stake amount */
    minimumStakeAmount = GlobalStateKey<uint64>({ key: 'minimum_stake_amount' });
    /** the gate id of the pool */
    gateID = GlobalStateKey<uint64>({ key: 'gate_id' });
    /** the address of the creator of the staking pool */
    creator = GlobalStateKey<Address>({ key: 'creator' });
    /** marketplace is pool creation side marketplace */
    marketplace = GlobalStateKey<Address>({ key: 'marketplace' });
    /** the akita DAO contract id */
    akitaDAO = GlobalStateKey<AppID>({ key: 'akita_dao' });

    /** indexed entries for efficient iteration */
    entries = BoxMap<uint64, EntryData>({ prefix: 'e' });
    /** the entries in the pool */
    entriesByAddress = BoxMap<EntryKey, EntryValue>({ prefix: 'a' });

    private newEntryID(): uint64 {
        const id = this.entryCount.value;
        this.entryCount.value += 1;
        return id;
    }

    /** @returns a boolean of whether sign ups are open */
    @abi.readonly
    signUpsOpen(): boolean {
        return (
            this.status.value === PoolStatusFinal
            && globals.round > this.signupRound.value
            && (
                globals.round < this.startingRound.value
                || this.startingRound.value === 0
                || this.allowLateSignups.value
            )
        );
    }

    /** @returns a boolean of whether the pool is live */
    @abi.readonly
    isLive(): boolean {
        return (
            this.status.value === PoolStatusFinal
            && (globals.round >= this.startingRound.value || this.startingRound.value === 0)
            && (globals.round <= this.endingRound.value || this.endingRound.value === 0)
        )
    }

    createApplication(
        title: string,
        type: StakingType,
        reward: Reward,
        creator: Address,
        marketplace: Address,
        stakeKey: RootKey,
        minimumStakeAmount: uint64,
        gateID: uint64,
        maxEntries: uint64,
        akitaDAO: AppID
    ) {
        this.status.value = PoolStatusDraft;
        this.title.value = title;
        this.type.value = type;
        this.reward.value = reward;
        this.creator.value = creator;
        this.marketplace.value = marketplace;
        assert(
            stakeKey.address !== globals.zeroAddress
            || reward.distribution !== DistributionTypePercentage,
        );
        this.stakeKey.value = stakeKey;
        this.minimumStakeAmount.value = minimumStakeAmount;
        this.gateID.value = gateID;
        this.maxEntries.value = maxEntries;
        this.akitaDAO.value = akitaDAO;
    }

    finalize(signupRound: uint64, startingRound: uint64, endingRound: uint64) {
        assert(this.txn.sender === this.creator.value, 'only the creator can finalize the pool');
        assert(this.status.value === PoolStatusDraft, 'the pool must be in draft state to finalize');
        assert(
            signupRound > globals.round
            || signupRound === 0 && this.allowLateSignups.value,
            'the signup round must be in the future'
        );
        assert(
            startingRound === 0 || startingRound > globals.round,
            'the starting round must be in the future'
        );
        assert(
            endingRound === 0
            || (
                startingRound > globals.round
                && endingRound > (startingRound + 10)
            ),
            'the ending round must be after the starting round + 10'
        );

        this.signupRound.value = signupRound;
        this.startingRound.value = startingRound;
        this.endingRound.value = endingRound;
        this.status.value = PoolStatusFinal;
    }

    enter(payment: PayTxn, asset: AssetID, quantity: uint64, proof: bytes32[], args: bytes[]): void {
        // Verify the pool is live
        assert(this.isLive(), 'the pool is not live');
        assert(this.gate(this.txn.sender, this.gateID.value, args), 'user does not meet gate requirements');
        assert(this.entryCount.value < this.maxEntries.value || this.maxEntries.value === 0, 'pool has reached maximum entries');

        // Verify payment for box storage (increased for additional box)
        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: 5200, // MBR for two box storage entries
        });

        assert(quantity >= this.minimumStakeAmount.value, 'quantity is less than minimum stake amount');

        // check their actual balance if the assets aren't escrowed
        if (
            this.type.value === STAKING_TYPE_HEARTBEAT
            || this.type.value === STAKING_TYPE_SOFT
        ) {
            const balance = this.txn.sender.assetBalance(asset);
            assert(balance >= quantity, 'user does not have min balance')
        }

        const akitaApps = this.akitaDAO.value.globalState(AKITA_DAO_APP_LIST_KEY) as AppList;

        const stakeInfo = sendMethodCall<typeof Staking.prototype.getInfo, StakeValue>({
            applicationID: akitaApps.staking,
            methodArgs: [
                this.txn.sender,
                {
                    asset: asset,
                    type: this.type.value
                }
            ],
            fee: 0
        });

        assert(stakeInfo.amount >= quantity, 'user does not have enough staked');

        const verified = sendMethodCall<typeof MetaMerkles.prototype.verify, boolean>({
            applicationID: akitaApps.metaMerkles,
            methodArgs: [
                this.stakeKey.value.address,
                this.stakeKey.value.name,
                sha256(sha256(itob(asset))),
                proof,
                MERKLE_TREE_TYPE_ASSET
            ],
            fee: 0,
        });

        assert(verified, 'failed to verify stake requirements');

        const entryID = this.newEntryID();
        this.entries(entryID).value = {
            address: this.txn.sender,
            asset: asset,
            quantity: quantity,
        };

        const aKey: EntryKey = { address: this.txn.sender, asset: asset };
        this.entriesByAddress(aKey).value = {
            id: entryID,
            quantity: quantity,
        };
    }

    distributeRewards(): void {
        assert(this.txn.sender === this.creator.value, 'only the creator can distribute rewards');
        assert(this.isLive(), 'the pool is not live');
        // assert distribution window is open & not already active

        const distribution = this.reward.value.distribution;

        if (distribution === DistributionTypePercentage) {
            this.distributeByStakePercentage();
        } else if (distribution === DistributionTypeFlat) {
            this.distributeFlat();
        } else if (distribution === DistributionTypeEven) {
            this.distributeEven();
        } else if (distribution === DistributionTypeShuffle) {
            this.distributeShuffle();
        } else {
            assert(false, 'unknown reward rate type');
        }
    }

    private distributeByStakePercentage(): void {
        
    }

    private distributeFlat(): void {

    }

    private distributeEven(): void {

    }

    private distributeShuffle(): void {
        const akitaApps = this.akitaDAO.value.globalState(AKITA_DAO_APP_LIST_KEY) as AppList;

        const disbursementID = this.createDisbursement(
            `${this.title.value} - Random Winner Reward`,
            globals.latestTimestamp,
            globals.latestTimestamp + this.reward.value.expiration
        );

        let winnerCount = 1;
        if (this.reward.value.winnerCount > 0) {
            winnerCount = this.reward.value.winnerCount;
        }

        const seed = sendMethodCall<typeof RandomnessBeacon.prototype.get, bytes>({
            applicationID: akitaApps.vrfBeacon,
            methodArgs: [roundToUse, this.txn.txID],
            fee: 0,
        });

        if (seed.length === 0) {
            this.vrfGetFailureCount.value += 1;
            return;
        }

        // Initialize PCG randomness with the seed
        const rngState = pcg64Init(substring3(seed, 0, 16) as bytes<16>);

        // Calculate reward amount per winner
        const winnerRewardAmount = this.reward.value.quantity / winnerCount;

        // make upper bounds inclusive if we can
        let upperBound = this.weightedBidTotal.value;
        if (upperBound < MAX_UINT64) {
            upperBound = upperBound += 1;
        }

        const rngResult = pcg64Random(rngState, 1, upperBound, this.reward.value.winnerCount);
        // this.winningTicket.value = rngResult[1][0];
    }

    private getStakeValue(address: Address, asset: AssetID): uint64 {
        const akitaApps = this.akitaDAO.value.globalState(AKITA_DAO_APP_LIST_KEY) as AppList;

        if (this.type.value === STAKING_TYPE_HEARTBEAT) {
            return sendMethodCall<typeof Staking.prototype.getHeartbeatAverage, uint64>({
                applicationID: akitaApps.staking,
                methodArgs: [address, asset],
                fee: 0,
            });
        }

        const stakeInfo = sendMethodCall<typeof Staking.prototype.getInfo, StakeValue>({
            applicationID: akitaApps.staking,
            methodArgs: [address, { asset: asset, type: this.type.value }],
            fee: 0,
        });

        return stakeInfo.amount;
    }

    private createDisbursement(title: string, timeToUnlock: uint64, expiration: uint64): uint64 {
        const akitaApps = this.akitaDAO.value.globalState(AKITA_DAO_APP_LIST_KEY) as AppList;
        const rewardsAppID = akitaApps.rewards;

        const rewardsFee = this.akitaDAO.value.globalState(AKITA_DAO_REWARDS_DISTRIBUTION_FEE) as uint64;

        return sendMethodCall<typeof Rewards.prototype.createDisbursement, uint64>({
            applicationID: rewardsAppID,
            methodArgs: [
                {
                    receiver: rewardsAppID.address,
                    amount: 1_000_000,
                    fee: 0,
                },
                {
                    receiver: this.akitaDAO.value.address,
                    amount: rewardsFee,
                    fee: 0,
                },
                title,
                timeToUnlock,
                expiration,
                `Pool ID: ${this.app.id}`
            ],
            fee: 0,
        });
    }

    private createAllocations(
        disbursementID: uint64,
        asset: AssetID,
        allocations: { address: Address, amount: uint64 }[]
    ): void {
        const akitaApps = this.akitaDAO.value.globalState(AKITA_DAO_APP_LIST_KEY) as AppList;
        const rewardsAppID = akitaApps.rewards;

        if (asset.id === 0) {
            // ALGO allocations
            sendMethodCall<typeof Rewards.prototype.createUserAllocations, void>({
                applicationID: rewardsAppID,
                methodArgs: [
                    {
                        receiver: rewardsAppID.address,
                        amount: this.calculateAllocationMBR(allocations),
                        fee: 0,
                    },
                    disbursementID,
                    allocations
                ]
            });
        } else {
            // ASA allocations
            sendMethodCall<typeof Rewards.prototype.createAsaUserAllocations, void>({
                applicationID: rewardsAppID,
                methodArgs: [
                    {
                        receiver: rewardsAppID.address,
                        amount: this.calculateAllocationMBR(allocations),
                        fee: 0,
                    },
                    {
                        assetReceiver: rewardsAppID.address,
                        xferAsset: asset,
                        assetAmount: this.sumAllocations(allocations),
                        fee: 0,
                    },
                    disbursementID,
                    asset,
                    allocations
                ]
            });
        }
    }

    private finalizeDisbursement(disbursementID: uint64): void {
        const akitaApps = this.akitaDAO.value.globalState(AKITA_DAO_APP_LIST_KEY) as AppList;
        const rewardsAppID = akitaApps.rewards;

        sendMethodCall<typeof Rewards.prototype.finalizeDisbursement, void>({
            applicationID: rewardsAppID,
            methodArgs: [disbursementID],
            fee: 0,
        });
    }

    private calculateAllocationMBR(allocations: { address: Address, amount: uint64 }[]): uint64 {
        return 24_900 * allocations.length; // 24,900 microAlgos per allocation
    }

    private sumAllocations(allocations: { address: Address, amount: uint64 }[]): uint64 {
        let sum = 0;
        for (let i = 0; i < allocations.length; i++) {
            sum += allocations[i].amount;
        }
        return sum;
    }

    @abi.readonly
    getState(): PoolState {
        return {
            status: this.status.value,
            title: this.title.value,
            type: this.type.value,
            reward: this.reward.value,
            signupRound: this.signupRound.value,
            allowLateSignups: this.allowLateSignups.value,
            startingRound: this.startingRound.value,
            endingRound: this.endingRound.value,
            maxEntries: this.maxEntries.value,
            entryCount: this.entryCount.value,
            totalStaked: this.totalStaked.value,
            uniqueAssetsStaked: this.uniqueAssetsStaked.value,
            stakeKey: this.stakeKey.value,
            minimumStakeAmount: this.minimumStakeAmount.value,
            gateID: this.gateID.value,
            creator: this.creator.value,
        };
    }

    // Start a distribution process
    startDistribution(): void {
        assert(this.txn.sender === this.creator.value, 'only the creator can distribute rewards');
        assert(this.isLive(), 'the pool is not live');

        // Create a disbursement in rewards contract
        const disbursementID = this.createDisbursement(
            `${this.title.value} - Reward Distribution`,
            globals.latestTimestamp,
            globals.latestTimestamp + this.reward.value.expiration
        );
    }

    // Helper method for allocating rewards by percentage of stake
    private allocateByPercentage(startCursor: uint64, endCursor: uint64, asset: AssetID, totalRewardQuantity: uint64): void {

    }

    // Helper method for allocating flat rewards
    private allocateFlat(startCursor: uint64, endCursor: uint64, asset: AssetID, flatRate: uint64): void {

    }

    // Helper method for allocating even rewards
    private allocateEven(startCursor: uint64, endCursor: uint64, asset: AssetID, evenAmount: uint64): void {

    }

    // Helper method for allocating random/shuffle rewards
    private allocateShuffle(asset: AssetID, quantity: uint64): void {
        const akitaApps = this.akitaDAO.value.globalState(AKITA_DAO_APP_LIST_KEY) as AppList;

        let qualifiedCount = 0;
        for (let i = 0; i < this.entryCount.value; i++) {
            const address = this.entries(i).value;
            const stakeValue = this.getStakeValue(address, asset);

            if (stakeValue > 0) {
                qualifiedCount++;
            }
        }

        if (qualifiedCount === 0) {
            return; // No qualified participants
        }

        // Get random value from VRF beacon
        const seed = sendMethodCall<typeof RandomnessBeacon.prototype.get, bytes>({
            applicationID: akitaApps.vrfBeacon,
            methodArgs: [globals.round - 1, this.txn.txID], // Using previous round for determinism
            fee: 0,
        });

        if (seed.length === 0) {
            return; // Failed to get random seed
        }

        // Convert seed to random index
        const randomValue = btoi(extract(seed, 0, 8));
        const randomIndex = randomValue % qualifiedCount;

        // Find the address at this random index
        let currentQualifiedIdx = 0;
        let selectedAddress: Address | null = null;

        for (let i = 0; i < this.entryCount.value; i++) {
            const address = this.entries(i).value;
            const stakeValue = this.getStakeValue(address, asset);

            if (stakeValue > 0) {
                if (currentQualifiedIdx === randomIndex) {
                    selectedAddress = address;
                    break;
                }
                currentQualifiedIdx++;
            }
        }

        if (selectedAddress !== null) {
            // Create allocation for the winner
            const allocations = [{
                address: selectedAddress,
                amount: quantity
            }];

            this.createAllocations(
                this.activeDisbursementID.value,
                asset,
                allocations
            );
        }
    }
}