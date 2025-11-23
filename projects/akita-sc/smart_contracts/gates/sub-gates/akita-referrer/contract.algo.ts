import { Account, Application, assert, assertMatch, BoxMap, bytes, clone, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, decodeArc4, encodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { btoi, Global } from '@algorandfoundation/algorand-typescript/op'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'
import { getAkitaAppList, getOtherAppList, getReferrerAccount } from '../../../utils/functions'
import { GateGlobalStateKeyCheckShape, GateGlobalStateKeyRegistrationShape, GateGlobalStateKeyRegistryCursor } from '../../constants'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { AkitaReferrerGateRegistryMBR } from './constants'
import { ERR_INVALID_WALLET_ID } from './errors'

// CONTRACT IMPORTS
import type { EscrowFactory } from '../../../escrow/factory.algo'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'


export type AkitaReferrerGateRegistryInfo = {
  referrer: Account
}

export class AkitaReferrerGate extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ initialValue: 1, key: GateGlobalStateKeyRegistryCursor })

  /** the abi string for the register args */
  registrationShape = GlobalState<string>({ initialValue: 'address', key: GateGlobalStateKeyRegistrationShape })
  /** the abi string for the check args */
  checkShape = GlobalState<string>({ initialValue: '', key: GateGlobalStateKeyCheckShape })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, AkitaReferrerGateRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private referrerGate(wallet: Application, referrer: Account): boolean {
    const { wallet: factory } = getAkitaAppList(this.akitaDAO.value)
    const fetchedReferrer = getReferrerAccount(wallet)

    return (
      wallet.creator === Application(factory).address &&
      fetchedReferrer === referrer
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
    return AkitaReferrerGateRegistryMBR
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length === 32, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: AkitaReferrerGateRegistryMBR
      },
      ERR_INVALID_PAYMENT
    )
    
    const id = this.newRegistryID()
    this.registry(id).value = decodeArc4<AkitaReferrerGateRegistryInfo>(args)
    return id
  }

  check(caller: Account, registryID: uint64, args: bytes): boolean {
    assert(args.length === 8, ERR_INVALID_ARG_COUNT)
    
    const { referrer } = clone(this.registry(registryID).value)
    const wallet = Application(btoi(args))

    const appId = getOtherAppList(this.akitaDAO.value).escrow

    const id = abiCall<typeof EscrowFactory.prototype.mustGet>({
      appId,
      args: [caller]
    }).returnValue

    assert(id === args, ERR_INVALID_WALLET_ID)

    return this.referrerGate(wallet, referrer)
  }

  @abimethod({ readonly: true })
  getEntry(registryID: uint64): bytes {
    return encodeArc4(this.registry(registryID).value)
  }
}
