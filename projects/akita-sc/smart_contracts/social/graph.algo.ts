import { abimethod, Account, assert, assertMatch, BoxMap, Bytes, bytes, Global, gtxn, itxn, Txn, uint64 } from "@algorandfoundation/algorand-typescript"
import { abiCall } from "@algorandfoundation/algorand-typescript/arc4"
import { classes } from 'polytype'
import { AkitaBaseContract } from "../utils/base-contracts/base"
import { ERR_FAILED_GATE, ERR_INVALID_PAYMENT } from "../utils/errors"
import { gateCheck, getWalletIDUsingAkitaDAO, originOrTxnSender } from "../utils/functions"
import { BaseSocial } from "./base"
import { AkitaSocialBoxPrefixBlocks, AkitaSocialBoxPrefixFollows } from "./constants"
import type { AkitaSocial } from "./contract.algo"
import { ERR_AUTOMATED_ACCOUNT, ERR_BANNED, ERR_BLOCKED, ERR_HAS_GATE, ERR_WRONG_FOLLOWER_KEY } from "./errors"
import { BlockListKey, FollowsKey, MetaValue } from "./types"

export class AkitaSocialGraph extends classes(BaseSocial, AkitaBaseContract) {

  /** Who follows who */
  follows = BoxMap<FollowsKey, Account>({ keyPrefix: AkitaSocialBoxPrefixFollows })
  /** All the blocks on the network */
  blocks = BoxMap<BlockListKey, bytes<0>>({ keyPrefix: AkitaSocialBoxPrefixBlocks })

  private isBanned(account: Account): boolean {
    return abiCall<typeof AkitaSocial.prototype.isBanned>({
      appId: this.akitaDAO.value,
      args: [account]
    }).returnValue
  }

  // creates a blocklist key
  private blk(userAddress: Account, blockedAddress: Account): BlockListKey {
    const user = userAddress.bytes.slice(0, 16).toFixed({ length: 16 })
    const blocked = blockedAddress.bytes.slice(0, 16).toFixed({ length: 16 })
    return { user, blocked }
  }

  private getMeta(address: Account): MetaValue {
    return abiCall<typeof AkitaSocial.prototype.getMeta>({
      appId: this.akitaDAO.value,
      args: [address]
    }).returnValue
  }

  private updateFollowerMeta(account: Account, newFollowerIndex: uint64, newFollowerCount: uint64): void {
    abiCall<typeof AkitaSocial.prototype.updateFollowerMeta>({
      appId: this.akitaDAO.value,
      args: [account, newFollowerIndex, newFollowerCount]
    })
  }

  private createFollow(origin: Account, address: Account): void {
    assert(!this.isBanned(origin), ERR_BANNED)
    assert(!this.isBlocked(address, origin), ERR_BLOCKED)

    const { automated, followerCount, followerIndex } = this.getMeta(origin)
    assert(!automated, ERR_AUTOMATED_ACCOUNT)

    const followsKey: FollowsKey = { user: address, index: (followerIndex + 1) }
    this.follows(followsKey).value = origin

    this.updateFollowerMeta(address, followerIndex + 1, followerCount + 1)
  }

  // we dont remove followers because that requires us to know the index
  // instead, blocking supersedes following
  block(mbrPayment: gtxn.PaymentTxn, address: Account): void {
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

  unfollow(address: Account, index: uint64): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(!this.isBanned(origin), ERR_BANNED)

    const followsKey = { user: address, index }
    assert(this.follows(followsKey).value === origin, ERR_WRONG_FOLLOWER_KEY)

    const { followerIndex, followerCount } = this.getMeta(address)
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
  isFollower(user: Account, index: uint64, follower: Account): boolean {
    return this.follows({ user, index }).value === follower
  }
}