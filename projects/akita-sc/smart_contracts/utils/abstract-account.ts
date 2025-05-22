import { bytes, Contract, Txn, uint64 } from "@algorandfoundation/algorand-typescript";
import { Address, UintN8 } from "@algorandfoundation/algorand-typescript/arc4";
import { FundsRequest, MethodRestriction, SpendAllowanceType } from "../arc58/account/types";

export class AbstractedAccountInterface extends Contract {
  create(version: string, controlledAddress: Address, admin: Address, spendingAccountFactoryApp: uint64, revocationApp: uint64, nickname: string): void { }
  update(version: string): void {}
  changeRevocationApp(newRevocationApp: uint64): void {}
  setNickname(nickname: string): void {}
  setAvatar(avatar: uint64): void {}
  setBanner(banner: uint64): void {}
  setBio(bio: string): void {}
  arc58_changeAdmin(newAdmin: Address): void {}
  arc58_pluginChangeAdmin(plugin: uint64, allowedCaller: Address, newAdmin: Address): void {}
  arc58_verifyAuthAddr(): void {}
  arc58_rekeyTo(address: Address, flash: boolean): void {}
  arc58_canCall(plugin: uint64, global: boolean, address: Address, method: bytes<4>): boolean { return false; }
  arc58_rekeyToPlugin(plugin: uint64, global: boolean, methodOffsets: uint64[], fundsRequest: FundsRequest[]): void {}
  arc58_rekeyToNamedPlugin(name: string, global: boolean, methodOffsets: uint64[], fundsRequest: FundsRequest[]): void {}
  arc58_addPlugin(app: uint64, allowedCaller: Address, admin: boolean, delegationType: UintN8, lastValid: uint64, cooldown: uint64, methods: MethodRestriction[], useAllowance: boolean, useRounds: boolean): void {}
  assignDomain(caller: Address, domain: string): void {}
  arc58_removePlugin(app: uint64, allowedCaller: Address): void {}
  arc58_addNamedPlugin(name: string, app: uint64, allowedCaller: Address, admin: boolean, delegationType: UintN8, lastValid: uint64, cooldown: uint64, methods: MethodRestriction[], useAllowance: boolean, useRounds: boolean): void {}
  arc58_removeNamedPlugin(name: string): void {}
  arc58_addAllowance(plugin: uint64, caller: Address, asset: uint64, type: SpendAllowanceType, allowed: uint64, max: uint64, interval: uint64): void {}
  arc58_removeAllowance(plugin: uint64, caller: Address, asset: uint64): void {}
  arc58_getAdmin(): Address { return new Address(Txn.sender); }
  balance(assets: uint64[]): uint64[] { return [] }
}