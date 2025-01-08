import { ContractWithOptIn } from '../../utils/base_contracts/optin.algo';
import { Auction } from './auction.algo';
import { MetaMerkles } from '../meta_merkles/meta_merkles.algo';
import { AkitaAppIDsMetaMerkles } from '../../utils/constants';

export class AuctionFactory extends ContractWithOptIn {
    /** Target AVM 10 */
    programVersion = 10;

    /**
     * creates a new auction contract with the provided settings
     * 
     * @param pmt payment for the increased mbr of the auction factory contract
     * @param assetXfer asset transfer for the asa thats being auctioned off
     * @param proof the proof for the asset in the merkle group
     * @param hashedRoot the root of the merkle tree were going to verify the royalty % against
     * @param start the unix timestamp for the auction to start
     * @param end the unix timestamp for the auction to end
     * @param paymentAsset the asset to take payment in
     * @param marketplaceRoyalties the royalty % the marketplace will take ( up to 5 % )
     * @param startingBid the starting bid amount of the auction
     * @param biddingFee the fee to take for each bid to raffle to a lucky participant
     * @param minBidIncrease the minimum amount each bid must increase the amount in order to be considered
     */
    new(
        payment: PayTxn,
        assetXfer: AssetTransferTxn,
        proof: string,
        start: uint64,
        end: uint64,
        paymentAsset: AssetID,
        marketplace: Address,
        marketplaceRoyalties: uint64,
        startingBid: uint64,
        biddingFee: uint64,
        minBidIncrease: uint64,
        gateID: uint64,
    ): void {

        const isAlgoPayment = paymentAsset.id === 0;

        let childContractMBR = (
            300_000
            + (28_500 * Auction.schema.global.numUint)
            + (50_000 * Auction.schema.global.numByteSlice)
        );

        // if its an asa auction we need to add an additional asset optin
        // to the child contract for it to be able to accept payment
        if (isAlgoPayment) {
            childContractMBR += globals.assetOptInMinBalance
        }

        // ensure they paid enough to cover the contract mint + mbr costs
        verifyPayTxn(payment, {
            amount: childContractMBR,
            receiver: this.app.address,
        })

        // make sure they actually sent the asset they want to sell
        verifyAssetTransferTxn(assetXfer, {
            assetAmount: { greaterThan: 0 },
            assetReceiver: this.app.address,
        });

        /* this means the maximum fee is 60%
         * at first i thought 15% max was reasonable
         * but loafpickle pointed out free mints with
         * high royalties are a good use case
         * marketplaceRoyalties are double sided
         * listing interface can take a fee & so
         * can selling interface
        */
        const creatorRoyaltyCap = 50;
        const marketplaceRoyaltyCap = 5;

        assert(marketplaceRoyalties <= marketplaceRoyaltyCap);

        // TODO: figure out how to gracefully fail the verified read, the creator having a set royalty shouldn't be a prequisite to this working

        // fetch the royalties set for the asset being sold
        const encodedRoyalty = sendMethodCall<typeof MetaMerkles.prototype.verifiedRead>({
            applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
            methodArgs: [
                assetXfer.xferAsset.creator,
                name,
                sha256(sha256(itob(assetXfer.xferAsset))),
                proof,
                1,
                'royalty',
            ],
        });

        let royalty = btoi(encodedRoyalty)
        if (royalty > creatorRoyaltyCap) {
            royalty = 50
        }

        // mint auction contract
        sendAppCall({
            approvalProgram: Auction.approvalProgram(),
            clearStateProgram: Auction.clearProgram(),
            globalNumUint: 6, // TODO: double check num values
            globalNumByteSlice: 4,
            fee: 0,
        });

        const child = this.itxn.createdApplicationID!;

        // optin child contract to asset (we can use the AuctionBase)
        this.pendingGroup.addMethodCall<typeof Auction.prototype.optin, void>({
            applicationID: child,
            methodArgs: [
                // mbr (including optin) to child
                {
                    receiver: child.address,
                    amount: payment.amount - childContractMBR,
                    fee: 0,
                },
                assetXfer.xferAsset
            ],
            fee: 0,
            isFirstTxn: true,
        });

        // send it the asset to auction off
        this.pendingGroup.addAssetTransfer({
            assetReceiver: child.address,
            assetAmount: assetXfer.assetAmount,
            xferAsset: assetXfer.xferAsset,
            fee: 0,
        });

        this.pendingGroup.addMethodCall<typeof Auction.prototype.init, void>({
            applicationID: child,
            methodArgs: [
                assetXfer.xferAsset,
                this.txn.sender,
                start,
                end,
                minBidIncrease,
                royalty,
                marketplace,
                marketplaceRoyalties,
                startingBid,
                biddingFee,
            ]
        });

        this.pendingGroup.submit();
    }
}
