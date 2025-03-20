import { abimethod, Application, arc4, assert, compile, Global, gtxn, itxn, OnCompleteAction, Txn, uint64 } from "@algorandfoundation/algorand-typescript";
import { ContractWithOptIn } from "../../utils/base_contracts/optin.algo"
import { classes } from 'polytype'
import { arc4AppCreatorKey, ServiceFactoryContract } from "../../utils/base_contracts/factory.algo";
import { ERR_NOT_AKITA_DAO } from "../errors";
import { Raffle } from "./raffle.algo";
import { ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER, ERR_NOT_PRIZE_BOX_OWNER } from "../../utils/errors";
import { appCreatorsMBR, weightsListMBR } from "./constants";
import { Address, methodSelector } from "@algorandfoundation/algorand-typescript/arc4";
import { ERR_APP_CREATOR_NOT_FOUND } from "./errors";
import { btoi } from "@algorandfoundation/algorand-typescript/op";
import { PrizeBox } from "../prize_box/prize_box.algo";

export class RaffleFactory extends classes(ServiceFactoryContract, ContractWithOptIn) {

  // @ts-ignore
  @abimethod({ onCreate: 'require' })
  createApplication(version: string): void {
    this.childContractVersion.value = version
  }

  // @ts-ignore
  @abimethod({ allowActions: ['UpdateApplication'] })
  updateApplication(): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
  }

  new(
    payment: gtxn.PaymentTxn,
    prize: uint64,
    ticketAsset: uint64,
    startingRound: uint64,
    endingRound: uint64,
    minTickets: uint64,
    maxTickets: uint64,
    gateID: uint64,
    weightsListCount: uint64,
  ): uint64 {
    let optinMBR = Global.assetOptInMinBalance
    const ticketAssetIsAlgo = ticketAsset === 0
    if (!ticketAssetIsAlgo) {
      optinMBR += Global.assetOptInMinBalance
    }

    assert(super.getPrizeBoxOwner(Application(prize)) === Global.currentApplicationAddress, ERR_NOT_PRIZE_BOX_OWNER)

    const raffle = compile(Raffle)

    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(payment.amount >=
      (
        300_000
        + (28_500 * raffle.globalUints)
        + (50_000 * raffle.globalBytes)
        + optinMBR
        + (weightsListCount * weightsListMBR)
        + appCreatorsMBR
      ),
      ERR_INVALID_PAYMENT_AMOUNT
    )

    // TODO: replace with arc4.abiCall when available
    const mint = itxn
      .applicationCall({
        appArgs: [
          methodSelector(Raffle.prototype.createApplication),
          prize,
          ticketAsset,
          startingRound,
          endingRound,
          Txn.sender,
          minTickets,
          maxTickets,
          gateID,
          this.akitaDAO.value.id,
        ],
        approvalProgram: raffle.approvalProgram,
        clearStateProgram: raffle.clearStateProgram,
        globalNumUint: raffle.globalUints,
        globalNumBytes: raffle.globalBytes,
        extraProgramPages: 2,
        fee: 0,
      })
      .submit()

    const raffleApp = mint.createdApp

    const appCreatorKey = new arc4AppCreatorKey({
      address: new Address(payment.sender),
      appID: new arc4.UintN64(raffleApp.id),
    })
    this.appCreators(appCreatorKey).value = new arc4.UintN64(appCreatorsMBR)

    // TODO: replace with arc4.abiCall when available
    itxn
      .applicationCall({
        appId: raffleApp,
        appArgs: [
          methodSelector(Raffle.prototype.init),
          itxn.payment({
            receiver: raffleApp.address,
            amount: (weightsListCount * weightsListMBR),
            fee: 0,
          }),
          weightsListCount,
        ],
        fee: 0,
      })
      .submit()

    if (!ticketAssetIsAlgo) {
      // TODO: replace with arc4.abiCall when available
      itxn
        .applicationCall({
          appId: raffleApp,
          appArgs: [
            methodSelector(Raffle.prototype.optin),
            itxn.payment({
              receiver: raffleApp.address,
              amount: Global.assetOptInMinBalance,
              fee: 0,
            }),
            ticketAsset,
          ],
          fee: 0,
        })
        .submit()
    }

    itxn
      .applicationCall({
        appId: prize,
        onCompletion: OnCompleteAction.NoOp,
        appArgs: [
          methodSelector(PrizeBox.prototype.transfer),
          raffleApp.address
        ],
        fee: 0,
      })
      .submit()

    return raffleApp.id
  }

  clearWeightsBoxes(address: Address, appID: arc4.UintN64): void {
    const keys = new arc4AppCreatorKey({ address, appID })
    assert(this.appCreators(keys).exists, ERR_APP_CREATOR_NOT_FOUND)

    // TODO: replace with arc4.abiCall when available
    const appCallTxn = itxn
      .applicationCall({
        appId: appID.native,
        appArgs: [
          methodSelector(Raffle.prototype.clearWeightsBoxes),
        ],
        fee: 0,
      })
      .submit()

    const returnedAmount = btoi(appCallTxn.lastLog)
    const newAmount = new arc4.UintN64(this.appCreators(keys).value.native + returnedAmount)
    this.appCreators(keys).value = newAmount
  }

  deleteRaffle(address: Address, appID: arc4.UintN64): void {
    const keys = new arc4AppCreatorKey({ address, appID })
    assert(this.appCreators(keys).exists, ERR_APP_CREATOR_NOT_FOUND)

    const before = Global.minBalance

    itxn
      .applicationCall({
        appId: appID.native,
        onCompletion: OnCompleteAction.DeleteApplication,
        appArgs: [
          methodSelector(Raffle.prototype.deleteApplication),
        ],
        fee: 0,
      })
      .submit()

    const appCreatorAmount = this.appCreators(keys).value.native

    this.appCreators(keys).delete()

    const after = Global.minBalance

    itxn
      .payment({
        amount: appCreatorAmount + (before - after),
        receiver: address.native,
        fee: 0
      })
      .submit()

    this.appCreators(keys).delete()
  }
}