import {
  Account,
  Application,
  assert,
  assertMatch,
  BoxMap,
  bytes,
  clone,
  ensureBudget,
  Global,
  GlobalState,
  gtxn,
  itxn,
  uint64
} from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod } from '@algorandfoundation/algorand-typescript/arc4'
import { classes } from 'polytype'
import { ERR_INVALID_PAYMENT } from '../utils/errors'
import { GateBoxPrefixGateRegistry, GateGlobalStateKeyCursor } from './constants'
import { ERR_GATE_FAILED } from './errors'
import { AND, GateArgs, GateFilter, GateFilterEntry, GateFilterEntryWithArgs, OR } from './types'

// CONTRACT IMPORTS
import { AkitaBaseContract } from '../utils/base-contracts/base'
import { BaseGate } from './base'
import type { MockGate } from './mock-gate'


export class Gate extends classes(BaseGate, AkitaBaseContract) {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the id cursor for gates */
  gateCursor = GlobalState<uint64>({ key: GateGlobalStateKeyCursor })

  // BOXES ----------------------------------------------------------------------------------------

  // appRegistry = BoxMap<uint64, SubGateShapes>({ keyPrefix: GateBoxPrefixAppRegistry })

  gateRegistry = BoxMap<uint64, GateFilterEntry[]>({ keyPrefix: GateBoxPrefixGateRegistry })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newGateID(): uint64 {
    const id = this.gateCursor.value
    this.gateCursor.value += 1
    return id
  }

  private evaluate(
    caller: Account,
    filters: GateFilterEntry[],
    start: uint64,
    end: uint64,
    args: GateArgs
  ): boolean {
    if (start > end) return true

    let result = this.evaluateFilter(caller, filters[start], args[start])

    ensureBudget(100 * (end - start))

    for (let i = start; i < end; i += 1) {
      const currentOperator = filters[i].logicalOperator
      const nextResult = this.evaluateFilter(caller, filters[i + 1], args[i + 1])

      if (currentOperator === AND) {
        result = result && nextResult
      } else if (currentOperator === OR) {
        result = result || nextResult
      }

      // Handle nested logic
      if (i + 1 < end && filters[i + 2].layer > filters[i + 1].layer) {
        const nestedEnd = this.findEndOfLayer(filters, i + 2, filters[i + 2].layer)
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

  private evaluateFilter(caller: Account, filter: GateFilterEntry, args: bytes): boolean {
    return abiCall<typeof MockGate.prototype.check>({
      appId: filter.app,
      args: [caller, filter.registryEntry, args],
    }).returnValue
  }

  private findEndOfLayer(filters: GateFilterEntry[], start: uint64, layer: uint64): uint64 {
    let end = start
    for (let i = start; i < filters.length; i += 1) {
      if (filters[i].layer < layer) {
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
    this.gateCursor.value = 1
  }

  // GATE METHODS ---------------------------------------------------------------------------------

  // addApp(appID: uint64): void {
  //   assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)
  //   assert(appID !== 0, ERR_INVALID_APP_ID)
  //   assert(!this.appRegistry(appID).exists, ERR_APP_ALREADY_EXISTS)
  //   this.appRegistry(appID).create()
  // }

  // removeApp(appID: uint64): void {
  //   assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)
  //   assert(this.appRegistry(appID).exists, ERR_INVALID_APP_ID)
  //   this.appRegistry(appID).delete()
  // }

  register(payment: gtxn.PaymentTxn, filters: GateFilter[], args: GateArgs): uint64 {

    const mbrCosts = this.mbr(filters.length)
    // let requiredCosts = mbrCosts.appRegistry
    let requiredCosts: uint64 = 0
    let entries: GateFilterEntry[] = []
    let lastFilterLayer: uint64 = 0

    for (let i: uint64 = 0; i < filters.length; i += 1) {
      // assert(this.appRegistry(filters[i].app).exists)
      assert(filters[i].layer >= lastFilterLayer)
      lastFilterLayer = filters[i].layer

      const cost = abiCall<typeof MockGate.prototype.cost>({
        appId: filters[i].app,
        args: [args[i]],
      }).returnValue

      requiredCosts += cost

      const payment = itxn.payment({
        receiver: Application(filters[i].app).address,
        amount: cost
      })

      const registryEntry = abiCall<typeof MockGate.prototype.register>({
        appId: filters[i].app,
        args: [payment, args[i]],
      }).returnValue

      entries.push({ ...filters[i], registryEntry })
    }

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: requiredCosts,
      },
      ERR_INVALID_PAYMENT
    )

    const id = this.newGateID()
    this.gateRegistry(id).value = clone(entries)
    return id
  }

  check(caller: Account, gateID: uint64, args: GateArgs): boolean {
    assert(this.gateRegistry(gateID).exists)
    const filters = clone(this.gateRegistry(gateID).value)
    return this.evaluate(caller, filters, 0, filters.length - 1, args)
  }

  mustCheck(caller: Account, gateID: uint64, args: GateArgs): void {
    assert(this.check(caller, gateID, args), ERR_GATE_FAILED)
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  @abimethod({ readonly: true })
  cost(filters: GateFilter[], args: GateArgs): uint64 {
    const mbrCosts = this.mbr(filters.length)
    // let requiredCosts = mbrCosts.appRegistry
    let requiredCosts: uint64 = 0
    for (let i: uint64 = 0; i < filters.length; i += 1) {
      const cost = abiCall<typeof MockGate.prototype.cost>({
        appId: filters[i].app,
        args: [args[i]],
      }).returnValue

      requiredCosts += cost
    }
    return requiredCosts
  }

  @abimethod({ readonly: true })
  size(gateID: uint64): uint64 {
    assert(this.gateRegistry(gateID).exists)
    return this.gateRegistry(gateID).value.length
  }

  @abimethod({ readonly: true })
  getGate(gateID: uint64): GateFilterEntryWithArgs[] {
    assert(this.gateRegistry(gateID).exists)

    const entries = clone(this.gateRegistry(gateID).value)

    let entriesWithArgs: GateFilterEntryWithArgs[] = []
    for (let i: uint64 = 0; i < entries.length; i += 1) {
      const args = abiCall<typeof MockGate.prototype.getEntry>({
        appId: entries[i].app,
        args: [entries[i].registryEntry],
      }).returnValue

      entriesWithArgs.push({ ...entries[i], args })
    }

    return entriesWithArgs
  }

  @abimethod({ readonly: true })
  gateFilterEntryWithArgsShape(shape: GateFilterEntryWithArgs): GateFilterEntryWithArgs {
    return shape;
  }

  @abimethod({ readonly: true })
  opUp(): void { }
}
