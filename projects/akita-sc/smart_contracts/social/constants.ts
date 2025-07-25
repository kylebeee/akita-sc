import { uint64 } from "@algorandfoundation/algorand-typescript";
import { TipAction, TipSendType } from "./types";
import { Uint8 } from "@algorandfoundation/algorand-typescript/arc4";

export const AkitaSocialBoxPrefixFollows = 'f'
export const AkitaSocialBoxPrefixBlocks = 'b'
export const AkitaSocialBoxPrefixPosts = 'p'
export const AkitaSocialBoxPrefixVotes = 'v'
export const AkitaSocialBoxPrefixVoteList = 'o'
export const AkitaSocialBoxPrefixReactions = 'r'
export const AkitaSocialBoxPrefixReactionList = 'e'
export const AkitaSocialBoxPrefixMeta = 'm'
export const AkitaSocialBoxPrefixModerators = 'd'
export const AkitaSocialBoxPrefixBanned = 'n'
export const AkitaSocialBoxPrefixActions = 'a'

export const ImpactBoxPrefixMeta = 'm'
export const ImpactBoxPrefixSubscriptionStateModifier = 's'

export const NFDGlobalStateKeysName = 'i.name'
export const NFDGlobalStateKeysParentAppID = 'i.parentAppID'
export const NFDGlobalStateKeysVersion = 'i.ver'
export const NFDGlobalStateKeysTimeChanged = 'i.timeChanged'

export const NFDMetaKeyVerifiedAddresses = 'v.caAlgo.0.as'
export const NFDMetaKeyVerifiedDomain = 'v.domain'
export const NFDMetaKeyVerifiedTwitter = 'v.twitter'
export const NFDMetaKeyVerifiedDiscord = 'v.discord'
export const NFDMetaKeyVerifiedTelegram = 'v.telegram'

export const FollowsMBR: uint64 = 31_700
export const BlocksMBR: uint64 = 15_700
export const MinPostsMBR: uint64 = 36_500 // + (400 * ref.length),
export const VotesMBR: uint64 = 19_300
export const VotelistMBR: uint64 = 19_300
export const ReactionsMBR: uint64 = 22_100
export const ReactionlistMBR: uint64 = 18_900
export const MetaMBR: uint64 = 42_100
export const ModeratorsMBR: uint64 = 18_900
export const BannedMBR: uint64 = 18_900
export const ActionsMBR: uint64 = 29_700

export const ImpactMetaMBR: uint64 = 31_700
export const SubscriptionStateModifierMBR: uint64 = 9_300

export const ONE_DAY: uint64 = 86_400
export const TWO_YEARS: uint64 = 63_072_000
export const THIRTY_DAYS: uint64 = 2_592_000
export const ONE_YEAR: uint64 = 31_536_000

export const ONE_MILLION_AKITA: uint64 = 1_000_000_000_000
export const TWO_HUNDRED_THOUSAND_AKITA: uint64 = 200_000_000_000
export const TEN_THOUSAND_AKITA: uint64 = 10_000_000_000

export const AmendmentMBR: uint64 = 13_200 // (400 * 33) 'a' + txid

export const TipSendTypeDirect: TipSendType = new Uint8(10)
export const TipSendTypeARC59: TipSendType = new Uint8(20)
export const TipSendTypeARC58: TipSendType = new Uint8(30)

export const TipActionPost: TipAction = new Uint8(10)
export const TipActionReact: TipAction = new Uint8(20)