import { Contract } from '@algorandfoundation/tealscript';

import { MetaMerkles } from '../meta_merkles/meta_merkles.algo';
import { AkitaAppIDsMetaMerkles } from '../../utils/constants';

const errs = {
    INVALID_ARG_COUNT: 'Invalid number of arguments',
    // register
    ARG_ZERO_NOT_AN_ADDRESS: 'Argument at index 0 for merkle tree creator is not an address',
    ARG_ONE_NOT_32_BYTE_MERKLE_ROOT: 'Argument at index 1 is not a 32 byte merkle tree root',
    // checks
    ARG_ONE_NOT_AN_ADDRESS: 'Argument at index 1 for user is not an address',
}

const MERKLE_TREE_TYPE_ASSET = 1;

export const RegistryInfoLengthMinimum = len<Address>() + 1;
export type RegistryInfo = {
    creator: Address;
    name: string;
}

export const MerkleAssetGateCheckParamsLengthMinimum = len<Address>() + len<uint64>() + len<AssetID>() + 64;
export type MerkleAssetGateCheckParams = {
    user: Address;
    registryID: uint64;
    asset: AssetID;
    proof: bytes32[];
}

export class MerkleAssetGate extends Contract {
    programVersion = 10;

    registryCursor = GlobalStateKey<uint64>({ key: 'registry_cursor' });

    registry = BoxMap<uint64, RegistryInfo>();

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value;
        this.registryCursor.value += 1;
        return id;
    }

    register(args: bytes): uint64 {
        assert(args.length > len<Address>(), errs.INVALID_ARG_COUNT);
        const params = castBytes<RegistryInfo>(args);
        const id = this.newRegistryID();
        this.registry(id).value = params;
        return id;
    }

    check(args: bytes): boolean {
        assert(args.length >= (len<uint64>() + len<Address>() + len<AssetID>() + len<bytes32>()), errs.INVALID_ARG_COUNT);
        const params = castBytes<MerkleAssetGateCheckParams>(args);

        if (!(params.user.assetBalance(params.asset) > 0)) {
            return false;
        }

        const registryInfo = this.registry(params.registryID).value;

        return sendMethodCall<typeof MetaMerkles.prototype.verify, boolean>({
            applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
            methodArgs: [
                registryInfo.creator,
                registryInfo.name,
                sha256(sha256(itob(params.asset.id))),
                params.proof,
                MERKLE_TREE_TYPE_ASSET,
            ],
            fee: 0,
        });
    }
}