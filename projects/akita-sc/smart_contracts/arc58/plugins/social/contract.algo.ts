import { AssetInbox } from '../../../utils/types/asset-inbox'
import { AkitaSocialImpact } from '../../../impact/contract.algo'
import { Account, Application, assert, Asset, BoxMap, Bytes, bytes, Global, itxn, Txn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, Bool, decodeArc4, DynamicArray, DynamicBytes, methodSelector, StaticBytes, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaSocialMBRData, arc4Action, arc4BlockListKey, arc4FollowsKey, arc4MetaValue, arc4PostValue, arc4ReactionListKey, arc4ReactionsKey, arc4VoteListKey, arc4VoteListValue, arc4VotesValue, MetaValue, PostValue, VoteListValue, VotesValue } from './types'
import { bytes16, bytes32, bytes4, CID, paddedBytes32 } from '../../../utils/types/base'
import { AkitaSocialBoxPrefixActions, AkitaSocialBoxPrefixBanned, AkitaSocialBoxPrefixBlocks, AkitaSocialBoxPrefixFollows, AkitaSocialBoxPrefixMeta, AkitaSocialBoxPrefixModerators, AkitaSocialBoxPrefixPosts, AkitaSocialBoxPrefixReactionList, AkitaSocialBoxPrefixReactions, AkitaSocialBoxPrefixVoteList, AkitaSocialBoxPrefixVotes, ONE_DAY, TWO_YEARS } from './constants'
import { AbstractedAccount } from '../../account/contract.algo'
import { submitGroup } from '@algorandfoundation/algorand-typescript/itxn'
import { ERR_ALREADY_A_MODERATOR, ERR_ALREADY_AN_ACTION, ERR_ALREADY_BANNED, ERR_ALREADY_FLAGGED, ERR_ALREADY_REACTED, ERR_ALREADY_VOTED, ERR_AUTOMATED_ACCOUNT, ERR_BANNED, ERR_BLOCKED, ERR_HAVENT_VOTED, ERR_INVALID_APP, ERR_INVALID_ASSET, ERR_IS_A_REPLY, ERR_IS_ALREADY_AMENDED, ERR_META_ALREADY_EXISTS, ERR_META_DOESNT_EXIST, ERR_NO_SELF_VOTE, ERR_NOT_A_MODERATOR, ERR_NOT_A_REPLY, ERR_NOT_DAO, ERR_NOT_YOUR_POST_TO_EDIT, ERR_PLUGIN_NOT_AUTH_ADDR, ERR_POST_NOT_FOUND, ERR_REPLY_NOT_FOUND, ERR_USER_DOES_NOT_OWN_NFT, ERR_WRONG_FOLLOWER_KEY } from './errors'
import { GateArgs } from '../../../utils/types/gates'
import { AssetHolding, itob } from '@algorandfoundation/algorand-typescript/op'
import { ERR_FAILED_GATE } from '../../../utils/errors'
import { OptInPlugin } from '../optin/contract.algo'
import { akitaSocialFee, gateCheck, getAccounts, getAkitaAssets, getOriginAccount, getOtherAppList, getPluginAppList, getSocialFees, getSpendingAccount, impactRange, rekeyAddress } from '../../../utils/functions'
import { AkitaBaseEscrow } from '../../../utils/base-contracts/base'

export class AkitaSocialPlugin extends AkitaBaseEscrow {

  // BOXES ----------------------------------------------------------------------------------------

  /** Who follows who */
  follows = BoxMap<arc4FollowsKey, Account>({ keyPrefix: AkitaSocialBoxPrefixFollows })
  /** All the blocks on the network */
  blocks = BoxMap<arc4BlockListKey, StaticBytes<0>>({ keyPrefix: AkitaSocialBoxPrefixBlocks })
  /** All the posts on the network */
  posts = BoxMap<StaticBytes<32>, arc4PostValue>({ keyPrefix: AkitaSocialBoxPrefixPosts })
  /** Counters for each post to track votes */
  votes = BoxMap<StaticBytes<32>, arc4VotesValue>({ keyPrefix: AkitaSocialBoxPrefixVotes })
  /** User votes and their impact */
  votelist = BoxMap<arc4VoteListKey, arc4VoteListValue>({ keyPrefix: AkitaSocialBoxPrefixVoteList })
  /** Counters for each post to track reactions */
  reactions = BoxMap<arc4ReactionsKey, uint64>({ keyPrefix: AkitaSocialBoxPrefixReactions })
  /** Who has reacted to what */
  reactionlist = BoxMap<arc4ReactionListKey, StaticBytes<0>>({ keyPrefix: AkitaSocialBoxPrefixReactionList })
  /** The meta data for each user */
  meta = BoxMap<Account, arc4MetaValue>({ keyPrefix: AkitaSocialBoxPrefixMeta })
  /** Who is a moderator */
  moderators = BoxMap<Account, StaticBytes<0>>({ keyPrefix: AkitaSocialBoxPrefixModerators })
  /** Who is banned and when they can return */
  banned = BoxMap<Account, uint64>({ keyPrefix: AkitaSocialBoxPrefixBanned })
  /** Actions usable on an akita post */
  actions = BoxMap<uint64, arc4Action>({ keyPrefix: AkitaSocialBoxPrefixActions })

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
        fee: 0,
      })
      .submit()
  }

  private isCreator(creator: Address, wallet: Application): boolean {
    const origin = getOriginAccount(wallet)
    return creator.native === origin
    // assert(post.creator.native === origin, ERR_NOT_YOUR_POST_TO_EDIT)
    // assert(post.ref.length > 36, ERR_NOT_A_REPLY)
    // assert(post.ref.length !== 101, ERR_IS_ALREADY_AMENDED)
  }

  // TODO: use these and actually ensure it works properly
  private isReply(ref: bytes): boolean {
    return ref.length > 36
  }

  private isAmended(ref: bytes): boolean {
    return ref.length === 101
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
    const meta = decodeArc4<MetaValue>(this.meta(account).value.bytes)
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
      const score = decodeArc4<VotesValue>(this.votes(bytes32(account.bytes)).value.bytes)

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
        fee: 0,
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
          new Address(sender),
          bytes4(methodSelector(OptInPlugin.prototype.optInToAsset))
        ],
        fee: 0,
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
      fee: 0,
    })

    const rekeyTxn = itxn.applicationCall({
      sender,
      appId: recipientWallet,
      appArgs: [
        methodSelector(AbstractedAccount.prototype.arc58_rekeyToPlugin),
        getPluginAppList(this.akitaDAO.value).optin,
        new DynamicArray<UintN64>()
      ],
      fee: 0,
    })

    const optinMBRTxn = itxn.payment({
      sender,
      amount: Global.assetOptInMinBalance,
      receiver: recipientOrigin,
      fee: 0,
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
      fee: 0,
    })

    const verifyTxn = itxn.applicationCall({
      sender,
      appId: recipientWallet,
      appArgs: [
        methodSelector(AbstractedAccount.prototype.arc58_verifyAuthAddr)
      ],
      fee: 0,
    })

    const taxTxn = itxn.assetTransfer({
      sender,
      assetReceiver: this.akitaDAOEscrow.value.address,
      assetAmount: tax,
      xferAsset: akta,
      fee: 0,
    })

    const { reactFee } = getSocialFees(this.akitaDAO.value)

    const xferTxn = itxn.assetTransfer({
      sender,
      assetReceiver: recipientOrigin,
      assetAmount: reactFee - tax,
      xferAsset: akta,
      rekeyTo: rekeyAddress(rekeyBack, wallet),
      fee: 0,
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
        fee: 0,
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
        fee: 0,
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
          fee: 0,
        })
        .submit()
    }

    if (!routerOptedIn) {
      abiCall(AssetInbox.prototype.arc59_optRouterIn, {
        sender,
        appId: assetInbox,
        args: [akta],
        fee: 0,
      })
    }

    itxn
      .assetTransfer({
        sender,
        assetReceiver: this.akitaDAOEscrow.value.address,
        assetAmount: tax,
        xferAsset: akta,
        fee: 0,
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
            fee: 0,
          }),
          new Address(recipientOrigin),
          receiverAlgoNeededForClaim
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
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
      fee: 0,
    })

    const taxTxn = itxn.assetTransfer({
      sender,
      assetReceiver: this.akitaDAOEscrow.value.address,
      assetAmount: tax,
      xferAsset: akta,
      fee: 0,
    })

    const xferTxn = itxn.assetTransfer({
      sender,
      assetReceiver: recipientAccount,
      assetAmount: reactFee - tax,
      xferAsset: akta,
      rekeyTo: rekeyAddress(rekeyBack, wallet),
      fee: 0,
    })

    submitGroup(mbrPayment, taxTxn, xferTxn)
  }

  private voteListKey(account: Account, ref: StaticBytes<32>): arc4VoteListKey {
    return new arc4VoteListKey({
      user: bytes16(account.bytes),
      ref: bytes16(ref.bytes),
    })
  }

  private reactionListKey(account: Account, ref: StaticBytes<32>, NFT: uint64): arc4ReactionListKey {
    return new arc4ReactionListKey({
      user: bytes16(account.bytes),
      ref: bytes16(ref.bytes),
      NFT: new UintN64(NFT),
    })
  }

  private createEmptyPostIfNecessary(ref: StaticBytes<32>, creator: Account): void {
    if (!this.posts(ref).exists) {
      this.posts(ref).value = new arc4PostValue({
        ref: new DynamicBytes(ref.native),
        /**
         * when a user reacts to content other than posts
         * we set the creator to the following:
         * - AssetID: Asset Creator
         * - Address: Address
         * -   AppID: Application Creator
         */
        creator: new Address(creator),
        timestamp: new UintN64(Global.latestTimestamp),
        gateID: new UintN64(0),
        againstContentPolicy: new Bool(false),
        isAmendment: new Bool(false),
      })
    }
  }

  private updateStreak(account: Account): void {
    assert(this.meta(account).exists, ERR_META_DOESNT_EXIST)

    const encodedMeta = this.meta(account).value.copy()
    const meta = decodeArc4<MetaValue>(encodedMeta.bytes)

    const thisWindowStart: uint64 = Global.latestTimestamp - ((Global.latestTimestamp - meta.startDate) % ONE_DAY)
    const lastWindowStart: uint64 = thisWindowStart - ONE_DAY

    // if they haven't interacted in up to the last 48 hours (depending on the current window)
    // reset their streak
    if (lastWindowStart > meta.lastActive) {
      this.meta(account).value = new arc4MetaValue({
        ...encodedMeta,
        streak: new UintN64(1),
        lastActive: new UintN64(Global.latestTimestamp),
      })
      return
    }

    // if they have interacted after the last window
    // but have not yet interacted in this window, increment their streak
    if (meta.lastActive < thisWindowStart) {
      this.meta(account).value = new arc4MetaValue({
        ...encodedMeta,
        streak: new UintN64(meta.streak + 1),
        lastActive: new UintN64(Global.latestTimestamp),
      })
    }

    // otherwise do nothing, streak can only increment once per window (24 hours)
  }

  private calcVotes(ref: StaticBytes<32>, isUp: boolean, impact: uint64): { newCount: uint64; isNegative: boolean } {
    if (!this.votes(ref).exists) {
      return { newCount: impact, isNegative: false }
    }

    const { isNegative, voteCount } = decodeArc4<VotesValue>(this.votes(ref).value.bytes)
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
    const { newCount, isNegative } = this.calcVotes(ref, isUp, impact)
    this.votes(ref).value = new arc4VotesValue({
      voteCount: new UintN64(newCount),
      isNegative: new Bool(isNegative)
    })
  }

  private createVoteList(ref: StaticBytes<32>, isUp: boolean, account: Account, impact: uint64): void {
    const voteListKey = this.voteListKey(account, ref)
    this.votelist(voteListKey).value = new arc4VoteListValue({
      impact: new UintN64(impact),
      isUp: new Bool(isUp)
    })
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
      fee: 0,
    })

    const taxTxn = itxn.assetTransfer({
      sender,
      assetReceiver: this.akitaDAOEscrow.value.address,
      assetAmount: postFee,
      xferAsset: akta,
      rekeyTo: rekeyAddress(rekeyBack, wallet),
      fee: 0,
    })

    submitGroup(mbrTxn, taxTxn)

    const postID = bytes32(Txn.txId)
    const post = new arc4PostValue({
      ref: new DynamicBytes(cid.bytes),
      creator: new Address(origin),
      timestamp: new UintN64(Global.latestTimestamp),
      gateID: new UintN64(gateID),
      againstContentPolicy: new Bool(false),
      isAmendment: new Bool(isAmendment),
    })

    this.posts(postID).value = post
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
    const post = decodeArc4<PostValue>(this.posts(ref).value.bytes)
    assert(!this.isBlocked(post.creator.native, origin), ERR_BLOCKED)

    if (post.gateID !== 0) {
      assert(gateCheck(this.akitaDAO.value, new Address(origin), post.gateID, args), ERR_FAILED_GATE)
    }

    // update streak before we measure impact
    // this way we guarantee the box exists
    this.updateStreak(origin)

    const replyRef = ref.bytes.concat(cid.bytes)
    const creatorMeta = decodeArc4<MetaValue>(this.meta(post.creator.native).value.bytes)
    const postCreatorImpact = this.getUserImpact(post.creator.native)
    const tax = akitaSocialFee(this.akitaDAO.value, postCreatorImpact)
    const akta = getAkitaAssets(this.akitaDAO.value).akta
    const { posts, votes, votelist } = this.mbr(replyRef)
    const mbrAmount: uint64 = posts + votes + votelist

    if (!post.creator.native.isOptedIn(Asset(akta))) {
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
    const replyPost = new arc4PostValue({
      ref: new DynamicBytes(replyRef),
      creator: new Address(origin),
      timestamp: new UintN64(Global.latestTimestamp),
      gateID: new UintN64(gateID),
      againstContentPolicy: new Bool(false),
      isAmendment: new Bool(isAmendment),
    })

    this.posts(replyPostID).value = replyPost

    const senderImpact = this.getUserImpact(origin)
    this.updateVotes(replyPostID, true, senderImpact)
    this.createVoteList(replyPostID, true, origin, senderImpact)
  }

  private createVote(wallet: Application, rekeyBack: boolean, ref: StaticBytes<32>, isUp: boolean): void {
    const { origin, sender } = getAccounts(wallet)

    assert(!this.isBanned(origin), ERR_BANNED)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)

    const post = decodeArc4<PostValue>(this.posts(ref).value.bytes)
    assert(!this.isBlocked(post.creator.native, origin), ERR_BLOCKED)

    const voteListKey = this.voteListKey(origin, ref)
    assert(!this.votelist(voteListKey).exists, ERR_ALREADY_VOTED)
    assert(origin !== post.creator.native, ERR_NO_SELF_VOTE)

    const senderIsAutomated = this.meta(origin).value.automated
    assert(!senderIsAutomated.native, ERR_AUTOMATED_ACCOUNT)

    const akta = getAkitaAssets(this.akitaDAO.value).akta

    // update streak before we measure impact
    // this way we guarantee the box exists
    this.updateStreak(origin)
    const { reactFee, impactTaxMin, impactTaxMax } = getSocialFees(this.akitaDAO.value)
    const { votelist: mbrAmount } = this.mbr(ref.bytes)

    if (isUp) {
      const creatorMeta = decodeArc4<MetaValue>(this.meta(post.creator.native).value.bytes)
      // calls a transaction
      const recipientImpact = this.getUserImpact(post.creator.native)
      const tax = impactRange(recipientImpact, impactTaxMin, impactTaxMax)

      if (!post.creator.native.isOptedIn(Asset(akta))) {
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
        fee: 0,
      })

      const taxTxn = itxn.assetTransfer({
        sender,
        assetReceiver: this.akitaDAOEscrow.value.address,
        assetAmount: reactFee,
        xferAsset: akta,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
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
    const post = decodeArc4<PostValue>(this.posts(ref).value.bytes)
    assert(!this.isBlocked(post.creator.native, origin), ERR_BLOCKED)
    const senderHasNFT = AssetHolding.assetBalance(origin, NFT)[0] > 0
    assert(senderHasNFT, ERR_USER_DOES_NOT_OWN_NFT)

    if (post.gateID !== 0) {
      assert(gateCheck(this.akitaDAO.value, new Address(origin), post.gateID, args), ERR_FAILED_GATE)
    }

    const reactionListKey = this.reactionListKey(origin, ref, NFT)
    assert(!this.reactionlist(reactionListKey).exists, ERR_ALREADY_REACTED)

    // update streak before we measure impact
    // this way we guarantee the box exists
    this.updateStreak(origin)

    const creatorMeta = decodeArc4<MetaValue>(this.meta(post.creator.native).value.bytes)
    const recipientImpact = this.getUserImpact(post.creator.native)
    const { impactTaxMin, impactTaxMax } = getSocialFees(this.akitaDAO.value)
    const tax = impactRange(recipientImpact, impactTaxMin, impactTaxMax)
    const akta = getAkitaAssets(this.akitaDAO.value).akta
    const { reactions, reactionlist } = this.mbr(ref.bytes)

    const reactionKey = new arc4ReactionsKey({ ref, NFT: new UintN64(NFT) })
    const reactionExists = this.reactions(reactionKey).exists

    const mbrAmount: uint64 = reactionExists ? reactionlist : reactions + reactionlist

    if (!post.creator.native.isOptedIn(Asset(akta))) {
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
    assert(this.posts(amendment).exists, ERR_POST_NOT_FOUND)
    const post = this.posts(amendment).value
    assert(this.isCreator(post.creator, wallet), ERR_NOT_YOUR_POST_TO_EDIT)

    assert(post.ref.length !== 68, ERR_IS_A_REPLY)
    assert(post.ref.length !== 69, ERR_IS_ALREADY_AMENDED)

    this.posts(amendment).value.ref = new DynamicBytes(post.ref.bytes.concat(Bytes('a').concat(Txn.txId)))
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
      const meta = decodeArc4<MetaValue>(this.meta(ref.native).value.bytes)
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
    assert(this.posts(amendment).exists, ERR_REPLY_NOT_FOUND)
    const post = decodeArc4<PostValue>(this.posts(amendment).value.bytes)
    const origin = getOriginAccount(wallet)
    assert(post.creator.native === origin, ERR_NOT_YOUR_POST_TO_EDIT)
    assert(post.ref.length > 36, ERR_NOT_A_REPLY)
    assert(post.ref.length !== 101, ERR_IS_ALREADY_AMENDED)

    this.posts(amendment).value.ref = new DynamicBytes(post.ref.bytes.concat(Bytes('a').concat(Txn.txId)))
    const ref = bytes32(post.ref.bytes.slice(0, 32))
    this.createReply(wallet, rekeyBack, cid, ref, gateID, args, true)
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

    const { impact, isUp } = decodeArc4<VoteListValue>(this.votelist(voteListKey).value.bytes)

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
      const meta = decodeArc4<MetaValue>(this.meta(ref.native).value.bytes)
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
    const origin = getOriginAccount(wallet)
    assert(this.controls(origin), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(!this.isBanned(origin), ERR_BANNED)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const post = decodeArc4<PostValue>(this.posts(ref).value.bytes)
    assert(!this.isBlocked(post.creator.native, origin), ERR_BLOCKED)

    const reactionListKey = this.reactionListKey(origin, ref, NFT)
    assert(this.reactionlist(reactionListKey).exists, ERR_ALREADY_REACTED)

    const reactionsKey = new arc4ReactionsKey({ ref, NFT: new UintN64(NFT) })
    this.reactions(reactionsKey).value -= 1
    this.reactionlist(reactionListKey).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).reactionlist,
        fee: 0,
      })
      .submit()

    if (rekeyBack) {
      this.rekeyBack(wallet)
    }
  }

  follow(walletID: uint64, rekeyBack: boolean, address: Address, args: GateArgs): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)
    assert(this.controls(origin), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(!this.isBanned(origin), ERR_BANNED)
    assert(!this.isBlocked(address.native, origin), ERR_BLOCKED)

    const senderIsAutomated = this.meta(origin).value.automated
    assert(!senderIsAutomated.native, ERR_AUTOMATED_ACCOUNT)

    const encodedMeta = this.meta(address.native).value.copy()
    const meta = decodeArc4<MetaValue>(encodedMeta.bytes)

    if (meta.followGateID !== 0) {
      assert(gateCheck(this.akitaDAO.value, new Address(origin), meta.followGateID, args), ERR_FAILED_GATE)
    }

    const followerIndex = meta.followerIndex
    const followsKey = new arc4FollowsKey({
      user: address,
      index: new UintN64(followerIndex + 1),
    })
    this.follows(followsKey).value = origin

    this.meta(address.native).value = new arc4MetaValue({
      ...encodedMeta,
      followerIndex: new UintN64(followerIndex + 1),
      followerCount: new UintN64(meta.followerCount + 1),
    })

    itxn
      .payment({
        sender,
        receiver: Global.currentApplicationAddress,
        amount: this.mbr(Bytes('')).follows,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      })
      .submit()
  }

  unfollow(walletID: uint64, rekeyBack: boolean, address: Address, followerIndex: uint64): void {
    const wallet = Application(walletID)
    const origin = getOriginAccount(wallet)

    assert(this.controls(origin), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(!this.isBanned(origin), ERR_BANNED)

    const followsKey = new arc4FollowsKey({
      user: address,
      index: new UintN64(followerIndex),
    })
    assert(this.follows(followsKey).value === origin, ERR_WRONG_FOLLOWER_KEY)

    const currentFollowerCount = this.meta(address.native).value.followerCount.native
    this.meta(address.native).value.followerCount = new UintN64(currentFollowerCount - 1)
    this.follows(followsKey).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).follows,
        fee: 0,
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
    assert(this.controls(origin), ERR_PLUGIN_NOT_AUTH_ADDR)
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
        fee: 0,
      })
      .submit()
  }

  unblock(walletID: uint64, rekeyBack: boolean, address: Address): void {
    const wallet = Application(walletID)
    const origin = getOriginAccount(wallet)
    assert(this.controls(origin), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(!this.isBanned(origin), ERR_BANNED)

    const blocksKey = new arc4BlockListKey({
      user: bytes16(origin.bytes),
      blocked: bytes16(address.bytes),
    })
    this.blocks(blocksKey).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).blocks,
        fee: 0,
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
        fee: 0,
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
        fee: 0,
      })
      .submit()

    if (rekeyBack) {
      this.rekeyBack(wallet)
    }
  }

  ban(walletID: uint64, rekeyBack: boolean, address: Address, expiration: uint64): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)
    assert(this.controls(origin), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(this.moderators(origin).exists, ERR_NOT_A_MODERATOR)
    assert(!this.banned(address.native).exists, ERR_ALREADY_BANNED)
    this.banned(address.native).value = expiration

    itxn
      .payment({
        sender,
        receiver: Global.currentApplicationAddress,
        amount: this.mbr(Bytes('')).banned,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      })
      .submit()
  }

  flagPost(walletID: uint64, rekeyBack: boolean, ref: StaticBytes<32>): void {
    const wallet = Application(walletID)
    const origin = getOriginAccount(wallet)
    assert(this.controls(origin), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(this.moderators(origin).exists, ERR_NOT_A_MODERATOR)
    assert(this.posts(ref).exists, ERR_POST_NOT_FOUND)
    const post = this.posts(ref).value
    assert(!post.againstContentPolicy.native, ERR_ALREADY_FLAGGED)

    this.posts(ref).value.againstContentPolicy = new Bool(true)

    if (rekeyBack) {
      this.rekeyBack(wallet)
    }
  }

  unban(walletID: uint64, rekeyBack: boolean, address: Address): void {
    const wallet = Application(walletID)
    const origin = getOriginAccount(wallet)
    assert(this.controls(origin), ERR_PLUGIN_NOT_AUTH_ADDR)
    assert(this.moderators(origin).exists, ERR_NOT_A_MODERATOR)
    this.banned(address.native).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).banned,
        fee: 0,
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

    this.actions(actionAppID).value = new arc4Action({ content })

    itxn
      .payment({
        sender,
        receiver: Global.currentApplicationAddress,
        amount: this.mbr(Bytes('')).actions,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
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
        fee: 0,
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
      this.meta(origin).value = new arc4MetaValue({
        walletID: new UintN64(walletID),
        streak: new UintN64(1),
        startDate: new UintN64(Global.latestTimestamp),
        lastActive: new UintN64(Global.latestTimestamp),
        followerIndex: zero,
        followerCount: zero,
        automated: new Bool(true),
        followGateID: zero,
        addressGateID: zero,
      })

      abiCall(
        AkitaSocialImpact.prototype.cacheMeta,
        {
          sender,
          appId: getPluginAppList(this.akitaDAO.value).impact,
          args: [0, 0, 0],
          fee: 0,
        }
      )

      return 0
    }

    this.meta(origin).value = new arc4MetaValue({
      walletID: new UintN64(walletID),
      streak: new UintN64(1),
      startDate: new UintN64(Global.latestTimestamp),
      lastActive: new UintN64(Global.latestTimestamp),
      followerIndex: zero,
      followerCount: zero,
      automated: new Bool(false),
      followGateID: zero,
      addressGateID: zero,
    })

    const impact = abiCall(
      AkitaSocialImpact.prototype.cacheMeta,
      {
        sender,
        appId: getPluginAppList(this.akitaDAO.value).impact,
        args: [subscriptionIndex, NFD, akitaNFT],
        fee: 0,
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
    const followsKey = new arc4FollowsKey({
      user,
      index: new UintN64(index),
    })
    return this.follows(followsKey).value === follower.native
  }

  @abimethod({ readonly: true })
  getMeta(user: Address): MetaValue {
    return decodeArc4<MetaValue>(this.meta(user.native).value.bytes)
  }

  // dummy call to allow for more references
  gas() { }
}
