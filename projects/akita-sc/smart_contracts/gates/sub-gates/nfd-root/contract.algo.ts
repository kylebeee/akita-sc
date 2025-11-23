import { Account, Application, assert, assertMatch, BoxMap, Bytes, bytes, Global, GlobalState, gtxn, op, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod } from '@algorandfoundation/algorand-typescript/arc4'
import { btoi } from '@algorandfoundation/algorand-typescript/op'
import { BoxCostPerBox, Uint64ByteLength } from '../../../utils/constants'
import { NFDGlobalStateKeysName, NFDGlobalStateKeysParentAppID, NFDMetaKeyVerifiedAddresses } from '../../../utils/constants/nfd'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'
import { getOtherAppList } from '../../../utils/functions'
import { GateGlobalStateKeyCheckShape, GateGlobalStateKeyRegistrationShape, GateGlobalStateKeyRegistryCursor } from '../../constants'
import { ERR_INVALID_ARG_COUNT } from '../../errors'

// CONTRACT IMPORTS
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import type { NFD } from '../../../utils/types/nfd'
import type { NFDRegistry } from '../../../utils/types/nfd-registry'

const MinNFDRootGateRegistryMBR: uint64 = 5_700

export class NFDRootGate extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ initialValue: 1, key: GateGlobalStateKeyRegistryCursor })

  /** the abi string for the register args */
  registrationShape = GlobalState<string>({ initialValue: 'string', key: GateGlobalStateKeyRegistrationShape })
  /** the abi string for the check args */
  checkShape = GlobalState<string>({ initialValue: 'uint64', key: GateGlobalStateKeyCheckShape })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, string>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private nfdGate(user: Account, appID: uint64, root: string): boolean {
    const nfdName = op.AppGlobal.getExBytes(appID, Bytes(NFDGlobalStateKeysName))[0]
    const parentExists = op.AppGlobal.getExBytes(appID, Bytes(NFDGlobalStateKeysParentAppID))[1]

    const rootBytes = Bytes(root)
    if (
      parentExists &&
      rootBytes !== nfdName.slice(
        nfdName.length - (rootBytes.length + 5),
        nfdName.length - 5
      )
    ) {
      return false
    }

    const verified = abiCall<typeof NFDRegistry.prototype.isValidNfdAppId>({
      appId: getOtherAppList(this.akitaDAO.value).nfdRegistry,
      args: [String(nfdName), appID],
    }).returnValue

    if (!verified) {
      return false
    }

    const caAlgoData = abiCall<typeof NFD.prototype.readField>({
      appId: appID,
      args: [Bytes(NFDMetaKeyVerifiedAddresses)],
    }).returnValue

    let exists: boolean = false
    for (let i: uint64 = 0; i < caAlgoData.length; i += 32) {
      const addr = caAlgoData.slice(i, 32)
      if (addr === user.bytes) {
        exists = true
      }
    }

    return exists
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // NFD ROOT GATE METHODS ------------------------------------------------------------------------

  cost(args: bytes): uint64 {
    return MinNFDRootGateRegistryMBR + (BoxCostPerBox * args.length)
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length >= 0, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.cost(args)
      },
      ERR_INVALID_PAYMENT
    )

    const id = this.newRegistryID()
    this.registry(id).value = String(args)
    return id
  }

  check(caller: Account, registryID: uint64, args: bytes): boolean {
    assert(args.length === Uint64ByteLength, ERR_INVALID_ARG_COUNT)
    const root = this.registry(registryID).value
    return this.nfdGate(caller, btoi(args), root)
  }

  @abimethod({ readonly: true })
  getEntry(registryID: uint64): bytes {
    return Bytes(this.registry(registryID).value)
  }
}
