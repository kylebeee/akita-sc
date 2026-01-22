import { Account, Application, assert, assertMatch, BoxMap, bytes, clone, Global, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, decodeArc4, encodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
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
  /** the abi string for the check args - no args needed, index is looked up automatically */
  checkShape = GlobalState<string>({ initialValue: '', key: GateGlobalStateKeyCheckShape })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, SocialFollowerIndexGateRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private followerIndexGate(user: Account, follower: Account, op: Operator, value: uint64): boolean {
    const graph = getAkitaSocialAppList(this.akitaDAO.value).graph
    
    // Check if follower is actually following the user
    const isFollowing = abiCall<typeof AkitaSocialGraph.prototype.isFollowing>({
      appId: graph,
      args: [follower, user],
    }).returnValue

    if (!isFollowing) {
      return false
    }

    // Get the follow index from the box value
    const index = abiCall<typeof AkitaSocialGraph.prototype.getFollowIndex>({
      appId: graph,
      args: [follower, user],
    }).returnValue

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
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
    this.registryCursor.value = 1
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
    // No args needed - the follow index is looked up automatically from the graph
    const { user, op, value } = clone(this.registry(registryID).value)
    return this.followerIndexGate(
      user,
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
