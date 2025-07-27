import { Contract, gtxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { AssetCheck, Escrow, Heartbeats, Stake, StakeInfo, StakingType } from "../../staking/types";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";

export class StakingInterface extends Contract {
    create(version: string, akitaDAO: uint64): void {}
    update(newVersion: string): void {}
    updateAkitaDAO(app: uint64): void {}
    stake(payment: gtxn.PaymentTxn, type: StakingType, amount: uint64, expiration: uint64): void {}
    stakeAsa(payment: gtxn.PaymentTxn, assetXfer: gtxn.AssetTransferTxn, type: StakingType, amount: uint64, expiration: uint64): void {}
    withdraw(asset: uint64, type: StakingType): void {}
    createHeartbeat(address: Address, asset: uint64): void {}
    softCheck(address: Address, asset: uint64): { valid: boolean, balance: uint64 } { return { valid: false, balance: 0 }}
    updateSettings(payment: gtxn.PaymentTxn, asset: uint64, value: uint64): void {}
    getTimeLeft(address: Address, asset: uint64): uint64 { return 0 }
    mustGetTimeLeft(address: Address, asset: uint64): uint64 { return 0 }
    getInfo(address: Address, stake: StakeInfo): Stake { return { amount: 0, lastUpdate: 0, expiration: 0 } }
    mustGetInfo(address: Address, stake: StakeInfo): Stake { return { amount: 0, lastUpdate: 0, expiration: 0 } }
    getEscrowInfo(address: Address, asset: uint64): Escrow { return { hard: 0, lock: 0 } }
    getHeartbeat(address: Address, asset: uint64): Heartbeats { return [] }
    mustGetHeartbeat(address: Address, asset: uint64): Heartbeats { return [] }
    getHeartbeatAverage(address: Address, asset: uint64, includeStaked: boolean): uint64 { return 0 }
    mustGetHeartbeatAverage(address: Address, asset: uint64, includeStaked: boolean): uint64 { return 0 }
    getInfoList(address: Address, type: StakingType, assets: uint64[]): Stake[] { return [] }
    mustGetInfoList(address: Address, type: StakingType, assets: uint64[]): Stake[] { return [] }
    stakeCheck(address: Address, assetChecks: AssetCheck[], type: StakingType, includeStaked: boolean): boolean { return false }
}