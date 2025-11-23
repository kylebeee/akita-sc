import { abimethod, Account, Application, assert, Bytes, Global, GlobalState, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript";
import { abiCall, compileArc4, encodeArc4, methodSelector } from "@algorandfoundation/algorand-typescript/arc4";
import { GateMustCheckAbiMethod } from "../../../gates/constants";
import { GateArgs } from "../../../gates/types";
import { PollGlobalStateKeyGateID, votesMBR } from "../../../poll/constants";
import { PollType } from "../../../poll/types";
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MIN_PROGRAM_PAGES } from "../../../utils/constants";
import { getAccounts, getAkitaAppList, getSpendingAccount, rekeyAddress } from "../../../utils/functions";
import { PollPluginGlobalStateKeyFactory } from "./constant";
import { ERR_CREATOR_NOT_POLL_FACTORY } from "./errors";

// CONTRACT IMPORTS
import { Poll } from "../../../poll/contract.algo";
import type { PollFactory } from "../../../poll/factory.algo";
import { AkitaBaseContract } from "../../../utils/base-contracts/base";


export class PollPluginContract extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  factory = GlobalState<Application>({ key: PollPluginGlobalStateKeyFactory })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, factory: uint64, akitaDAO: uint64): void {
    this.version.value = version
    this.factory.value = Application(factory)
    this.akitaDAO.value = Application(akitaDAO)
  }

  // POLL PLUGIN METHODS -----------------------------------------------------------------------

  new(
    wallet: Application,
    rekeyBack: boolean,
    type: PollType,
    endTime: uint64,
    maxSelected: uint64,
    question: string,
    options: string[],
    gateID: uint64,
  ): uint64 {
    const sender = getSpendingAccount(wallet)

    const poll = compileArc4(Poll)

    const amount: uint64 = (
      MIN_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * poll.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * poll.globalBytes) +
      Global.minBalance
    )

    const mbrPayment = itxn.payment({
      receiver: Application(this.factory.value.id).address,
      amount: amount,
    })

    return abiCall<typeof PollFactory.prototype.new>({
      sender,
      appId: this.factory.value.id,
      args: [
        mbrPayment,
        type,
        endTime,
        maxSelected,
        question,
        options,
        gateID
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    }).returnValue
  }

  deleteBoxes(wallet: Application, rekeyBack: boolean, pollAppID: uint64, addresses: Account[]): void {
    const sender = getSpendingAccount(wallet)

    assert(Application(pollAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_POLL_FACTORY)

    abiCall<typeof Poll.prototype.deleteBoxes>({
      sender,
      appId: pollAppID,
      args: [addresses],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  vote(wallet: Application, rekeyBack: boolean, pollAppID: uint64, votes: uint64[], args: GateArgs): void {
    const { origin, sender } = getAccounts(wallet)

    assert(Application(pollAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_POLL_FACTORY)

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(pollAppID).address,
      amount: votesMBR
    })

    if (args.length > 0) {
      const gate = getAkitaAppList(this.akitaDAO.value).gate
      const gateID = op.AppGlobal.getExUint64(pollAppID, Bytes(PollGlobalStateKeyGateID))[0]

      abiCall<typeof Poll.prototype.gatedVote>({
        sender,
        appId: pollAppID,
        args: [
          mbrPayment,
          itxn.applicationCall({
            sender,
            appId: gate,
            appArgs: [
              methodSelector(GateMustCheckAbiMethod),
              origin,
              gateID,
              encodeArc4(args)
            ]
          }),
          votes
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      }
      )
    } else {
      abiCall<typeof Poll.prototype.vote>({
        sender,
        appId: pollAppID,
        args: [mbrPayment, votes],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    }
  }
}