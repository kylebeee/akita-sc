import { Contract } from '@algorandfoundation/tealscript';
import { OptInPlugin } from './optin.algo';
import { AbstractedAccount } from '../abstracted_account.algo';
import { StakeValue, StakingPlugin } from './staking.algo';
import { SubscriptionPlugin } from './subscription.algo';
import { Gate } from '../../gates/gate.algo';
import { arc59GetSendAssetInfoResponse, AssetInbox } from '../../../utils/types/asset_inbox';
import {
    AkitaAppIDsDAO,
    AkitaAppIDsGate,
    AkitaAppIDsOptinPlugin,
    AkitaAppIDsStakingPlugin,
    AkitaAppIDsSubscriptionPlugin,
    AkitaAssetAkita,
    AkitaCollectionsPrefixAKC,
    AkitaCollectionsPrefixAOG,
    bytes0,
    bytes24,
    bytes59,
    EMPTY_BYTES_32,
    EMPTY_BYTES_59,
    OtherAppIDsAkitaRootNFD,
    OtherAppIDsAssetInbox,
    OtherAppIDsNFDRegistry
} from '../../../utils/constants';

const errs = {
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
    DOES_NOT_PASS_GATE: 'Gate check failed to pass'
};

const ONE_MILLION_AKITA = 1_000_000_000_000;
const TWO_HUNDRED_THOUSAND_AKITA = 200_000_000_000;
const TEN_THOUSAND_AKITA = 10_000_000_000;

const MAX_TAX = 20
const MIN_TAX = 1

const NFD_NAME_KEY = 'i.name';
const NFD_TIME_CHANGED_KEY = 'i.timeChanged';

const ONE_DAY = 86400;
const THIRTY_DAYS = 2_592_000;
const ONE_YEAR = 31_536_000

// TODO: post / react fees set from the DAO
export const POST_FEE = 100_000_000;
export const REACT_FEE = 10_000_000;

export type FollowsKey = {
    user: Address;
    index: uint64;
}

export type BlockListKey = {
    user: bytes24;
    blocked: bytes24;
}

export type PostValue = {
    // the txn / assetID / AppID / Address referenced
    ref: bytes32;
    // the IPFS cid pointing to the content
    cid: bytes59;
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
}

export type VotesValue = {
    voteCount: uint64;
    isNegative: boolean;
}

export type VoteListKey = {
    user: bytes24;
    ref: bytes24;
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
    user: bytes24;
    ref: bytes24;
    NFT: AssetID;
}

export type Action = {
    content: bytes59;
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
    // the cached subscription App ID for the user
    subscriptionIndex: uint64;
    // the cached NFD for the user
    NFD: AppID;
    // the last time the NFD was updated and cached against this contract
    nfdTimeChanged: uint64;
    // the impact score from the cached NFD
    nfdImpact: uint64;
    // the cached akita NFT the user has
    akitaNFT: AssetID;
    // the follower count index of the user
    followerIndex: uint64;
    // the follower count of the user
    followerCount: uint64;
    // whether the account is automated
    automated: boolean;
    // who's allowed to follow you using gates
    followFilterIndex: uint64;
    // who's allowed to post on your wall using gates
    addressFilterIndex: uint64;
}

export class AkitaSocialPlugin extends Contract {
    programVersion = 10;

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
    blocks = BoxMap<BlockListKey, bytes0>({ prefix: 'b', allowPotentialCollisions: true });

    /**
     * A map of all the posts on the network
     * 
     * key: the reference id
     * key_length: 1 + 32: 33
     * 
     * value: the post data
     * value_length: 181
     * 
     * cost: 2_500 + (400 * (33 + 181)) = 88_100
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
    votes = BoxMap<bytes32, VotesValue>({ prefix: 'v', allowPotentialCollisions: true });

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
    votelist = BoxMap<VoteListKey, VoteListValue>({ prefix: 'v', allowPotentialCollisions: true });

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
     * cost: 2_500 + (400 * (56)) = 24_900
     */
    reactionlist = BoxMap<ReactionListKey, bytes0>();

    /**
     * A map of the meta data for each user
     * 
     * key: the address of the user
     * key_length: 32
     * 
     * value: the meta data for the user
     * value_length: 105
     * 
     * cost: 2_500 + (400 * (32 + 105)) = 57_300
     */
    meta = BoxMap<Address, MetaValue>({ allowPotentialCollisions: true });

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
    moderators = BoxMap<Address, bytes0>({ prefix: 'm' });

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
    banned = BoxMap<Address, uint64>({ prefix: 'b', allowPotentialCollisions: true });

    /** 
     * A map of how each akita subscription affects impact calculation
     * 
     * key: index of the subscription
     * key_length: 1 + 8: 9
     * 
     * value: the modifier for the impact calculation 
     * value_length: 8
     * 
     * cost: 2_500 + (400 * (9 + 8)) = 9_300
     */
    subscriptionStateModifier = BoxMap<uint64, uint64>({ prefix: 's' });

    /**
     * the gates usable on an akita post
     * 
     * key: the index of the gate
     * key_length: 1 + 8: 9
     * 
     * value: the application ID of the gate
     * value_length: 8
     * 
     * cost: 2_500 + (400 * 9) = 9_300
     */
    gates = BoxMap<AppID, bytes0>({ prefix: 'g' });

    /**
     * the actions usable on an akita post
     * 
     * key: the index of the action
     * key_length: 1 + 8: 9
     * 
     * value: the action data
     * value_length: 65
     * 
     * cost: 2_500 + (400 * (9 + 65)) = 28_600
    */
    actions = BoxMap<AppID, Action>({ prefix: 'a' });

    // -------------------------------------------------------------
    // misc private methods ----------------------------------------
    // -------------------------------------------------------------

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
        const userSplice = extract3(user, 0, 24) as bytes24;
        const blockedSplice = extract3(blocked, 0, 24) as bytes24;
        return this.blocks({ user: userSplice, blocked: blockedSplice }).exists;
    }

    private gate(filterIndex: uint64, args: bytes[]): boolean {
        return sendMethodCall<typeof Gate.prototype.check, boolean>({
            applicationID: AppID.fromUint64(AkitaAppIDsGate),
            methodArgs: [
                filterIndex,
                args,
            ],
            fee: 0
        });
    }

    private isSubscribed(address: Address, index: uint64): { active: boolean, index: uint64, streak: uint64 } {
        const info = sendMethodCall<typeof SubscriptionPlugin.prototype.getSubsriptionInfo>({
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptionPlugin),
            methodArgs: [address, index],
            fee: 0,
        });

        // ensure they're subscribed to an Akita offering
        // TODO: replace this with the real Akita Subscription Receiver Address
        const toAkita = info.recipient === addr('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ');

        // box index zero is reserved for donations
        // if its higher than zero then they're subscribed to an offer
        const notDonating = info.index !== 0;

        const lastWindowStart = globals.latestTimestamp - (
            ((globals.latestTimestamp - info.startDate) % info.interval) + info.interval
        );

        // this doesn't tell us about the consistency of their payments,
        // only that their subscription isn't currently stale
        const notStale = info.lastPayment > lastWindowStart;

        return { active: (toAkita && notDonating && notStale), index: info.index, streak: info.streak };
    }

    private isNFD(NFD: AppID): boolean {
        const nfdName = NFD.globalState(NFD_NAME_KEY) as bytes;

        sendAppCall({
            applicationID: AppID.fromUint64(OtherAppIDsNFDRegistry),
            applicationArgs: [
                'is_valid_nfd_appid',
                nfdName,
                itob(NFD.id),
            ],
            applications: [NFD],
            fee: 0,
        });

        return btoi(this.itxn.lastLog) !== 0;
    }

    private isAkitaNFT(akitaNFT: AssetID): boolean {
        return akitaNFT.creator === addr('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ');
    }

    private userHolds(address: Address, NFT: AssetID): boolean {
        return address.assetBalance(NFT) > 0;
    }

    // iterates over an NFD contracts verified addresses to check if the given address exists in the list
    private addressVerifiedOnNFD(address: Address, NFD: AppID): boolean {

        sendAppCall({
            applicationID: NFD,
            applicationArgs: ['read_property', 'v.caAlgo.0.as'],
            fee: 0,
        });

        const caAlgoData = this.itxn.lastLog;

        for (let i = 0; i < caAlgoData.length; i += 32) {
            const addr = extract3(caAlgoData, i, 32);
            if (addr !== rawBytes(globals.zeroAddress) && addr === rawBytes(address)) {
                return true;
            }
        }

        return false;
    }

    // -------------------------------------------------------------
    // impact private methods --------------------------------------
    // -------------------------------------------------------------

    private userImpact(address: Address): uint64 {
        const meta = this.meta(address).value;

        const stakedAktaImpact = this.getStakingImpactScore(address); // Staked AKTA | up to 250
        const subscriberImpact = this.getSubscriberImpactScore(address, meta.subscriptionIndex); // Akita Subscriber | up to 250
        const socialImpact = this.getSocialImpactScore(address); // Social Activity | up to 250
        const nfdScore = this.getNFDImpactScore(address, meta.NFD); // NFD | up to 150
        const heldAkitaImpact = this.getHeldAktaImpactScore(address); // Held AKTA | up to 50
        const nftImpact = this.getNFTImpactScore(address, meta.akitaNFT); // Holds AKC/Omnigem | 50

        const total = stakedAktaImpact + subscriberImpact + socialImpact + nfdScore + heldAkitaImpact + nftImpact
        if (total === 0) {
            return 1
        }

        return total;
    }

    private getStakingImpactScore(address: Address): uint64 {
        // - Staked AKTA | up to 250
        const info = sendMethodCall<typeof StakingPlugin.prototype.getInfo, StakeValue>({
            applicationID: AppID.fromUint64(AkitaAppIDsStakingPlugin),
            methodArgs: [
                address,
                {
                    asset: AssetID.fromUint64(AkitaAssetAkita),
                    locked: false,
                },
            ],
            fee: 0,
        });

        const elapsed = globals.latestTimestamp - info.lastUpdate;

        // if the amount staked is too low or not much time has passed short circuit
        if (info.amount < TEN_THOUSAND_AKITA || elapsed < THIRTY_DAYS) {
            return 0;
        }

        // Calculate score based on time elapsed, capped by amount staked
        const amtCapped = info.amount >= TWO_HUNDRED_THOUSAND_AKITA ? TWO_HUNDRED_THOUSAND_AKITA : info.amount;

        // Calculate the maximum possible score based on the staked amount
        const maxScore = (amtCapped * 250) / TWO_HUNDRED_THOUSAND_AKITA;

        // Calculate the actual score based on time elapsed, capped by maxScore
        const timeCapped = elapsed >= ONE_YEAR ? ONE_YEAR : elapsed;

        return (timeCapped * maxScore) / ONE_YEAR;
    }

    private getHeldAktaImpactScore(address: Address): uint64 {
        const amount = address.assetBalance(AkitaAssetAkita);

        // if the amount is too low short circuit
        if (amount < TEN_THOUSAND_AKITA) {
            return 0;
        }

        const capped = amount >= ONE_MILLION_AKITA ? ONE_MILLION_AKITA : amount;
        return (capped * 50) / ONE_MILLION_AKITA;
    }

    private getSubscriberImpactScore(address: Address, subscriptionIndex: uint64): uint64 {
        let subscriberImpact = 0;

        const subscriptionState = this.isSubscribed(address, subscriptionIndex);

        if (!subscriptionState.active) {
            return subscriberImpact;
        }

        const modifier = this.subscriptionStateModifier(subscriptionState.index).value;

        // the streak will be up to date because we check for staleness in isSubscribed
        if (subscriptionState.streak >= 12) {
            subscriberImpact += (250 / modifier)
        } else {
            subscriberImpact += (subscriptionState.streak * 20) / modifier;
        }

        return subscriberImpact;
    }

    private calcNFDImpactScore(NFD: AppID): uint64 {
        // base | 50
        let nfdImpact = 50;

        if (
            NFD.globalStateExists('i.parentAppID')
            && btoi(NFD.globalState('i.parentAppID') as bytes) === AppID.fromUint64(OtherAppIDsAkitaRootNFD).id
        ) {
            nfdImpact += 50;
        }

        let hasVerifiedDomain = false;
        let hasVerifiedTwitter = false;
        let hasVerifiedDiscord = false;
        let hasVerifiedTelegram = false;
        const version = extract3((NFD.globalState('i.ver') as bytes), 0, 2);

        if (version === '1.') {
            hasVerifiedDomain = NFD.globalStateExists('v.domain');
            hasVerifiedTwitter = NFD.globalStateExists('v.twitter');
            hasVerifiedDiscord = NFD.globalStateExists('v.discord');
            hasVerifiedTelegram = NFD.globalStateExists('v.telegram');
        } else {
            sendAppCall({
                applicationID: NFD,
                applicationArgs: ['read_property', 'v.domain'],
                fee: 0,
            })
            hasVerifiedDomain = this.itxn.lastLog !== '';

            sendAppCall({
                applicationID: NFD,
                applicationArgs: ['read_property', 'v.twitter'],
                fee: 0,
            })
            hasVerifiedTwitter = this.itxn.lastLog !== '';

            sendAppCall({
                applicationID: NFD,
                applicationArgs: ['read_property', 'v.discord'],
                fee: 0,
            })
            hasVerifiedDiscord = this.itxn.lastLog !== '';

            sendAppCall({
                applicationID: NFD,
                applicationArgs: ['read_property', 'v.telegram'],
                fee: 0,
            })
            hasVerifiedTelegram = this.itxn.lastLog !== '';
        }

        // website | 10
        if (hasVerifiedDomain) {
            nfdImpact += 10;
        }
        // twitter | 20
        if (hasVerifiedTwitter) {
            nfdImpact += 20;
        }
        // discord | 10
        if (hasVerifiedDiscord) {
            nfdImpact += 10;
        }
        // telegram | 10
        if (hasVerifiedTelegram) {
            nfdImpact += 10;
        }

        return nfdImpact;
    }

    private getNFDImpactScore(address: Address, NFD: AppID): uint64 {
        const meta = this.meta(address).value;
        const timeChanged = btoi(meta.NFD.globalState(NFD_TIME_CHANGED_KEY) as bytes);

        assert(NFD.id === meta.NFD.id, errs.INVALID_NFD);
        assert(meta.nfdTimeChanged === timeChanged, errs.NFD_CHANGED);

        return meta.nfdImpact;
    }

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
        const twoYearsInSeconds = 63072000 // 2 years in seconds

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

    private getNFTImpactScore(address: Address, asa: AssetID): uint64 {
        const prefix = extract3(asa.unitName, 0, 3)
        if (asa.creator === addr('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ') && address.assetBalance(asa) > 0) {
            if (prefix === AkitaCollectionsPrefixAKC) {
                return 50;
            }
            if (prefix === AkitaCollectionsPrefixAOG) {
                return 25;
            }
        }
        return 0;
    }

    // -------------------------------------------------------------
    // payment private methods -------------------------------------
    // -------------------------------------------------------------

    private getTax(impact: uint64): uint64 {
        const taxRate = MAX_TAX - ((MAX_TAX - MIN_TAX) * (impact - 1)) / 999
        return (REACT_FEE * taxRate - 1) / 1001
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
                AppID.fromUint64(AkitaAppIDsOptinPlugin)
            ],
            fee: 0,
        });

        this.pendingGroup.addMethodCall<typeof OptInPlugin.prototype.optInToAsset, void>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsOptinPlugin),
            methodArgs: [
                recipientAppID,
                true,
                AssetID.fromUint64(AkitaAssetAkita),
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
            assetReceiver: AppID.fromUint64(AkitaAppIDsDAO).address,
            assetAmount: tax,
            xferAsset: AssetID.fromUint64(AkitaAssetAkita),
            fee: 0,
        });

        if (rekeyBack) {
            this.pendingGroup.addAssetTransfer({
                sender: sender.address,
                assetReceiver: recipientAppID.address,
                assetAmount: (REACT_FEE - tax),
                xferAsset: AssetID.fromUint64(AkitaAssetAkita),
                rekeyTo: sender.address,
                fee: 0,
            });
        } else {
            this.pendingGroup.addAssetTransfer({
                sender: sender.address,
                assetReceiver: recipientAppID.address,
                assetAmount: (REACT_FEE - tax),
                xferAsset: AssetID.fromUint64(AkitaAssetAkita),
                fee: 0,
            });
        }

        this.pendingGroup.submit();
    }

    private arc59OptInAndSendReactionPayments(sender: AppID, rekeyBack: boolean, recipientAppID: AppID, tax: uint64): void {
        const canCallData = sendMethodCall<typeof AssetInbox.prototype.arc59_getSendAssetInfo, arc59GetSendAssetInfoResponse>({
            applicationID: AppID.fromUint64(OtherAppIDsAssetInbox),
            methodArgs: [
                recipientAppID.address,
                AssetID.fromUint64(AkitaAssetAkita).id,
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
            });
        }

        if (!routerOptedIn) {
            this.pendingGroup.addMethodCall<typeof AssetInbox.prototype.arc59_optRouterIn, void>({
                sender: sender.address,
                applicationID: AppID.fromUint64(OtherAppIDsAssetInbox),
                methodArgs: [AssetID.fromUint64(AkitaAssetAkita).id],
                fee: 0
            });
        }

        this.pendingGroup.addAssetTransfer({
            sender: sender.address,
            assetReceiver: AppID.fromUint64(AkitaAppIDsDAO).address,
            assetAmount: tax,
            xferAsset: AssetID.fromUint64(AkitaAssetAkita),
            fee: 0,
        });

        if (rekeyBack) {
            this.pendingGroup.addMethodCall<typeof AssetInbox.prototype.arc59_sendAsset, Address>({
                sender: sender.address,
                applicationID: AppID.fromUint64(OtherAppIDsAssetInbox),
                methodArgs: [
                    {
                        sender: sender.address,
                        assetReceiver: AppID.fromUint64(OtherAppIDsAssetInbox).address,
                        assetAmount: (REACT_FEE - tax),
                        xferAsset: AssetID.fromUint64(AkitaAssetAkita),
                        fee: 0,
                    },
                    recipientAppID.address,
                    receiverAlgoNeededForClaim,
                ],
                rekeyTo: sender.address,
                fee: 0
            });
        } else {
            this.pendingGroup.addMethodCall<typeof AssetInbox.prototype.arc59_sendAsset, Address>({
                sender: sender.address,
                applicationID: AppID.fromUint64(OtherAppIDsAssetInbox),
                methodArgs: [
                    {
                        sender: sender.address,
                        assetReceiver: AppID.fromUint64(OtherAppIDsAssetInbox).address,
                        assetAmount: (REACT_FEE - tax),
                        xferAsset: AssetID.fromUint64(AkitaAssetAkita),
                        fee: 0,
                    },
                    recipientAppID.address,
                    receiverAlgoNeededForClaim,
                ],
                fee: 0
            });
        }

        this.pendingGroup.submit();
    }

    private sendReactionPayments(sender: AppID, rekeyBack: boolean, recipientAddress: Address, tax: uint64): void {
        this.pendingGroup.addAssetTransfer({
            sender: sender.address,
            assetReceiver: AppID.fromUint64(AkitaAppIDsDAO).address,
            assetAmount: tax,
            xferAsset: AssetID.fromUint64(AkitaAssetAkita),
            fee: 0,
        });

        if (rekeyBack) {
            this.pendingGroup.addAssetTransfer({
                sender: sender.address,
                assetReceiver: recipientAddress,
                assetAmount: (REACT_FEE - tax),
                xferAsset: AssetID.fromUint64(AkitaAssetAkita),
                rekeyTo: sender.address,
                fee: 0,
            });
        } else {
            this.pendingGroup.addAssetTransfer({
                sender: sender.address,
                assetReceiver: recipientAddress,
                assetAmount: (REACT_FEE - tax),
                xferAsset: AssetID.fromUint64(AkitaAssetAkita),
                fee: 0,
            });
        }

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
        cid: bytes59,
        collectible: boolean,
        replyGateIndex: uint64,
        reactGateIndex: uint64,
        isAmendment: boolean,
    ): void {
        assert(!this.isBanned(sender.address), errs.BANNED);

        // update streak before we measure impact
        // this way we guarantee the box exists
        this.updateStreak(sender.address);

        const impact = this.userImpact(sender.address);

        if (rekeyBack) {
            sendAssetTransfer({
                sender: sender.address,
                assetReceiver: AppID.fromUint64(AkitaAppIDsDAO).address,
                assetAmount: POST_FEE,
                xferAsset: AssetID.fromUint64(AkitaAssetAkita),
                rekeyTo: sender.address,
                fee: 0,
            });
        } else {
            sendAssetTransfer({
                sender: sender.address,
                assetReceiver: AppID.fromUint64(AkitaAppIDsDAO).address,
                assetAmount: POST_FEE,
                xferAsset: AssetID.fromUint64(AkitaAssetAkita),
                fee: 0,
            });
        }

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
        };

        this.posts(postID).value = post;
        this.updateVotes(postID, true, impact);
        const voteListKey: VoteListKey = {
            user: extract3(sender.address, 0, 24) as bytes24,
            ref: extract3(postID, 0, 24) as bytes24,
        };
        this.votelist(voteListKey).value = { impact: impact, isUp: true };
    }

    private createReply(
        sender: AppID,
        rekeyBack: boolean,
        cid: bytes59,
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
            assert(this.gate(post.replyGateIndex, args), errs.DOES_NOT_PASS_GATE);
        }

        // update streak before we measure impact
        // this way we guarantee the box exists
        this.updateStreak(sender.address);
        
        const creatorMeta = this.meta(post.creator).value;
        const postCreatorImpact = this.userImpact(post.creator);
        const tax = this.getTax(postCreatorImpact);

        if (!post.creator.isOptedInToAsset(AkitaAssetAkita)) {
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
        };

        this.posts(replyPostID).value = replyPost;

        const senderImpact = this.userImpact(sender.address);
        this.updateVotes(replyPostID, true, senderImpact);
        const voteListKey: VoteListKey = {
            user: extract3(sender.address, 0, 24) as bytes24,
            ref: extract3(replyPostID, 0, 24) as bytes24,
        };
        this.votelist(voteListKey).value = { impact: senderImpact, isUp: true };
    }

    private createVote(sender: AppID, rekeyBack: boolean, ref: bytes32, isUp: boolean): void {
        assert(!this.isBanned(sender.address), errs.BANNED);
        assert(this.posts(ref).exists, errs.POST_NOT_FOUND);

        const post = this.posts(ref).value;
        assert(!this.isBlocked(post.creator, sender.address), errs.BLOCKED);
        const voteListKey: VoteListKey = {
            user: extract3(sender.address, 0, 24) as bytes24,
            ref: extract3(ref, 0, 24) as bytes24,
        };
        assert(!this.votelist(voteListKey).exists, errs.ALREADY_VOTED);
        assert(sender.address !== post.creator, errs.NO_SELF_VOTE);

        const senderIsAutomated = this.meta(sender.address).value.automated;
        assert(!senderIsAutomated, errs.AUTOMATED_ACCOUNT);

        // update streak before we measure impact
        // this way we guarantee the box exists
        this.updateStreak(sender.address);

        if (isUp) {
            const creatorMeta = this.meta(post.creator).value;
            // calls a transaction
            const recipientImpact = this.userImpact(post.creator);
            const tax = this.getTax(recipientImpact);

            if (!post.creator.isOptedInToAsset(AkitaAssetAkita)) {
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
        } else if (rekeyBack) {
            sendAssetTransfer({
                sender: sender.address,
                assetReceiver: AppID.fromUint64(AkitaAppIDsDAO).address,
                assetAmount: REACT_FEE,
                xferAsset: AssetID.fromUint64(AkitaAssetAkita),
                rekeyTo: sender.address,
                fee: 0,
            });
        } else {
            sendAssetTransfer({
                sender: sender.address,
                assetReceiver: AppID.fromUint64(AkitaAppIDsDAO).address,
                assetAmount: REACT_FEE,
                xferAsset: AssetID.fromUint64(AkitaAssetAkita),
                fee: 0,
            });
        }

        // calls a transaction
        const senderImpact = this.userImpact(sender.address);
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
            assert(this.gate(post.reactGateIndex, args), errs.DOES_NOT_PASS_GATE);
        }

        const reactionListKey: ReactionListKey = {
            user: rawBytes(sender).substring(0, 24) as bytes24,
            ref: rawBytes(ref).substring(0, 24) as bytes24,
            NFT: NFT
        };

        assert(!this.reactionlist(reactionListKey).exists, errs.ALREADY_REACTED);

        // update streak before we measure impact
        // this way we guarantee the box exists
        this.updateStreak(sender.address);

        const creatorMeta = this.meta(post.creator).value;
        const recipientImpact = this.userImpact(post.creator);
        const tax = this.getTax(recipientImpact);

        if (!post.creator.isOptedInToAsset(AkitaAssetAkita)) {
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
    // content methods ---------------------------------------------
    // -------------------------------------------------------------

    post(
        sender: AppID,
        rekeyBack: boolean,
        cid: bytes59,
        collectible: boolean,
        replyGateIndex: uint64,
        reactGateIndex: uint64,
    ): void {
        this.createPost(sender, rekeyBack, cid, collectible, replyGateIndex, reactGateIndex, false);
    }

    editPost(
        sender: AppID,
        rekeyBack: boolean,
        cid: bytes59,
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
            reactGateIndex: post.reactGateIndex
        };

        this.createPost(sender, rekeyBack, cid, collectible, replyGateIndex, reactGateIndex, true);
    }

    replyPost(
        sender: AppID,
        rekeyBack: boolean,
        cid: bytes59,
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
        cid: bytes59,
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
        cid: bytes59,
        ref: Address,
        collectible: boolean,
        replyGateIndex: uint64,
        reactGateIndex: uint64,
        args: bytes[],
        rekeyBack: boolean,
    ): void {

        if (this.meta(ref).exists) {
            const meta = this.meta(ref).value;

            if (meta.addressFilterIndex !== 0) {
                assert(this.gate(meta.addressFilterIndex, args), errs.DOES_NOT_PASS_GATE);
            }
        }

        const r = rawBytes(ref) as bytes32;
        this.createEmptyPostIfNecessary(r, ref);
        this.createReply(sender, rekeyBack, cid, r, collectible, replyGateIndex, reactGateIndex, [], false);
    }

    replyApp(
        sender: AppID,
        cid: bytes59,
        ref: AppID,
        collectible: boolean,
        replyGateIndex: uint64,
        reactGateIndex: uint64,
        rekeyBack: boolean,
    ): void {
        assert(ref.id !== 0, errs.INVALID_APP)
        const paddedRef = itob(ref.id) as bytes32;
        this.createEmptyPostIfNecessary(paddedRef, ref.creator);
        this.createReply(sender, rekeyBack, cid, paddedRef, collectible, replyGateIndex, reactGateIndex, [], false);
    }

    editReply(
        sender: AppID,
        cid: bytes59,
        collectible: boolean,
        replyGateIndex: uint64,
        reactGateIndex: uint64,
        args: bytes[],
        amendment: bytes32,
        rekeyBack: boolean,
    ): void {
        assert(this.posts(amendment).exists, errs.REPLY_NOT_FOUND);
        const post = this.posts(amendment).value;
        assert(post.creator === sender.address, errs.NOT_YOUR_POST_TO_EDIT);
        assert(post.ref !== EMPTY_BYTES_32, errs.NOT_A_REPLY);
        this.posts(amendment).value.amendment = this.txn.txID;
        this.createReply(sender, rekeyBack, cid, post.ref, collectible, replyGateIndex, reactGateIndex, args, true);
    }

    votePost(sender: AppID, rekeyBack: boolean, ref: bytes32, isUp: boolean, ): void {
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
            user: extract3(sender.address, 0, 24) as bytes24,
            ref: extract3(ref, 0, 24) as bytes24,
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

            if (meta.addressFilterIndex !== 0) {
                assert(this.gate(meta.addressFilterIndex, args), errs.DOES_NOT_PASS_GATE);
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
            user: rawBytes(sender.address).substring(0, 24) as bytes24,
            ref: rawBytes(ref).substring(0, 24) as bytes24,
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

        if (meta.followFilterIndex !== 0) {
            assert(this.gate(meta.followFilterIndex, args), errs.DOES_NOT_PASS_GATE);
        }

        const followerIndex = meta.followerIndex;
        this.follows({ user: address, index: (followerIndex + 1) }).value = sender.address;
        this.meta(address).value.followerIndex += 1;
        this.meta(address).value.followerCount += 1;

        if (rekeyBack) {
            this.rekeyBack(sender.address);
        }
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
            user: extract3(sender.address, 0, 24) as bytes24,
            blocked: extract3(address, 0, 24) as bytes24,
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
            user: extract3(sender.address, 0, 24) as bytes24,
            blocked: extract3(address, 0, 24) as bytes24,
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
        // TODO: 
    }

    removeModerator(sender: AppID, rekeyBack: boolean, address: Address): void {
        // TODO: 
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

    unban(sender: AppID, rekeyBack: boolean, address: Address): void {
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(this.moderators(sender.address).exists, errs.NOT_A_MODERATOR);
        this.banned(address).delete();

        if (rekeyBack) {
            this.rekeyBack(sender.address);
        }
    }

    addGate() {
        // TODO:
    }

    removeGate() {
        // TODO:
    }

    addAction() {
        // TODO:
    }

    removeAction() {
        // TODO:
    }

    // -------------------------------------------------------------
    // meta methods ------------------------------------------------
    // -------------------------------------------------------------

    cacheMeta(sender: AppID, rekeyBack: boolean, automated: boolean, subscriptionIndex: uint64, NFD: AppID, akitaNFT: AssetID): uint64 {
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        if (!this.meta(sender.address).exists) {
            if (automated) {
                this.meta(sender.address).value = {
                    walletAppID: sender,
                    streak: 1,
                    startDate: globals.latestTimestamp,
                    lastActive: globals.latestTimestamp,
                    subscriptionIndex: 0,
                    NFD: AppID.fromUint64(0),
                    nfdTimeChanged: 0,
                    nfdImpact: 0,
                    akitaNFT: AssetID.fromUint64(0),
                    followerIndex: 0,
                    followerCount: 0,
                    automated: true,
                    followFilterIndex: 0,
                    addressFilterIndex: 0,
                };
                return 0;
            }
        } else {
            assert(!this.meta(sender.address).value.automated, errs.AUTOMATED_ACCOUNT);
        }

        if (subscriptionIndex !== 0) {
            assert(this.isSubscribed(sender.address, subscriptionIndex).active, errs.NOT_A_SUBSCRIPTION);
        }

        let nfdTimeChanged: uint64 = 0;
        let nfdImpact: uint64 = 0;
        if (NFD.id !== 0) {
            assert(this.isNFD(NFD), errs.NOT_AN_NFD);
            assert(this.addressVerifiedOnNFD(sender.address, NFD), errs.USER_DOES_NOT_OWN_NFD);
            nfdTimeChanged = btoi(NFD.globalState(NFD_TIME_CHANGED_KEY) as bytes);
            nfdImpact = this.calcNFDImpactScore(NFD);
        }

        if (akitaNFT.id !== 0) {
            assert(this.isAkitaNFT(akitaNFT), errs.NOT_AN_AKITA_NFT);
            assert(this.userHolds(sender.address, akitaNFT), errs.USER_DOES_NOT_OWN_NFT);
        }

        if (!this.meta(sender.address).exists) {
            this.meta(sender.address).value = {
                walletAppID: sender,
                streak: 1,
                startDate: globals.latestTimestamp,
                lastActive: globals.latestTimestamp,
                subscriptionIndex: subscriptionIndex,
                NFD: NFD,
                nfdTimeChanged: nfdTimeChanged,
                nfdImpact: nfdImpact,
                akitaNFT: akitaNFT,
                followerIndex: 0,
                followerCount: 0,
                automated: false,
                followFilterIndex: 0,
                addressFilterIndex: 0,
            };
        } else {
            const meta = clone(this.meta(sender.address).value);

            meta.subscriptionIndex = subscriptionIndex;
            meta.NFD = NFD;
            meta.nfdTimeChanged = nfdTimeChanged;
            meta.nfdImpact = nfdImpact;
            meta.akitaNFT = akitaNFT;

            this.meta(sender.address).value = meta;
        }

        if (rekeyBack) {
            this.rekeyBack(sender.address);
        }

        return nfdImpact;
    }

    updateSubscriptionStateModifier(subscriptionIndex: uint64, newModifier: uint64): void {
        // assert that the call is from the dao contract
        this.subscriptionStateModifier(subscriptionIndex).value = newModifier;
    }

    // -------------------------------------------------------------
    // read methods ------------------------------------------------
    // -------------------------------------------------------------

    @abi.readonly
    getUserImpact(address: Address): uint64 {
        return this.userImpact(address);
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