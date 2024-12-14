import { Contract } from '@algorandfoundation/tealscript';
import { Gate } from '../gates/gate.algo';
import { AkitaAppIDsGate } from '../../utils/constants';

export class Action extends Contract {

    gateIndex = GlobalStateKey<uint64>({ key: 'g' });

    private gate(filterIndex: uint64, args: bytes[]): boolean {
        return sendMethodCall<typeof Gate.prototype.check, boolean>({
            applicationID: AppID.fromUint64(AkitaAppIDsGate),
            methodArgs: [
                filterIndex,
                args,
            ],
            fee: 0
        });
    }

    call(gateArgs: bytes[], args: bytes): void {
        assert(this.gate(this.gateIndex.value, gateArgs), 'Gate check failed');

    }
}
