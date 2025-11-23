import { Account, uint64 } from "@algorandfoundation/algorand-typescript"
import { Uint8 } from "@algorandfoundation/algorand-typescript/arc4"

export type EscrowDisbursementPhase = Uint8

export const EscrowDisbursementPhaseIdle: EscrowDisbursementPhase = new Uint8(0)
export const EscrowDisbursementPhasePreparation: EscrowDisbursementPhase = new Uint8(10)
export const EscrowDisbursementPhaseAllocation: EscrowDisbursementPhase = new Uint8(20)
export const EscrowDisbursementPhaseFinalization: EscrowDisbursementPhase = new Uint8(30)

export type ReceiveEscrow = {
  /** the source address of funds for the escrow */
  source: Account
  /** whether the escrow is allocatable for paying the DAO/krby/mods */
  allocatable: boolean
  /** whether the account is allowed to opt in */
  optinAllowed: boolean
  /** the number of assets the escrow is opted into */
  optinCount: uint64
  /** the current phase of the escrow disbursement */
  phase: EscrowDisbursementPhase
  /** allocation counter to track the number of assets we need to disburse */
  allocationCounter: uint64
  /** the last unix time the escrow was disbursed */
  lastDisbursement: uint64
  /** the unix timestamp the escrow was created */
  creationDate: uint64
}

export type EscrowAssetKey = {
  escrow: uint64
  asset: uint64
}

export type SplitDistributionType = Uint8

export const SplitDistributionTypeFlat: SplitDistributionType = new Uint8(10)
export const SplitDistributionTypePercentage: SplitDistributionType = new Uint8(20)
export const SplitDistributionTypeRemainder: SplitDistributionType = new Uint8(30)

export type Split = {
  escrow: uint64
  type: SplitDistributionType
  value: uint64
}