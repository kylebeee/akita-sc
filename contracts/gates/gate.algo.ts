import { Contract } from '@algorandfoundation/tealscript';
import { bytes0 } from '../../utils/constants';

export const AKITA_SOCIAL_PLUGIN_ID = 0;
export const AKITA_TIME_LOCK_PLUGIN_ID = 0;
export const META_MERKLE_APP_ID = 0;

export type Operator = uint64;
export type LogicalOperator = uint64;

export const AND = 0;
export const OR = 1;

export type GateFilter = {
    layer: uint64, // the comparison nesting level
    app: AppID; // the signature of the gate to use
    operator: LogicalOperator; // the logical operator to apply between this gate filter and the next
};

export type GateFilterEntry = {
    layer: uint64,
    app: AppID;
    registeryEntry: uint64,
    operator: Operator;
}

class MockGate extends Contract {
    register(args: bytes): uint64 { return 0; }
    check(args: bytes): boolean { return false; }
}

export class Gate extends Contract {

    filterRegistryCounter = GlobalStateKey<uint64>({ key: 'c' });

    appRegistry = BoxMap<AppID, bytes0>();

    filterRegistry = BoxMap<uint64, GateFilterEntry[]>({ prefix: 'f' });

    register(filters: GateFilter[], args: bytes[]): uint64 {
        let entries: GateFilterEntry[] = [];
        let lastFilterLayer: uint64 = 0;
        for (let i = 0; i < filters.length; i += 1) {
            assert(this.appRegistry(filters[i].app).exists);
            assert(filters[i].layer >= lastFilterLayer)
            lastFilterLayer = filters[i].layer;

            const registryEntry = sendMethodCall<typeof MockGate.prototype.register, uint64>({
                applicationID: filters[i].app,
                methodArgs: [ args[i] ],
                fee: 0,
            });

            const entry: GateFilterEntry = {
                layer: filters[i].layer,
                app: filters[i].app,
                registeryEntry: registryEntry,
                operator: filters[i].operator,
            };

            entries.push(entry);
        }

        const counter = this.filterRegistryCounter.value
        this.filterRegistry(counter).value = entries;
        this.filterRegistryCounter.value += 1;        
        return counter;
    }

    check(filterIndex: uint64, args: bytes[]): boolean {
        assert(this.filterRegistry(filterIndex).exists);
        const filters = this.filterRegistry(filterIndex).value;
        return this.evaluateFilters(filters, 0, (filters.length - 1), args);
    }

    private evaluateFilters(filters: GateFilterEntry[], start: uint64, end: uint64, args: bytes[]): boolean {
        if (start > end) return true;

        let result = this.evaluateFilter(filters[start], args[start]);
        
        for (let i = start; i < end; i += 1) {

            if (globals.opcodeBudget < 50) {
                increaseOpcodeBudget();
            }

            const currentOperator = filters[i].operator;
            const nextResult = this.evaluateFilter(filters[i + 1], args[i + 1]);

            if (currentOperator === AND) {
                result = result && nextResult;
            } else if (currentOperator === OR) {
                result = result || nextResult;
            }

            // Handle nested logic
            if (i + 1 < end && filters[i + 2].layer > filters[i + 1].layer) {
                const nestedEnd = this.findEndOfLayer(filters, i + 2, filters[i + 2].layer);
                const nestedResult = this.evaluateFilters(filters, i + 2, nestedEnd, args);
                
                if (currentOperator === AND) {
                    result = result && nestedResult;
                } else if (currentOperator === OR) {
                    result = result || nestedResult;
                }

                i = nestedEnd;
            }
        }

        return result;
    }

    private evaluateFilter(filter: GateFilterEntry, args: bytes): boolean {
        return sendMethodCall<typeof MockGate.prototype.check, boolean>({
            applicationID: filter.app,
            methodArgs: [args],
            fee: 0,
        });
    }

    private findEndOfLayer(filters: GateFilterEntry[], start: uint64, layer: uint64): uint64 {
        let end = start;
        for (let i = start; i < filters.length; i += 1) {
            if (filters[i].layer < layer) {
                break;
            }
            end = i;
        }
        return end;
    }
}