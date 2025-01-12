import { ContractWithOptIn } from '../../utils/base_contracts/optin.algo';
import { Auction, weightsListMBR } from './auction.algo';
import { MetaMerkles } from '../meta_merkles/meta_merkles.algo';
import { AkitaAppIDsMetaMerkles } from '../../utils/constants';
import { AKITA_DAO_VRF_BEACON_APP_ID_KEY } from '../dao/constants';

const errs = {
    NOT_AKITA_DAO: 'Only the Akita DAO can call this function',
    BIDS_MUST_ALWAYS_INCREASE: 'bids must always increase',
    MARKETPLACE_NOT_OPTED_INTO_PAYMENT_ASSET: 'Marketplace must be opted into payment asset',
    ENDING_MUST_BE_ONE_HUNDRED_ROUNDS_AFTER_STARTING: 'ending round must be at least 100 rounds after starting',
    APP_CREATOR_NOT_FOUND: 'App creator not found',
}

/**
 * this means the maximum fee is 60%
 * at first i thought 15% max was reasonable
 * but loafpickle pointed out free mints with
 * high royalties are a good use case
 * marketplaceRoyalty are double sided
 * listing interface can take a fee & so
 * can selling interface, listing side sets
 * the fee and maxes out at 5% so 10% marketplace
 * fee total limit
 */
const creatorRoyaltyDefault = 500;
const creatorRoyaltyMaximum = 5000;

export const appCreatorsMBR = 18_500;
export type AppCreatorKey = {
    address: Address;
    appID: AppID;
}

export class AuctionFactory extends ContractWithOptIn {

    /** the version of the child contract */
    childContractVersion = GlobalStateKey<string>({ key: 'child_contract_version' });
    /** The App ID of the Akita DAO contract */
    akitaDaoAppID = TemplateVar<AppID>();

    appCreators = BoxMap<AppCreatorKey, uint64>();

    createApplication(version: string): void {
        this.childContractVersion.value = version;
    }

    updateApplication(): void {
        assert(this.txn.sender === this.akitaDaoAppID.address, errs.NOT_AKITA_DAO);
    }

    new(
        payment: PayTxn,
        assetXfer: AssetTransferTxn,
        name: string,
        proof: bytes<32>[],
        bidAsset: AssetID,
        bidFee: uint64,
        startingBid: uint64,
        bidMinimumIncrease: uint64,
        startingRound: uint64,
        endingRound: uint64,
        marketplace: Address,
        gateID: uint64,
        weightsListCount: uint64,
    ): AppID {
        assert(bidMinimumIncrease > 0, errs.BIDS_MUST_ALWAYS_INCREASE);
        assert(endingRound > startingRound + 100, errs.ENDING_MUST_BE_ONE_HUNDRED_ROUNDS_AFTER_STARTING);

        const isAlgoBid = bidAsset.id === 0;

        const optinMBR = isAlgoBid
            ? (globals.assetOptInMinBalance)
            : (globals.assetOptInMinBalance * 2);

        let childContractMBR = (
            100_000
            + (28_500 * Auction.schema.global.numUint)
            + (50_000 * Auction.schema.global.numByteSlice)
            + optinMBR
            + (weightsListCount * weightsListMBR)
            + appCreatorsMBR
        );

        // ensure they paid enough to cover the contract mint + mbr costs
        verifyPayTxn(payment, {
            amount: childContractMBR,
            receiver: this.app.address
        });

        // make sure they actually sent the asset they want to auction
        verifyAssetTransferTxn(assetXfer, {
            assetAmount: { greaterThan: 0 },
            assetReceiver: this.app.address
        });

        let creatorRoyalty = 0;
        if (proof.length > 0) {
            // fetch the royalty set for the asset being sold
            const encodedCreatorRoyalty = sendMethodCall<typeof MetaMerkles.prototype.verifiedRead>({
                applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
                methodArgs: [
                    assetXfer.xferAsset.creator,
                    name,
                    sha256(sha256(itob(assetXfer.xferAsset))),
                    proof,
                    1,
                    'royalty',
                ],
                fee: 0,
            });

            // we fail gracefully if the asset has no royalty set
            if (encodedCreatorRoyalty.length > 0) {
                creatorRoyalty = btoi(encodedCreatorRoyalty)
            } else {
                creatorRoyalty = creatorRoyaltyDefault;
            }
        } else {
            creatorRoyalty = creatorRoyaltyDefault;
        }

        // rather than fail out we just cap the royalty
        // both for the creator & for the marketplaces
        if (creatorRoyalty > creatorRoyaltyMaximum) {
            creatorRoyalty = creatorRoyaltyMaximum
        }

        this.pendingGroup.addMethodCall<typeof Auction.prototype.createApplication, void>({
            methodArgs: [
                this.akitaDaoAppID,
                assetXfer.xferAsset,
                bidAsset,
                bidFee,
                startingBid,
                bidMinimumIncrease,
                startingRound,
                endingRound,
                this.txn.sender,
                creatorRoyalty,
                marketplace,
                gateID,
                this.akitaDaoAppID.globalState(AKITA_DAO_VRF_BEACON_APP_ID_KEY) as AppID,
            ],
            approvalProgram: Auction.approvalProgram(),
            clearStateProgram: Auction.clearProgram(),
            globalNumUint: Auction.schema.global.numUint,
            globalNumByteSlice: Auction.schema.global.numByteSlice,
            extraProgramPages: 0,
            fee: 0,
            isFirstTxn: true,
        });

        const auctionAppID = this.itxn.createdApplicationID;
        this.appCreators({ address: payment.sender, appID: auctionAppID }).value = appCreatorsMBR;

        this.pendingGroup.addMethodCall<typeof Auction.prototype.init, void>({
            applicationID: auctionAppID,
            methodArgs: [
                {
                    receiver: auctionAppID.address,
                    amount: weightsListCount * weightsListMBR,
                    fee: 0,
                },
                weightsListCount
            ],
            fee: 0,
        })

        // optin child contract to asset (we can use the AuctionBase)
        this.pendingGroup.addMethodCall<typeof Auction.prototype.optin, void>({
            applicationID: auctionAppID,
            methodArgs: [
                {
                    receiver: auctionAppID.address,
                    amount: globals.assetOptInMinBalance,
                    fee: 0,
                },
                assetXfer.xferAsset
            ],
            fee: 0,
        });

        // xfer asset to child
        this.pendingGroup.addAssetTransfer({
            assetReceiver: auctionAppID.address,
            assetAmount: assetXfer.assetAmount,
            xferAsset: assetXfer.xferAsset,
            fee: 0,
        });

        if (!isAlgoBid) {
            // optin child contract to bidding asset
            this.pendingGroup.addMethodCall<typeof Auction.prototype.optin, void>({
                applicationID: auctionAppID,
                methodArgs: [
                    {
                        receiver: auctionAppID.address,
                        amount: globals.assetOptInMinBalance,
                        fee: 0,
                    },
                    bidAsset
                ],
                fee: 0,
            });
        }

        this.pendingGroup.submit();

        return auctionAppID;
    }

    clearWeightsBoxes(creator: Address, auctionAppID: AppID): void {
        const keys: AppCreatorKey = { address: creator, appID: auctionAppID };
        assert(this.appCreators(keys).exists, errs.APP_CREATOR_NOT_FOUND);
        
        const returnedAmount = sendMethodCall<typeof Auction.prototype.clearWeightsBoxes, void>({
            applicationID: auctionAppID,
            methodArgs: [],
            fee: 0,
        });

        this.appCreators(keys).value += returnedAmount;
    }

    deleteAuctionApp(creator: Address, auctionAppID: AppID): void {
        const keys: AppCreatorKey = { address: creator, appID: auctionAppID };
        assert(this.appCreators(keys).exists, errs.APP_CREATOR_NOT_FOUND);

        const origMBR = this.app.address.minBalance;
        sendMethodCall<typeof Auction.prototype.deleteApplication, uint64>({
            applicationID: auctionAppID,
            methodArgs: [],
            fee: 0,
        });
        const newMBR = this.app.address.minBalance;

        sendPayment({
            amount: this.appCreators(keys).value + (origMBR - newMBR),
            receiver: creator,
            fee: 0,
        })
    }
}
