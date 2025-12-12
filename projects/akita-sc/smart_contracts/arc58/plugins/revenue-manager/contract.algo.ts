import { Account, Application, assert, assertMatch, Asset, BoxMap, Bytes, bytes, clone, Global, gtxn, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript";
import { abiCall, decodeArc4 } from "@algorandfoundation/algorand-typescript/arc4";
import { AssetHolding } from "@algorandfoundation/algorand-typescript/op";
import { ONE_DAY } from "../../../social/constants";
import { DIVISOR } from "../../../utils/constants";
import { ERR_INVALID_PAYMENT } from "../../../utils/errors";
import { arc58OptInAndSend, calcPercent, getEscrow, getRekeyIndex, getSpendingAccount, mustGetEscrowInfo, rekeyAddress, rekeyBackIfNecessary } from "../../../utils/functions";
import { ERR_ESCROW_DOES_NOT_EXIST, ERR_FORBIDDEN } from "../../account/errors";
import { ERR_ALREADY_OPTED_IN } from "../optin/errors";
import { RevenueManagerBoxPrefixEscrows, RevenueManagerBoxPrefixReceiveAssets, RevenueManagerBoxPrefixSplitRefs, RevenueManagerBoxPrefixSplits } from "./constants";
import { ERR_ASSET_ALREADY_ALLOCATED, ERR_ASSET_NOT_ALLOCATED, ERR_CONTROLLED_ADDRESS_MUST_BE_ESCROW, ERR_ESCROW_NOT_ALLOCATABLE, ERR_ESCROW_NOT_ALLOWED_TO_OPTIN, ERR_ESCROW_NOT_IDLE, ERR_ESCROW_NOT_IN_ALLOCATION_PHASE, ERR_ESCROW_NOT_IN_FINALIZATION_PHASE, ERR_ESCROW_NOT_READY_FOR_DISBURSEMENT, ERR_FLAT_WITH_PERCENTAGE_REQUIRES_REMAINDER, ERR_OVER_ALLOCATION, ERR_PERCENTAGE_EXCEEDS_100, ERR_PERCENTAGE_MUST_BE_NOT_BE_100_WITH_REMAINDER, ERR_RECEIVE_ESCROW_DOES_NOT_EXIST, ERR_REMAINDER_MUST_BE_LAST, ERR_SPLIT_REF_NOT_FOUND, ERR_SPLIT_VALUE_MUST_BE_POSITIVE_OR_REMAINDER, ERR_SPLITS_CANNOT_BE_EMPTY, ERR_SPLITS_CANNOT_BE_MORE_THAN_10, ERR_SPLITS_MUST_TOTAL_100_OR_HAVE_REMAINDER, ERR_SPLITS_OR_REF_REQUIRED } from "./errors";
import { EscrowAssetKey, EscrowDisbursementPhaseAllocation, EscrowDisbursementPhaseFinalization, EscrowDisbursementPhaseIdle, ReceiveEscrow, Split, SplitDistributionTypeFlat, SplitDistributionTypePercentage, SplitDistributionTypeRemainder, SplitRef, WalletEscrowKey } from "./types";

// CONTRACT IMPORTS
import { AkitaBaseContract } from "../../../utils/base-contracts/base";
import type { AbstractedAccount } from "../../account/contract.algo";

/**
 * high level overview of how revenue manager works:
 * 
 * 1. DAO installs it twice:  
 *  - once with execution key that can do anything
 *  - once globally with methods restricted to: optin, startEscrowDisbursement, processEscrowAllocation
 * 2. DAO proposes 'new escrow'
 * 2. DAO proposes 'execute plugin' -> revenue-manager:newReceiveEscrow
 * 
*/

export class RevenueManagerPlugin extends AkitaBaseContract {
  /** box map of all the escrows */
  escrows = BoxMap<WalletEscrowKey, ReceiveEscrow>({ keyPrefix: RevenueManagerBoxPrefixEscrows })
  /** box map of escrow assets that have already been processed during this allocation */
  receiveAssets = BoxMap<EscrowAssetKey, bytes<0>>({ keyPrefix: RevenueManagerBoxPrefixReceiveAssets })
  /** how to split revenue & where to send it */
  splits = BoxMap<WalletEscrowKey, Split[]>({ keyPrefix: RevenueManagerBoxPrefixSplits })
  /** references to splits stored in other contracts (alternative to direct splits) */
  splitRefs = BoxMap<WalletEscrowKey, SplitRef>({ keyPrefix: RevenueManagerBoxPrefixSplitRefs })

  private controls(sender: Account): boolean {
    return sender.authAddress === Global.currentApplicationAddress
  }

  /**
   * Resolves splits for an escrow - either from direct storage or from a referenced contract
   * @returns The Split[] to use for distribution
   */
  private resolveSplits(wallet: Application, escrow: string): Split[] {
    const key: WalletEscrowKey = { wallet, escrow }

    // Check for direct splits first
    if (this.splits(key).exists) {
      return clone(this.splits(key).value)
    }

    // Fall back to referenced splits
    assert(this.splitRefs(key).exists, ERR_SPLITS_OR_REF_REQUIRED)
    const { app, key: refKey } = this.splitRefs(key).value

    // Read splits from the referenced contract's global state
    const [refSplitsBytes, exists] = op.AppGlobal.getExBytes(Application(app), Bytes(refKey))
    assert(exists, ERR_SPLIT_REF_NOT_FOUND)
    return decodeArc4<Split[]>(refSplitsBytes)
  }

  /**
   * Validates a splits configuration
   */
  private validateSplits(splits: Split[]): void {
    let totalPercentage: uint64 = 0
    let hasRemainder: boolean = false
    let hasFlat: boolean = false

    for (let i: uint64 = 0; i < splits.length; i++) {
      const { type, value } = clone(splits[i])
      const isLast = i === splits.length - 1

      // Ensure value is positive (except for remainder which uses 0)
      assert(
        value > 0 || type === SplitDistributionTypeRemainder,
        ERR_SPLIT_VALUE_MUST_BE_POSITIVE_OR_REMAINDER
      )

      switch (type) {
        case SplitDistributionTypePercentage:
          totalPercentage += value
          break
        case SplitDistributionTypeFlat:
          hasFlat = true
          break
        case SplitDistributionTypeRemainder:
          // Remainder must be last
          assert(isLast, ERR_REMAINDER_MUST_BE_LAST)
          hasRemainder = true
          break
      }
    }

    // ensure total percentage doesn't exceed 100%
    assert(totalPercentage <= DIVISOR, ERR_PERCENTAGE_EXCEEDS_100)
    // ensure total percentage doesn't meet 100% when using a remainder
    assert(totalPercentage !== DIVISOR || !hasRemainder, ERR_PERCENTAGE_MUST_BE_NOT_BE_100_WITH_REMAINDER)
    // If mixing flat amounts with percentages, need remainder OR 100% to consume all remaining funds
    assert(!hasFlat || hasRemainder || totalPercentage === 0 || totalPercentage === DIVISOR, ERR_FLAT_WITH_PERCENTAGE_REQUIRES_REMAINDER)
    // If no remainder, percentages must total exactly 100% (unless using only flat amounts)
    assert(hasRemainder || totalPercentage === DIVISOR || (totalPercentage === 0 && hasFlat), ERR_SPLITS_MUST_TOTAL_100_OR_HAVE_REMAINDER)
  }

  /**
   * optin exists because revenue manager uses additional metadata to track optin counts for processing payments
   * revenue escrows must be locked to avoid mistracking optins to ensure all opted in assets get processed
  */
  optIn(wallet: Application, rekeyBack: boolean, assets: uint64[], mbrPayment: gtxn.PaymentTxn): void {
    const escrow = getEscrow(wallet)
    assert(escrow !== '', ERR_ESCROW_DOES_NOT_EXIST)
    const sender = getSpendingAccount(wallet)

    assertMatch(
      mbrPayment,
      {
        receiver: sender,
        amount: {
          greaterThanEq: Global.assetOptInMinBalance * assets.length
        }
      },
      ERR_INVALID_PAYMENT
    )

    assert(this.escrows({ wallet, escrow }).exists, ERR_RECEIVE_ESCROW_DOES_NOT_EXIST)

    const { source, optinAllowed } = this.escrows({ wallet, escrow }).value
    const initiator = gtxn.Transaction(getRekeyIndex(wallet)).sender
    const isChild = Global.callerApplicationId !== 0 && Application(Global.callerApplicationId).creator === source
    assert(source === initiator || isChild, ERR_FORBIDDEN)
    assert(optinAllowed, ERR_ESCROW_NOT_ALLOWED_TO_OPTIN)

    for (let i: uint64 = 0; i < assets.length; i++) {
      assert(!sender.isOptedIn(Asset(assets[i])), ERR_ALREADY_OPTED_IN)

      itxn
        .assetTransfer({
          sender,
          assetReceiver: sender,
          assetAmount: 0,
          xferAsset: Asset(assets[i]),
          rekeyTo: rekeyAddress(rekeyBack && (i === (assets.length - 1)), wallet)
        })
        .submit();
    }

    this.escrows({ wallet, escrow }).value.optinCount += assets.length
  }

  /**
   * Creates a new receive escrow with direct splits
   * Use this when you want to store splits directly in this contract
   */
  newReceiveEscrow(
    wallet: Application,
    rekeyBack: boolean,
    escrow: string,
    source: Account,
    allocatable: boolean,
    optinAllowed: boolean,
    splits: Split[]
  ): void {
    const sender = getSpendingAccount(wallet)
    assert(this.controls(sender), ERR_FORBIDDEN)
    assert(splits.length > 0, ERR_SPLITS_CANNOT_BE_EMPTY)
    assert(splits.length <= 10, ERR_SPLITS_CANNOT_BE_MORE_THAN_10)

    this.escrows({ wallet, escrow }).value = {
      source,
      allocatable,
      optinAllowed,
      optinCount: 0,
      phase: EscrowDisbursementPhaseIdle,
      allocationCounter: 0,
      lastDisbursement: 0,
      creationDate: Global.latestTimestamp,
    }

    // Validate splits configuration
    this.validateSplits(splits)

    this.splits({ wallet, escrow }).value = clone(splits)

    rekeyBackIfNecessary(rekeyBack, wallet)
  }

  /**
   * Creates a new receive escrow with a reference to splits stored in another contract
   * Use this when you want splits to be dynamically read from another contract's global state
   */
  newReceiveEscrowWithRef(
    wallet: Application,
    rekeyBack: boolean,
    escrow: string,
    source: Account,
    allocatable: boolean,
    optinAllowed: boolean,
    splitRef: SplitRef
  ): void {
    const sender = getSpendingAccount(wallet)
    assert(this.controls(sender), ERR_FORBIDDEN)

    this.escrows({ wallet, escrow }).value = {
      source,
      allocatable,
      optinAllowed,
      optinCount: 0,
      phase: EscrowDisbursementPhaseIdle,
      allocationCounter: 0,
      lastDisbursement: 0,
      creationDate: Global.latestTimestamp,
    }

    // Store the reference - validation happens at allocation time since values are dynamic
    this.splitRefs({ wallet, escrow }).value = clone(splitRef)

    rekeyBackIfNecessary(rekeyBack, wallet)
  }

  startEscrowDisbursement(wallet: Application, rekeyBack: boolean): void {
    const escrow = getEscrow(wallet)
    assert(escrow !== '', ERR_ESCROW_DOES_NOT_EXIST)
    const { id: escrowID } = mustGetEscrowInfo(wallet)
    const sender = getSpendingAccount(wallet)
    assert(this.controls(sender), ERR_FORBIDDEN)
    assert(sender === Application(escrowID).address, ERR_CONTROLLED_ADDRESS_MUST_BE_ESCROW)

    assert(this.escrows({ wallet, escrow }).exists, ERR_ESCROW_DOES_NOT_EXIST)
    // validate the time window of the last escrow payout
    const { phase, allocatable, lastDisbursement, creationDate } = this.escrows({ wallet, escrow }).value
    assert(phase === EscrowDisbursementPhaseIdle, ERR_ESCROW_NOT_IDLE)
    assert(allocatable, ERR_ESCROW_NOT_ALLOCATABLE)

    const latestWindow: uint64 = Global.latestTimestamp - ((Global.latestTimestamp - creationDate) % ONE_DAY)
    assert(latestWindow >= lastDisbursement, ERR_ESCROW_NOT_READY_FOR_DISBURSEMENT)

    this.escrows({ wallet, escrow }).value.phase = EscrowDisbursementPhaseAllocation
    this.escrows({ wallet, escrow }).value.lastDisbursement = latestWindow

    rekeyBackIfNecessary(rekeyBack, wallet)
  }

  processEscrowAllocation(wallet: Application, rekeyBack: boolean, ids: uint64[]): void {
    const escrow = getEscrow(wallet)
    assert(escrow !== '', ERR_ESCROW_DOES_NOT_EXIST)
    const { id: escrowID } = mustGetEscrowInfo(wallet)
    const sender = getSpendingAccount(wallet)
    assert(sender === Application(escrowID).address, ERR_CONTROLLED_ADDRESS_MUST_BE_ESCROW)

    const { phase, optinCount, allocationCounter } = this.escrows({ wallet, escrow }).value
    assert(phase === EscrowDisbursementPhaseAllocation, ERR_ESCROW_NOT_IN_ALLOCATION_PHASE)
    const totalAssetsToProcess: uint64 = optinCount + 1 // + 1 to include algo

    // Resolve splits (either from direct storage or from referenced contract)
    const splits = this.resolveSplits(wallet, escrow)

    // Runtime validation of splits (required since referenced values can change)
    assert(splits.length > 0, ERR_SPLITS_CANNOT_BE_EMPTY)
    assert(splits.length <= 10, ERR_SPLITS_CANNOT_BE_MORE_THAN_10)
    this.validateSplits(splits)

    // Process each asset
    for (let i: uint64 = 0; i < ids.length; i += 1) {
      const asset = ids[i]
      assert(!this.receiveAssets({ escrow: escrowID, asset }).exists, ERR_ASSET_ALREADY_ALLOCATED)

      const balance: uint64 = asset === 0
        ? op.balance(Global.currentApplicationAddress) - Global.minBalance
        : AssetHolding.assetBalance(sender, asset)[0]

      let remaining: uint64 = balance
      for (let j: uint64 = 0; j < splits.length; j++) {
        const { type, receiver, value } = clone(splits[j])

        // we require that all receivers are arc58 accounts
        const receiverEscrowInfo = abiCall<typeof AbstractedAccount.prototype.arc58_getEscrows>({
          appId: receiver.wallet,
          args: [[receiver.escrow]]
        }).returnValue[0]

        const receiverAddress = Application(receiverEscrowInfo.id).address

        // entrypoint escrows should have the required funds to opt all splits in
        if (!receiverAddress.isOptedIn(Asset(asset))) {
          arc58OptInAndSend(this.akitaDAO.value, receiver.wallet, receiver.escrow, [asset], [0])
        }

        let amount: uint64 = 0
        switch (type) {
          case SplitDistributionTypeFlat:
            amount = value
            break
          case SplitDistributionTypePercentage:
            // Calculate percentage on remaining balance (after flat amounts)
            amount = calcPercent(remaining, value)
            break
          case SplitDistributionTypeRemainder:
            // Remainder gets whatever is left
            amount = remaining
            break
        }

        assert(amount <= remaining, ERR_OVER_ALLOCATION)
        remaining -= amount

        if (asset === 0) {
          itxn
            .payment({
              sender,
              receiver: receiverAddress,
              amount
            })
            .submit()
        } else {
          itxn
            .assetTransfer({
              sender,
              assetReceiver: receiverAddress,
              assetAmount: amount,
              xferAsset: asset
            })
            .submit()
        }
      }

      this.receiveAssets({ escrow: escrowID, asset }).create()
    }

    this.escrows({ wallet, escrow }).value.allocationCounter += ids.length
    if ((allocationCounter + ids.length) === totalAssetsToProcess) {
      this.escrows({ wallet, escrow }).value.phase = EscrowDisbursementPhaseFinalization
    }

    rekeyBackIfNecessary(rekeyBack, wallet)
  }

  /**
   * Cleans up processed asset boxes and resets escrow back to idle state
   * Must be called after all assets have been processed (escrow in Finalization phase)
   * Can be called in batches - pass the asset IDs that were processed to delete their tracking boxes
   */
  finalizeEscrowDisbursement(wallet: Application, rekeyBack: boolean, ids: uint64[]): void {
    const escrow = getEscrow(wallet)
    assert(escrow !== '', ERR_ESCROW_DOES_NOT_EXIST)
    const { id: escrowID } = mustGetEscrowInfo(wallet)
    const sender = getSpendingAccount(wallet)
    assert(sender === Application(escrowID).address, ERR_CONTROLLED_ADDRESS_MUST_BE_ESCROW)

    const { phase, allocationCounter } = this.escrows({ wallet, escrow }).value
    assert(phase === EscrowDisbursementPhaseFinalization, ERR_ESCROW_NOT_IN_FINALIZATION_PHASE)

    // Delete the tracking boxes for processed assets
    for (let i: uint64 = 0; i < ids.length; i++) {
      const asset = ids[i]
      assert(this.receiveAssets({ escrow: escrowID, asset }).exists, ERR_ASSET_NOT_ALLOCATED)
      this.receiveAssets({ escrow: escrowID, asset }).delete()
    }

    // Decrement the allocation counter
    this.escrows({ wallet, escrow }).value.allocationCounter -= ids.length

    // If all boxes have been cleaned up, reset to idle
    if ((allocationCounter - ids.length) === 0) {
      this.escrows({ wallet, escrow }).value.phase = EscrowDisbursementPhaseIdle
    }

    rekeyBackIfNecessary(rekeyBack, wallet)
  }
}