import { arc4, Contract, gtxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { arc4StakeInfo, AssetChecks, Escrow, Heartbeats, Stake, StakingType } from "../../staking/types";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";
import { uint64Array } from "./base";

export class StakingInterface extends Contract {
    create(akitaDAO: uint64, version: string): void {}
    update(newVersion: string): void {}
    updateAkitaDAO(app: uint64): void {}
    stake(payment: gtxn.PaymentTxn, type: StakingType, amount: uint64, expiration: uint64): void {}
    stakeAsa(payment: gtxn.PaymentTxn, assetXfer: gtxn.AssetTransferTxn, type: StakingType, amount: uint64, expiration: uint64): void {}
    withdraw(asset: uint64, type: StakingType): void {}
    createHeartbeat(address: Address, asset: uint64): void {}
    softCheck(address: Address, asset: uint64): { valid: boolean, balance: uint64 } { return { valid: false, balance: 0 }}
    getTimeLeft(address: Address, asset: arc4.UintN64): uint64 { return 0 }
    mustGetTimeLeft(address: Address, asset: arc4.UintN64): uint64 { return 0 }
    getInfo(address: Address, stake: arc4StakeInfo): Stake { return { amount: 0, lastUpdate: 0, expiration: 0 } }
    mustGetInfo(address: Address, stake: arc4StakeInfo): Stake { return { amount: 0, lastUpdate: 0, expiration: 0 } }
    getEscrowInfo(address: Address, asset: arc4.UintN64): Escrow { return { hard: 0, lock: 0 } }
    getHeartbeat(address: Address, asset: uint64): Heartbeats { return [] }
    mustGetHeartbeat(address: Address, asset: uint64): Heartbeats { return [] }
    mustGetHeartbeatAverage(address: Address, asset: uint64, includeStaked: boolean): uint64 { return 0 }
    getInfoList(address: Address, type: StakingType, assets: uint64Array): Stake[] { return [] }
    mustGetInfoList(address: Address, type: StakingType, assets: uint64Array): Stake[] { return [] }
    stakeCheck(address: Address, assetChecks: AssetChecks, type: StakingType, includeStaked: boolean): boolean { return false }
}