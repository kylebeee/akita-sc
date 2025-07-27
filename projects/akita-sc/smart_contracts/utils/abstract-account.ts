import { bytes, Contract, gtxn, Txn, uint64 } from "@algorandfoundation/algorand-typescript";
import { Address, Uint8 } from "@algorandfoundation/algorand-typescript/arc4";
import { AddAllowanceInfo, EscrowReclaim, ExecutionKey, FundsRequest, MethodRestriction } from "../arc58/account/types";

export class AbstractedAccountInterface extends Contract {
  create(
    version: string, 
    controlledAddress: Address, 
    admin: Address, 
    escrowFactory: uint64, 
    revocationApp: uint64, 
    nickname: string
  ): void { }
  init(): void { }
  update(version: string): void { }
  changeRevocationApp(newRevocationApp: uint64): void { }
  setNickname(nickname: string): void { }
  setAvatar(avatar: uint64): void { }
  setBanner(banner: uint64): void { }
  setBio(bio: string): void { }
  arc58_changeAdmin(newAdmin: Address): void { }
  arc58_pluginChangeAdmin(plugin: uint64, allowedCaller: Address, newAdmin: Address): void { }
  arc58_verifyAuthAddr(): void { }
  arc58_rekeyTo(address: Address, flash: boolean): void { }
  arc58_canCall(plugin: uint64, global: boolean, address: Address, method: bytes<4>): boolean { return false; }
  arc58_rekeyToPlugin(plugin: uint64, global: boolean, methodOffsets: uint64[], fundsRequest: FundsRequest[]): void { }
  arc58_rekeyToNamedPlugin(name: string, global: boolean, methodOffsets: uint64[], fundsRequest: FundsRequest[]): void { }
  arc58_addPlugin(
    app: uint64, 
    allowedCaller: Address, 
    admin: boolean, 
    delegationType: Uint8, 
    escrow: string, 
    lastValid: uint64, 
    cooldown: uint64, 
    methods: MethodRestriction[], 
    useRounds: boolean,
    useExecutionKey: boolean
  ): void { }
  assignDomain(caller: Address, domain: string): void { }
  arc58_removePlugin(app: uint64, allowedCaller: Address): void { }
  arc58_addNamedPlugin(
    name: string, 
    app: uint64, 
    allowedCaller: Address, 
    admin: boolean, 
    delegationType: Uint8, 
    escrow: string, 
    lastValid: uint64, 
    cooldown: uint64, 
    methods: MethodRestriction[], 
    useRounds: boolean,
    useExecutionKey: boolean
  ): void { }
  arc58_removeNamedPlugin(name: string): void { }
  arc58_newEscrow(escrow: string): uint64 { return 0 }
  arc58_toggleEscrowLock(escrow: string): boolean { return false; }
  arc58_reclaim(escrow: string, reclaims: EscrowReclaim[]): void { }
  arc58_optinEscrow(escrow: string, assets: uint64[]): void { }
  arc58_pluginOptinEscrow(
    plugin: uint64,
    caller: Address,
    assets: uint64[],
    mbrPayment: gtxn.PaymentTxn
  ): void { }
  arc58_addAllowances(escrow: string, allowances: AddAllowanceInfo[]): void { }
  arc58_removeAllowances(escrow: string, assets: uint64[]): void { }
  arc58_addExecutionKey(key: ExecutionKey, lastValidRound: uint64): void { }
  arc58_removeExecutionKey(key: ExecutionKey): void { }
  arc58_getAdmin(): Address { return new Address(Txn.sender); }
  arc58_getEscrow(name: string): uint64 { return 0 }
  arc58_mustGetEscrow(name: string): uint64 { return 0 }
  balance(assets: uint64[]): uint64[] { return [] }
}


export class AbstractedAccountFactoryInterface extends Contract {
  create(
    akitaDAO: uint64,
    version: string,
    childVersion: string,
    escrowFactoryApp: uint64,
    revocationApp: uint64
  ): void {}
  update(newVersion: string, newChildVersion: string): void {}
  updateAkitaDAO(app: uint64): void {}
  updateAkitaDAOEscrow(app: uint64): void {}
  updateRevocationApp(app: uint64): void {}
  mint(
    payment: gtxn.PaymentTxn,
    controlledAddress: Address,
    admin: Address,
    nickname: string
  ): uint64 { return 0 }
}