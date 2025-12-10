import { Account, Application, assert, assertMatch, BoxMap, bytes, clone, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, decodeArc4, encodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AssetHolding, Global } from '@algorandfoundation/algorand-typescript/op'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'
import {
  Equal,
  GreaterThan,
  GreaterThanOrEqualTo,
  LessThan,
  LessThanOrEqualTo,
  NotEqual,
} from '../../../utils/operators'
import { AssetGateRegistryInfoByteLength, GateGlobalStateKeyCheckShape, GateGlobalStateKeyRegistrationShape, GateGlobalStateKeyRegistryCursor, OperatorAndValueRegistryMBR } from '../../constants'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { Operator } from '../../types'

type AssetGateRegistryInfo = {
  asset: uint64
  op: Operator
  value: uint64
}

export class AssetGate extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ initialValue: 1, key: GateGlobalStateKeyRegistryCursor })

  /** the abi string for the register args */
  registrationShape = GlobalState<string>({ initialValue: '(uint64,uint8,uint64)', key: GateGlobalStateKeyRegistrationShape })
  /** the abi string for the check args */
  checkShape = GlobalState<string>({ initialValue: '', key: GateGlobalStateKeyCheckShape })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, AssetGateRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  // gates based on holding an asset
  private assetGate(user: Account, asset: uint64, op: Operator, value: uint64): boolean {
    const [balance, optedIn] = AssetHolding.assetBalance(user, asset)

    if (!optedIn) {
      return false
    }

    switch (op) {
      case Equal: return balance === value
      case NotEqual: return balance !== value
      case LessThan: return balance < value
      case LessThanOrEqualTo: return balance <= value
      case GreaterThan: return balance > value
      case GreaterThanOrEqualTo: return balance >= value
      default: return false
    }
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------  

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // ASSET GATE METHODS ---------------------------------------------------------------------------

  cost(args: bytes): uint64 {
    return OperatorAndValueRegistryMBR
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length === AssetGateRegistryInfoByteLength, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: OperatorAndValueRegistryMBR
      },
      ERR_INVALID_PAYMENT
    )

    const id = this.newRegistryID()
    this.registry(id).value = decodeArc4<AssetGateRegistryInfo>(args)
    return id
  }

  check(caller: Account, registryID: uint64, args: bytes): boolean {
    assert(args.length === 0, ERR_INVALID_ARG_COUNT)
    const { asset, op, value } = clone(this.registry(registryID).value)
    return this.assetGate(caller, asset, op, value)
  }

  getRegistrationShape(shape: AssetGateRegistryInfo): AssetGateRegistryInfo {
    return shape
  }

  @abimethod({ readonly: true })
  getEntry(registryID: uint64): bytes {
    return encodeArc4(this.registry(registryID).value)
  }
}
