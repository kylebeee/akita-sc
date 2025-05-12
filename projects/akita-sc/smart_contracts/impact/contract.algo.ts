import { NFDRegistry } from '../utils/types/nfd-registry'
import { NFD } from '../utils/types/nfd'
import { AkitaSocialPlugin } from '../arc58/plugins/social/contract.algo'
import { Staking } from '../staking/contract.algo'
import { Subscriptions } from '../subscriptions/contract.algo'
import { Application, assert, assertMatch, Asset, BoxMap, bytes, Bytes, gtxn, op, Uint64 } from '@algorandfoundation/algorand-typescript'
import { Account, uint64 } from '@algorandfoundation/algorand-typescript'
import { AkitaSocialImpactMBRData, arc4MetaValue, MetaValue } from './types'
import { abiCall, abimethod, Address, decodeArc4, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { AssetHolding, btoi, Global, Txn } from '@algorandfoundation/algorand-typescript/op'
import { ImpactBoxPrefixMeta, ImpactBoxPrefixSubscriptionStateModifier, NFDGlobalStateKeysName, NFDGlobalStateKeysParentAppID, NFDGlobalStateKeysTimeChanged, NFDGlobalStateKeysVersion, NFDMetaKeyVerifiedAddresses, NFDMetaKeyVerifiedDiscord, NFDMetaKeyVerifiedDomain, NFDMetaKeyVerifiedTelegram, NFDMetaKeyVerifiedTwitter, ONE_MILLION_AKITA, ONE_YEAR, TEN_THOUSAND_AKITA, THIRTY_DAYS, TWO_HUNDRED_THOUSAND_AKITA } from './constants'
import { AkitaCollectionsPrefixAKC, AkitaCollectionsPrefixAOG, AkitaNFTCreatorAddress } from '../utils/constants'
import { ERR_INVALID_NFD, ERR_NFD_CHANGED, ERR_NOT_A_SUBSCRIPTION, ERR_NOT_AN_AKITA_NFT, ERR_NOT_AN_NFD, ERR_NOT_DAO, ERR_USER_DOES_NOT_OWN_NFD, ERR_USER_DOES_NOT_OWN_NFT } from './errors'
import { arc4StakeInfo, STAKING_TYPE_SOFT } from '../staking/types'
import { AkitaBaseContract } from '../utils/base-contracts/base'
import { getAkitaAppList, getAkitaAssets, getOtherAppList, getPluginAppList } from '../utils/functions'

export class AkitaSocialImpact extends AkitaBaseContract {

  // BOXES ----------------------------------------------------------------------------------------    

  /** A map of the meta data for each user */
  meta = BoxMap<Account, arc4MetaValue>({ keyPrefix: ImpactBoxPrefixMeta })
  /** A map of how each akita subscription affects impact calculation */
  subscriptionStateModifier = BoxMap<uint64, uint64>({ keyPrefix: ImpactBoxPrefixSubscriptionStateModifier })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private mbr(): AkitaSocialImpactMBRData {
    return {
      meta: 31_700,
      subscriptionStateModifier: 9_300,
    }
  }

  private userHolds(account: Account, NFT: Asset): boolean {
    return AssetHolding.assetBalance(account, NFT)[0] > 0
  }

  private isSubscribed(account: Account, index: uint64): { active: boolean; serviceID: uint64; streak: uint64 } {
    const info = abiCall(
      Subscriptions.prototype.getSubsriptionInfo,
      {
        appId: getAkitaAppList(this.akitaDAO.value).subscriptions,
        args: [new Address(account), index],
        fee: 0,
      },
    ).returnValue

    // ensure they're subscribed to an Akita offering
    const toAkita = info.recipient.native === this.akitaDAO.value.address

    // box index zero is reserved for donations
    // if its higher than zero then they're subscribed to an offer
    const notDonating = info.serviceID !== 0

    const lastWindowStart: uint64 = Global.latestTimestamp - (((Global.latestTimestamp - info.startDate) % info.interval) + info.interval)

    // this doesn't tell us about the consistency of their payments,
    // only that their subscription isn't currently stale
    const notStale = info.lastPayment > lastWindowStart

    return {
      active: toAkita && notDonating && notStale,
      serviceID: info.serviceID,
      streak: info.streak,
    }
  }

  private isNFD(NFDApp: Application): boolean {
    const [nfdNameBytes] = op.AppGlobal.getExBytes(NFDApp, Bytes(NFDGlobalStateKeysName))

    return abiCall(
      NFDRegistry.prototype.isValidNfdAppId,
      {
        appId: getOtherAppList(this.akitaDAO.value).nfdRegistry,
        args: [String(nfdNameBytes), NFDApp.id],
        fee: 0,
      }
    ).returnValue
  }

  // iterates over an NFD contracts verified addresses to check if the given address exists in the list
  private addressVerifiedOnNFD(account: Account, NFDApp: Application): boolean {
    const caAlgoData = abiCall(
      NFD.prototype.readField,
      {
        appId: NFDApp.id,
        args: [
          Bytes(NFDMetaKeyVerifiedAddresses)
        ],
        fee: 0,
      },
    ).returnValue

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
    const meta = decodeArc4<MetaValue>(this.meta(account).value.bytes)

    const stakedAktaImpact = this.getStakingImpactScore(account) // Staked AKTA | up to 250
    const subscriberImpact = this.getSubscriberImpactScore(account, meta.subscriptionIndex) // Akita Subscriber | up to 250
    const socialImpact = includeSocial ? this.getSocialImpactScore(account) : Uint64(0) // Social Activity | up to 250
    const nfdScore = this.getNFDImpactScore(account, Application(meta.NFD)) // NFD | up to 150
    const heldAkitaImpact = this.getHeldAktaImpactScore(account) // Held AKTA | up to 50
    const nftImpact = this.getNFTImpactScore(account, Asset(meta.akitaNFT)) // Holds AKC/Omnigem | 50

    const total: uint64 = stakedAktaImpact + subscriberImpact + socialImpact + nfdScore + heldAkitaImpact + nftImpact
    if (total === 0) {
      return 1
    }

    return total
  }

  private getStakingImpactScore(account: Account): uint64 {
    // - Staked AKTA | up to 250
    const akta = getAkitaAssets(this.akitaDAO.value).akta

    const info = abiCall(
      Staking.prototype.getInfo,
      {
        appId: getAkitaAppList(this.akitaDAO.value).staking,
        args: [
          new Address(account),
          new arc4StakeInfo({
            asset: new UintN64(akta),
            type: STAKING_TYPE_SOFT,
          })
        ],
        fee: 0,
      }
    ).returnValue

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

  private getSocialImpactScore(account: Account): uint64 {
    return abiCall(
      AkitaSocialPlugin.prototype.getUserSocialImpact,
      {
        appId: getPluginAppList(this.akitaDAO.value).social,
        args: [new Address(account)],
        fee: 0,
      }
    ).returnValue
  }

  private nfdReadField(NFDApp: Application, field: string): bytes {
    const fieldBytes = abiCall(
      NFD.prototype.readField,
      {
        appId: NFDApp.id,
        args: [Bytes(field)],
        fee: 0,
      }
    ).returnValue

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

    if (parentAppIDBytesExist && btoi(parentAppIDBytes) === getAkitaAppList(this.akitaDAO.value).akitaNFD) {
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
    const meta = decodeArc4<MetaValue>(this.meta(account).value.bytes)
    const [lastChangedBytes] = op.AppGlobal.getExBytes(meta.NFD, Bytes(NFDGlobalStateKeysTimeChanged))
    const timeChanged = btoi(lastChangedBytes)

    assert(NFDApp.id === Application(meta.NFD).id, ERR_INVALID_NFD)
    assert(meta.nfdTimeChanged === timeChanged, ERR_NFD_CHANGED)

    return meta.nfdImpact
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
  createApplication(akitaDAO: uint64, version: string): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // IMPACT METHODS -------------------------------------------------------------------------------

  cacheMeta(subscriptionIndex: uint64, NFDAppID: uint64, akitaAssetID: uint64): uint64 {
    if (subscriptionIndex !== 0) {
      assert(this.isSubscribed(Txn.sender, subscriptionIndex).active, ERR_NOT_A_SUBSCRIPTION)
    }

    let nfdTimeChanged: uint64 = 0
    let nfdImpact: uint64 = 0
    if (NFDAppID !== 0) {
      const nfdApp = Application(NFDAppID)
      assert(this.isNFD(nfdApp), ERR_NOT_AN_NFD)
      assert(this.addressVerifiedOnNFD(Txn.sender, nfdApp), ERR_USER_DOES_NOT_OWN_NFD)
      const [timeChangedBytes] = op.AppGlobal.getExBytes(nfdApp, Bytes(NFDGlobalStateKeysTimeChanged))
      nfdTimeChanged = btoi(timeChangedBytes)
      nfdImpact = this.calcNFDImpactScore(nfdApp)
    }

    if (akitaAssetID !== 0) {
      const akitaNFT = Asset(akitaAssetID)
      assert(this.isAkitaNFT(akitaNFT), ERR_NOT_AN_AKITA_NFT)
      assert(this.userHolds(Txn.sender, akitaNFT), ERR_USER_DOES_NOT_OWN_NFT)
    }

    this.meta(Txn.sender).value = new arc4MetaValue({
      subscriptionIndex: new UintN64(subscriptionIndex),
      NFD: new UintN64(NFDAppID),
      nfdTimeChanged: new UintN64(nfdTimeChanged),
      nfdImpact: new UintN64(nfdImpact),
      akitaNFT: new UintN64(akitaAssetID),
    })

    return nfdImpact
  }

  updateSubscriptionStateModifier(payment: gtxn.PaymentTxn, subscriptionIndex: uint64, newModifier: uint64): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_DAO)

    this.subscriptionStateModifier(subscriptionIndex).value = newModifier

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.mbr().subscriptionStateModifier
      }
    )
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  // exists so the social protocol contract can call it without reentrancy issues
  @abimethod({ readonly: true })
  getUserImpactWithoutSocial(address: Address): uint64 {
    return this.userImpact(address.native, false)
  }

  @abimethod({ readonly: true })
  getUserImpact(address: Address): uint64 {
    return this.userImpact(address.native, true)
  }

  @abimethod({ readonly: true })
  getMeta(user: Address): MetaValue {
    return decodeArc4<MetaValue>(this.meta(user.native).value.bytes)
  }
}
