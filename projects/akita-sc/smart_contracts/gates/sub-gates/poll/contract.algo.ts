import { Application, assert, assertMatch, BoxMap, bytes, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4, encodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { btoi, Global } from '@algorandfoundation/algorand-typescript/op'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { GateGlobalStateKeyCheckShape, GateGlobalStateKeyRegistrationShape, GateGlobalStateKeyRegistryCursor } from '../../constants'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'
import { getOtherAppList } from '../../../utils/functions'
import { Poll } from '../../../poll/contract.algo'
import { PollGateRegistryMBR } from './constants'

export type PollGateRegistryInfo = {
  poll: uint64
}

export class PollGate extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ initialValue: 1, key: GateGlobalStateKeyRegistryCursor })

  /** the abi string for the register args */
  registrationShape = GlobalState<string>({ initialValue: 'uint64', key: GateGlobalStateKeyRegistrationShape })
  /** the abi string for the check args */
  checkShape = GlobalState<string>({ initialValue: '', key: GateGlobalStateKeyCheckShape })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, PollGateRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private pollGate(user: Address, appId: Application): boolean {
    const { poll } = getOtherAppList(this.akitaDAO.value)

    const voted = abiCall<typeof Poll.prototype.hasVoted>({
        appId,
        args: [user],
    }).returnValue

    return (
      appId.creator === Application(poll).address &&
      voted
    )
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------  

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // ASSET GATE METHODS ---------------------------------------------------------------------------

  cost(args: bytes): uint64 {
    return PollGateRegistryMBR
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length === 8, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: PollGateRegistryMBR
      },
      ERR_INVALID_PAYMENT
    )
    
    const id = this.newRegistryID()
    this.registry(id).value = decodeArc4<PollGateRegistryInfo>(args)
    return id
  }

  check(caller: Address, registryID: uint64, args: bytes): boolean {
    assert(args.length === 0, ERR_INVALID_ARG_COUNT)
    
    const { poll } = this.registry(registryID).value

    return this.pollGate(caller, Application(poll))
  }

  @abimethod({ readonly: true })
  getEntry(registryID: uint64): bytes {
    return encodeArc4(this.registry(registryID).value)
  }
}
