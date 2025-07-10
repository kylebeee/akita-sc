import {
  abimethod,
  Application,
  assert,
  assertMatch,
  Asset,
  Global,
  gtxn,
  itxn,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { classes } from 'polytype'
import { abiCall, Address, compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { ServiceFactoryContract } from '../utils/base-contracts/factory'
import { Raffle } from './contract.algo'
import { ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER, ERR_NOT_PRIZE_BOX_OWNER } from '../utils/errors'
import { PrizeBox } from '../prize-box/contract.algo'
import { BaseRaffle } from './base'
import { AccountMinimumBalance, GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from '../utils/constants'
import { fmbr, getNFTFees, getPrizeBoxOwner, royalties } from '../utils/functions'
import { ContractWithOptIn } from '../utils/base-contracts/optin'
import { ERR_APP_CREATOR_NOT_FOUND, ERR_NOT_A_RAFFLE } from './errors'
import { fee } from '../utils/constants'
import { Proof } from '../utils/types/merkles'

export class RaffleFactory extends classes(
  BaseRaffle,
  ServiceFactoryContract,
  ContractWithOptIn
) {

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private createChildApp(
    isPrizeBox: boolean,
    payment: gtxn.PaymentTxn,
    prizeID: uint64,
    ticketAsset: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64,
    creatorRoyalty: uint64,
    minTickets: uint64,
    maxTickets: uint64,
    gateID: uint64,
    marketplace: Address
  ): Application {

    const isAlgoTicket = ticketAsset === 0
    const daoEscrowNeedsToOptIn = !this.akitaDAOEscrow.value.address.isOptedIn(Asset(ticketAsset))
    const optinMBR: uint64 = (
      Global.assetOptInMinBalance * (
        isAlgoTicket ? 0 : daoEscrowNeedsToOptIn ? 2 : 6
      )
    )

    const fcosts = fmbr()

    const childAppMBR: uint64 = AccountMinimumBalance + optinMBR
    const fees = getNFTFees(this.akitaDAO.value)

    const raffle = compileArc4(Raffle)

    const totalMBR: uint64 = (
      fees.raffleCreationFee +
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

    itxn
      .payment({
        receiver: this.akitaDAOEscrow.value.address,
        amount: fees.raffleCreationFee,
        fee,
      })
      .submit()

    const raffleApp = raffle.call
      .create({
        args: [
          prizeID,
          isPrizeBox,
          ticketAsset,
          startTimestamp,
          endTimestamp,
          new Address(Txn.sender),
          creatorRoyalty,
          minTickets,
          maxTickets,
          gateID,
          marketplace,
          this.akitaDAO.value.id,
          this.akitaDAOEscrow.value.id,
        ],
        fee,
      })
      .itxn
      .createdApp

    this.appCreators(raffleApp.id).value = {
      creator: payment.sender,
      amount: (totalMBR - fees.raffleCreationFee),
    }

    if (!isAlgoTicket) {
      raffle.call.optin({
        appId: raffleApp,
        args: [
          itxn.payment({
            receiver: raffleApp.address,
            amount: Global.assetOptInMinBalance,
            fee,
          }),
          ticketAsset,
        ],
        fee,
      })
    }

    return raffleApp
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, childVersion: string, akitaDAO: uint64, escrow: uint64): void {
    this.version.value = version
    this.childContractVersion.value = childVersion
    this.akitaDAO.value = Application(akitaDAO)
    this.akitaDAOEscrow.value = Application(escrow)
  }

  // RAFFLE FACTORY METHODS -----------------------------------------------------------------------

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
    name: string,
    proof: Proof
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

    const creatorRoyalty = royalties(this.akitaDAO.value, assetXfer.xferAsset, name, proof)

    const raffleApp = this.createChildApp(
      false,
      payment,
      assetXfer.xferAsset.id,
      ticketAsset,
      startTimestamp,
      endTimestamp,
      creatorRoyalty,
      minTickets,
      maxTickets,
      gateID,
      marketplace
    )

    const raffle = compileArc4(Raffle)

    // optin child contract to asset (we can use the AuctionBase)
    raffle.call.optin({
      appId: raffleApp,
      args: [
        itxn.payment({
          receiver: raffleApp.address,
          amount: Global.assetOptInMinBalance,
          fee,
        }),
        assetXfer.xferAsset.id,
      ],
      fee,
    })

    // xfer asset to child
    itxn
      .assetTransfer({
        assetReceiver: raffleApp.address,
        assetAmount: assetXfer.assetAmount,
        xferAsset: assetXfer.xferAsset,
        fee,
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
    marketplace: Address
  ): uint64 {

    assert(getPrizeBoxOwner(this.akitaDAO.value, Application(prizeBoxID)) === Global.currentApplicationAddress, ERR_NOT_PRIZE_BOX_OWNER)

    const raffleApp = this.createChildApp(
      true,
      payment,
      prizeBoxID,
      ticketAsset,
      startTimestamp,
      endTimestamp,
      0,
      minTickets,
      maxTickets,
      gateID,
      marketplace
    )

    abiCall(PrizeBox.prototype.transfer, {
      appId: prizeBoxID,
      args: [new Address(raffleApp.address)],
      fee,
    })

    return raffleApp.id
  }

  initRaffle(payment: gtxn.PaymentTxn, raffleID: uint64, weightsListCount: uint64): void {
    assert(Application(raffleID).creator === Global.currentApplicationAddress, ERR_NOT_A_RAFFLE)
    assert(this.appCreators(raffleID).exists, ERR_APP_CREATOR_NOT_FOUND)

    const costs = this.mbr()
    const childAppMBR: uint64 = (weightsListCount * costs.weights)

    assertMatch(
      payment,
      {
        sender: this.appCreators(raffleID).value.creator,
        receiver: Global.currentApplicationAddress,
        amount: childAppMBR,
      },
      ERR_INVALID_PAYMENT
    )

    const raffle = compileArc4(Raffle)

    raffle.call.init({
      appId: raffleID,
      args: [
        itxn.payment({
          receiver: Application(raffleID).address,
          amount: childAppMBR,
          fee,
        }),
        weightsListCount,
      ],
      fee,
    })

    const prevAppCreators = this.appCreators(raffleID).value
    this.appCreators(raffleID).value = { ...prevAppCreators, amount: (prevAppCreators.amount + childAppMBR) }
  }

  deleteRaffle(raffleID: uint64): void {

    const raffle = compileArc4(Raffle)

    raffle.call.deleteApplication({ appId: raffleID, fee })

    const { amount, creator } = this.appCreators(raffleID).value
    this.appCreators(raffleID).delete()

    itxn
      .payment({
        amount,
        receiver: creator,
        fee,
      })
      .submit()
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  // TODO: implement readonly listing methods
}
