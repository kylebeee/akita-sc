import { Account, Application, assert, assertMatch, BoxMap, bytes, Global, gtxn, itxn, Txn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod } from '@algorandfoundation/algorand-typescript/arc4'
import { ERR_NOT_AKITA_DAO } from '../errors'
import { UpgradeableAkitaBaseContract } from '../utils/base-contracts/base'
import { ERR_INVALID_PAYMENT } from '../utils/errors'
import { getAkitaSocialAppList, getWalletIDUsingAkitaDAO, originOrTxnSender } from '../utils/functions'
import { CID } from '../utils/types/base'
import { ActionsMBR, AkitaSocialBoxPrefixActions, AkitaSocialBoxPrefixBanned, AkitaSocialBoxPrefixModerators, BannedMBR, ModeratorsMBR } from './constants'
import { ERR_ALREADY_A_MODERATOR, ERR_ALREADY_AN_ACTION, ERR_ALREADY_BANNED, ERR_NOT_A_MODERATOR } from './errors'
import { Action } from './types'

// CONTRACT IMPORTS
import type { AkitaSocial } from './contract.algo'

export class AkitaSocialModeration extends UpgradeableAkitaBaseContract {

  // BOXES ----------------------------------------------------------------------------------------

  /** Who is a moderator */
  moderators = BoxMap<Account, uint64>({ keyPrefix: AkitaSocialBoxPrefixModerators })
  /** Who is banned and when they can return */
  banned = BoxMap<Account, uint64>({ keyPrefix: AkitaSocialBoxPrefixBanned })
  /** Actions usable on an akita post */
  actions = BoxMap<uint64, Action>({ keyPrefix: AkitaSocialBoxPrefixActions })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: Application): void {
    this.version.value = version
    this.akitaDAO.value = akitaDAO
  }

  // MODERATION METHODS ---------------------------------------------------------------------------

  addModerator(mbrPayment: gtxn.PaymentTxn, address: Account): void {
    assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)
    assert(!this.moderators(address).exists, ERR_ALREADY_A_MODERATOR)

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: ModeratorsMBR
      },
      ERR_INVALID_PAYMENT
    )

    this.moderators(address).create()
  }

  removeModerator(address: Account): void {
    assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)
    assert(this.moderators(address).exists, ERR_NOT_A_MODERATOR)

    this.moderators(address).delete()

    itxn
      .payment({
        receiver: Txn.sender,
        amount: ModeratorsMBR
      })
      .submit()
  }

  ban(mbrPayment: gtxn.PaymentTxn, address: Account, expiration: uint64): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(this.moderators(origin).exists, ERR_NOT_A_MODERATOR)
    assert(!this.banned(address).exists, ERR_ALREADY_BANNED)

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: BannedMBR
      },
      ERR_INVALID_PAYMENT
    )

    this.banned(address).value = expiration
  }

  unban(address: Account): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(this.moderators(origin).exists, ERR_NOT_A_MODERATOR)
    this.banned(address).delete()

    itxn
      .payment({
        receiver: origin,
        amount: BannedMBR
      })
      .submit()
  }

  flagPost(ref: bytes<32>): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(this.moderators(origin).exists, ERR_NOT_A_MODERATOR)

    const { social } = getAkitaSocialAppList(this.akitaDAO.value)
    abiCall<typeof AkitaSocial.prototype.setPostFlag>({
      appId: social,
      args: [ref, true]
    })
  }

  unflagPost(ref: bytes<32>): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(this.moderators(origin).exists, ERR_NOT_A_MODERATOR)

    const { social } = getAkitaSocialAppList(this.akitaDAO.value)
    abiCall<typeof AkitaSocial.prototype.setPostFlag>({
      appId: social,
      args: [ref, false]
    })
  }

  addAction(mbrPayment: gtxn.PaymentTxn, actionAppID: uint64, content: CID): void {
    assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)
    assert(!this.actions(actionAppID).exists, ERR_ALREADY_AN_ACTION)

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: ActionsMBR
      },
      ERR_INVALID_PAYMENT
    )

    this.actions(actionAppID).value = { content }
  }

  removeAction(actionAppID: uint64): void {
    assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)
    assert(this.actions(actionAppID).exists, ERR_ALREADY_AN_ACTION)

    this.actions(actionAppID).delete()

    itxn
      .payment({
        receiver: Txn.sender,
        amount: ActionsMBR
      })
      .submit()
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  @abimethod({ readonly: true })
  isBanned(account: Account): boolean {
    return this.banned(account).exists && this.banned(account).value > Global.latestTimestamp
  }

  @abimethod({ readonly: true })
  isModerator(account: Account): boolean {
    return this.moderators(account).exists
  }

  @abimethod({ readonly: true })
  moderatorMeta(user: Account): { exists: boolean; lastActive: uint64 } {
    if (this.moderators(user).exists) {
      return {
        exists: true,
        lastActive: this.moderators(user).value
      }
    }
    return { exists: false, lastActive: 0 }
  }
}

