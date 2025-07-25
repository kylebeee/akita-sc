import { Account, arc4, bytes, uint64 } from "@algorandfoundation/algorand-typescript"
import { Address, DynamicBytes, StaticBytes, Uint8 } from "@algorandfoundation/algorand-typescript/arc4"
import { CID } from "../utils/types/base"
import { arc59GetSendAssetInfoResponse } from "../utils/types/asset-inbox"

export type FollowsKey = {
  user: Account
  index: uint64
}

export type BlockListKey = {
  user: bytes<16>
  blocked: bytes<16>
}

export type PostValue = {
  // the creator of the post & recipient of payments
  creator: Address
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

export type VotesValue = {
  voteCount: uint64
  isNegative: boolean
}

export type VoteListKey = {
  user: bytes<16>
  ref: bytes<16>
}

export type VoteListValue = {
  impact: uint64
  isUp: boolean
}

export type ReactionsKey = {
  ref: bytes<32>
  NFT: uint64
}

export type ReactionListKey = {
  user: bytes<16>
  ref: bytes<16>
  NFT: uint64
}

export type Action = { content: CID }

export type MetaValue = {
  // whether the user has initialised their account
  initialized: boolean
  // this lets track the user addresses plugin wallet app ID for use with other plugins
  wallet: uint64
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

export type AkitaSocialImpactMBRData = {
  meta: uint64
  subscriptionStateModifier: uint64
}

export type TipSendType = Uint8

export type tipMBRInfo = {
  type: TipSendType
  arc59: arc59GetSendAssetInfoResponse
  arc58: uint64
}

export type TipAction = Uint8

export type PostMeta = {
  post: {
    creator: Address
    timestamp: uint64
    gateID: uint64
    againstContentPolicy: boolean
    isAmendment: boolean
    ref: bytes
  },
  meta: {
    initialized: boolean
    wallet: uint64
    streak: uint64
    startDate: uint64
    lastActive: uint64
    followerIndex: uint64
    followerCount: uint64
    automated: boolean
    followGateID: uint64
    addressGateID: uint64
  },
  reactionExists: boolean
}

export type ReactionMeta = {
  postExists: boolean
  reactionExists: boolean
  creatorWallet: uint64
  addressGateID: uint64
}