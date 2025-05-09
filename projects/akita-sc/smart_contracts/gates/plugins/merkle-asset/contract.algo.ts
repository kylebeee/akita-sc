import { assert, BoxMap, bytes, GlobalState, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, decodeArc4, interpretAsArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AssetHolding, itob, sha256 } from '@algorandfoundation/algorand-typescript/op'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { arc4MerkleAssetGateCheckParams, arc4MerkleAssetRegistryInfo } from './types'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { MetaMerkles } from '../../../meta-merkles/contract.algo'
import { bytes32, str } from '../../../utils/types/base'
import { MerkleAssetRegistryInfo } from './types'
import { MerkleTreeTypeCollection } from '../../../meta-merkles/constants'

export class MerkleAssetGate extends AkitaBaseContract {
    programVersion = 10

    registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

    registry = BoxMap<uint64, arc4MerkleAssetRegistryInfo>({ keyPrefix: '' })

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value
        this.registryCursor.value += 1
        return id
    }

    register(args: bytes): uint64 {
        // arc4MerkleAssetRegistryInfo contains a dynamic string
        // so we need to check that the length of the arguments is at least the length of the static part
        // of the struct plus 1 byte (the smallest length of a string)
        assert(args.length > arc4MerkleAssetRegistryInfo.length + 1, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4MerkleAssetRegistryInfo>(args)
        const id = this.newRegistryID()
        this.registry(id).value = params
        return id
    }

    check(args: bytes): boolean {
        // arc4MerkleAssetGateCheckParams contains a dynamic array of proofs
        // so we need to check that the length of the arguments is at least the length of the static part
        // of the struct plus 64 bytes (the smallest length of a single proof)
        assert(args.length >= arc4MerkleAssetGateCheckParams.length + 64, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4MerkleAssetGateCheckParams>(args)

        const [holdings, optedIn] = AssetHolding.assetBalance(params.user.native, params.asset.native)
        if (!optedIn || holdings === 0) {
            return false
        }

        const registryInfo = decodeArc4<MerkleAssetRegistryInfo>(this.registry(params.registryID.native).value.bytes)

        return abiCall(MetaMerkles.prototype.verify, {
            appId: super.getAkitaAppList().metaMerkles,
            args: [
                registryInfo.creator,
                registryInfo.name,
                bytes32(sha256(sha256(itob(params.asset.native)))),
                params.proof,
                MerkleTreeTypeCollection,
            ],
        }).returnValue
    }
}
