import { arc4, assert, Bytes, bytes, itxn, op, uint64 } from '@algorandfoundation/algorand-typescript'
import { itob } from '@algorandfoundation/algorand-typescript/op'
import { abiCall, Address, decodeArc4, interpretAsArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../../utils/base_contracts/base.algo'
import {
    NFD_NAME_KEY,
    NFD_READ_PROPERTY_ARG,
    NFD_VALID_APP_ARG,
    NFD_VERIFIED_ADDRESSES_PROPERTY_NAME,
} from './constants'
import { arc4NFDGateCheckParams } from './types'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { NFDRegistry } from '../../../../utils/types/nfd_registry'
import { NFD } from '../../../../utils/types/nfd'

export class NFDGate extends AkitaBaseContract {
    private nfdGate(user: Address, appID: uint64): boolean {
        const [nfdName] = op.AppGlobal.getExBytes(appID, Bytes(NFD_NAME_KEY))

        const verified = abiCall(NFDRegistry.prototype.isValidNfdAppId, {
            appId: super.getAppList().nfdRegistry,
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
        return 0
    }

    check(args: bytes): boolean {
        assert(args.length === arc4NFDGateCheckParams.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4NFDGateCheckParams>(args)
        return this.nfdGate(params.user, params.NFD.native)
    }
}
