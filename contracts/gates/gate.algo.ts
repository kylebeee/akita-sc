import {
    arc4,
    assert,
    BoxMap,
    bytes,
    Contract,
    ensureBudget,
    Global,
    GlobalState,
    gtxn,
    OnCompleteAction,
    uint64,
} from '@algorandfoundation/algorand-typescript'
import { abiCall, Address, StaticBytes, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../utils/base_contracts/base.algo'
import { GateBoxPrefixAppRegistry, GateBoxPrefixGateRegistry, GateGlobalStateKeyCursor } from './constants'
import { AND, arc4GateFilter, arc4GateFilterEntry, GateMBRData, OR } from './types'
import { GateArgs } from '../../utils/types/gates'
import { ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER } from '../../utils/errors'

class MockGate extends Contract {
    register(args: bytes): uint64 {
        return 0
    }

    check(args: bytes): boolean {
        return false
    }
}

export class Gate extends AkitaBaseContract {
    gateCursor = GlobalState<uint64>({ key: GateGlobalStateKeyCursor })

    appRegistry = BoxMap<uint64, StaticBytes<0>>({ keyPrefix: GateBoxPrefixAppRegistry })

    gateRegistry = BoxMap<uint64, arc4.DynamicArray<arc4GateFilterEntry>>({
        keyPrefix: GateBoxPrefixGateRegistry,
    })

    private mbr(length: uint64): GateMBRData {
        return {
            appRegistry: 6_100,
            gateRegistry: 6_100 + (400 * (32 * length)),
        }
    }

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

        let result = this.evaluateFilter(caller, filters[start], args[start].native)

        ensureBudget(100 * (end - start))

        for (let i = start; i < end; i += 1) {
            const currentOperator = filters[i].logicalOperator
            const nextResult = this.evaluateFilter(caller, filters[i + 1], args[i + 1].native)

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
            fee: 0,
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

    createApplication(): void {
        this.gateCursor.value = 0
    }

    register(payment: gtxn.PaymentTxn, filters: arc4.DynamicArray<arc4GateFilter>, args: GateArgs): arc4.UintN64 {

        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        const costs = this.mbr(filters.length)
        assert(payment.amount === costs.gateRegistry, ERR_INVALID_PAYMENT_AMOUNT)

        const entries = new arc4.DynamicArray<arc4GateFilterEntry>()
        let lastFilterLayer: uint64 = 0
        for (let i: uint64 = 0; i < filters.length; i += 1) {
            assert(this.appRegistry(filters[i].app.native).exists)
            assert(filters[i].layer.native >= lastFilterLayer)
            lastFilterLayer = filters[i].layer.native

            const registryEntry = abiCall(MockGate.prototype.register, {
                appId: filters[i].app.native,
                onCompletion: OnCompleteAction.NoOp,
                args: [args[i].native],
            }).returnValue

            const entry = new arc4GateFilterEntry({
                layer: filters[i].layer,
                app: filters[i].app,
                registryEntry: new UintN64(registryEntry),
                logicalOperator: filters[i].logicalOperator,
            })

            entries.push(entry)
        }

        const id = this.newGateID()
        this.gateRegistry(id).value = entries
        return new UintN64(id)
    }

    check(caller: Address, gateID: uint64, args: GateArgs): boolean {
        assert(this.gateRegistry(gateID).exists)
        const filters = this.gateRegistry(gateID).value
        return this.evaluate(caller, filters, 0, filters.length - 1, args)
    }

    size(gateID: uint64): uint64 {
        assert(this.gateRegistry(gateID).exists)
        return this.gateRegistry(gateID).value.length
    }
}
