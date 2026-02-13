import { Account, Application, assert, assertMatch, Asset, BoxMap, Bytes, bytes, clone, Global, GlobalState, gtxn, itxn, itxnCompose, op, Txn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod } from '@algorandfoundation/algorand-typescript/arc4'
import { AssetHolding, btoi, itob } from '@algorandfoundation/algorand-typescript/op'
import { classes } from 'polytype'
import { ERR_FAILED_GATE, ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER } from '../utils/errors'
import { akitaSocialFee, calcPercent, gateCheck, getAkitaAssets, getAkitaSocialAppList, getOriginAccount, getPluginAppList, getSocialFees, getWalletIDUsingAkitaDAO, impactRange, originOr, originOrTxnSender, referralFee, sendReferralPayment } from '../utils/functions'
import { CID } from '../utils/types/base'
import { AkitaSocialBoxPrefixMeta, AkitaSocialboxPrefixPayWall, AkitaSocialBoxPrefixPosts, AkitaSocialBoxPrefixReactionList, AkitaSocialBoxPrefixReactions, AkitaSocialBoxPrefixVoteList, AkitaSocialBoxPrefixVotes, AkitaSocialGlobalStateKeysPaywallID, AmendmentMBR, EditBackRefMBR, ImpactMetaMBR, MAX_TIMESTAMP_DRIFT, ONE_DAY, PostTypeEditPost, PostTypeEditReply, PostTypePost, PostTypeReply, RefTypeAddress, RefTypeApp, RefTypeAsset, RefTypeExternal, RefTypePost, TipActionPost, TipActionReact, TipSendTypeARC58, TWO_YEARS } from './constants'
import { ERR_ALREADY_REACTED, ERR_ALREADY_VOTED, ERR_AUTOMATED_ACCOUNT, ERR_BANNED, ERR_BLOCKED, ERR_HAS_GATE, ERR_HAVENT_VOTED, ERR_INVALID_APP, ERR_INVALID_ASSET, ERR_INVALID_PAYWALL, ERR_INVALID_REF_LENGTH, ERR_INVALID_REPLY_TYPE, ERR_IS_A_REPLY, ERR_IS_ALREADY_AMENDED, ERR_META_ALREADY_EXISTS, ERR_META_DOESNT_EXIST, ERR_NO_SELF_VOTE, ERR_NOT_A_REPLY, ERR_NOT_GRAPH, ERR_NOT_YOUR_POST_TO_EDIT, ERR_POST_NOT_FOUND, ERR_REPLY_NOT_FOUND, ERR_TIMESTAMP_TOO_OLD, ERR_USER_DOES_NOT_OWN_NFT } from './errors'
import { MetaValue, PostMeta, PostType, PostValue, ReactionListKey, ReactionsKey, RefType, TipAction, ViewPayWallValue, VoteListKey, VoteListValue, VotesValue } from './types'

// CONTRACT IMPORTS
import type { AbstractedAccount } from '../arc58/account/contract.algo'
import { AkitaDAOEscrowAccountSocial } from '../arc58/dao/constants'
import type { OptInPlugin } from '../arc58/plugins/optin/contract.algo'
import { ERR_ALREADY_OPTED_IN } from '../arc58/plugins/optin/errors'
import { AkitaBaseFeeGeneratorContract } from '../utils/base-contracts/base'
import { BaseSocial } from './base'
import type { AkitaSocialGraph } from './graph.algo'
import type { AkitaSocialImpact } from './impact.algo'
import type { AkitaSocialModeration } from './moderation.algo'

export function b16(b: bytes): bytes<16> {
  return b.slice(0, 16).toFixed({ length: 16 })
}

export class AkitaSocial extends classes(BaseSocial, AkitaBaseFeeGeneratorContract) {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  payWallId = GlobalState<uint64>({ key: AkitaSocialGlobalStateKeysPaywallID, initialValue: 1 })

  // BOXES ----------------------------------------------------------------------------------------

  /** All the posts on the network */
  posts = BoxMap<bytes<32>, PostValue>({ keyPrefix: AkitaSocialBoxPrefixPosts })
  /** Pay wall information for posts */
  paywall = BoxMap<uint64, ViewPayWallValue>({ keyPrefix: AkitaSocialboxPrefixPayWall })
  /** Counters for each post to track votes */
  votes = BoxMap<bytes<32>, VotesValue>({ keyPrefix: AkitaSocialBoxPrefixVotes })
  /** User votes and their impact */
  votelist = BoxMap<VoteListKey, VoteListValue>({ keyPrefix: AkitaSocialBoxPrefixVoteList })
  /** Counters for each post to track reactions */
  reactions = BoxMap<ReactionsKey, uint64>({ keyPrefix: AkitaSocialBoxPrefixReactions })
  /** Who has reacted to what */
  reactionlist = BoxMap<ReactionListKey, bytes<0>>({ keyPrefix: AkitaSocialBoxPrefixReactionList })
  /** The meta data for each user */
  meta = BoxMap<Account, MetaValue>({ keyPrefix: AkitaSocialBoxPrefixMeta })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private isCreator(creator: Account, wallet: Application): boolean {
    const origin = getOriginAccount(wallet)
    return creator === origin
  }

  private isReply(postType: PostType): boolean {
    return postType === PostTypeReply || postType === PostTypeEditReply
  }

  private getBaseRefLength(postType: PostType): uint64 {
    // Returns the base ref length before any 'a' + nextKey amendment marker
    // Post:      CID(36)
    // Reply:     CID(36) + parentRef(32) = 68
    // EditPost:  CID(36) + originalKey(32) = 68
    // EditReply: CID(36) + parentRef(32) + originalKey(32) = 100
    switch (postType) {
      case PostTypePost:
        return 36
      case PostTypeReply:
        return 68
      case PostTypeEditPost:
        return 68
      case PostTypeEditReply:
        return 100
      default:
        return 36
    }
  }

  private isAmended(ref: bytes, postType: PostType): boolean {
    // A post is amended if ref length exceeds base length (has 'a' + nextKey appended)
    const baseLength = this.getBaseRefLength(postType)
    return ref.length > baseLength
  }

  private toBytes32(type: RefType, ref: bytes): { refBytes: bytes<32>, creator: Account } {
    let refBytes: bytes<32>
    let creator: Account = Global.zeroAddress
    switch (type) {
      case RefTypePost:
        assert(ref.length === 32, ERR_INVALID_REF_LENGTH)
        refBytes = ref.toFixed({ length: 32 })
        break
      case RefTypeAsset:
        assert(ref.length === 8, ERR_INVALID_REF_LENGTH)
        assert(Asset(btoi(ref)).total > 0, ERR_INVALID_ASSET)
        refBytes = ref.concat(op.bzero(24)).toFixed({ length: 32 })
        creator = Asset(btoi(ref)).creator
        break
      case RefTypeAddress:
        assert(ref.length === 32, ERR_INVALID_REF_LENGTH)
        refBytes = ref.toFixed({ length: 32 })
        creator = Account(refBytes)

        if (this.meta(creator).exists) {
          const { addressGateID } = this.meta(creator).value
          assert(addressGateID === 0, ERR_HAS_GATE)
        }

        break
      case RefTypeApp:
        assert(ref.length === 8, ERR_INVALID_REF_LENGTH)
        assert(Application(btoi(ref)).approvalProgram.length > 0, ERR_INVALID_APP)
        refBytes = ref.concat(op.bzero(24)).toFixed({ length: 32 })
        creator = Application(btoi(ref)).creator
        break
      case RefTypeExternal:
        // External refs (Twitter, Farcaster, etc.) - ref is the platform-prefixed identifier
        // Key is derived deterministically: sha256(ref) where ref = "platform:externalId"
        // Creator is zero address since external content has no Algorand creator
        refBytes = op.sha256(ref)
        creator = Global.zeroAddress
        break
      default:
        assert(false, ERR_INVALID_REPLY_TYPE)
    }

    return { refBytes, creator }
  }

  private isBlocked(user: Account, blocked: Account): boolean {
    return abiCall<typeof AkitaSocialGraph.prototype.isBlocked>({
      appId: getAkitaSocialAppList(this.akitaDAO.value).graph,
      args: [user, blocked]
    }).returnValue
  }

  private getSocialImpactScore(account: Account): uint64 {
    // - Social Activity | up to 250
    // Check if meta box exists for the account, return 0 if not registered
    if (!this.meta(account).exists) {
      return 0
    }

    const { streak, startDate } = clone(this.meta(account).value)
    let socialImpact: uint64 = 0

    if (streak >= 60) {
      socialImpact += 100
    } else {
      // Calculate impact proportionally up to 60 days
      socialImpact += (streak * 100) / 60
    }

    // longevity
    // if the account is older than 2 years give them 75
    const accountAge: uint64 = Global.latestTimestamp - startDate

    if (accountAge >= TWO_YEARS) {
      socialImpact += 75
    } else {
      // impact proportional up to 2 years
      socialImpact += (accountAge * 75) / TWO_YEARS
    }

    // Calculate score based on userScore, capped at 100_000
    if (this.votes(account.bytes).exists) {
      const { voteCount, isNegative } = this.votes(account.bytes).value

      let impact: uint64 = (voteCount * 75) / 100_000
      if (impact > 75) {
        impact = 75
      }

      if (isNegative) {
        // Subtract from socialImpact if the score is negative
        if (socialImpact > impact) {
          socialImpact -= impact
        } else {
          socialImpact = 0
        }
      } else {
        // Add to socialImpact if the score is positive
        socialImpact += impact
      }
    }

    return socialImpact
  }

  private getUserImpact(account: Account): uint64 {
    const impact = abiCall<typeof AkitaSocialImpact.prototype.getUserImpactWithoutSocial>({
      appId: getAkitaSocialAppList(this.akitaDAO.value).impact,
      args: [account]
    }).returnValue

    return impact + this.getSocialImpactScore(account)
  }

  private sendPostPayment() {
    const akta = getAkitaAssets(this.akitaDAO.value).akta
    const { postFee } = getSocialFees(this.akitaDAO.value)
    const { leftover } = sendReferralPayment(this.akitaDAO.value, akta, postFee)

    itxn
      .assetTransfer({
        assetReceiver: this.akitaDAOEscrow.value.address,
        assetAmount: leftover,
        xferAsset: akta
      })
      .submit()
  }

  private arc58SendReactionPayments(wallet: Application, asset: uint64, tax: uint64, remainder: uint64): void {
    const origin = getOriginAccount(wallet)
    const optin = getPluginAppList(this.akitaDAO.value).optin

    itxnCompose.begin<typeof AbstractedAccount.prototype.arc58_rekeyToPlugin>({
      appId: wallet,
      args: [
        optin,
        true, // global
        '', // default account
        [], // no method offsets
        [] // no funds request
      ]
    })

    itxnCompose.next<typeof OptInPlugin.prototype.optIn>({
      appId: optin,
      args: [
        wallet,
        true, // rekey back immediately
        [asset],
        itxn.payment({
          amount: Global.assetOptInMinBalance,
          receiver: origin
        })
      ],
    })

    itxnCompose.next<typeof AbstractedAccount.prototype.arc58_verifyAuthAddress>({
      appId: wallet
    })

    itxnCompose.next(
      itxn.assetTransfer({
        assetReceiver: this.akitaDAOEscrow.value.address,
        assetAmount: tax,
        xferAsset: asset
      })
    )

    itxnCompose.next(
      itxn.assetTransfer({
        assetReceiver: origin,
        assetAmount: remainder,
        xferAsset: asset
      })
    )

    itxnCompose.submit()
  }

  private sendDirectReactionPayments(creator: Account, asset: uint64, tax: uint64, remainder: uint64): void {

    const taxTxn = itxn.assetTransfer({
      assetReceiver: this.akitaDAOEscrow.value.address,
      assetAmount: tax,
      xferAsset: asset
    })

    if (remainder > 0 && creator.isOptedIn(Asset(asset))) {
      const xferTxn = itxn.assetTransfer({
        assetReceiver: creator,
        assetAmount: remainder,
        xferAsset: asset
      })

      itxn.submitGroup(taxTxn, xferTxn)
    } else {
      taxTxn.set({
        assetAmount: tax + remainder
      })
      taxTxn.submit()
    }
  }

  private tipCreator(creator: Account, fee: uint64, tax: uint64): uint64 {
    if (creator === Global.zeroAddress) {
      const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
      itxn
        .assetTransfer({
          assetReceiver: this.akitaDAOEscrow.value.address,
          assetAmount: fee,
          xferAsset: akta
        })
        .submit()
      return 0
    }

    let wallet: uint64 = 0
    if (this.meta(creator).exists) {
      wallet = this.meta(creator).value.wallet
    }

    const { type, arc58 } = this.checkTipMbrRequirements(this.akitaDAO.value, creator, Application(wallet))
    const akta = getAkitaAssets(this.akitaDAO.value).akta
    const { leftover } = sendReferralPayment(this.akitaDAO.value, akta, tax)
    const { reactFee } = getSocialFees(this.akitaDAO.value)
    
    if (type === TipSendTypeARC58) {
      this.arc58SendReactionPayments(Application(wallet), akta, leftover, (reactFee - tax))
      return arc58
    }

    this.sendDirectReactionPayments(creator, akta, leftover, (reactFee - tax))
    return 0
  }

  private createEmptyPostIfNecessary(key: bytes<32>, creator: Account): uint64 {
    if (!this.posts(key).exists) {
      this.posts(key).value = {
        ref: op.bzero(0),
        /**
         * when a user reacts to content other than posts
         * we set the creator to the following:
         * - AssetID: Asset Creator
         * - Address: Account
         * -   AppID: Application Creator
         */
        creator,
        timestamp: Global.latestTimestamp,
        gateID: 0,
        usePayWall: false,
        payWallID: 0,
        againstContentPolicy: false,
        postType: PostTypePost,
      }

      return this.mbr(Bytes('')).posts
    }
    return 0
  }

  private updateStreak(account: Account): void {
    assert(this.meta(account).exists, ERR_META_DOESNT_EXIST)

    const { startDate, lastActive } = this.meta(account).value

    const thisWindowStart: uint64 = Global.latestTimestamp - ((Global.latestTimestamp - startDate) % ONE_DAY)
    const lastWindowStart: uint64 = thisWindowStart - ONE_DAY

    this.meta(account).value.lastActive = Global.latestTimestamp
    // if they haven't interacted in up to the last 48 hours (depending on the current window)
    // reset their streak
    if (lastWindowStart > lastActive) {
      this.meta(account).value.streak = 1
      return
    }

    // if they have interacted after the last window
    // but have not yet interacted in this window, increment their streak
    if (lastActive < thisWindowStart) {
      this.meta(account).value.streak += 1
    }

    // otherwise do nothing, streak can only increment once per window (24 hours)
  }

  private calcVotes(ref: bytes<32>, isUp: boolean, impact: uint64): { newCount: uint64; isNegative: boolean } {
    if (!this.votes(ref).exists) {
      return { newCount: impact, isNegative: !isUp }
    }

    const { isNegative, voteCount } = this.votes(ref).value
    // differingDirections means that the direction this vote will move the vote count
    // is the opposite of the current vote count
    const differingDirections = (isUp && isNegative) || (!isUp && !isNegative)

    if (voteCount === 0) {
      return { newCount: impact, isNegative: !isUp }
    }

    if (impact === voteCount && differingDirections) {
      return { newCount: 0, isNegative: false }
    }

    // flip indicates that this vote will move the vote count from negative to positive
    // or vice versa
    const flip = impact > voteCount && differingDirections
    if (flip) {
      const newCount: uint64 = impact - voteCount
      return { newCount, isNegative: !isNegative }
    }

    const newCount: uint64 = differingDirections ? voteCount - impact : voteCount + impact
    return { newCount, isNegative }
  }

  private updateVotes(ref: bytes<32>, isUp: boolean, impact: uint64): void {
    const { newCount: voteCount, isNegative } = this.calcVotes(ref, isUp, impact)
    this.votes(ref).value = { voteCount, isNegative }
  }

  private createVoteList(ref: bytes<32>, isUp: boolean, account: Account, impact: uint64): void {
    const voteListKey: VoteListKey = { user: b16(account.bytes), ref: b16(ref) }
    this.votelist(voteListKey).value = { impact, isUp }
  }

  private createPost(
    postKey: bytes<32>,
    origin: Account,
    mbrPayment: gtxn.PaymentTxn,
    cid: CID,
    gateID: uint64,
    usePayWall: boolean,
    payWallID: uint64,
    postType: PostType,
    amendmentOf: bytes<32>,
  ): void {
    assert(!this.isBanned(origin), ERR_BANNED)
    assert(
      (!usePayWall && payWallID === 0) || (
        usePayWall && (
          payWallID !== 0 && this.paywall(payWallID).exists ||
          payWallID === 0 && this.paywall(this.meta(origin).value.defaultPayWallID).exists
        )
      ),
      ERR_INVALID_PAYWALL
    )

    const isEditPost = postType === PostTypeEditPost
    // For edits, we need extra MBR for the back-reference (originalKey)
    const editExtraMbr: uint64 = isEditPost ? EditBackRefMBR : 0
    this.validatePostPayment(mbrPayment, cid, isEditPost, editExtraMbr)

    // update streak before we measure impact
    // this way we guarantee the box exists
    this.updateStreak(origin)

    const impact = this.getUserImpact(origin)

    assert(!this.posts(postKey).exists, 'ERR:POST_EXISTS')

    // Ref structure based on postType:
    // Post:     CID
    // EditPost: CID + originalKey
    const postRef: bytes = isEditPost
      ? Bytes(cid).concat(amendmentOf)
      : Bytes(cid)

    this.posts(postKey).value = {
      ref: postRef,
      creator: origin,
      timestamp: Global.latestTimestamp,
      gateID: gateID,
      usePayWall,
      payWallID,
      againstContentPolicy: false,
      postType: postType,
    }
    this.updateVotes(postKey, true, impact)
    this.createVoteList(postKey, true, origin, impact)
    this.sendPostPayment()
  }

  private createReply(
    replyKey: bytes<32>,
    origin: Account,
    mbrPayment: gtxn.PaymentTxn,
    mbrNeeded: uint64,
    cid: CID,
    parentRef: bytes<32>,
    gateID: uint64,
    usePayWall: boolean,
    payWallID: uint64,
    postType: PostType,
    amendmentOf: bytes<32>,
  ): void {
    assert(!this.isBanned(origin), ERR_BANNED)
    const { creator } = this.posts(parentRef).value
    assert(!this.isBlocked(creator, origin), ERR_BLOCKED)

    // update streak before we measure impact
    // this way we guarantee the box exists
    this.updateStreak(origin)

    const { reactFee } = getSocialFees(this.akitaDAO.value)
    const creatorImpact = this.getUserImpact(creator)
    const taxPercentage = akitaSocialFee(this.akitaDAO.value, creatorImpact)
    const tax = calcPercent(reactFee, taxPercentage)

    const isEditReply = postType === PostTypeEditReply
    // For edits, we need extra MBR for the back-reference (originalKey)
    let extra = mbrNeeded
    extra += this.tipCreator(creator, reactFee, tax)

    if (isEditReply) {
      extra += EditBackRefMBR
    }
    // validate after we send payments, annoying but saves us compute
    this.validatePostPayment(mbrPayment, cid, isEditReply, extra)

    assert(!this.posts(replyKey).exists, 'ERR:POST_EXISTS')

    // Reply ref structure based on postType:
    // Reply:     CID + parentRef
    // EditReply: CID + parentRef + originalKey
    const replyRef: bytes = isEditReply
      ? Bytes(cid).concat(parentRef).concat(amendmentOf)
      : Bytes(cid).concat(parentRef)

    this.posts(replyKey).value = {
      ref: replyRef,
      creator: origin,
      timestamp: Global.latestTimestamp,
      gateID: gateID,
      usePayWall,
      payWallID,
      againstContentPolicy: false,
      postType: postType,
    }

    const senderImpact = this.getUserImpact(origin)
    this.updateVotes(replyKey, true, senderImpact)
    this.createVoteList(replyKey, true, origin, senderImpact)
  }

  private createVote(
    origin: Account,
    mbrPayment: gtxn.PaymentTxn,
    mbrNeeded: uint64,
    ref: bytes<32>,
    isUp: boolean
  ): void {
    assert(!this.isBanned(origin), ERR_BANNED)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)

    const { creator } = this.posts(ref).value
    assert(!this.isBlocked(creator, origin), ERR_BLOCKED)

    const voteListKey: VoteListKey = { user: b16(origin.bytes), ref: b16(ref) }
    assert(!this.votelist(voteListKey).exists, ERR_ALREADY_VOTED)
    assert(origin !== creator, ERR_NO_SELF_VOTE)

    const senderIsAutomated = this.meta(origin).value.automated
    assert(!senderIsAutomated, ERR_AUTOMATED_ACCOUNT)

    const akta = getAkitaAssets(this.akitaDAO.value).akta

    // update streak before we measure impact
    // this way we guarantee the box exists
    this.updateStreak(origin)
    const { reactFee, impactTaxMin, impactTaxMax } = getSocialFees(this.akitaDAO.value)

    if (isUp) {
      // calls a transaction
      const recipientImpact = this.getUserImpact(creator)
      const taxPercentage = impactRange(recipientImpact, impactTaxMin, impactTaxMax)
      const tax = calcPercent(reactFee, taxPercentage)

      const extra = this.tipCreator(creator, reactFee, tax)
      // validate after we send payments, annoying but saves us compute
      assertMatch(
        mbrPayment,
        {
          receiver: Global.currentApplicationAddress,
          amount: mbrNeeded + extra
        },
        ERR_INVALID_PAYMENT
      )
    } else {
      assertMatch(
        mbrPayment,
        {
          receiver: Global.currentApplicationAddress,
          amount: mbrNeeded
        },
        ERR_INVALID_PAYMENT
      )

      itxn
        .assetTransfer({
          assetReceiver: this.akitaDAOEscrow.value.address,
          assetAmount: reactFee,
          xferAsset: akta
        })
        .submit()
    }

    // calls a transaction
    const senderImpact = this.getUserImpact(origin)
    this.updateVotes(ref, isUp, senderImpact)
    this.createVoteList(ref, isUp, origin, senderImpact)
  }

  private createReaction(
    origin: Account,
    mbrPayment: gtxn.PaymentTxn,
    mbrNeeded: uint64,
    ref: bytes<32>,
    NFT: uint64
  ): void {
    assert(!this.isBanned(origin), ERR_BANNED)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const { creator } = this.posts(ref).value
    assert(!this.isBlocked(creator, origin), ERR_BLOCKED)
    // sender has NFT
    assert(AssetHolding.assetBalance(origin, NFT)[0] > 0, ERR_USER_DOES_NOT_OWN_NFT)

    const reactionListKey: ReactionListKey = { user: b16(origin.bytes), ref: b16(ref), NFT }

    assert(!this.reactionlist(reactionListKey).exists, ERR_ALREADY_REACTED)

    // update streak before we measure impact
    // this way we guarantee the box exists
    this.updateStreak(origin)

    const { reactFee, impactTaxMin, impactTaxMax } = getSocialFees(this.akitaDAO.value)
    const recipientImpact = this.getUserImpact(creator)
    const tax = impactRange(recipientImpact, impactTaxMin, impactTaxMax)

    const reactionKey: ReactionsKey = { ref, NFT }
    const reactionExists = this.reactions(reactionKey).exists

    let extra = mbrNeeded
    extra += this.tipCreator(creator, reactFee, tax)

    // validate after we send payments, annoying but saves us compute
    this.validateReactPayment(mbrPayment, reactionExists, extra)

    if (reactionExists) {
      this.reactions(reactionKey).value += 1
    } else {
      this.reactions(reactionKey).value = 1
    }

    this.reactionlist(reactionListKey).create()
  }

  private validateTip(tip: gtxn.AssetTransferTxn, action: TipAction) {
    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { postFee, reactFee } = getSocialFees(this.akitaDAO.value)
    assertMatch(
      tip,
      {
        assetReceiver: Global.currentApplicationAddress,
        xferAsset: akta,
        assetAmount: (action === TipActionPost) ? postFee : reactFee
      },
      ERR_INVALID_TRANSFER
    )
  }

  private validatePostPayment(
    mbrPayment: gtxn.PaymentTxn,
    cid: CID,
    isAmendment: boolean,
    extraAmount: uint64
  ): void {
    const { posts, votes, votelist } = this.mbr(cid)
    const akta = getAkitaAssets(this.akitaDAO.value).akta
    const referralFeeAmount = referralFee(this.akitaDAO.value, akta)
    let amount: uint64 = posts + votes + votelist + referralFeeAmount + extraAmount
    if (isAmendment) {
      amount += AmendmentMBR
    }

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount
      },
      ERR_INVALID_PAYMENT
    )
  }

  private validateReactPayment(mbrPayment: gtxn.PaymentTxn, reactionExists: boolean, extra: uint64): void {
    const { reactionlist, reactions } = this.mbr(Bytes(''))
    const mbrAmount: uint64 = reactionExists
      ? reactionlist
      : reactions + reactionlist

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: mbrAmount + extra
      },
      ERR_INVALID_PAYMENT
    )
  }

  private createDefaultMeta(origin: Account, initialized: boolean, wallet: uint64, automated: boolean): void {
    this.meta(origin).value = {
      initialized,
      wallet,
      streak: 1,
      startDate: Global.latestTimestamp,
      lastActive: Global.latestTimestamp,
      followerIndex: 0,
      followerCount: 0,
      automated,
      followGateID: 0,
      addressGateID: 0,
      defaultPayWallID: 0
    }
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: Application, akitaDAOEscrow: Application): void {
    this.version.value = version
    this.akitaDAO.value = akitaDAO
    this.akitaDAOEscrow.value = akitaDAOEscrow
  }

  init(): void {
    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    assert(!Global.currentApplicationAddress.isOptedIn(akta), ERR_ALREADY_OPTED_IN)

    itxn
      .assetTransfer({
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: 0,
        xferAsset: akta
      })
      .submit()

    if (!this.akitaDAOEscrow.value.address.isOptedIn(akta)) {
      this.optAkitaEscrowInAndSend(
        AkitaDAOEscrowAccountSocial,
        akta,
        0
      )
    }
  }

  // AKITA SOCIAL PLUGIN METHODS ------------------------------------------------------------------

  post(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    timestamp: uint64,
    nonce: bytes<24>,
    cid: CID,
    gateID: uint64,
    usePayWall: boolean,
    payWallID: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    // Validate timestamp is recent (within MAX_TIMESTAMP_DRIFT seconds)
    assert(Global.latestTimestamp - timestamp <= MAX_TIMESTAMP_DRIFT, ERR_TIMESTAMP_TOO_OLD)

    // Derive deterministic post key from: creator + timestamp + userNonce
    const postKey = op.sha256(origin.bytes.concat(itob(timestamp)).concat(nonce))

    this.validateTip(tip, TipActionPost)
    this.createPost(postKey, origin, mbrPayment, cid, gateID, usePayWall, payWallID, PostTypePost, op.bzero(32) as bytes<32>)
  }

  editPost(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    cid: CID,
    amendment: bytes<32>
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(this.posts(amendment).exists, ERR_POST_NOT_FOUND)
    const { creator, ref, gateID, usePayWall, payWallID, postType } = this.posts(amendment).value
    assert(this.isCreator(creator, wallet), ERR_NOT_YOUR_POST_TO_EDIT)
    assert(!this.isReply(postType), ERR_IS_A_REPLY)
    assert(!this.isAmended(ref, postType), ERR_IS_ALREADY_AMENDED)

    // Derive deterministic post key from: creator + originalPostKey + newCID
    // This cryptographically links the edit to its original and makes same edits idempotent
    const editKey = op.sha256(origin.bytes.concat(amendment).concat(Bytes(cid)))

    // Mark the original post as amended, linking to the new edit key
    this.posts(amendment).value.ref = ref.concat(Bytes('a').concat(editKey))

    this.validateTip(tip, TipActionPost)
    this.createPost(editKey, origin, mbrPayment, cid, gateID, usePayWall, payWallID, PostTypeEditPost, amendment)
  }

  gatedReply(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    timestamp: uint64,
    nonce: bytes<24>,
    cid: CID,
    ref: bytes,
    type: RefType,
    gateID: uint64,
    usePayWall: boolean,
    payWallID: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const { refBytes, creator: fallback } = this.toBytes32(type, ref)

    // Validate timestamp is recent
    assert(Global.latestTimestamp - timestamp <= MAX_TIMESTAMP_DRIFT, ERR_TIMESTAMP_TOO_OLD)

    assert(this.posts(refBytes).exists, ERR_POST_NOT_FOUND)
    const { creator, gateID: postGateID } = this.posts(refBytes).value
    assert(gateCheck(gateTxn, this.akitaDAO.value, origin, postGateID), ERR_FAILED_GATE)

    const c = (fallback === Global.zeroAddress) ? creator : fallback
    const addedMbr = this.createEmptyPostIfNecessary(refBytes, c)

    // Derive deterministic reply key from: creator + timestamp + userNonce
    const replyKey = op.sha256(origin.bytes.concat(itob(timestamp)).concat(nonce))

    this.validateTip(tip, TipActionReact)
    this.createReply(replyKey, origin, mbrPayment, addedMbr, cid, refBytes, gateID, usePayWall, payWallID, PostTypeReply, op.bzero(32) as bytes<32>)
  }

  reply(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    timestamp: uint64,
    nonce: bytes<24>,
    cid: CID,
    ref: bytes,
    type: RefType,
    gateID: uint64,
    usePayWall: boolean,
    payWallID: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const { refBytes, creator: fallback } = this.toBytes32(type, ref)

    // Validate timestamp is recent
    assert(Global.latestTimestamp - timestamp <= MAX_TIMESTAMP_DRIFT, ERR_TIMESTAMP_TOO_OLD)

    assert(this.posts(refBytes).exists, ERR_POST_NOT_FOUND)
    const { creator, gateID: postGateID } = this.posts(refBytes).value
    assert(postGateID === 0, ERR_HAS_GATE)

    const c = (fallback === Global.zeroAddress) ? creator : fallback
    const addedMbr = this.createEmptyPostIfNecessary(refBytes, c)

    // Derive deterministic reply key from: creator + timestamp + userNonce
    const replyKey = op.sha256(origin.bytes.concat(itob(timestamp)).concat(nonce))

    this.validateTip(tip, TipActionReact)
    this.createReply(replyKey, origin, mbrPayment, addedMbr, cid, refBytes, gateID, usePayWall, payWallID, PostTypeReply, op.bzero(32) as bytes<32>)
  }

  gatedEditReply(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    cid: CID,
    amendment: bytes<32>,
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(this.posts(amendment).exists, ERR_REPLY_NOT_FOUND)
    const { creator, ref, gateID, usePayWall, payWallID, postType } = this.posts(amendment).value
    assert(this.isCreator(creator, wallet), ERR_NOT_YOUR_POST_TO_EDIT)
    assert(this.isReply(postType), ERR_NOT_A_REPLY)
    assert(!this.isAmended(ref, postType), ERR_IS_ALREADY_AMENDED)

    // Derive deterministic edit key from: creator + originalReplyKey + newCID
    const editKey = op.sha256(origin.bytes.concat(amendment).concat(Bytes(cid)))

    // Mark the original reply as amended, linking to the new edit key
    this.posts(amendment).value.ref = ref.concat(Bytes('a').concat(editKey))

    // Extract parent post ref from reply's ref (CID is first 36 bytes, parentRef is next 32)
    const parentPostRef = ref.slice(36, 68).toFixed({ length: 32 })
    const { gateID: ogPostGateID } = this.posts(parentPostRef).value
    assert(gateCheck(gateTxn, this.akitaDAO.value, origin, ogPostGateID), ERR_FAILED_GATE)

    this.validateTip(tip, TipActionReact)
    this.createReply(editKey, origin, mbrPayment, 0, cid, parentPostRef, gateID, usePayWall, payWallID, PostTypeEditReply, amendment)
  }

  editReply(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    cid: CID,
    amendment: bytes<32>
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(this.posts(amendment).exists, ERR_REPLY_NOT_FOUND)
    const { creator, ref, gateID, usePayWall, payWallID, postType } = this.posts(amendment).value
    assert(this.isCreator(creator, wallet), ERR_NOT_YOUR_POST_TO_EDIT)
    assert(this.isReply(postType), ERR_NOT_A_REPLY)
    assert(!this.isAmended(ref, postType), ERR_IS_ALREADY_AMENDED)

    // Derive deterministic edit key from: creator + originalReplyKey + newCID
    const editKey = op.sha256(origin.bytes.concat(amendment).concat(Bytes(cid)))

    // Mark the original reply as amended, linking to the new edit key
    this.posts(amendment).value.ref = ref.concat(Bytes('a').concat(editKey))

    // Extract parent post ref from reply's ref (CID is first 36 bytes, parentRef is next 32)
    const parentPostRef = ref.slice(36, 68).toFixed({ length: 32 })
    const { gateID: ogPostGateID } = this.posts(parentPostRef).value
    assert(ogPostGateID === 0, ERR_HAS_GATE)

    this.validateTip(tip, TipActionReact)
    this.createReply(editKey, origin, mbrPayment, 0, cid, parentPostRef, gateID, usePayWall, payWallID, PostTypeEditReply, amendment)
  }

  vote(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    ref: bytes,
    type: RefType,
    isUp: boolean
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    let { refBytes, creator } = this.toBytes32(type, ref)
    if (type === RefTypePost) {
      assert(this.posts(refBytes).exists, ERR_POST_NOT_FOUND);
      ({ creator } = this.posts(refBytes).value);
    }

    const addedMbr = this.createEmptyPostIfNecessary(refBytes, creator)

    this.validateTip(tip, TipActionReact)
    const mbrNeeded: uint64 = this.mbr(Bytes('')).votelist + addedMbr
    this.createVote(origin, mbrPayment, mbrNeeded, refBytes, isUp)
  }

  editVote(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    ref: bytes<32>,
    flip: boolean
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    const voteListKey: VoteListKey = { user: b16(origin.bytes), ref: b16(ref) }
    assert(this.votelist(voteListKey).exists, ERR_HAVENT_VOTED)

    const { impact, isUp } = this.votelist(voteListKey).value

    // undo user vote
    this.updateVotes(ref, !isUp, impact)

    // delete votelist
    this.votelist(voteListKey).delete()

    // if the user doesn't want to flip their vote, delete the votelist and refund
    if (!flip) {
      // refund user
      itxn
        .payment({
          receiver: origin,
          amount: this.mbr(Bytes('')).votelist
        })
        .submit()

      return
    }

    // if the user wants to flip their vote, vote again but the opposite way
    this.validateTip(tip, TipActionReact)
    this.createVote(origin, mbrPayment, 0, ref, !isUp)
  }

  gatedReact(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    ref: bytes,
    type: RefType,
    NFT: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const { refBytes, creator: fallback } = this.toBytes32(type, ref)

    assert(this.posts(refBytes).exists, ERR_POST_NOT_FOUND)
    const { creator, gateID } = this.posts(refBytes).value
    assert(gateCheck(gateTxn, this.akitaDAO.value, origin, gateID), ERR_FAILED_GATE)

    const c = (fallback === Global.zeroAddress) ? creator : fallback
    const addedMbr = this.createEmptyPostIfNecessary(refBytes, c)

    this.validateTip(tip, TipActionReact)
    this.createReaction(origin, mbrPayment, addedMbr, refBytes, NFT)
  }

  react(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    ref: bytes,
    type: RefType,
    NFT: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const { refBytes, creator: fallback } = this.toBytes32(type, ref)

    assert(this.posts(refBytes).exists, ERR_POST_NOT_FOUND)
    const { creator, gateID: postGateID } = this.posts(refBytes).value
    assert(postGateID === 0, ERR_HAS_GATE)

    const c = (fallback === Global.zeroAddress) ? creator : fallback
    const addedMbr = this.createEmptyPostIfNecessary(refBytes, c)

    this.validateTip(tip, TipActionReact)
    this.createReaction(origin, mbrPayment, addedMbr, refBytes, NFT)
  }

  deleteReaction(ref: bytes<32>, NFT: uint64): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(!this.isBanned(origin), ERR_BANNED)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const { creator } = this.posts(ref).value
    assert(!this.isBlocked(creator, origin), ERR_BLOCKED)

    const reactionListKey: ReactionListKey = { user: b16(origin.bytes), ref: b16(ref), NFT }

    assert(this.reactionlist(reactionListKey).exists, ERR_ALREADY_REACTED)

    this.reactions({ ref, NFT }).value -= 1
    this.reactionlist(reactionListKey).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).reactionlist,

      })
      .submit()
  }

  setPostFlag(ref: bytes<32>, flagged: boolean): void {
    // Only the moderation contract can call this
    assert(Txn.sender === Application(getAkitaSocialAppList(this.akitaDAO.value).moderation).address, 'ERR:NOT_MODERATION')
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    this.posts(ref).value.againstContentPolicy = flagged
  }

  initMeta(
    mbrPayment: gtxn.PaymentTxn,
    user: Account,
    automated: boolean,
    subscriptionIndex: uint64,
    NFD: uint64,
    akitaNFT: uint64,
  ): uint64 {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, user)
    const origin = originOr(wallet, user)
    const userIsSender = (Txn.sender === user)

    assert(!this.meta(origin).exists, ERR_META_ALREADY_EXISTS)

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.mbr(Bytes('')).meta + ImpactMetaMBR
      },
      ERR_INVALID_PAYMENT
    )

    const impact = getAkitaSocialAppList(this.akitaDAO.value).impact

    itxn
      .payment({
        receiver: Application(impact).address,
        amount: ImpactMetaMBR
      })
      .submit()

    if (automated) {
      this.createDefaultMeta(origin, userIsSender, wallet.id, true)

      abiCall<typeof AkitaSocialImpact.prototype.cacheMeta>({
        appId: impact,
        args: [
          origin,
          0,
          0,
          0
        ]
      })

      return 0
    }

    this.createDefaultMeta(origin, userIsSender, wallet.id, false)

    const impactScore = abiCall<typeof AkitaSocialImpact.prototype.cacheMeta>({
      appId: getAkitaSocialAppList(this.akitaDAO.value).impact,
      args: [
        origin,
        subscriptionIndex,
        NFD,
        akitaNFT
      ]
    }).returnValue

    return impactScore + this.getSocialImpactScore(origin)
  }

  createPayWall(mbrPayment: gtxn.PaymentTxn, payWall: ViewPayWallValue): uint64 {
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: {
          greaterThanEq: this.payWallMbr(payWall)
        }
      }
    )

    const id = this.payWallId.value
    this.payWallId.value++

    this.paywall(id).value = clone(payWall)

    return id
  }

  updateMeta(
    followGateID: uint64,
    addressGateID: uint64,
    subscriptionIndex: uint64,
    NFD: uint64,
    akitaNFT: uint64,
    defaultPayWallID: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(this.meta(origin).exists, ERR_META_DOESNT_EXIST)

    this.meta(origin).value.followGateID = followGateID
    this.meta(origin).value.addressGateID = addressGateID
    assert(this.paywall(defaultPayWallID).exists, 'ERR:NOPAYWALL')
    this.meta(origin).value.defaultPayWallID = defaultPayWallID

    const impact = getAkitaSocialAppList(this.akitaDAO.value).impact
    abiCall<typeof AkitaSocialImpact.prototype.cacheMeta>({
      appId: impact,
      args: [
        origin,
        subscriptionIndex,
        NFD,
        akitaNFT
      ]
    })
  }

  updateFollowerMeta(address: Account, newFollowerIndex: uint64, newFollowerCount: uint64): void {
    assert(Txn.sender === Application(getAkitaSocialAppList(this.akitaDAO.value).graph).address, ERR_NOT_GRAPH)
    this.meta(address).value.followerIndex = newFollowerIndex
    this.meta(address).value.followerCount = newFollowerCount
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  @abimethod({ readonly: true })
  isBanned(account: Account): boolean {
    return abiCall<typeof AkitaSocialModeration.prototype.isBanned>({
      appId: getAkitaSocialAppList(this.akitaDAO.value).moderation,
      args: [account]
    }).returnValue
  }

  @abimethod({ readonly: true })
  getUserSocialImpact(user: Account): uint64 {
    return this.getSocialImpactScore(user)
  }

  @abimethod({ readonly: true })
  getMetaExists(user: Account): boolean {
    return this.meta(user).exists
  }

  @abimethod({ readonly: true })
  getMeta(user: Account): MetaValue {
    return this.meta(user).value
  }


  @abimethod({ readonly: true })
  getPostExists(ref: bytes<32>): boolean {
    return this.posts(ref).exists
  }

  @abimethod({ readonly: true })
  getPost(ref: bytes<32>): PostValue {
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    return this.posts(ref).value
  }

  @abimethod({ readonly: true })
  getVote(ref: bytes<32>): VoteListValue {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    const voteListKey: VoteListKey = { user: b16(origin.bytes), ref: b16(ref) }
    assert(this.votelist(voteListKey).exists, ERR_HAVENT_VOTED)

    return this.votelist(voteListKey).value
  }

  @abimethod({ readonly: true })
  getVotes(refs: bytes<32>[]): VoteListValue[] {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    const votes: VoteListValue[] = []
    for (const ref of refs) {
      const voteListKey: VoteListKey = { user: b16(origin.bytes), ref: b16(ref) }
      if (this.votelist(voteListKey).exists) {
        votes.push(this.votelist(voteListKey).value)
      } else {
        votes.push({ impact: 0, isUp: false })
      }
    }

    return votes
  }

  @abimethod({ readonly: true })
  getReactionExists(ref: bytes<32>, NFT: uint64): boolean {
    return this.reactions({ ref, NFT }).exists
  }
}
