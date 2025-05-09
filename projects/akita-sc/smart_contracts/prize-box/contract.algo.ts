import {
  Contract,
  abimethod,
  Account,
  assert,
  Global,
  GlobalState,
  itxn,
  Txn,
  uint64,
  assertMatch,
  gtxn,
  BoxMap,
} from '@algorandfoundation/algorand-typescript'
import { AssetHolding } from '@algorandfoundation/algorand-typescript/op'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'
import { ERR_INVALID_ASSET, ERR_NOT_EMPTY, ERR_NOT_OWNER } from './errors'
import { AssetInfo } from './types'
import { PrizeBoxGlobalStateKeyHeldCount, PrizeBoxGlobalStateKeyOptinCount, PrizeBoxGlobalStateKeyOwner, PrizeBoxGlobalStateKeyRoyaltyAverage } from './constants'
import { ERR_INVALID_PAYMENT } from '../utils/errors'

export class PrizeBox extends Contract {
  /** the owner of the box of prizes */
  owner = GlobalState<Account>({ key: PrizeBoxGlobalStateKeyOwner })
  /** the current count of prizes opted in */
  optinCount = GlobalState<uint64>({ key: PrizeBoxGlobalStateKeyOptinCount })
  /** the amount of assets actually held by the contract */
  heldCount = GlobalState<uint64>({ key: PrizeBoxGlobalStateKeyHeldCount })
  /** the average of all royalties set for the assets held */
  royaltyAverage = GlobalState<uint64>({ key: PrizeBoxGlobalStateKeyRoyaltyAverage })

  weights = BoxMap<uint64, uint64>({ keyPrefix: 'w' })

  @abimethod({ onCreate: 'require' })
  createApplication(owner: Address): void {
    this.owner.value = owner.native
    this.optinCount.value = 0
  }

  /**
   * optin tells the contract to opt into an asa
   * @param payment The payment transaction
   * @param asset The asset to be opted into
   */
  optin(payment: gtxn.PaymentTxn, asset: uint64): void {
    assert(Txn.sender === this.owner.value, ERR_NOT_OWNER)
    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: Global.assetOptInMinBalance,
      },
      ERR_INVALID_PAYMENT
    )

    itxn
      .assetTransfer({
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: 0,
        xferAsset: asset,
        fee: 0,
      })
      .submit()

    this.optinCount.value += 1
  }

  transfer(newOwner: Address): void {
    assert(Txn.sender === this.owner.value, ERR_NOT_OWNER)
    this.owner.value = newOwner.native
  }

  withdraw(assets: AssetInfo[]): void {
    assert(Txn.sender === this.owner.value, ERR_NOT_OWNER)

    for (let i: uint64 = 0; i < assets.length; i += 1) {
      if (assets[i].asset !== 0) {
        const [assetHolding, optedIn] = AssetHolding.assetBalance(
          Global.currentApplicationAddress,
          assets[i].asset
        )
        assert(optedIn, ERR_INVALID_ASSET)

        const closeOut = assetHolding === assets[i].amount
        if (closeOut) {
          this.optinCount.value -= 1

          itxn
            .assetTransfer({
              xferAsset: assets[i].asset,
              assetAmount: assets[i].amount,
              assetReceiver: this.owner.value,
              assetCloseTo: this.owner.value,
              fee: 0,
            })
            .submit()
        } else {
          itxn
            .assetTransfer({
              xferAsset: assets[i].asset,
              assetAmount: assets[i].amount,
              assetReceiver: this.owner.value,
              fee: 0,
            })
            .submit()
        }
      } else {
        itxn
          .payment({
            amount: assets[i].amount,
            receiver: this.owner.value,
          })
          .submit()
      }
    }
  }

  @abimethod({ allowActions: 'DeleteApplication' })
  deleteApplication(): void {
    assert(Txn.sender === this.owner.value, ERR_NOT_OWNER)
    assert(this.optinCount.value === 0, ERR_NOT_EMPTY)
    itxn
      .payment({ closeRemainderTo: this.owner.value })
      .submit()
  }
}
