import {
  abimethod,
  Application,
  assert,
  assertMatch,
  Global,
  gtxn,
  itxn,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { classes } from 'polytype'
import { abiCall, Address, compileArc4, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { ContractWithOptIn } from '../utils/base-contracts/optin'
import { arc4AppCreatorValue, ServiceFactoryContract } from '../utils/base-contracts/factory'
import { Raffle } from './contract.algo'
import { ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER, ERR_NOT_PRIZE_BOX_OWNER } from '../utils/errors'
import { PrizeBox } from '../prize-box/contract.algo'
import { BaseRaffle } from './base'
import { AccountMinimumBalance, GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from '../utils/constants'

const raffle = compileArc4(Raffle)

export class RaffleFactory extends classes(ServiceFactoryContract, ContractWithOptIn, BaseRaffle) {

  private createChildApp(
    isPrizeBox: boolean,
    payment: gtxn.PaymentTxn,
    prizeID: uint64,
    ticketAsset: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64,
    minTickets: uint64,
    maxTickets: uint64,
    gateID: uint64,
    marketplace: Address,
    weightsListCount: uint64
  ): Application {
    const isAlgoTicket = ticketAsset === 0
    const optinMBR = isAlgoTicket
      ? Global.assetOptInMinBalance
      : Global.assetOptInMinBalance * 2

    const fcosts = this.fmbr()
    const costs = this.mbr()

    const childAppMBR = AccountMinimumBalance + optinMBR + (weightsListCount * costs.weights)
    const totalMBR = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * raffle.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * raffle.globalBytes) +
      fcosts.appCreators +
      childAppMBR
    )

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: totalMBR,
      },
      ERR_INVALID_PAYMENT
    )

    const raffleApp = raffle.call
      .createApplication({
        args: [
          prizeID,
          isPrizeBox,
          ticketAsset,
          startTimestamp,
          endTimestamp,
          new Address(Txn.sender),
          minTickets,
          maxTickets,
          gateID,
          marketplace,
          this.akitaDAO.value.id,
        ],
        fee: 0,
      })
      .itxn
      .createdApp

    this.appCreators(raffleApp.id).value = new arc4AppCreatorValue({
      creatorAddress: new Address(payment.sender),
      amount: new UintN64(totalMBR),
    })

    raffle.call.init({
      appId: raffleApp,
      args: [
        itxn.payment({
          receiver: raffleApp.address,
          amount: childAppMBR,
          fee: 0,
        }),
        weightsListCount,
      ],
      fee: 0,
    })

    if (!isAlgoTicket) {
      raffle.call.optin({
        appId: raffleApp,
        args: [
          itxn.payment({
            receiver: raffleApp.address,
            amount: Global.assetOptInMinBalance,
            fee: 0,
          }),
          ticketAsset,
        ],
        fee: 0,
      })
    }

    return raffleApp
  }

  @abimethod({ onCreate: 'require' })
  createApplication(version: string): void {
    this.childContractVersion.value = version
  }

  newRaffle(
    payment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    ticketAsset: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64,
    minTickets: uint64,
    maxTickets: uint64,
    gateID: uint64,
    marketplace: Address,
    weightsListCount: uint64
  ): uint64 {

    // make sure they actually sent the asset they want to raffle
    assertMatch(
      assetXfer,
      {
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: { greaterThan: 0 },
      },
      ERR_INVALID_TRANSFER
    )

    const raffleApp = this.createChildApp(
      false,
      payment,
      assetXfer.xferAsset.id,
      ticketAsset,
      startTimestamp,
      endTimestamp,
      minTickets,
      maxTickets,
      gateID,
      marketplace,
      weightsListCount
    )

    // optin child contract to asset (we can use the AuctionBase)
    raffle.call.optin({
      appId: raffleApp,
      args: [
        itxn.payment({
          receiver: raffleApp.address,
          amount: Global.assetOptInMinBalance,
          fee: 0,
        }),
        assetXfer.xferAsset.id,
      ],
      fee: 0,
    })

    // xfer asset to child
    itxn
      .assetTransfer({
        assetReceiver: raffleApp.address,
        assetAmount: assetXfer.assetAmount,
        xferAsset: assetXfer.xferAsset,
        fee: 0,
      })
      .submit()

    return raffleApp.id
  }

  newPrizeBoxRaffle(
    payment: gtxn.PaymentTxn,
    prizeBoxID: uint64,
    ticketAsset: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64,
    minTickets: uint64,
    maxTickets: uint64,
    gateID: uint64,
    marketplace: Address,
    weightsListCount: uint64
  ): uint64 {

    assert(super.getPrizeBoxOwner(Application(prizeBoxID)) === Global.currentApplicationAddress, ERR_NOT_PRIZE_BOX_OWNER)

    const raffleApp = this.createChildApp(
      true,
      payment,
      prizeBoxID,
      ticketAsset,
      startTimestamp,
      endTimestamp,
      minTickets,
      maxTickets,
      gateID,
      marketplace,
      weightsListCount
    )

    abiCall(PrizeBox.prototype.transfer, {
      appId: prizeBoxID,
      args: [new Address(raffleApp.address)],
      fee: 0,
    })

    return raffleApp.id
  }

  deleteRaffle(raffleAppID: uint64): void {

    raffle.call.deleteApplication({ appId: raffleAppID, fee: 0 })

    const { amount, creatorAddress } = this.getAppCreator(raffleAppID)
    this.appCreators(raffleAppID).delete()

    itxn
      .payment({
        amount,
        receiver: creatorAddress.native,
        fee: 0,
      })
      .submit()
  }
}
