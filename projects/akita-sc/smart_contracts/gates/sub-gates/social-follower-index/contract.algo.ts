import { Account, Application, assert, assertMatch, BoxMap, bytes, clone, Global, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, decodeArc4, encodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { btoi } from '@algorandfoundation/algorand-typescript/op'
import { Uint64ByteLength } from '../../../utils/constants'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'
import { getAkitaSocialAppList } from '../../../utils/functions'
import {
  Equal,
  GreaterThan,
  GreaterThanOrEqualTo,
  LessThan,
  LessThanOrEqualTo,
  NotEqual,
} from '../../../utils/operators'
import { GateGlobalStateKeyCheckShape, GateGlobalStateKeyRegistrationShape, GateGlobalStateKeyRegistryCursor, UserOperatorValueRegistryMBR } from '../../constants'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { Operator } from '../../types'

// CONTRACT IMPORTS
import { AkitaSocialGraph } from '../../../social/graph.algo'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'


type SocialFollowerIndexGateRegistryInfo = {
  user: Account
  op: Operator
  value: uint64
}

/** [user: 32][op: 1][value: 8] */
const RegisterByteLength = 41

export class SocialFollowerIndexGate extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ initialValue: 1, key: GateGlobalStateKeyRegistryCursor })
  /** the abi string for the register args */
  registrationShape = GlobalState<string>({ initialValue: '(address,uint8,uint64)', key: GateGlobalStateKeyRegistrationShape })
  /** the abi string for the check args */
  checkShape = GlobalState<string>({ initialValue: 'uint64', key: GateGlobalStateKeyCheckShape })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, SocialFollowerIndexGateRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private followerIndexGate(user: Account, index: uint64, follower: Account, op: Operator, value: uint64): boolean {
    const isFollower = abiCall<typeof AkitaSocialGraph.prototype.isFollower>({
      appId: getAkitaSocialAppList(this.akitaDAO.value).graph,
      args: [user, index, follower],
    }).returnValue

    if (!isFollower) {
      return false
    }

    switch (op) {
      case Equal: return index === value
      case NotEqual: return index !== value
      case LessThan: return index < value
      case LessThanOrEqualTo: return index <= value
      case GreaterThan: return index > value
      case GreaterThanOrEqualTo: return index >= value
      default: return false
    }
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64, registrationShape: string, checkShape: string): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
    this.registryCursor.value = 1
    this.registrationShape.value = registrationShape
    this.checkShape.value = checkShape
  }

  // FOLLOWER INDEX GATE --------------------------------------------------------------------------

  cost(args: bytes): uint64 {
    return UserOperatorValueRegistryMBR
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length === RegisterByteLength, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: UserOperatorValueRegistryMBR
      },
      ERR_INVALID_PAYMENT
    )

    const id = this.newRegistryID()
    this.registry(id).value = decodeArc4<SocialFollowerIndexGateRegistryInfo>(args)
    return id
  }

  check(caller: Account, registryID: uint64, args: bytes): boolean {
    assert(args.length === Uint64ByteLength, ERR_INVALID_ARG_COUNT)
    const { user, op, value } = clone(this.registry(registryID).value)
    return this.followerIndexGate(
      user,
      btoi(args),
      caller,
      op,
      value
    )
  }

  getRegistrationShape(shape: SocialFollowerIndexGateRegistryInfo): SocialFollowerIndexGateRegistryInfo {
    return shape
  }

  @abimethod({ readonly: true })
  getEntry(registryID: uint64): bytes {
    return encodeArc4(this.registry(registryID).value)
  }
}
