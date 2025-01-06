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

    sendAssetTransfer({
      sender: sender.address,
      assetReceiver: sender.address,
      assetAmount: 0,
      xferAsset: asset,
      rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
      fee: 0,
    });
  }
}
