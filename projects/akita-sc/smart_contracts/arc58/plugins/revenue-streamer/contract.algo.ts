import { Account, Application, assert, assertMatch, Asset, BoxMap, bytes, clone, Global, gtxn, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript";
import { AssetHolding } from "@algorandfoundation/algorand-typescript/op";
import { ONE_DAY } from "../../../social/constants";
import { ERR_INVALID_PAYMENT } from "../../../utils/errors";
import { calcPercent, getRekeyIndex, getSpendingAccount, mustGetEscrowInfo, rekeyAddress, rekeyBackIfNecessary } from "../../../utils/functions";
import { ERR_ESCROW_DOES_NOT_EXIST, ERR_FORBIDDEN } from "../../account/errors";
import { ERR_ALREADY_OPTED_IN } from "../optin/errors";
import { RevenueStreamerBoxPrefixEscrows, RevenueStreamerBoxPrefixReceiveAssets, RevenueStreamerBoxPrefixSplits } from "./constants";
import { ERR_ASSET_ALREADY_ALLOCATED, ERR_ESCROW_NOT_ALLOCATABLE, ERR_ESCROW_NOT_ALLOWED_TO_OPTIN, ERR_ESCROW_NOT_IDLE, ERR_ESCROW_NOT_IN_ALLOCATION_PHASE, ERR_ESCROW_NOT_OPTED_IN, ERR_ESCROW_NOT_READY_FOR_DISBURSEMENT, ERR_INVALID_SPLIT_TYPE, ERR_OVER_ALLOCATION, ERR_RECEIVE_ESCROW_DOES_NOT_EXIST, ERR_REMAINDER_MUST_BE_LAST, ERR_SPLIT_VALUE_MUST_BE_POSITIVE_OR_REMAINDER, ERR_SPLITS_CANNOT_BE_EMPTY, ERR_SPLITS_CANNOT_BE_MORE_THAN_10 } from "./errors";
import { EscrowAssetKey, EscrowDisbursementPhaseAllocation, EscrowDisbursementPhaseFinalization, EscrowDisbursementPhaseIdle, ReceiveEscrow, Split, SplitDistributionTypeFlat, SplitDistributionTypePercentage, SplitDistributionTypeRemainder } from "./types";

// CONTRACT IMPORTS
import { AkitaBaseContract } from "../../../utils/base-contracts/base";

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

  optin(wallet: Application, rekeyBack: boolean, assets: uint64[], mbrPayment: gtxn.PaymentTxn): void {
    const sender = getSpendingAccount(wallet)

    assertMatch(
      mbrPayment,
      {
        receiver: sender,
        amount: Global.assetOptInMinBalance * assets.length
      },
      ERR_INVALID_PAYMENT
    )

    assert(this.escrows(wallet.id).exists, ERR_RECEIVE_ESCROW_DOES_NOT_EXIST)

    const { source, optinAllowed } = this.escrows(wallet.id).value
    const initiator = gtxn.Transaction(getRekeyIndex(wallet)).sender
    assert(source === initiator, ERR_FORBIDDEN)
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

    this.escrows(wallet.id).value.optinCount += assets.length
  }

  newReceiveEscrow(
    wallet: Application,
    rekeyBack: boolean,
    escrowID: uint64,
    source: Account,
    allocatable: boolean,
    optinAllowed: boolean,
    splits: Split[]
  ): void {
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

  startEscrowDisbursement(wallet: Application, rekeyBack: boolean): void {
    const escrow = mustGetEscrowInfo(wallet)
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

  processEscrowAllocation(wallet: Application, rekeyBack: boolean, ids: uint64[]): void {
    const escrow = mustGetEscrowInfo(wallet)
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