import { Contract, abimethod, Account, arc4, assert, Global, GlobalState, gtxn, itxn, Txn, uint64 } from "@algorandfoundation/algorand-typescript";
import { ERR_INVALID_ASSET, ERR_NOT_EMPTY, ERR_NOT_OWNER } from "./errors";
import { arc4AssetInfo } from "./types";
import { PrizeBoxGlobalStateKeyOptinCount, PrizeBoxGlobalStateKeyOwner } from "./constants";
import { AssetHolding } from "@algorandfoundation/algorand-typescript/op";
import { ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER } from "../../utils/errors";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";

export class PrizeBox extends Contract {
  /** the owner of the box of prizes */
  owner = GlobalState<Account>({ key: PrizeBoxGlobalStateKeyOwner })
  /** the current count of prizes opted in */
  optinCount = GlobalState<uint64>({ key: PrizeBoxGlobalStateKeyOptinCount })

  // @ts-ignore
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
    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(payment.amount === Global.assetOptInMinBalance, ERR_INVALID_PAYMENT_AMOUNT)

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

  withdraw(assets: arc4.DynamicArray<arc4AssetInfo>): void {
    assert(Txn.sender === this.owner.value, ERR_NOT_OWNER)

    for (let i: uint64 = 0; i < assets.length; i += 1) {
      if (assets[i].asset.native !== 0) {
        const [assetHolding, optedIn] = AssetHolding.assetBalance(Global.currentApplicationAddress, assets[i].asset.native)
        assert(optedIn, ERR_INVALID_ASSET)

        const closeOut = assetHolding === assets[i].amount.native
        if (closeOut) {
          this.optinCount.value -= 1

          itxn
            .assetTransfer({
              xferAsset: assets[i].asset.native,
              assetAmount: assets[i].amount.native,
              assetReceiver: this.owner.value,
              assetCloseTo: this.owner.value,
              fee: 0,
            })
            .submit()
        } else {
          itxn
            .assetTransfer({
              xferAsset: assets[i].asset.native,
              assetAmount: assets[i].amount.native,
              assetReceiver: this.owner.value,
              fee: 0,
            })
            .submit()
        }
      } else {
        itxn
          .payment({
            amount: assets[i].amount.native,
            receiver: this.owner.value,
          })
          .submit()
      }
    }
  }

  // @ts-ignore
  @abimethod({ allowActions: 'DeleteApplication' })
  deleteApplication(): void {
    assert(Txn.sender === this.owner.value, ERR_NOT_OWNER)
    assert(this.optinCount.value === 0, ERR_NOT_EMPTY)
    itxn
      .payment({
        closeRemainderTo: this.owner.value,
        receiver: this.owner.value,
      })
      .submit()
  }
}