import { assert, BoxMap, bytes, GlobalState, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, decodeArc4, interpretAsArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { sha256 } from '@algorandfoundation/algorand-typescript/op'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { arc4MerkleAddressGateCheckParams, arc4MerkleAddressRegistryInfo, MerkleAddressRegistryInfo } from './types'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { MetaMerkles } from '../../../meta-merkles/contract.algo'
import { bytes32 } from '../../../utils/types/base'
import { MerkleTreeTypeUnspecified } from '../../../meta-merkles/constants'

export class MerkleAddressGate extends AkitaBaseContract {
    registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

    registry = BoxMap<uint64, arc4MerkleAddressRegistryInfo>({ keyPrefix: '' })

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value
        this.registryCursor.value += 1
        return id
    }

    register(args: bytes): uint64 {
        // arc4MerkleAddressRegistryInfo contains a dynamic string
        // so we need to check that the length of the arguments is at least the length of the static part
        // of the struct plus 1 byte (the smallest length of a string)
        assert(args.length >= arc4MerkleAddressRegistryInfo.length + 1, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4MerkleAddressRegistryInfo>(args)
        const id = this.newRegistryID()
        this.registry(id).value = params
        return id
    }

    check(args: bytes): boolean {
        // arc4MerkleAddressGateCheckParams contains a dynamic array of proofs
        // so we need to check that the length of the arguments is at least the length of the static part
        // of the struct plus 64 bytes (the smallest length of a single proof)
        assert(args.length >= arc4MerkleAddressGateCheckParams.length + 64, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4MerkleAddressGateCheckParams>(args)
        const registryInfo = decodeArc4<MerkleAddressRegistryInfo>(this.registry(params.registryID.native).value.bytes)

        return abiCall(MetaMerkles.prototype.verify, {
            appId: super.getAkitaAppList().metaMerkles,
            args: [
                registryInfo.creator,
                registryInfo.name,
                bytes32(sha256(sha256(params.user.bytes))),
                params.proof,
                MerkleTreeTypeUnspecified,
            ],
        }).returnValue
    }
}
