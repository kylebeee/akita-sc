import { Application, assert, Bytes, Contract, GlobalState, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript";
import { abiCall, abimethod, decodeArc4 } from "@algorandfoundation/algorand-typescript/arc4";
import { getSpendingAccount, rekeyAddress } from "../../../utils/functions";
import { CID, uint8 } from "../../../utils/types/base";
import { AkitaDAOGlobalStateKeysInitialized, DAOProposalVotesMBR } from "../../dao/constants";
import { ProposalAction, ProposalVoteType } from "../../dao/types";
import { AkitaDAOPluginGlobalStateKeysDAOAppID } from "./constants";

// CONTRACT IMPORTS
import type { AkitaDAO } from "../../dao/contract.algo";
import { ERR_PROPOSAL_DOES_NOT_EXIST } from "../../dao/errors";


export class AkitaDAOPlugin extends Contract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  daoAppID = GlobalState<Application>({ key: AkitaDAOPluginGlobalStateKeysDAOAppID })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(daoAppID: uint64): void {
    this.daoAppID.value = Application(daoAppID)
  }

  // GATE PLUGIN METHODS --------------------------------------------------------------------------

  setup(wallet: Application, rekeyBack: boolean, nickname: string): void {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof AkitaDAO.prototype.setup>({
      sender,
      appId: this.daoAppID.value,
      args: [nickname],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  newProposal(wallet: Application, rekeyBack: boolean, cid: CID, actions: ProposalAction[]): uint64 {
    const sender = getSpendingAccount(wallet)

    const initialized = decodeArc4<boolean>(
      op.AppGlobal.getExBytes(
        this.daoAppID.value,
        Bytes(AkitaDAOGlobalStateKeysInitialized)
      )[0]
    )

    if (!initialized) {
      return abiCall<typeof AkitaDAO.prototype.newProposalPreInitialized>({
        sender,
        appId: this.daoAppID.value,
        args: [cid, actions],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }).returnValue
    } else {

      const { totalFee } = abiCall<typeof AkitaDAO.prototype.proposalCost>({
        sender,
        appId: this.daoAppID.value,
        args: [actions],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }).returnValue

      const actionsPayment = itxn.payment({
        sender,
        receiver: this.daoAppID.value.address,
        amount: totalFee,
      })

      return abiCall<typeof AkitaDAO.prototype.newProposal>({
        sender,
        appId: this.daoAppID.value,
        args: [
          actionsPayment,
          cid,
          actions
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }).returnValue
    }
  }

  editProposal(wallet: Application, rekeyBack: boolean, id: uint64, cid: CID, actions: ProposalAction[]): void {
    const sender = getSpendingAccount(wallet)

    const { status, feesPaid } = abiCall<typeof AkitaDAO.prototype.getProposal>({
      sender,
      appId: this.daoAppID.value,
      args: [id],
    }).returnValue

    assert(status !== uint8(0), ERR_PROPOSAL_DOES_NOT_EXIST)
    
    const { totalFee } = abiCall<typeof AkitaDAO.prototype.proposalCost>({
      sender,
      appId: this.daoAppID.value,
      args: [actions],
    }).returnValue

    if (feesPaid < totalFee) {
      const actionsPayment = itxn.payment({
        sender,
        receiver: this.daoAppID.value.address,
        amount: totalFee - feesPaid,
      })

      abiCall<typeof AkitaDAO.prototype.editProposalWithPayment>({
        sender,
        appId: this.daoAppID.value,
        args: [
          actionsPayment,
          id,
          cid,
          actions
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      })
    } else {
      abiCall<typeof AkitaDAO.prototype.editProposal>({
        sender,
        appId: this.daoAppID.value,
        args: [
          id,
          cid,
          actions
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      })
    }
  }

  submitProposal(wallet: Application, rekeyBack: boolean, proposalID: uint64): void {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof AkitaDAO.prototype.submitProposal>({
      sender,
      appId: this.daoAppID.value,
      args: [proposalID],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  voteProposal(wallet: Application, rekeyBack: boolean, proposalID: uint64, vote: ProposalVoteType): void {
    const sender = getSpendingAccount(wallet)

    const mbrPayment = itxn.payment({
      sender,
      receiver: this.daoAppID.value.address,
      amount: DAOProposalVotesMBR
    })

    abiCall<typeof AkitaDAO.prototype.voteProposal>({
      sender,
      appId: this.daoAppID.value,
      args: [
        mbrPayment,
        proposalID,
        vote
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  finalizeProposal(wallet: Application, rekeyBack: boolean, proposalID: uint64): void {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof AkitaDAO.prototype.finalizeProposal>({
      sender,
      appId: this.daoAppID.value,
      args: [proposalID],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  executeProposal(wallet: Application, rekeyBack: boolean, proposalID: uint64): void {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof AkitaDAO.prototype.executeProposal>({
      sender,
      appId: this.daoAppID.value,
      args: [proposalID],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }
}