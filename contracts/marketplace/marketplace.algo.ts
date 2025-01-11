import { ContractWithOptIn } from '../../utils/base_contracts/optin.algo';
import { MetaMerkles } from '../meta_merkles/meta_merkles.algo';
import { AkitaAppIDsMetaMerkles } from '../../utils/constants';
import { Listing } from './listing.algo';

const errs = {
  PRICE_TOO_LOW: 'Lowest price is 4 units for divisibility',
  MARKETPLACE_NOT_OPTED_INTO_PAYMENT_ASSET: 'Marketplace must be opted into payment asset',
  NOT_A_LISTING: 'Not a listing contract',
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
const marketplaceRoyaltiesSingleSideMaximum = 500;

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
    expirationRound: uint64,
    reservedFor: Address,
    gateID: uint64,
  ): AppID {
    const isAlgoPayment = paymentAsset.id === 0;

    if (!isAlgoPayment) {
      assert(this.app.address.isOptedInToAsset(paymentAsset), errs.MARKETPLACE_NOT_OPTED_INTO_PAYMENT_ASSET);
    }

    const optinMBR = isAlgoPayment
      ? (globals.assetOptInMinBalance)
      : (globals.assetOptInMinBalance * 2);

    let childContractMBR = (
      100_000
      + (28_500 * Listing.schema.global.numUint)
      + (50_000 * Listing.schema.global.numByteSlice)
      + optinMBR
    );

    // ensure they paid enough to cover the contract mint + mbr costs
    verifyPayTxn(payment, {
      amount: childContractMBR,
      receiver: this.app.address
    });

    // make sure they actually send the asset they want to sell
    verifyAssetTransferTxn(assetXfer, {
      assetAmount: { greaterThan: 0 },
      assetReceiver: this.app.address
    });

    /* the lowest unit sale is 4 
     * because of the number of addresses to pay
     * whenever this gets sold
    */
    assert(price >= 4, errs.PRICE_TOO_LOW)

    let creatorRoyalty = 0;
    if (proof.length > 0) {
      // fetch the royalty set for the asset being sold
      const encodedCreatorRoyalty = sendMethodCall<typeof MetaMerkles.prototype.verifiedRead>({
        applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
        methodArgs: [
          assetXfer.xferAsset.creator,
          name,
          sha256(sha256(itob(assetXfer.xferAsset.id))),
          proof,
          1,
          'royalty'
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

    if (marketplaceRoyalties > marketplaceRoyaltiesSingleSideMaximum) {
      marketplaceRoyalties = marketplaceRoyaltiesSingleSideMaximum
    }

    // mint listing contract
    // initialize child
    this.pendingGroup.addMethodCall<typeof Listing.prototype.createApplication, void>({
      methodArgs: [
        assetXfer.xferAsset,
        this.txn.sender,
        price,
        paymentAsset,
        creatorRoyalty,
        marketplace,
        marketplaceRoyalties,
        expirationRound,
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

    // optin child contract to sale asset
    this.pendingGroup.addMethodCall<typeof Listing.prototype.optin, void>({
      applicationID: listingAppID,
      methodArgs: [
        {
          receiver: listingAppID.address,
          amount: globals.assetOptInMinBalance,
          fee: 0,
        },
        assetXfer.xferAsset
      ],
      fee: 0,
    });

    // xfer asset to child
    this.pendingGroup.addAssetTransfer({
      assetReceiver: listingAppID.address,
      assetAmount: assetXfer.assetAmount,
      xferAsset: assetXfer.xferAsset,
      fee: 0,
    });

    if (!isAlgoPayment) {
      // optin child contract to payment asset
      this.pendingGroup.addMethodCall<typeof Listing.prototype.optin, void>({
        applicationID: listingAppID,
        methodArgs: [
          {
            receiver: listingAppID.address,
            amount: globals.assetOptInMinBalance,
            fee: 0,
          },
          paymentAsset
        ],
        fee: 0,
      });
    }
    
    this.pendingGroup.submit();

    return listingAppID;
  }

  purchase(
    payment: PayTxn,
    appID: AppID,
    marketplace: Address,
    args: bytes[]
  ): void {
    assert(appID.creator === this.app.address, errs.NOT_A_LISTING);
    verifyPayTxn(payment, { receiver: this.app.address });

    sendMethodCall<typeof Listing.prototype.purchase>({
      onCompletion: OnCompletion.DeleteApplication,
      applicationID: appID,
      methodArgs: [
        {
          receiver: appID.address,
          amount: payment.amount,
          fee: 0,
        },
        this.txn.sender,
        marketplace,
        args
      ],
      fee: 0,
    });
  }

  purchaseAsa(
    assetXfer: AssetTransferTxn,
    appID: AppID,
    marketplace: Address,
    args: bytes[]
  ): void {
    assert(appID.creator === this.app.address, errs.NOT_A_LISTING);
    verifyAssetTransferTxn(assetXfer, { assetReceiver: this.app.address });

    sendMethodCall<typeof Listing.prototype.purchaseAsa>({
      applicationID: appID,
      methodArgs: [
        {
          assetReceiver: appID.address,
          assetAmount: assetXfer.assetAmount,
          xferAsset: assetXfer.xferAsset,
          fee: 0,
        },
        this.txn.sender,
        marketplace,
        args
      ],
      fee: 0
    });
  }

  delist(appID: AppID): void {
    assert(appID.creator === this.app.address, errs.NOT_A_LISTING);

    sendMethodCall<typeof Listing.prototype.delist>({
      applicationID: appID,
      methodArgs: [this.txn.sender],
      onCompletion: OnCompletion.DeleteApplication,
      fee: 0,
    });
  }
}
