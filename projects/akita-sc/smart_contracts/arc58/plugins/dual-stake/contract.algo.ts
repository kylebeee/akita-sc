import { abimethod, Application, assert, Bytes, GlobalState, itxn, itxnCompose, op, uint64 } from "@algorandfoundation/algorand-typescript"
import { abiCall, Contract } from '@algorandfoundation/algorand-typescript/arc4';
import { DualStake } from '../../../utils/types/dual-stake';
import { ERR_NOT_A_DUALSTAKE_APP, ERR_NOT_ENOUGH_OF_ASA } from './errors';
import { DualStakeGlobalStateKeyAsaID, DualStakeGlobalStateKeyRatePrecision, DualStakePluginGlobalStateKey } from './constants';
import { getSpendingAccount, rekeyAddress } from '../../../utils/functions';

export class DualStakePlugin extends Contract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registry = GlobalState<Application>({ key: DualStakePluginGlobalStateKey })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(registry: uint64): void {
    this.registry.value = Application(registry)
  }

  // DUAL STAKE PLUGIN METHODS --------------------------------------------------------------------

  mint(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    amount: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(this.registry.value.address === appId.creator, ERR_NOT_A_DUALSTAKE_APP)

    itxnCompose.begin(
      itxn.payment({
        sender,
        receiver: appId.address,
        amount: amount
      })
    )

    const rate = abiCall<typeof DualStake.prototype.get_rate>({ sender }).returnValue

    if (rate > 0) {

      itxnCompose.next(
        DualStake.prototype.mint,
        { sender, appId }
      )

      const asaID = op.AppGlobal.getExUint64(appId, Bytes(DualStakeGlobalStateKeyAsaID))[0]
      const precision = op.AppGlobal.getExUint64(appId, Bytes(DualStakeGlobalStateKeyRatePrecision))[0]
      const asaAmount = op.divw(...op.mulw(amount, rate), precision)

      const [holdings, isOptedIn] = op.AssetHolding.assetBalance(sender, asaID)
      assert(isOptedIn && holdings >= asaAmount, ERR_NOT_ENOUGH_OF_ASA)

      itxnCompose.next(
        itxn.assetTransfer({
          sender,
          assetReceiver: appId.address,
          assetAmount: asaAmount,
          xferAsset: asaID,
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        })
      )

      itxnCompose.submit()
      return
    }

    // if the rate is 0 we can skip the asset transfer
    // which means we need to set the rekeyTo on the mint txn
    itxnCompose.next(
      DualStake.prototype.mint,
      {
        sender,
        appId,
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )

    itxnCompose.submit()
  }

  redeem(wallet: Application, rekeyBack: boolean, appId: Application): void {
    const sender = getSpendingAccount(wallet)

    assert(this.registry.value.address === appId.creator, ERR_NOT_A_DUALSTAKE_APP)

    abiCall<typeof DualStake.prototype.redeem>({
      sender,
      appId,
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }
}
