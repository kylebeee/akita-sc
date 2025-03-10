import { Account, arc4, assert, BoxMap, bytes, Global, GlobalState, uint64, itxn, Bytes, Contract, abimethod, gtxn, Asset } from '@algorandfoundation/algorand-typescript';
import { AkitaAssets, AkitaDAOState, AppList, arc4AkitaAssets, arc4AppList, arc4Fees, arc4NFTFees, arc4ProposalSettings, arc4SocialFees, arc4StakingFees, arc4SubscriptionFees, ExecutionInfo, ExecutionKey, NFTFees, ProposalDetails, ProposalSettings, SocialFees, StakingFees, SubscriptionFees } from './types';
import { AkitaDAOGlobalStateKeys } from './constants';
import { errs } from './errs';
import { AssetHolding } from '@algorandfoundation/algorand-typescript/op';

const STATUS_INIT = 0;
// const STATUS_LOADING_REWARDS = 1;
// const STATUS_DISTRIBUTING_REWARDS = 2;
// const STATUS_RUNNING = 3;

// const DEFAULT_VERSION: string = '1.0';
// const DEFAULT_CONTENT_POLICY: string = 'ipfs://mrehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh';
// const DEFAULT_MINIMUM_REWARDS_IMPACT = 400;
// const DEFAULT_SOCIAL_POST_FEE = 100_000_000;
// const DEFAULT_SOCIAL_REACT_FEE = 10_000_000;
// const DEFAULT_STAKING_POOL_CREATION_FEE = 50_000_000;
// const DEFAULT_SUBSCRIPTION_SERVICE_CREATION_FEE = 50_000_000;
// const DEFAULT_SUBSCRIPTION_PAYMENT_PERCENTAGE_FEE = 4;
// const DEFAULT_OMNIGEM_SALE_FEE = 100_000_000;
// const DEFAULT_NFT_LISTING_CREATION_FEE = 1_000_000;
// const DEFAULT_NFT_SHUFFLE_CREATION_FEE = 10_000_000;
// const DEFAULT_AUCTION_CREATION_FEE = 10_000_000;
// const DEFAULT_HYPER_SWAP_FEE = 10_000_000;
// const DEFAULT_KRBY_PERCENTAGE_FEE = 30;
// const DEFAULT_MODERATOR_PERCENTAGE_FEE = 4;
// const DEFAULT_MINIMUM_PROPOSAL_THRESHOLD = 10;
// const DEFAULT_MINIMUM_VOTE_THRESHOLD = 10;

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
    /** state of the DAO */
    status = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeys.status });
    /** the version number of the DAO */
    version = GlobalState<string>({ key: AkitaDAOGlobalStateKeys.version });
    /** the raw 36 byte content policy of the protocol */
    contentPolicy = GlobalState<bytes>({ key: AkitaDAOGlobalStateKeys.contentPolicy });
    /** the minimum impact score to qualify for daily disbursement */
    minimumRewardsImpact = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeys.minimumRewardsImpact });
    /** the list of akita contract ids */
    appList = GlobalState<AppList>({ key: AkitaDAOGlobalStateKeys.appList })
    /** fees associated with akita social */
    socialFees = GlobalState<SocialFees>({ key: AkitaDAOGlobalStateKeys.socialFees });
    /** fees associated with staking assets */
    stakingFees = GlobalState<StakingFees>({ key: AkitaDAOGlobalStateKeys.stakingFees });
    /** fees associated with subscriptions */
    subscriptionFees = GlobalState<SubscriptionFees>({ key: AkitaDAOGlobalStateKeys.subscriptionFees });
    /** fees associated with NFT sales */
    nftFees = GlobalState<NFTFees>({ key: AkitaDAOGlobalStateKeys.nftFees });
    /**
     * The percentage of total rewards allocated to krby expressed in the hundreds
     * eg. 3% is 300, 12.75% is 1275
     * 
    */
    krbyPercentage = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeys.krbyPercentage });
    /** moderator fee */
    moderatorPercentage = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeys.moderatorPercentage });
    /** the akita assets */
    akitaAssets = GlobalState<AkitaAssets>({ key: AkitaDAOGlobalStateKeys.akitaAssets });

    // internal state variables
    proposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeys.proposalSettings });

    /** revocation msig */
    revocationAddress = GlobalState<Account>({ key: AkitaDAOGlobalStateKeys.revocationAddress });
    /** the next proposal id */
    proposalID = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeys.proposalID });
    /** the daily disbursement cursor */
    disbursementCursor = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeys.disbursementCursor });


    /** voting state of a proposal */
    proposals = BoxMap<uint64, ProposalDetails>({ keyPrefix: 'p' });

    /**
     * Group hashes that the DAO has approved to be submitted
     */
    executions = BoxMap<ExecutionKey, ExecutionInfo>({ keyPrefix: 'e' });

    private newProposalID(): uint64 {
        const id = this.proposalID.value;
        this.proposalID.value += 1;
        return id;
    }

    createApplication(): void {
        // TODO: Add the optin plugin immediately
    }

    @abimethod({ allowActions: ['UpdateApplication'] })
    updateApplication(): void {

    }

    init(
        version: arc4.Str,
        akta: arc4.UintN64,
        contentPolicy: arc4.StaticBytes<36>,
        minimumRewardsImpact: arc4.UintN64,
        fees: arc4Fees,
        proposalSettings: arc4ProposalSettings,
        revocationAddress: arc4.Address,
    ): void {
        assert(this.version.value.length === 0, errs.ALREADY_INITIALIZED);
        assert(version.native !== '', errs.VERSION_CANNOT_BE_EMPTY);

        const bonesCreateTxn = itxn.assetConfig({
            configAsset: 0,
            assetName: Bytes('Bones'),
            unitName: Bytes('BONES'),
            total: 100_000_000_000_000,
            decimals: 2,
            manager: Global.currentApplicationAddress,
            reserve: Global.currentApplicationAddress,
            freeze: Global.zeroAddress,
            clawback: Global.zeroAddress,
            defaultFrozen: false,
            url: Bytes(''), // TODO: figure out the URL we should have here
            metadataHash: Bytes(''), // TODO: figure out the metadata hash we should have here
        }).submit();

        const bones = bonesCreateTxn.createdAsset;

        this.status.value = STATUS_INIT;
        this.version.value = version.native;
        this.contentPolicy.value = contentPolicy.native;
        this.minimumRewardsImpact.value = minimumRewardsImpact.native;
        this.socialFees.value = {
            postFee: fees.postFee.native,
            reactFee: fees.reactFee.native,
            impactTaxMin: fees.impactTaxMin.native,
            impactTaxMax: fees.impactTaxMax.native,
        };
        this.stakingFees.value = {
            rewardsFee: fees.rewardsFee.native,
            poolCreationFee: fees.poolCreationFee.native,
        };
        this.subscriptionFees.value = {
            serviceCreationFee: fees.subscriptionServiceCreationFee.native,
            paymentPercentage: fees.subscriptionPaymentPercentage.native,
            triggerPercentage: fees.subscriptionTriggerPercentage.native,
        };
        this.nftFees.value = {
            omnigemSaleFee: fees.omnigemSaleFee.native,
            marketplaceSalePercentageMinimum: fees.marketplaceSalePercentageMinimum.native,
            marketplaceSalePercentageMaximum: fees.marketplaceSalePercentageMaximum.native,
            marketplaceComposablePercentage: fees.marketplaceComposablePercentage.native,
            shuffleSalePercentage: fees.shuffleSalePercentage.native,
            auctionSalePercentageMinimum: fees.auctionSalePercentageMinimum.native,
            auctionSalePercentageMaximum: fees.auctionSalePercentageMaximum.native,
            auctionComposablePercentage: fees.auctionComposablePercentage.native,
        };
        this.krbyPercentage.value = fees.krbyPercentage.native;
        this.moderatorPercentage.value = fees.moderatorPercentage.native;
        this.proposalSettings.value = {
            minimumProposalThreshold: proposalSettings.minimumProposalThreshold.native,
            minimumVoteThreshold: proposalSettings.minimumVoteThreshold.native,
        }
        this.akitaAssets.value = {
            akta: Asset(akta.native),
            bones: bones,
        };
        this.revocationAddress.value = revocationAddress.native;
        this.proposalID.value = 0;
    }

    newProposal(proposalType: uint64): void {
        const id = this.newProposalID();


    }

    createDailyDisbursement(): void {

        // calc the amount to distribute
        // const bonesAmount = this.app.address.assetBalance(this.bonesID.value);
        const [bonesAmount] = AssetHolding.assetBalance(Global.currentApplicationAddress, this.akitaAssets.value.bones);


        // const krbyFee = (amount * this.krbyPercentage.value) - 1 / 10_000 + 1;
        // const modFee = (amount * this.moderatorPercentage.value) - 1 / 10_000 + 1;

        // distribute to krby

        // distribute to moderators

        // distribute to stakers
    }

    receivePayment(payment: gtxn.PaymentTxn): void {
        assert(payment.receiver === Global.currentApplicationAddress, errs.INVALID_RECEIVE_PAYMENT);
        // TODO: track the payment in some way
    }
 
    receiveAsaPayment(xfer: gtxn.AssetTransferTxn): void {
        assert(xfer.assetReceiver === Global.currentApplicationAddress, errs.INVALID_RECEIVE_PAYMENT);
    }

    getState(): AkitaDAOState {
        return {
            status: new arc4.UintN64(this.status.value),
            version: new arc4.Str(this.version.value),
            contentPolicy: new arc4.StaticBytes<36>(this.contentPolicy.value),
            minimumRewardsImpact: new arc4.UintN64(this.minimumRewardsImpact.value),
            appList: new arc4AppList({
                vrfBeacon: new arc4.UintN64(this.appList.value.vrfBeacon.id),
                social: new arc4.UintN64(this.appList.value.social.id),
                impact: new arc4.UintN64(this.appList.value.impact.id),
                staking: new arc4.UintN64(this.appList.value.staking.id),
                rewards: new arc4.UintN64(this.appList.value.rewards.id),
                pool: new arc4.UintN64(this.appList.value.pool.id),
                subscriptions: new arc4.UintN64(this.appList.value.subscriptions.id),
                gate: new arc4.UintN64(this.appList.value.gate.id),
                nfdRegistry: new arc4.UintN64(this.appList.value.nfdRegistry.id),
                nfd: new arc4.UintN64(this.appList.value.nfd.id),
                auction: new arc4.UintN64(this.appList.value.auction.id),
                hyperSwap: new arc4.UintN64(this.appList.value.hyperSwap.id),
                raffle: new arc4.UintN64(this.appList.value.raffle.id),
                metaMerkles: new arc4.UintN64(this.appList.value.metaMerkles.id),
                marketplace: new arc4.UintN64(this.appList.value.marketplace.id),
            }),
            socialFees: new arc4SocialFees({
                postFee: new arc4.UintN64(this.socialFees.value.postFee),
                reactFee: new arc4.UintN64(this.socialFees.value.reactFee),
                impactTaxMin: new arc4.UintN64(this.socialFees.value.impactTaxMin),
                impactTaxMax: new arc4.UintN64(this.socialFees.value.impactTaxMax),
            }),
            stakingFees: new arc4StakingFees({
                rewardsFee: new arc4.UintN64(this.stakingFees.value.rewardsFee),
                poolCreationFee: new arc4.UintN64(this.stakingFees.value.poolCreationFee),
            }),
            subscriptionFees: new arc4SubscriptionFees({
                serviceCreationFee: new arc4.UintN64(this.subscriptionFees.value.serviceCreationFee),
                paymentPercentage: new arc4.UintN64(this.subscriptionFees.value.paymentPercentage),
                triggerPercentage: new arc4.UintN64(this.subscriptionFees.value.triggerPercentage),
            }),
            nftFees: new arc4NFTFees({
                omnigemSaleFee: new arc4.UintN64(this.nftFees.value.omnigemSaleFee),
                marketplaceSalePercentageMinimum: new arc4.UintN64(this.nftFees.value.marketplaceSalePercentageMinimum),
                marketplaceSalePercentageMaximum: new arc4.UintN64(this.nftFees.value.marketplaceSalePercentageMaximum),
                marketplaceComposablePercentage: new arc4.UintN64(this.nftFees.value.marketplaceComposablePercentage),
                shuffleSalePercentage: new arc4.UintN64(this.nftFees.value.shuffleSalePercentage),
                auctionSalePercentageMinimum: new arc4.UintN64(this.nftFees.value.auctionSalePercentageMinimum),
                auctionSalePercentageMaximum: new arc4.UintN64(this.nftFees.value.auctionSalePercentageMaximum),
                auctionComposablePercentage: new arc4.UintN64(this.nftFees.value.auctionComposablePercentage),
            }),
            krbyPercentage: new arc4.UintN64(this.krbyPercentage.value),
            moderatorPercentage: new arc4.UintN64(this.moderatorPercentage.value),
            proposalSettings: new arc4ProposalSettings({
                minimumProposalThreshold: new arc4.UintN64(this.proposalSettings.value.minimumProposalThreshold),
                minimumVoteThreshold: new arc4.UintN64(this.proposalSettings.value.minimumVoteThreshold),
            }),
            akitaAssets: new arc4AkitaAssets({
                akta: new arc4.UintN64(this.akitaAssets.value.akta.id),
                bones: new arc4.UintN64(this.akitaAssets.value.bones.id),
            }),
            revocationAddress: new arc4.Address(this.revocationAddress.value),
        }
    }
}