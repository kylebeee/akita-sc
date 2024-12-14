import { Contract } from '@algorandfoundation/tealscript';
import { bytes0, bytes4, bytes59 } from '../../utils/constants';

const STATUS_INIT = 0;
const STATUS_LOADING_REWARDS = 1;
const STATUS_DISTRIBUTING_REWARDS = 2;
const STATUS_RUNNING = 3;

const DEFAULT_VERSION: bytes = '1.0';
const DEFAULT_CONTENT_POLICY: bytes59 = 'ipfs://mrehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh';
const DEFAULT_MINIMUM_REWARDS_IMPACT = 400;
const DEFAULT_SOCIAL_POST_FEE = 100_000_000;
const DEFAULT_SOCIAL_REACT_FEE = 10_000_000;
const DEFAULT_STAKING_POOL_CREATION_FEE = 50_000_000;
const DEFAULT_SUBSCRIPTION_SERVICE_CREATION_FEE = 50_000_000;
const DEFAULT_SUBSCRIPTION_PAYMENT_PERCENTAGE_FEE = 4;
const DEFAULT_OMNIGEM_SALE_FEE = 100_000_000;
const DEFAULT_NFT_LISTING_CREATION_FEE = 1_000_000;
const DEFAULT_NFT_SHUFFLE_CREATION_FEE = 10_000_000;
const DEFAULT_AUCTION_CREATION_FEE = 10_000_000;
const DEFAULT_HYPER_SWAP_FEE = 10_000_000;
const DEFAULT_KRBY_PERCENTAGE_FEE = 30;
const DEFAULT_MODERATOR_PERCENTAGE_FEE = 4;
const DEFAULT_MINIMUM_PROPOSAL_THRESHOLD = 10;
const DEFAULT_MINIMUM_VOTE_THRESHOLD = 10;

export const STATUS_DRAFT = 0;
export const STATUS_INVALID = 1;
export const STATUS_PROPOSED = 2;
export const STATUS_VOTING = 3;

export const STATUS_REJECTED = 9;
export const STATUS_APPROVED = 10;

export const PROPOSAL_TYPE_UPDATE_CONTENT_POLICY = 0;
export const PROPOSAL_TYPE_UPDATE_MINIMUM_REWARD_IMPACT = 1;
export const PROPOSAL_TYPE_UPDATE_SOCIAL_POST_FEE = 2;
export const PROPOSAL_TYPE_UPDATE_SOCIAL_REACT_FEE = 3;
export const PROPOSAL_TYPE_UPDATE_STAKING_POOL_CREATION_FEE = 4;
export const PROPOSAL_TYPE_UPDATE_SUBSCRIPTION_SERVICE_CREATION_FEE = 5;
export const PROPOSAL_TYPE_UPDATE_SUBSCRIPTION_PAYMENT_FEE = 6;
export const PROPOSAL_TYPE_UPDATE_OMNIGEM_SALE_FEE = 7;
export const PROPOSAL_TYPE_UPDATE_NFT_LISTING_CREATION_FEE = 8;
export const PROPOSAL_TYPE_UPDATE_NFT_SHUFFLE_CREATION_FEE = 9;
export const PROPOSAL_TYPE_UPDATE_AUCTION_CREATION_FEE = 10;
export const PROPOSAL_TYPE_UPDATE_HYPER_SWAP_FEE = 11;
export const PROPOSAL_TYPE_UPDATE_KRBY_FEE = 12;
export const PROPOSAL_TYPE_UPDATE_MODERATOR_FEE = 13;
export const PROPOSAL_TYPE_UPDATE_MINIMUM_VOTE_THRESHOLD = 14;
export const PROPOSAL_TYPE_UPDATE_REVOCATION_ADDRESS = 15;

export const PROPOSAL_TYPE_UPDATE_AKITA_DAO = 16;
export const PROPOSAL_TYPE_UPDATE_ABSTRACTED_ACCOUNT_FACTORY = 17;
export const PROPOSAL_TYPE_UPDATE_AKITA_SOCIAL = 18;

export const PROPOSAL_TYPE_ADD_DAO_PLUGIN = 19;
export const PROPOSAL_TYPE_USE_DAO_PLUGIN = 20;
export const PROPOSAL_TYPE_REMOVE_DAO_PLUGIN = 21;

export const PROPOSAL_TYPE_ADD_AKITA_SOCIAL_MODERATOR = 22;
export const PROPOSAL_TYPE_REMOVE_AKITA_SOCIAL_MODERATOR = 23;

export const PROPOSAL_TYPE_ADD_SOCIAL_ACTION = 24;
export const PROPOSAL_TYPE_REMOVE_SOCIAL_ACTION = 25;

export const PROPOSAL_TYPE_ADD_SOCIAL_GATE = 26;
export const PROPOSAL_TYPE_REMOVE_SOCIAL_GATE = 27;

export const PLUGIN_STATUS_APPROVED = 1;

export type DistributionDetails = {
    amount: uint64;
}

export type ProposalDetails = {
    cid: bytes59;
    action: uint64;
    args: bytes;
}

export type PluginsKey = {
    /** The application containing plugin logic */
    application: AppID;
    /** The address that is allowed to initiate a rekey to the plugin */
    allowedCaller: Address;
};

export type PluginInfo = {
    /** The last round at which this plugin can be called */
    lastValidRound: uint64;
    /** The number of rounds that must pass before the plugin can be called again */
    cooldown: uint64;
    /** The last round the plugin was called */
    lastCalled: uint64;
    /** Whether the plugin has method restrictions on it being called */
    methodRestrictions: boolean;
    /** Whether the plugin requires concensus on txn group executions for this plugin */
    executionKeyRequired: boolean;
};

export type MethodsKey = {
    /** The application containing plugin logic */
    application: AppID;
    /** The address that is allowed to initiate a rekey to the plugin */
    allowedCaller: Address;
    /** The 4 byte method signature */
    method: bytes4;
}

export type ExecutionKey = bytes32;

export type ExecutionInfo = {
    /** whether the txn group has been executed */
    executed: boolean,
    /** The last round at which this plugin can be called */
    lastValidRound: uint64;
};

export type RewardsDistributionDetails = {
    address: Address;
    amount: uint64;
}

export type AkitaDAOState = {
    status: uint64;
    version: string;
    contentPolicy: bytes59;
    minimumRewardsImpact: uint64;
    socialPostFee: uint64;
    socialReactFee: uint64;
    stakingPoolCreationFee: uint64;
    subscriptionServiceCreationFee: uint64;
    subscriptionPaymentPercentageFee: uint64;
    omnigemSaleFee: uint64;
    nftListingCreationFee: uint64;
    nftShuffleCreationFee: uint64;
    auctionCreationFee: uint64;
    hyperSwapFee: uint64;
    krbyPercentageFee: uint64;
    moderatorPercentageFee: uint64;
    lastDistribution: uint64;
    minimumProposalThreshold: uint64;
    minimumVoteThreshold: uint64;
    bonesAsset: AssetID;
    circulatingBones: uint64;
    revocationAddress: Address;
}

/**
 * The Akita DAO contract has several responsibilities:
 * - Manages the distribution of the bones token
 * - Manages the content policy of the protocol
 * - Manages the minimum impact score to qualify for daily distribution
 * - Sets the fee to post on akita social
 * - Sets the fee to react on akita social
 * - Sets the fee structure for Akita Staking
 * - Sets the fee structure for Akita Subscriptions
 * - Sets the fee structure for Akita NFT Listings
 * - Sets the fee structure for Akita NFT Shuffles
 * - Sets the fee structure for Akita Auctions
 * - Sets the fee structure for Akita Asset Swaps
 */

export class AkitaDAO extends Contract {
    programVersion = 10;

    /** state of the DAO */
    status = GlobalStateKey<uint64>({ key: 's' });
    /** the version number of the DAO */
    version = GlobalStateKey<string>({ key: 'v' });
    /** the content policy of the protocol */
    contentPolicy = GlobalStateKey<bytes59>({ key: 'cp' });
    /** the minimum impact score to qualify for daily distribution */
    minimumRewardsImpact = GlobalStateKey<uint64>({ key: 'mri' });

    // fees
    /** the cost to post on akita social */
    socialPostFee = GlobalStateKey<uint64>({ key: 'spf' });
    /** the cost to react to something on akita social */
    socialReactFee = GlobalStateKey<uint64>({ key: 'srf' });
    /** the cost to create a staking pool */
    stakingPoolCreationFee = GlobalStateKey<uint64>({ key: 'spcf' });
    /** the cost to create a subscription service */
    subscriptionServiceCreationFee = GlobalStateKey<uint64>({ key: 'sscf' });
    /** the per-payment cost of subscriptions */
    subscriptionPaymentPercentageFee = GlobalStateKey<uint64>({ key: 'sppf' });
    /** omnigem sale fee */
    omnigemSaleFee = GlobalStateKey<uint64>({ key: 'ogsf' });
    /** the nft listing fee */
    nftListingCreationFee = GlobalStateKey<uint64>({ key: 'nlcf' });
    /** the nft shuffle fee */
    nftShuffleCreationFee = GlobalStateKey<uint64>({ key: 'nscf' });
    /** the auction fee */
    auctionCreationFee = GlobalStateKey<uint64>({ key: 'acf' });
    /** the asset swap fee */
    hyperSwapFee = GlobalStateKey<uint64>({ key: 'hsf' });

    /** the percentage of total rewards allocated to krby */
    krbyPercentageFee = GlobalStateKey<uint64>({ key: 'kpf' });
    /** moderator fee */
    moderatorPercentageFee = GlobalStateKey<uint64>({ key: 'mpf' });

    // internal state variables

    /** the unix timestamp of the last rewards distribution */
    lastDistribution = GlobalStateKey<uint64>({ key: 'ld' });
    /** the minimum staking power needed to create a proposal */
    minimumProposalThreshold = GlobalStateKey<uint64>({ key: 'mpt' });
    /** the minimum of positive votes necessary to pass a proposal */
    minimumVoteThreshold = GlobalStateKey<uint64>({ key: 'mvt' });
    /** the Bones governance asa */
    bonesAsset = GlobalStateKey<AssetID>({ key: 'b' });
    /** the Bones that are currently allocated but not claimed */
    allocatedBones = GlobalStateKey<uint64>({ key: 'ab' });
    /** the circulating supply of bones */
    circulatingBones = GlobalStateKey<uint64>({ key: 'cb' });

    /** the Akita tokens that are allocated to some usage */
    allocatedAkita = GlobalStateKey<uint64>({ key: 'aa' });

    /** revocation msig */
    revocationAddress = GlobalStateKey<Address>({ key: 'ra' });
    /** the next proposal id */
    proposalID = GlobalStateKey<uint64>({ key: 'pid' });
    /** the cursor id of the social rewards box */
    socialRewardsCursor = GlobalStateKey<uint64>({ key: 'src' });

    /** voting state of a proposal */
    proposals = BoxMap<uint64, ProposalDetails>({ dynamicSize: true });

    /**
     * Plugins that add functionality to the DAO
     */
    plugins = BoxMap<PluginsKey, PluginInfo>({ prefix: 'p' });

    /**
     * methods restrict plugin delegation only to the method names allowed for the delegation
     * a methods box entry missing means that all methods on the plugin are allowed
     */
    methods = BoxMap<MethodsKey, bytes4[]>({ prefix: 'm' });

    /**
     * Group hashes that the DAO has approved to be submitted
     */
    executions = BoxMap<ExecutionKey, ExecutionInfo>();

    /** the distribution map of the bones token 
     * 
     * the key is the date the distribution is available to be allocated to users
     * the value is the amount of bones allocated to that day
     * 
     * 
    */
    distribution = BoxMap<uint64, DistributionDetails>({ prefix: 'd' });

    /** the rewards allocated to service usage */
    serviceRewards = BoxMap<Address, uint64>({ prefix: 'e' });

    /** the rewards allocated to social ussage */
    socialRewards = BoxMap<uint64, uint64>({ prefix: 'o' });

    /** the rewards allocated to each staker */
    stakingRewards = BoxMap<Address, uint64>({ prefix: 's' });

    private ensuresRekeyBack(txn: Txn): boolean {
        if (txn.sender === this.app.address && txn.rekeyTo === this.app.address) {
            return true;
        }

        return (
            txn.applicationArgs[0] === method('verifyAuthAddr()void') &&
            txn.numAppArgs === 1 &&
            txn.typeEnum === TransactionType.ApplicationCall &&
            txn.applicationID === this.app &&
            txn.onCompletion === 0
        )
    }

    private pluginCallAllowed(app: AppID, caller: Address, executionKey: ExecutionKey): boolean {
        const key: PluginsKey = { application: app, allowedCaller: caller };

        return (
            this.plugins(key).exists &&
            this.plugins(key).value.lastValidRound >= globals.round &&
            globals.round - this.plugins(key).value.lastCalled >= this.plugins(key).value.cooldown &&
            // validate the transaction group
            this.validateCall(app, caller, executionKey)
        );
    }

    /**
     * Guarantee that our txn group is valid in a single loop over all txns in the group
     * 
     * @param app 
     * @param caller 
     * @param executionKey 
     * @returns 
     */
    private validateCall(app: AppID, caller: Address, executionKey: ExecutionKey): boolean {
        const key: PluginsKey = { application: app, allowedCaller: caller };

        let rekeysBack = false;
        let methodRestrictions = this.plugins(key).value.methodRestrictions;
        let executionKeyRequired = this.plugins(key).value.executionKeyRequired;
        let validExecution = !executionKeyRequired;
        let hash: string = '';

        for (let i = this.txn.groupIndex; i < this.txnGroup.length; i += 1) {
            const txn = this.txnGroup[i];

            if (this.ensuresRekeyBack(txn)) {
                rekeysBack = true;
            }

            if (methodRestrictions && !this.methodCallAllowed(txn, app, caller)) {
                return false;
            }

            if (executionKeyRequired) {
                if (globals.opcodeBudget < 50) {
                    increaseOpcodeBudget();
                }

                hash = this.txnHash(txn, hash)
            }
        }

        if (executionKeyRequired) {
            validExecution = executionKey === (hash as bytes32);
        }

        return rekeysBack && validExecution;
    }

    private methodCallAllowed(txn: Txn, app: AppID, caller: Address): boolean {
        if (
            // ignore non-application calls
            txn.typeEnum !== TransactionType.ApplicationCall ||
            // ignore calls to other applications
            (txn.applicationID !== app && txn.applicationID !== this.app) ||
            // if its globally allowed, ignore the caller
            // otherwise ignore calls from other addresses
            (caller !== Address.zeroAddress && txn.sender !== caller) ||
            // ignore rekey back assert app call
            this.ensuresRekeyBack(txn)
        ) {
            return true;
        }

        const key: MethodsKey = {
            application: app,
            allowedCaller: caller,
            method: txn.applicationArgs[0] as bytes4
        };

        if (!this.methods(key).exists) {
            return false;
        }

        return true;
    }

    private txnHash(txn: Txn, hash: string): bytes32 {
        let common = (
            hash
            + txn.sender
            + itob(txn.typeEnum)
            + txn.note
            + txn.rekeyTo
            + itob(txn.fee)
        );

        if (txn.typeEnum === TransactionType.Payment) {
            return sha256(
                common
                + txn.receiver
                + itob(txn.amount)
                + txn.closeRemainderTo
            );
        } else if (txn.typeEnum === TransactionType.KeyRegistration) {
            assert(false, 'unknown transaction type');
            return hash as bytes32;
            // TODO: add support for key registration txns
            // return sha256(
            //     common
            //     + txn.votePk
            //     + txn.selectionPK
            //     + txn.stateProofPk
            //     + txn.voteFirst
            //     + txn.voteLast
            //     + txn.voteKeyDilution
            // );
        } else if (txn.typeEnum === TransactionType.AssetConfig) {
            assert(txn.configAsset.metadataHash.length <= 32, 'metadata hash too long');

            // + txn.configAsset.url

            return sha256(
                common
                + itob(txn.configAsset.id)
                + itob(txn.configAsset.total)
                + itob(txn.configAsset.decimals)
                + (txn.configAsset.defaultFrozen ? '1' : '0')
                + txn.configAsset.unitName
                + txn.configAsset.name
                + txn.configAsset.metadataHash
                + txn.configAsset.manager
                + txn.configAsset.reserve
                + txn.configAsset.freeze
                + txn.configAsset.clawback
            );
        } else if (txn.typeEnum === TransactionType.AssetTransfer) {
            return sha256(
                common
                + itob(txn.xferAsset)
                + itob(txn.assetAmount)
                + txn.assetSender
                + txn.assetReceiver
                + txn.assetCloseTo
            );
        } else if (txn.typeEnum === TransactionType.AssetFreeze) {
            return sha256(
                common
                + txn.freezeAssetAccount
                + itob(txn.freezeAsset)
                + (txn.freezeAssetFrozen ? '1' : '0')
            );
        } else if (txn.typeEnum === TransactionType.ApplicationCall) {

            // + txn.accounts
            // + txn.applicationArgs
            // + txn.applications
            // + txn.assets

            return sha256(
                common
                + itob(txn.applicationID)
                + itob(txn.onCompletion)
                + txn.approvalProgram
                + txn.clearStateProgram
                + itob(txn.globalNumUint)
                + itob(txn.globalNumByteSlice)
                + itob(txn.localNumUint)
                + itob(txn.localNumByteSlice)
                + itob(txn.extraProgramPages)
            );
        } else {
            assert(false, 'unknown transaction type');
            return hash as bytes32;
        }
    }

    createApplication(): void {

    }

    updateApplication(): void {

    }

    init(
        version: string,
        contentPolicy: bytes59,
        minimumRewardsImpact: uint64,
        socialPostFee: uint64,
        socialReactFee: uint64,
        stakingPoolCreationFee: uint64,
        subscriptionServiceCreationFee: uint64,
        subscriptionPaymentPercentageFee: uint64,
        omnigemSaleFee: uint64,
        nftListingCreationFee: uint64,
        nftShuffleCreationFee: uint64,
        auctionCreationFee: uint64,
        hyperSwapFee: uint64,
        krbyPercentageFee: uint64,
        moderatorPercentageFee: uint64,
        minimumProposalThreshold: uint64,
        minimumVoteThreshold: uint64,
        revocationAddress: Address,
    ): void {
        assert(this.version.value === '', 'already initialized');
        assert(version !== '', 'version cannot be empty');

        const bones = sendAssetCreation({
            configAssetName: 'Bones',
            configAssetUnitName: 'BONES',
            configAssetTotal: 100_000_000_000_000,
            configAssetDecimals: 2,
            configAssetManager: this.app.address,
            configAssetReserve: this.app.address,
            configAssetFreeze: globals.zeroAddress,
            configAssetClawback: globals.zeroAddress,
            configAssetDefaultFrozen: 0,
            configAssetURL: '',
            configAssetMetadataHash: '',
        });

        this.status.value = STATUS_INIT;
        this.version.value = DEFAULT_VERSION;
        this.contentPolicy.value = contentPolicy;
        this.minimumRewardsImpact.value = minimumRewardsImpact;
        this.socialPostFee.value = socialPostFee;
        this.socialReactFee.value = socialReactFee;
        this.stakingPoolCreationFee.value = stakingPoolCreationFee;
        this.subscriptionServiceCreationFee.value = subscriptionServiceCreationFee;
        this.subscriptionPaymentPercentageFee.value = subscriptionPaymentPercentageFee;
        this.omnigemSaleFee.value = omnigemSaleFee;
        this.nftListingCreationFee.value = nftListingCreationFee;
        this.nftShuffleCreationFee.value = nftShuffleCreationFee;
        this.auctionCreationFee.value = auctionCreationFee;
        this.hyperSwapFee.value = hyperSwapFee;
        this.krbyPercentageFee.value = krbyPercentageFee;
        this.moderatorPercentageFee.value = moderatorPercentageFee;
        this.lastDistribution.value = 0;
        this.minimumProposalThreshold.value = minimumProposalThreshold;
        this.minimumVoteThreshold.value = minimumVoteThreshold;
        this.bonesAsset.value = bones;
        this.revocationAddress.value = revocationAddress;
        this.proposalID.value = 0;
    }

    /**
     * Verify the abstracted account is rekeyed to this app
     */
    verifyAuthAddr(): void {
        assert(this.app.address.authAddr === globals.zeroAddress);
    }

    rekeyToPlugin(plugin: AppID, executionKey: ExecutionKey): void {
        const globalAllowed = this.pluginCallAllowed(plugin, Address.zeroAddress, executionKey);

        if (!globalAllowed)
            assert(this.pluginCallAllowed(plugin, this.txn.sender, executionKey), 'This sender is not allowed to trigger this plugin');

        sendPayment({
            receiver: this.app.address,
            rekeyTo: plugin.address,
        });

        this.plugins({
            application: plugin,
            allowedCaller: globalAllowed ? Address.zeroAddress : this.txn.sender,
        }).value.lastCalled = globals.round;
    }

    buildRewards(): void {
        assert(this.status.value === STATUS_LOADING_REWARDS, 'invalid state');
    }

    claimRewards(): void {

    }

    getState(): AkitaDAOState {
        return {
            status: this.status.value,
            version: this.version.value,
            contentPolicy: this.contentPolicy.value,
            minimumRewardsImpact: this.minimumRewardsImpact.value,
            socialPostFee: this.socialPostFee.value,
            socialReactFee: this.socialReactFee.value,
            stakingPoolCreationFee: this.stakingPoolCreationFee.value,
            subscriptionServiceCreationFee: this.subscriptionServiceCreationFee.value,
            subscriptionPaymentPercentageFee: this.subscriptionPaymentPercentageFee.value,
            omnigemSaleFee: this.omnigemSaleFee.value,
            nftListingCreationFee: this.nftListingCreationFee.value,
            nftShuffleCreationFee: this.nftShuffleCreationFee.value,
            auctionCreationFee: this.auctionCreationFee.value,
            hyperSwapFee: this.hyperSwapFee.value,
            krbyPercentageFee: this.krbyPercentageFee.value,
            moderatorPercentageFee: this.moderatorPercentageFee.value,
            lastDistribution: this.lastDistribution.value,
            minimumProposalThreshold: this.minimumProposalThreshold.value,
            minimumVoteThreshold: this.minimumVoteThreshold.value,
            bonesAsset: this.bonesAsset.value,
            circulatingBones: this.circulatingBones.value,
            revocationAddress: this.revocationAddress.value,
        }
    }
}