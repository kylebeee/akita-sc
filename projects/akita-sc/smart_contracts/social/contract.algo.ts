import { arc59GetSendAssetInfoResponse, AssetInbox } from '../utils/types/asset-inbox'
import { Account, Application, assert, assertMatch, Asset, BoxMap, Bytes, bytes, clone, Global, gtxn, itxn, itxnCompose, op, Txn, Uint64, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address } from '@algorandfoundation/algorand-typescript/arc4'
import { MetaValue, PostValue, VoteListValue, VotesValue, AkitaSocialImpactMBRData, ImpactMetaValue, FollowsKey, BlockListKey, VoteListKey, ReactionsKey, ReactionListKey, Action, TipAction, ReactionMeta, PostMeta } from './types'
import { CID } from '../utils/types/base'
import { AkitaSocialBoxPrefixActions, AkitaSocialBoxPrefixBanned, AkitaSocialBoxPrefixBlocks, AkitaSocialBoxPrefixFollows, AkitaSocialBoxPrefixMeta, AkitaSocialBoxPrefixModerators, AkitaSocialBoxPrefixPosts, AkitaSocialBoxPrefixReactionList, AkitaSocialBoxPrefixReactions, AkitaSocialBoxPrefixVoteList, AkitaSocialBoxPrefixVotes, ONE_DAY, TWO_YEARS, ImpactBoxPrefixMeta, ImpactBoxPrefixSubscriptionStateModifier, ONE_MILLION_AKITA, ONE_YEAR, TEN_THOUSAND_AKITA, THIRTY_DAYS, TWO_HUNDRED_THOUSAND_AKITA, AmendmentMBR, TipSendTypeDirect, TipSendTypeARC59, TipSendTypeARC58, TipActionPost, TipActionReact, ImpactMetaMBR, SubscriptionStateModifierMBR } from './constants'
import { NFDGlobalStateKeysName, NFDGlobalStateKeysParentAppID, NFDGlobalStateKeysTimeChanged, NFDGlobalStateKeysVersion, NFDMetaKeyVerifiedAddresses, NFDMetaKeyVerifiedDiscord, NFDMetaKeyVerifiedDomain, NFDMetaKeyVerifiedTelegram, NFDMetaKeyVerifiedTwitter } from '../utils/constants/nfd'
import { ERR_ALREADY_A_MODERATOR, ERR_ALREADY_AN_ACTION, ERR_ALREADY_BANNED, ERR_ALREADY_FLAGGED, ERR_ALREADY_REACTED, ERR_ALREADY_VOTED, ERR_AUTOMATED_ACCOUNT, ERR_BANNED, ERR_BLOCKED, ERR_HAS_GATE, ERR_HAVENT_VOTED, ERR_INVALID_APP, ERR_INVALID_ASSET, ERR_INVALID_NFD, ERR_INVALID_REF_LENGTH, ERR_IS_A_REPLY, ERR_IS_ALREADY_AMENDED, ERR_META_ALREADY_EXISTS, ERR_META_DOESNT_EXIST, ERR_NFD_CHANGED, ERR_NO_SELF_VOTE, ERR_NOT_A_MODERATOR, ERR_NOT_A_REPLY, ERR_NOT_A_SUBSCRIPTION, ERR_NOT_AN_AKITA_NFT, ERR_NOT_AN_NFD, ERR_NOT_DAO, ERR_NOT_FLAGGED, ERR_NOT_SOCIAL, ERR_NOT_YOUR_POST_TO_EDIT, ERR_POST_NOT_FOUND, ERR_REPLY_NOT_FOUND, ERR_USER_DOES_NOT_OWN_NFD, ERR_USER_DOES_NOT_OWN_NFT, ERR_WRONG_FOLLOWER_KEY } from './errors'
import { AssetHolding, btoi, itob } from '@algorandfoundation/algorand-typescript/op'
import { ERR_FAILED_GATE, ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER } from '../utils/errors'
import { OptInPlugin } from '../arc58/plugins/optin/contract.algo'
import { akitaSocialFee, gateCheck, getAkitaAppList, getAkitaAssets, getOriginAccount, getOtherAppList, getPluginAppList, getSocialFees, impactRange, getWalletIDUsingAkitaDAO, originOrTxnSender, originOr, referrerOrZeroAddress, calcPercent, createInstantDisbursement } from '../utils/functions'
import { AkitaBaseContract } from '../utils/base-contracts/base'
import { AkitaBaseEscrow } from '../utils/base-contracts/escrow'
import { NFDRegistry } from '../utils/types/nfd-registry'
import { NFD } from '../utils/types/nfd'
import { AkitaCollectionsPrefixAKC, AkitaCollectionsPrefixAOG, AkitaNFTCreatorAddress, ONE_WEEK, TWENTY_FIVE_PERCENT } from '../utils/constants'
import { Staking } from '../staking/contract.algo'
import { STAKING_TYPE_SOFT } from '../staking/types'
import { Subscriptions } from '../subscriptions/contract.algo'
import { AkitaSocialImpactInterface, AkitaSocialInterface } from '../utils/types/social'
import { classes } from 'polytype'
import { BaseSocial } from './base'
import { AbstractedAccountInterface } from '../utils/abstract-account'

export class AkitaSocial extends classes(BaseSocial, AkitaBaseEscrow) implements AkitaSocialInterface {

  // BOXES ----------------------------------------------------------------------------------------

  /** Who follows who */
  follows = BoxMap<FollowsKey, Account>({ keyPrefix: AkitaSocialBoxPrefixFollows })
  /** All the blocks on the network */
  blocks = BoxMap<BlockListKey, bytes<0>>({ keyPrefix: AkitaSocialBoxPrefixBlocks })
  /** All the posts on the network */
  posts = BoxMap<bytes<32>, PostValue>({ keyPrefix: AkitaSocialBoxPrefixPosts })
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
  /** Who is a moderator */
  moderators = BoxMap<Account, uint64>({ keyPrefix: AkitaSocialBoxPrefixModerators })
  /** Who is banned and when they can return */
  banned = BoxMap<Account, uint64>({ keyPrefix: AkitaSocialBoxPrefixBanned })
  /** Actions usable on an akita post */
  actions = BoxMap<uint64, Action>({ keyPrefix: AkitaSocialBoxPrefixActions })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private isCreator(creator: Account, wallet: Application): boolean {
    const origin = getOriginAccount(wallet)
    return creator === origin
  }

  private isReply(ref: bytes): boolean {
    return ref.length === 68 || ref.length === 101
  }

  private isAmended(ref: bytes): boolean {
    return ref.length === 69 || ref.length === 101
  }

  private isBanned(account: Account): boolean {
    return this.banned(account).exists && this.banned(account).value > Global.latestTimestamp
  }

  // creates a blocklist key
  private blk(userAddress: Account, blockedAddress: Account): BlockListKey {
    const user = userAddress.bytes.slice(0, 16).toFixed({ length: 16 })
    const blocked = blockedAddress.bytes.slice(0, 16).toFixed({ length: 16 })
    return { user, blocked }
  }

  // creates a reactionlist key
  private rlk(user: Account, ref: bytes<32>, NFT: uint64): ReactionListKey {
    const userKey = user.bytes.slice(0, 16).toFixed({ length: 16 })
    const refKey = ref.slice(0, 16).toFixed({ length: 16 })
    return { user: userKey, ref: refKey, NFT }
  }

  // creates a votelist key
  private vlk(account: Account, r: bytes<32>): VoteListKey {
    const user = account.bytes.slice(0, 16).toFixed({ length: 16 })
    const ref = r.slice(0, 16).toFixed({ length: 16 })
    return { user, ref }
  }

  private isBlocked(user: Account, blocked: Account): boolean {
    const blocksKey = this.blk(user, blocked)
    return this.blocks(blocksKey).exists
  }

  private getSocialImpactScore(account: Account): uint64 {
    // - Social Activity | up to 250
    const { streak, startDate } = this.meta(account).value
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
    const impact = abiCall(
      AkitaSocialImpact.prototype.getUserImpactWithoutSocial,
      {
        appId: getAkitaAppList(this.akitaDAO.value).impact,
        args: [new Address(account)]
      }
    ).returnValue

    return impact + this.getSocialImpactScore(account)
  }

  private sendPostPayment(referrer: Account) {
    const akta = getAkitaAssets(this.akitaDAO.value).akta
    const { postFee } = getSocialFees(this.akitaDAO.value)
    const { tax } = this.sendReferralPayment(referrer, akta, postFee)

    itxn
      .assetTransfer({
        assetReceiver: this.akitaDAOEscrow.value.address,
        assetAmount: tax,
        xferAsset: akta
      })
      .submit()
  }

  private sendReferralPayment(referrer: Account, asset: uint64, preReferralTax: uint64): { tax: uint64, cost: uint64 } {
    let referralFee: uint64 = 0
    if (referrer !== Global.zeroAddress && referrer.isOptedIn(Asset(asset))) {
      referralFee = calcPercent(preReferralTax, TWENTY_FIVE_PERCENT)
      if (referralFee === 0 && preReferralTax > 0) {
        referralFee = 1
      }

      const { cost } = createInstantDisbursement(
        this.akitaDAO.value,
        asset,
        Global.latestTimestamp,
        (Global.latestTimestamp + ONE_WEEK),
        [{ address: new Address(referrer), amount: referralFee }],
        referralFee
      )
      
      return { tax: (preReferralTax - referralFee), cost }
    }

    return { tax: preReferralTax, cost: 0 }
  }

  private arc58SendReactionPayments(walletID: uint64, asset: uint64, tax: uint64, remainder: uint64): void {
    const wallet = Application(walletID)
    const origin = getOriginAccount(wallet)

    itxnCompose.begin(
      AbstractedAccountInterface.prototype.arc58_rekeyToPlugin,
      {
        appId: wallet,
        args: [
          getPluginAppList(this.akitaDAO.value).optin,
          true, // global
          '', // default account
          [], // no method offsets
          [] // no funds request
        ]
      }
    )

    itxnCompose.next(
      OptInPlugin.prototype.optIn,
      {
        appId: getPluginAppList(this.akitaDAO.value).optin,
        args: [
          walletID,
          true, // rekey back immediately
          [asset],
          itxn.payment({
            amount: Global.assetOptInMinBalance,
            receiver: origin
          })
        ],
      }
    )

    itxnCompose.next(
      AbstractedAccountInterface.prototype.arc58_verifyAuthAddress,
      { appId: wallet }
    )

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

  private arc59SendReactionPayments(creator: Account, asset: uint64, tax: uint64, remainder: uint64, arc59: arc59GetSendAssetInfoResponse): void {
    const { routerOptedIn, mbr, receiverAlgoNeededForClaim } = arc59
    const assetInbox = getOtherAppList(this.akitaDAO.value).assetInbox
    const inboxAddress = Application(assetInbox).address

    if (mbr || receiverAlgoNeededForClaim) {
      itxn
        .payment({
          receiver: inboxAddress,
          amount: mbr + receiverAlgoNeededForClaim
        })
        .submit()
    }

    if (!routerOptedIn) {
      abiCall(AssetInbox.prototype.arc59_optRouterIn, {
        appId: assetInbox,
        args: [asset]
      })
    }

    itxn
      .assetTransfer({
        assetReceiver: this.akitaDAOEscrow.value.address,
        assetAmount: tax,
        xferAsset: asset
      })
      .submit()

    abiCall(
      AssetInbox.prototype.arc59_sendAsset,
      {
        appId: assetInbox,
        args: [
          itxn.assetTransfer({
            assetReceiver: inboxAddress,
            assetAmount: remainder,
            xferAsset: asset
          }),
          new Address(creator),
          receiverAlgoNeededForClaim
        ]
      }
    )
  }

  private sendDirectReactionPayments(creator: Account, asset: uint64, tax: uint64, remainder: uint64): void {

    const taxTxn = itxn.assetTransfer({
      assetReceiver: this.akitaDAOEscrow.value.address,
      assetAmount: tax,
      xferAsset: asset
    })

    const xferTxn = itxn.assetTransfer({
      assetReceiver: creator,
      assetAmount: remainder,
      xferAsset: asset
    })

    itxn.submitGroup(taxTxn, xferTxn)
  }

  private sendReactionPayments(receiver: Account, wallet: uint64, referrer: Account, preReferralTax: uint64): uint64 {
    const { type, arc59, arc58 } = this.checkTipMbrRequirements(this.akitaDAO.value, receiver, wallet)
    let extraAmount: uint64 = 0
    
    const akta = getAkitaAssets(this.akitaDAO.value).akta
    const { tax, cost } = this.sendReferralPayment(referrer, akta, preReferralTax)
    extraAmount += cost
    const { reactFee } = getSocialFees(this.akitaDAO.value)

    switch (type) {
      case TipSendTypeDirect: {
        this.sendDirectReactionPayments(receiver, akta, tax, (reactFee - preReferralTax))
        break
      }
      case TipSendTypeARC59: {
        extraAmount = (arc59.mbr + arc59.receiverAlgoNeededForClaim)
        this.arc59SendReactionPayments(receiver, akta, tax, (reactFee - preReferralTax), arc59)
        break
      }
      case TipSendTypeARC58: {
        extraAmount = arc58
        this.arc58SendReactionPayments(wallet, akta, tax, (reactFee - preReferralTax))
        break
      }
    }

    return extraAmount
  }

  private createEmptyPostIfNecessary(key: bytes<32>, creator: Account): uint64 {
    if (!this.posts(key).exists) {
      this.posts(key).value = {
        ref: op.bzero(0),
        /**
         * when a user reacts to content other than posts
         * we set the creator to the following:
         * - AssetID: Asset Creator
         * - Address: Address
         * -   AppID: Application Creator
         */
        creator: new Address(creator),
        timestamp: Global.latestTimestamp,
        gateID: 0,
        againstContentPolicy: false,
        isAmendment: false,
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
    const voteListKey = this.vlk(account, ref)
    this.votelist(voteListKey).value = { impact, isUp }
  }

  private createPost(
    origin: Account,
    referrer: Account,
    mbrPayment: gtxn.PaymentTxn,
    cid: CID,
    gateID: uint64,
    isAmendment: boolean,
  ): void {
    assert(!this.isBanned(origin), ERR_BANNED)

    this.validatePostPayment(mbrPayment, cid, isAmendment, 0)

    // update streak before we measure impact
    // this way we guarantee the box exists
    this.updateStreak(origin)

    const impact = this.getUserImpact(origin)

    const postID = Txn.txId
    this.posts(postID).value = {
      ref: Bytes(cid),
      creator: new Address(origin),
      timestamp: Global.latestTimestamp,
      gateID: gateID,
      againstContentPolicy: false,
      isAmendment: isAmendment,
    }
    this.updateVotes(postID, true, impact)
    this.createVoteList(postID, true, origin, impact)
    this.sendPostPayment(referrer)
  }

  private createReply(
    origin: Account,
    referrer: Account,
    mbrPayment: gtxn.PaymentTxn,
    mbrNeeded: uint64,
    cid: CID,
    ref: bytes<32>,
    gateID: uint64,
    isAmendment: boolean
  ): void {
    assert(!this.isBanned(origin), ERR_BANNED)
    const { creator } = this.posts(ref).value
    assert(!this.isBlocked(creator.native, origin), ERR_BLOCKED)

    // update streak before we measure impact
    // this way we guarantee the box exists
    this.updateStreak(origin)

    const replyRef = cid.concat(ref)
    const { wallet, } = this.meta(creator.native).value
    const creatorImpact = this.getUserImpact(creator.native)
    const tax = akitaSocialFee(this.akitaDAO.value, creatorImpact)

    let extra = mbrNeeded
    extra += this.sendReactionPayments(creator.native, wallet, referrer, tax)
    // validate after we send payments, annoying but saves us compute
    this.validatePostPayment(mbrPayment, cid, isAmendment, extra)

    const replyPostID = Txn.txId

    this.posts(replyPostID).value = {
      ref: replyRef,
      creator: new Address(origin),
      timestamp: Global.latestTimestamp,
      gateID: gateID,
      againstContentPolicy: false,
      isAmendment: isAmendment,
    }

    const senderImpact = this.getUserImpact(origin)
    this.updateVotes(replyPostID, true, senderImpact)
    this.createVoteList(replyPostID, true, origin, senderImpact)
  }

  private createVote(
    origin: Account,
    referrer: Account,
    mbrPayment: gtxn.PaymentTxn,
    mbrNeeded: uint64,
    ref: bytes<32>,
    isUp: boolean
  ): void {
    assert(!this.isBanned(origin), ERR_BANNED)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)

    const { creator } = this.posts(ref).value
    assert(!this.isBlocked(creator.native, origin), ERR_BLOCKED)

    const voteListKey = this.vlk(origin, ref)
    assert(!this.votelist(voteListKey).exists, ERR_ALREADY_VOTED)
    assert(origin !== creator.native, ERR_NO_SELF_VOTE)

    const senderIsAutomated = this.meta(origin).value.automated
    assert(!senderIsAutomated, ERR_AUTOMATED_ACCOUNT)

    const akta = getAkitaAssets(this.akitaDAO.value).akta

    // update streak before we measure impact
    // this way we guarantee the box exists
    this.updateStreak(origin)
    const { reactFee, impactTaxMin, impactTaxMax } = getSocialFees(this.akitaDAO.value)

    if (isUp) {
      const { wallet } = this.meta(creator.native).value
      // calls a transaction
      const recipientImpact = this.getUserImpact(creator.native)
      const tax = impactRange(recipientImpact, impactTaxMin, impactTaxMax)

      const extra = this.sendReactionPayments(creator.native, wallet, referrer, tax)
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

      const taxTxn = itxn.assetTransfer({
        assetReceiver: this.akitaDAOEscrow.value.address,
        assetAmount: reactFee,
        xferAsset: akta
      })

      itxn.submitGroup(taxTxn)
    }

    // calls a transaction
    const senderImpact = this.getUserImpact(origin)
    this.updateVotes(ref, isUp, senderImpact)
    this.createVoteList(ref, isUp, origin, senderImpact)
  }

  private createReaction(
    origin: Account,
    referrer: Account,
    mbrPayment: gtxn.PaymentTxn,
    mbrNeeded: uint64,
    ref: bytes<32>,
    NFT: uint64
  ): void {
    assert(!this.isBanned(origin), ERR_BANNED)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const { creator } = this.posts(ref).value
    assert(!this.isBlocked(creator.native, origin), ERR_BLOCKED)
    // sender has NFT
    assert(AssetHolding.assetBalance(origin, NFT)[0] > 0, ERR_USER_DOES_NOT_OWN_NFT)

    const reactionListKey = this.rlk(origin, ref, NFT)
    assert(!this.reactionlist(reactionListKey).exists, ERR_ALREADY_REACTED)

    // update streak before we measure impact
    // this way we guarantee the box exists
    this.updateStreak(origin)

    const { wallet } = this.meta(creator.native).value
    const recipientImpact = this.getUserImpact(creator.native)
    const { impactTaxMin, impactTaxMax } = getSocialFees(this.akitaDAO.value)
    const tax = impactRange(recipientImpact, impactTaxMin, impactTaxMax)

    const reactionKey: ReactionsKey = { ref, NFT }
    const reactionExists = this.reactions(reactionKey).exists

    let extra = mbrNeeded
    extra += this.sendReactionPayments(creator.native, wallet, referrer, tax)
    // validate after we send payments, annoying but saves us compute
    this.validateReactPayment(mbrPayment, reactionExists, extra)

    if (reactionExists) {
      this.reactions(reactionKey).value += 1
    } else {
      this.reactions(reactionKey).value = 1
    }

    this.reactionlist(reactionListKey).create()
  }

  private createFollow(origin: Account, address: Address): void {
    assert(!this.isBanned(origin), ERR_BANNED)
    assert(!this.isBlocked(address.native, origin), ERR_BLOCKED)

    const senderIsAutomated = this.meta(origin).value.automated
    assert(!senderIsAutomated, ERR_AUTOMATED_ACCOUNT)

    const { followerIndex } = this.meta(address.native).value

    const followsKey: FollowsKey = { user: address.native, index: (followerIndex + 1) }
    this.follows(followsKey).value = origin

    this.meta(address.native).value.followerIndex += 1
    this.meta(address.native).value.followerCount += 1
  }

  private validateTip(tip: gtxn.AssetTransferTxn, action: TipAction) {
    const akta = Asset(getAkitaAssets(this.akitaDAO.value).akta)
    const { postFee, reactFee } = getSocialFees(this.akitaDAO.value)

    assertMatch(
      tip,
      {
        assetReceiver: Global.currentApplicationAddress,
        xferAsset: akta,
        assetAmount: (action === TipActionPost) ? postFee : reactFee,
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
    let amount: uint64 = posts + votes + votelist + extraAmount
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

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64, escrow: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
    this.akitaDAOEscrow.value = Application(escrow)
  }

  // AKITA SOCIAL PLUGIN METHODS ------------------------------------------------------------------

  post(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    cid: CID,
    gateID: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    this.validateTip(tip, TipActionPost)
    this.createPost(origin, referrer, mbrPayment, cid, gateID, false)
  }

  editPost(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    cid: CID,
    gateID: uint64,
    amendment: bytes<32>
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    assert(this.posts(amendment).exists, ERR_POST_NOT_FOUND)
    const { creator, ref } = this.posts(amendment).value
    assert(this.isCreator(creator.native, wallet), ERR_NOT_YOUR_POST_TO_EDIT)
    assert(!this.isReply(ref), ERR_IS_A_REPLY)
    assert(!this.isAmended(ref), ERR_IS_ALREADY_AMENDED)

    this.posts(amendment).value.ref = ref.concat(Bytes('a').concat(Txn.txId))

    this.validateTip(tip, TipActionPost)
    this.createPost(origin, referrer, mbrPayment, cid, gateID, true)
  }

  gatedReplyPost(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    cid: CID,
    ref: bytes<32>,
    gateID: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const { gateID: postGateID } = this.posts(ref).value
    assert(gateCheck(gateTxn, this.akitaDAO.value, origin, postGateID), ERR_FAILED_GATE)

    this.validateTip(tip, TipActionReact)
    this.createReply(origin, referrer, mbrPayment, 0, cid, ref, gateID, false)
  }

  replyPost(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    cid: CID,
    ref: bytes<32>,
    gateID: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const { gateID: postGateID } = this.posts(ref).value
    assert(postGateID === 0, ERR_HAS_GATE)

    this.validateTip(tip, TipActionReact)
    this.createReply(origin, referrer, mbrPayment, 0, cid, ref, gateID, false)
  }

  replyAsset(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    cid: CID,
    ref: uint64,
    gateID: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    assert(ref !== 0, ERR_INVALID_ASSET)
    assert(Asset(ref).total > 0, ERR_INVALID_ASSET)
    const paddedRef = itob(ref).concat(op.bzero(24)).toFixed({ length: 32 })
    const addedMbr = this.createEmptyPostIfNecessary(paddedRef, Application(ref).creator)

    this.validateTip(tip, TipActionReact)
    this.createReply(origin, referrer, mbrPayment, addedMbr, cid, paddedRef, gateID, false)
  }

  gatedReplyAddress(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    cid: CID,
    ref: Address,
    gateID: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    // if meta doesn't exist they aren't gated
    assert(this.meta(ref.native).exists, ERR_META_DOESNT_EXIST)
    const { addressGateID } = this.meta(ref.native).value
    assert(gateCheck(gateTxn, this.akitaDAO.value, origin, addressGateID), ERR_FAILED_GATE)

    const r = ref.native.bytes
    const addedMbr = this.createEmptyPostIfNecessary(r, ref.native)

    this.validateTip(tip, TipActionReact)
    this.createReply(origin, referrer, mbrPayment, addedMbr, cid, r, gateID, false)
  }

  replyAddress(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    cid: CID,
    ref: Address,
    gateID: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    if (this.meta(ref.native).exists) {
      const { addressGateID } = this.meta(ref.native).value
      assert(addressGateID === 0, ERR_HAS_GATE)
    }

    const r = ref.native.bytes
    const addedMbr = this.createEmptyPostIfNecessary(r, ref.native)

    this.validateTip(tip, TipActionReact)
    this.createReply(origin, referrer, mbrPayment, addedMbr, cid, r, gateID, false)
  }

  replyApp(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    cid: CID,
    ref: uint64,
    gateID: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    assert(ref !== 0, ERR_INVALID_APP)
    assert(Application(ref).approvalProgram.length > 0, ERR_INVALID_APP)
    const paddedRef = itob(ref).concat(op.bzero(24)).toFixed({ length: 32 })
    const addedMbr = this.createEmptyPostIfNecessary(paddedRef, Application(ref).creator)

    this.validateTip(tip, TipActionReact)
    this.createReply(origin, referrer, mbrPayment, addedMbr, cid, paddedRef, gateID, false)
  }

  gatedEditReply(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    cid: CID,
    gateID: uint64,
    amendment: bytes<32>
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    assert(this.posts(amendment).exists, ERR_REPLY_NOT_FOUND)
    const { creator, ref } = this.posts(amendment).value
    assert(this.isCreator(creator.native, wallet), ERR_NOT_YOUR_POST_TO_EDIT)
    assert(this.isReply(ref), ERR_NOT_A_REPLY)
    assert(!this.isAmended(ref), ERR_IS_ALREADY_AMENDED)

    this.posts(amendment).value.ref = ref.concat(Bytes('a').concat(Txn.txId))

    const originalPostRef = ref.slice(0, 32).toFixed({ length: 32 })
    const { gateID: ogPostGateID } = this.posts(originalPostRef).value
    assert(gateCheck(gateTxn, this.akitaDAO.value, origin, ogPostGateID), ERR_FAILED_GATE)

    this.validateTip(tip, TipActionReact)
    this.createReply(origin, referrer, mbrPayment, 0, cid, originalPostRef, gateID, true)
  }

  editReply(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    cid: CID,
    gateID: uint64,
    amendment: bytes<32>
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    assert(this.posts(amendment).exists, ERR_REPLY_NOT_FOUND)
    const { creator, ref } = this.posts(amendment).value
    assert(this.isCreator(creator.native, wallet), ERR_NOT_YOUR_POST_TO_EDIT)
    assert(this.isReply(ref), ERR_NOT_A_REPLY)
    assert(!this.isAmended(ref), ERR_IS_ALREADY_AMENDED)

    this.posts(amendment).value.ref = ref.concat(Bytes('a').concat(Txn.txId))

    const originalPostRef = ref.slice(0, 32).toFixed({ length: 32 })
    const { gateID: ogPostGateID } = this.posts(originalPostRef).value
    assert(ogPostGateID === 0, ERR_HAS_GATE)

    this.validateTip(tip, TipActionReact)
    this.createReply(origin, referrer, mbrPayment, 0, cid, originalPostRef, gateID, true)
  }

  votePost(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    ref: bytes<32>,
    isUp: boolean
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    this.validateTip(tip, TipActionReact)
    const mbrNeeded = this.mbr(Bytes('')).votelist
    this.createVote(origin, referrer, mbrPayment, mbrNeeded, ref, isUp)
  }

  voteAsset(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    ref: uint64,
    isUp: boolean
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    assert(ref !== 0, ERR_INVALID_ASSET)
    assert(Asset(ref).total > 0, ERR_INVALID_ASSET)
    const paddedRef = itob(ref).concat(op.bzero(24)).toFixed({ length: 32 })
    const mbrNeeded = this.mbr(Bytes('')).votelist
    const addedMbr = this.createEmptyPostIfNecessary(paddedRef, Asset(ref).creator)

    this.validateTip(tip, TipActionReact)
    this.createVote(origin, referrer, mbrPayment, (mbrNeeded + addedMbr), paddedRef, isUp)
  }

  voteAddress(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    ref: Address,
    isUp: boolean
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    const r = ref.native.bytes
    const mbrNeeded = this.mbr(Bytes('')).votelist
    const addedMbr = this.createEmptyPostIfNecessary(r, ref.native)

    this.validateTip(tip, TipActionReact)
    this.createVote(origin, referrer, mbrPayment, (mbrNeeded + addedMbr), r, isUp)
  }

  voteApp(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    ref: uint64,
    isUp: boolean
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    assert(ref !== 0, ERR_INVALID_APP)
    assert(Application(ref).approvalProgram.length > 0, ERR_INVALID_APP)
    const paddedRef = itob(ref).concat(op.bzero(24)).toFixed({ length: 32 })
    const mbrNeeded = this.mbr(Bytes('')).votelist
    const addedMbr = this.createEmptyPostIfNecessary(paddedRef, Application(ref).creator)

    this.validateTip(tip, TipActionReact)
    this.createVote(origin, referrer, mbrPayment, (mbrNeeded + addedMbr), paddedRef, isUp)
  }

  editVote(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    ref: bytes<32>,
    flip: boolean
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    const voteListKey = this.vlk(origin, ref)
    assert(this.votelist(voteListKey).exists, ERR_HAVENT_VOTED)

    const { impact, isUp } = this.votelist(voteListKey).value

    // undo user vote
    this.updateVotes(ref, !isUp, impact)

    // if the user doesn't want to flip their vote, delete the votelist and refund
    if (!flip) {
      // delete votelist
      this.votelist(voteListKey).delete()
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
    this.createVote(origin, referrer, mbrPayment, 0, ref, !isUp)
  }

  gatedReactPost(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    ref: bytes<32>,
    NFT: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const { gateID } = this.posts(ref).value
    assert(gateCheck(gateTxn, this.akitaDAO.value, origin, gateID), ERR_FAILED_GATE)

    this.validateTip(tip, TipActionReact)
    this.createReaction(origin, referrer, mbrPayment, 0, ref, NFT)
  }

  reactPost(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    ref: bytes<32>,
    NFT: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const { gateID: postGateID } = this.posts(ref).value
    assert(postGateID === 0, ERR_HAS_GATE)

    this.validateTip(tip, TipActionReact)
    this.createReaction(origin, referrer, mbrPayment, 0, ref, NFT)
  }

  reactAsset(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    ref: uint64,
    NFT: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    assert(ref !== 0, ERR_INVALID_ASSET)
    assert(Asset(ref).total > 0, ERR_INVALID_ASSET)
    const paddedRef = itob(ref).concat(op.bzero(24)).toFixed({ length: 32 })
    const addedMbr = this.createEmptyPostIfNecessary(paddedRef, Asset(ref).creator)

    this.validateTip(tip, TipActionReact)
    this.createReaction(origin, referrer, mbrPayment, addedMbr, paddedRef, NFT)
  }

  gatedReactAddress(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    ref: Address,
    NFT: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    if (this.meta(ref.native).exists) {
      const { addressGateID } = this.meta(ref.native).value
      assert(gateCheck(gateTxn, this.akitaDAO.value, origin, addressGateID), ERR_FAILED_GATE)
    }

    const r = ref.native.bytes
    const addedMbr = this.createEmptyPostIfNecessary(r, ref.native)

    this.validateTip(tip, TipActionReact)
    this.createReaction(origin, referrer, mbrPayment, addedMbr, r, NFT)
  }

  reactAddress(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    ref: Address,
    NFT: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    if (this.meta(ref.native).exists) {
      const { addressGateID } = this.meta(ref.native).value
      assert(addressGateID === 0, ERR_HAS_GATE)
    }

    const r = ref.native.bytes
    let addedMbr = this.createEmptyPostIfNecessary(r, ref.native)

    this.validateTip(tip, TipActionReact)
    this.createReaction(origin, referrer, mbrPayment, addedMbr, r, NFT)
  }

  reactApp(
    mbrPayment: gtxn.PaymentTxn,
    tip: gtxn.AssetTransferTxn,
    ref: uint64,
    NFT: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)
    const referrer = referrerOrZeroAddress(wallet)

    assert(ref !== 0, ERR_INVALID_APP)
    assert(Application(ref).approvalProgram.length > 0, ERR_INVALID_APP)
    const paddedRef = itob(ref).concat(op.bzero(24)).toFixed({ length: 32 })
    const addedMbr = this.createEmptyPostIfNecessary(paddedRef, Application(ref).creator)

    this.validateTip(tip, TipActionReact)
    this.createReaction(origin, referrer, mbrPayment, addedMbr, paddedRef, NFT)
  }

  deleteReaction(ref: bytes<32>, NFT: uint64): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(!this.isBanned(origin), ERR_BANNED)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const { creator } = this.posts(ref).value
    assert(!this.isBlocked(creator.native, origin), ERR_BLOCKED)

    const reactionListKey = this.rlk(origin, ref, NFT)
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

  gatedFollow(
    mbrPayment: gtxn.PaymentTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    address: Address
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(this.meta(address.native).exists, ERR_META_DOESNT_EXIST)
    const { followGateID } = this.meta(address.native).value
    assert(gateCheck(gateTxn, this.akitaDAO.value, origin, followGateID), ERR_FAILED_GATE)

    const { follows } = this.mbr(Bytes(''))
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: follows
      },
      ERR_INVALID_PAYMENT
    )

    this.createFollow(origin, address)
  }

  follow(mbrPayment: gtxn.PaymentTxn, address: Address): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(this.meta(address.native).exists, ERR_META_DOESNT_EXIST)
    const { followGateID } = this.meta(address.native).value
    assert(followGateID === 0, ERR_HAS_GATE)

    const { follows } = this.mbr(Bytes(''))
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: follows
      },
      ERR_INVALID_PAYMENT
    )

    this.createFollow(origin, address)
  }

  unfollow(address: Address, index: uint64): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(!this.isBanned(origin), ERR_BANNED)

    const followsKey = { user: address.native, index }
    assert(this.follows(followsKey).value === origin, ERR_WRONG_FOLLOWER_KEY)

    this.meta(address.native).value.followerCount -= 1

    this.follows(followsKey).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).follows
      })
      .submit()
  }

  // we dont remove followers because that requires us to know the index
  // instead, blocking supersedes following
  block(mbrPayment: gtxn.PaymentTxn, address: Address): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(!this.isBanned(origin), ERR_BANNED)

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.mbr(Bytes('')).blocks
      },
      ERR_INVALID_PAYMENT
    )

    const blocksKey = this.blk(origin, address.native)
    this.blocks(blocksKey).create()
  }

  unblock(address: Address): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(!this.isBanned(origin), ERR_BANNED)

    const blocksKey = this.blk(origin, address.native)
    this.blocks(blocksKey).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).blocks
      })
      .submit()
  }

  addModerator(mbrPayment: gtxn.PaymentTxn, address: Address): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_DAO)
    assert(!this.moderators(address.native).exists, ERR_ALREADY_A_MODERATOR)

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.mbr(Bytes('')).moderators
      },
      ERR_INVALID_PAYMENT
    )

    this.moderators(address.native).create()
  }

  removeModerator(address: Address): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_DAO)
    assert(this.moderators(address.native).exists, ERR_NOT_A_MODERATOR)

    this.moderators(address.native).delete()

    itxn
      .payment({
        receiver: Txn.sender,
        amount: this.mbr(Bytes('')).moderators
      })
      .submit()
  }

  ban(mbrPayment: gtxn.PaymentTxn, address: Address, expiration: uint64): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(this.moderators(origin).exists, ERR_NOT_A_MODERATOR)
    assert(!this.banned(address.native).exists, ERR_ALREADY_BANNED)

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.mbr(Bytes('')).banned
      },
      ERR_INVALID_PAYMENT
    )

    this.banned(address.native).value = expiration
  }

  flagPost(ref: bytes<32>): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(this.moderators(origin).exists, ERR_NOT_A_MODERATOR)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const { againstContentPolicy } = this.posts(ref).value
    assert(!againstContentPolicy, ERR_ALREADY_FLAGGED)

    this.posts(ref).value.againstContentPolicy = true
  }

  unflagPost(ref: bytes<32>): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(this.moderators(origin).exists, ERR_NOT_A_MODERATOR)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const { againstContentPolicy } = this.posts(ref).value
    assert(againstContentPolicy, ERR_NOT_FLAGGED)
    this.posts(ref).value.againstContentPolicy = false
  }

  unban(address: Address): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(this.moderators(origin).exists, ERR_NOT_A_MODERATOR)
    this.banned(address.native).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).banned
      })
      .submit()
  }

  addAction(mbrPayment: gtxn.PaymentTxn, actionAppID: uint64, content: CID) {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_DAO)
    assert(!this.actions(actionAppID).exists, ERR_ALREADY_AN_ACTION)

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.mbr(Bytes('')).actions
      },
      ERR_INVALID_PAYMENT
    )

    this.actions(actionAppID).value = { content }
  }

  removeAction(actionAppID: uint64) {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_DAO)
    assert(this.actions(actionAppID).exists, ERR_ALREADY_AN_ACTION)

    this.actions(actionAppID).delete()

    itxn
      .payment({
        receiver: Txn.sender,
        amount: this.mbr(Bytes('')).actions
      })
      .submit()
  }

  initMeta(
    mbrPayment: gtxn.PaymentTxn,
    user: Address,
    automated: boolean,
    subscriptionIndex: uint64,
    NFD: uint64,
    akitaNFT: uint64,
  ): uint64 {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, user.native)
    const origin = originOr(wallet, user.native)
    const userIsSender = (Txn.sender === user.native)

    assert(!this.meta(origin).exists, ERR_META_ALREADY_EXISTS)

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.mbr(Bytes('')).meta + ImpactMetaMBR
      },
      ERR_INVALID_PAYMENT
    )

    const impact = getAkitaAppList(this.akitaDAO.value).impact

    itxn
      .payment({
        receiver: Application(impact).address,
        amount: ImpactMetaMBR
      })
      .submit()

    if (automated) {
      this.meta(origin).value = {
        initialized: userIsSender,
        wallet: wallet.id,
        streak: 1,
        startDate: Global.latestTimestamp,
        lastActive: Global.latestTimestamp,
        followerIndex: 0,
        followerCount: 0,
        automated: true,
        followGateID: 0,
        addressGateID: 0,
      }

      abiCall(
        AkitaSocialImpact.prototype.cacheMeta,
        {
          appId: impact,
          args: [
            new Address(origin),
            0,
            0,
            0
          ]
        }
      )

      return 0
    }

    this.meta(origin).value = {
      initialized: userIsSender,
      wallet: wallet.id,
      streak: 1,
      startDate: Global.latestTimestamp,
      lastActive: Global.latestTimestamp,
      followerIndex: 0,
      followerCount: 0,
      automated: false,
      followGateID: 0,
      addressGateID: 0,
    }

    const impactScore = abiCall(
      AkitaSocialImpact.prototype.cacheMeta,
      {
        appId: getAkitaAppList(this.akitaDAO.value).impact,
        args: [
          new Address(origin),
          subscriptionIndex,
          NFD,
          akitaNFT
        ]
      }
    ).returnValue

    return impactScore + this.getSocialImpactScore(origin)
  }

  updateMeta(
    followGateID: uint64,
    addressGateID: uint64,
    subscriptionIndex: uint64,
    NFD: uint64,
    akitaNFT: uint64
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(this.meta(origin).exists, ERR_META_DOESNT_EXIST)

    this.meta(origin).value.followGateID = followGateID
    this.meta(origin).value.addressGateID = addressGateID

    const impact = getAkitaAppList(this.akitaDAO.value).impact
    abiCall(
      AkitaSocialImpact.prototype.cacheMeta,
      {
        appId: impact,
        args: [
          new Address(origin),
          subscriptionIndex,
          NFD,
          akitaNFT
        ]
      }
    )
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  @abimethod({ readonly: true })
  getUserSocialImpact(user: Address): uint64 {
    return this.getSocialImpactScore(user.native)
  }

  @abimethod({ readonly: true })
  isFollower(user: Address, index: uint64, follower: Address): boolean {
    return this.follows({ user: user.native, index }).value === follower.native
  }

  @abimethod({ readonly: true })
  moderatorMeta(user: Address): { exists: boolean; lastActive: uint64 } {
    if (this.moderators(user.native).exists) {
      return {
        exists: true,
        lastActive: this.moderators(user.native).value
      }
    }
    return { exists: false, lastActive: 0 }
  }

  @abimethod({ readonly: true })
  getMeta(user: Address): MetaValue {
    return this.meta(user.native).value
  }

  @abimethod({ readonly: true })
  getMetaWallet(user: Address): uint64 {
    if (this.meta(user.native).exists) {
      return this.meta(user.native).value.wallet
    }
    return 0
  }

  @abimethod({ readonly: true })
  postExists(ref: bytes): boolean {
    assert(ref.length === 32 || ref.length === 8, ERR_INVALID_REF_LENGTH)

    if (ref.length === 8) {
      const paddedRef = ref.concat(op.bzero(24)).toFixed({ length: 32 })
      return this.posts(paddedRef).exists
    }

    return this.posts(ref.toFixed({ length: 32 })).exists
  }

  @abimethod({ readonly: true })
  reactionMeta(ref: bytes, NFT: uint64, user: Address): ReactionMeta {
    const postExists = this.postExists(ref)
    let reactionExists: boolean = false
    if (postExists) {
      if (ref.length === 8) {
        const paddedRef = ref.concat(op.bzero(24)).toFixed({ length: 32 })
        reactionExists = this.reactions({ ref: paddedRef, NFT }).exists
      } else {
        reactionExists = this.reactions({ ref: ref.toFixed({ length: 32 }), NFT }).exists
      }
    }

    let creatorWallet: uint64 = 0
    let addressGateID: uint64 = 0
    if (this.meta(user.native).exists) {
      const { wallet, addressGateID: metaAddressGateID } = this.meta(user.native).value
      creatorWallet = wallet
      addressGateID = metaAddressGateID
    }

    return {
      postExists,
      reactionExists,
      creatorWallet,
      addressGateID
    }
  }

  @abimethod({ readonly: true })
  getPost(ref: bytes<32>): PostValue {
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    return this.posts(ref).value
  }

  @abimethod({ readonly: true })
  getPostAndCreatorMeta(ref: bytes<32>): { post: PostValue; meta: MetaValue } {
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const post = clone(this.posts(ref).value)
    const meta = clone(this.meta(post.creator.native).value)
    return { post, meta }
  }

  @abimethod({ readonly: true })
  getVote(ref: bytes<32>): VoteListValue {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    const voteListKey = this.vlk(origin, ref)
    assert(this.votelist(voteListKey).exists, ERR_HAVENT_VOTED)

    return this.votelist(voteListKey).value
  }

  @abimethod({ readonly: true })
  getPostMeta(ref: bytes<32>, NFT: uint64): PostMeta {
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const post = clone(this.posts(ref).value)
    const meta = clone(this.meta(post.creator.native).value)
    const reactionExists = this.reactions({ ref, NFT }).exists
    return { post, meta, reactionExists }
  }

  // dummy call to allow for more references
  opUp(): void { }
}


export class AkitaSocialImpact extends AkitaBaseContract implements AkitaSocialImpactInterface {

  // BOXES ----------------------------------------------------------------------------------------    

  /** A map of the meta data for each user */
  meta = BoxMap<Account, ImpactMetaValue>({ keyPrefix: ImpactBoxPrefixMeta })
  /** A map of how each akita subscription affects impact calculation */
  subscriptionStateModifier = BoxMap<uint64, uint64>({ keyPrefix: ImpactBoxPrefixSubscriptionStateModifier })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private mbr(): AkitaSocialImpactMBRData {
    return {
      meta: ImpactMetaMBR,
      subscriptionStateModifier: SubscriptionStateModifierMBR,
    }
  }

  private userHolds(account: Account, NFT: Asset): boolean {
    return AssetHolding.assetBalance(account, NFT)[0] > 0
  }

  private isSubscribed(account: Account, index: uint64): { active: boolean; serviceID: uint64; streak: uint64 } {
    const info = abiCall(
      Subscriptions.prototype.getSubscriptionInfo,
      {
        appId: getAkitaAppList(this.akitaDAO.value).subscriptions,
        args: [new Address(account), index]
      },
    ).returnValue

    // ensure they're subscribed to an Akita offering
    const toAkita = info.recipient.native === this.akitaDAO.value.address

    // box index zero is reserved for donations
    // if its higher than zero then they're subscribed to an offer
    const notDonating = info.serviceID !== 0

    const lastWindowStart: uint64 = Global.latestTimestamp - (((Global.latestTimestamp - info.startDate) % info.interval) + info.interval)

    // this doesn't tell us about the consistency of their payments,
    // only that their subscription isn't currently stale
    const notStale = info.lastPayment > lastWindowStart

    return {
      active: toAkita && notDonating && notStale,
      serviceID: info.serviceID,
      streak: info.streak,
    }
  }

  private isNFD(NFDApp: Application): boolean {
    const [nfdNameBytes] = op.AppGlobal.getExBytes(NFDApp, Bytes(NFDGlobalStateKeysName))

    return abiCall(
      NFDRegistry.prototype.isValidNfdAppId,
      {
        appId: getOtherAppList(this.akitaDAO.value).nfdRegistry,
        args: [String(nfdNameBytes), NFDApp.id]
      }
    ).returnValue
  }

  // iterates over an NFD contracts verified addresses to check if the given address exists in the list
  private addressVerifiedOnNFD(account: Account, NFDApp: Application): boolean {
    const caAlgoData = abiCall(
      NFD.prototype.readField,
      {
        appId: NFDApp.id,
        args: [
          Bytes(NFDMetaKeyVerifiedAddresses)
        ],

      },
    ).returnValue

    for (let i: uint64 = 0; i < caAlgoData.length; i += 32) {
      const addr = caAlgoData.slice(i, i + 32)
      if (addr !== Global.zeroAddress.bytes && addr === account.bytes) {
        return true
      }
    }

    return false
  }

  private isAkitaNFT(akitaNFT: Asset): boolean {
    return akitaNFT.creator === Account(AkitaNFTCreatorAddress)
  }

  private userImpact(account: Account, includeSocial: boolean): uint64 {
    const { subscriptionIndex, NFD, akitaNFT } = this.meta(account).value

    const stakedAktaImpact = this.getStakingImpactScore(account) // Staked AKTA | up to 250
    const subscriberImpact = this.getSubscriberImpactScore(account, subscriptionIndex) // Akita Subscriber | up to 250
    const socialImpact = includeSocial ? this.getSocialImpactScore(account) : Uint64(0) // Social Activity | up to 250
    const nfdScore = this.getNFDImpactScore(account, Application(NFD)) // NFD | up to 150
    const heldAkitaImpact = this.getHeldAktaImpactScore(account) // Held AKTA | up to 50
    const nftImpact = this.getNFTImpactScore(account, Asset(akitaNFT)) // Holds AKC/Omnigem | 50

    const total: uint64 = stakedAktaImpact + subscriberImpact + socialImpact + nfdScore + heldAkitaImpact + nftImpact
    if (total === 0) {
      return 1
    }

    return total
  }

  private getStakingImpactScore(account: Account): uint64 {
    // - Staked AKTA | up to 250
    const akta = getAkitaAssets(this.akitaDAO.value).akta

    const info = abiCall(
      Staking.prototype.getInfo,
      {
        appId: getAkitaAppList(this.akitaDAO.value).staking,
        args: [
          new Address(account),
          {
            asset: akta,
            type: STAKING_TYPE_SOFT,
          }
        ]
      }
    ).returnValue

    const elapsed: uint64 = Global.latestTimestamp - info.lastUpdate

    // if the amount staked is too low or not much time has passed short circuit
    if (info.amount < TEN_THOUSAND_AKITA || elapsed < THIRTY_DAYS) {
      return 0
    }

    // Calculate score based on time elapsed, capped by amount staked
    const amtCapped = info.amount >= TWO_HUNDRED_THOUSAND_AKITA ? TWO_HUNDRED_THOUSAND_AKITA : info.amount

    // Calculate the maximum possible score based on the staked amount
    const maxScore: uint64 = (amtCapped * 250) / TWO_HUNDRED_THOUSAND_AKITA

    // Calculate the actual score based on time elapsed, capped by maxScore
    const timeCapped = elapsed >= ONE_YEAR ? ONE_YEAR : elapsed

    return (timeCapped * maxScore) / ONE_YEAR
  }

  private getHeldAktaImpactScore(account: Account): uint64 {
    const akta = getAkitaAssets(this.akitaDAO.value).akta
    const balance = AssetHolding.assetBalance(account, akta)[0]

    // if the amount is too low short circuit
    if (balance < TEN_THOUSAND_AKITA) {
      return 0
    }

    const capped = balance >= ONE_MILLION_AKITA ? ONE_MILLION_AKITA : balance
    return (capped * 50) / ONE_MILLION_AKITA
  }

  private getSubscriberImpactScore(account: Account, subscriptionIndex: uint64): uint64 {
    let subscriberImpact: uint64 = 0

    const subscriptionState = this.isSubscribed(account, subscriptionIndex)

    if (!subscriptionState.active) {
      return subscriberImpact
    }

    const modifier = this.subscriptionStateModifier(subscriptionState.serviceID).value

    // the streak will be up to date because we check for staleness in isSubscribed
    if (subscriptionState.streak >= 12) {
      subscriberImpact += 250 / modifier
    } else {
      subscriberImpact += (subscriptionState.streak * 20) / modifier
    }

    return subscriberImpact
  }

  private getSocialImpactScore(account: Account): uint64 {
    return abiCall(
      AkitaSocial.prototype.getUserSocialImpact,
      {
        appId: getAkitaAppList(this.akitaDAO.value).social,
        args: [new Address(account)]
      }
    ).returnValue
  }

  private nfdReadField(NFDApp: Application, field: string): bytes {
    const fieldBytes = abiCall(
      NFD.prototype.readField,
      {
        appId: NFDApp.id,
        args: [Bytes(field)]
      }
    ).returnValue

    return fieldBytes
  }

  private getNFDSocialFields(NFDApp: Application): { domain: bytes; twitter: bytes; discord: bytes; telegram: bytes } {
    const domain = this.nfdReadField(NFDApp, NFDMetaKeyVerifiedDomain)
    const twitter = this.nfdReadField(NFDApp, NFDMetaKeyVerifiedTwitter)
    const discord = this.nfdReadField(NFDApp, NFDMetaKeyVerifiedDiscord)
    const telegram = this.nfdReadField(NFDApp, NFDMetaKeyVerifiedTelegram)

    return { domain, twitter, discord, telegram }
  }

  private calcNFDImpactScore(NFDApp: Application): uint64 {
    // base | 50
    let nfdImpact: uint64 = 50

    const [parentAppIDBytes, parentAppIDBytesExist] = op.AppGlobal.getExBytes(NFDApp, Bytes(NFDGlobalStateKeysParentAppID))

    if (parentAppIDBytesExist && btoi(parentAppIDBytes) === getOtherAppList(this.akitaDAO.value).akitaNfd) {
      nfdImpact += 50
    }

    const version = op.AppGlobal.getExBytes(NFDApp, Bytes(NFDGlobalStateKeysVersion))[0].slice(0, 2)

    if (version !== Bytes('3.')) {
      return nfdImpact
    }

    const { domain, twitter, discord, telegram } = this.getNFDSocialFields(NFDApp)

    // website | 10
    if (domain.length > 0) {
      nfdImpact += 10
    }

    // twitter | 20
    if (twitter.length > 0) {
      nfdImpact += 20
    }

    // discord | 10
    if (discord.length > 0) {
      nfdImpact += 10
    }

    // telegram | 10
    if (telegram.length > 0) {
      nfdImpact += 10
    }

    return nfdImpact
  }

  private getNFDImpactScore(account: Account, NFDApp: Application): uint64 {
    const { NFD, nfdTimeChanged, nfdImpact } = this.meta(account).value
    const timeChanged = btoi(op.AppGlobal.getExBytes(NFD, Bytes(NFDGlobalStateKeysTimeChanged))[0])

    assert(NFDApp.id === Application(NFD).id, ERR_INVALID_NFD)
    assert(nfdTimeChanged === timeChanged, ERR_NFD_CHANGED)

    return nfdImpact
  }

  private getNFTImpactScore(account: Account, asset: Asset): uint64 {
    const prefix = asset.unitName.slice(0, 3)
    const balance = AssetHolding.assetBalance(account, asset)[0]
    if (asset.creator === Account(AkitaNFTCreatorAddress) && balance > 0) {
      if (prefix === Bytes(AkitaCollectionsPrefixAKC)) {
        return 50
      }
      if (prefix === Bytes(AkitaCollectionsPrefixAOG)) {
        return 25
      }
    }
    return 0
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(akitaDAO: uint64, version: string): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // IMPACT METHODS -------------------------------------------------------------------------------

  cacheMeta(address: Address, subscriptionIndex: uint64, NFDAppID: uint64, akitaAssetID: uint64): uint64 {
    assert(Txn.sender === Application(getAkitaAppList(this.akitaDAO.value).social).address, ERR_NOT_SOCIAL)

    if (subscriptionIndex !== 0) {
      assert(this.isSubscribed(address.native, subscriptionIndex).active, ERR_NOT_A_SUBSCRIPTION)
    }

    let nfdTimeChanged: uint64 = 0
    let nfdImpact: uint64 = 0
    if (NFDAppID !== 0) {
      const nfdApp = Application(NFDAppID)
      assert(this.isNFD(nfdApp), ERR_NOT_AN_NFD)
      assert(this.addressVerifiedOnNFD(address.native, nfdApp), ERR_USER_DOES_NOT_OWN_NFD)
      const [timeChangedBytes] = op.AppGlobal.getExBytes(nfdApp, Bytes(NFDGlobalStateKeysTimeChanged))
      nfdTimeChanged = btoi(timeChangedBytes)
      nfdImpact = this.calcNFDImpactScore(nfdApp)
    }

    if (akitaAssetID !== 0) {
      const akitaNFT = Asset(akitaAssetID)
      assert(this.isAkitaNFT(akitaNFT), ERR_NOT_AN_AKITA_NFT)
      assert(this.userHolds(address.native, akitaNFT), ERR_USER_DOES_NOT_OWN_NFT)
    }

    this.meta(address.native).value = {
      subscriptionIndex,
      NFD: NFDAppID,
      nfdTimeChanged,
      nfdImpact,
      akitaNFT: akitaAssetID,
    }

    return nfdImpact
  }

  updateSubscriptionStateModifier(payment: gtxn.PaymentTxn, subscriptionIndex: uint64, newModifier: uint64): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_DAO)

    this.subscriptionStateModifier(subscriptionIndex).value = newModifier

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.mbr().subscriptionStateModifier
      },
      ERR_INVALID_PAYMENT
    )
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  // exists so the social protocol contract can call it without reentrancy issues
  @abimethod({ readonly: true })
  getUserImpactWithoutSocial(address: Address): uint64 {
    return this.userImpact(address.native, false)
  }

  @abimethod({ readonly: true })
  getUserImpact(address: Address): uint64 {
    return this.userImpact(address.native, true)
  }

  @abimethod({ readonly: true })
  getMeta(user: Address): ImpactMetaValue {
    return this.meta(user.native).value
  }
}
