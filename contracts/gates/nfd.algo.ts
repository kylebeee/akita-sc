import { Contract } from '@algorandfoundation/tealscript';
import { OtherAppIDsNFDRegistry } from '../../utils/constants';

const errs = {
    INVALID_ARG_COUNT: 'Invalid number of arguments',
}

const NFD_NAME_KEY = 'i.name';

const NFD_VALID_APP_ARG = 'is_valid_nfd_appid';

const NFD_READ_PROPERTY_ARG = 'read_property';
const NFD_VERIFIED_ADDRESSES_PROPERTY_NAME = 'v.caAlgo.0.as';

export const NFDGateCheckParamsLength = len<Address>() + len<AppID>();
export type NFDGateCheckParams = {
    user: Address;
    NFD: AppID;
}

export class NFDGate extends Contract {
    programVersion = 10;

    private nfdGate(user: Address, NFD: AppID): boolean {
        const nfdName = NFD.globalState(NFD_NAME_KEY) as bytes;

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
        return 0;
    }

    check(args: bytes): boolean {
        assert(args.length === NFDGateCheckParamsLength, errs.INVALID_ARG_COUNT);
        const params = castBytes<NFDGateCheckParams>(args);
        return this.nfdGate(params.user, params.NFD);
    }
}