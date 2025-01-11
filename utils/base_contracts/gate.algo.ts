import { Contract } from '@algorandfoundation/tealscript';
import { Gate } from '../../contracts/gates/gate.algo';
import { AkitaAppIDsGate } from '../constants';
import { ContractWithOptInCreatorOnly, ContractWithOptInCreatorOnlyArc59, ContractWithOptInCreatorOnlyArc59AndArc58 } from './optin.algo';

export class ContractWithGate extends Contract {
    programVersion = 10;

    protected gate(caller: Address, index: uint64, args: bytes[]): boolean {
        if (index === 0) {
            return true;
        }

        return sendMethodCall<typeof Gate.prototype.check, boolean>({
            applicationID: AppID.fromUint64(AkitaAppIDsGate),
            methodArgs: [caller, index, args],
            fee: 0
        });
    }
}

export class ContractWithOptInCreatorOnlyAndGate extends Contract.extend(ContractWithOptInCreatorOnly, ContractWithGate) {}

export class ContractWithOptInCreatorOnlyArc59AndGate
    extends Contract.extend(
        ContractWithGate,
        ContractWithOptInCreatorOnlyArc59,
    ) {}

export class ContractWithOptInCreatorOnlyArc59AndArc58AndGate
    extends Contract.extend(
        ContractWithGate,
        ContractWithOptInCreatorOnlyArc59AndArc58,
    ) {}