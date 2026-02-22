import { BaseSDK } from "../base";
import { TxnReturn } from '../types';
import { GateArgs, GateClient } from '../generated/GateClient';
import { MaybeSigner, NewContractSDKParams } from "../types";
import { GateCheckArg, GateRegistrationFilterAndArg, GateRegistryConfig } from "./types";
import { AppCallMethodCall } from "@algorandfoundation/algokit-utils/types/composer";
type ContractArgs = GateArgs["obj"];
export * from './types';
export declare class GateSDK extends BaseSDK<GateClient> {
    private contractIdToType;
    private gateEncodings;
    constructor(params: NewContractSDKParams & {
        gateRegistry: GateRegistryConfig;
    });
    private getGateTypeFromContractId;
    private encodeGateRegistryArgs;
    private decodeGateArgs;
    private encodeGateCheckArgs;
    register({ sender, signer, args }: {
        args: GateRegistrationFilterAndArg[];
    } & MaybeSigner): Promise<TxnReturn<bigint>>;
    check({ sender, signer, caller, gateId, args }: Omit<ContractArgs['check(address,uint64,byte[][])bool'], 'args'> & {
        args: GateCheckArg[];
    } & MaybeSigner): Promise<TxnReturn<boolean>>;
    mustCheck({ sender, signer, caller, gateId, args }: Omit<ContractArgs['check(address,uint64,byte[][])bool'], 'args'> & {
        args: GateCheckArg[];
    } & MaybeSigner): Promise<TxnReturn<void>>;
    getGate({ sender, signer, gateId }: ContractArgs['getGate(uint64)(uint64,uint64,uint64,uint8,byte[])[]'] & MaybeSigner): Promise<any>;
    cost({ sender, signer, ...args }: ContractArgs['cost((uint64,uint64,uint8)[],byte[][])uint64'] & MaybeSigner): Promise<bigint>;
    readonly build: {
        check: ({ sender, signer, caller, gateId, args }: (Omit<ContractArgs["check(address,uint64,byte[][])bool"], "args"> & {
            args: GateCheckArg[];
        } & MaybeSigner)) => Promise<AppCallMethodCall>;
        mustCheck: ({ sender, signer, caller, gateId, args }: (Omit<ContractArgs["check(address,uint64,byte[][])bool"], "args"> & {
            args: GateCheckArg[];
        } & MaybeSigner)) => Promise<AppCallMethodCall>;
    };
}
