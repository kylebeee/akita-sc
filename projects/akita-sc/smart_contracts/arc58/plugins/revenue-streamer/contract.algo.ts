import { Account, Application, assert, assertMatch, Asset, BoxMap, bytes, clone, Global, gtxn, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript";
import { Address, Uint8 } from "@algorandfoundation/algorand-typescript/arc4";
import { calcPercent, getEscrowInfo, getRekeyIndex, getSpendingAccount, rekeyAddress, rekeyBackIfNecessary } from "../../../utils/functions";
import { AkitaBaseContract } from "../../../utils/base-contracts/base";
import { ERR_INVALID_PAYMENT } from "../../../utils/errors";
import { ERR_ALREADY_OPTED_IN } from "../optin/errors";
import { ERR_ESCROW_DOES_NOT_EXIST, ERR_FORBIDDEN } from "../../account/errors";
import { ERR_ASSET_ALREADY_ALLOCATED, ERR_ESCROW_NOT_ALLOCATABLE, ERR_ESCROW_NOT_ALLOWED_TO_OPTIN, ERR_ESCROW_NOT_IDLE, ERR_ESCROW_NOT_IN_ALLOCATION_PHASE, ERR_ESCROW_NOT_OPTED_IN, ERR_ESCROW_NOT_READY_FOR_DISBURSEMENT, ERR_INVALID_SPLIT_TYPE, ERR_OVER_ALLOCATION, ERR_RECEIVE_ESCROW_DOES_NOT_EXIST, ERR_REMAINDER_MUST_BE_LAST, ERR_SPLIT_VALUE_MUST_BE_POSITIVE_OR_REMAINDER, ERR_SPLITS_CANNOT_BE_EMPTY, ERR_SPLITS_CANNOT_BE_MORE_THAN_10 } from "./errors";
import { RevenueStreamerBoxPrefixEscrows, RevenueStreamerBoxPrefixReceiveAssets, RevenueStreamerBoxPrefixSplits } from "./constants";
import { ONE_DAY } from "../social/constants";
import { AssetHolding } from "@algorandfoundation/algorand-typescript/op";

/**
 * high level overview of how revenue manager works:
 * 
 * 1. DAO installs it twice:  
 *  - once with execution key that can do anything
 *  - once globally with methods restricted to: optin, startEscrowDisbursement, processEscrowAllocation
 * 2. DAO proposes 'new escrow'
 * 2. DAO proposes 'execute plugin' -> revenue-streamer:newReceiveEscrow
 * 
*/

export type EscrowDisbursementPhase = Uint8

export const EscrowDisbursementPhaseIdle: EscrowDisbursementPhase = new Uint8(0)
export const EscrowDisbursementPhasePreparation: EscrowDisbursementPhase = new Uint8(10)
export const EscrowDisbursementPhaseAllocation: EscrowDisbursementPhase = new Uint8(20)
export const EscrowDisbursementPhaseFinalization: EscrowDisbursementPhase = new Uint8(30)

export type ReceiveEscrow = {
  /** the source address of funds for the escrow */
  source: Address
  /** whether the escrow is allocatable for paying the DAO/krby/mods */
  allocatable: boolean
  /** whether the account is allowed to opt in */
  optinAllowed: boolean
  /** the number of assets the escrow is opted into */
  optinCount: uint64
  /** the current phase of the escrow disbursement */
  phase: EscrowDisbursementPhase
  /** allocation counter to track the number of assets we need to disburse */
  allocationCounter: uint64
  /** the last unix time the escrow was disbursed */
  lastDisbursement: uint64
  /** the unix timestamp the escrow was created */
  creationDate: uint64
}

export type EscrowAssetKey = {
  escrow: uint64
  asset: uint64
}

export type SplitDistributionType = Uint8

export const SplitDistributionTypeFlat: SplitDistributionType = new Uint8(10)
export const SplitDistributionTypePercentage: SplitDistributionType = new Uint8(20)
export const SplitDistributionTypeRemainder: SplitDistributionType = new Uint8(30)

export type Split = {
  escrow: uint64
  type: SplitDistributionType
  value: uint64
}

export class RevenueStreamer extends AkitaBaseContract {
  /** box map of all the escrows */
  escrows = BoxMap<uint64, ReceiveEscrow>({ keyPrefix: RevenueStreamerBoxPrefixEscrows })
  /** box map of escrow assets that have already been processed during this allocation */
  receiveAssets = BoxMap<EscrowAssetKey, bytes<0>>({ keyPrefix: RevenueStreamerBoxPrefixReceiveAssets })
  /** how to split revenue & where to send it + how to manage optins */
  splits = BoxMap<uint64, Split[]>({ keyPrefix: RevenueStreamerBoxPrefixSplits })

  private controls(sender: Account): boolean {
    return sender.authAddress === Global.currentApplicationAddress
  }

  optin(walletID: uint64, rekeyBack: boolean, assets: uint64[], mbrPayment: gtxn.PaymentTxn): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assertMatch(
      mbrPayment,
      {
        receiver: sender,
        amount: Global.assetOptInMinBalance * assets.length
      },
      ERR_INVALID_PAYMENT
    )

    assert(this.escrows(walletID).exists, ERR_RECEIVE_ESCROW_DOES_NOT_EXIST)

    const { source, optinAllowed } = this.escrows(walletID).value
    const initiator = gtxn.Transaction(getRekeyIndex(wallet)).sender
    assert(source.native === initiator, ERR_FORBIDDEN)
    assert(optinAllowed, ERR_ESCROW_NOT_ALLOWED_TO_OPTIN)

    for (let i: uint64 = 0; i < assets.length; i++) {
      assert(!sender.isOptedIn(Asset(assets[i])), ERR_ALREADY_OPTED_IN)

      itxn
        .assetTransfer({
          sender,
          assetReceiver: sender,
          assetAmount: 0,
          xferAsset: Asset(assets[i]),
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        })
        .submit();
    }

    this.escrows(walletID).value.optinCount += assets.length
  }

  newReceiveEscrow(
    walletID: uint64,
    rekeyBack: boolean,
    escrowID: uint64,
    source: Address,
    allocatable: boolean,
    optinAllowed: boolean,
    splits: Split[]
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)
    assert(this.controls(sender), ERR_FORBIDDEN)
    assert(splits.length > 0, ERR_SPLITS_CANNOT_BE_EMPTY)
    assert(splits.length <= 10, ERR_SPLITS_CANNOT_BE_MORE_THAN_10)

    this.escrows(escrowID).value = {
      source,
      allocatable,
      optinAllowed,
      optinCount: 0,
      phase: EscrowDisbursementPhaseIdle,
      allocationCounter: 0,
      lastDisbursement: 0,
      creationDate: Global.latestTimestamp,
    }

    for (let i: uint64 = 0; i < splits.length; i++) {
      const split = clone(splits[i])
      const isLast = i === splits.length - 1
      assert(split.value > 0 || split.type === SplitDistributionTypeRemainder, ERR_SPLIT_VALUE_MUST_BE_POSITIVE_OR_REMAINDER)
      assert(!isLast || split.type !== SplitDistributionTypeRemainder, ERR_REMAINDER_MUST_BE_LAST)
    }

    this.splits(escrowID).value = clone(splits)

    rekeyBackIfNecessary(rekeyBack, wallet)
  }

  startEscrowDisbursement(walletID: uint64, rekeyBack: boolean): void {
    const wallet = Application(walletID)
    const escrow = getEscrowInfo(wallet)
    const sender = getSpendingAccount(wallet)
    assert(this.controls(sender), ERR_FORBIDDEN)

    assert(this.escrows(escrow.id).exists, ERR_ESCROW_DOES_NOT_EXIST)
    // validate the time window of the last escrow payout
    const { phase, allocatable, lastDisbursement, creationDate } = this.escrows(escrow.id).value
    assert(phase === EscrowDisbursementPhaseIdle, ERR_ESCROW_NOT_IDLE)
    assert(allocatable, ERR_ESCROW_NOT_ALLOCATABLE)

    const latestWindow: uint64 = Global.latestTimestamp - ((Global.latestTimestamp - creationDate) % ONE_DAY)
    assert(latestWindow >= lastDisbursement, ERR_ESCROW_NOT_READY_FOR_DISBURSEMENT)

    this.escrows(escrow.id).value.phase = EscrowDisbursementPhaseAllocation
    this.escrows(escrow.id).value.lastDisbursement = latestWindow

    rekeyBackIfNecessary(rekeyBack, wallet)
  }

  processEscrowAllocation(walletID: uint64, rekeyBack: boolean, ids: uint64[]): void {
    const wallet = Application(walletID)
    const escrow = getEscrowInfo(wallet)
    const sender = getSpendingAccount(wallet)

    const { phase, optinCount, allocationCounter } = this.escrows(escrow.id).value
    assert(phase === EscrowDisbursementPhaseAllocation, ERR_ESCROW_NOT_IN_ALLOCATION_PHASE)

    const totalAssetsToProcess: uint64 = optinCount + 1 // + 1 to include algo

    const splits = clone(this.splits(escrow.id).value)

    for (let i: uint64 = 0; i < ids.length; i += 1) {
      const asset = ids[i]
      assert(!this.receiveAssets({ escrow: escrow.id, asset }).exists, ERR_ASSET_ALREADY_ALLOCATED)
      assert(sender.isOptedIn(Asset(asset)), ERR_ESCROW_NOT_OPTED_IN)

      const balance: uint64 = asset === 0
        ? op.balance(Global.currentApplicationAddress) - Global.minBalance
        : AssetHolding.assetBalance(sender, asset)[0]

      let allocated: uint64 = 0
      for (let i: uint64 = 0; i < splits.length; i++) {
        const split = clone(splits[i])

        let amount: uint64 = 0
        if (split.type === SplitDistributionTypeFlat) {
          amount = split.value
        } else if (split.type === SplitDistributionTypePercentage) {
          amount = calcPercent(balance, split.value)
        } else if (split.type === SplitDistributionTypeRemainder) {
          amount = balance - allocated
        } else {
          assert(false, ERR_INVALID_SPLIT_TYPE)
        }

        allocated += amount
        assert(allocated <= balance, ERR_OVER_ALLOCATION)

        if (asset === 0) {
          itxn
            .payment({
              sender,
              receiver: Application(split.escrow).address,
              amount: amount
            })
            .submit()
        } else {
          itxn
            .assetTransfer({
              sender,
              assetReceiver: Application(split.escrow).address,
              assetAmount: amount,
              xferAsset: asset
            })
            .submit()
        }
      }

      this.receiveAssets({ escrow: escrow.id, asset }).create()
    }

    this.escrows(escrow.id).value.allocationCounter += ids.length
    if ((allocationCounter + ids.length) === totalAssetsToProcess) {
      this.escrows(escrow.id).value.phase = EscrowDisbursementPhaseFinalization
    }
    
    rekeyBackIfNecessary(rekeyBack, wallet)
  }
}