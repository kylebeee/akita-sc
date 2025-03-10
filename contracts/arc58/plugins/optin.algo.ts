import { Account, Application, Asset, Bytes, Contract, Global, assert, gtxn, op, itxn, abimethod } from "@algorandfoundation/algorand-typescript";
import { AbstractAccountGlobalStateKeysControlledAddress } from "../constants";

export class OptInPlugin extends Contract {

  @abimethod({ onCreate: 'require' })
  createApplication(): void {}

  optInToAsset(sender: Application, rekeyBack: boolean, asset: Asset, mbrPayment: gtxn.PaymentTxn): void {
    const [controlledAccountBytes] = op.AppGlobal.getExBytes(sender, Bytes(AbstractAccountGlobalStateKeysControlledAddress));
    const controlledAccount = Account(Bytes(controlledAccountBytes));

    assert(mbrPayment.amount >= Global.assetOptInMinBalance, 'asset mismatch');

    itxn
      .assetTransfer({
        sender: controlledAccount,
        assetReceiver: controlledAccount,
        assetAmount: 0,
        xferAsset: asset,
        rekeyTo: rekeyBack ? sender.address : Global.zeroAddress,
        fee: 0,
      })
      .submit();
  }
}
