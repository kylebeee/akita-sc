import {
  assert,
  assertMatch,
  Contract,
  Global,
  gtxn,
  itxn,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { ERR_INVALID_PAYMENT } from '../errors'

export class ContractWithOptIn extends Contract {

  // CONTRACT W/ OPTIN METHODS --------------------------------------------------------------------

  /**
   * optin tells the contract to opt into an asa
   * @param payment The payment transaction
   * @param asset The asset to be opted into
   */
  optin(payment: gtxn.PaymentTxn, asset: uint64): void {

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: Global.assetOptInMinBalance,
      },
      ERR_INVALID_PAYMENT
    )

    itxn.assetTransfer({
      assetReceiver: Global.currentApplicationAddress,
      assetAmount: 0,
      xferAsset: asset,
      fee: 0,
    }).submit()
  }
}

export class ContractWithCreatorOnlyOptIn extends Contract {

  // CONTRACT W/ CREATOR ONLY OPTIN METHODS -------------------------------------------------------

  /**
   * optin tells the contract to opt into an asa
   * @param payment The payment transaction
   * @param asset The asset to be opted into
   */
  optin(payment: gtxn.PaymentTxn, asset: uint64): void {
    assert(Txn.sender === Global.creatorAddress)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: Global.assetOptInMinBalance,
      },
      ERR_INVALID_PAYMENT
    )

    itxn.assetTransfer({
      assetReceiver: Global.currentApplicationAddress,
      assetAmount: 0,
      xferAsset: asset,
      fee: 0,
    }).submit()
  }
}