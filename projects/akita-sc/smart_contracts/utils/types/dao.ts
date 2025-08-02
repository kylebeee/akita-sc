import { bytes, Contract, gtxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { ProposalAction } from "../../arc58/dao/types";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";
import { CID } from "./base";
import { FundsRequest } from "../../arc58/account/types";
import { RootKey } from "../../meta-merkles/types";
import { ProposalStatus } from "../../arc58/dao/types";

export class AkitaDAOInterface extends Contract {
  create(escrowFactory: uint64): void { }
  update(proposalID: uint64): void { }
  init(
    version: string,
    akta: uint64,
    contentPolicy: CID,
    minRewardsImpact: uint64,
    // apps: AkitaDAOApps,
    // fees: AkitaDAOFees,
    // proposalSettings: {
    //   creation: ProposalSettings,
    //   participation: ProposalSettings,
    //   approval: ProposalSettings,
    //   duration: ProposalSettings,
    // },
    revocationAddress: Address,
    krbyPayoutAddress: Address,
    moderatorGateID: uint64,
    govStakeKey: RootKey,
    govGateID: uint64,
  ): void { }
  arc58_verifyAuthAddr(): void { }
  arc58_canCall(
    plugin: uint64,
    global: boolean,
    address: Address,
    method: bytes<4>
  ): boolean { return false; }
  arc58_rekeyToPlugin(
    plugin: uint64,
    global: boolean,
    methodOffsets: uint64[],
    fundsRequest: FundsRequest[]
  ): void { }
  arc58_rekeyToNamedPlugin(name: string, global: boolean, methodOffsets: uint64[], fundsRequest: FundsRequest[]): void { }
  newProposal(
    payment: gtxn.PaymentTxn,
    action: ProposalAction,
    cid: CID,
    data: bytes,
    status: ProposalStatus,
  ): void { }
  finalizeProposal(proposalID: uint64, args: bytes): void { }
  createDailyDisbursement(): void { }
  arc58_pluginOptinEscrow(
    plugin: uint64,
    caller: Address,
    assets: uint64[],
    mbrPayment: gtxn.PaymentTxn
  ): void { }
  optinReceiveEscrow(payment: gtxn.PaymentTxn, name: string, asset: uint64): void { }
  startEscrowDisbursement(escrow: string): void { }
  processEscrowAllocation(escrow: string, ids: uint64[]): void { }
}