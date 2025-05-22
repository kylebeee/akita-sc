import { Application, Contract, GlobalState, itxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { abiCall, abimethod, DynamicArray } from "@algorandfoundation/algorand-typescript/arc4";
import { arc4GateFilter } from "../../../gates/types";
import { GateArgs } from "../../../utils/types/gates";
import { getSpendingAccount, rekeyAddress } from "../../../utils/functions";
import { Gate } from "../../../gates/contract.algo";
import { BaseGate } from "../../../gates/base";
import { fee } from "../../../utils/constants";

export const GatePluginGlobalStateKeyGateAppID = 'gate_app_id'

export class GatePlugin extends BaseGate {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  gateAppID = GlobalState<Application>({ key: GatePluginGlobalStateKeyGateAppID })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(gateAppID: uint64): void {
    this.gateAppID.value = Application(gateAppID)
  }

  // GATE PLUGIN METHODS --------------------------------------------------------------------------

  register(
    walletID: uint64,
    rekeyBack: boolean,
    filters: DynamicArray<arc4GateFilter>,
    args: GateArgs
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      Gate.prototype.register,
      {
        sender,
        appId: this.gateAppID.value,
        args: [
          itxn.payment({
            sender,
            receiver: this.gateAppID.value.address,
            amount: this.mbr(filters.length).gateRegistry,
            fee,
          }),
          filters,
          args,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }
}  