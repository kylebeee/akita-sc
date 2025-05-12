import { Account, Application, assert, Asset, Global, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript"
import { ServiceFactoryContract } from "../../../utils/base-contracts/factory"
import { classes } from 'polytype'
import { AbstractedAccount } from "../../account/contract.algo"
import { abiCall, Address, StaticBytes } from "@algorandfoundation/algorand-typescript/arc4"
import { BaseHyperSwap } from "../../../hyper-swap/base"
import { HyperSwap } from "../../../hyper-swap/contract.algo"
import { Proof } from "../../../utils/types/merkles"
import { AssetInbox } from "../../../utils/types/asset-inbox"
import { arc58OptInAndSend, getAccounts, getAkitaAppList, getOtherAppList, getPluginAppList, getSpendingAccount, getSwapFees, getUserImpact, impactRange, rekeyAddress } from "../../../utils/functions"

export class HyperSwapPlugin extends classes(BaseHyperSwap, ServiceFactoryContract) {

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private canCallArc58OptIn(walletAppID: Application): boolean {
    return abiCall(
      AbstractedAccount.prototype.arc58_canCall,
      {
        appId: walletAppID,
        args: [
          getPluginAppList(this.akitaDAO.value).optin,
          new Address(Global.currentApplicationAddress),
          new StaticBytes<4>(op.bzero(4))
        ],
        fee: 0,
      }
    ).returnValue
  }

  private getOfferFee(address: Account): uint64 {
    const impact = getUserImpact(this.akitaDAO.value, address)
    const { HyperSwapImpactTaxMin, HyperSwapImpactTaxMax } = getSwapFees(this.akitaDAO.value)
    return impactRange(impact, HyperSwapImpactTaxMin, HyperSwapImpactTaxMax)
  }

  // HYPER SWAP PLUGIN METHODS --------------------------------------------------------------------

  offer(
    walletID: uint64,
    rekeyBack: boolean,
    root: StaticBytes<32>,
    leaves: uint64,
    participantsRoot: StaticBytes<32>,
    participantLeaves: uint64,
    expiration: uint64
  ) {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)

    const costs = this.mbr()
    const metaMerklesCost: uint64 = costs.mm.root + costs.mm.data
    const hyperSwapOfferMBRAmount: uint64 = costs.offers + costs.participants + (metaMerklesCost * 2)
    const offerFee = this.getOfferFee(origin)
    const hyperSwapApp = Application(getAkitaAppList(this.akitaDAO.value).hyperSwap)

    abiCall(
      HyperSwap.prototype.offer,
      {
        sender,
        appId: hyperSwapApp,
        args: [
          itxn.payment({
            sender,
            receiver: hyperSwapApp.address,
            amount: hyperSwapOfferMBRAmount + offerFee,
            fee: 0,
          }),
          root,
          leaves,
          participantsRoot,
          participantLeaves,
          expiration,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  accept(
    walletID: uint64,
    rekeyBack: boolean,
    id: uint64,
    proof: Proof
  ) {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const hyperSwapApp = Application(getAkitaAppList(this.akitaDAO.value).hyperSwap)

    abiCall(
      HyperSwap.prototype.accept,
      {
        sender, 
        appId: hyperSwapApp,
        args: [
          itxn.payment({
            sender,
            receiver: hyperSwapApp.address,
            amount: this.mbr().participants,
            fee: 0,
          }),
          id,
          proof,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0
      }
    )
  }

  escrow(
    walletID: uint64,
    rekeyBack: boolean,
    id: uint64,
    receiver: Address,
    amount: uint64,
    proof: Proof
  ) {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const hyperSwapApp = Application(getAkitaAppList(this.akitaDAO.value).hyperSwap)

    abiCall(
      HyperSwap.prototype.escrow,
      {
        sender,
        appId: hyperSwapApp,
        args: [
          itxn.payment({
            sender,
            receiver: hyperSwapApp.address,
            amount: amount + this.mbr().hashes,
            fee: 0,
          }),
          id,
          receiver,
          amount,
          proof,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  escrowAsa(
    walletID: uint64,
    rekeyBack: boolean,
    id: uint64,
    receiver: Address,
    asset: uint64,
    amount: uint64,
    proof: Proof
  ) {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    let mbrAmount = this.mbr().hashes

    if (!receiver.native.isOptedIn(Asset(asset))) {
      const assetInbox = getOtherAppList(this.akitaDAO.value).assetInbox
      const canCallData = abiCall(
        AssetInbox.prototype.arc59_getSendAssetInfo,
        {
          appId: assetInbox,
          args: [receiver, asset],
          fee: 0,
        }
      ).returnValue

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

    abiCall(
      HyperSwap.prototype.escrowAsa,
      {
        sender,
        appId: hyperSwapApp,
        args: [
          itxn.payment({
            sender,
            receiver: hyperSwapApp.address,
            amount: mbrAmount,
            fee: 0,
          }),
          itxn.assetTransfer({
            sender,
            assetReceiver: hyperSwapApp.address,
            assetAmount: amount,
            xferAsset: asset,
            fee: 0,
          }),
          id,
          receiver,
          asset,
          amount,
          proof,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  disburse(
    walletID: uint64,
    rekeyBack: boolean,
    id: uint64,
    receiverAppID: uint64,
    receiver: Address,
    asset: uint64,
    amount: uint64
  ) {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    // if we can and need to opt the receiver in ahead of time
    if (receiverAppID !== 0) {
      const receiverApp = Application(receiverAppID)
      assert(receiverApp.address === receiver.native, 'receiverAppID address mismatch')
      if (!receiverApp.address.isOptedIn(Asset(asset))) {
        const canCallArc58OptIn = this.canCallArc58OptIn(receiverApp)
        if (canCallArc58OptIn) {
          arc58OptInAndSend(
            this.akitaDAO.value,
            receiverAppID,
            { asset: Asset(asset), amount: 0 }
          )
        }
      }
    }

    abiCall(
      HyperSwap.prototype.disburse,
      {
        sender,
        appId: Application(getAkitaAppList(this.akitaDAO.value).hyperSwap),
        args: [
          id,
          receiver,
          asset,
          amount,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  cancel(
    walletID: uint64,
    rekeyBack: boolean,
    id: uint64,
    proof: Proof
  ) {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      HyperSwap.prototype.cancel,
      {
        sender,
        appId: Application(getAkitaAppList(this.akitaDAO.value).hyperSwap),
        args: [id, proof],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }
}