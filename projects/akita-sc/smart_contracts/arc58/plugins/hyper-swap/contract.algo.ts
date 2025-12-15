import { Account, Application, Asset, bytes, Global, itxn, uint64 } from "@algorandfoundation/algorand-typescript"
import { abiCall, abimethod } from "@algorandfoundation/algorand-typescript/arc4"
import { classes } from 'polytype'
import { getAkitaAppList, getSpendingAccount, rekeyAddress } from "../../../utils/functions"
import { Proof } from "../../../utils/types/merkles"

// CONTRACT IMPORTS
import { BaseHyperSwap } from "../../../hyper-swap/base"
import type { HyperSwap } from "../../../hyper-swap/contract.algo"
import { AkitaBaseContract } from "../../../utils/base-contracts/base"

export class HyperSwapPlugin extends classes(BaseHyperSwap, AkitaBaseContract) {

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: Application): void {
    this.version.value = version
    this.akitaDAO.value = akitaDAO
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
    receiver: Account,
    asset: uint64,
    amount: uint64,
    proof: Proof
  ) {
    const sender = getSpendingAccount(wallet)
    const hyperSwapApp = Application(getAkitaAppList(this.akitaDAO.value).hyperSwap)

    if (asset === 0) {
      // ALGO escrow
      abiCall<typeof HyperSwap.prototype.escrow>({
        sender,
        appId: hyperSwapApp,
        args: [
          itxn.payment({
            sender,
            receiver: hyperSwapApp.address,
            amount: amount + this.mbr().hashes
          }),
          id,
          receiver,
          amount,
          proof,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      })
    } else {
      // ASA escrow
      let mbrAmount = this.mbr().hashes

      // collect opt-in MBR if receiver is not opted into the asset
      if (!receiver.isOptedIn(Asset(asset))) {
        mbrAmount += Global.assetOptInMinBalance
      }

      // collect opt-in MBR if HyperSwap contract needs to opt in
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
  }

  disburse(
    wallet: Application,
    rekeyBack: boolean,
    id: uint64,
    receiverWallet: uint64,
    receiver: Account,
    asset: uint64,
    amount: uint64
  ) {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof HyperSwap.prototype.disburse>({
      sender,
      appId: Application(getAkitaAppList(this.akitaDAO.value).hyperSwap),
      args: [
        id,
        receiverWallet,
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

  withdraw(
    wallet: Application,
    rekeyBack: boolean,
    id: uint64,
    receiver: Account,
    asset: uint64,
    amount: uint64,
    proof: Proof
  ) {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof HyperSwap.prototype.withdraw>({
      sender,
      appId: Application(getAkitaAppList(this.akitaDAO.value).hyperSwap),
      args: [id, receiver, asset, amount, proof],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }
}