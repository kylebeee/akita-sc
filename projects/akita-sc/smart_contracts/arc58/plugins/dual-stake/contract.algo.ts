import { abimethod, Application, assert, Bytes, GlobalState, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript"
import { abiCall, Contract, methodSelector } from '@algorandfoundation/algorand-typescript/arc4';
import { DualStake } from '../../../utils/types/dual-stake';
import { submitGroup } from '@algorandfoundation/algorand-typescript/itxn';
import { ERR_NOT_A_DUALSTAKE_APP, ERR_NOT_ENOUGH_OF_ASA } from './errors';
import { DualStakeGlobalStateKeyAsaID, DualStakeGlobalStateKeyRatePrecision, DualStakePluginGlobalStateKey } from './constants';
import { getSpendingAccount, rekeyAddress } from '../../../utils/functions';

export class DualStakePlugin extends Contract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registry = GlobalState<Application>({ key: DualStakePluginGlobalStateKey })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  createApplication(registry: uint64): void {
    this.registry.value = Application(registry)
  }

  // DUAL STAKE PLUGIN METHODS --------------------------------------------------------------------

  mint(walletID: uint64, rekeyBack: boolean, dsAppID: uint64, amount: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const dsApp = Application(dsAppID)

    assert(this.registry.value.address === dsApp.creator, ERR_NOT_A_DUALSTAKE_APP)

    const paymentTxn = itxn.payment({
      sender,
      receiver: dsApp.address,
      amount: amount,
      fee: 0,
    })

    const mintTxn = itxn.applicationCall({
      sender,
      appId: dsAppID,
      appArgs: [methodSelector(DualStake.prototype.mint)],
      fee: 0,
    })

    const rate = abiCall(
      DualStake.prototype.get_rate,
      { sender, fee: 0 }
    ).returnValue

    if (rate > 0) {
      const asaID = op.AppGlobal.getExUint64(dsAppID, Bytes(DualStakeGlobalStateKeyAsaID))[0]
      const precision = op.AppGlobal.getExUint64(dsAppID, Bytes(DualStakeGlobalStateKeyRatePrecision))[0]
      const asaAmount = op.divw(...op.mulw(amount, rate), precision)

      const [holdings, isOptedIn] = op.AssetHolding.assetBalance(sender, asaID)
      assert(isOptedIn && holdings >= asaAmount, ERR_NOT_ENOUGH_OF_ASA)

      const asaTxn = itxn.assetTransfer({
        sender,
        assetReceiver: dsApp.address,
        assetAmount: asaAmount,
        xferAsset: asaID,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      })

      submitGroup(paymentTxn, mintTxn, asaTxn)
      return
    }

    // if the rate is 0 we can skip the asset transfer
    // which means we need to set the rekeyTo on the mint txn
    mintTxn.set({ rekeyTo: rekeyAddress(rekeyBack, wallet) })
    submitGroup(paymentTxn, mintTxn)
  }

  redeem(walletID: uint64, rekeyBack: boolean, dsAppID: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const dsApp = Application(dsAppID)

    assert(this.registry.value.address === dsApp.creator, ERR_NOT_A_DUALSTAKE_APP)

    abiCall(
      DualStake.prototype.redeem,
      {
        sender,
        appId: dsAppID,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }
}
