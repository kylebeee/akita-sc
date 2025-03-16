import { arc4, assert, Bytes, bytes, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript"
import { AkitaBaseContract } from "../../../../utils/base_contracts/base.algo"
import { NFD_NAME_KEY, NFD_READ_PROPERTY_ARG, NFD_VALID_APP_ARG, NFD_VERIFIED_ADDRESSES_PROPERTY_NAME } from "./constants"
import { itob } from "@algorandfoundation/algorand-typescript/op"
import { decodeArc4, interpretAsArc4 } from "@algorandfoundation/algorand-typescript/arc4"
import { arc4NFDGateCheckParams } from "./types"
import { ERR_INVALID_ARG_COUNT } from "../../errors"

export class NFDGate extends AkitaBaseContract {

    private nfdGate(user: arc4.Address, NFD: uint64): boolean {
        const [nfdName] = op.AppGlobal.getExBytes(NFD, Bytes(NFD_NAME_KEY))

        // TODO: replace with itxn.abiCall when available
        const verifyTxn = itxn
            .applicationCall({
                appId: super.getAppList().nfdRegistry,
                appArgs: [
                    NFD_VALID_APP_ARG,
                    nfdName,
                    itob(NFD),
                ],
                apps: [NFD],
                fee: 0
            })
            .submit()

        const verified = decodeArc4<boolean>(verifyTxn.lastLog)

        if (!verified) {
            return false
        }

        const vaddressesTxn = itxn
            .applicationCall({
                appId: NFD,
                appArgs: [
                    NFD_READ_PROPERTY_ARG,
                    NFD_VERIFIED_ADDRESSES_PROPERTY_NAME
                ],
                fee: 0
            })
            .submit()

        const caAlgoData = vaddressesTxn.lastLog

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