import { assert, BoxMap, Bytes, bytes, GlobalState, op, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, Address, interpretAsArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { arc4NFDRootGateCheckParams, arc4NFDRootRegistryInfo } from '../nfd/types'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { NFD_NAME_KEY, NFD_PARENT_APP_KEY, NFD_VERIFIED_ADDRESSES_PROPERTY_NAME } from './constants'
import { NFDRegistry } from '../../../utils/types/nfd-registry'
import { NFD } from '../../../utils/types/nfd'

export class NFDGate extends AkitaBaseContract {
    registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

    registry = BoxMap<uint64, arc4NFDRootRegistryInfo>({ keyPrefix: '' })

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value
        this.registryCursor.value += 1
        return id
    }

    private nfdGate(user: Address, appID: uint64, root: bytes): boolean {
        const [nfdName] = op.AppGlobal.getExBytes(appID, Bytes(NFD_NAME_KEY))
        const [_, parentExists] = op.AppGlobal.getExBytes(appID, Bytes(NFD_PARENT_APP_KEY))

        if (parentExists && root !== nfdName.slice(nfdName.length - (root.length + 5), nfdName.length - 5)) {
            return false
        }

        const verified = abiCall(NFDRegistry.prototype.isValidNfdAppId, {
            appId: super.getOtherAppList().nfdRegistry,
            args: [String(nfdName), appID],
            fee: 0,
        }).returnValue

        if (!verified) {
            return false
        }

        const caAlgoData = abiCall(NFD.prototype.readField, {
            appId: appID,
            args: [Bytes(NFD_VERIFIED_ADDRESSES_PROPERTY_NAME)],
            fee: 0,
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

    register(args: bytes): uint64 {
        assert(args.length >= 0, ERR_INVALID_ARG_COUNT)
        const id = this.newRegistryID()
        this.registry(id).value = interpretAsArc4<arc4NFDRootRegistryInfo>(args)
        return id
    }

    check(args: bytes): boolean {
        assert(args.length === arc4NFDRootGateCheckParams.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4NFDRootGateCheckParams>(args)
        const root = this.registry(params.registryID.native).value.root

        return this.nfdGate(params.user, params.NFD.native, root.bytes)
    }
}
