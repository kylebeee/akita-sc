import { Application, Asset, Bytes, bytes, gtxn, itxn, itxnCompose, OnCompleteAction, op, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, encodeArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import { CID } from '../../../utils/types/base'

import { getAccounts, getAkitaAppList, getAkitaAssets, getSocialFees, getSpendingAccount, rekeyAddress } from '../../../utils/functions'
import { AkitaSocial } from '../../../social/contract.algo'
import { classes } from 'polytype'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { BaseSocial } from '../../../social/base'
import { AmendmentMBR, TipSendTypeARC58, TipSendTypeARC59 } from '../../../social/constants'
import { GateArgs, GateInterface } from '../../../utils/types/gates'
import { itob } from '@algorandfoundation/algorand-typescript/op'

export class AkitaSocialPlugin extends classes(BaseSocial, AkitaBaseContract) {

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64, escrow: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // AKITA SOCIAL PLUGIN METHODS ------------------------------------------------------------------

  post(walletID: uint64, rekeyBack: boolean, cid: CID, gateID: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const akitaSocial = Application(getAkitaAppList(this.akitaDAO.value).social)
    const { posts, votes, votelist } = this.mbr(cid)
    const mbrAmount: uint64 = posts + votes + votelist + AmendmentMBR
    const mbrPayment = itxn.payment({
      sender,
      receiver: akitaSocial.address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { postFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: akitaSocial.address,
      xferAsset: akta,
      assetAmount: postFee
    })

    abiCall(
      AkitaSocial.prototype.post,
      {
        sender,
        appId: akitaSocial,
        args: [
          mbrPayment,
          tip,
          cid,
          gateID
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  editPost(
    walletID: uint64,
    rekeyBack: boolean,
    cid: CID,
    gateID: uint64,
    amendment: bytes<32>
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    const mbrAmount: uint64 = posts + votes + votelist + AmendmentMBR
    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { postFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: postFee
    })

    abiCall(
      AkitaSocial.prototype.editPost,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          cid,
          gateID,
          amendment
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  gatedReplyPost(
    walletID: uint64,
    rekeyBack: boolean,
    cid: CID,
    ref: bytes<32>,
    gateID: uint64,
    args: GateArgs
  ): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)

    const { social, gate } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const info = abiCall(
      AkitaSocial.prototype.getPostAndCreatorMeta,
      {
        sender,
        appId: social,
        args: [ref]
      }
    ).returnValue

    const creator = info.post.creator
    const creatorWallet = info.meta.wallet
    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator.native, creatorWallet)

    switch (tipInfo.type) {
      case TipSendTypeARC59: {
        mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
        break
      }
      case TipSendTypeARC58: {
        mbrAmount += tipInfo.arc58
        break
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    const gateTxn = itxn.applicationCall({
      sender,
      appId: gate,
      appArgs: [
        methodSelector(GateInterface.prototype.mustCheck),
        new Address(origin),
        info.post.gateID,
        encodeArc4(args)
      ]
    })

    abiCall(
      AkitaSocial.prototype.gatedReplyPost,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          gateTxn,
          cid,
          ref,
          gateID
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  replyPost(
    walletID: uint64,
    rekeyBack: boolean,
    cid: CID,
    ref: bytes<32>,
    gateID: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const info = abiCall(
      AkitaSocial.prototype.getPostAndCreatorMeta,
      {
        sender,
        appId: social,
        args: [ref]
      }
    ).returnValue

    const creator = info.post.creator
    const creatorWallet = info.meta.wallet
    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator.native, creatorWallet)

    switch (tipInfo.type) {
      case TipSendTypeARC59: {
        mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
        break
      }
      case TipSendTypeARC58: {
        mbrAmount += tipInfo.arc58
        break
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    abiCall(
      AkitaSocial.prototype.replyPost,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          cid,
          ref,
          gateID
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  replyAsset(
    walletID: uint64,
    rekeyBack: boolean,
    cid: CID,
    ref: uint64,
    gateID: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const postExists = abiCall(
      AkitaSocial.prototype.postExists,
      {
        sender,
        appId: social,
        args: [itob(ref)]
      }
    ).returnValue

    if (!postExists) {
      mbrAmount += posts
    }

    const creator = Asset(ref).creator
    const creatorWallet = abiCall(
      AkitaSocial.prototype.getMetaWallet,
      {
        sender,
        appId: social,
        args: [new Address(creator)]
      }
    ).returnValue

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, creatorWallet)
    switch (tipInfo.type) {
      case TipSendTypeARC59: {
        mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
        break
      }
      case TipSendTypeARC58: {
        mbrAmount += tipInfo.arc58
        break
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    abiCall(
      AkitaSocial.prototype.replyAsset,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          cid,
          ref,
          gateID
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  gatedReplyAddress(
    walletID: uint64,
    rekeyBack: boolean,
    cid: CID,
    ref: Address,
    gateID: uint64,
    args: GateArgs
  ): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)

    const { social, gate } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const info = abiCall(
      AkitaSocial.prototype.getPostAndCreatorMeta,
      {
        sender,
        appId: social,
        args: [ref.native.bytes]
      }
    ).returnValue

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, ref.native, info.meta.wallet)
    switch (tipInfo.type) {
      case TipSendTypeARC59: {
        mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
        break
      }
      case TipSendTypeARC58: {
        mbrAmount += tipInfo.arc58
        break
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    const gateTxn = itxn.applicationCall({
      sender,
      appId: gate,
      appArgs: [
        methodSelector(GateInterface.prototype.mustCheck),
        new Address(origin),
        info.meta.addressGateID,
        encodeArc4(args)
      ]
    })

    abiCall(
      AkitaSocial.prototype.gatedReplyAddress,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          gateTxn,
          cid,
          ref,
          gateID
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  replyAddress(walletID: uint64, rekeyBack: boolean, cid: CID, ref: Address, gateID: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const postExists = abiCall(
      AkitaSocial.prototype.postExists,
      {
        sender,
        appId: social,
        args: [ref.native.bytes]
      }
    ).returnValue

    let creatorWallet: uint64 = 0
    if (!postExists) {
      mbrAmount += this.mbr(Bytes('')).posts
    } else {
      const info = abiCall(
        AkitaSocial.prototype.getPostAndCreatorMeta,
        {
          sender,
          appId: social,
          args: [ref.native.bytes]
        }
      ).returnValue
      creatorWallet = info.meta.wallet
    }

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, ref.native, creatorWallet)
    switch (tipInfo.type) {
      case TipSendTypeARC59: {
        mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
        break
      }
      case TipSendTypeARC58: {
        mbrAmount += tipInfo.arc58
        break
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    abiCall(
      AkitaSocial.prototype.replyAddress,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          cid,
          ref,
          gateID
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  replyApp(walletID: uint64, rekeyBack: boolean, cid: CID, ref: uint64, gateID: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const postExists = abiCall(
      AkitaSocial.prototype.postExists,
      {
        sender,
        appId: social,
        args: [itob(ref)]
      }
    ).returnValue

    if (!postExists) {
      mbrAmount += posts
    }

    let creator = Application(ref).creator
    const creatorWallet = abiCall(
      AkitaSocial.prototype.getMetaWallet,
      {
        sender,
        appId: social,
        args: [new Address(creator)]
      }
    ).returnValue

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, creatorWallet)
    switch (tipInfo.type) {
      case TipSendTypeARC59: {
        mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
        break
      }
      case TipSendTypeARC58: {
        mbrAmount += tipInfo.arc58
        break
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    abiCall(
      AkitaSocial.prototype.replyApp,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          cid,
          ref,
          gateID
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  gatedEditReply(
    walletID: uint64,
    rekeyBack: boolean,
    cid: CID,
    gateID: uint64,
    amendment: bytes<32>,
    args: GateArgs
  ): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)

    const { social, gate } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const postBeingAmended = abiCall(
      AkitaSocial.prototype.getPost,
      {
        sender,
        appId: social,
        args: [amendment]
      }
    ).returnValue

    const originalPostRef = postBeingAmended.ref.slice(0, 32).toFixed({ length: 32 })

    const info = abiCall(
      AkitaSocial.prototype.getPostAndCreatorMeta,
      {
        sender,
        appId: social,
        args: [originalPostRef]
      }
    ).returnValue

    const creator = info.post.creator
    const creatorWallet = info.meta.wallet

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator.native, creatorWallet)
    switch (tipInfo.type) {
      case TipSendTypeARC59: {
        mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
        break
      }
      case TipSendTypeARC58: {
        mbrAmount += tipInfo.arc58
        break
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    const gateTxn = itxn.applicationCall({
      sender,
      appId: gate,
      appArgs: [
        methodSelector(GateInterface.prototype.mustCheck),
        new Address(origin),
        info.post.gateID,
        encodeArc4(args)
      ]
    })

    abiCall(
      AkitaSocial.prototype.gatedEditReply,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          gateTxn,
          cid,
          gateID,
          amendment
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  editReply(
    walletID: uint64,
    rekeyBack: boolean,
    cid: CID,
    gateID: uint64,
    amendment: bytes<32>
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const postBeingAmended = abiCall(
      AkitaSocial.prototype.getPost,
      {
        sender,
        appId: social,
        args: [amendment]
      }
    ).returnValue

    const originalPostRef = postBeingAmended.ref.slice(0, 32).toFixed({ length: 32 })

    const info = abiCall(
      AkitaSocial.prototype.getPostAndCreatorMeta,
      {
        sender,
        appId: social,
        args: [originalPostRef]
      }
    ).returnValue

    const creator = info.post.creator
    const creatorWallet = info.meta.wallet

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator.native, creatorWallet)
    switch (tipInfo.type) {
      case TipSendTypeARC59: {
        mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
        break
      }
      case TipSendTypeARC58: {
        mbrAmount += tipInfo.arc58
        break
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    abiCall(
      AkitaSocial.prototype.editReply,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          cid,
          gateID,
          amendment
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  votePost(walletID: uint64, rekeyBack: boolean, ref: bytes<32>, isUp: boolean): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    let mbrAmount: uint64 = this.mbr(Bytes('')).votelist

    if (isUp) {
      const info = abiCall(
        AkitaSocial.prototype.getPostAndCreatorMeta,
        {
          sender,
          appId: social,
          args: [ref]
        }
      ).returnValue

      const creator = info.post.creator
      const creatorWallet = info.meta.wallet
      const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator.native, creatorWallet)

      switch (tipInfo.type) {
        case TipSendTypeARC59: {
          mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
          break
        }
        case TipSendTypeARC58: {
          mbrAmount += tipInfo.arc58
          break
        }
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    abiCall(
      AkitaSocial.prototype.votePost,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          ref,
          isUp
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  voteAsset(walletID: uint64, rekeyBack: boolean, ref: uint64, isUp: boolean): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    let mbrAmount: uint64 = this.mbr(Bytes('')).votelist

    if (isUp) {
      const postExists = abiCall(
        AkitaSocial.prototype.postExists,
        {
          sender,
          appId: social,
          args: [itob(ref)]
        }
      ).returnValue

      if (!postExists) {
        mbrAmount += this.mbr(Bytes('')).posts
      }

      const creator = Asset(ref).creator
      const creatorWallet = abiCall(
        AkitaSocial.prototype.getMetaWallet,
        {
          sender,
          appId: social,
          args: [new Address(creator)]
        }
      ).returnValue

      const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, creatorWallet)
      switch (tipInfo.type) {
        case TipSendTypeARC59: {
          mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
          break
        }
        case TipSendTypeARC58: {
          mbrAmount += tipInfo.arc58
          break
        }
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    abiCall(
      AkitaSocial.prototype.voteAsset,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          ref,
          isUp
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  voteAddress(walletID: uint64, rekeyBack: boolean, ref: Address, isUp: boolean): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    let mbrAmount: uint64 = this.mbr(Bytes('')).votelist

    if (isUp) {
      const postExists = abiCall(
        AkitaSocial.prototype.postExists,
        {
          sender,
          appId: social,
          args: [ref.native.bytes]
        }
      ).returnValue

      let creatorWallet: uint64 = 0
      if (!postExists) {
        mbrAmount += this.mbr(Bytes('')).posts
      } else {
        const info = abiCall(
          AkitaSocial.prototype.getPostAndCreatorMeta,
          {
            sender,
            appId: social,
            args: [ref.native.bytes]
          }
        ).returnValue
        creatorWallet = info.meta.wallet
      }

      const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, ref.native, creatorWallet)
      switch (tipInfo.type) {
        case TipSendTypeARC59: {
          mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
          break
        }
        case TipSendTypeARC58: {
          mbrAmount += tipInfo.arc58
          break
        }
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    abiCall(
      AkitaSocial.prototype.voteAddress,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          ref,
          isUp
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  voteApp(walletID: uint64, rekeyBack: boolean, ref: uint64, isUp: boolean): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { votelist, posts } = this.mbr(Bytes(''))
    let mbrAmount: uint64 = votelist

    if (isUp) {
      const postExists = abiCall(
        AkitaSocial.prototype.postExists,
        {
          sender,
          appId: social,
          args: [itob(ref)]
        }
      ).returnValue

      if (!postExists) {
        mbrAmount += posts
      }

      const creator = Asset(ref).creator
      const creatorWallet = abiCall(
        AkitaSocial.prototype.getMetaWallet,
        {
          sender,
          appId: social,
          args: [new Address(creator)]
        }
      ).returnValue

      const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, creatorWallet)
      switch (tipInfo.type) {
        case TipSendTypeARC59: {
          mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
          break
        }
        case TipSendTypeARC58: {
          mbrAmount += tipInfo.arc58
          break
        }
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    abiCall(
      AkitaSocial.prototype.voteApp,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          ref,
          isUp
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  editVote(walletID: uint64, rekeyBack: boolean, ref: bytes<32>, flip: boolean): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    const { isUp: wasUp } = abiCall(
      AkitaSocial.prototype.getVote,
      {
        sender,
        appId: social,
        args: [ref],
      }
    ).returnValue

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: 0,
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)

    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: 0,
    })

    if (flip) {
      const { reactFee } = getSocialFees(this.akitaDAO.value)
      tip.set({ assetAmount: reactFee })

      // check if the change is going to make us pay the post creator
      // !wasUp means we are flipping from downvote to upvote
      if (!wasUp) {
        const info = abiCall(
          AkitaSocial.prototype.getPostAndCreatorMeta,
          {
            sender,
            appId: social,
            args: [ref],
          }
        ).returnValue

        const creator = info.post.creator
        const creatorWallet = info.meta.wallet
        const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator.native, creatorWallet)

        switch (tipInfo.type) {
          case TipSendTypeARC59: {
            mbrPayment.set({ amount: (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim) })
            break
          }
          case TipSendTypeARC58: {
            mbrPayment.set({ amount: tipInfo.arc58 })
            break
          }
        }
      }
    }

    abiCall(
      AkitaSocial.prototype.editVote,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          ref,
          flip
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      }
    )
  }

  gatedReactPost(
    walletID: uint64,
    rekeyBack: boolean,
    ref: bytes<32>,
    NFT: uint64,
    args: GateArgs
  ): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)

    const { social, gate } = getAkitaAppList(this.akitaDAO.value)

    const { post, meta, reactionExists } = abiCall(
      AkitaSocial.prototype.getPostMeta,
      {
        sender,
        appId: social,
        args: [ref, NFT]
      }
    ).returnValue

    const { reactions, reactionlist } = this.mbr(Bytes(''))

    let mbrAmount: uint64 = reactionExists
      ? reactionlist
      : reactions + reactionlist

    const creator = post.creator
    const creatorWallet = meta.wallet
    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator.native, creatorWallet)

    switch (tipInfo.type) {
      case TipSendTypeARC59: {
        mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
        break
      }
      case TipSendTypeARC58: {
        mbrAmount += tipInfo.arc58
        break
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    const gateTxn = itxn.applicationCall({
      sender,
      appId: gate,
      appArgs: [
        methodSelector(GateInterface.prototype.mustCheck),
        new Address(origin),
        post.gateID,
        encodeArc4(args)
      ]
    })

    abiCall(
      AkitaSocial.prototype.gatedReactPost,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          gateTxn,
          ref,
          NFT
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  reactPost(walletID: uint64, rekeyBack: boolean, ref: bytes<32>, NFT: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    const { post, meta, reactionExists } = abiCall(
      AkitaSocial.prototype.getPostMeta,
      {
        sender,
        appId: social,
        args: [ref, NFT]
      }
    ).returnValue

    const { reactions, reactionlist } = this.mbr(Bytes(''))

    let mbrAmount: uint64 = reactionExists
      ? reactionlist
      : reactions + reactionlist

    const creator = post.creator
    const creatorWallet = meta.wallet
    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator.native, creatorWallet)

    switch (tipInfo.type) {
      case TipSendTypeARC59: {
        mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
        break
      }
      case TipSendTypeARC58: {
        mbrAmount += tipInfo.arc58
        break
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    abiCall(
      AkitaSocial.prototype.reactPost,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          ref,
          NFT
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  reactAsset(walletID: uint64, rekeyBack: boolean, ref: uint64, NFT: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { posts, reactions, reactionlist } = this.mbr(Bytes(''))
    let mbrAmount: uint64 = reactionlist

    const creator = Asset(ref).creator
    const { postExists, reactionExists, creatorWallet } = abiCall(
      AkitaSocial.prototype.reactionMeta,
      {
        sender,
        appId: social,
        args: [itob(ref), NFT, new Address(creator)]
      }
    ).returnValue

    if (!postExists) {
      mbrAmount += posts
    }

    if (!reactionExists) {
      mbrAmount += reactions
    }

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, creatorWallet)

    switch (tipInfo.type) {
      case TipSendTypeARC59: {
        mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
        break
      }
      case TipSendTypeARC58: {
        mbrAmount += tipInfo.arc58
        break
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    abiCall(
      AkitaSocial.prototype.reactAsset,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          ref,
          NFT
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  gatedReactAddress(walletID: uint64, rekeyBack: boolean, ref: Address, NFT: uint64, args: GateArgs): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)

    const { social, gate } = getAkitaAppList(this.akitaDAO.value)

    const { posts, reactions, reactionlist } = this.mbr(Bytes(''))
    let mbrAmount: uint64 = reactionlist

    const { postExists, reactionExists, creatorWallet, addressGateID } = abiCall(
      AkitaSocial.prototype.reactionMeta,
      {
        sender,
        appId: social,
        args: [ref.native.bytes, NFT, ref]
      }
    ).returnValue

    if (!postExists) {
      mbrAmount += posts
    }

    if (!reactionExists) {
      mbrAmount += reactions
    }

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, ref.native, creatorWallet)

    switch (tipInfo.type) {
      case TipSendTypeARC59: {
        mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
        break
      }
      case TipSendTypeARC58: {
        mbrAmount += tipInfo.arc58
        break
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    const gateTxn = itxn.applicationCall({
      sender,
      appId: gate,
      appArgs: [
        methodSelector(GateInterface.prototype.mustCheck),
        new Address(origin),
        addressGateID,
        encodeArc4(args)
      ]
    })

    abiCall(
      AkitaSocial.prototype.gatedReactAddress,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          gateTxn,
          ref,
          NFT
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  reactAddress(walletID: uint64, rekeyBack: boolean, ref: Address, NFT: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    const { posts, reactions, reactionlist } = this.mbr(Bytes(''))
    let mbrAmount: uint64 = reactionlist

    const { postExists, reactionExists, creatorWallet } = abiCall(
      AkitaSocial.prototype.reactionMeta,
      {
        sender,
        appId: social,
        args: [ref.native.bytes, NFT, ref]
      }
    ).returnValue

    if (!postExists) {
      mbrAmount += posts
    }

    if (!reactionExists) {
      mbrAmount += reactions
    }

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, ref.native, creatorWallet)

    switch (tipInfo.type) {
      case TipSendTypeARC59: {
        mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
        break
      }
      case TipSendTypeARC58: {
        mbrAmount += tipInfo.arc58
        break
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    abiCall(
      AkitaSocial.prototype.reactAddress,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          ref,
          NFT
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  reactApp(
    walletID: uint64,
    rekeyBack: boolean,
    ref: uint64,
    NFT: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { posts, reactions, reactionlist } = this.mbr(Bytes(''))
    let mbrAmount: uint64 = reactionlist

    const creator = Application(ref).creator
    const { postExists, reactionExists, creatorWallet } = abiCall(
      AkitaSocial.prototype.reactionMeta,
      {
        sender,
        appId: social,
        args: [itob(ref), NFT, new Address(creator)]
      }
    ).returnValue

    if (!postExists) {
      mbrAmount += posts
    }

    if (!reactionExists) {
      mbrAmount += reactions
    }

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, creatorWallet)

    switch (tipInfo.type) {
      case TipSendTypeARC59: {
        mbrAmount += (tipInfo.arc59.mbr + tipInfo.arc59.receiverAlgoNeededForClaim)
        break
      }
      case TipSendTypeARC58: {
        mbrAmount += tipInfo.arc58
        break
      }
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: mbrAmount
    })

    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const tip = itxn.assetTransfer({
      sender,
      assetReceiver: Application(social).address,
      xferAsset: akta,
      assetAmount: reactFee
    })

    abiCall(
      AkitaSocial.prototype.reactApp,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          tip,
          ref,
          NFT
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  deleteReaction(walletID: uint64, rekeyBack: boolean, ref: bytes<32>, NFT: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall(
      AkitaSocial.prototype.deleteReaction,
      {
        sender,
        appId: social,
        args: [ref, NFT],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  gatedFollow(walletID: uint64, rekeyBack: boolean, address: Address, args: GateArgs): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)

    const { social, gate } = getAkitaAppList(this.akitaDAO.value)

    const { followGateID } = abiCall(
      AkitaSocial.prototype.getMeta,
      {
        sender,
        appId: social,
        args: [address]
      }
    ).returnValue

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: this.mbr(Bytes('')).follows
    })

    const gateTxn = itxn.applicationCall({
      sender,
      appId: gate,
      appArgs: [
        methodSelector(GateInterface.prototype.mustCheck),
        new Address(origin),
        followGateID,
        encodeArc4(args)
      ]
    })

    abiCall(
      AkitaSocial.prototype.gatedFollow,
      {
        sender,
        appId: gate,
        args: [
          mbrPayment,
          gateTxn,
          address
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  follow(walletID: uint64, rekeyBack: boolean, address: Address): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social, gate } = getAkitaAppList(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: this.mbr(Bytes('')).follows
    })

    abiCall(
      AkitaSocial.prototype.follow,
      {
        sender,
        appId: gate,
        args: [
          mbrPayment,
          address
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  unfollow(walletID: uint64, rekeyBack: boolean, address: Address, index: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall(
      AkitaSocial.prototype.unfollow,
      {
        sender,
        appId: social,
        args: [address, index],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  // we dont remove followers because that requires us to know the index
  // instead, blocking supersedes following
  block(walletID: uint64, rekeyBack: boolean, address: Address): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: this.mbr(Bytes('')).blocks
    })

    abiCall(
      AkitaSocial.prototype.block,
      {
        sender,
        appId: social,
        args: [mbrPayment, address],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  unblock(walletID: uint64, rekeyBack: boolean, address: Address): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall(
      AkitaSocial.prototype.unblock,
      {
        sender,
        appId: social,
        args: [address],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  addModerator(walletID: uint64, rekeyBack: boolean, address: Address): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: this.mbr(Bytes('')).moderators
    })

    abiCall(
      AkitaSocial.prototype.addModerator,
      {
        sender,
        appId: social,
        args: [mbrPayment, address],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )

  }

  removeModerator(walletID: uint64, rekeyBack: boolean, address: Address): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall(
      AkitaSocial.prototype.removeModerator,
      {
        sender,
        appId: social,
        args: [address],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  ban(walletID: uint64, rekeyBack: boolean, address: Address, expiration: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: this.mbr(Bytes('')).banned
    })

    abiCall(
      AkitaSocial.prototype.ban,
      {
        sender,
        appId: social,
        args: [mbrPayment, address, expiration],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  flagPost(walletID: uint64, rekeyBack: boolean, ref: bytes<32>): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall(
      AkitaSocial.prototype.flagPost,
      {
        sender,
        appId: social,
        args: [ref],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  unflagPost(walletID: uint64, rekeyBack: boolean, ref: bytes<32>): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall(
      AkitaSocial.prototype.unflagPost,
      {
        sender,
        appId: social,
        args: [ref],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  unban(walletID: uint64, rekeyBack: boolean, address: Address): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall(
      AkitaSocial.prototype.unban,
      {
        sender,
        appId: social,
        args: [address],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  addAction(walletID: uint64, rekeyBack: boolean, actionAppID: uint64, content: CID) {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: this.mbr(Bytes('')).actions
    })

    abiCall(
      AkitaSocial.prototype.addAction,
      {
        sender,
        appId: social,
        args: [
          mbrPayment,
          actionAppID,
          content
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  removeAction(walletID: uint64, rekeyBack: boolean, actionAppID: uint64) {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    
    abiCall(
      AkitaSocial.prototype.removeAction,
      {
        sender,
        appId: social,
        args: [actionAppID],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  initMeta(
    walletID: uint64,
    rekeyBack: boolean,
    automated: boolean,
    subscriptionIndex: uint64,
    NFD: uint64,
    akitaNFT: uint64
  ): uint64 {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    return 0
  }

  updateMeta(
    walletID: uint64,
    rekeyBack: boolean,
    followGateID: uint64,
    addressGateID: uint64,
    subscriptionIndex: uint64,
    NFD: uint64,
    akitaNFT: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall(
      AkitaSocial.prototype.updateMeta,
      {
        sender,
        appId: social,
        args: [
          followGateID,
          addressGateID,
          subscriptionIndex,
          NFD,
          akitaNFT
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  // dummy call to allow for more references
  opUp(): void { }
}