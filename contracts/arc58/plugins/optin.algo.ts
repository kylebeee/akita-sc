import { Contract } from '@algorandfoundation/tealscript';

export class OptInPlugin extends Contract {
  programVersion = 10;

  optInToAsset(sender: AppID, rekeyBack: boolean, asset: AssetID, mbrPayment: PayTxn): void {
    verifyPayTxn(mbrPayment, {
      receiver: sender.address,
      amount: {
        greaterThanEqualTo: globals.assetOptInMinBalance,
      },
    });

    if (rekeyBack) {
      sendAssetTransfer({
        sender: sender.address,
        assetReceiver: sender.address,
        assetAmount: 0,
        xferAsset: asset,
        rekeyTo: sender.address,
        fee: 0,
      });
    } else {
      sendAssetTransfer({
        sender: sender.address,
        assetReceiver: sender.address,
        assetAmount: 0,
        xferAsset: asset,
        fee: 0,
      });
    }
  }
}
