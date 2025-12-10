import { Account, Application, Asset, Bytes, bytes, itxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, encodeArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import { classes } from 'polytype'
import { GateMustCheckAbiMethod } from '../../../gates/constants'
import { GateArgs } from '../../../gates/types'
import { AmendmentMBR, TipSendTypeARC58 } from '../../../social/constants'
import { getAccounts, getAkitaAppList, getAkitaAssets, getAkitaSocialAppList, getSocialFees, getSpendingAccount, rekeyAddress } from '../../../utils/functions'
import { CID } from '../../../utils/types/base'

// CONTRACT IMPORTS
import { BaseSocial } from '../../../social/base'
import type { AkitaSocial } from '../../../social/contract.algo'
import { AkitaSocialGraph } from '../../../social/graph.algo'
import type { AkitaSocialModeration } from '../../../social/moderation.algo'
import { RefType } from '../../../social/types'
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
    timestamp: uint64,
    nonce: bytes<24>,
    cid: CID,
    gateID: uint64,
    usePayWall: boolean,
    payWallID: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const akitaSocial = Application(getAkitaSocialAppList(this.akitaDAO.value).social)
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
        timestamp,
        nonce,
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
    amendment: bytes<32>
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaSocialAppList(this.akitaDAO.value)
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

    // Edit key is derived internally by contract: sha256(creator + originalKey + newCID)
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

  gatedReply(
    wallet: Application,
    rekeyBack: boolean,
    timestamp: uint64,
    nonce: bytes<24>,
    cid: CID,
    ref: bytes,
    type: RefType,
    gateID: uint64,
    args: GateArgs,
    usePayWall: boolean,
    payWallID: uint64
  ): void {
    const { origin, sender } = getAccounts(wallet)

    const { gate } = getAkitaAppList(this.akitaDAO.value)
    const { social } = getAkitaSocialAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const info = abiCall<typeof AkitaSocial.prototype.getPostMeta>({
      sender,
      appId: social,
      args: [ref.toFixed({ length: 32 }), 0]
    }).returnValue

    const creator = info.post.creator
    const creatorWallet = info.meta.wallet
    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))


    if (tipInfo.type === TipSendTypeARC58) {
      mbrAmount += tipInfo.arc58
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

    abiCall<typeof AkitaSocial.prototype.gatedReply>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        gateTxn,
        timestamp,
        nonce,
        cid,
        ref,
        type,
        gateID,
        usePayWall,
        payWallID
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  reply(
    wallet: Application,
    rekeyBack: boolean,
    timestamp: uint64,
    nonce: bytes<24>,
    cid: CID,
    ref: bytes,
    type: RefType,
    gateID: uint64,
    usePayWall: boolean,
    payWallID: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaSocialAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const info = abiCall<typeof AkitaSocial.prototype.getPostMeta>({
      sender,
      appId: social,
      args: [ref.toFixed({ length: 32 }), 0]
    }).returnValue

    const creator = info.post.creator
    const creatorWallet = info.meta.wallet
    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))

    if (tipInfo.type === TipSendTypeARC58) {
      mbrAmount += tipInfo.arc58
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

    abiCall<typeof AkitaSocial.prototype.reply>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        timestamp,
        nonce,
        cid,
        ref,
        type,
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

    const { gate } = getAkitaAppList(this.akitaDAO.value)
    const { social } = getAkitaSocialAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const postBeingAmended = abiCall<typeof AkitaSocial.prototype.getPost>({
      sender,
      appId: social,
      args: [amendment]
    }).returnValue

    const originalPostRef = postBeingAmended.ref.slice(0, 32).toFixed({ length: 32 })

    const info = abiCall<typeof AkitaSocial.prototype.getPostMeta>({
      sender,
      appId: social,
      args: [originalPostRef, 0]
    }).returnValue

    const creator = info.post.creator
    const creatorWallet = info.meta.wallet

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))

    if (tipInfo.type === TipSendTypeARC58) {
      mbrAmount += tipInfo.arc58
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

    // Edit key is derived internally by contract
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

    const { social } = getAkitaSocialAppList(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid)
    let mbrAmount: uint64 = posts + votes + votelist

    const postBeingAmended = abiCall<typeof AkitaSocial.prototype.getPost>({
      sender,
      appId: social,
      args: [amendment]
    }).returnValue

    const originalPostRef = postBeingAmended.ref.slice(0, 32).toFixed({ length: 32 })

    const info = abiCall<typeof AkitaSocial.prototype.getPostMeta>({
      sender,
      appId: social,
      args: [originalPostRef, 0]
    }).returnValue

    const creator = info.post.creator
    const creatorWallet = info.meta.wallet

    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))

    if (tipInfo.type === TipSendTypeARC58) {
      mbrAmount += tipInfo.arc58
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

    // Edit key is derived internally by contract
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

  vote(
    wallet: Application,
    rekeyBack: boolean,
    ref: bytes,
    type: RefType,
    isUp: boolean
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaSocialAppList(this.akitaDAO.value)
    let mbrAmount: uint64 = this.mbr(Bytes('')).votelist

    if (isUp) {
      const info = abiCall<typeof AkitaSocial.prototype.getPostMeta>({
        sender,
        appId: social,
        args: [ref.toFixed({ length: 32 }), 0]
      }).returnValue

      const creator = info.post.creator
      const creatorWallet = info.meta.wallet
      const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))

      if (tipInfo.type === TipSendTypeARC58) {
        mbrAmount += tipInfo.arc58
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

    abiCall<typeof AkitaSocial.prototype.vote>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        ref,
        type,
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

    const { social } = getAkitaSocialAppList(this.akitaDAO.value)

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
        const info = abiCall<typeof AkitaSocial.prototype.getPostMeta>({
          sender,
          appId: social,
          args: [ref, 0],
        }).returnValue

        const creator = info.post.creator
        const creatorWallet = info.meta.wallet
        const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))
        if (tipInfo.type === TipSendTypeARC58) {
          mbrPayment.set({ amount: tipInfo.arc58 })
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

  gatedReact(
    wallet: Application,
    rekeyBack: boolean,
    ref: bytes,
    type: RefType,
    NFT: uint64,
    args: GateArgs
  ): void {
    const { origin, sender } = getAccounts(wallet)

    const { gate } = getAkitaAppList(this.akitaDAO.value)
    const { social } = getAkitaSocialAppList(this.akitaDAO.value)

    const { post, meta, reactionExists } = abiCall<typeof AkitaSocial.prototype.getPostMeta>({
      sender,
      appId: social,
      args: [ref.toFixed({ length: 32 }), NFT]
    }).returnValue

    const { reactions, reactionlist } = this.mbr(Bytes(''))

    let mbrAmount: uint64 = reactionExists
      ? reactionlist
      : reactions + reactionlist

    const creator = post.creator
    const creatorWallet = meta.wallet
    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))
    if (tipInfo.type === TipSendTypeARC58) {
      mbrAmount += tipInfo.arc58
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

    abiCall<typeof AkitaSocial.prototype.gatedReact>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        gateTxn,
        ref,
        type,
        NFT
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  react(
    wallet: Application,
    rekeyBack: boolean,
    ref: bytes,
    type: RefType,
    NFT: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const { social } = getAkitaSocialAppList(this.akitaDAO.value)

    const { post, meta, reactionExists } = abiCall<typeof AkitaSocial.prototype.getPostMeta>({
      sender,
      appId: social,
      args: [ref.toFixed({ length: 32 }), NFT]
    }).returnValue

    const { reactions, reactionlist } = this.mbr(Bytes(''))

    let mbrAmount: uint64 = reactionExists
      ? reactionlist
      : reactions + reactionlist

    const creator = post.creator
    const creatorWallet = meta.wallet
    const tipInfo = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(creatorWallet))
    if (tipInfo.type === TipSendTypeARC58) {
      mbrAmount += tipInfo.arc58
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

    abiCall<typeof AkitaSocial.prototype.react>({
      sender,
      appId: social,
      args: [
        mbrPayment,
        tip,
        ref,
        type,
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

    const { social } = getAkitaSocialAppList(this.akitaDAO.value)

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

    const { gate } = getAkitaAppList(this.akitaDAO.value)
    const { social, graph } = getAkitaSocialAppList(this.akitaDAO.value)

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

    abiCall<typeof AkitaSocialGraph.prototype.gatedFollow>({
      sender,
      appId: graph,
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

    const { social, graph } = getAkitaSocialAppList(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(social).address,
      amount: this.mbr(Bytes('')).follows
    })

    abiCall<typeof AkitaSocialGraph.prototype.follow>({
      sender,
      appId: graph,
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

    const { graph } = getAkitaSocialAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocialGraph.prototype.unfollow>({
      sender,
      appId: graph,
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

    const { graph } = getAkitaSocialAppList(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(graph).address,
      amount: this.mbr(Bytes('')).blocks
    })

    abiCall<typeof AkitaSocialGraph.prototype.block>({
      sender,
      appId: graph,
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

    const { graph } = getAkitaSocialAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocialGraph.prototype.unblock>({
      sender,
      appId: graph,
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

    const { moderation } = getAkitaSocialAppList(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(moderation).address,
      amount: this.mbr(Bytes('')).moderators
    })

    abiCall<typeof AkitaSocialModeration.prototype.addModerator>({
      sender,
      appId: moderation,
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

    const { moderation } = getAkitaSocialAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocialModeration.prototype.removeModerator>({
      sender,
      appId: moderation,
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

    const { moderation } = getAkitaSocialAppList(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(moderation).address,
      amount: this.mbr(Bytes('')).banned
    })

    abiCall<typeof AkitaSocialModeration.prototype.ban>({
      sender,
      appId: moderation,
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

    const { moderation } = getAkitaSocialAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocialModeration.prototype.flagPost>({
      sender,
      appId: moderation,
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

    const { moderation } = getAkitaSocialAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocialModeration.prototype.unflagPost>({
      sender,
      appId: moderation,
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

    const { moderation } = getAkitaSocialAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocialModeration.prototype.unban>({
      sender,
      appId: moderation,
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

    const { moderation } = getAkitaSocialAppList(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(moderation).address,
      amount: this.mbr(Bytes('')).actions
    })

    abiCall<typeof AkitaSocialModeration.prototype.addAction>({
      sender,
      appId: moderation,
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

    const { moderation } = getAkitaSocialAppList(this.akitaDAO.value)

    abiCall<typeof AkitaSocialModeration.prototype.removeAction>({
      sender,
      appId: moderation,
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

    const { social } = getAkitaSocialAppList(this.akitaDAO.value)

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

    const { social } = getAkitaSocialAppList(this.akitaDAO.value)

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