import { abimethod, Account, Application, assert, assertMatch, BoxMap, Bytes, bytes, Global, gtxn, itxn, Txn, uint64 } from "@algorandfoundation/algorand-typescript"
import { abiCall } from "@algorandfoundation/algorand-typescript/arc4"
import { classes } from 'polytype'
import { UpgradeableAkitaBaseContract } from "../utils/base-contracts/base"
import { ERR_FAILED_GATE, ERR_INVALID_PAYMENT } from "../utils/errors"
import { gateCheck, getAkitaSocialAppList, getWalletIDUsingAkitaDAO, originOrTxnSender } from "../utils/functions"
import { BaseSocial } from "./base"
import { AkitaSocialBoxPrefixBlocks, AkitaSocialBoxPrefixFollows } from "./constants"
import type { AkitaSocial } from "./contract.algo"
import type { AkitaSocialModeration } from "./moderation.algo"
import { ERR_ALREADY_FOLLOWING, ERR_AUTOMATED_ACCOUNT, ERR_BANNED, ERR_BLOCKED, ERR_HAS_GATE, ERR_NOT_FOLLOWING, ERR_SELF_BLOCK, ERR_SELF_FOLLOW } from "./errors"
import { BlockListKey, FollowsKey, MetaValue } from "./types"

export class AkitaSocialGraph extends classes(BaseSocial, UpgradeableAkitaBaseContract) {

  /**
   * Create method to initialize the contract with the DAO reference
   * @param akitaDao The Akita DAO app ID
   * @param version The version string for this contract
   */
  @abimethod({ onCreate: 'require' })
  create(akitaDao: Application, version: string): void {
    this.akitaDAO.value = akitaDao
    this.version.value = version
  }

  /** Who follows who - key is {user, follower}, value is the follow index */
  follows = BoxMap<FollowsKey, uint64>({ keyPrefix: AkitaSocialBoxPrefixFollows })
  /** All the blocks on the network */
  blocks = BoxMap<BlockListKey, bytes<0>>({ keyPrefix: AkitaSocialBoxPrefixBlocks })

  private isBanned(account: Account): boolean {
    const { moderation } = getAkitaSocialAppList(this.akitaDAO.value)
    return abiCall<typeof AkitaSocialModeration.prototype.isBanned>({
      appId: moderation,
      args: [account]
    }).returnValue
  }

  // creates a blocklist key
  private blk(userAddress: Account, blockedAddress: Account): BlockListKey {
    const user = userAddress.bytes.slice(0, 16).toFixed({ length: 16 })
    const blocked = blockedAddress.bytes.slice(0, 16).toFixed({ length: 16 })
    return { user, blocked }
  }

  // creates a follows key from user (being followed) and follower addresses
  private flw(user: Account, follower: Account): FollowsKey {
    const userBytes = user.bytes.slice(0, 16).toFixed({ length: 16 })
    const followerBytes = follower.bytes.slice(0, 16).toFixed({ length: 16 })
    return { user: userBytes, follower: followerBytes }
  }

  private getMeta(address: Account): MetaValue {
    const { social } = getAkitaSocialAppList(this.akitaDAO.value)
    return abiCall<typeof AkitaSocial.prototype.getMeta>({
      appId: social,
      args: [address]
    }).returnValue
  }

  private updateFollowerMeta(account: Account, newFollowerIndex: uint64, newFollowerCount: uint64): void {
    const { social } = getAkitaSocialAppList(this.akitaDAO.value)
    abiCall<typeof AkitaSocial.prototype.updateFollowerMeta>({
      appId: social,
      args: [account, newFollowerIndex, newFollowerCount]
    })
  }

  private createFollow(origin: Account, address: Account): void {
    assert(!this.isBanned(origin), ERR_BANNED)
    assert(!this.isBlocked(address, origin), ERR_BLOCKED)
    assert(origin !== address, ERR_SELF_FOLLOW)
    
    // Check if the follower (origin) is automated - automated accounts can't follow
    const { automated } = this.getMeta(origin)
    assert(!automated, ERR_AUTOMATED_ACCOUNT)

    // Create the follows key using user-follower pair
    const followsKey = this.flw(address, origin)
    
    // Check if already following
    assert(!this.follows(followsKey).exists, ERR_ALREADY_FOLLOWING)

    // Get the follower tracking info from the account being followed (address)
    const { followerCount, followerIndex } = this.getMeta(address)

    // Store the follow with the index as the value
    this.follows(followsKey).value = followerIndex + 1

    this.updateFollowerMeta(address, followerIndex + 1, followerCount + 1)
  }

  // we dont remove followers because that requires us to know the index
  // instead, blocking supersedes following
  block(mbrPayment: gtxn.PaymentTxn, address: Account): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(!this.isBanned(origin), ERR_BANNED)
    assert(origin !== address, ERR_SELF_BLOCK)

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.mbr(Bytes('')).blocks
      },
      ERR_INVALID_PAYMENT
    )

    const blocksKey = this.blk(origin, address)
    this.blocks(blocksKey).create()
  }

  unblock(address: Account): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(!this.isBanned(origin), ERR_BANNED)

    const blocksKey = this.blk(origin, address)
    this.blocks(blocksKey).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).blocks
      })
      .submit()
  }

  gatedFollow(
    mbrPayment: gtxn.PaymentTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    address: Account
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    // assert(this.meta(address).exists, ERR_META_DOESNT_EXIST)
    const { followGateID } = this.getMeta(address)
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

  follow(mbrPayment: gtxn.PaymentTxn, address: Account): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    // assert(this.meta(address).exists, ERR_META_DOESNT_EXIST)
    const { followGateID } = this.getMeta(address)
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

  unfollow(address: Account): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(!this.isBanned(origin), ERR_BANNED)

    // Create the follows key using user-follower pair
    const followsKey = this.flw(address, origin)
    
    // Check if actually following
    assert(this.follows(followsKey).exists, ERR_NOT_FOLLOWING)

    const { followerCount } = this.getMeta(address)
    // followerIndex stays the same (it's the next index to use), only count decreases
    const { followerIndex } = this.getMeta(address)
    this.updateFollowerMeta(address, followerIndex, followerCount - 1)

    this.follows(followsKey).delete()

    itxn
      .payment({
        receiver: origin,
        amount: this.mbr(Bytes('')).follows
      })
      .submit()
  }

  @abimethod({ readonly: true })
  isBlocked(user: Account, blocked: Account): boolean {
    const blocksKey = this.blk(user, blocked)
    return this.blocks(blocksKey).exists
  }

  @abimethod({ readonly: true })
  isFollowing(follower: Account, user: Account): boolean {
    const followsKey = this.flw(user, follower)
    return this.follows(followsKey).exists
  }

  @abimethod({ readonly: true })
  getFollowIndex(follower: Account, user: Account): uint64 {
    const followsKey = this.flw(user, follower)
    return this.follows(followsKey).value
  }
}