import { Contract } from '@algorandfoundation/tealscript';
import { Gate } from '../../contracts/gates/gate.algo';
import { AkitaAppIDsGate } from '../constants';
import { ContractWithOptInCreatorOnly } from './optin.algo';

export class ContractWithGate extends Contract {
    protected gate(index: uint64, args: bytes[]): boolean {
        if (index === 0) {
            return true;
        }

        return sendMethodCall<typeof Gate.prototype.check, boolean>({
            applicationID: AppID.fromUint64(AkitaAppIDsGate),
            methodArgs: [index, args],
            fee: 0
        });
    }
}

export class ContractWithOptInCreatorOnlyAndGate extends ContractWithOptInCreatorOnly {
    protected gate(index: uint64, args: bytes[]): boolean {
        if (index === 0) {
            return true;
        }

        return sendMethodCall<typeof Gate.prototype.check, boolean>({
            applicationID: AppID.fromUint64(AkitaAppIDsGate),
            methodArgs: [index, args],
            fee: 0
        });
    }
}