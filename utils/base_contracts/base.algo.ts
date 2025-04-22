import { Application, assert, Bytes, GlobalState, op, Txn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract, decodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { GlobalStateKeyAkitaDAO, GlobalStateKeyVersion } from '../../contracts/constants'
import { AppList, NFTFees, SocialFees, StakingFees, SubscriptionFees } from '../../contracts/dao/types'
import {
  AkitaDAOGlobalStateKeysAppList,
  AkitaDAOGlobalStateKeysNFTFees,
  AkitaDAOGlobalStateKeysSocialFees,
  AkitaDAOGlobalStateKeysStakingFees,
  AkitaDAOGlobalStateKeysSubscriptionFees,
} from '../../contracts/dao/constants'
import { ERR_NOT_AKITA_DAO } from '../../contracts/errors'
import { DIVISOR, IMPACT_DIVISOR } from '../constants'
import { ERR_INVALID_PERCENTAGE, ERR_INVALID_PERCENTAGE_OF_ARGS } from '../errors'

export class AkitaBaseContract extends Contract {
  version = GlobalState<string>({ key: GlobalStateKeyVersion })

  akitaDAO = GlobalState<Application>({ key: GlobalStateKeyAkitaDAO })

  // @ts-ignore
  @abimethod({ allowActions: ['UpdateApplication'] })
  updateApplication(newVersion: string): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.version.value = newVersion
  }

  updateAkitaDAO(app: uint64): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.akitaDAO.value = Application(app)
  }

  protected getAppList(): AppList {
    const [appListBytes] = op.AppGlobal.getExBytes(this.akitaDAO.value, Bytes(AkitaDAOGlobalStateKeysAppList))
    return decodeArc4<AppList>(appListBytes)
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

  protected getNFTFees(): NFTFees {
    const [nftFeesBytes] = op.AppGlobal.getExBytes(this.akitaDAO.value, Bytes(AkitaDAOGlobalStateKeysNFTFees))
    return decodeArc4<NFTFees>(nftFeesBytes)
  }

  protected calcPercent(a: uint64, p: uint64): uint64 {
    assert(p <= DIVISOR, ERR_INVALID_PERCENTAGE)
    return op.divw(...op.mulw(a, p), DIVISOR)
  }

  protected percentageOf(a: uint64, b: uint64): uint64 {
    assert(a < b, ERR_INVALID_PERCENTAGE_OF_ARGS)
    return op.divw(...op.mulw(a, DIVISOR), b)
  }

  protected akitaTaxRate(impact: uint64): uint64 {
    const { impactTaxMax, impactTaxMin } = this.getSocialFees()
    const difference: uint64 = impactTaxMax - impactTaxMin
    const minImpact: uint64 = (impact > 1) ? impact - 1 : 1
    return impactTaxMax - ((difference * minImpact) / IMPACT_DIVISOR)
  }
}
