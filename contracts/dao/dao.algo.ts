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
const DEFAULT_CONTENT_POLICY: bytes<36> = 'ipfs://mrehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh';
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
    cid: bytes<36>;
    creator: Address;
    created: uint64;
    votes: uint64;
    plugin: AppID;
    groupID: bytes32;
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
    groupIDRequired: boolean;
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
    marketplaceSalePercentageMinimum: uint64;
    marketplaceSalePercentageMaximum: uint64;
    marketplaceComposablePercentage: uint64;
    nftShuffleSalePercentage: uint64;
    auctionSalePercentageMinimum: uint64;
    auctionSalePercentageMaximum: uint64;
    auctionComposablePercentage: uint64;
    krbyPercentage: uint64;
    moderatorPercentage: uint64;
}

export type AkitaDAOState = {
    status: uint64;
    version: string;
    contentPolicy: bytes<36>;
    minimumRewardsImpact: uint64;
    socialPostFee: uint64;
    socialReactFee: uint64;
    stakingPoolCreationFee: uint64;
    subscriptionServiceCreationFee: uint64;
    subscriptionPaymentPercentage: uint64;
    subscriptionTriggerPercentage: uint64;
    omnigemSaleFee: uint64;
    marketplaceSalePercentageMinimum: uint64;
    marketplaceSalePercentageMaximum: uint64;
    marketplaceComposablePercentage: uint64;
    nftShuffleCreationFee: uint64;
    auctionSalePercentageMinimum: uint64;
    auctionSalePercentageMaximum: uint64;
    auctionComposablePercentage: uint64;
    hyperSwapOfferFee: uint64;
    krbyPercentage: uint64;
    moderatorPercentage: uint64;
    minimumProposalThreshold: uint64;
    minimumVoteThreshold: uint64;
    bonesID: AssetID;
    revocationAddress: Address;
}

export type AppList = {
    vrfBeacon: AppID; // vrf beacon
    social: AppID; // social app
    impact: AppID; // impact app
    staking: AppID; // universal staking
    rewards: AppID; // akita rewards distro
    pool: AppID; // akita staking pools
    subscriptions: AppID; // akita subscriptions
    gate: AppID; // main gate
    nfdRegistry: AppID; // NFD Registry
    nfd: AppID; // Akita Root NFD
    auction: AppID; // Akita Auctions
    hyperSwap: AppID; // Akita HyperSwap
    raffle: AppID; // Akita Raffle
    metaMerkles: AppID; // Akita MetaMerkles
    marketplace: AppID; // Akita Marketplace
}

export type SocialFees = {
    postFee: uint64; // the cost to post on akita social
    reactFee: uint64; // the cost to react to something on akita social
    /**
     * the smallest percentage of tax the system takes for social interactions
     * padded with two decimals 1% = 100
    */
    impactTaxMin: uint64;
    /**
     * the largest percentage of tax the system takes for social interactions
     * padded with two decimals 20% = 2000 
    */
    impactTaxMax: uint64;
}

export type StakingFees = {
    rewardsFee: uint64; // the cost to create a rewards distribution 
    poolCreationFee: uint64; // the cost to create a staking pool
}

export type SubscriptionFees = {
    serviceCreationFee: uint64; // the cost to create a subscription service
    paymentPercentage: uint64; // the per-payment percentage of subscriptions as a whole number. eg. 3.5% is 35
    triggerPercentage: uint64; // the per-payment trigger percentage of subscriptions
}

export type NFTFees = {
    omnigemSaleFee: uint64; // omnigem sale fee
    marketplaceSalePercentageMinimum: uint64; // the minimum percentage to take on an NFT sale based on user impact
    marketplaceSalePercentageMaximum: uint64; // the maximum percentage to take on an NFT sale based on user impact
    marketplaceComposablePercentage: uint64; // the percentage each side of the composable marketplace takes on an NFT sale
    shuffleSalePercentage: uint64; // the nft shuffle sale % fee
    auctionSalePercentageMinimum: uint64; // the minimum percentage to take on an NFT auction based on user impact
    auctionSalePercentageMaximum: uint64; // the maximum percentage to take on an NFT auction based on user impact
    auctionComposablePercentage: uint64; // the percentage each side of the composable auction takes on an NFT sale
}

export type AkitaAssets = {
    akta: AssetID; // the akita token asset id
    bones: AssetID; // the Bones governance asa
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
    contentPolicy = GlobalStateKey<bytes<36>>({ key: 'content_policy' });
    /** the minimum impact score to qualify for daily disbursement */
    minimumRewardsImpact = GlobalStateKey<uint64>({ key: 'minimum_rewards_impact' });
    /** the list of akita contract ids */
    appList = GlobalStateKey<AppList>({ key: 'app_list' })
    /** fees associated with akita social */
    socialFees = GlobalStateKey<SocialFees>({ key: 'social_fees' });
    /** fees associated with staking assets */
    stakingFees = GlobalStateKey<StakingFees>({ key: 'staking_fees' });
    /** fees associated with subscriptions */
    subscriptionFees = GlobalStateKey<SubscriptionFees>({ key: 'subscription_fees' });
    /** fees associated with NFT sales */
    nftFees = GlobalStateKey<NFTFees>({ key: 'nft_fees' });
    /**
     * The percentage of total rewards allocated to krby expressed in the hundreds
     * eg. 3% is 300, 12.75% is 1275
     * 
    */
    krbyPercentage = GlobalStateKey<uint64>({ key: 'krby_percentage' });
    /** moderator fee */
    moderatorPercentage = GlobalStateKey<uint64>({ key: 'moderator_percentage' });
    /** the akita assets */
    akitaAssets = GlobalStateKey<AkitaAssets>({ key: 'akita_assets' });

    // internal state variables
    /** the unix timestamp of the last rewards distribution */
    // lastDistribution = GlobalStateKey<uint64>({ key: 'last_distribution' });
    /** the minimum staking power needed to create a proposal */
    minimumProposalThreshold = GlobalStateKey<uint64>({ key: 'minimum_proposal_threshold' });
    /** the minimum of positive votes necessary to pass a proposal */
    minimumVoteThreshold = GlobalStateKey<uint64>({ key: 'minimum_vote_threshold' });

    /** revocation msig */
    revocationAddress = GlobalStateKey<Address>({ key: 'revocation_address' });
    /** the next proposal id */
    proposalID = GlobalStateKey<uint64>({ key: 'proposal_id' });
    /** the daily disbursement cursor */
    disbursementCursor = GlobalStateKey<uint64>({ key: 'disbursement_cursor' });

    /**
     * Plugins that add functionality to the DAO
     */
    plugins = BoxMap<PluginsKey, PluginInfo>({ prefix: 'p' });

    /** voting state of a proposal */
    proposals = BoxMap<uint64, ProposalDetails>();

    /**
     * Group hashes that the DAO has approved to be submitted
     */
    executions = BoxMap<ExecutionKey, ExecutionInfo>();

    private newProposalID(): uint64 {
        const id = this.proposalID.value;
        this.proposalID.value += 1;
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

    private txnRekeysBack(txn: Txn): boolean {
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
        const groupIDRequired = this.plugins(key).value.groupIDRequired;
        if (groupIDRequired) {
            assert(executionKey === globals.groupID, errs.INVALID_EXECUTION_KEY);
        }

        const globalRestrictions = checkGlobal && this.plugins(globalKey).value.methods.length > 0;
        const localRestrictions = checkLocal && this.plugins(key).value.methods.length > 0;
        let methodIndex = 0;
        let callerUsed: CallerUsed = {
            global: checkGlobal && !globalRestrictions,
            local: checkLocal && !localRestrictions,
        };

        for (let i = (this.txn.groupIndex + 1); i < this.txnGroup.length; i += 1) {
            const txn = this.txnGroup[i];

            if (this.txnRekeysBack(txn)) {
                rekeysBack = true;
                break
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
        }

        assert(rekeysBack, errs.DOES_NOT_REKEY_BACK);

        return callerUsed;
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

    createApplication(): void {
        // TODO: Add the optin plugin immediately
    }

    // updateApplication(): void {

    // }

    init(
        version: string,
        akta: AssetID,
        contentPolicy: bytes<36>,
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
        this.socialFees.value = {
            postFee: fees.socialPostFee,
            reactFee: fees.socialReactFee,
            impactTaxMin: 100,
            impactTaxMax: 2000,
        };
        this.stakingFees.value = {
            rewardsFee: 0,
            poolCreationFee: fees.stakingPoolCreationFee,
        };
        this.subscriptionFees.value = {
            serviceCreationFee: fees.subscriptionServiceCreationFee,
            paymentPercentage: fees.subscriptionPaymentPercentage,
            triggerPercentage: fees.subscriptionTriggerPercentage,
        };
        this.nftFees.value = {
            omnigemSaleFee: fees.omnigemSaleFee,
            marketplaceSalePercentageMinimum: fees.marketplaceSalePercentageMinimum,
            marketplaceSalePercentageMaximum: fees.marketplaceSalePercentageMaximum,
            marketplaceComposablePercentage: fees.marketplaceComposablePercentage,
            shuffleSalePercentage: fees.nftShuffleSalePercentage,
            auctionSalePercentageMinimum: fees.auctionSalePercentageMinimum,
            auctionSalePercentageMaximum: fees.auctionSalePercentageMaximum,
            auctionComposablePercentage: fees.auctionComposablePercentage,
        };
        this.krbyPercentage.value = fees.krbyPercentage;
        this.moderatorPercentage.value = fees.moderatorPercentage;
        this.minimumProposalThreshold.value = minimumProposalThreshold;
        this.minimumVoteThreshold.value = minimumVoteThreshold;
        this.akitaAssets.value = {
            akta: akta,
            bones: bones,
        };
        this.revocationAddress.value = revocationAddress;
        this.proposalID.value = 0;
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
     * @param executionKey The execution (groupID) key required for the txn group
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

    receivePayment(payment: PayTxn): void {
        verifyPayTxn(payment, {
            receiver: this.app.address,
        });


    }
 
    receiveAsaPayment(xfer: AssetTransferTxn): void {
        verifyAssetTransferTxn(xfer, {
            assetReceiver: this.app.address,
        });

        // check freeze & clawback


    }

    // getState(): AkitaDAOState {
    //     return {
    //         status: this.status.value,
    //         version: this.version.value,
    //         contentPolicy: this.contentPolicy.value,
    //         minimumRewardsImpact: this.minimumRewardsImpact.value,
    //         socialPostFee: this.socialPostFee.value,
    //         socialReactFee: this.socialReactFee.value,
    //         stakingPoolCreationFee: this.stakingPoolCreationFee.value,
    //         subscriptionServiceCreationFee: this.subscriptionServiceCreationFee.value,
    //         subscriptionPaymentPercentage: this.subscriptionPaymentPercentage.value,
    //         subscriptionTriggerPercentage: this.subscriptionTriggerPercentage.value,
    //         omnigemSaleFee: this.omnigemSaleFee.value,

    //         nftShuffleCreationFee: this.nftShuffleCreationFee.value,
    //         auctionCreationFee: this.auctionCreationFee.value,
    //         hyperSwapOfferFee: this.hyperSwapOfferFee.value,
    //         krbyPercentage: this.krbyPercentage.value,
    //         moderatorPercentage: this.moderatorPercentage.value,
    //         minimumProposalThreshold: this.minimumProposalThreshold.value,
    //         minimumVoteThreshold: this.minimumVoteThreshold.value,
    //         bonesID: this.bonesID.value,
    //         revocationAddress: this.revocationAddress.value,
    //     }
    // }
}