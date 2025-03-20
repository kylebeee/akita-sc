import { arc4, assert, BoxMap, bytes, Contract, ensureBudget, GlobalState, itxn, OnCompleteAction, uint64 } from "@algorandfoundation/algorand-typescript";
import { AkitaBaseContract } from "../../utils/base_contracts/base.algo";
import { GateBoxPrefixAppRegistry, GateBoxPrefixGateRegistry, GateGlobalStateKeyCursor } from "./constants";
import { Address, decodeArc4, methodSelector, StaticBytes } from "@algorandfoundation/algorand-typescript/arc4";
import { AND, arc4GateFilter, arc4GateFilterEntry, OR } from "./types";
import { GateArgs } from "../../utils/types/gates";

class MockGate extends Contract {
  register(args: bytes): uint64 { return 0 }
  check(args: bytes): boolean { return false }
}

export class Gate extends AkitaBaseContract {

  gateCursor = GlobalState<uint64>({ key: GateGlobalStateKeyCursor });

  appRegistry = BoxMap<arc4.UintN64, StaticBytes<0>>({ keyPrefix: GateBoxPrefixAppRegistry });

  gateRegistry = BoxMap<arc4.UintN64, arc4.DynamicArray<arc4GateFilterEntry>>({ keyPrefix: GateBoxPrefixGateRegistry });

  private newGateID(): arc4.UintN64 {
    const id = this.gateCursor.value
    this.gateCursor.value += 1
    return new arc4.UintN64(id)
  }

  private evaluate(
    caller: Address,
    filters: arc4.DynamicArray<arc4GateFilterEntry>,
    start: uint64,
    end: uint64,
    args: GateArgs
  ): boolean {
    if (start > end) return true;

    let result = this.evaluateFilter(caller, filters[start], args[start].native)

    ensureBudget(100 * (end - start))

    for (let i = start; i < end; i += 1) {

      const currentOperator = filters[i].logicalOperator
      const nextResult = this.evaluateFilter(caller, filters[i + 1], args[i + 1].native)

      if (currentOperator.native === AND) {
        result = result && nextResult;
      } else if (currentOperator.native === OR) {
        result = result || nextResult;
      }

      // Handle nested logic
      if (i + 1 < end && filters[i + 2].layer.native > filters[i + 1].layer.native) {
        const nestedEnd = this.findEndOfLayer(filters, i + 2, filters[i + 2].layer.native);
        const nestedResult = this.evaluate(caller, filters, i + 2, nestedEnd, args);

        if (currentOperator.native === AND) {
          result = result && nestedResult;
        } else if (currentOperator.native === OR) {
          result = result || nestedResult;
        }

        i = nestedEnd;
      }
    }

    return result;
  }

  private evaluateFilter(caller: Address, filter: arc4GateFilterEntry, args: bytes): boolean {
    const argsWithCaller = caller.bytes.concat(args)

    // TODO: replace with itxn.abiCall when available
    const result = itxn
      .applicationCall({
        appId: filter.app.native,
        onCompletion: OnCompleteAction.NoOp,
        appArgs: [
          methodSelector(MockGate.prototype.check),
          argsWithCaller,
        ],
        accounts: [caller.native],
        fee: 0,
      })
      .submit()

    return decodeArc4<boolean>(result.lastLog);
  }

  private findEndOfLayer(filters: arc4.DynamicArray<arc4GateFilterEntry>, start: uint64, layer: uint64): uint64 {
    let end = start;
    for (let i = start; i < filters.length; i += 1) {
      if (filters[i].layer.native < layer) {
        break;
      }
      end = i;
    }
    return end;
  }

  createApplication(): void {
    this.gateCursor.value = 0;
  }

  register(filters: arc4.DynamicArray<arc4GateFilter>, args: bytes[]): arc4.UintN64 {
    const entries = new arc4.DynamicArray<arc4GateFilterEntry>()
    let lastFilterLayer: uint64 = 0
    for (let i: uint64 = 0; i < filters.length; i += 1) {
      assert(this.appRegistry(filters[i].app).exists)
      assert(filters[i].layer.native >= lastFilterLayer)
      lastFilterLayer = filters[i].layer.native

      // TODO: replace with itxn.abiCall when available
      const registerTxn = itxn
        .applicationCall({
          appId: filters[i].app.native,
          onCompletion: OnCompleteAction.NoOp,
          appArgs: [
            methodSelector(MockGate.prototype.register),
            args[i],
          ],
        })
        .submit()

      const registryEntry = new arc4.UintN64(decodeArc4<uint64>(registerTxn.lastLog))

      const entry = new arc4GateFilterEntry({
        layer: filters[i].layer,
        app: filters[i].app,
        registeryEntry: registryEntry,
        logicalOperator: filters[i].logicalOperator,
      })

      entries.push(entry)
    }

    const id = this.newGateID();
    this.gateRegistry(id).value = entries;
    return id;
  }

  check(caller: Address, gateID: arc4.UintN64, args: GateArgs): boolean {
    assert(this.gateRegistry(gateID).exists);
    const filters = this.gateRegistry(gateID).value;
    return this.evaluate(caller, filters, 0, (filters.length - 1), args)
  }
}