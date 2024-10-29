import { Contract } from '@algorandfoundation/tealscript';
import { OptInPlugin } from './optin.algo';
import { AbstractedAccount } from '../abstracted_account.algo';
import { StakeValue, StakingPlugin } from './staking.algo';
import { SubscriptionPlugin } from './subscription.algo';
import { Gate } from '../../gates/gate.algo';

type bytes59 = bytes<59>;

type bytes24 = bytes<24>;

const GATE_APP_ID = 0;

const NFD_REGISTRY_ID = 0
const NFD_REGISTRY_ADDRESS = addr('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ');

const AKITA_NFD_APP_ID = 0;

const AKITA_ASSET_ID = 523683256; // MAINNET ID

const ONE_MILLION_AKITA = 1_000_000_000_000;
const TWO_HUNDRED_THOUSAND_AKITA = 200_000_000_000;
const TEN_THOUSAND_AKITA = 10_000_000_000;

const AKITA_SOCIAL_TREASURY = addr('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ');
const AKC_CREATOR_ADDRESS = addr('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ');

const SUBSCRIPTION_PLUGIN_APP_ID = 0;
const AKITA_SUBSCRIPTION_RECEIVER_ADDRESS = addr('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ');

const ARC58_CONTROLLED_ADDRESS_KEY = 'c';

const OPT_IN_PLUGIN_APP_ID = 0;
const ARC59_ROUTER_APP_ID = 0;
const ARC59_ROUTER_APP_ADDRESS = addr('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ');

const POST_FEE = 100_000_000;
const REACT_FEE = 10_000_000;
const COLLECT_FEE = 1000_000_000;

const MAX_TAX = 20
const MIN_TAX = 1

const EMPTY_CID: bytes59 = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' as bytes59;
const EMPTY_BYTES32: bytes32 = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' as bytes32;

const NFD_NAME_KEY = 'i.name';
const NFD_TIME_CHANGED_KEY = 'i.timeChanged';

const TIME_LOCK_PLUGIN_ID = 0;
const TIME_LOCK_PLUGIN_ADDRESS = addr('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ');

const ONE_DAY = 86400;
const THIRTY_DAYS = 2_592_000;
const ONE_YEAR = 31_536_000

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
}

interface FollowsKey {
    user: Address;
    index: uint64;
}

interface BlockListKey {
    user: Address;
    blocked: Address;
}

interface PostValue {
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
    replyFilterIndex: uint64;
    // who's allowed to react using gates
    reactFilterIndex: uint64;
}

interface VotesValue {
    voteCount: uint64;
    isNegative: boolean;
}

interface VoteListKey {
    user: Address;
    ref: bytes32;
}

interface VoteListValue {
    impact: uint64;
    isUp: boolean;
}

interface ReactionsKey {
    ref: bytes32;
    NFT: AssetID;
}

interface ReactionListKey {
    user: bytes24;
    ref: bytes24;
    NFT: AssetID;
}

export interface MetaValue {
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

interface arc59GetSendAssetInfoResponse {
    itxns: uint64;
    mbr: uint64;
    routerOptedIn: boolean;
    receiverOptedIn: boolean;
    receiverAlgoNeededForClaim: uint64;
}

export class AkitaSocialPlugin extends Contract {
    programVersion = 10;

    // -------------------------------------------------------------
    // box maps ----------------------------------------------------
    // -------------------------------------------------------------

    // follows cost: 2_500 + (400 * (41 + 32)) =
    follows = BoxMap<FollowsKey, Address>({ prefix: 'f' });

    // blocks cost: 2_500 + (400 * (64)) = 
    blocks = BoxMap<BlockListKey, bytes<0>>({ allowPotentialCollisions: true });

    // posts contains all the info for
    // payouts, content & amendments
    // posts cost: 2_500 + (400 * (33 + 196)) = 94,100
    posts = BoxMap<bytes32, PostValue>({ prefix: 'p' });

    // votes is a counting field for the votes on a post
    // votes cost: 2_500 + (400 * (33 + 9)) = 18,500
    votes = BoxMap<bytes32, VotesValue>({ prefix: 'v' });

    // votelist exists to trace user vote & impact activity.
    // this way we can easily check for pre-existing votes & 
    // if necessary reverse impact if the user changes their vote
    // votelist cost: 2_500 + (400 * (32 + 32 + 8)) = 31,300
    votelist = BoxMap<VoteListKey, VoteListValue>({ allowPotentialCollisions: true });

    // reactions cost: 2_500 + (400 * (41 + 16))
    reactions = BoxMap<ReactionsKey, uint64>({ prefix: 'r' })

    // reactionlist cost: 2_500 + (400 * (56)) = 
    reactionlist = BoxMap<ReactionListKey, bytes<0>>();

    // meta tracks additional data for the user
    // things like streak, startDate, NFD ref, etc
    // meta costs: 2_500 + (400 * (32 + 80)) = 37,700 & is a one time allocation
    meta = BoxMap<Address, MetaValue>({ allowPotentialCollisions: true });

    // moderators cost: 2_500 + (400 * (33 + 1)) = 13,200
    moderators = BoxMap<Address, bytes<0>>({ prefix: 'm' });

    // banned cost: 2_500 + (400 * (33 + 8)) = 18,500
    banned = BoxMap<Address, uint64>({ prefix: 'b' });

    subscriptionStateModifier = BoxMap<uint64, uint64>();

    // -------------------------------------------------------------
    // misc private methods ----------------------------------------
    // -------------------------------------------------------------

    private controls(address: Address): boolean {
        return address.authAddr === this.app.address;
    }

    private isBanned(address: Address): boolean {
        return this.banned(address).exists && this.banned(address).value > globals.latestTimestamp;
    }

    private isBlocked(user: Address, blocked: Address): boolean {
        return this.blocks({ user: user, blocked: blocked }).exists;
    }

    private gate(filterIndex: uint64, args: bytes[]): boolean {
        return sendMethodCall<typeof Gate.prototype.check, boolean>({
            applicationID: AppID.fromUint64(GATE_APP_ID),
            methodArgs: [
                filterIndex,
                args,
            ]
        })
    }

    private isSubscribed(address: Address, index: uint64): { active: boolean, index: uint64, streak: uint64 } {
        const info = sendMethodCall<typeof SubscriptionPlugin.prototype.getSubsriptionInfo>({
            applicationID: AppID.fromUint64(SUBSCRIPTION_PLUGIN_APP_ID),
            methodArgs: [ address, index ],
            fee: 0,
        });
        
        // ensure they're subscribed to an Akita offering
        const toAkita = info.recipient === AKITA_SUBSCRIPTION_RECEIVER_ADDRESS

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
            applicationID: AppID.fromUint64(NFD_REGISTRY_ID),
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
        return akitaNFT.creator === AKC_CREATOR_ADDRESS;
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
            applicationID: AppID.fromUint64(TIME_LOCK_PLUGIN_ID),
            methodArgs: [
                address,
                {
                    asset: AssetID.fromUint64(AKITA_ASSET_ID),
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
        const amount = address.assetBalance(AKITA_ASSET_ID);

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
            && btoi(NFD.globalState('i.parentAppID') as bytes) === AKITA_NFD_APP_ID
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
        if (asa.creator === AKC_CREATOR_ADDRESS && address.assetBalance(asa) > 0) {
            if (prefix === 'AKC') {
                return 50;
            }
            if (prefix === 'AOG') {
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
                AppID.fromUint64(OPT_IN_PLUGIN_APP_ID),
                sender,
            ],
            fee: 0,
        });
    }

    private arc58OptInAndSendReactionPayments(sender: Address, recipientAppID: AppID, tax: uint64): void {
        const recipientAddress = recipientAppID.globalState(ARC58_CONTROLLED_ADDRESS_KEY) as Address;

        this.pendingGroup.addMethodCall<typeof AbstractedAccount.prototype.arc58_rekeyToPlugin, void>({
            sender: sender,
            applicationID: recipientAppID,
            methodArgs: [
                AppID.fromUint64(OPT_IN_PLUGIN_APP_ID)
            ],
            fee: 0,
        });

        this.pendingGroup.addMethodCall<typeof OptInPlugin.prototype.optInToAsset, void>({
            sender: sender,
            applicationID: AppID.fromUint64(OPT_IN_PLUGIN_APP_ID),
            methodArgs: [
                recipientAddress,
                AssetID.fromUint64(AKITA_ASSET_ID),
                {
                    sender: sender, // sender pays the recipient mbr
                    receiver: recipientAddress,
                    amount: globals.assetOptInMinBalance,
                    fee: 0,
                }
            ],
            fee: 0,
        });

        this.pendingGroup.addMethodCall<typeof AbstractedAccount.prototype.arc58_verifyAuthAddr, void>({
            sender: sender,
            applicationID: recipientAppID,
            fee: 0,
        });

        this.pendingGroup.addAssetTransfer({
            sender: sender,
            assetReceiver: AKITA_SOCIAL_TREASURY,
            assetAmount: tax,
            xferAsset: AssetID.fromUint64(AKITA_ASSET_ID),
            fee: 0,
        });

        this.pendingGroup.addAssetTransfer({
            sender: sender,
            assetReceiver: recipientAddress,
            assetAmount: (REACT_FEE - tax),
            xferAsset: AssetID.fromUint64(AKITA_ASSET_ID),
            rekeyTo: sender,
            fee: 0,
        });

        this.pendingGroup.submit();
    }

    private arc59OptInAndSendReactionPayments(sender: Address, recipientAppID: AppID, tax: uint64): void {
        const recipientAddress = recipientAppID.globalState(ARC58_CONTROLLED_ADDRESS_KEY) as Address;

        const canCallData = sendMethodCall<[Address, uint64], arc59GetSendAssetInfoResponse>({
            name: 'arc59_getSendAssetInfo',
            applicationID: AppID.fromUint64(ARC59_ROUTER_APP_ID),
            methodArgs: [
                recipientAddress,
                AKITA_ASSET_ID,
            ],
            fee: 0,
        });

        const mbr = canCallData.mbr;
        const routerOptedIn = canCallData.routerOptedIn;
        const receiverAlgoNeededForClaim = canCallData.receiverAlgoNeededForClaim;

        if (mbr || receiverAlgoNeededForClaim) {                    
            this.pendingGroup.addPayment({
                sender: sender,
                receiver: ARC59_ROUTER_APP_ADDRESS,
                amount: (mbr + receiverAlgoNeededForClaim),
                fee: 0,
            });
        }

        if (!routerOptedIn) {
            this.pendingGroup.addMethodCall<[uint64], void>({
                sender: sender,
                name: 'arc59_optRouterIn',
                applicationID: AppID.fromUint64(ARC59_ROUTER_APP_ID),
                methodArgs: [AKITA_ASSET_ID],
                fee: 0
            });
        }
        
        this.pendingGroup.addAssetTransfer({
            sender: sender,
            assetReceiver: AKITA_SOCIAL_TREASURY,
            assetAmount: tax,
            xferAsset: AssetID.fromUint64(AKITA_ASSET_ID),
            fee: 0,
        });

        this.pendingGroup.addMethodCall<[AssetTransferTxn, Address, uint64], Address>({
            sender: sender,
            name: 'arc59_sendAsset',
            applicationID: AppID.fromUint64(ARC59_ROUTER_APP_ID),
            methodArgs: [
                {
                    sender: sender,
                    assetReceiver: ARC59_ROUTER_APP_ADDRESS,
                    assetAmount: (REACT_FEE - tax),
                    xferAsset: AssetID.fromUint64(AKITA_ASSET_ID),
                    fee: 0,
                },
                recipientAddress,
                receiverAlgoNeededForClaim,
            ],
            fee: 0
        });

        this.pendingGroup.submit();
    }

    private sendReactionPayments(sender: Address, recipientAddress: Address, tax: uint64): void {
        this.pendingGroup.addAssetTransfer({
            sender: sender,
            assetReceiver: AKITA_SOCIAL_TREASURY,
            assetAmount: tax,
            xferAsset: AssetID.fromUint64(AKITA_ASSET_ID),
            fee: 0,
        });

        this.pendingGroup.addAssetTransfer({
            sender: sender,
            assetReceiver: recipientAddress,
            assetAmount: (REACT_FEE - tax),
            xferAsset: AssetID.fromUint64(AKITA_ASSET_ID),
            rekeyTo: sender,
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
                cid: EMPTY_CID,
                /** 
                 * when a user reacts to content other than posts
                 * we set the creator to the following:
                 * - AssetID: Asset Creator
                 * - Address: Address
                 * -   AppID: Application Creator
                */
                creator: creator,
                amendment: EMPTY_BYTES32,
                isAmendment: false,
                timestamp: globals.latestTimestamp,
                collectible: false,
                replyFilterIndex: 0,
                reactFilterIndex: 0,
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
        sender: Address,
        cid: bytes59,
        collectible: boolean,
        replyFilterIndex: uint64,
        reactFilterIndex: uint64,
        isAmendment: boolean,
    ): void {
        assert(!this.isBanned(sender), errs.BANNED);

        // update streak before we measure impact
        // this way we guarantee the box exists
        this.updateStreak(sender);

        const impact = this.userImpact(sender);

        sendAssetTransfer({
            sender: sender,
            assetReceiver: AKITA_SOCIAL_TREASURY,
            assetAmount: POST_FEE,
            xferAsset: AssetID.fromUint64(AKITA_ASSET_ID),
            rekeyTo: sender,
            fee: 0,
        });

        const postID = this.txn.txID as bytes32;
        const post: PostValue = {
            ref: EMPTY_BYTES32,
            cid: cid,
            creator: sender,
            amendment: EMPTY_BYTES32,
            isAmendment: isAmendment,
            timestamp: globals.latestTimestamp,
            collectible: collectible,
            replyFilterIndex: replyFilterIndex,
            reactFilterIndex: reactFilterIndex,
        };

        this.posts(postID).value = post;
        this.updateVotes(postID, true, impact);
        this.votelist({ user: sender, ref: postID }).value = { impact: impact, isUp: true };
    }

    private createReply(
        sender: Address,
        cid: bytes59,
        ref: bytes32,
        collectible: boolean,
        replyFilterIndex: uint64,
        reactFilterIndex: uint64,
        args: bytes[],
        isAmendment: boolean,
    ): void {
        assert(!this.isBanned(sender), errs.BANNED);
        assert(this.posts(ref).exists, errs.POST_NOT_FOUND);
        const post = this.posts(ref).value;
        assert(!this.isBlocked(post.creator, sender), errs.BLOCKED);

        if (post.replyFilterIndex !== 0) {
            assert(this.gate(post.replyFilterIndex, args), errs.DOES_NOT_PASS_GATE);
        }

        // update streak before we measure impact
        // this way we guarantee the box exists
        this.updateStreak(sender);

        const postCreatorImpact = this.userImpact(post.creator);
        const tax = this.getTax(postCreatorImpact);

        this.pendingGroup.addAssetTransfer({
            sender: sender,
            assetReceiver: AKITA_SOCIAL_TREASURY,
            assetAmount: tax,
            xferAsset: AssetID.fromUint64(AKITA_ASSET_ID),
            fee: 0,
        });

        this.pendingGroup.addAssetTransfer({
            sender: sender,
            assetReceiver: post.creator,
            assetAmount: (REACT_FEE - tax),
            xferAsset: AssetID.fromUint64(AKITA_ASSET_ID),
            rekeyTo: sender,
            fee: 0,
        });

        this.pendingGroup.submit();

        const replyPostID = this.txn.txID as bytes32;
        const replyPost: PostValue = {
            ref: ref,
            cid: cid,
            creator: sender,
            amendment: EMPTY_BYTES32,
            isAmendment: isAmendment,
            timestamp: globals.latestTimestamp,
            collectible: collectible,
            replyFilterIndex: replyFilterIndex,
            reactFilterIndex: reactFilterIndex,
        };

        this.posts(replyPostID).value = replyPost;

        const senderImpact = this.userImpact(sender);
        this.updateVotes(replyPostID, true, senderImpact);
        this.votelist({ user: sender, ref: replyPostID }).value = { impact: senderImpact, isUp: true };
    }

    private createVote(sender: Address, ref: bytes32, isUp: boolean): void {
        assert(!this.isBanned(sender), errs.BANNED);
        assert(this.posts(ref).exists, errs.POST_NOT_FOUND);
        
        const post = this.posts(ref).value;
        assert(!this.isBlocked(post.creator, sender), errs.BLOCKED);
        assert(!this.votelist({ user: sender, ref: ref }).exists, errs.ALREADY_VOTED);
        assert(sender !== post.creator, errs.NO_SELF_VOTE);

        const senderIsAutomated = this.meta(sender).value.automated;
        assert(!senderIsAutomated, errs.AUTOMATED_ACCOUNT);

        // update streak before we measure impact
        // this way we guarantee the box exists
        this.updateStreak(sender);

        if (isUp) {
            const postCreatorMeta = this.meta(post.creator).value;
            // calls a transaction
            const recipientImpact = this.userImpact(post.creator);
            const tax = this.getTax(recipientImpact);

            if (!post.creator.isOptedInToAsset(AKITA_ASSET_ID)) {
                // calls a transaction
                const canCallArc58OptIn = this.canCallArc58OptIn(sender, postCreatorMeta.walletAppID);
                if (canCallArc58OptIn) {
                    // calls 6 transactions
                    this.arc58OptInAndSendReactionPayments(sender, postCreatorMeta.walletAppID, tax);
                } else {
                    // calls up to 6 transactions
                    this.arc59OptInAndSendReactionPayments(sender, postCreatorMeta.walletAppID, tax);
                }
            } else {
                // calls 2 transactions
                const address = postCreatorMeta.walletAppID.globalState(ARC58_CONTROLLED_ADDRESS_KEY) as Address;
                this.sendReactionPayments(sender, address, tax)
            }
        } else {
            sendAssetTransfer({
                sender: sender,
                assetReceiver: AKITA_SOCIAL_TREASURY,
                assetAmount: REACT_FEE,
                xferAsset: AssetID.fromUint64(AKITA_ASSET_ID),
                rekeyTo: sender,
                fee: 0,
            });
        }

        // calls a transaction
        const senderImpact = this.userImpact(sender);
        this.updateVotes(ref, isUp, senderImpact);
        this.votelist({ user: sender, ref: ref }).value = { impact: senderImpact, isUp: isUp };
    }

    private createReaction(sender: Address, ref: bytes32, NFT: AssetID, args: bytes[]): void {
        assert(!this.isBanned(sender), errs.BANNED);
        assert(this.posts(ref).exists, errs.POST_NOT_FOUND);
        const post = this.posts(ref).value;
        assert(!this.isBlocked(post.creator, sender), errs.BLOCKED);
        assert(sender.assetBalance(NFT) > 0, errs.USER_DOES_NOT_OWN_NFT);

        if (post.reactFilterIndex !== 0) {
            assert(this.gate(post.reactFilterIndex, args), errs.DOES_NOT_PASS_GATE);
        }

        const reactionListKey: ReactionListKey = {
            user: rawBytes(sender).substring(0, 24) as bytes24,
            ref: rawBytes(ref).substring(0, 24) as bytes24,
            NFT: NFT
        };

        assert(!this.reactionlist(reactionListKey).exists, errs.ALREADY_REACTED);

        // update streak before we measure impact
        // this way we guarantee the box exists
        this.updateStreak(sender);

        const creatorMeta = this.meta(post.creator).value;
        const recipientImpact = this.userImpact(post.creator);
        const tax = this.getTax(recipientImpact);

        if (!post.creator.isOptedInToAsset(AKITA_ASSET_ID)) {
            const canCallArc58OptIn = this.canCallArc58OptIn(sender, creatorMeta.walletAppID);
            if (canCallArc58OptIn) {
                this.arc58OptInAndSendReactionPayments(sender, creatorMeta.walletAppID, tax);
            } else {
                this.arc59OptInAndSendReactionPayments(sender, creatorMeta.walletAppID, tax);
            }
        } else {
            const address = creatorMeta.walletAppID.globalState(ARC58_CONTROLLED_ADDRESS_KEY) as Address;
            this.sendReactionPayments(sender, address, tax)
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
        sender: Address,
        cid: bytes59,
        collectible: boolean,
        replyFilterIndex: uint64,
        reactFilterIndex: uint64
    ): void {
        this.createPost(sender, cid, collectible, replyFilterIndex, reactFilterIndex, false);
    }

    editPost(
        sender: Address,
        cid: bytes59,
        collectible: boolean,
        replyFilterIndex: uint64,
        reactFilterIndex: uint64,
        amendment: bytes32
    ): void {
        assert(this.posts(amendment).exists, errs.POST_NOT_FOUND);
        const post = clone(this.posts(amendment).value);
        assert(post.creator === sender, errs.NOT_YOUR_POST_TO_EDIT);
        assert(post.ref === EMPTY_BYTES32);

        this.posts(amendment).value = {
            ref: post.ref,
            cid: post.cid,
            creator: post.creator,
            amendment: this.txn.txID as bytes32,
            isAmendment: post.isAmendment,
            timestamp: post.timestamp,
            collectible: false,
            replyFilterIndex: post.replyFilterIndex,
            reactFilterIndex: post.reactFilterIndex
        };

        this.createPost(sender, cid, collectible, replyFilterIndex, reactFilterIndex, true);
    }

    replyPost(
        sender: Address,
        cid: bytes59,
        ref: bytes32,
        collectible: boolean,
        replyFilterIndex: uint64,
        reactFilterIndex: uint64,
        args: bytes[],
    ): void {
        this.createReply(sender, cid, ref, collectible, replyFilterIndex, reactFilterIndex, args, false);
    }

    replyAsset(
        sender: Address,
        cid: bytes59,
        ref: AssetID,
        collectible: boolean,
        replyFilterIndex: uint64,
        reactFilterIndex: uint64,
    ): void {
        assert(ref.id !== 0, errs.INVALID_ASSET)
        const paddedRef = itob(ref.id) as bytes32;
        this.createEmptyPostIfNecessary(paddedRef, ref.creator);
        this.createReply(sender, cid, paddedRef, collectible, replyFilterIndex, reactFilterIndex, [], false);
    }

    replyAddress(
        sender: Address,
        cid: bytes59,
        ref: Address,
        collectible: boolean,
        replyFilterIndex: uint64,
        reactFilterIndex: uint64,
        args: bytes[]
    ): void {
        
        if (this.meta(ref).exists) {
            const meta = this.meta(ref).value;

            if (meta.addressFilterIndex !== 0) {
                assert(this.gate(meta.addressFilterIndex, args), errs.DOES_NOT_PASS_GATE);
            }
        }

        const r = rawBytes(ref) as bytes32;
        this.createEmptyPostIfNecessary(r, ref);
        this.createReply(sender, cid, r, collectible, replyFilterIndex, reactFilterIndex, [], false);
    }

    replyApp(
        sender: Address,
        cid: bytes59,
        ref: AppID,
        collectible: boolean,
        replyFilterIndex: uint64,
        reactFilterIndex: uint64,
    ): void {
        assert(ref.id !== 0, errs.INVALID_APP)
        const paddedRef = itob(ref.id) as bytes32;
        this.createEmptyPostIfNecessary(paddedRef, ref.creator);
        this.createReply(sender, cid, paddedRef, collectible, replyFilterIndex, reactFilterIndex, [], false);
    }

    editReply(
        sender: Address,
        cid: bytes59,
        collectible: boolean,
        replyFilterIndex: uint64,
        reactFilterIndex: uint64,
        args: bytes[],
        amendment: bytes32
    ): void {
        assert(this.posts(amendment).exists, errs.REPLY_NOT_FOUND);
        const post = this.posts(amendment).value;
        assert(post.creator === sender, errs.NOT_YOUR_POST_TO_EDIT);
        assert(post.ref !== EMPTY_BYTES32, errs.NOT_A_REPLY);
        this.posts(amendment).value.amendment = this.txn.txID;
        this.createReply(sender, cid, post.ref, collectible, replyFilterIndex, reactFilterIndex, args, true);
    }

    votePost(sender: Address, ref: bytes32, isUp: boolean): void {
        this.createVote(sender, ref, isUp);
    }

    voteAsset(sender: Address, ref: AssetID, isUp: boolean): void {
        assert(ref.id !== 0, errs.INVALID_ASSET);
        const paddedRef = itob(ref.id) as bytes32;
        this.createEmptyPostIfNecessary(paddedRef, ref.creator);
        this.createVote(sender, paddedRef, isUp);
    }

    voteAddress(sender: Address, ref: Address, isUp: boolean): void {
        const r = rawBytes(ref) as bytes32;
        this.createEmptyPostIfNecessary(r, ref);
        this.createVote(sender, r, isUp);
    }

    voteApp(sender: Address, ref: AppID, isUp: boolean): void {
        assert(ref.id !== 0, errs.INVALID_APP)
        const paddedRef = itob(ref.id) as bytes32;
        this.createEmptyPostIfNecessary(paddedRef, ref.creator);
        this.createVote(sender, paddedRef, isUp);
    }

    editVote(sender: Address, ref: bytes32, flip: boolean): void {
        const voteListKey: VoteListKey = { user: sender, ref: ref };
        assert(this.votelist(voteListKey).exists, errs.HAVENT_VOTED);

        const voteListData = this.votelist(voteListKey).value;
        const impact = voteListData.impact;
        const isUp = voteListData.isUp;

        // undo user vote
        this.updateVotes(ref, !isUp, impact);
        if (!flip) {
            return;
        }

        this.createVote(sender, ref, !isUp);
    }

    reactPost(sender: Address, ref: bytes32, NFT: AssetID, args: bytes[]): void {
        this.createReaction(sender, ref, NFT, args);
    }

    reactAsset(sender: Address, ref: AssetID, NFT: AssetID): void {
        assert(ref.id !== 0, errs.INVALID_ASSET)
        const paddedRef = itob(ref.id) as bytes32;
        this.createEmptyPostIfNecessary(paddedRef, ref.creator);
        this.createReaction(sender, paddedRef, NFT, []);
    }

    reactAddress(sender: Address, ref: Address, NFT: AssetID, args: bytes[]): void {

        if (this.meta(ref).exists) {
            const meta = this.meta(ref).value;

            if (meta.addressFilterIndex !== 0) {
                assert(this.gate(meta.addressFilterIndex, args), errs.DOES_NOT_PASS_GATE);
            }
        }

        const r = rawBytes(ref) as bytes32;
        this.createEmptyPostIfNecessary(r, ref);
        this.createReaction(sender, r, NFT, []);
    }

    reactApp(sender: Address, ref: AppID, NFT: AssetID): void {
        assert(ref.id !== 0, errs.INVALID_APP)
        const paddedRef = itob(ref.id) as bytes32;
        this.createEmptyPostIfNecessary(paddedRef, ref.creator);
        this.createReaction(sender, paddedRef, NFT, []);
    }

    deleteReaction(sender: Address, ref: bytes32, NFT: AssetID): void {
        assert(this.controls(sender), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(!this.isBanned(sender), errs.BANNED);
        assert(this.posts(ref).exists, errs.POST_NOT_FOUND);
        const post = this.posts(ref).value;
        assert(!this.isBlocked(post.creator, sender), errs.BLOCKED);

        const reactionListKey: ReactionListKey = {
            user: rawBytes(sender).substring(0, 24) as bytes24,
            ref: rawBytes(ref).substring(0, 24) as bytes24,
            NFT: NFT
        };

        assert(this.reactionlist(reactionListKey).exists, errs.ALREADY_REACTED);

        this.reactions({ ref: ref, NFT: NFT }).value -= 1;
        this.reactionlist(reactionListKey).delete();
    }

    // collect(sender: Address, ref: bytes32): void {
    //     assert(!this.isBanned(sender), errs.BANNED);
    //     assert(this.posts(ref).exists, errs.POST_NOT_FOUND);
    //     const post = this.posts(ref).value;
    //     assert(!this.isBlocked(post.creator, sender), errs.BLOCKED);

    //     // not bot?



    //     // mint asset if necessary
    //     // user opts in
    // }

    // -------------------------------------------------------------
    // user methods ------------------------------------------------
    // -------------------------------------------------------------

    follow(sender: Address, address: Address, args: bytes[]): void {
        assert(this.controls(sender), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(!this.isBanned(sender), errs.BANNED);
        assert(!this.isBlocked(address, sender), errs.BLOCKED);

        const senderIsAutomated = this.meta(sender).value.automated;
        assert(!senderIsAutomated, errs.AUTOMATED_ACCOUNT);

        const meta = this.meta(address).value;

        if (meta.followFilterIndex !== 0) {
            assert(this.gate(meta.followFilterIndex, args), errs.DOES_NOT_PASS_GATE);
        }

        const followerIndex = meta.followerIndex;
        this.follows({ user: address, index: (followerIndex + 1) }).value = sender;
        this.meta(address).value.followerIndex += 1;
        this.meta(address).value.followerCount += 1;
    }

    unfollow(sender: Address, address: Address, followerIndex: uint64): void {
        assert(this.controls(sender), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(!this.isBanned(sender), errs.BANNED);
        assert(this.follows({ user: address, index: followerIndex }).value === sender, errs.WRONG_FOLLOWER_KEY);

        this.follows({ user: address, index: followerIndex }).delete();
        this.meta(address).value.followerCount -= 1;
    }

    // we dont remove followers because that requires us to know the index
    // instead, blocking supersedes following
    block(sender: Address, address: Address): void {
        assert(this.controls(sender), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(!this.isBanned(sender), errs.BANNED);
        this.blocks({ user: sender, blocked: address }).create(0);
    }

    unblock(sender: Address, address: Address): void {
        assert(this.controls(sender), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(!this.isBanned(sender), errs.BANNED);
        this.blocks({ user: sender, blocked: address }).delete();
    }

    // -------------------------------------------------------------
    // moderator methods -------------------------------------------
    // -------------------------------------------------------------

    addModerator(address: Address): void {
        // TODO: 
    }

    removeModerator(address: Address): void {
        // TODO: 
    }

    ban(sender: Address, address: Address, expiration: uint64): void {
        assert(this.controls(sender), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(this.moderators(sender).exists, errs.NOT_A_MODERATOR);
        assert(!this.banned(address).exists, errs.ALREADY_BANNED);
        this.banned(address).value = expiration;
    }

    unban(sender: Address, address: Address): void {
        assert(this.controls(sender), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(this.moderators(sender).exists, errs.NOT_A_MODERATOR);
        this.banned(address).delete()
    }

    // -------------------------------------------------------------
    // meta methods ------------------------------------------------
    // -------------------------------------------------------------

    cacheMeta(walletAppID: AppID, automated: boolean, subscriptionIndex: uint64, NFD: AppID, akitaNFT: AssetID): uint64 {
        const address = walletAppID.globalState(ARC58_CONTROLLED_ADDRESS_KEY) as Address;
        assert(this.controls(address), errs.PLUGIN_NOT_AUTH_ADDR);

        if (!this.meta(address).exists) {
            if (automated) {
                this.meta(address).value = {
                    walletAppID: walletAppID,
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
            assert(!this.meta(address).value.automated, errs.AUTOMATED_ACCOUNT);
        }

        if (subscriptionIndex !== 0) {
            assert(this.isSubscribed(address, subscriptionIndex).active, errs.NOT_A_SUBSCRIPTION);
        }
        
        let nfdTimeChanged: uint64 = 0;
        let nfdImpact: uint64 = 0;
        if (NFD.id !== 0) {
            assert(this.isNFD(NFD), errs.NOT_AN_NFD);
            assert(this.addressVerifiedOnNFD(address, NFD), errs.USER_DOES_NOT_OWN_NFD);
            nfdTimeChanged = btoi(NFD.globalState(NFD_TIME_CHANGED_KEY) as bytes);
            nfdImpact = this.calcNFDImpactScore(NFD);
        }

        if (akitaNFT.id !== 0) {
            assert(this.isAkitaNFT(akitaNFT), errs.NOT_AN_AKITA_NFT);
            assert(this.userHolds(address, akitaNFT), errs.USER_DOES_NOT_OWN_NFT);
        }

        if (!this.meta(address).exists) {
            this.meta(address).value = {
                walletAppID: walletAppID,
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
            const meta = clone(this.meta(address).value);

            meta.subscriptionIndex = subscriptionIndex;
            meta.NFD = NFD;
            meta.nfdTimeChanged = nfdTimeChanged;
            meta.nfdImpact = nfdImpact;
            meta.akitaNFT = akitaNFT;
            
            this.meta(address).value = meta;
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