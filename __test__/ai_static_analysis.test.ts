/* eslint-disable prefer-destructuring */
import { describe, expect, test } from '@jest/globals';

type TransactionPath = {
    transactions: Record<string, string | number>[];
    stack: any[];
    visited: Set<number>;
    currentTxn: Record<string, string | number> | null;
};

type TealState = {
    intcblock: number[];
    bytecblock: string[];
    stack: any[];
    frameStack: any[][];
};

function parseTeal(teal: string): {
    instructions: { opcode: string; args?: string[]; line: number; }[];
    labels: Map<string, number>;
} {
    const instructions: { opcode: string; args?: string[]; line: number }[] = [];
    const labels = new Map<string, number>();
    const lines = teal
        .split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('//'));

    let lineNum = 0;
    lines.forEach((line) => {
        if (line.endsWith(':')) {
            labels.set(line.slice(0, -1).replace('*', ''), instructions.length);
        } else {
            const [opcode, ...args] = line.split(' ');
            instructions.push({ opcode, args, line: lineNum++ });
        }
    });

    return { instructions, labels };
}

function getPluginTxns(
    teal: string,
    methodSelectors?: string[],
    startLabel?: string
): Record<string, string | number>[] {
    const { instructions, labels } = parseTeal(teal);
    const state: TealState = {
        intcblock: [],
        bytecblock: [],
        stack: [],
        frameStack: []
    };

    const path: TransactionPath = {
        transactions: [],
        stack: [],
        visited: new Set(),
        currentTxn: null
    };

    function evaluatePath(pc: number) {
        if (path.visited.has(pc)) return;
        path.visited.add(pc);

        while (pc < instructions.length) {
            const inst = instructions[pc];
            
            switch(inst.opcode) {
                case 'intcblock':
                    state.intcblock = inst.args!.map(x => parseInt(x));
                    break;

                case 'bytecblock':
                    state.bytecblock = inst.args!.map(x => x);
                    break;

                case 'itxn_begin':
                    path.currentTxn = {};
                    break;

                case 'itxn_submit':
                    if (path.currentTxn && Object.keys(path.currentTxn).length > 0) {
                        path.transactions.push(path.currentTxn);
                    }
                    path.currentTxn = null;
                    break;

                case 'itxn_field':
                    if (path.currentTxn) {
                        const field = inst.args![0];
                        const value = path.stack.at(-1);
                        path.currentTxn[field] = value;
                        path.stack.pop();
                    }
                    break;

                case 'pushint':
                    path.stack.push(parseInt(inst.args![0]));
                    break;

                case 'pushbytes':
                    path.stack.push(inst.args![0]);
                    break;
                
                case 'frame_dig':
                    const frameIndex = parseInt(inst.args![0]);
                    if (state.frameStack.length > 0) {
                        path.stack.push(state.frameStack[state.frameStack.length - 1][frameIndex]);
                    }
                    break;

                case 'match':
                case 'switch': {
                    const branches = inst.args!.map(l => labels.get(l.replace('*', '')))
                                              .filter((x): x is number => x !== undefined);
                    // Follow all branches
                    branches.forEach(target => {
                        const newPath: TransactionPath = {
                            transactions: [...path.transactions],
                            stack: [...path.stack],
                            visited: new Set(path.visited),
                            currentTxn: path.currentTxn ? {...path.currentTxn} : null
                        };
                        evaluatePath(target);
                    });
                    return;
                }

                case 'b':
                    if (inst.args && labels.has(inst.args[0])) {
                        evaluatePath(labels.get(inst.args[0])!);
                    }
                    return;

                case 'bz':
                case 'bnz':
                    if (inst.args && labels.has(inst.args[0])) {
                        const newPath: TransactionPath = {
                            transactions: [...path.transactions],
                            stack: [...path.stack],
                            visited: new Set(path.visited),
                            currentTxn: path.currentTxn ? {...path.currentTxn} : null
                        };
                        evaluatePath(labels.get(inst.args[0])!);
                        evaluatePath(pc + 1);
                    }
                    return;
            }
            pc++;
        }
    }

    const startPc = startLabel ? labels.get(startLabel) ?? 0 : 0;
    evaluatePath(startPc);

    return path.transactions;
}


describe('getPluginTxns', () => {
    test('analyze specific method', () => {
        const teal = `
        #pragma version 10
        method "test()void"
        pushbytes 0x12345678
        match main other
        
        main:
        itxn_begin
        pushbytes 0xdeadbeef
        itxn_field Sender
        pushint 1000
        itxn_field Amount
        itxn_submit
        b end
        
        other:
        itxn_begin
        pushbytes 0xbeefcafe
        itxn_field Sender
        pushint 2000
        itxn_field Amount
        itxn_submit
        
        end:
        int 1
        return`;

        const txns = getPluginTxns(teal, undefined, 'main');
        expect(txns).toEqual([
            { Sender: '0xdeadbeef', Amount: 1000 }
        ]);

        const allTxns = getPluginTxns(teal);
        expect(allTxns).toEqual([
            { Sender: '0xdeadbeef', Amount: 1000 },
            { Sender: '0xbeefcafe', Amount: 2000 }
        ]);
    });
});