import { Contract } from '@algorandfoundation/tealscript';

import { META_MERKLE_APP_ID } from './gate.algo';
import { MetaMerkles } from '../metamerkles/metamerkles.algo';

const errs = {
    
    WRONG_ARG_COUNT: 'Wrong number of arguments',
    // register
    ARG_ZERO_NOT_AN_ADDRESS: 'Argument at index 0 for merkle tree creator is not an address',
    ARG_ONE_NOT_32_BYTE_MERKLE_ROOT: 'Argument at index 1 is not a 32 byte merkle tree root',
    // checks
    ARG_ONE_NOT_AN_ADDRESS: 'Argument at index 1 for user is not an address',
}

export interface RegistryInfo {
    rootCreator: Address;
    root: bytes32;
    schema: uint64;
    treeType: uint64;
}

export class merkleGatePlugin extends Contract {
    programVersion = 10;

    registryCounter = GlobalStateKey<uint64>({ key: 'c' });

    registry = BoxMap<uint64, RegistryInfo>();

    register(args: bytes): uint64 {
        assert(args.length === 64, errs.WRONG_ARG_COUNT);

        const counter = this.registryCounter.value
        this.registry(counter).value = {
            rootCreator: Address.fromBytes(extract3(args, 0, 32)),
            root: extract3(args, 32, 32) as bytes32,
            schema: extractUint64(args, 64),
            treeType: extractUint64(args, 72),
        }
        this.registryCounter.value += 1;
        return counter;
    }
    
    // registryIndex: uint64, user: Address, asset: AssetID, proof: bytes32[]
    check(args: bytes): boolean {
        assert(args.length >= 80, errs.WRONG_ARG_COUNT);
        
        const registryIndex = extractUint64(args, 0);
        const user = Address.fromBytes(extract3(args, 8, 32));
        const asset = AssetID.fromUint64(extractUint64(args, 40));

        if (!(user.assetBalance(asset) > 0)) {
            return false;
        }

        let proof: bytes32[] = [];
        for (let i = 48; i < args.length; i += 32) {
            proof.push(extract3(args, i, 32) as bytes32);
        }

        const registryInfo = this.registry(registryIndex).value;

        return sendMethodCall<typeof MetaMerkles.prototype.verify, boolean>({
            applicationID: AppID.fromUint64(META_MERKLE_APP_ID),
            methodArgs: [
                registryInfo.rootCreator,
                registryInfo.root,
                sha256(sha256(itob(asset.id))),
                proof,
                registryInfo.treeType
            ],
            fee: 0,
        });
    }
}