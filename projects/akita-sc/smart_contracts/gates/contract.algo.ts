import {
  Application,
  arc4,
  assert,
  assertMatch,
  BoxMap,
  bytes,
  ensureBudget,
  Global,
  GlobalState,
  gtxn,
  OnCompleteAction,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { GateBoxPrefixAppRegistry, GateBoxPrefixGateRegistry, GateGlobalStateKeyCursor } from './constants'
import { AND, arc4GateFilter, arc4GateFilterEntry, OR } from './types'
import { GateArgs, GateInterface } from '../utils/types/gates'
import { ERR_INVALID_PAYMENT } from '../utils/errors'
import { MockGate } from './mock-gate'
import { BaseGate } from './base'
import { fee } from '../utils/constants'
import { classes } from 'polytype'
import { AkitaBaseContract } from '../utils/base-contracts/base'

export class Gate extends classes(BaseGate, AkitaBaseContract) implements GateInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------
  
  /** the id cursor for gates */
  gateCursor = GlobalState<uint64>({ key: GateGlobalStateKeyCursor })

  // BOXES ----------------------------------------------------------------------------------------

  appRegistry = BoxMap<uint64, bytes<0>>({ keyPrefix: GateBoxPrefixAppRegistry })

  gateRegistry = BoxMap<uint64, arc4.DynamicArray<arc4GateFilterEntry>>({
    keyPrefix: GateBoxPrefixGateRegistry,
  })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newGateID(): uint64 {
    const id = this.gateCursor.value
    this.gateCursor.value += 1
    return id
  }

  private evaluate(
    caller: Address,
    filters: arc4.DynamicArray<arc4GateFilterEntry>,
    start: uint64,
    end: uint64,
    args: GateArgs
  ): boolean {
    if (start > end) return true

    let result = this.evaluateFilter(caller, filters[start].copy(), args[start])

    ensureBudget(100 * (end - start))

    for (let i = start; i < end; i += 1) {
      const currentOperator = filters[i].logicalOperator
      const nextResult = this.evaluateFilter(caller, filters[i + 1].copy(), args[i + 1])

      if (currentOperator === AND) {
        result = result && nextResult
      } else if (currentOperator === OR) {
        result = result || nextResult
      }

      // Handle nested logic
      if (i + 1 < end && filters[i + 2].layer.native > filters[i + 1].layer.native) {
        const nestedEnd = this.findEndOfLayer(filters, i + 2, filters[i + 2].layer.native)
        const nestedResult = this.evaluate(caller, filters, i + 2, nestedEnd, args)

        if (currentOperator === AND) {
          result = result && nestedResult
        } else if (currentOperator === OR) {
          result = result || nestedResult
        }

        i = nestedEnd
      }
    }

    return result
  }

  private evaluateFilter(caller: Address, filter: arc4GateFilterEntry, args: bytes): boolean {
    const argsWithCaller = caller.bytes.concat(args)

    return abiCall(MockGate.prototype.check, {
      appId: filter.app.native,
      args: [argsWithCaller],
      fee,
    }).returnValue
  }

  private findEndOfLayer(filters: arc4.DynamicArray<arc4GateFilterEntry>, start: uint64, layer: uint64): uint64 {
    let end = start
    for (let i = start; i < filters.length; i += 1) {
      if (filters[i].layer.native < layer) {
        break
      }
      end = i
    }
    return end
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
    this.gateCursor.value = 0
  }

  // GATE METHODS ---------------------------------------------------------------------------------

  register(payment: gtxn.PaymentTxn, filters: arc4.DynamicArray<arc4GateFilter>, args: GateArgs): arc4.UintN64 {

    const costs = this.mbr(filters.length)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: costs.gateRegistry,
      },
      ERR_INVALID_PAYMENT
    )

    const entries = new arc4.DynamicArray<arc4GateFilterEntry>()
    let lastFilterLayer: uint64 = 0
    for (let i: uint64 = 0; i < filters.length; i += 1) {
      assert(this.appRegistry(filters[i].app.native).exists)
      assert(filters[i].layer.native >= lastFilterLayer)
      lastFilterLayer = filters[i].layer.native

      const registryEntry = abiCall(MockGate.prototype.register, {
        appId: filters[i].app.native,
        onCompletion: OnCompleteAction.NoOp,
        args: [args[i]],
      }).returnValue

      entries.push(new arc4GateFilterEntry({
        layer: filters[i].layer,
        app: filters[i].app,
        registryEntry: new UintN64(registryEntry),
        logicalOperator: filters[i].logicalOperator,
      }))
    }

    const id = this.newGateID()
    this.gateRegistry(id).value = entries.copy()
    return new UintN64(id)
  }

  check(caller: Address, gateID: uint64, args: GateArgs): boolean {
    assert(this.gateRegistry(gateID).exists)
    const filters = this.gateRegistry(gateID).value.copy()
    return this.evaluate(caller, filters, 0, filters.length - 1, args)
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  @abimethod({ readonly: true })
  size(gateID: uint64): uint64 {
    assert(this.gateRegistry(gateID).exists)
    return this.gateRegistry(gateID).value.length
  }
}
