import { Account, arc4, bytes, uint64 } from "@algorandfoundation/algorand-typescript"
import { Address, DynamicBytes, StaticBytes } from "@algorandfoundation/algorand-typescript/arc4"
import { CID } from "../../../utils/types/base"

export type FollowsKey = {
  user: Account
  index: uint64
}

export class arc4FollowsKey extends arc4.Struct<{
  user: Address
  index: arc4.UintN64
}> { }

export type BlockListKey = {
  user: bytes<16>
  blocked: bytes<16>
}

export class arc4BlockListKey extends arc4.Struct<{
  user: StaticBytes<16>
  blocked: StaticBytes<16>
}> { }

export type PostValue = {
  // the creator of the post & recipient of payments
  creator: Account
  // the unix time that the post was created
  timestamp: uint64
  // who's allowed to reply / react using gates
  gateID: uint64
  // whether the post is in breach of the content policy
  againstContentPolicy: boolean
  // whether this post is itself an amendment to another post
  isAmendment: boolean
  // a dynamic field encompassing: CID, txID reference & amendment data
  ref: bytes
  // 32 = an empty post (no content)(for votes & reactions to non post/comments)
  // 36 = a post
  // 69 = an amended post
  // 68 = a comment
  // 101 = an amended comment
}

export class arc4PostValue extends arc4.Struct<{
  creator: Address
  timestamp: arc4.UintN64
  gateID: arc4.UintN64
  againstContentPolicy: arc4.Bool
  isAmendment: arc4.Bool
  ref: DynamicBytes
}> { }

export type VotesValue = {
  voteCount: uint64
  isNegative: boolean
}

export class arc4VotesValue extends arc4.Struct<{
  voteCount: arc4.UintN64
  isNegative: arc4.Bool
}> { }

export type VoteListKey = {
  user: bytes<16>
  ref: bytes<16>
}

export class arc4VoteListKey extends arc4.Struct<{
  user: StaticBytes<16>
  ref: StaticBytes<16>
}> { }

export type VoteListValue = {
  impact: uint64
  isUp: boolean
}

export class arc4VoteListValue extends arc4.Struct<{
  impact: arc4.UintN64
  isUp: arc4.Bool
}> { }

export type ReactionsKey = {
  ref: bytes<32>
  NFT: uint64
}

export class arc4ReactionsKey extends arc4.Struct<{
  ref: StaticBytes<32>
  NFT: arc4.UintN64
}> { }

export type ReactionListKey = {
  user: bytes<16>
  ref: bytes<16>
  NFT: uint64
}

export class arc4ReactionListKey extends arc4.Struct<{
  user: StaticBytes<16>
  ref: StaticBytes<16>
  NFT: arc4.UintN64
}> { }

export type Action = { content: CID }

export class arc4Action extends arc4.Struct<{
  content: StaticBytes<36>
}> { }

export type MetaValue = {
  // this lets track the user addresses plugin wallet app ID for use with other plugins
  walletID: uint64
  // this lets us assign impact to the consistency of their usage
  streak: uint64
  // the date the user joined the network
  startDate: uint64
  // the last time the user interacted with the network
  lastActive: uint64
  // the follower count index of the user
  followerIndex: uint64
  // the follower count of the user
  followerCount: uint64
  // whether the account is automated
  automated: boolean
  // who's allowed to follow you using gates
  followGateID: uint64
  // who's allowed to post on your wall using gates
  addressGateID: uint64
}

export class arc4MetaValue extends arc4.Struct<{
  walletID: arc4.UintN64
  streak: arc4.UintN64
  startDate: arc4.UintN64
  lastActive: arc4.UintN64
  followerIndex: arc4.UintN64
  followerCount: arc4.UintN64
  automated: arc4.Bool
  followGateID: arc4.UintN64
  addressGateID: arc4.UintN64
}> { }

export type AkitaSocialMBRData = {
  follows: uint64
  blocks: uint64
  posts: uint64
  votes: uint64
  votelist: uint64
  reactions: uint64
  reactionlist: uint64
  meta: uint64
  moderators: uint64
  banned: uint64
  actions: uint64
}

export type ImpactMetaValue = {
  // the cached subscription App ID for the user
  subscriptionIndex: uint64
  // the cached NFD for the user
  NFD: uint64
  // the last time the NFD was updated and cached against this contract
  nfdTimeChanged: uint64
  // the impact score from the cached NFD
  nfdImpact: uint64
  // the cached akita NFT the user has
  akitaNFT: uint64
}

export class arc4ImpactMetaValue extends arc4.Struct<{
  subscriptionIndex: arc4.UintN64
  NFD: arc4.UintN64
  nfdTimeChanged: arc4.UintN64
  nfdImpact: arc4.UintN64
  akitaNFT: arc4.UintN64
}> { }

export type AkitaSocialImpactMBRData = {
  meta: uint64
  subscriptionStateModifier: uint64
}