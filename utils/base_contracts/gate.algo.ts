import { arc4, bytes, itxn, OnCompleteAction, uint64 } from '@algorandfoundation/algorand-typescript';
import { Gate } from '../../contracts/gates/gate.algo';
import { ContractWithArc58Send, ContractWithArc59Send, ContractWithCreatorOnlyOptIn, ContractWithCreatorOnlyOptInAndArc59, ContractWithCreatorOnlyOptInAndArc59AndArc58, ContractWithOptIn } from './optin.algo';
import { classes } from 'polytype'
import { decodeArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4';
import { AkitaBaseContract } from './base.algo';
import { GateArgs } from '../types/gates';

export class ContractWithGate extends AkitaBaseContract {

  protected gate(caller: Address, index: uint64, args: GateArgs): boolean {
    if (index === 0) {
      return true
    }

    // TODO: replace with itxn.abiCall when available
    const appCallTxn = itxn
      .applicationCall({
        appId: super.getAppList().gate,
        onCompletion: OnCompleteAction.NoOp,
        appArgs: [
          methodSelector(typeof Gate.prototype.check),
          caller,
          index,
          args,
        ],
        accounts: [caller.native],
        fee: 0,
      })
      .submit()

    return decodeArc4<boolean>(appCallTxn.lastLog)
  }
}

export class ContractWithOptinAndGate extends classes(ContractWithOptIn, ContractWithGate) { }

export class ContractWithOptinAndArc59AndGate
  extends classes(
    ContractWithGate,
    ContractWithArc59Send,
  ) { }

export class ContractWithOptinAndArc58AndGate
  extends classes(
    ContractWithGate,
    ContractWithArc58Send,
  ) { }

export class ContractWithCreatorOnlyOptInAndGate extends classes(ContractWithCreatorOnlyOptIn, ContractWithGate) { }

export class ContractWithCreatorOnlyOptInAndArc59AndGate
  extends classes(
    ContractWithGate,
    ContractWithCreatorOnlyOptInAndArc59,
  ) { }

export class ContractWithCreatorOnlyOptInAndArc59AndArc58AndGate
  extends classes(
    ContractWithGate,
    ContractWithCreatorOnlyOptInAndArc59AndArc58,
  ) { }