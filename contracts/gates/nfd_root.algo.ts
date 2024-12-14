import { Contract } from '@algorandfoundation/tealscript';
import { OtherAppIDsNFDRegistry } from '../../utils/constants';

const errs = {
    INVALID_ARG_COUNT: 'Invalid number of arguments',
}

const NFD_PARENT_APP_KEY = 'i.parentAppID';
const NFD_NAME_KEY = 'i.name';

const NFD_VALID_APP_ARG = 'is_valid_nfd_appid';

const NFD_READ_PROPERTY_ARG = 'read_property';
const NFD_VERIFIED_ADDRESSES_PROPERTY_NAME = 'v.caAlgo.0.as';

export type RegistryInfo = {
    root: string;
}

export const NFDRootGateCheckParamsLength = len<uint64>() + len<Address>() + len<AppID>();
export type NFDRootGateCheckParams = {
    registryIndex: uint64;
    user: Address;
    NFD: AppID;
}

export class NFDGate extends Contract {
    programVersion = 10;

    registryCounter = GlobalStateKey<uint64>({ key: 'c' });

    registry = BoxMap<uint64, RegistryInfo>();

    private nfdGate(user: Address, NFD: AppID, root: string): boolean {
        const nfdName = NFD.globalState(NFD_NAME_KEY) as bytes;

        if (
            NFD.globalStateExists(NFD_PARENT_APP_KEY)
            && root !== extract3(nfdName, (nfdName.length - (root.length + 5)), (nfdName.length - 5))
        ) {
            return false;
        }

        sendAppCall({
            applicationID: AppID.fromUint64(OtherAppIDsNFDRegistry),
            applicationArgs: [
                NFD_VALID_APP_ARG,
                nfdName,
                itob(NFD.id),
            ],
            applications: [NFD],
            fee: 0,
        });

        if (btoi(this.itxn.lastLog) === 0) {
            return false;
        }

        sendAppCall({
            applicationID: NFD,
            applicationArgs: [
                NFD_READ_PROPERTY_ARG,
                NFD_VERIFIED_ADDRESSES_PROPERTY_NAME,
            ],
            fee: 0,
        });

        const caAlgoData = this.itxn.lastLog;
        let exists: boolean = false;
        for (let i = 0; i < caAlgoData.length; i += 32) {
            const addr = extract3(caAlgoData, i, 32);
            if (addr !== rawBytes(globals.zeroAddress) && addr === rawBytes(user)) {
                exists = true;
            }
        }

        if (exists) {
            return true;
        }

        return false;
    }

    register(args: bytes): uint64 {
        assert(args.length >= 0, errs.INVALID_ARG_COUNT);
        const counter = this.registryCounter.value;
        this.registry(counter).value = castBytes<RegistryInfo>(args);
        this.registryCounter.value += 1;
        return counter;
    }

    check(args: bytes): boolean {
        assert(args.length === NFDRootGateCheckParamsLength, errs.INVALID_ARG_COUNT);
        const params = castBytes<NFDRootGateCheckParams>(args);
        const root = this.registry(params.registryIndex).value.root;

        return this.nfdGate(params.user, params.NFD, root);
    }
}