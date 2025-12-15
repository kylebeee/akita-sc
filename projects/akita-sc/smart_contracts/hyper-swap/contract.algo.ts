import { Account, Application, assert, assertMatch, Asset, BoxMap, bytes, Bytes, Global, GlobalState, gtxn, itxn, op, Txn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod } from '@algorandfoundation/algorand-typescript/arc4'
import { AssetHolding, itob, sha256 } from '@algorandfoundation/algorand-typescript/op'
import { classes } from 'polytype'
import { MerkleTreeTypeTrade } from '../meta-merkles/constants'
import { ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER } from '../utils/errors'
import { arc58OptInAndSend, getAkitaAppList, getPluginAppList } from '../utils/functions'
import { RefundValue } from '../utils/types/mbr'
import { Proof } from '../utils/types/merkles'
import { HyperSwapBoxPrefixHashes, HyperSwapBoxPrefixOffers, HyperSwapBoxPrefixParticipants, HyperSwapGlobalStateKeyOfferCursor, STATE_CANCEL_COMPLETED, STATE_CANCELLED, STATE_COMPLETED, STATE_DISBURSING, STATE_ESCROWING, STATE_OFFERED } from './constants'
import { ERR_BAD_ROOTS, ERR_CANT_VERIFY_LEAF, ERR_INVALID_STATE, ERR_NOT_A_PARTICIPANT, ERR_OFFER_EXPIRED, ERR_RECEIVER_NOT_OPTED_IN } from './errors'
import { HashKey, OfferValue, ParticipantKey } from './types'

// CONTRACT IMPORTS
import type { AbstractedAccount } from '../arc58/account/contract.algo'
import type { MetaMerkles } from '../meta-merkles/contract.algo'
import { AkitaBaseContract } from '../utils/base-contracts/base'
import { ContractWithOptIn } from '../utils/base-contracts/optin'
import { BaseHyperSwap } from './base'


export class HyperSwap extends classes(BaseHyperSwap, AkitaBaseContract, ContractWithOptIn) {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** global counter for offers */
  offerCursor = GlobalState<uint64>({ key: HyperSwapGlobalStateKeyOfferCursor })

  // BOXES ----------------------------------------------------------------------------------------

  /** map of hyper swap offers */
  offers = BoxMap<uint64, OfferValue>({ keyPrefix: HyperSwapBoxPrefixOffers })
  /** map of the participants in each swap */
  participants = BoxMap<ParticipantKey, RefundValue>({ keyPrefix: HyperSwapBoxPrefixParticipants })
  /** map of merkle tree hashes during escrow & disbursal phases */
  hashes = BoxMap<HashKey, RefundValue>({ keyPrefix: HyperSwapBoxPrefixHashes })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newOfferID(): uint64 {
    const id = this.offerCursor.value
    this.offerCursor.value += 1
    return id
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: Application): void {
    this.version.value = version
    this.akitaDAO.value = akitaDAO
  }

  // HYPER SWAP METHODS ---------------------------------------------------------------------------

  /**
   * Creates a merkle tree based atomic payment/xfer group
   *
   * @param root the merkle tree root of trades consisting of from address, recipient address, asset id & amount
   * @param leaves the number of leaves in the tree
   * @param participantsRoot the merkle tree root of participating addresses
   * @param participantLeaves the number of leaves in the participant tree
   * @param expiration the unix timestamp that the offer auto-expires at if it has not been accepted by all participants
   * @param marketplace the address of the marketplace to pay the fee to
   * @param marketFee the fee to pay the marketplace for facilitating the offer
   */
  offer(
    payment: gtxn.PaymentTxn,
    root: bytes<32>,
    leaves: uint64,
    participantsRoot: bytes<32>,
    participantsLeaves: uint64,
    expiration: uint64
  ) {
    assert(root !== participantsRoot, ERR_BAD_ROOTS)

    // const orig = getOrigin(this.spendingAccountFactory.value.id)
    const costs = this.mbr()
    const metaMerklesCost: uint64 = costs.mm.root + costs.mm.data
    const hyperSwapOfferMBRAmount: uint64 = costs.offers + costs.participants + (metaMerklesCost * 2)
    const payor = payment.sender

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: hyperSwapOfferMBRAmount
      },
      ERR_INVALID_PAYMENT
    )

    const metaMerklesAppID = getAkitaAppList(this.akitaDAO.value).metaMerkles

    abiCall<typeof MetaMerkles.prototype.addRoot>({
      appId: metaMerklesAppID,
      args: [
        itxn.payment({
          receiver: Application(metaMerklesAppID).address,
          amount: metaMerklesCost,
        }),
        String(root),
        root,
        MerkleTreeTypeTrade
      ],
    })

    // add the participants root to the meta merkle contract
    abiCall<typeof MetaMerkles.prototype.addRoot>({
      appId: metaMerklesAppID,
      args: [
        itxn.payment({
          receiver: Application(metaMerklesAppID).address,
          amount: metaMerklesCost,
        }),
        String(participantsRoot),
        participantsRoot,
        MerkleTreeTypeTrade
      ],
    })

    const id = this.newOfferID()

    // automatically set our sender as the first accepted participant
    this.participants({ id, address: Txn.sender }).value = { payor, amount: hyperSwapOfferMBRAmount }

    // create the offering box & default state
    this.offers(id).value = {
      state: STATE_OFFERED,
      root,
      leaves,
      escrowed: 0,
      participantsRoot,
      participantsLeaves,
      acceptances: 1,
      expiration,
    }
  }

  /**
   * Accepts an offer
   *
   * @param mbrPayment the payment to cover the MBR
   * @param id the id of the offer being accepted
   * @param proof the bytes32 array proof of inclusion in the participants list
   */
  accept(mbrPayment: gtxn.PaymentTxn, id: uint64, proof: Proof) {
    // ensure the offer exists
    assert(this.offers(id).exists)
    const { state, expiration, participantsRoot, acceptances, participantsLeaves } = this.offers(id).value
    // ensure we are still in the collecting acceptances stage
    assert(state === STATE_OFFERED)
    assert(expiration > Global.latestTimestamp, ERR_OFFER_EXPIRED)
    // ensure they are a participant
    const isParticipant = abiCall<typeof MetaMerkles.prototype.verify>({
      appId: getAkitaAppList(this.akitaDAO.value).metaMerkles,
      args: [
        Global.currentApplicationAddress,
        String(participantsRoot),
        sha256(sha256(Txn.sender.bytes)),
        proof,
        MerkleTreeTypeTrade
      ],
    }).returnValue

    assert(isParticipant, ERR_NOT_A_PARTICIPANT)

    // ensure they haven't already accepted
    const senderParticipantKey = { id, address: Txn.sender }
    assert(!this.participants(senderParticipantKey).exists)
    // increment the acceptance count
    const newAcceptances: uint64 = acceptances + 1
    this.offers(id).value.acceptances = newAcceptances

    const costs = this.mbr()

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: costs.participants
      },
      ERR_INVALID_PAYMENT
    )

    // flag this participant as accepted
    this.participants(senderParticipantKey).value = {
      payor: mbrPayment.sender,
      amount: costs.participants
    }
    // if we collected all needed acceptances switch to the gathering state
    if (participantsLeaves === newAcceptances) {
      this.offers(id).value.state = STATE_ESCROWING
    }
  }

  /**
   * Escrows the assets in the trade for a given leaf in the tree
   *
   *
   * @param id the id of the offer
   * @param receiver the recipient in the offer leaf
   * @param asset the asset in the offer leaf
   * @param amount the amount in the offer leaf
   * @param proof the proof to verify the details are part of the tree
   */
  escrow(payment: gtxn.PaymentTxn, id: uint64, receiver: Account, amount: uint64, proof: Proof) {
    // ensure the offer exists
    assert(this.offers(id).exists)
    const { state, root, escrowed, leaves, expiration } = this.offers(id).value
    // ensure we are still in the escrowing stage
    assert(state === STATE_ESCROWING, ERR_INVALID_STATE)
    // ensure the offer hasn't expired
    assert(expiration > Global.latestTimestamp, ERR_OFFER_EXPIRED)
    // ensure they are a participant
    const senderParticipantKey = { id, address: Txn.sender }
    assert(this.participants(senderParticipantKey).exists)
    // ensure this leaf has not already been escrowed
    const hash = sha256(sha256(Bytes`${Txn.sender.bytes}${receiver.bytes}${itob(0)}${itob(amount)}`))
    const hashKey: HashKey = { id, hash }
    assert(!this.hashes(hashKey).exists)
    // verify the leaf
    const verified = abiCall<typeof MetaMerkles.prototype.verify>({
      appId: getAkitaAppList(this.akitaDAO.value).metaMerkles,
      args: [
        Global.currentApplicationAddress,
        String(root),
        hash,
        proof,
        MerkleTreeTypeTrade
      ],
    }).returnValue

    assert(verified, ERR_CANT_VERIFY_LEAF)

    const costs = this.mbr()

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: amount + costs.hashes
      },
      ERR_INVALID_PAYMENT
    )

    // add the leaf to the our escrowed list
    this.hashes(hashKey).value = {
      payor: payment.sender,
      amount: costs.hashes
    }

    const newEscrowed: uint64 = escrowed + 1
    this.offers(id).value.escrowed = newEscrowed
    // if we collected all needed assets switch to the disbursement state
    // increment our escrow count
    if (leaves === newEscrowed) {
      this.offers(id).value.state = STATE_DISBURSING
    }
  }

  /**
   * Escrows the assets in the trade for a given leaf in the tree
   * @param mbrPayment the payment to cover the MBR
   * @param assetXfer the asset transfer to escrow the asa
   * @param id the id of the offer
   * @param receiver the recipient in the offer leaf
   * @param asset the asset in the offer leaf
   * @param amount the amount in the offer leaf
   * @param proof the proof to verify the details are part of the tree
   */
  escrowAsa(
    mbrPayment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    id: uint64,
    receiver: Account,
    asset: uint64,
    amount: uint64,
    proof: Proof
  ) {
    // ensure the offer exists
    assert(this.offers(id).exists)
    const { state, root, escrowed, leaves, expiration } = this.offers(id).value
    // ensure we are still in the escrowing stage
    assert(state === STATE_ESCROWING, ERR_INVALID_STATE)
    // ensure the offer hasn't expired
    assert(expiration > Global.latestTimestamp, ERR_OFFER_EXPIRED)
    // ensure they are a participant
    const senderParticipantKey = { id, address: Txn.sender }
    assert(this.participants(senderParticipantKey).exists)
    // ensure this leaf has not already been escrowed
    const hash = sha256(sha256(Bytes`${Txn.sender.bytes}${receiver.bytes}${itob(asset)}${itob(amount)}`))
    const hashKey: HashKey = { id, hash }
    assert(!this.hashes(hashKey).exists)
    // verify the leaf
    const verified = abiCall<typeof MetaMerkles.prototype.verify>({
      appId: getAkitaAppList(this.akitaDAO.value).metaMerkles,
      args: [
        Global.currentApplicationAddress,
        String(root),
        hash,
        proof,
        MerkleTreeTypeTrade
      ],
    }).returnValue

    assert(verified, ERR_CANT_VERIFY_LEAF)

    // track the mbr the app / receiver need
    const costs = this.mbr()
    let mbrAmount = costs.hashes

    // collect opt-in MBR if receiver is not opted into the asset
    if (!receiver.isOptedIn(Asset(asset))) {
      mbrAmount += Global.assetOptInMinBalance
    }

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: mbrAmount
      },
      ERR_INVALID_PAYMENT
    )

    assertMatch(
      assetXfer,
      {
        assetReceiver: Global.currentApplicationAddress,
        xferAsset: Asset(asset),
        assetAmount: amount
      },
      ERR_INVALID_TRANSFER
    )

    // add the leaf to the our escrowed list
    this.hashes(hashKey).value = {
      payor: mbrPayment.sender,
      amount: mbrAmount
    }
    // increment our escrow count
    const newEscrowed: uint64 = escrowed + 1
    this.offers(id).value.escrowed = newEscrowed
    // if we collected all needed assets switch to the disbursement state
    if (leaves === newEscrowed) {
      this.offers(id).value.state = STATE_DISBURSING
    }
  }

  /**
   * Disburses assets for a leaf in the tree, ensuring ordered processing
   *
   * @param id the id of the offer
   * @param receiverWallet the receiver's ARC58 wallet app id (0 if not an ARC58 wallet)
   * @param receiver the recipient address in the leaf
   * @param asset the asset being transferred
   * @param amount the amount being transferred
   */
  disburse(id: uint64, receiverWallet: uint64, receiver: Account, asset: uint64, amount: uint64) {
    // ensure the offer exists
    assert(this.offers(id).exists)
    const { state, escrowed } = this.offers(id).value
    // ensure we are in the disbursing stage
    assert(state === STATE_DISBURSING)

    // ensure this leaf is escrowed
    const hash = sha256(sha256(Bytes`${Txn.sender.bytes}${receiver.bytes}${itob(asset)}${itob(amount)}`))
    const hashKey: HashKey = { id, hash }
    assert(this.hashes(hashKey).exists)

    let { payor, amount: refundAmount } = this.hashes(hashKey).value
    this.hashes(hashKey).delete()

    // process the transfer
    if (asset === 0) {
      // ALGO transfer - direct payment
      itxn
        .payment({ amount, receiver })
        .submit()

      // refund the account that covered the MBR
      itxn
        .payment({
          amount: refundAmount,
          receiver: payor,
        })
        .submit()
    } else {
      // ASA transfer - check if receiver needs opt-in
      const [, isOptedIn] = AssetHolding.assetBalance(receiver, asset)

      if (!isOptedIn) {
        // receiver not opted in - try ARC58 opt-in if they have an ARC58 wallet
        assert(receiverWallet !== 0, ERR_RECEIVER_NOT_OPTED_IN)
        assert(Application(receiverWallet).address === receiver, 'receiverWallet address mismatch')

        // verify the ARC58 wallet allows opt-in from this plugin
        const optinPlugin = getPluginAppList(this.akitaDAO.value).optin
        const canOptIn = abiCall<typeof AbstractedAccount.prototype.arc58_canCall>({
          appId: receiverWallet,
          args: [
            optinPlugin,
            true,
            Global.currentApplicationAddress,
            '',
            op.bzero(4).toFixed({ length: 4 }),
          ]
        }).returnValue

        assert(canOptIn, ERR_RECEIVER_NOT_OPTED_IN)

        // use escrowed MBR to opt in the receiver via ARC58
        arc58OptInAndSend(this.akitaDAO.value, Application(receiverWallet), '', [asset], [amount])

        // refund remaining MBR (total - opt-in cost) to payor
        const optInCost = Global.assetOptInMinBalance
        if (refundAmount > optInCost) {
          itxn
            .payment({
              amount: refundAmount - optInCost,
              receiver: payor,
            })
            .submit()
        }
      } else {
        // receiver is opted in - direct asset transfer
        itxn
          .assetTransfer({
            xferAsset: asset,
            assetAmount: amount,
            assetReceiver: receiver,
          })
          .submit()

        // refund the full MBR to payor
        itxn
          .payment({
            amount: refundAmount,
            receiver: payor,
          })
          .submit()
      }
    }

    const newEscrowed: uint64 = escrowed - 1
    this.offers(id).value.escrowed = newEscrowed
    // if we disbursed all needed assets switch to the completed state
    if (newEscrowed === 0) {
      this.offers(id).value.state = STATE_COMPLETED
    }
  }

  /**
   * @param id the id of the offer being cancelled
   * @param proof a proof of inclusion in the participants list
   */
  cancel(id: uint64, proof: Proof) {
    // ensure the offer exists
    assert(this.offers(id).exists)
    const { state, participantsRoot, escrowed, root } = this.offers(id).value
    // ensure we're in a cancellable state
    assert(state === STATE_OFFERED || state === STATE_ESCROWING)

    // ensure they are a participant
    const isParticipant = abiCall<typeof MetaMerkles.prototype.verify>({
      appId: getAkitaAppList(this.akitaDAO.value).metaMerkles,
      args: [
        Global.currentApplicationAddress,
        String(participantsRoot),
        sha256(sha256(Txn.sender.bytes)),
        proof,
        MerkleTreeTypeTrade
      ],
    }).returnValue

    assert(isParticipant, ERR_NOT_A_PARTICIPANT)
    // set the state to cancelled
    this.offers(id).value.state = STATE_CANCELLED
  }

  /**
   * Withdraws your assets from a cancelled swap if they're escrowed
   *
   *
   * @param id the id of the cancelled offer
   * @param receiver the receiver of the leaf's swap
   * @param asset the asset of the leaf's swap
   * @param amount the amount of the leaf's swap
   * @param proof the proof that the leaf is in the tree
   * @param rekeyBack whether the abstracted account should be rekeyed back at the end
   */
  withdraw(id: uint64, receiver: Account, asset: uint64, amount: uint64, proof: Proof) {
    // ensure the offer exists
    assert(this.offers(id).exists)
    const { state, escrowed, root } = this.offers(id).value
    // ensure the offer is cancelled
    assert(state === STATE_CANCELLED)
    // ensure the escrow count isn't zero
    assert(escrowed > 0)
    // ensure this leaf is still escrowed
    const hash = sha256(sha256(Bytes`${Txn.sender.bytes}${receiver.bytes}${itob(asset)}${itob(amount)}`))
    const hashKey: HashKey = { id, hash }
    assert(this.hashes(hashKey).exists)
    // verify the leaf
    const verified = abiCall<typeof MetaMerkles.prototype.verify>({
      appId: getAkitaAppList(this.akitaDAO.value).metaMerkles,
      args: [
        Global.currentApplicationAddress,
        String(root),
        hash,
        proof,
        MerkleTreeTypeTrade
      ],
    }).returnValue

    assert(verified, ERR_CANT_VERIFY_LEAF)

    let { payor, amount: refundAmount } = this.hashes(hashKey).value
    this.hashes(hashKey).delete()

    if (asset === 0) {
      itxn
        .payment({
          amount: amount,
          receiver: Txn.sender,
        })
        .submit()
    } else {
      itxn
        .assetTransfer({
          xferAsset: asset,
          assetAmount: amount,
          assetReceiver: Txn.sender,
        })
        .submit()
    }

    itxn
      .payment({
        amount: refundAmount,
        receiver: payor,
      })
      .submit()

    // decrement our escrow count
    const newEscrowed: uint64 = escrowed - 1
    // mark the cancelled offer as done if theres no more escrowed assets
    if (newEscrowed === 0) {
      this.offers(id).value.escrowed = newEscrowed
      this.offers(id).value.state = STATE_CANCEL_COMPLETED
    } else {
      this.offers(id).value.escrowed = newEscrowed
    }
  }

  // CLEANUP METHODS --------------------------------------------------------------------------------

  /**
   * Cleans up participant box and refunds MBR
   * Can only be called when offer is completed, cancelled+completed, or expired
   *
   * @param id the id of the offer
   * @param participant the participant address to clean up
   */
  cleanupParticipant(id: uint64, participant: Account) {
    assert(this.offers(id).exists)
    const { state, expiration, acceptances } = this.offers(id).value

    // can only cleanup if completed, cancel_completed, or expired (while in OFFERED state)
    const isCompleted = state === STATE_COMPLETED || state === STATE_CANCEL_COMPLETED
    const isExpired = state === STATE_OFFERED && expiration <= Global.latestTimestamp
    assert(isCompleted || isExpired, ERR_INVALID_STATE)

    const participantKey: ParticipantKey = { id, address: participant }
    assert(this.participants(participantKey).exists)

    const { payor, amount } = this.participants(participantKey).value
    this.participants(participantKey).delete()

    // decrement acceptances to track cleanup progress
    this.offers(id).value.acceptances = acceptances - 1

    // refund the MBR to the original payor
    itxn
      .payment({
        amount,
        receiver: payor,
      })
      .submit()
  }

  /**
   * Cleans up the offer box after all participants have been cleaned up
   * Can only be called when offer is completed, cancelled+completed, or expired
   *
   * @param id the id of the offer
   */
  cleanupOffer(id: uint64) {
    assert(this.offers(id).exists)
    const { state, expiration, acceptances } = this.offers(id).value

    // can only cleanup if completed, cancel_completed, or expired (while in OFFERED state)
    const isCompleted = state === STATE_COMPLETED || state === STATE_CANCEL_COMPLETED
    const isExpired = state === STATE_OFFERED && expiration <= Global.latestTimestamp
    assert(isCompleted || isExpired, ERR_INVALID_STATE)

    // ensure all participant boxes have been cleaned up
    assert(acceptances === 0, 'all participants must be cleaned up first')

    this.offers(id).delete()
  }
}
