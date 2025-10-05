import { bytes, Contract, gtxn, Txn, uint64 } from "@algorandfoundation/algorand-typescript";
import { Address, Uint8 } from "@algorandfoundation/algorand-typescript/arc4";
import { AddAllowanceInfo, AllowanceInfo, EscrowInfo, EscrowReclaim, ExecutionInfo, FundsRequest, MethodRestriction, PluginInfo, PluginKey } from "../arc58/account/types";
import { uint8 } from "./types/base";
import { emptyAllowanceInfo, emptyEscrowInfo, emptyExecutionInfo, emptyPluginInfo } from "../arc58/account/utils";

export class AbstractedAccountInterface extends Contract {
  create(
    version: string,
    controlledAddress: Address,
    admin: Address,
    domain: string,
    escrowFactory: uint64,
    revocationApp: uint64,
    nickname: string,
    creator: Address
  ): void { }
  register(escrow: string): void { }
  update(version: string): void { }
  setDomain(domain: string): void { }
  setRevocationApp(app: uint64): void { }
  setNickname(nickname: string): void { }
  setAvatar(avatar: uint64): void { }
  setBanner(banner: uint64): void { }
  setBio(bio: string): void { }
  arc58_changeAdmin(newAdmin: Address): void { }
  arc58_pluginChangeAdmin(newAdmin: Address): void { }
  arc58_verifyAuthAddress(): void { }
  arc58_rekeyTo(address: Address, flash: boolean): void { }
  arc58_canCall(plugin: uint64, global: boolean, address: Address, escrow: string, method: bytes<4>): boolean { return false; }
  arc58_rekeyToPlugin(plugin: uint64, global: boolean, escrow: string, methodOffsets: uint64[], fundsRequest: FundsRequest[]): void { }
  arc58_rekeyToNamedPlugin(name: string, global: boolean, escrow: string, methodOffsets: uint64[], fundsRequest: FundsRequest[]): void { }
  arc58_addPlugin(
    plugin: uint64,
    caller: Address,
    escrow: string,
    admin: boolean,
    delegationType: Uint8,
    lastValid: uint64,
    cooldown: uint64,
    methods: MethodRestriction[],
    useRounds: boolean,
    useExecutionKey: boolean,
    defaultToEscrow: boolean
  ): void { }
  assignDomain(caller: Address, domain: string): void { }
  arc58_removePlugin(plugin: uint64, caller: Address, escrow: string): void { }
  arc58_addNamedPlugin(
    name: string,
    plugin: uint64,
    caller: Address,
    escrow: string,
    admin: boolean,
    delegationType: Uint8,
    lastValid: uint64,
    cooldown: uint64,
    methods: MethodRestriction[],
    useRounds: boolean,
    useExecutionKey: boolean,
    defaultToEscrow: boolean
  ): void { }
  arc58_removeNamedPlugin(name: string): void { }
  arc58_newEscrow(escrow: string): uint64 { return 0 }
  arc58_toggleEscrowLock(escrow: string): EscrowInfo { return emptyEscrowInfo() }
  arc58_reclaim(escrow: string, reclaims: EscrowReclaim[]): void { }
  arc58_optinEscrow(escrow: string, assets: uint64[]): void { }
  arc58_pluginOptinEscrow(
    plugin: uint64,
    caller: Address,
    escrow: string,
    assets: uint64[],
    mbrPayment: gtxn.PaymentTxn
  ): void { }
  arc58_addAllowances(escrow: string, allowances: AddAllowanceInfo[]): void { }
  arc58_removeAllowances(escrow: string, assets: uint64[]): void { }
  arc58_addExecutionKey(key: bytes<32>, groups: bytes<32>[], firstValid: uint64, lastValid: uint64): void { }
  arc58_removeExecutionKey(key: bytes<32>): void { }
  arc58_getAdmin(): Address { return new Address(Txn.sender); }
  arc58_getPlugins(keys: PluginKey[]): PluginInfo[] { return [] }
  arc58_getNamedPlugins(names: string[]): PluginInfo[] { return [] }
  arc58_getEscrows(escrows: string[]): EscrowInfo[] { return [] }
  arc58_getAllowances(escrow: string, assets: uint64[]): AllowanceInfo[] { return [] }
  arc58_getExecutions(leases: bytes<32>[]): ExecutionInfo[] { return [] }
  arc58_getDomainKeys(addresses: Address[]): string[] { return [] }
  balance(assets: uint64[]): uint64[] { return [] }
}


export class AbstractedAccountFactoryInterface extends Contract {
  create(
    akitaDAO: uint64,
    version: string,
    childVersion: string,
    escrowFactoryApp: uint64,
    revocationApp: uint64,
    domain: string
  ): void { }
  update(newVersion: string, newChildVersion: string): void { }
  updateAkitaDAO(app: uint64): void { }
  updateAkitaDAOEscrow(app: uint64): void { }
  updateRevocationApp(app: uint64): void { }
  new(
    payment: gtxn.PaymentTxn,
    controlledAddress: Address,
    admin: Address,
    nickname: string,
    referrer: Address
  ): uint64 { return 0 }
  cost(): uint64 { return 0 }
}