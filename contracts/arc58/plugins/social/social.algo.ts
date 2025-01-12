import { Contract } from '@algorandfoundation/tealscript';
import { OptInPlugin } from '../optin.algo';
import { AbstractedAccount } from '../../abstracted_account.algo';
import { Gate } from '../../../gates/gate.algo';
import { arc59GetSendAssetInfoResponse, AssetInbox } from '../../../../utils/types/asset_inbox';
import {
    AkitaAppIDsAkitaSocialImpactPlugin,
    AkitaAppIDsOptinPlugin,
    EMPTY_BYTES_32,
    EMPTY_BYTES_59,
    OtherAppIDsAssetInbox,
} from '../../../../utils/constants';
import { AkitaSocialImpact } from './impact.algo';
import { ContractWithGate } from '../../../../utils/base_contracts/gate.algo';

const errs = {
    NOT_AKITA_DAO: 'Only the Akita DAO can call this function',
    BANNED: 'This account is banned',
    BLOCKED: 'This account is blocked by the user',
    BAD_CID: 'Invalid IPFS CID length',
    POST_NOT_FOUND: 'Post not found',
    REPLY_NOT_FOUND: 'Reply not found',
    ALREADY_VOTED: "You've already voted on this post",
    HAVENT_VOTED: "You haven't voted on this",
    INVALID_NFD: 'Invalid NFD',
    NOT_AN_NFD: 'Not an NFD',
    USER_DOES_NOT_OWN_NFD: 'User does not own this NFD',
    NFD_CHANGED: 'NFD changed since impact last calculated',
    NOT_AN_AKITA_NFT: 'Not an akita NFT',
    USER_DOES_NOT_OWN_NFT: 'User does not own this NFT',
    NOT_A_SUBSCRIPTION: 'Not an akita subscription contract',
    META_DOESNT_EXIST: 'Meta box values dont exist yet',
    PLUGIN_NOT_AUTH_ADDR: 'This plugin does not have control of the account',
    META_ALREADY_EXISTS: 'Meta box values already exist',
    INVALID_ASSET: 'Invalid asset',
    INVALID_APP: 'Invalid App',
    NOT_YOUR_POST_TO_EDIT: 'Not your post to edit',
    NOT_A_REPLY: 'Not a reply',
    AUTOMATED_ACCOUNT: 'This is an automated account',
    NO_SELF_VOTE: 'Cannot vote on your own content',
    NOT_A_MODERATOR: 'Sender is not a moderator',
    ALREADY_BANNED: 'This account is already banned',
    ALREADY_REACTED: 'This account already reacted to this post with this NFT',
    WRONG_FOLLOWER_KEY: 'Wrong follower key',
    FEE_TOO_SMALL: 'Fee is too small',
    FAILED_GATE: 'Gate check failed',
    NOT_DAO: 'Not the DAO',
    ALREADY_A_MODERATOR: 'Already a moderator',
    ALREADY_FLAGGED: 'Already flagged',
    ALREADY_AN_ACTION: 'Already an action',
};

const ONE_DAY = 86400;

const SOCIAL_POST_FEE = 'social_post_fee';
const SOCIAL_REACT_KEY = 'social_react_fee';
const SOCIAL_IMPACT_TAX_MINIMUM_KEY = 'social_impact_tax_minimum';
const SOCIAL_IMPACT_TAX_MAXIMUM_KEY = 'social_impact_tax_maximum';
const AKITA_TOKEN_KEY = 'akita_id';

export const followsMBR = 31_700;
export const blocksMBR = 22_100;
export const postsMBR = 88_500;
export const votesMBR = 19_300;
export const votelistMBR = 25_700;
export const reactionsMBR = 22_100;
export const reactionlistMBR = 25_300;
export const metaMBR = 41_700;
export const moderatorsMBR = 15_700;
export const bannedMBR = 18_900;
export const actionsMBR = 29_700;

export type FollowsKey = {
    user: Address;
    index: uint64;
}

export type BlockListKey = {
    user: bytes<24>;
    blocked: bytes<24>;
}

export type PostValue = {
    // the txn / assetID / AppID / Address referenced
    ref: bytes32;
    // the IPFS cid pointing to the content
    cid: bytes<59>;
    // the creator of the post & recipient of payments
    creator: Address;
    // a transaction pointer to a new version of the post
    amendment: bytes32;
    // indicates whether the post itself is an amendment of another post
    isAmendment: boolean;
    // the unix time that the post was created
    timestamp: uint64;
    // collectible dictates whether the post can be collected or not
    collectible: boolean;
    // who's allowed to reply using gates
    replyGateIndex: uint64;
    // who's allowed to react using gates
    reactGateIndex: uint64;
    // whether the post is in breach of the content policy
    againstContentPolicy: boolean;
}

export type VotesValue = {
    voteCount: uint64;
    isNegative: boolean;
}

export type VoteListKey = {
    user: bytes<24>;
    ref: bytes<24>;
}

export type VoteListValue = {
    impact: uint64;
    isUp: boolean;
}

export type ReactionsKey = {
    ref: bytes32;
    NFT: AssetID;
}

export type ReactionListKey = {
    user: bytes<24>;
    ref: bytes<24>;
    NFT: AssetID;
}

export type Action = {
    content: bytes<59>;
}

export type MetaValue = {
    // this lets track the user addresses plugin wallet app ID for use with other plugins
    walletAppID: AppID;
    // this lets us assign impact to the consistency of their usage
    streak: uint64;
    // the date the user joined the network
    startDate: uint64;
    // the last time the user interacted with the network
    lastActive: uint64;
    // the follower count index of the user
    followerIndex: uint64;
    // the follower count of the user
    followerCount: uint64;
    // whether the account is automated
    automated: boolean;
    // who's allowed to follow you using gates
    followGateID: uint64;
    // who's allowed to post on your wall using gates
    addressGateID: uint64;
}

export class AkitaSocialPlugin extends ContractWithGate {
    programVersion = 10;

    /** the current version of the akita social contract */
    version = GlobalStateKey<string>({ key: 'version' });
    /** The App ID of the Akita DAO contract */
    akitaDaoAppID = TemplateVar<AppID>();

    // -------------------------------------------------------------
    // box maps ----------------------------------------------------
    // -------------------------------------------------------------

    /**
     * A map of who follows who
     * 
     * key:
     *  a 32 byte user address
     *  a uint64 follower index
     * key_length: 1 + 32 + 8: 41
     * 
     * value: the address following the user
     * value_length: 32
     * 
     * cost: 2_500 + (400 * (41 + 32)) = 31_700
     */
    follows = BoxMap<FollowsKey, Address>({ prefix: 'f' });

    /**
     * A map of all the blocks on the network
     * 
     * key:
     *  a 24 byte substring of the user address,
     *  a 24 byte substring of the blocked user address
     * key_length: 1 + 24 + 24: 49
     * 
     * value: empty bytes
     * value_length: 0
     * 
     * cost: 2_500 + (400 * (49)) = 22_100
     */
    blocks = BoxMap<BlockListKey, bytes<0>>({ prefix: 'b' });

    /**
     * A map of all the posts on the network
     * 
     * key: the reference id
     * key_length: 1 + 32: 33
     * 
     * value: the post data
     * value_length: 181
     * 
     * cost: 2_500 + (400 * (33 + 181)) = 88_500
     */
    posts = BoxMap<bytes32, PostValue>({ prefix: 'p' });

    /**
     * A map of counters for each post to track votes
     * 
     * key: the reference id
     * key_length: 1 + 32: 33
     * 
     * value: the count of votes & indicator if negative
     * value_length: 9
     * 
     * cost: 2_500 + (400 * (33 + 9)) = 19_300
     */
    votes = BoxMap<bytes32, VotesValue>({ prefix: 'v' });

    /**
     * A map of user votes and their impact
     * 
     * key:
     *  a 24 byte substring of the user address,
     *  a 24 byte substring of the post reference
     * key_length: 1 + 24 + 24: 49
     * 
     * value: the impact of the vote & whether it was positive
     * value_length: 9
     * 
     * cost: 2_500 + (400 * (49 + 9)) = 25_700
     */
    votelist = BoxMap<VoteListKey, VoteListValue>({ prefix: 'o' });

    /**
     * A map of counters for each post to track reactions
     * 
     * key:
     *  the reference id,
     *  and the NFT asset ID
     * key_length: 1 + 32 + 8 = 41
     * 
     * value: the count of reactions
     * value_length: 8
     * 
     * cost: 2_500 + (400 * (41 + 8)) = 22_100
     */
    reactions = BoxMap<ReactionsKey, uint64>({ prefix: 'r' })

    /**
     * A map of who has reacted to what
     * 
     * key:
     *  a 24 byte substring of the user address,
     *  a 24 byte substring of the post reference,
     *  and the NFT asset ID
     * key_length: 24 + 24 + 8 = 56
     * 
     * value: empty bytes
     * value_length: 0
     * 
     * cost: 2_500 + (400 * (56)) = 25_300
     */
    reactionlist = BoxMap<ReactionListKey, bytes<0>>({ prefix: 'e' });

    /**
     * A map of the meta data for each user
     * 
     * key: the address of the user
     * key_length: 32
     * 
     * value: the meta data for the user
     * value_length: 105
     * 
     * cost: 2_500 + (400 * (32 + 105)) = 41_700
     */
    meta = BoxMap<Address, MetaValue>({ prefix: 'm' });

    /**
     * A map of who is a moderator
     * 
     * key: the address of the moderator
     * key_length: 1 + 32: 33
     * 
     * value: empty bytes
     * value_length: 0
     * 
     * cost: 2_500 + (400 * (33)) = 15_700
     */
    moderators = BoxMap<Address, bytes<0>>({ prefix: 'd' });

    /**
     * A map of who is banned and when they can return
     *
     * key: the address of the banned user
     * key_length: 1 + 32: 33
     * 
     * value: the unix timestamp of when the ban expires
     * value_length: 8
     * 
     * cost: 2_500 + (400 * (33 + 8)) = 18_900
     */
    banned = BoxMap<Address, uint64>({ prefix: 'n' });

    /**
     * the actions usable on an akita post
     * 
     * key: the index of the action
     * key_length: 1 + 8: 9
     * 
     * value: the action data
     * value_length: 65
     * 
     * cost: 2_500 + (400 * (9 + 59)) = 29_700
    */
    actions = BoxMap<AppID, Action>({ prefix: 'a' });

    // -------------------------------------------------------------
    // misc private methods ----------------------------------------
    // -------------------------------------------------------------

    private isDAO(address: Address): boolean {
        return address === this.akitaDaoAppID.address;
    }

    private controls(address: Address): boolean {
        return address.authAddr === this.app.address;
    }

    private rekeyBack(address: Address) {
        sendPayment({
            sender: address,
            amount: 0,
            receiver: address,
            rekeyTo: address,
            fee: 0,
        });
    }

    private isBanned(address: Address): boolean {
        return this.banned(address).exists && this.banned(address).value > globals.latestTimestamp;
    }

    private isBlocked(user: Address, blocked: Address): boolean {
        const userSplice = extract3(user, 0, 24) as bytes<24>;
        const blockedSplice = extract3(blocked, 0, 24) as bytes<24>;
        return this.blocks({ user: userSplice, blocked: blockedSplice }).exists;
    }

    // -------------------------------------------------------------
    // impact private methods --------------------------------------
    // -------------------------------------------------------------

    private getSocialImpactScore(address: Address): uint64 {
        // - Social Activity | up to 250
        let socialImpact = 0;

        const meta = this.meta(address).value;

        if (meta.streak >= 60) {
            socialImpact += 100;
        } else {
            // Calculate impact proportionally up to 60 days
            socialImpact += (meta.streak * 100) / 60;
        }

        // longevity
        // if the account is older than 2 years give them 75
        const accountAge = globals.latestTimestamp - meta.startDate;
        const twoYearsInSeconds = 63_072_000 // 2 years in seconds

        if (accountAge >= twoYearsInSeconds) {
            socialImpact += 75;
        } else {
            // impact proportional up to 2 years
            socialImpact += (accountAge * 75) / twoYearsInSeconds;
        }

        // Calculate score based on userScore, capped at 100_000
        if (this.votes(rawBytes(address) as bytes32).exists) {
            const score = this.votes(rawBytes(address) as bytes32).value;

            let impact = (score.voteCount * 75) / 100_000;
            if (impact > 75) {
                impact = 75;
            }

            if (score.isNegative) {
                // Subtract from socialImpact if the score is negative
                if (socialImpact > impact) {
                    socialImpact -= impact;
                } else {
                    socialImpact = 0;
                }
            } else {
                // Add to socialImpact if the score is positive
                socialImpact += impact;
            }
        }

        return socialImpact;
    }

    private getUserImpact(address: Address): uint64 {
        const socialImpact = this.getSocialImpactScore(address);

        return sendMethodCall<typeof AkitaSocialImpact.prototype.socialGetUserImpact, uint64>({
            applicationID: AppID.fromUint64(AkitaAppIDsAkitaSocialImpactPlugin),
            methodArgs: [ address, socialImpact ],
            fee: 0,
        })
    }

    // -------------------------------------------------------------
    // payment private methods -------------------------------------
    // -------------------------------------------------------------

    private getTax(impact: uint64): uint64 {
        // social_impact_tax_minimum
        const minTax = this.akitaDaoAppID.globalState(SOCIAL_IMPACT_TAX_MINIMUM_KEY) as uint64;
        const maxTax = this.akitaDaoAppID.globalState(SOCIAL_IMPACT_TAX_MAXIMUM_KEY) as uint64;

        const taxRate = maxTax - wideRatio([(maxTax - minTax), (impact - 1)], [999]);
        const reactionFee = this.akitaDaoAppID.globalState(SOCIAL_REACT_KEY) as uint64;
        let tax = wideRatio([reactionFee, taxRate], [10000]);
        if (tax === 0) {
            tax = 1;
        }
        return tax;
    }

    private canCallArc58OptIn(sender: Address, walletAppID: AppID): boolean {
        return sendMethodCall<typeof AbstractedAccount.prototype.arc58_canCall, boolean>({
            sender: sender,
            applicationID: walletAppID,
            methodArgs: [
                AppID.fromUint64(AkitaAppIDsOptinPlugin),
                sender,
            ],
            fee: 0,
        });
    }

    private arc58OptInAndSendReactionPayments(sender: AppID, rekeyBack: boolean, recipientAppID: AppID, tax: uint64): void {
        this.pendingGroup.addMethodCall<typeof AbstractedAccount.prototype.arc58_rekeyToPlugin, void>({
            sender: sender.address,
            applicationID: recipientAppID,
            methodArgs: [
                AppID.fromUint64(AkitaAppIDsOptinPlugin),
                []
            ],
            fee: 0,
            isFirstTxn: true,
        });

        const akitaToken = this.akitaDaoAppID.globalState(AKITA_TOKEN_KEY) as AssetID;

        this.pendingGroup.addMethodCall<typeof OptInPlugin.prototype.optInToAsset, void>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsOptinPlugin),
            methodArgs: [
                recipientAppID,
                true,
                akitaToken,
                {
                    sender: sender.address, // sender pays the recipient mbr
                    receiver: recipientAppID.address,
                    amount: globals.assetOptInMinBalance,
                    fee: 0,
                },
            ],
            fee: 0,
        });

        this.pendingGroup.addMethodCall<typeof AbstractedAccount.prototype.arc58_verifyAuthAddr, void>({
            sender: sender.address,
            applicationID: recipientAppID,
            fee: 0,
        });

        this.pendingGroup.addAssetTransfer({
            sender: sender.address,
            assetReceiver: this.akitaDaoAppID.address,
            assetAmount: tax,
            xferAsset: akitaToken,
            fee: 0,
        });

        const reactionFee = this.akitaDaoAppID.globalState(SOCIAL_REACT_KEY) as uint64;

        this.pendingGroup.addAssetTransfer({
            sender: sender.address,
            assetReceiver: recipientAppID.address,
            assetAmount: (reactionFee - tax),
            xferAsset: akitaToken,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });

        this.pendingGroup.submit();
    }

    private arc59OptInAndSendReactionPayments(sender: AppID, rekeyBack: boolean, recipientAppID: AppID, tax: uint64): void {
        const akitaToken = this.akitaDaoAppID.globalState(AKITA_TOKEN_KEY) as AssetID;
        const canCallData = sendMethodCall<typeof AssetInbox.prototype.arc59_getSendAssetInfo, arc59GetSendAssetInfoResponse>({
            applicationID: AppID.fromUint64(OtherAppIDsAssetInbox),
            methodArgs: [
                recipientAppID.address,
                akitaToken.id,
            ],
            fee: 0,
        });

        const mbr = canCallData.mbr;
        const routerOptedIn = canCallData.routerOptedIn;
        const receiverAlgoNeededForClaim = canCallData.receiverAlgoNeededForClaim;

        if (mbr || receiverAlgoNeededForClaim) {
            this.pendingGroup.addPayment({
                sender: sender.address,
                receiver: AppID.fromUint64(OtherAppIDsAssetInbox).address,
                amount: (mbr + receiverAlgoNeededForClaim),
                fee: 0,
                isFirstTxn: true,
            });
        }

        if (!routerOptedIn) {
            this.pendingGroup.addMethodCall<typeof AssetInbox.prototype.arc59_optRouterIn, void>({
                sender: sender.address,
                applicationID: AppID.fromUint64(OtherAppIDsAssetInbox),
                methodArgs: [akitaToken.id],
                fee: 0,
                isFirstTxn: !(mbr || receiverAlgoNeededForClaim),
            });
        }

        this.pendingGroup.addAssetTransfer({
            sender: sender.address,
            assetReceiver: this.akitaDaoAppID.address,
            assetAmount: tax,
            xferAsset: akitaToken,
            fee: 0,
            isFirstTxn: routerOptedIn && !(mbr || receiverAlgoNeededForClaim)
        });

        const reactionFee = this.akitaDaoAppID.globalState(SOCIAL_REACT_KEY) as uint64;

        this.pendingGroup.addMethodCall<typeof AssetInbox.prototype.arc59_sendAsset, Address>({
            sender: sender.address,
            applicationID: AppID.fromUint64(OtherAppIDsAssetInbox),
            methodArgs: [
                {
                    sender: sender.address,
                    assetReceiver: AppID.fromUint64(OtherAppIDsAssetInbox).address,
                    assetAmount: (reactionFee - tax),
                    xferAsset: akitaToken,
                    fee: 0,
                },
                recipientAppID.address,
                receiverAlgoNeededForClaim,
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0
        });

        this.pendingGroup.submit();
    }

    private sendReactionPayments(sender: AppID, rekeyBack: boolean, recipientAddress: Address, tax: uint64): void {
        const akitaToken = this.akitaDaoAppID.globalState(AKITA_TOKEN_KEY) as AssetID;

        this.pendingGroup.addAssetTransfer({
            sender: sender.address,
            assetReceiver: this.akitaDaoAppID.address,
            assetAmount: tax,
            xferAsset: akitaToken,
            fee: 0,
            isFirstTxn: true,
        });

        const reactionFee = this.akitaDaoAppID.globalState(SOCIAL_REACT_KEY) as uint64;

        this.pendingGroup.addAssetTransfer({
            sender: sender.address,
            assetReceiver: recipientAddress,
            assetAmount: (reactionFee - tax),
            xferAsset: akitaToken,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });

        this.pendingGroup.submit();
    }

    // -------------------------------------------------------------
    // content private methods -------------------------------------
    // -------------------------------------------------------------

    private createEmptyPostIfNecessary(ref: bytes32, creator: Address): void {
        if (!this.posts(ref).exists) {
            this.posts(ref).value = {
                ref: ref,
                cid: EMPTY_BYTES_59,
                /** 
                 * when a user reacts to content other than posts
                 * we set the creator to the following:
                 * - AssetID: Asset Creator
                 * - Address: Address
                 * -   AppID: Application Creator
                */
                creator: creator,
                amendment: EMPTY_BYTES_32,
                isAmendment: false,
                timestamp: globals.latestTimestamp,
                collectible: false,
                replyGateIndex: 0,
                reactGateIndex: 0,
                againstContentPolicy: false,
            };
        }
    }

    private updateStreak(address: Address): void {
        assert(this.meta(address).exists, errs.META_DOESNT_EXIST);

        const meta = clone(this.meta(address).value);

        const thisWindowStart = globals.latestTimestamp - (
            (globals.latestTimestamp - meta.startDate) % ONE_DAY
        );
        const lastWindowStart = thisWindowStart - ONE_DAY;

        // if they haven't interacted in up to the last 48 hours (depending on the current window)
        // reset their streak
        if (lastWindowStart > meta.lastActive) {
            meta.streak = 1;
            meta.lastActive = globals.latestTimestamp;
            this.meta(address).value = meta;
            return;
        }

        // if they have interacted after the last window
        // but have not yet interacted in this window, increment their streak
        if (meta.lastActive < thisWindowStart) {
            meta.streak = meta.streak + 1;
            meta.lastActive = globals.latestTimestamp;
            this.meta(address).value = meta;
        }

        // otherwise do nothing, streak can only increment once per window (24 hours)
    }

    private calcVotes(ref: bytes32, isUp: boolean, impact: uint64): { newCount: uint64, isNegative: boolean } {
        const votesData = this.votes(ref).value;
        const isNegative = votesData.isNegative;
        const voteCount = votesData.voteCount;
        // differingDirections means that the direction this vote will move the vote count
        // is the opposite of the current vote count
        const differingDirections = (isUp && isNegative) || (!isUp && !isNegative);
        // flip indicates that this vote will move the vote count from negative to positive
        // or vice versa
        const flip = impact > voteCount && differingDirections;
        if (flip) {
            const newCount = impact - voteCount;
            return { newCount: newCount, isNegative: !isNegative };
        }

        const newCount = differingDirections ? voteCount - impact : voteCount + impact;
        return { newCount: newCount, isNegative: isNegative };
    }

    private updateVotes(ref: bytes32, isUp: boolean, impact: uint64): void {
        const calcData = this.calcVotes(ref, isUp, impact);
        const newCount = calcData.newCount;
        const isNegative = calcData.isNegative;
        this.votes(ref).value = { voteCount: newCount, isNegative: isNegative };
    }

    private createPost(
        sender: AppID,
        rekeyBack: boolean,
        cid: bytes<59>,
        collectible: boolean,
        replyGateIndex: uint64,
        reactGateIndex: uint64,
        isAmendment: boolean,
    ): void {
        assert(!this.isBanned(sender.address), errs.BANNED);

        // update streak before we measure impact
        // this way we guarantee the box exists
        this.updateStreak(sender.address);

        const impact = this.getUserImpact(sender.address);

        const postFee = this.akitaDaoAppID.globalState(SOCIAL_POST_FEE) as uint64;

        const akitaToken = this.akitaDaoAppID.globalState(AKITA_TOKEN_KEY) as AssetID;

        sendAssetTransfer({
            sender: sender.address,
            assetReceiver: this.akitaDaoAppID.address,
            assetAmount: postFee,
            xferAsset: akitaToken,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });

        const postID = this.txn.txID as bytes32;
        const post: PostValue = {
            ref: EMPTY_BYTES_32,
            cid: cid,
            creator: sender.address,
            amendment: EMPTY_BYTES_32,
            isAmendment: isAmendment,
            timestamp: globals.latestTimestamp,
            collectible: collectible,
            replyGateIndex: replyGateIndex,
            reactGateIndex: reactGateIndex,
            againstContentPolicy: false,
        };

        this.posts(postID).value = post;
        this.updateVotes(postID, true, impact);
        const voteListKey: VoteListKey = {
            user: extract3(sender.address, 0, 24) as bytes<24>,
            ref: extract3(postID, 0, 24) as bytes<24>,
        };
        this.votelist(voteListKey).value = { impact: impact, isUp: true };
    }

    private createReply(
        sender: AppID,
        rekeyBack: boolean,
        cid: bytes<59>,
        ref: bytes32,
        collectible: boolean,
        replyGateIndex: uint64,
        reactGateIndex: uint64,
        args: bytes[],
        isAmendment: boolean,
    ): void {
        assert(!this.isBanned(sender.address), errs.BANNED);
        assert(this.posts(ref).exists, errs.POST_NOT_FOUND);
        const post = this.posts(ref).value;
        assert(!this.isBlocked(post.creator, sender.address), errs.BLOCKED);

        if (post.replyGateIndex !== 0) {
            assert(this.gate(sender.address, post.replyGateIndex, args), errs.FAILED_GATE);
        }

        // update streak before we measure impact
        // this way we guarantee the box exists
        this.updateStreak(sender.address);

        const creatorMeta = this.meta(post.creator).value;
        const postCreatorImpact = this.getUserImpact(post.creator);
        const tax = this.getTax(postCreatorImpact);
        const akitaToken = this.akitaDaoAppID.globalState(AKITA_TOKEN_KEY) as AssetID;

        if (!post.creator.isOptedInToAsset(akitaToken)) {
            // calls a transaction
            const canCallArc58OptIn = this.canCallArc58OptIn(sender.address, creatorMeta.walletAppID);
            if (canCallArc58OptIn) {
                // calls 6 transactions
                this.arc58OptInAndSendReactionPayments(sender, rekeyBack, creatorMeta.walletAppID, tax);
            } else {
                // calls up to 6 transactions
                this.arc59OptInAndSendReactionPayments(sender, rekeyBack, creatorMeta.walletAppID, tax);
            }
        } else {
            // calls 2 transactions
            this.sendReactionPayments(sender, rekeyBack, creatorMeta.walletAppID.address, tax);
        }

        const replyPostID = this.txn.txID as bytes32;
        const replyPost: PostValue = {
            ref: ref,
            cid: cid,
            creator: sender.address,
            amendment: EMPTY_BYTES_32,
            isAmendment: isAmendment,
            timestamp: globals.latestTimestamp,
            collectible: collectible,
            replyGateIndex: replyGateIndex,
            reactGateIndex: reactGateIndex,
            againstContentPolicy: false
        };

        this.posts(replyPostID).value = replyPost;

        const senderImpact = this.getUserImpact(sender.address);
        this.updateVotes(replyPostID, true, senderImpact);
        const voteListKey: VoteListKey = {
            user: extract3(sender.address, 0, 24) as bytes<24>,
            ref: extract3(replyPostID, 0, 24) as bytes<24>,
        };
        this.votelist(voteListKey).value = { impact: senderImpact, isUp: true };
    }

    private createVote(sender: AppID, rekeyBack: boolean, ref: bytes32, isUp: boolean): void {
        assert(!this.isBanned(sender.address), errs.BANNED);
        assert(this.posts(ref).exists, errs.POST_NOT_FOUND);

        const post = this.posts(ref).value;
        assert(!this.isBlocked(post.creator, sender.address), errs.BLOCKED);
        const voteListKey: VoteListKey = {
            user: extract3(sender.address, 0, 24) as bytes<24>,
            ref: extract3(ref, 0, 24) as bytes<24>,
        };
        assert(!this.votelist(voteListKey).exists, errs.ALREADY_VOTED);
        assert(sender.address !== post.creator, errs.NO_SELF_VOTE);

        const senderIsAutomated = this.meta(sender.address).value.automated;
        assert(!senderIsAutomated, errs.AUTOMATED_ACCOUNT);

        const akitaToken = this.akitaDaoAppID.globalState(AKITA_TOKEN_KEY) as AssetID;

        // update streak before we measure impact
        // this way we guarantee the box exists
        this.updateStreak(sender.address);

        if (isUp) {
            const creatorMeta = this.meta(post.creator).value;
            // calls a transaction
            const recipientImpact = this.getUserImpact(post.creator);
            const tax = this.getTax(recipientImpact);

            if (!post.creator.isOptedInToAsset(akitaToken)) {
                // calls a transaction
                const canCallArc58OptIn = this.canCallArc58OptIn(sender.address, creatorMeta.walletAppID);
                if (canCallArc58OptIn) {
                    // calls 6 transactions
                    this.arc58OptInAndSendReactionPayments(sender, rekeyBack, creatorMeta.walletAppID, tax);
                } else {
                    // calls up to 6 transactions
                    this.arc59OptInAndSendReactionPayments(sender, rekeyBack, creatorMeta.walletAppID, tax);
                }
            } else {
                // calls 2 transactions
                this.sendReactionPayments(sender, rekeyBack, creatorMeta.walletAppID.address, tax);
            }
        } else {

            const reactionFee = this.akitaDaoAppID.globalState(SOCIAL_REACT_KEY) as uint64;

            sendAssetTransfer({
                sender: sender.address,
                assetReceiver: this.akitaDaoAppID.address,
                assetAmount: reactionFee,
                xferAsset: akitaToken,
                rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
                fee: 0,
            });
        }

        // calls a transaction
        const senderImpact = this.getUserImpact(sender.address);
        this.updateVotes(ref, isUp, senderImpact);
        this.votelist(voteListKey).value = { impact: senderImpact, isUp: isUp };
    }

    private createReaction(sender: AppID, rekeyBack: boolean, ref: bytes32, NFT: AssetID, args: bytes[]): void {
        assert(!this.isBanned(sender.address), errs.BANNED);
        assert(this.posts(ref).exists, errs.POST_NOT_FOUND);
        const post = this.posts(ref).value;
        assert(!this.isBlocked(post.creator, sender.address), errs.BLOCKED);
        assert(sender.address.assetBalance(NFT) > 0, errs.USER_DOES_NOT_OWN_NFT);

        if (post.reactGateIndex !== 0) {
            assert(this.gate(sender.address, post.reactGateIndex, args), errs.FAILED_GATE);
        }

        const reactionListKey: ReactionListKey = {
            user: rawBytes(sender).substring(0, 24) as bytes<24>,
            ref: rawBytes(ref).substring(0, 24) as bytes<24>,
            NFT: NFT
        };

        assert(!this.reactionlist(reactionListKey).exists, errs.ALREADY_REACTED);

        // update streak before we measure impact
        // this way we guarantee the box exists
        this.updateStreak(sender.address);

        const creatorMeta = this.meta(post.creator).value;
        const recipientImpact = this.getUserImpact(post.creator);
        const tax = this.getTax(recipientImpact);
        const akitaToken = this.akitaDaoAppID.globalState(AKITA_TOKEN_KEY) as AssetID;

        if (!post.creator.isOptedInToAsset(akitaToken)) {
            const canCallArc58OptIn = this.canCallArc58OptIn(sender.address, creatorMeta.walletAppID);
            if (canCallArc58OptIn) {
                this.arc58OptInAndSendReactionPayments(sender, rekeyBack, creatorMeta.walletAppID, tax);
            } else {
                this.arc59OptInAndSendReactionPayments(sender, rekeyBack, creatorMeta.walletAppID, tax);
            }
        } else {
            this.sendReactionPayments(sender, rekeyBack, creatorMeta.walletAppID.address, tax);
        }

        const reactionExists = this.reactions({ ref: ref, NFT: NFT }).exists;
        if (reactionExists) {
            this.reactions({ ref: ref, NFT: NFT }).value += 1;
        } else {
            this.reactions({ ref: ref, NFT: NFT }).value = 1;
        }

        this.reactionlist(reactionListKey).create(0);
    }

    // -------------------------------------------------------------
    // lifecycle methods ---------------------------------------------
    // -------------------------------------------------------------

    createApplication(version: string): void {
        this.version.value = version;
    }

    updateApplication(version: string): void {
        assert(this.txn.sender === this.akitaDaoAppID.address, errs.NOT_AKITA_DAO);
        this.version.value = version;
    }

    // -------------------------------------------------------------
    // content methods ---------------------------------------------
    // -------------------------------------------------------------

    post(
        sender: AppID,
        rekeyBack: boolean,
        cid: bytes<59>,
        collectible: boolean,
        replyGateIndex: uint64,
        reactGateIndex: uint64,
    ): void {
        this.createPost(sender, rekeyBack, cid, collectible, replyGateIndex, reactGateIndex, false);
    }

    editPost(
        sender: AppID,
        rekeyBack: boolean,
        cid: bytes<59>,
        collectible: boolean,
        replyGateIndex: uint64,
        reactGateIndex: uint64,
        amendment: bytes32,
    ): void {
        assert(this.posts(amendment).exists, errs.POST_NOT_FOUND);
        const post = clone(this.posts(amendment).value);
        assert(post.creator === sender.address, errs.NOT_YOUR_POST_TO_EDIT);
        assert(post.ref === EMPTY_BYTES_32);

        this.posts(amendment).value = {
            ref: post.ref,
            cid: post.cid,
            creator: post.creator,
            amendment: this.txn.txID as bytes32,
            isAmendment: post.isAmendment,
            timestamp: post.timestamp,
            collectible: false,
            replyGateIndex: post.replyGateIndex,
            reactGateIndex: post.reactGateIndex,
            againstContentPolicy: false
        };

        this.createPost(sender, rekeyBack, cid, collectible, replyGateIndex, reactGateIndex, true);
    }

    replyPost(
        sender: AppID,
        rekeyBack: boolean,
        cid: bytes<59>,
        ref: bytes32,
        collectible: boolean,
        replyGateIndex: uint64,
        reactGateIndex: uint64,
        args: bytes[],
    ): void {
        this.createReply(sender, rekeyBack, cid, ref, collectible, replyGateIndex, reactGateIndex, args, false);
    }

    replyAsset(
        sender: AppID,
        rekeyBack: boolean,
        cid: bytes<59>,
        ref: AssetID,
        collectible: boolean,
        replyGateIndex: uint64,
        reactGateIndex: uint64,
    ): void {
        assert(ref.id !== 0, errs.INVALID_ASSET)
        const paddedRef = itob(ref.id) as bytes32;
        this.createEmptyPostIfNecessary(paddedRef, ref.creator);
        this.createReply(sender, rekeyBack, cid, paddedRef, collectible, replyGateIndex, reactGateIndex, [], false);
    }

    replyAddress(
        sender: AppID,
        rekeyBack: boolean,
        cid: bytes<59>,
        ref: Address,
        collectible: boolean,
        replyGateIndex: uint64,
        reactGateIndex: uint64,
        args: bytes[],
    ): void {
        if (this.meta(ref).exists) {
            const meta = this.meta(ref).value;

            if (meta.addressGateID !== 0) {
                assert(this.gate(sender.address, meta.addressGateID, args), errs.FAILED_GATE);
            }
        }

        const r = rawBytes(ref) as bytes32;
        this.createEmptyPostIfNecessary(r, ref);
        this.createReply(sender, rekeyBack, cid, r, collectible, replyGateIndex, reactGateIndex, [], false);
    }

    replyApp(
        sender: AppID,
        rekeyBack: boolean,
        cid: bytes<59>,
        ref: AppID,
        collectible: boolean,
        replyGateIndex: uint64,
        reactGateIndex: uint64,
    ): void {
        assert(ref.id !== 0, errs.INVALID_APP)
        const paddedRef = itob(ref.id) as bytes32;
        this.createEmptyPostIfNecessary(paddedRef, ref.creator);
        this.createReply(sender, rekeyBack, cid, paddedRef, collectible, replyGateIndex, reactGateIndex, [], false);
    }

    editReply(
        sender: AppID,
        rekeyBack: boolean,
        cid: bytes<59>,
        collectible: boolean,
        replyGateIndex: uint64,
        reactGateIndex: uint64,
        args: bytes[],
        amendment: bytes32,
    ): void {
        assert(this.posts(amendment).exists, errs.REPLY_NOT_FOUND);
        const post = this.posts(amendment).value;
        assert(post.creator === sender.address, errs.NOT_YOUR_POST_TO_EDIT);
        assert(post.ref !== EMPTY_BYTES_32, errs.NOT_A_REPLY);
        this.posts(amendment).value.amendment = this.txn.txID;
        this.createReply(sender, rekeyBack, cid, post.ref, collectible, replyGateIndex, reactGateIndex, args, true);
    }

    votePost(sender: AppID, rekeyBack: boolean, ref: bytes32, isUp: boolean,): void {
        this.createVote(sender, rekeyBack, ref, isUp);
    }

    voteAsset(sender: AppID, rekeyBack: boolean, ref: AssetID, isUp: boolean): void {
        assert(ref.id !== 0, errs.INVALID_ASSET);
        const paddedRef = itob(ref.id) as bytes32;
        this.createEmptyPostIfNecessary(paddedRef, ref.creator);
        this.createVote(sender, rekeyBack, paddedRef, isUp);
    }

    voteAddress(sender: AppID, rekeyBack: boolean, ref: Address, isUp: boolean): void {
        const r = rawBytes(ref) as bytes32;
        this.createEmptyPostIfNecessary(r, ref);
        this.createVote(sender, rekeyBack, r, isUp);
    }

    voteApp(sender: AppID, rekeyBack: boolean, ref: AppID, isUp: boolean): void {
        assert(ref.id !== 0, errs.INVALID_APP)
        const paddedRef = itob(ref.id) as bytes32;
        this.createEmptyPostIfNecessary(paddedRef, ref.creator);
        this.createVote(sender, rekeyBack, paddedRef, isUp);
    }

    editVote(sender: AppID, rekeyBack: boolean, ref: bytes32, flip: boolean): void {
        const voteListKey: VoteListKey = {
            user: extract3(sender.address, 0, 24) as bytes<24>,
            ref: extract3(ref, 0, 24) as bytes<24>,
        };
        assert(this.votelist(voteListKey).exists, errs.HAVENT_VOTED);

        const voteListData = this.votelist(voteListKey).value;
        const impact = voteListData.impact;
        const isUp = voteListData.isUp;

        // undo user vote
        this.updateVotes(ref, !isUp, impact);
        if (!flip) {
            return;
        }

        this.createVote(sender, rekeyBack, ref, !isUp);
    }

    reactPost(sender: AppID, rekeyBack: boolean, ref: bytes32, NFT: AssetID, args: bytes[]): void {
        this.createReaction(sender, rekeyBack, ref, NFT, args);
    }

    reactAsset(sender: AppID, rekeyBack: boolean, ref: AssetID, NFT: AssetID): void {
        assert(ref.id !== 0, errs.INVALID_ASSET)
        const paddedRef = itob(ref.id) as bytes32;
        this.createEmptyPostIfNecessary(paddedRef, ref.creator);
        this.createReaction(sender, rekeyBack, paddedRef, NFT, []);
    }

    reactAddress(sender: AppID, rekeyBack: boolean, ref: Address, NFT: AssetID, args: bytes[]): void {

        if (this.meta(ref).exists) {
            const meta = this.meta(ref).value;

            if (meta.addressGateID !== 0) {
                assert(this.gate(sender.address, meta.addressGateID, args), errs.FAILED_GATE);
            }
        }

        const r = rawBytes(ref) as bytes32;
        this.createEmptyPostIfNecessary(r, ref);
        this.createReaction(sender, rekeyBack, r, NFT, []);
    }

    reactApp(sender: AppID, rekeyBack: boolean, ref: AppID, NFT: AssetID): void {
        assert(ref.id !== 0, errs.INVALID_APP)
        const paddedRef = itob(ref.id) as bytes32;
        this.createEmptyPostIfNecessary(paddedRef, ref.creator);
        this.createReaction(sender, rekeyBack, paddedRef, NFT, []);
    }

    deleteReaction(sender: AppID, rekeyBack: boolean, ref: bytes32, NFT: AssetID): void {
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(!this.isBanned(sender.address), errs.BANNED);
        assert(this.posts(ref).exists, errs.POST_NOT_FOUND);
        const post = this.posts(ref).value;
        assert(!this.isBlocked(post.creator, sender.address), errs.BLOCKED);

        const reactionListKey: ReactionListKey = {
            user: rawBytes(sender.address).substring(0, 24) as bytes<24>,
            ref: rawBytes(ref).substring(0, 24) as bytes<24>,
            NFT: NFT
        };
        assert(this.reactionlist(reactionListKey).exists, errs.ALREADY_REACTED);

        this.reactions({ ref: ref, NFT: NFT }).value -= 1;
        this.reactionlist(reactionListKey).delete();

        if (rekeyBack) {
            this.rekeyBack(sender.address);
        }
    }

    // -------------------------------------------------------------
    // user methods ------------------------------------------------
    // -------------------------------------------------------------

    follow(sender: AppID, rekeyBack: boolean, address: Address, args: bytes[]): void {
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(!this.isBanned(sender.address), errs.BANNED);
        assert(!this.isBlocked(address, sender.address), errs.BLOCKED);

        const senderIsAutomated = this.meta(sender.address).value.automated;
        assert(!senderIsAutomated, errs.AUTOMATED_ACCOUNT);

        const meta = this.meta(address).value;

        if (meta.followGateID !== 0) {
            assert(this.gate(sender.address, meta.followGateID, args), errs.FAILED_GATE);
        }

        const followerIndex = meta.followerIndex;
        this.follows({ user: address, index: (followerIndex + 1) }).value = sender.address;

        this.meta(address).value.followerIndex += 1;
        this.meta(address).value.followerCount += 1;

        sendPayment({
            sender: sender.address,
            receiver: this.app.address,
            amount: followsMBR,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }

    unfollow(sender: AppID, rekeyBack: boolean, address: Address, followerIndex: uint64): void {
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(!this.isBanned(sender.address), errs.BANNED);
        assert(this.follows({ user: address, index: followerIndex }).value === sender.address, errs.WRONG_FOLLOWER_KEY);

        this.follows({ user: address, index: followerIndex }).delete();
        this.meta(address).value.followerCount -= 1;

        if (rekeyBack) {
            this.rekeyBack(sender.address);
        }
    }

    // we dont remove followers because that requires us to know the index
    // instead, blocking supersedes following
    block(sender: AppID, rekeyBack: boolean, address: Address): void {
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(!this.isBanned(sender.address), errs.BANNED);

        const blocksKey: BlockListKey = {
            user: extract3(sender.address, 0, 24) as bytes<24>,
            blocked: extract3(address, 0, 24) as bytes<24>,
        };
        this.blocks(blocksKey).create(0);

        if (rekeyBack) {
            this.rekeyBack(sender.address);
        }
    }

    unblock(sender: AppID, rekeyBack: boolean, address: Address): void {
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(!this.isBanned(sender.address), errs.BANNED);

        const blocksKey: BlockListKey = {
            user: extract3(sender.address, 0, 24) as bytes<24>,
            blocked: extract3(address, 0, 24) as bytes<24>,
        };
        this.blocks(blocksKey).delete();

        if (rekeyBack) {
            this.rekeyBack(sender.address);
        }
    }

    // -------------------------------------------------------------
    // moderator methods -------------------------------------------
    // -------------------------------------------------------------

    addModerator(sender: AppID, rekeyBack: boolean, address: Address): void {
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(this.isDAO(sender.address), errs.NOT_DAO);
        assert(!this.moderators(address).exists, errs.ALREADY_A_MODERATOR);

        this.moderators(address).create();

        sendPayment({
            sender: sender.address,
            receiver: this.app.address,
            amount: moderatorsMBR,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }

    removeModerator(sender: AppID, rekeyBack: boolean, address: Address): void {
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(this.isDAO(sender.address), errs.NOT_DAO);
        assert(this.moderators(address).exists, errs.NOT_A_MODERATOR);

        this.moderators(address).delete();

        sendPayment({
            receiver: sender.address,
            amount: moderatorsMBR,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }

    ban(sender: AppID, rekeyBack: boolean, address: Address, expiration: uint64): void {
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(this.moderators(sender.address).exists, errs.NOT_A_MODERATOR);
        assert(!this.banned(address).exists, errs.ALREADY_BANNED);
        this.banned(address).value = expiration;

        if (rekeyBack) {
            this.rekeyBack(sender.address);
        }
    }

    flagPost(sender: AppID, rekeyBack: boolean, ref: bytes32): void {
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(this.moderators(sender.address).exists, errs.NOT_A_MODERATOR);
        assert(this.posts(ref).exists, errs.POST_NOT_FOUND);
        const post = this.posts(ref).value;
        assert(!post.againstContentPolicy, errs.ALREADY_FLAGGED);

        this.posts(ref).value.againstContentPolicy = true;

        if (rekeyBack) {
            this.rekeyBack(sender.address);
        }
    }

    unban(sender: AppID, rekeyBack: boolean, address: Address): void {
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(this.moderators(sender.address).exists, errs.NOT_A_MODERATOR);
        this.banned(address).delete();

        if (rekeyBack) {
            this.rekeyBack(sender.address);
        }
    }

    addAction(sender: AppID, rekeyBack: boolean, actionAppID: AppID, content: bytes<59>) {
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(this.isDAO(sender.address), errs.NOT_DAO);
        assert(!this.actions(actionAppID).exists, errs.ALREADY_AN_ACTION);

        this.actions(actionAppID).value = { content: content };

        sendPayment({
            sender: sender.address,
            receiver: this.app.address,
            amount: actionsMBR,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }

    removeAction(sender: AppID, rekeyBack: boolean, actionAppID: AppID) {
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(this.isDAO(sender.address), errs.NOT_DAO);
        assert(this.actions(actionAppID).exists, errs.ALREADY_AN_ACTION);

        this.actions(actionAppID).delete();

        sendPayment({
            receiver: sender.address,
            amount: actionsMBR,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }

    // -------------------------------------------------------------
    // meta methods ------------------------------------------------
    // -------------------------------------------------------------

    initMeta(
        sender: AppID,
        rekeyBack: boolean,
        automated: boolean,
        subscriptionIndex: uint64,
        NFD: AppID,
        akitaNFT: AssetID
    ): uint64 {
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(!this.meta(sender.address).exists, errs.META_ALREADY_EXISTS);

        if (automated) {
            this.meta(sender.address).value = {
                walletAppID: sender,
                streak: 1,
                startDate: globals.latestTimestamp,
                lastActive: globals.latestTimestamp,
                followerIndex: 0,
                followerCount: 0,
                automated: true,
                followGateID: 0,
                addressGateID: 0,
            };

            sendMethodCall<typeof AkitaSocialImpact.prototype.cacheMeta, uint64>({
                sender: sender.address,
                applicationID: AppID.fromUint64(AkitaAppIDsAkitaSocialImpactPlugin),
                methodArgs: [
                    0,
                    AppID.fromUint64(0),
                    AssetID.fromUint64(0),
                ],
                fee: 0
            });

            return 0;
        }

        this.meta(sender.address).value = {
            walletAppID: sender,
            streak: 1,
            startDate: globals.latestTimestamp,
            lastActive: globals.latestTimestamp,
            followerIndex: 0,
            followerCount: 0,
            automated: false,
            followGateID: 0,
            addressGateID: 0,
        };

        const impact = sendMethodCall<typeof AkitaSocialImpact.prototype.cacheMeta, uint64>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsAkitaSocialImpactPlugin),
            methodArgs: [
                subscriptionIndex,
                NFD,
                akitaNFT,
            ],
            fee: 0
        });

        if (rekeyBack) {
            this.rekeyBack(sender.address);
        }

        return impact + this.getSocialImpactScore(sender.address);
    }

    // -------------------------------------------------------------
    // read methods ------------------------------------------------
    // -------------------------------------------------------------

    @abi.readonly
    getUserSocialImpact(user: Address): uint64 {
        return this.getSocialImpactScore(user);
    }

    @abi.readonly
    isFollower(user: Address, index: uint64, follower: Address): boolean {
        return this.follows({ user: user, index: index }).value === follower;
    }

    @abi.readonly
    getMeta(user: Address): MetaValue {
        return this.meta(user).value;
    }
}