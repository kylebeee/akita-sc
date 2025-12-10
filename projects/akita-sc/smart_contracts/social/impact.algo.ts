import { Account, Application, assert, assertMatch, Asset, BoxMap, bytes, Bytes, clone, gtxn, op, uint64 } from "@algorandfoundation/algorand-typescript";
import { abiCall, abimethod } from "@algorandfoundation/algorand-typescript/arc4";
import { AssetHolding, btoi, Global, Txn } from "@algorandfoundation/algorand-typescript/op";
import { ERR_NOT_AKITA_DAO } from "../errors";
import { Staking } from "../staking/contract.algo";
import { STAKING_TYPE_SOFT } from "../staking/types";
import { Subscriptions } from "../subscriptions/contract.algo";
import { AkitaBaseContract } from "../utils/base-contracts/base";
import { AkitaCollectionsPrefixAKC, AkitaCollectionsPrefixAOG, AkitaNFTCreatorAddress } from "../utils/constants";
import { NFDGlobalStateKeysName, NFDGlobalStateKeysParentAppID, NFDGlobalStateKeysTimeChanged, NFDGlobalStateKeysVersion, NFDMetaKeyVerifiedAddresses, NFDMetaKeyVerifiedDiscord, NFDMetaKeyVerifiedDomain, NFDMetaKeyVerifiedTelegram, NFDMetaKeyVerifiedTwitter } from "../utils/constants/nfd";
import { ERR_INVALID_PAYMENT } from "../utils/errors";
import { getAkitaAppList, getAkitaAssets, getAkitaSocialAppList, getOtherAppList } from "../utils/functions";
import { NFD } from "../utils/types/nfd";
import { NFDRegistry } from "../utils/types/nfd-registry";
import { ImpactBoxPrefixMeta, ImpactBoxPrefixSubscriptionStateModifier, ImpactMetaMBR, ONE_MILLION_AKITA, ONE_YEAR, SubscriptionStateModifierMBR, TEN_THOUSAND_AKITA, THIRTY_DAYS, TWO_HUNDRED_THOUSAND_AKITA } from "./constants";
import type { AkitaSocial } from "./contract.algo";
import { ERR_INVALID_NFD, ERR_NFD_CHANGED, ERR_NOT_A_SUBSCRIPTION, ERR_NOT_AN_AKITA_NFT, ERR_NOT_AN_NFD, ERR_NOT_SOCIAL, ERR_USER_DOES_NOT_OWN_NFD, ERR_USER_DOES_NOT_OWN_NFT } from "./errors";
import { AkitaSocialImpactMBRData, ImpactMetaValue } from "./types";

export class AkitaSocialImpact extends AkitaBaseContract {

  // BOXES ----------------------------------------------------------------------------------------    

  /** A map of the meta data for each user */
  meta = BoxMap<Account, ImpactMetaValue>({ keyPrefix: ImpactBoxPrefixMeta })
  /** A map of how each akita subscription affects impact calculation */
  subscriptionStateModifier = BoxMap<uint64, uint64>({ keyPrefix: ImpactBoxPrefixSubscriptionStateModifier })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private mbr(): AkitaSocialImpactMBRData {
    return {
      meta: ImpactMetaMBR,
      subscriptionStateModifier: SubscriptionStateModifierMBR,
    }
  }

  private userHolds(account: Account, NFT: Asset): boolean {
    return AssetHolding.assetBalance(account, NFT)[0] > 0
  }

  private isSubscribed(address: Account, id: uint64): { active: boolean; serviceID: uint64; streak: uint64 } {
    const info = abiCall<typeof Subscriptions.prototype.getSubscription>({
      appId: getAkitaAppList(this.akitaDAO.value).subscriptions,
      args: [{ address, id }]
    }).returnValue

    if (!info.exists) {
      return {
        active: false,
        serviceID: 0,
        streak: 0,
      }
    }

    // ensure they're subscribed to an Akita offering
    const toAkita = info.recipient === this.akitaDAO.value.address

    // box index zero is reserved for donations
    // if its higher than zero then they're subscribed to an offer
    const notDonating = info.serviceID !== 0

    const previousWindowStart: uint64 = Global.latestTimestamp - (((Global.latestTimestamp - info.startDate) % info.interval) + info.interval)

    // this doesn't tell us about the consistency of their payments,
    // only that their subscription isn't currently stale
    const notStale = info.lastPayment > previousWindowStart

    return {
      active: toAkita && notDonating && notStale,
      serviceID: info.serviceID,
      streak: info.streak,
    }
  }

  private isNFD(NFDApp: Application): boolean {
    const [nfdNameBytes] = op.AppGlobal.getExBytes(NFDApp, Bytes(NFDGlobalStateKeysName))

    return abiCall<typeof NFDRegistry.prototype.isValidNfdAppId>({
      appId: getOtherAppList(this.akitaDAO.value).nfdRegistry,
      args: [String(nfdNameBytes), NFDApp.id]
    }).returnValue
  }

  // iterates over an NFD contracts verified addresses to check if the given address exists in the list
  private addressVerifiedOnNFD(account: Account, NFDApp: Application): boolean {
    const caAlgoData = abiCall<typeof NFD.prototype.readField>({
      appId: NFDApp.id,
      args: [Bytes(NFDMetaKeyVerifiedAddresses)]
    }).returnValue

    for (let i: uint64 = 0; i < caAlgoData.length; i += 32) {
      const addr = caAlgoData.slice(i, i + 32)
      if (addr !== Global.zeroAddress.bytes && addr === account.bytes) {
        return true
      }
    }

    return false
  }

  private isAkitaNFT(akitaNFT: Asset): boolean {
    return akitaNFT.creator === Account(AkitaNFTCreatorAddress)
  }

  private userImpact(account: Account, includeSocial: boolean): uint64 {
    // Check if meta box exists for the account, use defaults if not registered
    let subscriptionIndex: uint64 = 0
    let NFD: uint64 = 0
    let akitaNFT: uint64 = 0

    if (this.meta(account).exists) {
      const meta = clone(this.meta(account).value)
      subscriptionIndex = meta.subscriptionIndex
      NFD = meta.NFD
      akitaNFT = meta.akitaNFT
    }

    const stakedAktaImpact = this.getStakingImpactScore(account) // Staked AKTA | up to 250
    const subscriberImpact = this.getSubscriberImpactScore(account, subscriptionIndex) // Akita Subscriber | up to 250
    const socialImpact: uint64 = includeSocial ? this.getSocialImpactScore(account) : 0 // Social Activity | up to 250
    const nfdScore: uint64 = NFD !== 0 ? this.getNFDImpactScore(account, Application(NFD)) : 0 // NFD | up to 150
    const heldAkitaImpact = this.getHeldAktaImpactScore(account) // Held AKTA | up to 50
    const nftImpact: uint64 = akitaNFT !== 0 ? this.getNFTImpactScore(account, Asset(akitaNFT)) : 0 // Holds AKC/Omnigem | 50

    const total: uint64 = stakedAktaImpact + subscriberImpact + socialImpact + nfdScore + heldAkitaImpact + nftImpact
    if (total === 0) {
      return 1
    }

    return total
  }

  private getStakingImpactScore(account: Account): uint64 {
    // - Staked AKTA | up to 250
    const akta = getAkitaAssets(this.akitaDAO.value).akta

    // If AKTA asset is not configured, return 0
    if (akta === 0) {
      return 0
    }

    const info = abiCall<typeof Staking.prototype.getInfo>({
      appId: getAkitaAppList(this.akitaDAO.value).staking,
      args: [
        account,
        {
          asset: akta,
          type: STAKING_TYPE_SOFT,
        }
      ]
    }).returnValue

    const elapsed: uint64 = Global.latestTimestamp - info.lastUpdate

    // if the amount staked is too low or not much time has passed short circuit
    if (info.amount < TEN_THOUSAND_AKITA || elapsed < THIRTY_DAYS) {
      return 0
    }

    // Calculate score based on time elapsed, capped by amount staked
    const amtCapped = info.amount >= TWO_HUNDRED_THOUSAND_AKITA ? TWO_HUNDRED_THOUSAND_AKITA : info.amount

    // Calculate the maximum possible score based on the staked amount
    const maxScore: uint64 = (amtCapped * 250) / TWO_HUNDRED_THOUSAND_AKITA

    // Calculate the actual score based on time elapsed, capped by maxScore
    const timeCapped = elapsed >= ONE_YEAR ? ONE_YEAR : elapsed

    return (timeCapped * maxScore) / ONE_YEAR
  }

  private getHeldAktaImpactScore(account: Account): uint64 {
    const akta = getAkitaAssets(this.akitaDAO.value).akta

    // If AKTA asset is not configured, return 0
    if (akta === 0) {
      return 0
    }

    const balance = AssetHolding.assetBalance(account, akta)[0]

    // if the amount is too low short circuit
    if (balance < TEN_THOUSAND_AKITA) {
      return 0
    }

    const capped = balance >= ONE_MILLION_AKITA ? ONE_MILLION_AKITA : balance
    return (capped * 50) / ONE_MILLION_AKITA
  }

  private getSubscriberImpactScore(account: Account, subscriptionIndex: uint64): uint64 {
    let subscriberImpact: uint64 = 0

    const subscriptionState = this.isSubscribed(account, subscriptionIndex)

    if (!subscriptionState.active) {
      return subscriberImpact
    }

    const modifier = this.subscriptionStateModifier(subscriptionState.serviceID).value

    // the streak will be up to date because we check for staleness in isSubscribed
    if (subscriptionState.streak >= 12) {
      subscriberImpact += 250 / modifier
    } else {
      subscriberImpact += (subscriptionState.streak * 20) / modifier
    }

    return subscriberImpact
  }

  private getSocialImpactScore(address: Account): uint64 {
    return abiCall<typeof AkitaSocial.prototype.getUserSocialImpact>({
      appId: getAkitaSocialAppList(this.akitaDAO.value).social,
      args: [address]
    }).returnValue
  }

  private nfdReadField(NFDApp: Application, field: string): bytes {
    const fieldBytes = abiCall<typeof NFD.prototype.readField>({
      appId: NFDApp.id,
      args: [Bytes(field)]
    }).returnValue

    return fieldBytes
  }

  private getNFDSocialFields(NFDApp: Application): { domain: bytes; twitter: bytes; discord: bytes; telegram: bytes } {
    const domain = this.nfdReadField(NFDApp, NFDMetaKeyVerifiedDomain)
    const twitter = this.nfdReadField(NFDApp, NFDMetaKeyVerifiedTwitter)
    const discord = this.nfdReadField(NFDApp, NFDMetaKeyVerifiedDiscord)
    const telegram = this.nfdReadField(NFDApp, NFDMetaKeyVerifiedTelegram)

    return { domain, twitter, discord, telegram }
  }

  private calcNFDImpactScore(NFDApp: Application): uint64 {
    // base | 50
    let nfdImpact: uint64 = 50

    const [parentAppIDBytes, parentAppIDBytesExist] = op.AppGlobal.getExBytes(NFDApp, Bytes(NFDGlobalStateKeysParentAppID))

    if (parentAppIDBytesExist && btoi(parentAppIDBytes) === getOtherAppList(this.akitaDAO.value).akitaNfd) {
      nfdImpact += 50
    }

    const version = op.AppGlobal.getExBytes(NFDApp, Bytes(NFDGlobalStateKeysVersion))[0].slice(0, 2)

    if (version !== Bytes('3.')) {
      return nfdImpact
    }

    const { domain, twitter, discord, telegram } = this.getNFDSocialFields(NFDApp)

    // website | 10
    if (domain.length > 0) {
      nfdImpact += 10
    }

    // twitter | 20
    if (twitter.length > 0) {
      nfdImpact += 20
    }

    // discord | 10
    if (discord.length > 0) {
      nfdImpact += 10
    }

    // telegram | 10
    if (telegram.length > 0) {
      nfdImpact += 10
    }

    return nfdImpact
  }

  private getNFDImpactScore(account: Account, NFDApp: Application): uint64 {
    const { NFD, nfdTimeChanged, nfdImpact } = this.meta(account).value
    const timeChanged = btoi(op.AppGlobal.getExBytes(NFD, Bytes(NFDGlobalStateKeysTimeChanged))[0])

    assert(NFDApp.id === Application(NFD).id, ERR_INVALID_NFD)
    assert(nfdTimeChanged === timeChanged, ERR_NFD_CHANGED)

    return nfdImpact
  }

  private getNFTImpactScore(account: Account, asset: Asset): uint64 {
    const prefix = asset.unitName.slice(0, 3)
    const balance = AssetHolding.assetBalance(account, asset)[0]
    if (asset.creator === Account(AkitaNFTCreatorAddress) && balance > 0) {
      if (prefix === Bytes(AkitaCollectionsPrefixAKC)) {
        return 50
      }
      if (prefix === Bytes(AkitaCollectionsPrefixAOG)) {
        return 25
      }
    }
    return 0
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(akitaDAO: uint64, version: string): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // IMPACT METHODS -------------------------------------------------------------------------------

  cacheMeta(address: Account, subscriptionIndex: uint64, NFDAppID: uint64, akitaAssetID: uint64): uint64 {
    assert(Txn.sender === Application(getAkitaSocialAppList(this.akitaDAO.value).social).address, ERR_NOT_SOCIAL)

    if (subscriptionIndex !== 0) {
      assert(this.isSubscribed(address, subscriptionIndex).active, ERR_NOT_A_SUBSCRIPTION)
    }

    let nfdTimeChanged: uint64 = 0
    let nfdImpact: uint64 = 0
    if (NFDAppID !== 0) {
      const nfdApp = Application(NFDAppID)
      assert(this.isNFD(nfdApp), ERR_NOT_AN_NFD)
      assert(this.addressVerifiedOnNFD(address, nfdApp), ERR_USER_DOES_NOT_OWN_NFD)
      const [timeChangedBytes] = op.AppGlobal.getExBytes(nfdApp, Bytes(NFDGlobalStateKeysTimeChanged))
      nfdTimeChanged = btoi(timeChangedBytes)
      nfdImpact = this.calcNFDImpactScore(nfdApp)
    }

    if (akitaAssetID !== 0) {
      const akitaNFT = Asset(akitaAssetID)
      assert(this.isAkitaNFT(akitaNFT), ERR_NOT_AN_AKITA_NFT)
      assert(this.userHolds(address, akitaNFT), ERR_USER_DOES_NOT_OWN_NFT)
    }

    this.meta(address).value = {
      subscriptionIndex,
      NFD: NFDAppID,
      nfdTimeChanged,
      nfdImpact,
      akitaNFT: akitaAssetID,
    }

    return nfdImpact
  }

  updateSubscriptionStateModifier(payment: gtxn.PaymentTxn, subscriptionIndex: uint64, newModifier: uint64): void {
    assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)

    this.subscriptionStateModifier(subscriptionIndex).value = newModifier

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.mbr().subscriptionStateModifier
      },
      ERR_INVALID_PAYMENT
    )
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  // exists so the social protocol contract can call it without reentrancy issues
  @abimethod({ readonly: true })
  getUserImpactWithoutSocial(address: Account): uint64 {
    return this.userImpact(address, false)
  }

  @abimethod({ readonly: true })
  getUserImpact(address: Account): uint64 {
    return this.userImpact(address, true)
  }

  @abimethod({ readonly: true })
  getMeta(user: Account): ImpactMetaValue {
    return this.meta(user).value
  }
}