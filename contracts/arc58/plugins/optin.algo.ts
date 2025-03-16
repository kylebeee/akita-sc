import { Account, Application, Asset, Bytes, Contract, Global, assert, gtxn, op, itxn, abimethod, uint64 } from "@algorandfoundation/algorand-typescript";
import { AbstractAccountGlobalStateKeysControlledAddress } from "../constants";

export class OptInPlugin extends Contract {

  // @ts-ignore
  @abimethod({ onCreate: 'require' })
  createApplication(): void {}

  private getControlledAccount(app: Application): Account {
    const [controlledAccountBytes] = op.AppGlobal.getExBytes(app, Bytes(AbstractAccountGlobalStateKeysControlledAddress))
    return Account(Bytes(controlledAccountBytes))
  }

  optInToAsset(sender: uint64, rekeyBack: boolean, asset: uint64, mbrPayment: gtxn.PaymentTxn): void {
    const controlledAccount = this.getControlledAccount(Application(sender));

    assert(!controlledAccount.isOptedIn(Asset(asset)), 'asset already opted in');
    assert(mbrPayment.amount >= Global.assetOptInMinBalance, 'asset mismatch');

    itxn
      .assetTransfer({
        sender: controlledAccount,
        assetReceiver: controlledAccount,
        assetAmount: 0,
        xferAsset: asset,
        rekeyTo: rekeyBack ? Application(sender).address : Global.zeroAddress,
        fee: 0,
      })
      .submit();
  }
}
