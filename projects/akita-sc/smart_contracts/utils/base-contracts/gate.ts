import { uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, Address } from '@algorandfoundation/algorand-typescript/arc4'
import { Gate } from '../../gates/contract.algo'
import { AkitaBaseContract, AkitaSubBaseContract } from './base'
import { GateArgs } from '../types/gates'

export class SubContractWithGate extends AkitaSubBaseContract {
    protected gate(caller: Address, id: uint64, args: GateArgs): boolean {
        if (id === 0) {
            return true
        }

        return abiCall(Gate.prototype.check, {
            appId: super.getAkitaAppList().gate,
            args: [caller, id, args],
            fee: 0,
        }).returnValue
    }
}

export class ContractWithGate extends AkitaBaseContract {
    protected gate(caller: Address, id: uint64, args: GateArgs): boolean {
        if (id === 0) {
            return true
        }

        return abiCall(Gate.prototype.check, {
            appId: super.getAkitaAppList().gate,
            args: [caller, id, args],
            fee: 0,
        }).returnValue
    }
}

// export class ContractWithOptinAndGate extends classes(ContractWithOptIn, ContractWithGate) {}

// export class ContractWithOptinAndArc59AndGate extends classes(ContractWithGate, ContractWithArc59Send) {}

// export class ContractWithOptinAndArc58AndGate extends classes(ContractWithGate, ContractWithArc58Send) {}

// export class ContractWithCreatorOnlyOptInAndGate extends classes(ContractWithCreatorOnlyOptIn, ContractWithGate) {}

// export class ContractWithCreatorOnlyOptInAndArc59AndGate extends classes(
//     ContractWithGate,
//     ContractWithCreatorOnlyOptInAndArc59
// ) {}

// export class ContractWithCreatorOnlyOptInAndArc59AndArc58AndGate extends classes(
//     ContractWithGate,
//     ContractWithCreatorOnlyOptInAndArc59AndArc58
// ) {}
