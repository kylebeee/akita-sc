import { Account, Application, assert, Bytes, GlobalState, op, TemplateVar, Txn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { GlobalStateKeyAkitaDAO, GlobalStateKeyVersion } from '../../constants'
import { AkitaAppList, AkitaAssets, NFTFees, OtherAppList, PluginAppList, SocialFees, StakingFees, SubscriptionFees, SwapFees } from '../../dao/types'
import {
  AkitaDAOGlobalStateKeysAkitaAppList,
  AkitaDAOGlobalStateKeysAkitaAssets,
  AkitaDAOGlobalStateKeysNFTFees,
  AkitaDAOGlobalStateKeysOtherAppList,
  AkitaDAOGlobalStateKeysPluginAppList,
  AkitaDAOGlobalStateKeysSocialFees,
  AkitaDAOGlobalStateKeysStakingFees,
  AkitaDAOGlobalStateKeysSubscriptionFees,
  AkitaDAOGlobalStateKeysSwapFees,
} from '../../dao/constants'
import { ERR_NOT_AKITA_DAO } from '../../errors'
import { DIVISOR, IMPACT_DIVISOR } from '../constants'
import { ERR_INVALID_PERCENTAGE, ERR_INVALID_PERCENTAGE_OF_ARGS } from '../errors'
import { AkitaSocialImpact } from '../../arc58/plugins/impact/contract.algo'
import { Plugin } from './plugin'
import { SpendingAccountFactory } from '../types/spend-accounts'

const spendingAccountFactoryApp = TemplateVar<Application>('spendingAccountFactoryApp')

export class AkitaSubBaseContract extends Plugin {
  /** the current version of the contract */
  version = GlobalState<string>({ key: GlobalStateKeyVersion })
  /** the app ID of the Akita DAO */
  akitaDAO = GlobalState<Application>({ key: GlobalStateKeyAkitaDAO })

  @abimethod({ allowActions: ['UpdateApplication'] })
  updateApplication(newVersion: string): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.version.value = newVersion
  }

  updateAkitaDAO(app: uint64): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.akitaDAO.value = Application(app)
  }

  protected getAkitaAppList(): AkitaAppList {
    const [appListBytes] = op.AppGlobal.getExBytes(this.akitaDAO.value, Bytes(AkitaDAOGlobalStateKeysAkitaAppList))
    return decodeArc4<AkitaAppList>(appListBytes)
  }

  protected getPluginAppList(): PluginAppList {
    const [pluginAppListBytes] = op.AppGlobal.getExBytes(this.akitaDAO.value, Bytes(AkitaDAOGlobalStateKeysPluginAppList))
    return decodeArc4<PluginAppList>(pluginAppListBytes)
  }

  protected getOtherAppList(): OtherAppList {
    const [otherAppListBytes] = op.AppGlobal.getExBytes(this.akitaDAO.value, Bytes(AkitaDAOGlobalStateKeysOtherAppList))
    return decodeArc4<OtherAppList>(otherAppListBytes)
  }

  protected getSocialFees(): SocialFees {
    const [socialFeesBytes] = op.AppGlobal.getExBytes(this.akitaDAO.value, Bytes(AkitaDAOGlobalStateKeysSocialFees))
    return decodeArc4<SocialFees>(socialFeesBytes)
  }

  protected getStakingFees(): StakingFees {
    const [stakingFeesBytes] = op.AppGlobal.getExBytes(
      this.akitaDAO.value,
      Bytes(AkitaDAOGlobalStateKeysStakingFees)
    )
    return decodeArc4<StakingFees>(stakingFeesBytes)
  }

  protected getSubscriptionFees(): SubscriptionFees {
    const [subscriptionFeesBytes] = op.AppGlobal.getExBytes(
      this.akitaDAO.value,
      Bytes(AkitaDAOGlobalStateKeysSubscriptionFees)
    )
    return decodeArc4<SubscriptionFees>(subscriptionFeesBytes)
  }

  protected getSwapFees(): SwapFees {
    const [swapFeesBytes] = op.AppGlobal.getExBytes(this.akitaDAO.value, Bytes(AkitaDAOGlobalStateKeysSwapFees))
    return decodeArc4<SwapFees>(swapFeesBytes)
  }

  protected getNFTFees(): NFTFees {
    const [nftFeesBytes] = op.AppGlobal.getExBytes(this.akitaDAO.value, Bytes(AkitaDAOGlobalStateKeysNFTFees))
    return decodeArc4<NFTFees>(nftFeesBytes)
  }

  protected getAkitaAssets(): AkitaAssets {
    const [akitaAssetsBytes] = op.AppGlobal.getExBytes(this.akitaDAO.value, Bytes(AkitaDAOGlobalStateKeysAkitaAssets))
    return decodeArc4<AkitaAssets>(akitaAssetsBytes)
  }

  protected calcPercent(a: uint64, p: uint64): uint64 {
    assert(p <= DIVISOR, ERR_INVALID_PERCENTAGE)
    return op.divw(...op.mulw(a, p), DIVISOR)
  }

  protected percentageOf(a: uint64, b: uint64): uint64 {
    assert(a < b, ERR_INVALID_PERCENTAGE_OF_ARGS)
    return op.divw(...op.mulw(a, DIVISOR), b)
  }

  protected akitaSocialFee(impact: uint64): uint64 {
    const { impactTaxMin, impactTaxMax } = this.getSocialFees()
    return this.impactRange(impact, impactTaxMin, impactTaxMax)
  }

  /** calculates a point between two numbers in relation to user impact */
  protected impactRange(impact: uint64, min: uint64, max: uint64): uint64 {
    const minImpact: uint64 = (impact > 1) ? impact - 1 : 1
    return max - (((max - min) * minImpact) / IMPACT_DIVISOR)
  }
}

export class AkitaBaseContract extends AkitaSubBaseContract {
  protected getUserImpact(account: Account): uint64 {
    return abiCall(
      AkitaSocialImpact.prototype.getUserImpact,
      {
        appId: this.getPluginAppList().impact,
        args: [new Address(account)],
        fee: 0,
      }
    ).returnValue
  }

  protected walletID(): uint64 {
    return abiCall(
      SpendingAccountFactory.prototype.get,
      {
        appId: spendingAccountFactoryApp,
        args: [new Address(Txn.sender)],
        fee: 0,
      }
    ).returnValue
  }

  protected origin(): Account {
    const walletID = this.walletID()

    if (walletID === 0) {
      return Txn.sender
    }

    return this.getOriginAccount(Application(walletID))
  }
}