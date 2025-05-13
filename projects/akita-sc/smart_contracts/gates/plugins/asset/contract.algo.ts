import { Application, arc4, assert, BoxMap, bytes, GlobalState, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Address, decodeArc4, interpretAsArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AssetHolding } from '@algorandfoundation/algorand-typescript/op'
import { Operator } from '../../types'
import {
  Equal,
  NotEqual,
  LessThan,
  LessThanOrEqualTo,
  GreaterThan,
  GreaterThanOrEqualTo,
} from '../../../utils/operators'
import { arc4AssetGateCheckParams, arc4RegistryInfo, AssetGateCheckParams, RegistryInfo } from './types'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'

export class AssetGate extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, arc4RegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  // gates based on holding an asset
  private assetGate(user: Address, asset: uint64, operator: Operator, value: uint64): boolean {
    const [balance, optedIn] = AssetHolding.assetBalance(user.native, asset)

    if (!optedIn) {
      return false
    }

    if (operator === Equal) {
      return balance === value
    }
    if (operator === NotEqual) {
      return balance !== value
    }
    if (operator === LessThan) {
      return balance < value
    }
    if (operator === LessThanOrEqualTo) {
      return balance <= value
    }
    if (operator === GreaterThan) {
      return balance > value
    }
    if (operator === GreaterThanOrEqualTo) {
      return balance >= value
    }

    return false
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------  

  @abimethod({ onCreate: 'require' })
  createApplication(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
    this.registryCursor.value = 0
  }

  // ASSET GATE METHODS ---------------------------------------------------------------------------

  register(args: bytes): uint64 {
    assert(args.length === 16, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4RegistryInfo>(args)
    const id = this.newRegistryID()
    this.registry(id).value = params.copy()
    return id
  }

  check(args: bytes): boolean {
    assert(args.length === 48, ERR_INVALID_ARG_COUNT)
    const params = decodeArc4<AssetGateCheckParams>(args)
    const info = decodeArc4<RegistryInfo>(this.registry(params.registryID).value.bytes)
    return this.assetGate(params.user, params.asset, info.op, info.value)
  }
}
