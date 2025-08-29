import { Application, Bytes, Contract, GlobalState, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript";
import { CID } from "../../../utils/types/base";
import { ProposalAction, ProposalVoteType } from "../../dao/types";
import { AkitaDAOPluginGlobalStateKeysDAOAppID } from "./constants";
import { abiCall, abimethod, decodeArc4 } from "@algorandfoundation/algorand-typescript/arc4";
import { AkitaDAO } from "../../dao/contract.algo";
import { getSpendingAccount, rekeyAddress } from "../../../utils/functions";
import { AkitaDAOGlobalStateKeysInitialized, DAOProposalVotesMBR } from "../../dao/constants";

export class AkitaDAOPlugin extends Contract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  daoAppID = GlobalState<Application>({ key: AkitaDAOPluginGlobalStateKeysDAOAppID })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(daoAppID: uint64): void {
    this.daoAppID.value = Application(daoAppID)
  }

  // GATE PLUGIN METHODS --------------------------------------------------------------------------

  update(walletID: uint64, rekeyBack: boolean, proposalID: uint64, index: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      AkitaDAO.prototype.update,
      {
        sender,
        appId: this.daoAppID.value,
        args: [
          proposalID,
          index
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  setup(walletID: uint64, rekeyBack: boolean): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      AkitaDAO.prototype.setup,
      {
        sender,
        appId: this.daoAppID.value,
        args: [],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  newProposal(walletID: uint64, rekeyBack: boolean, cid: CID, actions: ProposalAction[]): uint64 {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const initialized = decodeArc4<boolean>(
      op.AppGlobal.getExBytes(
        this.daoAppID.value,
        Bytes(AkitaDAOGlobalStateKeysInitialized)
      )[0]
    )

    if (!initialized) {
      return abiCall(
        AkitaDAO.prototype.newProposalPreInitialized,
        {
          sender,
          appId: this.daoAppID.value,
          args: [cid, actions],
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        }
      ).returnValue
    } else {

      const { totalFee } = abiCall(
        AkitaDAO.prototype.proposalCost,
        {
          sender,
          appId: this.daoAppID.value,
          args: [actions],
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        }
      ).returnValue      

      const actionsPayment = itxn.payment({
        sender,
        receiver: this.daoAppID.value.address,
        amount: totalFee,
      })

      return abiCall(
        AkitaDAO.prototype.newProposal,
        {
          sender,
          appId: this.daoAppID.value,
          args: [
            actionsPayment,
            cid,
            actions
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        }
      ).returnValue
    }
  }

  editProposal(walletID: uint64, rekeyBack: boolean, id: uint64, cid: CID, actions: ProposalAction[]): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { feesPaid } = abiCall(
      AkitaDAO.prototype.mustGetProposal,
      {
        sender,
        appId: this.daoAppID.value,
        args: [id],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    ).returnValue

    const { totalFee } = abiCall(
      AkitaDAO.prototype.proposalCost,
      {
        sender,
        appId: this.daoAppID.value,
        args: [actions],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    ).returnValue

    if (feesPaid < totalFee) {
      const actionsPayment = itxn.payment({
        sender,
        receiver: this.daoAppID.value.address,
        amount: totalFee - feesPaid,
      })

      abiCall(
        AkitaDAO.prototype.editProposalWithPayment,
        {
          sender,
          appId: this.daoAppID.value,
          args: [
            actionsPayment,
            id,
            cid,
            actions
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        }
      )
    } else {
      abiCall(
        AkitaDAO.prototype.editProposal,
        {
          sender,
          appId: this.daoAppID.value,
          args: [
            id,
            cid,
            actions
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        }
      )
    }
  }

  submitProposal(walletID: uint64, rekeyBack: boolean, proposalID: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)
    
    abiCall(
      AkitaDAO.prototype.submitProposal,
      {
        sender,
        appId: this.daoAppID.value,
        args: [proposalID],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  voteProposal(walletID: uint64, rekeyBack: boolean, proposalID: uint64, vote: ProposalVoteType): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const mbrPayment = itxn.payment({
      sender,
      receiver: this.daoAppID.value.address,
      amount: DAOProposalVotesMBR
    })

    abiCall(
      AkitaDAO.prototype.voteProposal,
      {
        sender,
        appId: this.daoAppID.value,
        args: [
          mbrPayment,
          proposalID,
          vote
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  finalizeProposal(walletID: uint64, rekeyBack: boolean, proposalID: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)
    
    abiCall(
      AkitaDAO.prototype.finalizeProposal,
      {
        sender,
        appId: this.daoAppID.value,
        args: [proposalID],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  executeProposal(walletID: uint64, rekeyBack: boolean, proposalID: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      AkitaDAO.prototype.executeProposal,
      {
        sender,
        appId: this.daoAppID.value,
        args: [proposalID],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }
}