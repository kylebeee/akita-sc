import {
    Account,
    arc4,
    assert,
    BoxMap,
    bytes,
    Global,
    GlobalState,
    uint64,
    itxn,
    Bytes,
    Contract,
    abimethod,
    gtxn,
    Asset,
} from '@algorandfoundation/algorand-typescript'
import { AssetHolding } from '@algorandfoundation/algorand-typescript/op'
import { Address, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import {
    AkitaAssets,
    AkitaDAOState,
    AppList,
    arc4AkitaAssets,
    arc4AppList,
    arc4ExecutionInfo,
    arc4Fees,
    arc4NFTFees,
    arc4ProposalDetails,
    arc4ProposalSettings,
    arc4SocialFees,
    arc4StakingFees,
    arc4SubscriptionFees,
    ExecutionInfo,
    ExecutionKey,
    NFTFees,
    ProposalDetails,
    ProposalSettings,
    SocialFees,
    StakingFees,
    SubscriptionFees,
} from './types'

import { ERR_ALREADY_INITIALIZED, ERR_INVALID_RECEIVE_PAYMENT, ERR_VERSION_CANNOT_BE_EMPTY } from './errors'
import {
    AkitaDAOBoxPrefixExecutions,
    AkitaDAOBoxPrefixProposals,
    AkitaDAOGlobalStateKeysAkitaAssets,
    AkitaDAOGlobalStateKeysAppList,
    AkitaDAOGlobalStateKeysContentPolicy,
    AkitaDAOGlobalStateKeysDisbursementCursor,
    AkitaDAOGlobalStateKeysKrbyPercentage,
    AkitaDAOGlobalStateKeysMinimumRewardsImpact,
    AkitaDAOGlobalStateKeysModeratorPercentage,
    AkitaDAOGlobalStateKeysNFTFees,
    AkitaDAOGlobalStateKeysProposalID,
    AkitaDAOGlobalStateKeysProposalSettings,
    AkitaDAOGlobalStateKeysRevocationAddress,
    AkitaDAOGlobalStateKeysSocialFees,
    AkitaDAOGlobalStateKeysStakingFees,
    AkitaDAOGlobalStateKeysStatus,
    AkitaDAOGlobalStateKeysSubscriptionFees,
    STATUS_INIT,
} from './constants'
import { GlobalStateKeyVersion } from '../constants'

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
    status = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysStatus })

    /** the version number of the DAO */
    version = GlobalState<string>({ key: GlobalStateKeyVersion })

    /** the raw 36 byte content policy of the protocol */
    contentPolicy = GlobalState<bytes>({ key: AkitaDAOGlobalStateKeysContentPolicy })

    /** the minimum impact score to qualify for daily disbursement */
    minimumRewardsImpact = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysMinimumRewardsImpact })

    /** the list of akita contract ids */
    appList = GlobalState<arc4AppList>({ key: AkitaDAOGlobalStateKeysAppList })

    /** fees associated with akita social */
    socialFees = GlobalState<arc4SocialFees>({ key: AkitaDAOGlobalStateKeysSocialFees })

    /** fees associated with staking assets */
    stakingFees = GlobalState<arc4StakingFees>({ key: AkitaDAOGlobalStateKeysStakingFees })

    /** fees associated with subscriptions */
    subscriptionFees = GlobalState<arc4SubscriptionFees>({ key: AkitaDAOGlobalStateKeysSubscriptionFees })

    /** fees associated with NFT sales */
    nftFees = GlobalState<arc4NFTFees>({ key: AkitaDAOGlobalStateKeysNFTFees })

    /**
     * The percentage of total rewards allocated to krby expressed in the hundreds
     * eg. 3% is 300, 12.75% is 1275
     *
     */
    krbyPercentage = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysKrbyPercentage })

    /** moderator fee */
    moderatorPercentage = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysModeratorPercentage })

    /** the akita assets */
    akitaAssets = GlobalState<arc4AkitaAssets>({ key: AkitaDAOGlobalStateKeysAkitaAssets })

    // internal state variables
    proposalSettings = GlobalState<arc4ProposalSettings>({ key: AkitaDAOGlobalStateKeysProposalSettings })

    /** revocation msig */
    revocationAddress = GlobalState<Account>({ key: AkitaDAOGlobalStateKeysRevocationAddress })

    /** the next proposal id */
    proposalID = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysProposalID })

    /** the daily disbursement cursor */
    disbursementCursor = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysDisbursementCursor })

    /** voting state of a proposal */
    proposals = BoxMap<uint64, arc4ProposalDetails>({ keyPrefix: AkitaDAOBoxPrefixProposals })

    /**
     * Group hashes that the DAO has approved to be submitted
     */
    executions = BoxMap<ExecutionKey, arc4ExecutionInfo>({ keyPrefix: AkitaDAOBoxPrefixExecutions })

    private newProposalID(): uint64 {
        const id = this.proposalID.value
        this.proposalID.value += 1
        return id
    }

    createApplication(): void {
        // TODO: Add the optin plugin immediately
    }

    // @ts-ignore
    @abimethod({ allowActions: ['UpdateApplication'] })
    updateApplication(): void {}

    init(
        version: arc4.Str,
        akta: arc4.UintN64,
        contentPolicy: arc4.StaticBytes<36>,
        minimumRewardsImpact: arc4.UintN64,
        fees: arc4Fees,
        proposalSettings: arc4ProposalSettings,
        revocationAddress: Address
    ): void {
        assert(this.version.value === '', ERR_ALREADY_INITIALIZED)
        assert(version.native !== '', ERR_VERSION_CANNOT_BE_EMPTY)

        const bonesCreateTxn = itxn
            .assetConfig({
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
            })
            .submit()

        this.status.value = STATUS_INIT
        this.version.value = version.native
        this.contentPolicy.value = contentPolicy.native
        this.minimumRewardsImpact.value = minimumRewardsImpact.native

        this.socialFees.value = new arc4SocialFees({
            postFee: fees.postFee,
            reactFee: fees.reactFee,
            impactTaxMin: fees.impactTaxMin,
            impactTaxMax: fees.impactTaxMax,
        })

        this.stakingFees.value = new arc4StakingFees({
            rewardsFee: fees.rewardsFee,
            poolCreationFee: fees.poolCreationFee,
        })

        this.subscriptionFees.value = new arc4SubscriptionFees({
            serviceCreationFee: fees.subscriptionServiceCreationFee,
            paymentPercentage: fees.subscriptionPaymentPercentage,
            triggerPercentage: fees.subscriptionTriggerPercentage,
        })

        this.nftFees.value = new arc4NFTFees({
            omnigemSaleFee: fees.omnigemSaleFee,
            marketplaceSalePercentageMinimum: fees.marketplaceSalePercentageMinimum,
            marketplaceSalePercentageMaximum: fees.marketplaceSalePercentageMaximum,
            marketplaceComposablePercentage: fees.marketplaceComposablePercentage,
            shuffleSalePercentage: fees.shuffleSalePercentage,
            auctionSalePercentageMinimum: fees.auctionSalePercentageMinimum,
            auctionSalePercentageMaximum: fees.auctionSalePercentageMaximum,
            auctionComposablePercentage: fees.auctionComposablePercentage,
        })

        this.krbyPercentage.value = fees.krbyPercentage.native
        this.moderatorPercentage.value = fees.moderatorPercentage.native

        this.proposalSettings.value = new arc4ProposalSettings({
            minimumProposalThreshold: proposalSettings.minimumProposalThreshold,
            minimumVoteThreshold: proposalSettings.minimumVoteThreshold,
        })

        const bones = new UintN64(bonesCreateTxn.createdAsset.id)
        this.akitaAssets.value = new arc4AkitaAssets({ akta, bones })

        this.revocationAddress.value = revocationAddress.native
        this.proposalID.value = 0
    }

    newProposal(proposalType: uint64): void {
        const id = this.newProposalID()
    }

    createDailyDisbursement(): void {
        // calc the amount to distribute
        // const bonesAmount = this.app.address.assetBalance(this.bonesID.value);
        const [bonesAmount] = AssetHolding.assetBalance(
            Global.currentApplicationAddress,
            this.akitaAssets.value.bones.native
        )

        // const krbyFee = (amount * this.krbyPercentage.value) - 1 / 10_000 + 1;
        // const modFee = (amount * this.moderatorPercentage.value) - 1 / 10_000 + 1;

        // distribute to krby

        // distribute to moderators

        // distribute to stakers
    }

    receivePayment(payment: gtxn.PaymentTxn): void {
        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_RECEIVE_PAYMENT)
        // TODO: track the payment in some way
    }

    receiveAsaPayment(xfer: gtxn.AssetTransferTxn): void {
        assert(xfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_RECEIVE_PAYMENT)
    }

    getState(): AkitaDAOState {
        return {
            status: new UintN64(this.status.value),
            version: new arc4.Str(this.version.value),
            contentPolicy: new arc4.StaticBytes<36>(this.contentPolicy.value),
            minimumRewardsImpact: new UintN64(this.minimumRewardsImpact.value),
            appList: this.appList.value,
            socialFees: this.socialFees.value,
            stakingFees: this.stakingFees.value,
            subscriptionFees: this.subscriptionFees.value,
            nftFees: this.nftFees.value,
            krbyPercentage: new UintN64(this.krbyPercentage.value),
            moderatorPercentage: new UintN64(this.moderatorPercentage.value),
            proposalSettings: this.proposalSettings.value,
            akitaAssets: this.akitaAssets.value,
            revocationAddress: new Address(this.revocationAddress.value),
        }
    }
}
