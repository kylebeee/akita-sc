import { Contract } from '@algorandfoundation/tealscript';

const errs = {
    PLUGIN_DOES_NOT_EXIST: 'Plugin does not exist',
    PLUGIN_EXPIRED: 'Plugin has expired',
    PLUGIN_ON_COOLDOWN: 'Plugin is on cooldown',
    METHOD_NOT_ALLOWED: 'Method not allowed',
    INVALID_EXECUTION_KEY: 'Invalid execution key',
    DOES_NOT_REKEY_BACK: 'Does not rekey back',
    NO_METHOD_SIGNATURE: 'No method signature provided',
    INVALID_METHOD_SIGNATURE_LENGTH: 'Invalid method signature length',
    KEY_REGISTRATION_NOT_SUPPORTED: 'Key registration not supported',
    METADATA_HASH_TOO_LONG: 'Metadata hash is too long',
    UNKNOWN_TRANSACTION_TYPE: 'Unknown transaction type',
    ALREADY_INITIALIZED: 'Already initialized',
    VERSION_CANNOT_BE_EMPTY: 'Version cannot be empty',
    PLUGIN_DOES_NOT_CONTROL_WALLET: 'This plugin is not in control of the account',
    DISBURSEMENT_DOES_NOT_EXIST: 'Disbursement does not exist',
    DISBURSEMENT_LOCKED: 'Disbursement is still locked',
    DISBURSEMENT_FULLY_DISTRIBUTED: 'Disbursement is fully distributed',
    ALLOCATION_DOES_NOT_EXIST: 'Allocation does not exist',
    UNKNOWN_DISBURSEMENT_TYPE: 'Unknown disbursement type',
    TIME_NOT_FAR_ENOUGH_IN_THE_FUTURE: 'Time is not far enough in the future, must be at least 60 seconds from now',
    TOKEN_ALLOCATION_BOX_DOES_NOT_EXIST: 'Token allocation box does not exist',
    TOKEN_ALLOCATION_BOX_ALREADY_EXISTS: 'Token allocation box already exists',
    INSUFFICIENT_AKITA: 'Insufficient Akita',
};

const STATUS_INIT = 0;
const STATUS_LOADING_REWARDS = 1;
const STATUS_DISTRIBUTING_REWARDS = 2;
const STATUS_RUNNING = 3;

const DEFAULT_VERSION: bytes = '1.0';
const DEFAULT_CONTENT_POLICY: bytes<59> = 'ipfs://mrehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh';
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

export type ProposalDetails = {
    status: uint64;
    action: uint64;
    cid: bytes<59>;
    creator: Address;
    created: uint64;
    votes: uint64;
    plugin: AppID;
    executionKey: ExecutionKey;
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
    /** The methods that are allowed to be called for the plugin by the address */
    methods: bytes<4>[];
    /** Whether the plugin requires concensus on txn group executions for this plugin */
    executionKeyRequired: boolean;
};

export type ExecutionKey = bytes32;

export type ExecutionInfo = {
    /** whether the txn group has been executed */
    executed: boolean,
    /** The last round at which this plugin can be called */
    lastValidRound: uint64;
};


// distribute Bones for DAU
// distribute Bones for Bones Stakers
// distribute Bones for Service Usage
// distribute AKTA & other tokens for Bones Stakers

export type DAOInitFeeArgs = {
    socialPostFee: uint64;
    socialReactFee: uint64;
    stakingPoolCreationFee: uint64;
    subscriptionServiceCreationFee: uint64;
    subscriptionPaymentPercentage: uint64;
    subscriptionTriggerPercentage: uint64;
    omnigemSaleFee: uint64;
    nftListingCreationFee: uint64;
    nftShuffleCreationFee: uint64;
    auctionCreationFee: uint64;
    hyperSwapOfferFee: uint64;
    krbyPercentage: uint64;
    moderatorPercentage: uint64;
}

export type AkitaDAOState = {
    status: uint64;
    version: string;
    contentPolicy: bytes<59>;
    minimumRewardsImpact: uint64;
    socialPostFee: uint64;
    socialReactFee: uint64;
    stakingPoolCreationFee: uint64;
    subscriptionServiceCreationFee: uint64;
    subscriptionPaymentPercentage: uint64;
    subscriptionTriggerPercentage: uint64;
    omnigemSaleFee: uint64;
    nftListingCreationFee: uint64;
    nftShuffleCreationFee: uint64;
    auctionCreationFee: uint64;
    hyperSwapOfferFee: uint64;
    krbyPercentage: uint64;
    moderatorPercentage: uint64;
    minimumProposalThreshold: uint64;
    minimumVoteThreshold: uint64;
    bonesID: AssetID;
    revocationAddress: Address;
}

export type CallerUsed = {
    global: boolean;
    local: boolean;
};

/**
 * The Akita DAO contract has several responsibilities:
 * [-] Manages the disbursement of the bones token
 * [x] Manages the content policy of the protocol
 * [-] Manages the minimum impact score to qualify for daily disbursement
 * [x] Sets the fee to post on akita social
 * [x] Sets the fee to react on akita social
 * [-] Sets the fee structure for Akita Staking
 * [x] Sets the fee structure for Akita Subscriptions
 * [-] Sets the fee structure for Akita NFT Listings
 * [-] Sets the fee structure for Akita NFT Shuffles
 * [-] Sets the fee structure for Akita Auctions
 * [-] Sets the fee structure for Akita Asset Swaps
 */

export class AkitaDAO extends Contract {
    programVersion = 10;

    /** state of the DAO */
    status = GlobalStateKey<uint64>({ key: 'status' });
    /** the version number of the DAO */
    version = GlobalStateKey<string>({ key: 'version' });
    /** the content policy of the protocol */
    contentPolicy = GlobalStateKey<bytes<59>>({ key: 'content_policy' });
    /** the minimum impact score to qualify for daily disbursement */
    minimumRewardsImpact = GlobalStateKey<uint64>({ key: 'minimum_rewards_impact' });

    // fees
    /** the cost to post on akita social */
    socialPostFee = GlobalStateKey<uint64>({ key: 'social_post_fee' });
    /** the cost to react to something on akita social */
    socialReactFee = GlobalStateKey<uint64>({ key: 'social_react_fee' });
    /** the smallest percentage of tax the system takes for social interactions */
    socialImpactTaxMinimum = GlobalStateKey<uint64>({ key: 'social_impact_tax_minimum' });
    /** the largest percentage of tax  */
    socialImpactTaxMaximum = GlobalStateKey<uint64>({ key: 'social_impact_tax_maximum' });
    /** the cost to distribute rewards */
    rewardsDistributionFee = GlobalStateKey<uint64>({ key: 'rewards_distribution_fee' });
    /** the cost to create a staking pool */
    stakingPoolCreationFee = GlobalStateKey<uint64>({ key: 'staking_pool_creation_fee' });
    /** the cost to create a subscription service */
    subscriptionServiceCreationFee = GlobalStateKey<uint64>({ key: 'subscription_service_creation_fee' });
    /** the per-payment percentage of subscriptions as a whole number. eg. 3.5% is 35 */
    subscriptionPaymentPercentage = GlobalStateKey<uint64>({ key: 'subscription_payment_percentage' });
    /** the per-payment trigger percentage of subscriptions */
    subscriptionTriggerPercentage = GlobalStateKey<uint64>({ key: 'subscription_trigger_percentage' });
    /** omnigem sale fee */
    omnigemSaleFee = GlobalStateKey<uint64>({ key: 'omnigem_sale_fee' });
    /** the nft listing fee */
    nftListingCreationFee = GlobalStateKey<uint64>({ key: 'nft_listing_creation_fee' });
    /** the nft listing sale fee */
    nftListingSaleFee = GlobalStateKey<uint64>({ key: 'nft_listing_sale_fee' });
    /** the nft shuffle fee */
    nftShuffleCreationFee = GlobalStateKey<uint64>({ key: 'nft_shuffle_creation_fee' });
    /** the nft shuffle sale fee */
    nftShuffleSaleFee = GlobalStateKey<uint64>({ key: 'nft_shuffle_sale_fee' });
    /** the auction fee */
    auctionCreationFee = GlobalStateKey<uint64>({ key: 'auction_creation_fee' });
    /** the asset swap fee */
    hyperSwapOfferFee = GlobalStateKey<uint64>({ key: 'hyper_swap_offer_fee' });

    /**
     * The percentage of total rewards allocated to krby expressed in the hundreds
     * eg. 3% is 300, 12.75% is 1275
     * 
    */
    krbyPercentage = GlobalStateKey<uint64>({ key: 'krby_percentage' });
    /** moderator fee */
    moderatorPercentage = GlobalStateKey<uint64>({ key: 'moderator_percentage' });

    // internal state variables

    /** the unix timestamp of the last rewards distribution */
    // lastDistribution = GlobalStateKey<uint64>({ key: 'last_distribution' });
    /** the minimum staking power needed to create a proposal */
    minimumProposalThreshold = GlobalStateKey<uint64>({ key: 'minimum_proposal_threshold' });
    /** the minimum of positive votes necessary to pass a proposal */
    minimumVoteThreshold = GlobalStateKey<uint64>({ key: 'minimum_vote_threshold' });
    /** the akita token asset id */
    akitaID = GlobalStateKey<AssetID>({ key: 'akita_id' });
    /** the Bones governance asa */
    bonesID = GlobalStateKey<AssetID>({ key: 'bones_id' });

    /** revocation msig */
    revocationAddress = GlobalStateKey<Address>({ key: 'revocation_address' });
    /** the next proposal id */
    _proposalID = GlobalStateKey<uint64>({ key: 'proposal_id' });
    /** the daily disbursement cursor */
    _disbursementCursor = GlobalStateKey<uint64>({ key: 'disbursement_cursor' });

    /** voting state of a proposal */
    proposals = BoxMap<uint64, ProposalDetails>();

    /**
     * Plugins that add functionality to the DAO
     */
    plugins = BoxMap<PluginsKey, PluginInfo>({ prefix: 'p' });

    /**
     * Group hashes that the DAO has approved to be submitted
     */
    executions = BoxMap<ExecutionKey, ExecutionInfo>();

    /**
     * 
     */
    // tokenAllocations = BoxMap<AssetID, uint64>();

    private controls(address: Address): boolean {
        return address.authAddr === this.app.address;
    }

    private rekeyBack(address: Address) {
        sendPayment({
            sender: address,
            amount: 0,
            receiver: address,
            rekeyTo: address,
            fee: 0,
        });
    }

    private newProposalID(): uint64 {
        const id = this._proposalID.value;
        this._proposalID.value += 1;
        return id;
    }

    private assertPluginCallAllowed(app: AppID, caller: Address): void {
        const key: PluginsKey = { application: app, allowedCaller: caller };

        assert(this.plugins(key).exists, errs.PLUGIN_DOES_NOT_EXIST);
        assert(this.plugins(key).value.lastValidRound >= globals.round, errs.PLUGIN_EXPIRED);
        assert(
            (globals.round - this.plugins(key).value.lastCalled) >= this.plugins(key).value.cooldown,
            errs.PLUGIN_ON_COOLDOWN
        );
    }

    private pluginCallAllowed(app: AppID, caller: Address): boolean {
        const key: PluginsKey = { application: app, allowedCaller: caller };

        return (
            this.plugins(key).exists &&
            this.plugins(key).value.lastValidRound >= globals.round &&
            (globals.round - this.plugins(key).value.lastCalled) >= this.plugins(key).value.cooldown
        );
    }

    private ensuresRekeyBack(txn: Txn): boolean {
        if (txn.sender === this.app.address && txn.rekeyTo === this.app.address) {
            return true;
        }

        return (
            txn.typeEnum === TransactionType.ApplicationCall &&
            txn.applicationID === this.app &&
            txn.numAppArgs === 1 &&
            txn.onCompletion === 0 &&
            txn.applicationArgs[0] === method('arc58_verifyAuthAddr()void')
        )
    }

    /**
     * Guarantee that our txn group is valid in a single loop over all txns in the group
     * 
     * @param app the plugin app id being validated
     * @param methodOffsets the indices of the methods being used in the group
     * @param checkGlobal whether to check the global caller for method restrictions
     * @param checkLocal whether to check the local caller for method restrictions
     * @param executionKey the execution key required for the txn group
     * 
     */
    private assertValidGroup(
        app: AppID,
        methodOffsets: uint64[],
        checkGlobal: boolean,
        checkLocal: boolean,
        executionKey: ExecutionKey
    ): CallerUsed {
        const globalKey: PluginsKey = { application: app, allowedCaller: Address.zeroAddress };
        const key: PluginsKey = { application: app, allowedCaller: this.txn.sender };

        let rekeysBack = false;
        const executionKeyRequired = this.plugins(key).value.executionKeyRequired;
        const globalRestrictions = checkGlobal && this.plugins(globalKey).value.methods.length > 0;
        const localRestrictions = checkLocal && this.plugins(key).value.methods.length > 0;
        let methodIndex = 0;
        let hash: string = '';
        let callerUsed: CallerUsed = {
            global: checkGlobal && !globalRestrictions,
            local: checkLocal && !localRestrictions,
        };

        for (let i = (this.txn.groupIndex + 1); i < this.txnGroup.length; i += 1) {
            const txn = this.txnGroup[i];

            if (this.ensuresRekeyBack(txn)) {
                rekeysBack = true;
            }

            // we dont need to check method restrictions at all if none exist
            // & skip transactions that aren't relevant
            if ((!globalRestrictions && !localRestrictions) || this.shouldSkipMethodCheck(txn, app)) {
                continue;
            }

            const globalValid = (
                checkGlobal && (
                    !globalRestrictions
                    || (
                        methodIndex < methodOffsets.length
                        && this.methodCallAllowed(txn, app, Address.zeroAddress, methodOffsets[methodIndex])
                    )
                )
            );

            const localValid = (
                checkLocal && (
                    !localRestrictions
                    || (
                        methodIndex < methodOffsets.length
                        && this.methodCallAllowed(txn, app, this.txn.sender, methodOffsets[methodIndex])
                    )
                )
            );

            assert(globalValid || localValid, errs.METHOD_NOT_ALLOWED);

            // default to using global if both are valid
            // due to plugins having cooldowns we want to
            // properly attribute which is being used
            // in the case of both being allowed we default to global
            if (globalValid) {
                callerUsed.global = true;
            } else if (localValid) {
                callerUsed.local = true;
            }

            methodIndex += 1;

            // we only need the hash of the transactions that take place
            // while the plugin has control of the DAO account
            if (!rekeysBack && executionKeyRequired) {
                if (globals.opcodeBudget < 50) {
                    increaseOpcodeBudget();
                }
                hash = this.txnHash(txn, hash)
            }
        }

        if (executionKeyRequired) {
            assert(executionKey === (hash as bytes32), errs.INVALID_EXECUTION_KEY);
        }

        assert(rekeysBack, errs.DOES_NOT_REKEY_BACK);

        return callerUsed;
    }

    private shouldSkipMethodCheck(txn: Txn, app: AppID): boolean {
        if (
            // ignore non-application calls
            txn.typeEnum !== TransactionType.ApplicationCall ||
            // ignore calls to other applications
            (txn.applicationID !== app && txn.applicationID !== this.app) ||
            // ignore rekey back assert app call
            this.ensuresRekeyBack(txn)
        ) {
            return true;
        }

        return false;
    }

    /**
     * Checks if the method call is allowed
     * 
     * @param txn the transaction being validated
     * @param app the plugin app id being validated
     * @param caller the address that triggered the plugin or global address
     * @returns whether the method call is allowed
     * 
     */
    private methodCallAllowed(txn: Txn, app: AppID, caller: Address, offset: uint64): boolean {

        assert(txn.numAppArgs > 0, errs.NO_METHOD_SIGNATURE);
        assert(len(txn.applicationArgs[0]) === 4, errs.INVALID_METHOD_SIGNATURE_LENGTH);

        const key: PluginsKey = {
            application: app,
            allowedCaller: caller,
        };

        const methods = this.plugins(key).value.methods;
        const allowedMethod = methods[offset];

        if (allowedMethod === txn.applicationArgs[0] as bytes<4>) {
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
            assert(false, errs.KEY_REGISTRATION_NOT_SUPPORTED);
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
            assert(txn.configAsset.metadataHash.length <= 32, errs.METADATA_HASH_TOO_LONG);

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

            let max = 0;
            let accountHash = '';
            let appArgHash = '';
            let assetHash = '';
            let applicationHash = '';

            if (txn.numAccounts > max) {
                max = txn.numAccounts;
            }

            if (txn.numAppArgs > max) {
                max = txn.numAppArgs;
            }

            if (txn.numAssets > max) {
                max = txn.numAssets;
            }

            // @ts-expect-error
            if (txn.numApplications > max) {
                // @ts-expect-error
                max = txn.numApplications;
            }

            for (let i = 0; i < max; i += 1) {
                if (txn.numAccounts > i) {
                    accountHash = accountHash + txn.accounts[i];
                }

                if (txn.numAppArgs > i) {
                    appArgHash = appArgHash + txn.applicationArgs[i];
                }

                if (txn.numAssets > i) {
                    assetHash = assetHash + itob(txn.assets[i]);
                }

                // @ts-expect-error
                if (txn.numApplications > i) {
                    applicationHash = applicationHash + itob(txn.applications[i]);
                }
            }

            if (accountHash.length > 0) {
                accountHash = sha256(accountHash);
            }

            if (appArgHash.length > 0) {
                appArgHash = sha256(appArgHash);
            }

            if (assetHash.length > 0) {
                assetHash = sha256(assetHash);
            }

            if (applicationHash.length > 0) {
                applicationHash = sha256(applicationHash);
            }

            return sha256(
                common
                + itob(txn.applicationID)
                + itob(txn.onCompletion)
                + txn.approvalProgram
                + txn.clearStateProgram
                + accountHash
                + appArgHash
                + assetHash
                + applicationHash
                + itob(txn.globalNumUint)
                + itob(txn.globalNumByteSlice)
                + itob(txn.localNumUint)
                + itob(txn.localNumByteSlice)
                + itob(txn.extraProgramPages)
            );
        } else {
            assert(false, errs.UNKNOWN_TRANSACTION_TYPE);
            return hash as bytes32;
        }
    }

    createApplication(): void { }

    updateApplication(): void {

    }

    init(
        version: string,
        contentPolicy: bytes<59>,
        minimumRewardsImpact: uint64,
        fees: DAOInitFeeArgs,
        minimumProposalThreshold: uint64,
        minimumVoteThreshold: uint64,
        revocationAddress: Address,
    ): void {
        assert(this.version.value.length === 0, errs.ALREADY_INITIALIZED);
        assert(version !== '', errs.VERSION_CANNOT_BE_EMPTY);

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
        this.version.value = version;
        this.contentPolicy.value = contentPolicy;
        this.minimumRewardsImpact.value = minimumRewardsImpact;
        this.socialPostFee.value = fees.socialPostFee;
        this.socialReactFee.value = fees.socialReactFee;
        this.stakingPoolCreationFee.value = fees.stakingPoolCreationFee;
        this.subscriptionServiceCreationFee.value = fees.subscriptionServiceCreationFee;
        this.subscriptionPaymentPercentage.value = fees.subscriptionPaymentPercentage;
        this.subscriptionTriggerPercentage.value = fees.subscriptionTriggerPercentage;
        this.omnigemSaleFee.value = fees.omnigemSaleFee;
        this.nftListingCreationFee.value = fees.nftListingCreationFee;
        this.nftShuffleCreationFee.value = fees.nftShuffleCreationFee;
        this.auctionCreationFee.value = fees.auctionCreationFee;
        this.hyperSwapOfferFee.value = fees.hyperSwapOfferFee;
        this.krbyPercentage.value = fees.krbyPercentage;
        this.moderatorPercentage.value = fees.moderatorPercentage;
        this.minimumProposalThreshold.value = minimumProposalThreshold;
        this.minimumVoteThreshold.value = minimumVoteThreshold;
        this.bonesID.value = bones;
        this.revocationAddress.value = revocationAddress;
        this._proposalID.value = 0;
    }

    /**
     * Verify the abstracted account is rekeyed to this app
     */
    arc58_verifyAuthAddr(): void {
        assert(this.app.address.authAddr === globals.zeroAddress);
    }

    /**
     * Temporarily rekey to an approved plugin app address
     *
     * @param plugin The app to rekey to
     * @param methodOffsets The indices of the methods being used in the group
     * if the plugin has method restrictions these indices are required to match
     * the methods used on each subsequent call to the plugin within the group
     * @param executionKey The execution key required for the txn group
     * TODO: ask joe about method overloading for ABI & ARCs to see if we can leave this as is
     */
    arc58_rekeyToPlugin(plugin: AppID, methodOffsets: uint64[], executionKey: bytes<32>): void {
        const globalExists = this.plugins({ application: plugin, allowedCaller: Address.zeroAddress }).exists;
        const localExists = this.plugins({ application: plugin, allowedCaller: this.txn.sender }).exists;

        let globalAllowed = false;
        let locallyAllowed = false;

        if (globalExists) {
            globalAllowed = this.pluginCallAllowed(plugin, Address.zeroAddress);
        }

        if (localExists) {
            locallyAllowed = this.pluginCallAllowed(plugin, this.txn.sender);
        }

        // if the plugin does not exist or is not allowed by either the global or local caller
        // then the call is not allowed, assert check so we error out cleanly
        if (
            (!globalExists && !localExists)
            || (globalExists && !globalAllowed && !locallyAllowed)
        ) {
            this.assertPluginCallAllowed(plugin, Address.zeroAddress);
        } else if (localExists && !locallyAllowed && !globalAllowed) {
            this.assertPluginCallAllowed(plugin, this.txn.sender);
        }

        const used = this.assertValidGroup(plugin, methodOffsets, globalAllowed, locallyAllowed, executionKey);

        sendPayment({
            receiver: this.app.address,
            rekeyTo: plugin.address,
            note: 'rekeying to plugin app',
            fee: 0,
        });

        if (used.global) {
            this.plugins({
                application: plugin,
                allowedCaller: Address.zeroAddress
            }).value.lastCalled = globals.round;
        }

        if (used.local) {
            this.plugins({
                application: plugin,
                allowedCaller: this.txn.sender
            }).value.lastCalled = globals.round;
        }
    }

    newProposal(proposalType: uint64): void {
        const id = this.newProposalID();


    }

    createDailyDisbursement(): void {

        // calc the amount to distribute
        const bonesAmount = this.app.address.assetBalance(this.bonesID.value);


        // const krbyFee = (amount * this.krbyPercentage.value) - 1 / 10_000 + 1;
        // const modFee = (amount * this.moderatorPercentage.value) - 1 / 10_000 + 1;

        // distribute to krby

        // distribute to moderators

        // distribute to stakers
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
            subscriptionPaymentPercentage: this.subscriptionPaymentPercentage.value,
            subscriptionTriggerPercentage: this.subscriptionTriggerPercentage.value,
            omnigemSaleFee: this.omnigemSaleFee.value,
            nftListingCreationFee: this.nftListingCreationFee.value,
            nftShuffleCreationFee: this.nftShuffleCreationFee.value,
            auctionCreationFee: this.auctionCreationFee.value,
            hyperSwapOfferFee: this.hyperSwapOfferFee.value,
            krbyPercentage: this.krbyPercentage.value,
            moderatorPercentage: this.moderatorPercentage.value,
            minimumProposalThreshold: this.minimumProposalThreshold.value,
            minimumVoteThreshold: this.minimumVoteThreshold.value,
            bonesID: this.bonesID.value,
            revocationAddress: this.revocationAddress.value,
        }
    }
}