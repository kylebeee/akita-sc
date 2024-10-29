import { Contract } from '@algorandfoundation/tealscript';

const NFD_REGISTRY_ID = 0

const NFD_PARENT_APP_KEY = 'i.parentAppID';
const NFD_NAME_KEY = 'i.name';

const NFD_VALID_APP_ARG = 'is_valid_nfd_appid';

const NFD_READ_PROPERTY_ARG = 'read_property';
const NFD_VERIFIED_ADDRESSES_PROPERTY_NAME = 'v.caAlgo.0.as';

export class NFDGatePlugin extends Contract {
    programVersion = 10;

    nfdGate(user: Address, NFD: AppID, root: string): boolean {
        const nfdName = NFD.globalState(NFD_NAME_KEY) as bytes;

        if (
            root !== ''
            && NFD.globalStateExists(NFD_PARENT_APP_KEY)
            && root !== extract3(nfdName, (nfdName.length - (root.length + 5)), (nfdName.length - 5))
        ) {
            return false;
        }

        sendAppCall({
            applicationID: AppID.fromUint64(NFD_REGISTRY_ID),
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
}