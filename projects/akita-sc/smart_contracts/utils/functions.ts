import { Account, Application, assert, Asset, Bytes, Global, itxn, itxnCompose, op, Txn, uint64 } from "@algorandfoundation/algorand-typescript"
import { AkitaAppList, AkitaAssets, NFTFees, OtherAppList, PluginAppList, SocialFees, StakingFees, SubscriptionFees, SwapFees } from "../dao/types"
import { abiCall, Address, decodeArc4, UintN64 } from "@algorandfoundation/algorand-typescript/arc4"
import { AkitaDAOGlobalStateKeysAkitaAppList, AkitaDAOGlobalStateKeysAkitaAssets, AkitaDAOGlobalStateKeysNFTFees, AkitaDAOGlobalStateKeysOtherAppList, AkitaDAOGlobalStateKeysPluginAppList, AkitaDAOGlobalStateKeysSocialFees, AkitaDAOGlobalStateKeysStakingFees, AkitaDAOGlobalStateKeysSubscriptionFees, AkitaDAOGlobalStateKeysSwapFees } from "../dao/constants"
import { ERR_ASSETS_AND_AMOUNTS_MISMATCH, ERR_INVALID_PERCENTAGE, ERR_INVALID_PERCENTAGE_OF_ARGS, ERR_NOT_A_PRIZE_BOX } from "./errors"
import { CreatorRoyaltyDefault, CreatorRoyaltyMaximumSingle, DIVISOR, fee, IMPACT_DIVISOR } from "./constants"
import { AbstractAccountGlobalStateKeysControlledAddress, AbstractAccountGlobalStateKeysSpendingAddress } from "../arc58/account/constants"

import { GateArgs, GateInterface } from "./types/gates"
import { AssetInbox } from "./types/asset-inbox"
import { btoi, itob, sha256 } from "@algorandfoundation/algorand-typescript/op"
import { MetaMerklesInterface, Proof } from "./types/merkles"
import { PrizeBoxGlobalStateKeyOwner } from "../prize-box/constants"
import { arc4StakeInfo, STAKING_TYPE_LOCK } from "../staking/types"
import { ONE_YEAR_IN_DAYS } from "../gates/plugins/staking-power/constants"
import { ONE_DAY } from "../arc58/plugins/social/constants"

import { AkitaSocialImpactInterface } from "./types/social"
import { SpendingAccountFactoryInterface } from "./types/spend-accounts"
import { AbstractedAccountInterface } from "./abstract-account"
import { OptInPluginInterface } from "./types/plugins/optin"
import { StakingInterface } from "./types/staking"

export function getAkitaAppList(akitaDAO: Application): AkitaAppList {
  const [appListBytes] = op.AppGlobal.getExBytes(akitaDAO, Bytes(AkitaDAOGlobalStateKeysAkitaAppList))
  return decodeArc4<AkitaAppList>(appListBytes)
}

export function getPluginAppList(akitaDAO: Application): PluginAppList {
  const [pluginAppListBytes] = op.AppGlobal.getExBytes(akitaDAO, Bytes(AkitaDAOGlobalStateKeysPluginAppList))
  return decodeArc4<PluginAppList>(pluginAppListBytes)
}

export function getOtherAppList(akitaDAO: Application): OtherAppList {
  const [otherAppListBytes] = op.AppGlobal.getExBytes(akitaDAO, Bytes(AkitaDAOGlobalStateKeysOtherAppList))
  return decodeArc4<OtherAppList>(otherAppListBytes)
}

export function getSocialFees(akitaDAO: Application): SocialFees {
  const [socialFeesBytes] = op.AppGlobal.getExBytes(akitaDAO, Bytes(AkitaDAOGlobalStateKeysSocialFees))
  return decodeArc4<SocialFees>(socialFeesBytes)
}

export function getStakingFees(akitaDAO: Application): StakingFees {
  const [stakingFeesBytes] = op.AppGlobal.getExBytes(akitaDAO, Bytes(AkitaDAOGlobalStateKeysStakingFees))
  return decodeArc4<StakingFees>(stakingFeesBytes)
}

export function getSubscriptionFees(akitaDAO: Application): SubscriptionFees {
  const [subscriptionFeesBytes] = op.AppGlobal.getExBytes(akitaDAO, Bytes(AkitaDAOGlobalStateKeysSubscriptionFees))
  return decodeArc4<SubscriptionFees>(subscriptionFeesBytes)
}

export function getSwapFees(akitaDAO: Application): SwapFees {
  const [swapFeesBytes] = op.AppGlobal.getExBytes(akitaDAO, Bytes(AkitaDAOGlobalStateKeysSwapFees))
  return decodeArc4<SwapFees>(swapFeesBytes)
}

export function getNFTFees(akitaDAO: Application): NFTFees {
  const [nftFeesBytes] = op.AppGlobal.getExBytes(akitaDAO, Bytes(AkitaDAOGlobalStateKeysNFTFees))
  return decodeArc4<NFTFees>(nftFeesBytes)
}

export function getAkitaAssets(akitaDAO: Application): AkitaAssets {
  const akitaAssetsBytes = op.AppGlobal.getExBytes(akitaDAO, Bytes(AkitaDAOGlobalStateKeysAkitaAssets))[0]
  return decodeArc4<AkitaAssets>(akitaAssetsBytes)
}

export function calcPercent(a: uint64, p: uint64): uint64 {
  assert(p <= DIVISOR, ERR_INVALID_PERCENTAGE)
  return op.divw(...op.mulw(a, p), DIVISOR)
}

export function percentageOf(a: uint64, b: uint64): uint64 {
  assert(a < b, ERR_INVALID_PERCENTAGE_OF_ARGS)
  return op.divw(...op.mulw(a, DIVISOR), b)
}

export function akitaSocialFee(akitaDAO: Application, impact: uint64): uint64 {
  const { impactTaxMin, impactTaxMax } = getSocialFees(akitaDAO)
  return impactRange(impact, impactTaxMin, impactTaxMax)
}

/** calculates a point between two numbers in relation to user impact */
export function impactRange(impact: uint64, min: uint64, max: uint64): uint64 {
  const minImpact: uint64 = (impact > 1) ? impact - 1 : 1
  return max - (((max - min) * minImpact) / IMPACT_DIVISOR)
}

export function getUserImpact(akitaDAO: Application, account: Account): uint64 {
  return abiCall(
    AkitaSocialImpactInterface.prototype.getUserImpact,
    {
      appId: getPluginAppList(akitaDAO).impact,
      args: [new Address(account)],
      fee: 0,
    }
  ).returnValue
}

export function getOriginAccount(walletID: Application): Account {
  const [controlledAccountBytes] = op.AppGlobal.getExBytes(
    walletID,
    Bytes(AbstractAccountGlobalStateKeysControlledAddress)
  )
  return Account(Bytes(controlledAccountBytes))
}

export function walletID(spendingAccountFactory: uint64): uint64 {
  return abiCall(
    SpendingAccountFactoryInterface.prototype.get,
    {
      appId: spendingAccountFactory,
      args: [new Address(Txn.sender)],
      fee: 0,
    }
  ).returnValue
}

export function getOrigin(spendingAccountFactory: uint64): Account {
  const wallet = walletID(spendingAccountFactory)

  if (wallet === 0) {
    return Txn.sender
  }

  return getOriginAccount(Application(wallet))
}

export function gateCheck(akitaDAO: Application, caller: Address, id: uint64, args: GateArgs): boolean {
  if (id === 0) {
    return true
  }

  return abiCall(GateInterface.prototype.check, {
    appId: getAkitaAppList(akitaDAO).gate,
    args: [caller, id, args],
    fee: 0,
  }).returnValue
}

export type Arc58Accounts = {
  walletAddress: Account;
  origin: Account;
  sender: Account;
};

export function getAccounts(wallet: Application): Arc58Accounts {
  const origin = getOriginAccount(wallet)
  const sender = getSpendingAccount(wallet)
  return {
    walletAddress: wallet.address,
    origin,
    sender,
  }
}

export function getSpendingAccount(wallet: Application): Account {
  const [spendingAddressBytes] = op.AppGlobal.getExBytes(
    wallet,
    Bytes(AbstractAccountGlobalStateKeysSpendingAddress)
  )
  return Account(Bytes(spendingAddressBytes))
}

export function rekeyAddress(rekeyBack: boolean, wallet: Application): Account {
  if (!rekeyBack) {
    return Global.zeroAddress
  }

  const { walletAddress, origin, sender } = getAccounts(wallet)
  if (sender !== origin) {
    return sender
  }

  return walletAddress
}

export function arc59OptInAndSend(akitaDAO: Application, recipient: Address, asset: uint64, amount: uint64, closeOut: boolean): void {
  const assetInbox = getOtherAppList(akitaDAO).assetInbox
  const inboxAddress = Application(assetInbox).address

  const { mbr, routerOptedIn, receiverAlgoNeededForClaim } = abiCall(
    AssetInbox.prototype.arc59_getSendAssetInfo,
    {
      appId: assetInbox,
      args: [recipient, asset],
      fee: 0,
    }
  ).returnValue

  if (mbr || receiverAlgoNeededForClaim) {
    itxn.payment({
      receiver: inboxAddress,
      amount: mbr + receiverAlgoNeededForClaim,
      fee: 0,
    }).submit()
  }

  if (!routerOptedIn) {
    abiCall(AssetInbox.prototype.arc59_optRouterIn, {
      appId: assetInbox,
      args: [asset],
      fee: 0,
    })
  }

  let xferTxn = itxn.assetTransfer({
    assetReceiver: inboxAddress,
    assetAmount: amount,
    xferAsset: asset,
    fee: 0,
  })

  if (closeOut) {
    xferTxn = itxn.assetTransfer({
      xferAsset: asset,
      assetCloseTo: inboxAddress,
      fee: 0,
    })
  }

  abiCall(AssetInbox.prototype.arc59_sendAsset, {
    appId: assetInbox,
    args: [xferTxn, recipient, receiverAlgoNeededForClaim],
    fee: 0,
  })
}

export function arc58OptInAndSend(akitaDAO: Application, recipientWalletID: uint64, assets: uint64[], amounts: uint64[]): void {
  assert(assets.length === amounts.length, ERR_ASSETS_AND_AMOUNTS_MISMATCH)
  const optinPlugin = getPluginAppList(akitaDAO).optin
  const origin = getOriginAccount(Application(recipientWalletID))

  itxnCompose.begin(
    AbstractedAccountInterface.prototype.arc58_rekeyToPlugin,
    {
      appId: recipientWalletID,
      args: [optinPlugin, true, [], []],
      fee,
    }
  )

  itxnCompose.next(
    OptInPluginInterface.prototype.optInToAsset,
    {
      appId: optinPlugin,
      args: [
        recipientWalletID,
        true,
        assets,
        itxn.payment({
          receiver: origin,
          amount: Global.assetOptInMinBalance * assets.length,
          fee,
        })
      ],
      fee,
    }
  )

  for (let i: uint64 = 0; i < amounts.length; i++) {
    if (amounts[i] > 0) {
      itxnCompose.next(
        itxn.assetTransfer({
          assetAmount: amounts[i],
          assetReceiver: origin,
          xferAsset: assets[i],
          fee,
        })
      )
    }
  }

  itxnCompose.next(
    AbstractedAccountInterface.prototype.arc58_verifyAuthAddr,
    { appId: recipientWalletID, fee }
  )

  itxnCompose.submit()
}

export function royalties(akitaDAO: Application, asset: Asset, name: string, proof: Proof): uint64 {
  let creatorRoyalty: uint64 = 0

  if (!(proof.length > 0)) {
    return CreatorRoyaltyDefault
  }

  // fetch the royalty set for the asset being sold
  const creatorRoyaltyString = abiCall(
    MetaMerklesInterface.prototype.verifiedRead,
    {
      appId: getAkitaAppList(akitaDAO).metaMerkles,
      args: [
        new Address(asset.creator),
        name,
        sha256(sha256(itob(asset.id))),
        proof,
        1,
        'royalty',
      ],
      fee: 0,
    }
  ).returnValue

  if (Bytes(creatorRoyaltyString).length > 0) {
    creatorRoyalty = btoi(Bytes(creatorRoyaltyString))
  }

  if (creatorRoyalty > CreatorRoyaltyMaximumSingle) {
    return CreatorRoyaltyMaximumSingle
  }

  return creatorRoyalty
}

export function getPrizeBoxOwner(akitaDAO: Application, prizeBox: Application): Account {
  assert(prizeBox.creator === Application(getAkitaAppList(akitaDAO).prizeBox).address, ERR_NOT_A_PRIZE_BOX)
  const [ownerBytes] = op.AppGlobal.getExBytes(prizeBox, Bytes(PrizeBoxGlobalStateKeyOwner))
  return new Address(ownerBytes).native
}

export type ServiceFactoryContractMBRData = {
  appCreators: uint64
}

export function fmbr(): ServiceFactoryContractMBRData {
  return {
    appCreators: 21_700
  }
}

export function getStakingPower(stakingApp: uint64, user: Address, asset: uint64): uint64 {
  const info = abiCall(StakingInterface.prototype.getInfo, {
    appId: stakingApp,
    args: [
      user,
      new arc4StakeInfo({
        asset: new UintN64(asset),
        type: STAKING_TYPE_LOCK,
      }),
    ],
  }).returnValue

  const remainingDays: uint64 = (info.expiration - Global.latestTimestamp) / ONE_DAY
  return (info.amount / ONE_YEAR_IN_DAYS) * remainingDays
}