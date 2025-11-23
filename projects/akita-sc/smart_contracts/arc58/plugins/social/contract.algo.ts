import { Account, Application, Asset, Bytes, bytes, itxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, encodeArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import { itob } from '@algorandfoundation/algorand-typescript/op'
import { classes } from 'polytype'
import { GateMustCheckAbiMethod } from '../../../gates/constants'
import { GateArgs } from '../../../gates/types'
import { AmendmentMBR, TipSendTypeARC58, TipSendTypeARC59 } from '../../../social/constants'
import { getAccounts, getAkitaAppList, getAkitaAssets, getSocialFees, getSpendingAccount, rekeyAddress } from '../../../utils/functions'
import { CID } from '../../../utils/types/base'

// CONTRACT IMPORTS
import { BaseSocial } from '../../../social/base'
import type { AkitaSocial } from '../../../social/contract.algo'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'


export class AkitaSocialPlugin extends classes(BaseSocial, AkitaBaseContract) {

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64, escrow: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // AKITA SOCIAL PLUGIN METHODS ------------------------------------------------------------------

  post(
    wallet: Application,
    rekeyBack: boolean,
    cid: CID,
    gateID: uint64,
    usePayWall: boolean,
    payWallID: uint64
  ): void {
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

    abiCall<typeof AkitaSocial.prototype.post>({
      sender,
      appId: akitaSocial,
      args: [
        mbrPayment,
        tip,
        cid,
        gateID,
        usePayWall,
        payWallID
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  editPost(
    wallet: Application,
    rekeyBack: boolean,
    cid: CID,
    gateID: uint64,
    amendment: bytes<32>
  ): void {
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

    abiCall<typeof AkitaSocial.prototype.editPost>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        cid,
        amendment
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  gatedReplyPost(
    wallet: Application,
    rekeyBack: boolean,
    cid: CID,
    ref: bytes<32>,
    gateID: uint64,
    args: GateArgs,
    usePayWall: boolean,
    payWallID: uint64
  ): void {
    const { origin, sender } = getAccounts(wallet)

    const { social, gate } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const info = abiCall<typeof AkitaSocial.prototype.getPostAndCreatorMeta>({
      sender,
      appId: social,
      args: [ref]
    }).returnValue

    const creator = info.post.creator
    const creatorWallet = info.meta.wallet
    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))

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

    // We're forced to manually construct an app call here because the abiCall<typeof Gate.prototype.mustCheck>
    // method immediately invokes & is not passable as an arg to the other call
    const gateTxn = itxn.applicationCall({
      sender,
      appId: gate,
      appArgs: [
        methodSelector(GateMustCheckAbiMethod),
        origin,
        info.post.gateID,
        encodeArc4(args)
      ]
    })

    abiCall<typeof AkitaSocial.prototype.gatedReplyPost>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        gateTxn,
        cid,
        ref,
        gateID,
        usePayWall,
        payWallID
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  replyPost(
    wallet: Application,
    rekeyBack: boolean,
    cid: CID,
    ref: bytes<32>,
    gateID: uint64,
    usePayWall: boolean,
    payWallID: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const info = abiCall<typeof AkitaSocial.prototype.getPostAndCreatorMeta>({
      sender,
      appId: social,
      args: [ref]
    }).returnValue

    const creator = info.post.creator
    const creatorWallet = info.meta.wallet
    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))

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

    abiCall<typeof AkitaSocial.prototype.replyPost>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        cid,
        ref,
        gateID,
        usePayWall,
        payWallID
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  replyAsset(
    wallet: Application,
    rekeyBack: boolean,
    cid: CID,
    ref: uint64,
    gateID: uint64,
    usePayWall: boolean,
    payWallID: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const postExists = abiCall<typeof AkitaSocial.prototype.postExists>({
      sender,
      appId: social,
      args: [itob(ref)]
    }).returnValue

    if (!postExists) {
      mbrAmount += posts
    }

    const creator = Asset(ref).creator
    const creatorWallet = abiCall<typeof AkitaSocial.prototype.getMetaWallet>({
      sender,
      appId: social,
      args: [creator]
    }).returnValue

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))
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

    abiCall<typeof AkitaSocial.prototype.replyAsset>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        cid,
        ref,
        gateID,
        usePayWall,
        payWallID
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  gatedReplyAddress(
    wallet: Application,
    rekeyBack: boolean,
    cid: CID,
    ref: Account,
    gateID: uint64,
    args: GateArgs,
    usePayWall: boolean,
    payWallID: uint64
  ): void {
    const { origin, sender } = getAccounts(wallet)

    const { social, gate } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const info = abiCall<typeof AkitaSocial.prototype.getPostAndCreatorMeta>({
      sender,
      appId: social,
      args: [ref.bytes]
    }).returnValue

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, ref, Application(info.meta.wallet))
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
        methodSelector(GateMustCheckAbiMethod),
        origin,
        info.meta.addressGateID,
        encodeArc4(args)
      ]
    })

    abiCall<typeof AkitaSocial.prototype.gatedReplyAddress>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        gateTxn,
        cid,
        ref,
        gateID,
        usePayWall,
        payWallID
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  replyAddress(
    wallet: Application,
    rekeyBack: boolean,
    cid: CID,
    ref: Account,
    gateID: uint64,
    usePayWall: boolean,
    payWallID: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const postExists = abiCall<typeof AkitaSocial.prototype.postExists>({
      sender,
      appId: social,
      args: [ref.bytes]
    }).returnValue

    let creatorWallet: uint64 = 0
    if (!postExists) {
      mbrAmount += this.mbr(Bytes('')).posts
    } else {
      const info = abiCall<typeof AkitaSocial.prototype.getPostAndCreatorMeta>({
        sender,
        appId: social,
        args: [ref.bytes]
      }).returnValue
      creatorWallet = info.meta.wallet
    }

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, ref, Application(creatorWallet))
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

    abiCall<typeof AkitaSocial.prototype.replyAddress>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        cid,
        ref,
        gateID,
        usePayWall,
        payWallID
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  replyApp(
    wallet: Application,
    rekeyBack: boolean,
    cid: CID,
    ref: uint64,
    gateID: uint64,
    usePayWall: boolean,
    payWallID: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const postExists = abiCall<typeof AkitaSocial.prototype.postExists>({
      sender,
      appId: social,
      args: [itob(ref)]
    }).returnValue

    if (!postExists) {
      mbrAmount += posts
    }

    let creator = Application(ref).creator
    const creatorWallet = abiCall<typeof AkitaSocial.prototype.getMetaWallet>({
      sender,
      appId: social,
      args: [creator]
    }).returnValue

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))
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

    abiCall<typeof AkitaSocial.prototype.replyApp>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        cid,
        ref,
        gateID,
        usePayWall,
        payWallID
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  gatedEditReply(
    wallet: Application,
    rekeyBack: boolean,
    cid: CID,
    amendment: bytes<32>,
    args: GateArgs
  ): void {
    const { origin, sender } = getAccounts(wallet)

    const { social, gate } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const postBeingAmended = abiCall<typeof AkitaSocial.prototype.getPost>({
      sender,
      appId: social,
      args: [amendment]
    }).returnValue

    const originalPostRef = postBeingAmended.ref.slice(0, 32).toFixed({ length: 32 })

    const info = abiCall<typeof AkitaSocial.prototype.getPostAndCreatorMeta>({
      sender,
      appId: social,
      args: [originalPostRef]
    }).returnValue

    const creator = info.post.creator
    const creatorWallet = info.meta.wallet

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))
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
        methodSelector(GateMustCheckAbiMethod),
        origin,
        info.post.gateID,
        encodeArc4(args)
      ]
    })

    abiCall<typeof AkitaSocial.prototype.gatedEditReply>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        gateTxn,
        cid,
        amendment
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  editReply(
    wallet: Application,
    rekeyBack: boolean,
    cid: CID,
    amendment: bytes<32>
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const postBeingAmended = abiCall<typeof AkitaSocial.prototype.getPost>({
      sender,
      appId: social,
      args: [amendment]
    }).returnValue

    const originalPostRef = postBeingAmended.ref.slice(0, 32).toFixed({ length: 32 })

    const info = abiCall<typeof AkitaSocial.prototype.getPostAndCreatorMeta>({
      sender,
      appId: social,
      args: [originalPostRef]
    }).returnValue

    const creator = info.post.creator
    const creatorWallet = info.meta.wallet

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))
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

    abiCall<typeof AkitaSocial.prototype.editReply>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        cid,
        amendment
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  votePost(
    wallet: Application,
    rekeyBack: boolean,
    ref: bytes<32>,
    isUp: boolean
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    let mbrAmount: uint64 = this.mbr(Bytes('')).votelist

    if (isUp) {
      const info = abiCall<typeof AkitaSocial.prototype.getPostAndCreatorMeta>({
        sender,
        appId: social,
        args: [ref]
      }).returnValue

      const creator = info.post.creator
      const creatorWallet = info.meta.wallet
      const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))

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

    abiCall<typeof AkitaSocial.prototype.votePost>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        ref,
        isUp
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  voteAsset(
    wallet: Application,
    rekeyBack: boolean,
    ref: uint64,
    isUp: boolean
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    let mbrAmount: uint64 = this.mbr(Bytes('')).votelist

    if (isUp) {
      const postExists = abiCall<typeof AkitaSocial.prototype.postExists>({
        sender,
        appId: social,
        args: [itob(ref)]
      }).returnValue

      if (!postExists) {
        mbrAmount += this.mbr(Bytes('')).posts
      }

      const creator = Asset(ref).creator
      const creatorWallet = abiCall<typeof AkitaSocial.prototype.getMetaWallet>({
        sender,
        appId: social,
        args: [creator]
      }).returnValue

      const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))
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

    abiCall<typeof AkitaSocial.prototype.voteAsset>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        ref,
        isUp
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  voteAddress(
    wallet: Application,
    rekeyBack: boolean,
    ref: Account,
    isUp: boolean
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    let mbrAmount: uint64 = this.mbr(Bytes('')).votelist

    if (isUp) {
      const postExists = abiCall<typeof AkitaSocial.prototype.postExists>({
        sender,
        appId: social,
        args: [ref.bytes]
      }).returnValue

      let creatorWallet: uint64 = 0
      if (!postExists) {
        mbrAmount += this.mbr(Bytes('')).posts
      } else {
        const info = abiCall<typeof AkitaSocial.prototype.getPostAndCreatorMeta>({
          sender,
          appId: social,
          args: [ref.bytes]
        }).returnValue
        creatorWallet = info.meta.wallet
      }

      const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, ref, Application(creatorWallet))
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

    abiCall<typeof AkitaSocial.prototype.voteAddress>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        ref,
        isUp
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  voteApp(
    wallet: Application,
    rekeyBack: boolean,
    ref: uint64,
    isUp: boolean
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { votelist, posts } = this.mbr(Bytes(''))
    let mbrAmount: uint64 = votelist

    if (isUp) {
      const postExists = abiCall<typeof AkitaSocial.prototype.postExists>({
        sender,
        appId: social,
        args: [itob(ref)]
      }).returnValue

      if (!postExists) {
        mbrAmount += posts
      }

      const creator = Asset(ref).creator
      const creatorWallet = abiCall<typeof AkitaSocial.prototype.getMetaWallet>({
        sender,
        appId: social,
        args: [creator]
      }).returnValue

      const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))
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

    abiCall<typeof AkitaSocial.prototype.voteApp>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        ref,
        isUp
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  editVote(
    wallet: Application,
    rekeyBack: boolean,
    ref: bytes<32>,
    flip: boolean
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    const { isUp: wasUp } = abiCall<typeof AkitaSocial.prototype.getVote>({
      sender,
      appId: social,
      args: [ref],
    }).returnValue

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
        const info = abiCall<typeof AkitaSocial.prototype.getPostAndCreatorMeta>({
          sender,
          appId: social,
          args: [ref],
        }).returnValue

        const creator = info.post.creator
        const creatorWallet = info.meta.wallet
        const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))

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

    abiCall<typeof AkitaSocial.prototype.editVote>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        ref,
        flip
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  gatedReactPost(
    wallet: Application,
    rekeyBack: boolean,
    ref: bytes<32>,
    NFT: uint64,
    args: GateArgs
  ): void {
    const { origin, sender } = getAccounts(wallet)

    const { social, gate } = getAkitaAppList(this.akitaDAO.value)

    const { post, meta, reactionExists } = abiCall<typeof AkitaSocial.prototype.getPostMeta>({
      sender,
      appId: social,
      args: [ref, NFT]
    }).returnValue

    const { reactions, reactionlist } = this.mbr(Bytes(''))

    let mbrAmount: uint64 = reactionExists
      ? reactionlist
      : reactions + reactionlist

    const creator = post.creator
    const creatorWallet = meta.wallet
    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))

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
        methodSelector(GateMustCheckAbiMethod),
        origin,
        post.gateID,
        encodeArc4(args)
      ]
    })

    abiCall<typeof AkitaSocial.prototype.gatedReactPost>({
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
    })
  }

  reactPost(
    wallet: Application,
    rekeyBack: boolean,
    ref: bytes<32>,
    NFT: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    const { post, meta, reactionExists } = abiCall<typeof AkitaSocial.prototype.getPostMeta>({
      sender,
      appId: social,
      args: [ref, NFT]
    }).returnValue

    const { reactions, reactionlist } = this.mbr(Bytes(''))

    let mbrAmount: uint64 = reactionExists
      ? reactionlist
      : reactions + reactionlist

    const creator = post.creator
    const creatorWallet = meta.wallet
    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))

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

    abiCall<typeof AkitaSocial.prototype.reactPost>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        ref,
        NFT
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  reactAsset(
    wallet: Application,
    rekeyBack: boolean,
    ref: uint64,
    NFT: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { posts, reactions, reactionlist } = this.mbr(Bytes(''))
    let mbrAmount: uint64 = reactionlist

    const creator = Asset(ref).creator
    const { postExists, reactionExists, creatorWallet } = abiCall<typeof AkitaSocial.prototype.reactionMeta>({
      sender,
      appId: social,
      args: [itob(ref), NFT, creator]
    }).returnValue

    if (!postExists) {
      mbrAmount += posts
    }

    if (!reactionExists) {
      mbrAmount += reactions
    }

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))

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

    abiCall<typeof AkitaSocial.prototype.reactAsset>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        ref,
        NFT
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  gatedReactAddress(
    wallet: Application,
    rekeyBack: boolean,
    ref: Account,
    NFT: uint64,
    args: GateArgs
  ): void {
    const { origin, sender } = getAccounts(wallet)

    const { social, gate } = getAkitaAppList(this.akitaDAO.value)

    const { posts, reactions, reactionlist } = this.mbr(Bytes(''))
    let mbrAmount: uint64 = reactionlist

    const { postExists, reactionExists, creatorWallet, addressGateID } = abiCall<typeof AkitaSocial.prototype.reactionMeta>({
      sender,
      appId: social,
      args: [ref.bytes, NFT, ref]
    }).returnValue

    if (!postExists) {
      mbrAmount += posts
    }

    if (!reactionExists) {
      mbrAmount += reactions
    }

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, ref, Application(creatorWallet))

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
        methodSelector(GateMustCheckAbiMethod),
        origin,
        addressGateID,
        encodeArc4(args)
      ]
    })

    abiCall<typeof AkitaSocial.prototype.gatedReactAddress>({
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
    })
  }

  reactAddress(
    wallet: Application,
    rekeyBack: boolean,
    ref: Account,
    NFT: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    const { posts, reactions, reactionlist } = this.mbr(Bytes(''))
    let mbrAmount: uint64 = reactionlist

    const { postExists, reactionExists, creatorWallet } = abiCall<typeof AkitaSocial.prototype.reactionMeta>({
      sender,
      appId: social,
      args: [ref.bytes, NFT, ref]
    }).returnValue

    if (!postExists) {
      mbrAmount += posts
    }

    if (!reactionExists) {
      mbrAmount += reactions
    }

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, ref, Application(creatorWallet))

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

    abiCall<typeof AkitaSocial.prototype.reactAddress>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        ref,
        NFT
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  reactApp(
    wallet: Application,
    rekeyBack: boolean,
    ref: uint64,
    NFT: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)
    const { posts, reactions, reactionlist } = this.mbr(Bytes(''))
    let mbrAmount: uint64 = reactionlist

    const creator = Application(ref).creator
    const { postExists, reactionExists, creatorWallet } = abiCall<typeof AkitaSocial.prototype.reactionMeta>({
      sender,
      appId: social,
      args: [itob(ref), NFT, creator]
    }).returnValue

    if (!postExists) {
      mbrAmount += posts
    }

    if (!reactionExists) {
      mbrAmount += reactions
    }

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))

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

    abiCall<typeof AkitaSocial.prototype.reactApp>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        ref,
        NFT
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  deleteReaction(
    wallet: Application,
    rekeyBack: boolean,
    ref: bytes<32>,
    NFT: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocial.prototype.deleteReaction>({
      sender,
      appId: social,
      args: [ref, NFT],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  gatedFollow(
    wallet: Application,
    rekeyBack: boolean,
    address: Account,
    args: GateArgs
  ): void {
    const { origin, sender } = getAccounts(wallet)

    const { social, gate } = getAkitaAppList(this.akitaDAO.value)

    const { followGateID } = abiCall<typeof AkitaSocial.prototype.getMeta>({
      sender,
      appId: social,
      args: [address]
    }).returnValue

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: this.mbr(Bytes('')).follows
    })

    const gateTxn = itxn.applicationCall({
      sender,
      appId: gate,
      appArgs: [
        methodSelector(GateMustCheckAbiMethod),
        origin,
        followGateID,
        encodeArc4(args)
      ]
    })

    abiCall<typeof AkitaSocial.prototype.gatedFollow>({
      sender,
      appId: gate,
      args: [
        mbrPayment,
        gateTxn,
        address
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  follow(
    wallet: Application,
    rekeyBack: boolean,
    address: Account
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social, gate } = getAkitaAppList(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: this.mbr(Bytes('')).follows
    })

    abiCall<typeof AkitaSocial.prototype.follow>({
      sender,
      appId: gate,
      args: [
        mbrPayment,
        address
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  unfollow(
    wallet: Application,
    rekeyBack: boolean,
    address: Account,
    index: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocial.prototype.unfollow>({
      sender,
      appId: social,
      args: [address, index],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  // we dont remove followers because that requires us to know the index
  // instead, blocking supersedes following
  block(
    wallet: Application,
    rekeyBack: boolean,
    address: Account
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: this.mbr(Bytes('')).blocks
    })

    abiCall<typeof AkitaSocial.prototype.block>({
      sender,
      appId: social,
      args: [mbrPayment, address],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  unblock(
    wallet: Application,
    rekeyBack: boolean,
    address: Account
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocial.prototype.unblock>({
      sender,
      appId: social,
      args: [address],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  addModerator(
    wallet: Application,
    rekeyBack: boolean,
    address: Account
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: this.mbr(Bytes('')).moderators
    })

    abiCall<typeof AkitaSocial.prototype.addModerator>({
      sender,
      appId: social,
      args: [mbrPayment, address],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })

  }

  removeModerator(
    wallet: Application,
    rekeyBack: boolean,
    address: Account
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocial.prototype.removeModerator>({
      sender,
      appId: social,
      args: [address],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  ban(
    wallet: Application,
    rekeyBack: boolean,
    address: Account,
    expiration: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: this.mbr(Bytes('')).banned
    })

    abiCall<typeof AkitaSocial.prototype.ban>({
      sender,
      appId: social,
      args: [mbrPayment, address, expiration],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  flagPost(
    wallet: Application,
    rekeyBack: boolean,
    ref: bytes<32>
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocial.prototype.flagPost>({
      sender,
      appId: social,
      args: [ref],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  unflagPost(
    wallet: Application,
    rekeyBack: boolean,
    ref: bytes<32>
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocial.prototype.unflagPost>({
      sender,
      appId: social,
      args: [ref],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  unban(
    wallet: Application,
    rekeyBack: boolean,
    address: Account
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocial.prototype.unban>({
      sender,
      appId: social,
      args: [address],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  addAction(
    wallet: Application,
    rekeyBack: boolean,
    actionAppID: uint64,
    content: CID
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: this.mbr(Bytes('')).actions
    })

    abiCall<typeof AkitaSocial.prototype.addAction>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        actionAppID,
        content
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  removeAction(
    wallet: Application,
    rekeyBack: boolean,
    actionAppID: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocial.prototype.removeAction>({
      sender,
      appId: social,
      args: [actionAppID],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  initMeta(
    wallet: Application,
    rekeyBack: boolean,
    user: Account,
    automated: boolean,
    subscriptionIndex: uint64,
    NFD: uint64,
    akitaNFT: uint64
  ): uint64 {

    // TODO: ????

    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    const impact = abiCall<typeof AkitaSocial.prototype.initMeta>({
      sender,
      appId: social,
      args: [
        itxn.payment({}),
        user,
        automated,
        subscriptionIndex,
        NFD,
        akitaNFT
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    }).returnValue

    return impact
  }

  updateMeta(
    wallet: Application,
    rekeyBack: boolean,
    followGateID: uint64,
    addressGateID: uint64,
    subscriptionIndex: uint64,
    NFD: uint64,
    akitaNFT: uint64,
    defaultPayWallID: uint64
  ): void {

    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocial.prototype.updateMeta>({
      sender,
      appId: social,
      args: [
        followGateID,
        addressGateID,
        subscriptionIndex,
        NFD,
        akitaNFT,
        defaultPayWallID
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }
}