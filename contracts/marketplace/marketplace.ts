import { ContractWithOptIn } from '../../utils/base_contracts/optin.algo';
import { MetaMerkles } from '../meta_merkles/meta_merkles.algo';
import { AkitaAppIDsMetaMerkles } from '../../utils/constants';
import { Listing } from './listing.algo';

/* this means the maximum fee is 60%
  * at first i thought 15% max was reasonable
  * but loafpickle pointed out free mints with
  * high royalties are a good use case
  * marketplaceRoyalties are double sided
  * listing interface can take a fee & so
  * can selling interface
*/
const creatorRoyaltyCap = 5000;
const marketplaceRoyaltyCap = 500;

export class Marketplace extends ContractWithOptIn {

  list(
    payment: PayTxn,
    assetXfer: AssetTransferTxn,
    price: uint64,
    paymentAsset: AssetID,
    name: string,
    proof: bytes<32>[],
    marketplace: Address,
    marketplaceRoyalties: uint64,
    reservedFor: Address,
    gateID: uint64,
  ): void {

    const isAlgoPayment = paymentAsset.id === 0;

    let childContractMBR = (
      300_000
      + (28_500 * Listing.schema.global.numUint)
      + (50_000 * Listing.schema.global.numByteSlice)
    );

    // if its an asa listing we need to add an additional asset optin
    // to the child contract for it to be able to accept payment
    if (isAlgoPayment) {
      childContractMBR += globals.assetOptInMinBalance
    }

    // ensure they paid enough to cover the contract mint + mbr costs
    verifyPayTxn(payment, {
      amount: childContractMBR,
      receiver: this.app.address,
    })

    // make sure they actually send the asset they want to sell
    verifyAssetTransferTxn(assetXfer, {
      assetReceiver: this.app.address,
      rekeyTo: globals.zeroAddress,
    })

    /* the lowest unit sale is 4 
     * because of the number of addresses to pay
     * whenever this gets sold
    */
    const lowestUnitSale = 4;

    assert(price >= lowestUnitSale)

    let royalty = 0;
    if (proof.length > 0) {
      // fetch the royalties set for the asset being sold
      const encodedRoyalty = sendMethodCall<typeof MetaMerkles.prototype.verifiedRead>({
        applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
        methodArgs: [
          assetXfer.xferAsset.creator,
          name,
          sha256(sha256(itob(assetXfer.xferAsset))),
          proof,
          1,
          'royalty'
        ],
      });

      royalty = btoi(encodedRoyalty)
    }

    if (royalty > creatorRoyaltyCap) {
      royalty = 50
    }

    assert(marketplaceRoyalties <= marketplaceRoyaltyCap);

    // mint listing contract
    // initialize child
    this.pendingGroup.addMethodCall<typeof Listing.prototype.createApplication, void>({
      methodArgs: [
        assetXfer.xferAsset,
        this.txn.sender,
        price,
        paymentAsset,
        royalty,
        marketplace,
        marketplaceRoyalties,
        reservedFor,
        gateID,
      ],
      approvalProgram: Listing.approvalProgram(),
      clearStateProgram: Listing.clearProgram(),
      globalNumUint: Listing.schema.global.numUint,
      globalNumByteSlice: Listing.schema.global.numByteSlice,
      extraProgramPages: 0,
      fee: 0,
      isFirstTxn: true,
    });

    const listingAppID = this.itxn.createdApplicationID;

    // optin child contract to asset
    this.pendingGroup.addMethodCall<typeof Listing.prototype.optin, void>({
      applicationID: listingAppID,
      methodArgs: [
        // mbr (including optin) to child
        {
          receiver: listingAppID.address,
          amount: payment.amount - childContractMBR,
          fee: 0,
        },
        assetXfer.xferAsset
      ]
    });

    // xfer asset to child
    this.pendingGroup.addAssetTransfer({
      assetReceiver: listingAppID.address,
      assetAmount: assetXfer.assetAmount,
      xferAsset: assetXfer.xferAsset,
      fee: 0,
    });

    this.pendingGroup.submit();
  }

  delist(appID: AppID): void {
    sendMethodCall<typeof Listing.prototype.delist>({
      applicationID: appID,
      methodArgs: [this.txn.sender],
      onCompletion: OnCompletion.DeleteApplication
    });
  }

  purchase(): void {

  }
}
