import { Account, Application, assert, Asset, Bytes, Global, itxn, OnCompleteAction, op, Txn, uint64 } from "@algorandfoundation/algorand-typescript"
import { AkitaAppList, AkitaAssets, NFTFees, OtherAppList, PluginAppList, SocialFees, StakingFees, SubscriptionFees, SwapFees } from "../dao/types"
import { abiCall, Address, decodeArc4, DynamicArray, methodSelector, UintN64 } from "@algorandfoundation/algorand-typescript/arc4"
import { AkitaDAOGlobalStateKeysAkitaAppList, AkitaDAOGlobalStateKeysAkitaAssets, AkitaDAOGlobalStateKeysNFTFees, AkitaDAOGlobalStateKeysOtherAppList, AkitaDAOGlobalStateKeysPluginAppList, AkitaDAOGlobalStateKeysSocialFees, AkitaDAOGlobalStateKeysStakingFees, AkitaDAOGlobalStateKeysSubscriptionFees, AkitaDAOGlobalStateKeysSwapFees } from "../dao/constants"
import { ERR_INVALID_PERCENTAGE, ERR_INVALID_PERCENTAGE_OF_ARGS, ERR_NOT_A_PRIZE_BOX } from "./errors"
import { CreatorRoyaltyDefault, CreatorRoyaltyMaximumSingle, DIVISOR, IMPACT_DIVISOR } from "./constants"
import { AbstractAccountGlobalStateKeysControlledAddress, AbstractAccountGlobalStateKeysSpendingAddress } from "../arc58/account/constants"
import { SpendingAccountFactory } from "./types/spend-accounts"
import { Gate } from "../gates/contract.algo"
import { GateArgs } from "./types/gates"
import { AssetInbox } from "./types/asset-inbox"
import { AssetAndAmount } from "./types/optin"
import { AbstractedAccount } from "../arc58/account/contract.algo"
import { btoi, itob, sha256 } from "@algorandfoundation/algorand-typescript/op"
import { OptInPlugin } from "../arc58/plugins/optin/contract.algo"
import { Proof } from "./types/merkles"
import { MetaMerkles } from "../meta-merkles/contract.algo"
import { bytes32 } from "./types/base"
import { PrizeBoxGlobalStateKeyOwner } from "../prize-box/constants"
import { AkitaSocialImpact } from "../arc58/plugins/social/contract.algo"

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
    AkitaSocialImpact.prototype.getUserImpact,
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
    SpendingAccountFactory.prototype.get,
    {
      appId: spendingAccountFactory,
      args: [new Address(Txn.sender)],
      fee: 0,
    }
  ).returnValue
}

export function origin(spendingAccountFactory: uint64): Account {
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

  return abiCall(Gate.prototype.check, {
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

export function arc58OptInAndSend(akitaDAO: Application, recipientWalletID: uint64, optin: AssetAndAmount): void {
  const optinPlugin = getPluginAppList(akitaDAO).optin
  const origin = getOriginAccount(Application(recipientWalletID))

  const rekeyTxn = itxn.applicationCall({
    appId: recipientWalletID,
    onCompletion: OnCompleteAction.NoOp,
    appArgs: [
      methodSelector(AbstractedAccount.prototype.arc58_rekeyToPlugin),
      itob(optinPlugin),
      new DynamicArray<UintN64>(),
    ],
    fee: 0,
  })

  const optinPayment = itxn.payment({
    receiver: origin,
    amount: Global.assetOptInMinBalance,
    fee: 0,
  })

  const optinTxn = itxn.applicationCall({
    appId: optinPlugin,
    onCompletion: OnCompleteAction.NoOp,
    appArgs: [
      methodSelector(OptInPlugin.prototype.optInToAsset),
      recipientWalletID,
      true,
      optin.asset,
    ],
    fee: 0,
  })

  const rekeyBackTxn = itxn.applicationCall({
    appId: recipientWalletID,
    onCompletion: OnCompleteAction.NoOp,
    appArgs: [methodSelector(AbstractedAccount.prototype.arc58_verifyAuthAddr)],
    fee: 0,
  })

  if (optin.amount > 0) {
    const xferTxn = itxn.assetTransfer({
      assetAmount: optin.amount,
      assetReceiver: origin,
      xferAsset: optin.asset,
      fee: 0,
    })

    itxn.submitGroup(rekeyTxn, optinTxn, xferTxn, rekeyBackTxn)
    return
  }

  itxn.submitGroup(rekeyTxn, optinPayment, optinTxn, rekeyBackTxn)
}

export function royalties(akitaDAO: Application, asset: Asset, name: string, proof: Proof): uint64 {
  let creatorRoyalty: uint64 = 0

  if (!(proof.length > 0)) {
    return CreatorRoyaltyDefault
  }

  // fetch the royalty set for the asset being sold
  const creatorRoyaltyString = abiCall(
    MetaMerkles.prototype.verifiedRead,
    {
      appId: getAkitaAppList(akitaDAO).metaMerkles,
      args: [
        new Address(asset.creator),
        name,
        bytes32(sha256(sha256(itob(asset.id)))),
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