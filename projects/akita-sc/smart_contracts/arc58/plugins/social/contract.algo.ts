import { AssetInbox } from '../../../utils/types/asset-inbox'
import { Account, Application, assert, assertMatch, Asset, BoxMap, Bytes, bytes, Global, gtxn, itxn, op, Txn, Uint64, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4, DynamicArray, DynamicBytes, methodSelector, StaticBytes, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaSocialMBRData, arc4BlockListKey, arc4VoteListKey, MetaValue, PostValue, VoteListValue, VotesValue, AkitaSocialImpactMBRData, arc4ImpactMetaValue, ImpactMetaValue, FollowsKey, BlockListKey, VoteListKey, ReactionsKey, ReactionListKey, Action } from './types'
import { bytes16, bytes32, bytes4, CID, paddedBytes32 } from '../../../utils/types/base'
import { AkitaSocialBoxPrefixActions, AkitaSocialBoxPrefixBanned, AkitaSocialBoxPrefixBlocks, AkitaSocialBoxPrefixFollows, AkitaSocialBoxPrefixMeta, AkitaSocialBoxPrefixModerators, AkitaSocialBoxPrefixPosts, AkitaSocialBoxPrefixReactionList, AkitaSocialBoxPrefixReactions, AkitaSocialBoxPrefixVoteList, AkitaSocialBoxPrefixVotes, ONE_DAY, TWO_YEARS, ImpactBoxPrefixMeta, ImpactBoxPrefixSubscriptionStateModifier, NFDGlobalStateKeysName, NFDGlobalStateKeysParentAppID, NFDGlobalStateKeysTimeChanged, NFDGlobalStateKeysVersion, NFDMetaKeyVerifiedAddresses, NFDMetaKeyVerifiedDiscord, NFDMetaKeyVerifiedDomain, NFDMetaKeyVerifiedTelegram, NFDMetaKeyVerifiedTwitter, ONE_MILLION_AKITA, ONE_YEAR, TEN_THOUSAND_AKITA, THIRTY_DAYS, TWO_HUNDRED_THOUSAND_AKITA } from './constants'
import { AbstractedAccount } from '../../account/contract.algo'
import { submitGroup } from '@algorandfoundation/algorand-typescript/itxn'
import { ERR_ALREADY_A_MODERATOR, ERR_ALREADY_AN_ACTION, ERR_ALREADY_BANNED, ERR_ALREADY_FLAGGED, ERR_ALREADY_REACTED, ERR_ALREADY_VOTED, ERR_AUTOMATED_ACCOUNT, ERR_BANNED, ERR_BLOCKED, ERR_HAVENT_VOTED, ERR_INVALID_APP, ERR_INVALID_ASSET, ERR_INVALID_NFD, ERR_IS_A_REPLY, ERR_IS_ALREADY_AMENDED, ERR_META_ALREADY_EXISTS, ERR_META_DOESNT_EXIST, ERR_NFD_CHANGED, ERR_NO_SELF_VOTE, ERR_NOT_A_MODERATOR, ERR_NOT_A_REPLY, ERR_NOT_A_SUBSCRIPTION, ERR_NOT_AN_AKITA_NFT, ERR_NOT_AN_NFD, ERR_NOT_DAO, ERR_NOT_YOUR_POST_TO_EDIT, ERR_PLUGIN_NOT_AUTH_ADDR, ERR_POST_NOT_FOUND, ERR_REPLY_NOT_FOUND, ERR_USER_DOES_NOT_OWN_NFD, ERR_USER_DOES_NOT_OWN_NFT, ERR_WRONG_FOLLOWER_KEY } from './errors'
import { GateArgs } from '../../../utils/types/gates'
import { AssetHolding, btoi, itob } from '@algorandfoundation/algorand-typescript/op'
import { ERR_FAILED_GATE, ERR_INVALID_PAYMENT } from '../../../utils/errors'
import { OptInPlugin } from '../optin/contract.algo'
import { akitaSocialFee, gateCheck, getAccounts, getAkitaAppList, getAkitaAssets, getOriginAccount, getOtherAppList, getPluginAppList, getSocialFees, getSpendingAccount, impactRange, rekeyAddress } from '../../../utils/functions'
import { AkitaBaseEscrow, AkitaBaseContract } from '../../../utils/base-contracts/base'

import { NFDRegistry } from '../../../utils/types/nfd-registry'
import { NFD } from '../../../utils/types/nfd'
import { AkitaCollectionsPrefixAKC, AkitaCollectionsPrefixAOG, AkitaNFTCreatorAddress } from '../../../utils/constants'
import { Staking } from '../../../staking/contract.algo'
import { arc4StakeInfo, STAKING_TYPE_SOFT } from '../../../staking/types'
import { Subscriptions } from '../../../subscriptions/contract.algo'
import { fee } from '../../../utils/constants'

export class AkitaSocialPlugin extends AkitaBaseEscrow {

  // BOXES ----------------------------------------------------------------------------------------

  /** Who follows who */
  follows = BoxMap<FollowsKey, Account>({ keyPrefix: AkitaSocialBoxPrefixFollows })
  /** All the blocks on the network */
  blocks = BoxMap<BlockListKey, StaticBytes<0>>({ keyPrefix: AkitaSocialBoxPrefixBlocks })
  /** All the posts on the network */
  posts = BoxMap<StaticBytes<32>, PostValue>({ keyPrefix: AkitaSocialBoxPrefixPosts })
  /** Counters for each post to track votes */
  votes = BoxMap<StaticBytes<32>, VotesValue>({ keyPrefix: AkitaSocialBoxPrefixVotes })
  /** User votes and their impact */
  votelist = BoxMap<VoteListKey, VoteListValue>({ keyPrefix: AkitaSocialBoxPrefixVoteList })
  /** Counters for each post to track reactions */
  reactions = BoxMap<ReactionsKey, uint64>({ keyPrefix: AkitaSocialBoxPrefixReactions })
  /** Who has reacted to what */
  reactionlist = BoxMap<ReactionListKey, StaticBytes<0>>({ keyPrefix: AkitaSocialBoxPrefixReactionList })
  /** The meta data for each user */
  meta = BoxMap<Account, MetaValue>({ keyPrefix: AkitaSocialBoxPrefixMeta })
  /** Who is a moderator */
  moderators = BoxMap<Account, StaticBytes<0>>({ keyPrefix: AkitaSocialBoxPrefixModerators })
  /** Who is banned and when they can return */
  banned = BoxMap<Account, uint64>({ keyPrefix: AkitaSocialBoxPrefixBanned })
  /** Actions usable on an akita post */
  actions = BoxMap<uint64, Action>({ keyPrefix: AkitaSocialBoxPrefixActions })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private mbr(ref: bytes): AkitaSocialMBRData {
    return {
      follows: 31_700,
      blocks: 15_700,
      posts: 35_700 + (400 * ref.length),
      votes: 19_300,
      votelist: 19_300,
      reactions: 22_100,
      reactionlist: 18_900,
      meta: 41_700,
      moderators: 15_700,
      banned: 18_900,
      actions: 29_700
    }
  }

  private controls(address: Account): boolean {
    return address.authAddress === Global.currentApplicationAddress
  }

  private rekeyBack(wallet: Application) {
    const sender = getSpendingAccount(wallet)

    itxn
      .payment({
        sender,
        amount: 0,
        receiver: sender,
        rekeyTo: rekeyAddress(true, wallet),
        fee,
      })
      .submit()
  }

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

  private isBlocked(user: Account, blocked: Account): boolean {
    const blocksKey = new arc4BlockListKey({
      user: bytes16(user.bytes),
      blocked: bytes16(blocked.bytes)
    })
    return this.blocks(blocksKey).exists
  }

  private getSocialImpactScore(account: Account): uint64 {
    // - Social Activity | up to 250
    const meta = this.meta(account).value
    let socialImpact: uint64 = 0

    if (meta.streak >= 60) {
      socialImpact += 100
    } else {
      // Calculate impact proportionally up to 60 days
      socialImpact += (meta.streak * 100) / 60
    }

    // longevity
    // if the account is older than 2 years give them 75
    const accountAge: uint64 = Global.latestTimestamp - meta.startDate

    if (accountAge >= TWO_YEARS) {
      socialImpact += 75
    } else {
      // impact proportional up to 2 years
      socialImpact += (accountAge * 75) / TWO_YEARS
    }

    // Calculate score based on userScore, capped at 100_000
    if (this.votes(bytes32(account.bytes)).exists) {
      const score = this.votes(bytes32(account.bytes)).value

      let impact: uint64 = (score.voteCount * 75) / 100_000
      if (impact > 75) {
        impact = 75
      }

      if (score.isNegative) {
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
        appId: getPluginAppList(this.akitaDAO.value).impact,
        args: [new Address(account)],
        fee,
      }
    ).returnValue

    return impact + this.getSocialImpactScore(account)
  }

  private canCallArc58OptIn(sender: Account, appId: Application): boolean {
    return abiCall(
      AbstractedAccount.prototype.arc58_canCall,
      {
        sender,
        appId,
        args: [
          getPluginAppList(this.akitaDAO.value).optin,
          true,
          new Address(sender),
          bytes4(methodSelector(OptInPlugin.prototype.optInToAsset))
        ],
        fee,
      }
    ).returnValue
  }

  private arc58OptInAndSendReactionPayments(
    wallet: Application,
    rekeyBack: boolean,
    recipientWallet: Application,
    mbrAmount: uint64,
    tax: uint64
  ): void {
    const akta = getAkitaAssets(this.akitaDAO.value).akta
    const sender = getSpendingAccount(wallet)
    const recipientOrigin = getOriginAccount(recipientWallet)

    const mbrTxn = itxn.payment({
      sender,
      amount: mbrAmount,
      receiver: Global.currentApplicationAddress,
      fee,
    })

    const rekeyTxn = itxn.applicationCall({
      sender,
      appId: recipientWallet,
      appArgs: [
        methodSelector(AbstractedAccount.prototype.arc58_rekeyToPlugin),
        getPluginAppList(this.akitaDAO.value).optin,
        new DynamicArray<UintN64>()
      ],
      fee,
    })

    const optinMBRTxn = itxn.payment({
      sender,
      amount: Global.assetOptInMinBalance,
      receiver: recipientOrigin,
      fee,
    })

    const optinTxn = itxn.applicationCall({
      sender,
      appId: getPluginAppList(this.akitaDAO.value).optin,
      appArgs: [
        methodSelector(OptInPlugin.prototype.optInToAsset),
        recipientWallet,
        true,
        akta
      ],
      fee,
    })

    const verifyTxn = itxn.applicationCall({
      sender,
      appId: recipientWallet,
      appArgs: [
        methodSelector(AbstractedAccount.prototype.arc58_verifyAuthAddr)
      ],
      fee,
    })

    const taxTxn = itxn.assetTransfer({
      sender,
      assetReceiver: this.akitaDAOEscrow.value.address,
      assetAmount: tax,
      xferAsset: akta,
      fee,
    })

    const { reactFee } = getSocialFees(this.akitaDAO.value)

    const xferTxn = itxn.assetTransfer({
      sender,
      assetReceiver: recipientOrigin,
      assetAmount: reactFee - tax,
      xferAsset: akta,
      rekeyTo: rekeyAddress(rekeyBack, wallet),
      fee,
    })

    submitGroup(mbrTxn, rekeyTxn, optinMBRTxn, optinTxn, verifyTxn, taxTxn, xferTxn)
  }

  private arc59OptInAndSendReactionPayments(
    wallet: Application,
    rekeyBack: boolean,
    recipientWallet: Application,
    mbrAmount: uint64,
    tax: uint64
  ): void {
    const assetInbox = getOtherAppList(this.akitaDAO.value).assetInbox
    const inboxAddress = Application(assetInbox).address
    const akta = getAkitaAssets(this.akitaDAO.value).akta
    const sender = getSpendingAccount(wallet)
    const recipientOrigin = getOriginAccount(recipientWallet)

    itxn
      .payment({
        sender,
        amount: mbrAmount,
        receiver: Global.currentApplicationAddress,
        fee,
      })
      .submit()

    const canCallData = abiCall(
      AssetInbox.prototype.arc59_getSendAssetInfo,
      {
        sender,
        appId: assetInbox,
        args: [
          new Address(recipientOrigin),
          akta,
        ],
        fee,
      }
    ).returnValue

    const mbr = canCallData.mbr
    const routerOptedIn = canCallData.routerOptedIn
    const receiverAlgoNeededForClaim = canCallData.receiverAlgoNeededForClaim

    if (mbr || receiverAlgoNeededForClaim) {
      itxn
        .payment({
          sender,
          receiver: inboxAddress,
          amount: mbr + receiverAlgoNeededForClaim,
          fee,
        })
        .submit()
    }

    if (!routerOptedIn) {
      abiCall(AssetInbox.prototype.arc59_optRouterIn, {
        sender,
        appId: assetInbox,
        args: [akta],
        fee,
      })
    }

    itxn
      .assetTransfer({
        sender,
        assetReceiver: this.akitaDAOEscrow.value.address,
        assetAmount: tax,
        xferAsset: akta,
        fee,
      })
      .submit()

    const { reactFee } = getSocialFees(this.akitaDAO.value)

    abiCall(
      AssetInbox.prototype.arc59_sendAsset,
      {
        sender,
        appId: assetInbox,
        args: [
          itxn.assetTransfer({
            sender,
            assetReceiver: inboxAddress,
            assetAmount: reactFee - tax,
            xferAsset: akta,
            fee,
          }),
          new Address(recipientOrigin),
          receiverAlgoNeededForClaim
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  private sendReactionPayments(wallet: Application, rekeyBack: boolean, recipientAccount: Account, mbrAmount: uint64, tax: uint64): void {
    const akta = getAkitaAssets(this.akitaDAO.value).akta
    const sender = getSpendingAccount(wallet)
    const { reactFee } = getSocialFees(this.akitaDAO.value)

    const mbrPayment = itxn.payment({
      sender,
      amount: mbrAmount,
      receiver: Global.currentApplicationAddress,
      fee,
    })

    const taxTxn = itxn.assetTransfer({
      sender,
      assetReceiver: this.akitaDAOEscrow.value.address,
      assetAmount: tax,
      xferAsset: akta,
      fee,
    })

    const xferTxn = itxn.assetTransfer({
      sender,
      assetReceiver: recipientAccount,
      assetAmount: reactFee - tax,
      xferAsset: akta,
      rekeyTo: rekeyAddress(rekeyBack, wallet),
      fee,
    })

    submitGroup(mbrPayment, taxTxn, xferTxn)
  }

  private voteListKey(account: Account, ref: StaticBytes<32>): arc4VoteListKey {
    return new arc4VoteListKey({
      user: bytes16(account.bytes),
      ref: bytes16(ref.bytes),
    })
  }

  private createEmptyPostIfNecessary(ref: StaticBytes<32>, creator: Account): void {
    if (!this.posts(ref).exists) {
      this.posts(ref).value = {
        ref: ref.native,
        /**
         * when a user reacts to content other than posts
         * we set the creator to the following:
         * - AssetID: Asset Creator
         * - Address: Address
         * -   AppID: Application Creator
         */
        creator: creator,
        timestamp: Global.latestTimestamp,
        gateID: 0,
        againstContentPolicy: false,
        isAmendment: false,
      }
    }
  }

  private updateStreak(account: Account): void {
    assert(this.meta(account).exists, ERR_META_DOESNT_EXIST)

    const meta = this.meta(account).value

    const thisWindowStart: uint64 = Global.latestTimestamp - ((Global.latestTimestamp - meta.startDate) % ONE_DAY)
    const lastWindowStart: uint64 = thisWindowStart - ONE_DAY

    // if they haven't interacted in up to the last 48 hours (depending on the current window)
    // reset their streak
    if (lastWindowStart > meta.lastActive) {
      this.meta(account).value = {
        ...meta,
        streak: 1,
        lastActive: Global.latestTimestamp,
      }
      return
    }

    // if they have interacted after the last window
    // but have not yet interacted in this window, increment their streak
    if (meta.lastActive < thisWindowStart) {
      this.meta(account).value = {
        ...meta,
        streak: (meta.streak + 1),
        lastActive: Global.latestTimestamp,
      }
    }

    // otherwise do nothing, streak can only increment once per window (24 hours)
  }

  private calcVotes(ref: StaticBytes<32>, isUp: boolean, impact: uint64): { newCount: uint64; isNegative: boolean } {
    if (!this.votes(ref).exists) {
      return { newCount: impact, isNegative: false }
    }

    const { isNegative, voteCount } = this.votes(ref).value
    // differingDirections means that the direction this vote will move the vote count
    // is the opposite of the current vote count
    const differingDirections = (isUp && isNegative) || (!isUp && !isNegative)
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

  private updateVotes(ref: StaticBytes<32>, isUp: boolean, impact: uint64): void {
    const { newCount: voteCount, isNegative } = this.calcVotes(ref, isUp, impact)
    this.votes(ref).value = { voteCount, isNegative }
  }

  private createVoteList(ref: StaticBytes<32>, isUp: boolean, account: Account, impact: uint64): void {
    const voteListKey = this.voteListKey(account, ref)
    this.votelist(voteListKey).value = { impact, isUp }
  }

  private createPost(wallet: Application, rekeyBack: boolean, cid: CID, gateID: uint64, isAmendment: boolean): void {
    const origin = getOriginAccount(wallet)
    const sender = getSpendingAccount(wallet)
    assert(!this.isBanned(origin), ERR_BANNED)

    // update streak before we measure impact
    // this way we guarantee the box exists
    this.updateStreak(origin)

    const impact = this.getUserImpact(origin)
    const akta = getAkitaAssets(this.akitaDAO.value).akta
    const { postFee } = getSocialFees(this.akitaDAO.value)
    const { posts, votes, votelist } = this.mbr(cid.bytes)

    const mbrTxn = itxn.payment({
      sender,
      amount: (posts + votes + votelist),
      receiver: Global.currentApplicationAddress,
      fee,
    })

    const taxTxn = itxn.assetTransfer({
      sender,
      assetReceiver: this.akitaDAOEscrow.value.address,
      assetAmount: postFee,
      xferAsset: akta,
      rekeyTo: rekeyAddress(rekeyBack, wallet),
      fee,
    })

    submitGroup(mbrTxn, taxTxn)

    const postID = bytes32(Txn.txId)
    this.posts(postID).value = {
      ref: cid.bytes,
      creator: origin,
      timestamp: Global.latestTimestamp,
      gateID: gateID,
      againstContentPolicy: false,
      isAmendment: isAmendment,
    }
    this.updateVotes(postID, true, impact)
    this.createVoteList(postID, true, origin, impact)
  }

  private createReply(
    wallet: Application,
    rekeyBack: boolean,
    cid: CID,
    ref: StaticBytes<32>,
    gateID: uint64,
    args: GateArgs,
    isAmendment: boolean
  ): void {
    const origin = getOriginAccount(wallet)
    const sender = getSpendingAccount(wallet)

    assert(!this.isBanned(origin), ERR_BANNED)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const post = this.posts(ref).value
    assert(!this.isBlocked(post.creator, origin), ERR_BLOCKED)

    if (post.gateID !== 0) {
      assert(gateCheck(this.akitaDAO.value, new Address(origin), post.gateID, args), ERR_FAILED_GATE)
    }

    // update streak before we measure impact
    // this way we guarantee the box exists
    this.updateStreak(origin)

    const replyRef = cid.bytes.concat(ref.bytes)
    const creatorMeta = this.meta(post.creator).value
    const postCreatorImpact = this.getUserImpact(post.creator)
    const tax = akitaSocialFee(this.akitaDAO.value, postCreatorImpact)
    const akta = getAkitaAssets(this.akitaDAO.value).akta
    const { posts, votes, votelist } = this.mbr(replyRef)
    const mbrAmount: uint64 = posts + votes + votelist

    if (!post.creator.isOptedIn(Asset(akta))) {
      // calls a transaction
      const canCallArc58OptIn = this.canCallArc58OptIn(sender, Application(creatorMeta.walletID))
      if (canCallArc58OptIn) {
        // calls 6 transactions
        this.arc58OptInAndSendReactionPayments(wallet, rekeyBack, Application(creatorMeta.walletID), mbrAmount, tax)
      } else {
        // calls up to 6 transactions
        this.arc59OptInAndSendReactionPayments(wallet, rekeyBack, Application(creatorMeta.walletID), mbrAmount, tax)
      }
    } else {
      // calls 2 transactions
      const creatorOrigin = getOriginAccount(Application(creatorMeta.walletID))
      this.sendReactionPayments(wallet, rekeyBack, creatorOrigin, mbrAmount, tax)
    }

    const replyPostID = bytes32(Txn.txId)
    const replyPost: PostValue = {
      ref: replyRef,
      creator: origin,
      timestamp: Global.latestTimestamp,
      gateID: gateID,
      againstContentPolicy: false,
      isAmendment: isAmendment,
    }

    this.posts(replyPostID).value = replyPost

    const senderImpact = this.getUserImpact(origin)
    this.updateVotes(replyPostID, true, senderImpact)
    this.createVoteList(replyPostID, true, origin, senderImpact)
  }

  private createVote(wallet: Application, rekeyBack: boolean, ref: StaticBytes<32>, isUp: boolean): void {
    const { origin, sender } = getAccounts(wallet)

    assert(!this.isBanned(origin), ERR_BANNED)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)

    const post = this.posts(ref).value
    assert(!this.isBlocked(post.creator, origin), ERR_BLOCKED)

    const voteListKey = this.voteListKey(origin, ref)
    assert(!this.votelist(voteListKey).exists, ERR_ALREADY_VOTED)
    assert(origin !== post.creator, ERR_NO_SELF_VOTE)

    const senderIsAutomated = this.meta(origin).value.automated
    assert(!senderIsAutomated, ERR_AUTOMATED_ACCOUNT)

    const akta = getAkitaAssets(this.akitaDAO.value).akta

    // update streak before we measure impact
    // this way we guarantee the box exists
    this.updateStreak(origin)
    const { reactFee, impactTaxMin, impactTaxMax } = getSocialFees(this.akitaDAO.value)
    const { votelist: mbrAmount } = this.mbr(ref.bytes)

    if (isUp) {
      const creatorMeta = this.meta(post.creator).value
      // calls a transaction
      const recipientImpact = this.getUserImpact(post.creator)
      const tax = impactRange(recipientImpact, impactTaxMin, impactTaxMax)

      if (!post.creator.isOptedIn(Asset(akta))) {
        // calls a transaction
        const canCallArc58OptIn = this.canCallArc58OptIn(sender, Application(creatorMeta.walletID))
        if (canCallArc58OptIn) {
          // calls 6 transactions
          this.arc58OptInAndSendReactionPayments(wallet, rekeyBack, Application(creatorMeta.walletID), mbrAmount, tax)
        } else {
          // calls up to 6 transactions
          this.arc59OptInAndSendReactionPayments(wallet, rekeyBack, Application(creatorMeta.walletID), mbrAmount, tax)
        }
      } else {
        // calls 2 transactions
        const creatorOrigin = getOriginAccount(Application(creatorMeta.walletID))
        this.sendReactionPayments(wallet, rekeyBack, creatorOrigin, mbrAmount, tax)
      }
    } else {
      const mbrTxn = itxn.payment({
        sender,
        amount: mbrAmount,
        receiver: Global.currentApplicationAddress,
        fee,
      })

      const taxTxn = itxn.assetTransfer({
        sender,
        assetReceiver: this.akitaDAOEscrow.value.address,
        assetAmount: reactFee,
        xferAsset: akta,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      })

      submitGroup(mbrTxn, taxTxn)
    }

    // calls a transaction
    const senderImpact = this.getUserImpact(origin)
    this.updateVotes(ref, isUp, senderImpact)
    this.createVoteList(ref, isUp, origin, senderImpact)
  }

  private createReaction(wallet: Application, rekeyBack: boolean, ref: StaticBytes<32>, NFT: uint64, args: GateArgs): void {
    const { origin, sender } = getAccounts(wallet)
    assert(!this.isBanned(origin), ERR_BANNED)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const post = this.posts(ref).value
    assert(!this.isBlocked(post.creator, origin), ERR_BLOCKED)
    const senderHasNFT = AssetHolding.assetBalance(origin, NFT)[0] > 0
    assert(senderHasNFT, ERR_USER_DOES_NOT_OWN_NFT)

    if (post.gateID !== 0) {
      assert(gateCheck(this.akitaDAO.value, new Address(origin), post.gateID, args), ERR_FAILED_GATE)
    }

    const reactionListKey: ReactionListKey = { user: bytes16(origin.bytes), ref: bytes16(ref.bytes), NFT }
    assert(!this.reactionlist(reactionListKey).exists, ERR_ALREADY_REACTED)

    // update streak before we measure impact
    // this way we guarantee the box exists
    this.updateStreak(origin)

    const creatorMeta = this.meta(post.creator).value
    const recipientImpact = this.getUserImpact(post.creator)
    const { impactTaxMin, impactTaxMax } = getSocialFees(this.akitaDAO.value)
    const tax = impactRange(recipientImpact, impactTaxMin, impactTaxMax)
    const akta = getAkitaAssets(this.akitaDAO.value).akta
    const { reactions, reactionlist } = this.mbr(ref.bytes)

    const reactionKey: ReactionsKey = { ref, NFT }
    const reactionExists = this.reactions(reactionKey).exists

    const mbrAmount: uint64 = reactionExists ? reactionlist : reactions + reactionlist

    if (!post.creator.isOptedIn(Asset(akta))) {
      const canCallArc58OptIn = this.canCallArc58OptIn(sender, Application(creatorMeta.walletID))
      if (canCallArc58OptIn) {
        this.arc58OptInAndSendReactionPayments(wallet, rekeyBack, Application(creatorMeta.walletID), mbrAmount, tax)
      } else {
        this.arc59OptInAndSendReactionPayments(wallet, rekeyBack, Application(creatorMeta.walletID), mbrAmount, tax)
      }
    } else {
      const creatorOrigin = getOriginAccount(Application(creatorMeta.walletID))
      this.sendReactionPayments(wallet, rekeyBack, creatorOrigin, mbrAmount, tax)
    }

    if (reactionExists) {
      this.reactions(reactionKey).value += 1
    } else {
      this.reactions(reactionKey).value = 1
    }

    this.reactionlist(reactionListKey).create()
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  createApplication(version: string, akitaDAO: uint64, escrow: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
    this.akitaDAOEscrow.value = Application(escrow)
  }

  // AKITA SOCIAL PLUGIN METHODS ------------------------------------------------------------------

  post(walletID: uint64, rekeyBack: boolean, cid: CID, gateID: uint64): void {
    this.createPost(Application(walletID), rekeyBack, cid, gateID, false)
  }

  editPost(walletID: uint64, rekeyBack: boolean, cid: CID, gateID: uint64, amendment: StaticBytes<32>): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)
    assert(this.posts(amendment).exists, ERR_POST_NOT_FOUND)
    const post = this.posts(amendment).value
    assert(this.isCreator(post.creator, wallet), ERR_NOT_YOUR_POST_TO_EDIT)
    assert(!this.isReply(post.ref), ERR_IS_A_REPLY)
    assert(!this.isAmended(post.ref), ERR_IS_ALREADY_AMENDED)

    this.posts(amendment).value = {
      ...this.posts(amendment).value,
      ref: post.ref.concat(Bytes('a').concat(Txn.txId))
    }

    itxn
      .payment({
        sender,
        receiver: Global.currentApplicationAddress,
        amount: 13_200, // (400 * 33) 'a' + txid
        fee,
      })
      .submit()

    this.createPost(Application(walletID), rekeyBack, cid, gateID, true)
  }

  replyPost(walletID: uint64, rekeyBack: boolean, cid: CID, ref: StaticBytes<32>, gateID: uint64, args: GateArgs): void {
    this.createReply(Application(walletID), rekeyBack, cid, ref, gateID, args, false)
  }

  replyAsset(walletID: uint64, rekeyBack: boolean, cid: CID, ref: uint64, gateID: uint64): void {
    assert(ref !== 0, ERR_INVALID_ASSET)
    assert(Asset(ref).total > 0, ERR_INVALID_ASSET)
    const paddedRef = paddedBytes32(itob(ref))
    this.createEmptyPostIfNecessary(paddedRef, Application(ref).creator)
    this.createReply(Application(walletID), rekeyBack, cid, paddedRef, gateID, new DynamicArray<DynamicBytes>(), false)
  }

  replyAddress(walletID: uint64, rekeyBack: boolean, cid: CID, ref: Address, gateID: uint64, args: GateArgs): void {
    const wallet = Application(walletID)
    if (this.meta(ref.native).exists) {
      const meta = this.meta(ref.native).value
      const origin = getOriginAccount(wallet)
      if (meta.addressGateID !== 0) {
        assert(gateCheck(this.akitaDAO.value, new Address(origin), meta.addressGateID, args), ERR_FAILED_GATE)
      }
    }

    const r = bytes32(ref.bytes)
    this.createEmptyPostIfNecessary(r, ref.native)
    this.createReply(wallet, rekeyBack, cid, r, gateID, new DynamicArray<DynamicBytes>(), false)
  }

  replyApp(walletID: uint64, rekeyBack: boolean, cid: CID, ref: uint64, gateID: uint64): void {
    assert(ref !== 0, ERR_INVALID_APP)
    assert(Application(ref).approvalProgram.length > 0, ERR_INVALID_APP)
    const paddedRef = paddedBytes32(itob(ref))
    this.createEmptyPostIfNecessary(paddedRef, Application(ref).creator)
    this.createReply(Application(walletID), rekeyBack, cid, paddedRef, gateID, new DynamicArray<DynamicBytes>(), false)
  }

  editReply(
    walletID: uint64,
    rekeyBack: boolean,
    cid: CID,
    gateID: uint64,
    args: GateArgs,
    amendment: StaticBytes<32>
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)
    assert(this.posts(amendment).exists, ERR_REPLY_NOT_FOUND)
    const post = this.posts(amendment).value
    assert(this.isCreator(post.creator, wallet), ERR_NOT_YOUR_POST_TO_EDIT)
    assert(this.isReply(post.ref), ERR_NOT_A_REPLY)
    assert(!this.isAmended(post.ref), ERR_IS_ALREADY_AMENDED)

    this.posts(amendment).value = {
      ...this.posts(amendment).value,
      ref: post.ref.concat(Bytes('a').concat(Txn.txId))
    }

    itxn
      .payment({
        sender,
        receiver: Global.currentApplicationAddress,
        amount: 13_200, // (400 * 33) 'a' + txid
        fee,
      })
      .submit()

    const originalPostRef = bytes32(post.ref.slice(0, 32))
    this.createReply(wallet, rekeyBack, cid, originalPostRef, gateID, args, true)
  }

  votePost(walletID: uint64, rekeyBack: boolean, ref: StaticBytes<32>, isUp: boolean): void {
    this.createVote(Application(walletID), rekeyBack, ref, isUp)
  }

  voteAsset(walletID: uint64, rekeyBack: boolean, ref: uint64, isUp: boolean): void {
    assert(ref !== 0, ERR_INVALID_ASSET)
    assert(Asset(ref).total > 0, ERR_INVALID_ASSET)
    const paddedRef = paddedBytes32(itob(ref))
    this.createEmptyPostIfNecessary(paddedRef, Asset(ref).creator)
    this.createVote(Application(walletID), rekeyBack, paddedRef, isUp)
  }

  voteAddress(walletID: uint64, rekeyBack: boolean, ref: Address, isUp: boolean): void {
    const r = bytes32(ref.bytes)
    this.createEmptyPostIfNecessary(r, ref.native)
    this.createVote(Application(walletID), rekeyBack, r, isUp)
  }

  voteApp(walletID: uint64, rekeyBack: boolean, ref: uint64, isUp: boolean): void {
    assert(ref !== 0, ERR_INVALID_APP)
    assert(Application(ref).approvalProgram.length > 0, ERR_INVALID_APP)
    const paddedRef = paddedBytes32(itob(ref))
    this.createEmptyPostIfNecessary(paddedRef, Application(ref).creator)
    this.createVote(Application(walletID), rekeyBack, paddedRef, isUp)
  }

  editVote(walletID: uint64, rekeyBack: boolean, ref: StaticBytes<32>, flip: boolean): void {
    const senderAccount = getOriginAccount(Application(walletID))
    const voteListKey = this.voteListKey(senderAccount, ref)
    assert(this.votelist(voteListKey).exists, ERR_HAVENT_VOTED)

    const { impact, isUp } = this.votelist(voteListKey).value

    // undo user vote
    this.updateVotes(ref, !isUp, impact)
    if (!flip) {
      // delete votelist
      this.votelist(voteListKey).delete()
      return
    }

    // if the user wants to flip their vote, vote again but the opposite way
    this.createVote(Application(walletID), rekeyBack, ref, !isUp)
  }

  reactPost(walletID: uint64, rekeyBack: boolean, ref: StaticBytes<32>, NFT: uint64, args: GateArgs): void {
    this.createReaction(Application(walletID), rekeyBack, ref, NFT, args)
  }

  reactAsset(walletID: uint64, rekeyBack: boolean, ref: uint64, NFT: uint64): void {
    assert(ref !== 0, ERR_INVALID_ASSET)
    assert(Asset(ref).total > 0, ERR_INVALID_ASSET)
    const paddedRef = paddedBytes32(itob(ref))
    this.createEmptyPostIfNecessary(paddedRef, Asset(ref).creator)
    this.createReaction(Application(walletID), rekeyBack, paddedRef, NFT, new DynamicArray<DynamicBytes>())
  }

  reactAddress(walletID: uint64, rekeyBack: boolean, ref: Address, NFT: uint64, args: GateArgs): void {
    const wallet = Application(walletID)
    if (this.meta(ref.native).exists) {
      const meta = this.meta(ref.native).value
      const senderAccount = getOriginAccount(wallet)

      if (meta.addressGateID !== 0) {
        assert(gateCheck(this.akitaDAO.value, new Address(senderAccount), meta.addressGateID, args), ERR_FAILED_GATE)
      }
    }

    const r = bytes32(ref.bytes)
    this.createEmptyPostIfNecessary(r, ref.native)
    this.createReaction(wallet, rekeyBack, r, NFT, new DynamicArray<DynamicBytes>())
  }

  reactApp(walletID: uint64, rekeyBack: boolean, ref: uint64, NFT: uint64): void {
    assert(ref !== 0, ERR_INVALID_APP)
    assert(Application(ref).approvalProgram.length > 0, ERR_INVALID_APP)
    const paddedRef = paddedBytes32(itob(ref))
    this.createEmptyPostIfNecessary(paddedRef, Application(ref).creator)
    this.createReaction(Application(walletID), rekeyBack, paddedRef, NFT, new DynamicArray<DynamicBytes>())
  }

  deleteReaction(walletID: uint64, rekeyBack: boolean, ref: StaticBytes<32>, NFT: uint64): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)
    assert(this.controls(sender), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(!this.isBanned(origin), ERR_BANNED)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const post = this.posts(ref).value
    assert(!this.isBlocked(post.creator, origin), ERR_BLOCKED)

    const reactionListKey: ReactionListKey = { user: bytes16(origin.bytes), ref: bytes16(ref.bytes), NFT }
    assert(this.reactionlist(reactionListKey).exists, ERR_ALREADY_REACTED)

    this.reactions({ ref, NFT }).value -= 1
    this.reactionlist(reactionListKey).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).reactionlist,
        fee,
      })
      .submit()

    if (rekeyBack) {
      this.rekeyBack(wallet)
    }
  }

  follow(walletID: uint64, rekeyBack: boolean, address: Address, args: GateArgs): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)
    assert(this.controls(sender), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(!this.isBanned(origin), ERR_BANNED)
    assert(!this.isBlocked(address.native, origin), ERR_BLOCKED)

    const senderIsAutomated = this.meta(origin).value.automated
    assert(!senderIsAutomated, ERR_AUTOMATED_ACCOUNT)

    const meta = this.meta(address.native).value

    if (meta.followGateID !== 0) {
      assert(gateCheck(this.akitaDAO.value, new Address(origin), meta.followGateID, args), ERR_FAILED_GATE)
    }

    const followerIndex = meta.followerIndex
    const followsKey: FollowsKey = { user: address.native, index: (followerIndex + 1) }
    this.follows(followsKey).value = origin

    this.meta(address.native).value = {
      ...meta,
      followerIndex: (followerIndex + 1),
      followerCount: (meta.followerCount + 1),
    }

    itxn
      .payment({
        sender,
        receiver: Global.currentApplicationAddress,
        amount: this.mbr(Bytes('')).follows,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      })
      .submit()
  }

  unfollow(walletID: uint64, rekeyBack: boolean, address: Address, index: uint64): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)

    assert(this.controls(sender), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(!this.isBanned(origin), ERR_BANNED)

    const followsKey = { user: address.native, index }
    assert(this.follows(followsKey).value === origin, ERR_WRONG_FOLLOWER_KEY)

    const meta = this.meta(address.native).value
    this.meta(address.native).value = {
      ...meta,
      followerCount: (meta.followerCount - 1)
    }

    this.follows(followsKey).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).follows,
        fee,
      })
      .submit()

    if (rekeyBack) {
      this.rekeyBack(wallet)
    }
  }

  // we dont remove followers because that requires us to know the index
  // instead, blocking supersedes following
  block(walletID: uint64, rekeyBack: boolean, address: Address): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)
    assert(this.controls(sender), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(!this.isBanned(origin), ERR_BANNED)

    const blocksKey = new arc4BlockListKey({
      user: bytes16(origin.bytes),
      blocked: bytes16(address.bytes),
    })
    this.blocks(blocksKey).create()

    itxn
      .payment({
        sender,
        receiver: Global.currentApplicationAddress,
        amount: this.mbr(Bytes('')).blocks,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      })
      .submit()
  }

  unblock(walletID: uint64, rekeyBack: boolean, address: Address): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)
    assert(this.controls(sender), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(!this.isBanned(origin), ERR_BANNED)

    const blocksKey: BlockListKey = {
      user: bytes16(origin.bytes),
      blocked: bytes16(address.bytes),
    }
    this.blocks(blocksKey).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).blocks,
        fee,
      })
      .submit()

    if (rekeyBack) {
      this.rekeyBack(wallet)
    }
  }

  addModerator(walletID: uint64, rekeyBack: boolean, address: Address): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)
    assert(this.controls(sender), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(wallet === this.akitaDAO.value, ERR_NOT_DAO)
    assert(!this.moderators(address.native).exists, ERR_ALREADY_A_MODERATOR)

    this.moderators(address.native).create()

    itxn
      .payment({
        sender,
        receiver: Global.currentApplicationAddress,
        amount: this.mbr(Bytes('')).moderators,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      })
      .submit()
  }

  removeModerator(walletID: uint64, rekeyBack: boolean, address: Address): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)
    assert(this.controls(sender), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(wallet === this.akitaDAO.value, ERR_NOT_DAO)
    assert(this.moderators(address.native).exists, ERR_NOT_A_MODERATOR)

    this.moderators(address.native).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).moderators,
        fee,
      })
      .submit()

    if (rekeyBack) {
      this.rekeyBack(wallet)
    }
  }

  ban(walletID: uint64, rekeyBack: boolean, address: Address, expiration: uint64): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)
    assert(this.controls(sender), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(this.moderators(origin).exists, ERR_NOT_A_MODERATOR)
    assert(!this.banned(address.native).exists, ERR_ALREADY_BANNED)
    this.banned(address.native).value = expiration

    itxn
      .payment({
        sender,
        receiver: Global.currentApplicationAddress,
        amount: this.mbr(Bytes('')).banned,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      })
      .submit()
  }

  flagPost(walletID: uint64, rekeyBack: boolean, ref: StaticBytes<32>): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)
    assert(this.controls(sender), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(this.moderators(origin).exists, ERR_NOT_A_MODERATOR)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const post = this.posts(ref).value
    assert(!post.againstContentPolicy, ERR_ALREADY_FLAGGED)

    this.posts(ref).value = {
      ...post,
      againstContentPolicy: true
    }

    if (rekeyBack) {
      this.rekeyBack(wallet)
    }
  }

  unban(walletID: uint64, rekeyBack: boolean, address: Address): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)
    assert(this.controls(sender), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(this.moderators(origin).exists, ERR_NOT_A_MODERATOR)
    this.banned(address.native).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).banned,
        fee,
      })
      .submit()

    if (rekeyBack) {
      this.rekeyBack(wallet)
    }
  }

  addAction(walletID: uint64, rekeyBack: boolean, actionAppID: uint64, content: CID) {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)
    assert(this.controls(sender), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(wallet === this.akitaDAO.value, ERR_NOT_DAO)
    assert(!this.actions(actionAppID).exists, ERR_ALREADY_AN_ACTION)

    this.actions(actionAppID).value = { content }

    itxn
      .payment({
        sender,
        receiver: Global.currentApplicationAddress,
        amount: this.mbr(Bytes('')).actions,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      })
      .submit()
  }

  removeAction(walletID: uint64, rekeyBack: boolean, actionAppID: uint64) {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)
    assert(this.controls(sender), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(wallet === this.akitaDAO.value, ERR_NOT_DAO)
    assert(this.actions(actionAppID).exists, ERR_ALREADY_AN_ACTION)

    this.actions(actionAppID).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).actions,
        fee,
      })
      .submit()

    if (rekeyBack) {
      this.rekeyBack(wallet)
    }
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
    const { origin, sender } = getAccounts(wallet)

    assert(this.controls(sender), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(!this.meta(origin).exists, ERR_META_ALREADY_EXISTS)

    const zero = new UintN64(0)
    if (automated) {
      this.meta(origin).value = {
        walletID: walletID,
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
          sender,
          appId: getPluginAppList(this.akitaDAO.value).impact,
          args: [0, 0, 0],
          fee,
        }
      )

      return 0
    }

    this.meta(origin).value = {
      walletID: walletID,
      streak: 1,
      startDate: Global.latestTimestamp,
      lastActive: Global.latestTimestamp,
      followerIndex: 0,
      followerCount: 0,
      automated: false,
      followGateID: 0,
      addressGateID: 0,
    }

    const impact = abiCall(
      AkitaSocialImpact.prototype.cacheMeta,
      {
        sender,
        appId: getPluginAppList(this.akitaDAO.value).impact,
        args: [subscriptionIndex, NFD, akitaNFT],
        fee,
      }
    ).returnValue

    if (rekeyBack) {
      this.rekeyBack(wallet)
    }

    return impact + this.getSocialImpactScore(origin)
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
  getMeta(user: Address): MetaValue {
    return this.meta(user.native).value
  }

  // dummy call to allow for more references
  gas() { }
}


export class AkitaSocialImpact extends AkitaBaseContract {

  // BOXES ----------------------------------------------------------------------------------------    

  /** A map of the meta data for each user */
  meta = BoxMap<Account, arc4ImpactMetaValue>({ keyPrefix: ImpactBoxPrefixMeta })
  /** A map of how each akita subscription affects impact calculation */
  subscriptionStateModifier = BoxMap<uint64, uint64>({ keyPrefix: ImpactBoxPrefixSubscriptionStateModifier })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private mbr(): AkitaSocialImpactMBRData {
    return {
      meta: 31_700,
      subscriptionStateModifier: 9_300,
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
        args: [new Address(account), index],
        fee,
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
        args: [String(nfdNameBytes), NFDApp.id],
        fee,
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
        fee,
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
    const meta = decodeArc4<ImpactMetaValue>(this.meta(account).value.bytes)

    const stakedAktaImpact = this.getStakingImpactScore(account) // Staked AKTA | up to 250
    const subscriberImpact = this.getSubscriberImpactScore(account, meta.subscriptionIndex) // Akita Subscriber | up to 250
    const socialImpact = includeSocial ? this.getSocialImpactScore(account) : Uint64(0) // Social Activity | up to 250
    const nfdScore = this.getNFDImpactScore(account, Application(meta.NFD)) // NFD | up to 150
    const heldAkitaImpact = this.getHeldAktaImpactScore(account) // Held AKTA | up to 50
    const nftImpact = this.getNFTImpactScore(account, Asset(meta.akitaNFT)) // Holds AKC/Omnigem | 50

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
          new arc4StakeInfo({
            asset: new UintN64(akta),
            type: STAKING_TYPE_SOFT,
          })
        ],
        fee,
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
      AkitaSocialPlugin.prototype.getUserSocialImpact,
      {
        appId: getPluginAppList(this.akitaDAO.value).social,
        args: [new Address(account)],
        fee,
      }
    ).returnValue
  }

  private nfdReadField(NFDApp: Application, field: string): bytes {
    const fieldBytes = abiCall(
      NFD.prototype.readField,
      {
        appId: NFDApp.id,
        args: [Bytes(field)],
        fee,
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

    if (parentAppIDBytesExist && btoi(parentAppIDBytes) === getAkitaAppList(this.akitaDAO.value).akitaNFD) {
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
    const meta = decodeArc4<ImpactMetaValue>(this.meta(account).value.bytes)
    const [lastChangedBytes] = op.AppGlobal.getExBytes(meta.NFD, Bytes(NFDGlobalStateKeysTimeChanged))
    const timeChanged = btoi(lastChangedBytes)

    assert(NFDApp.id === Application(meta.NFD).id, ERR_INVALID_NFD)
    assert(meta.nfdTimeChanged === timeChanged, ERR_NFD_CHANGED)

    return meta.nfdImpact
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
  createApplication(akitaDAO: uint64, version: string): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // IMPACT METHODS -------------------------------------------------------------------------------

  cacheMeta(subscriptionIndex: uint64, NFDAppID: uint64, akitaAssetID: uint64): uint64 {
    if (subscriptionIndex !== 0) {
      assert(this.isSubscribed(Txn.sender, subscriptionIndex).active, ERR_NOT_A_SUBSCRIPTION)
    }

    let nfdTimeChanged: uint64 = 0
    let nfdImpact: uint64 = 0
    if (NFDAppID !== 0) {
      const nfdApp = Application(NFDAppID)
      assert(this.isNFD(nfdApp), ERR_NOT_AN_NFD)
      assert(this.addressVerifiedOnNFD(Txn.sender, nfdApp), ERR_USER_DOES_NOT_OWN_NFD)
      const [timeChangedBytes] = op.AppGlobal.getExBytes(nfdApp, Bytes(NFDGlobalStateKeysTimeChanged))
      nfdTimeChanged = btoi(timeChangedBytes)
      nfdImpact = this.calcNFDImpactScore(nfdApp)
    }

    if (akitaAssetID !== 0) {
      const akitaNFT = Asset(akitaAssetID)
      assert(this.isAkitaNFT(akitaNFT), ERR_NOT_AN_AKITA_NFT)
      assert(this.userHolds(Txn.sender, akitaNFT), ERR_USER_DOES_NOT_OWN_NFT)
    }

    this.meta(Txn.sender).value = new arc4ImpactMetaValue({
      subscriptionIndex: new UintN64(subscriptionIndex),
      NFD: new UintN64(NFDAppID),
      nfdTimeChanged: new UintN64(nfdTimeChanged),
      nfdImpact: new UintN64(nfdImpact),
      akitaNFT: new UintN64(akitaAssetID),
    })

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
  getMeta(user: Address): MetaValue {
    return decodeArc4<MetaValue>(this.meta(user.native).value.bytes)
  }
}
