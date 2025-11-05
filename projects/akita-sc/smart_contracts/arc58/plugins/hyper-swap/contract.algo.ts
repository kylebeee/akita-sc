import { Account, Application, assert, Asset, bytes, Global, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript"
import { classes } from 'polytype'
import { AbstractedAccount } from "../../account/contract.algo"
import { abiCall, Address } from "@algorandfoundation/algorand-typescript/arc4"
import { BaseHyperSwap } from "../../../hyper-swap/base"
import { HyperSwap } from "../../../hyper-swap/contract.algo"
import { Proof } from "../../../utils/types/merkles"
import { AssetInbox } from "../../../utils/types/asset-inbox"
import { arc58OptInAndSend, getAkitaAppList, getOtherAppList, getPluginAppList, getSpendingAccount, rekeyAddress } from "../../../utils/functions"
import { AkitaBaseContract } from "../../../utils/base-contracts/base"

export class HyperSwapPlugin extends classes(BaseHyperSwap, AkitaBaseContract) {

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private canCallArc58OptIn(appId: Application): boolean {
    return abiCall<typeof AbstractedAccount.prototype.arc58_canCall>({
      appId,
      args: [
        getPluginAppList(this.akitaDAO.value).optin,
        true,
        new Address(Global.currentApplicationAddress),
        '',
        op.bzero(4).toFixed({ length: 4 }),
      ]
    }).returnValue
  }

  // HYPER SWAP PLUGIN METHODS --------------------------------------------------------------------

  offer(
    wallet: Application,
    rekeyBack: boolean,
    root: bytes<32>,
    leaves: uint64,
    participantsRoot: bytes<32>,
    participantLeaves: uint64,
    expiration: uint64
  ) {
    const sender = getSpendingAccount(wallet)

    const costs = this.mbr()
    const metaMerklesCost: uint64 = costs.mm.root + costs.mm.data
    const hyperSwapOfferMBRAmount: uint64 = costs.offers + costs.participants + (metaMerklesCost * 2)
    const appId = Application(getAkitaAppList(this.akitaDAO.value).hyperSwap)

    abiCall<typeof HyperSwap.prototype.offer>({
      sender,
      appId,
      args: [
        itxn.payment({
          sender,
          receiver: appId.address,
          amount: hyperSwapOfferMBRAmount
        }),
        root,
        leaves,
        participantsRoot,
        participantLeaves,
        expiration,
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  accept(
    wallet: Application,
    rekeyBack: boolean,
    id: uint64,
    proof: Proof
  ) {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).hyperSwap)

    abiCall<typeof HyperSwap.prototype.accept>({
      sender,
      appId,
      args: [
        itxn.payment({
          sender,
          receiver: appId.address,
          amount: this.mbr().participants
        }),
        id,
        proof,
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  escrow(
    wallet: Application,
    rekeyBack: boolean,
    id: uint64,
    receiver: Address,
    amount: uint64,
    proof: Proof
  ) {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).hyperSwap)

    abiCall<typeof HyperSwap.prototype.escrow>({
      sender,
      appId,
      args: [
        itxn.payment({
          sender,
          receiver: appId.address,
          amount: amount + this.mbr().hashes
        }),
        id,
        receiver,
        amount,
        proof,
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  escrowAsa(
    wallet: Application,
    rekeyBack: boolean,
    id: uint64,
    receiver: Address,
    asset: uint64,
    amount: uint64,
    proof: Proof
  ) {
    const sender = getSpendingAccount(wallet)

    let mbrAmount = this.mbr().hashes

    if (!receiver.native.isOptedIn(Asset(asset))) {
      const assetInbox = getOtherAppList(this.akitaDAO.value).assetInbox
      const canCallData = abiCall<typeof AssetInbox.prototype.arc59_getSendAssetInfo>({
        appId: assetInbox,
        args: [receiver, asset]
      }).returnValue

      const mbr = canCallData.mbr
      const receiverAlgoNeededForClaim = canCallData.receiverAlgoNeededForClaim

      if (mbr || receiverAlgoNeededForClaim) {
        mbrAmount += canCallData.mbr + canCallData.receiverAlgoNeededForClaim
      }
    }

    const hyperSwapApp = Application(getAkitaAppList(this.akitaDAO.value).hyperSwap)

    if (!hyperSwapApp.address.isOptedIn(Asset(asset))) {
      mbrAmount += Global.assetOptInMinBalance
    }

    abiCall<typeof HyperSwap.prototype.escrowAsa>({
      sender,
      appId: hyperSwapApp,
      args: [
        itxn.payment({
          sender,
          receiver: hyperSwapApp.address,
          amount: mbrAmount
        }),
        itxn.assetTransfer({
          sender,
          assetReceiver: hyperSwapApp.address,
          assetAmount: amount,
          xferAsset: asset
        }),
        id,
        receiver,
        asset,
        amount,
        proof,
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  disburse(
    wallet: Application,
    rekeyBack: boolean,
    id: uint64,
    receiverWallet: Application,
    receiver: Account,
    asset: uint64,
    amount: uint64
  ) {
    const sender = getSpendingAccount(wallet)

    // if we can and need to opt the receiver in ahead of time
    if (receiverWallet.id !== 0) {
      assert(receiverWallet.address === receiver, 'receiverAppID address mismatch')
      if (!receiverWallet.address.isOptedIn(Asset(asset))) {
        const canCallArc58OptIn = this.canCallArc58OptIn(receiverWallet)
        if (canCallArc58OptIn) {
          arc58OptInAndSend(this.akitaDAO.value, receiverWallet, '', [asset], [0])
        }
      }
    }

    abiCall<typeof HyperSwap.prototype.disburse>({
      sender,
      appId: Application(getAkitaAppList(this.akitaDAO.value).hyperSwap),
      args: [
        id,
        receiver,
        asset,
        amount,
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  cancel(
    wallet: Application,
    rekeyBack: boolean,
    id: uint64,
    proof: Proof
  ) {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof HyperSwap.prototype.cancel>({
      sender,
      appId: Application(getAkitaAppList(this.akitaDAO.value).hyperSwap),
      args: [id, proof],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }
}