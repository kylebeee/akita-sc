import {
  abimethod,
  Account,
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
import { abiCall, compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { classes } from 'polytype'
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from '../utils/constants'
import { ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER, ERR_NOT_PRIZE_BOX_OWNER } from '../utils/errors'
import { getFunder, getNFTFees, getPrizeBoxOwner, royalties } from '../utils/functions'
import { Proof } from '../utils/types/merkles'
import { BaseRaffle } from './base'
import { ERR_NOT_A_RAFFLE } from './errors'

// CONTRACT IMPORTS
import type { PrizeBox } from '../prize-box/contract.algo'
import { FactoryContract } from '../utils/base-contracts/factory'
import { ContractWithOptIn } from '../utils/base-contracts/optin'
import { Raffle } from './contract.algo'

export class RaffleFactory extends classes(
  BaseRaffle,
  FactoryContract,
  ContractWithOptIn
) {

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private createChildApp(
    isPrizeBox: boolean,
    payment: gtxn.PaymentTxn,
    prizeID: uint64, // Asset or Prize Box Application
    ticketAsset: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64,
    creatorRoyalty: uint64,
    minTickets: uint64,
    maxTickets: uint64,
    gateID: uint64,
    marketplace: Account,
    weightsListCount: uint64
  ): Application {

    const isAlgoTicket = ticketAsset === 0
    const daoEscrowNeedsToOptIn = !this.akitaDAOEscrow.value.address.isOptedIn(Asset(ticketAsset))
    const optinMBR: uint64 = (
      Global.assetOptInMinBalance * (
        isAlgoTicket ? 0 : daoEscrowNeedsToOptIn ? 2 : 6
      )
    )

    const costs = this.mbr()
    const childAppMBR: uint64 = Global.minBalance + optinMBR
    const weightsMBR: uint64 = (weightsListCount * costs.weights)
    const fees = getNFTFees(this.akitaDAO.value)

    const raffle = compileArc4(Raffle)

    const totalMBR: uint64 = (
      fees.raffleCreationFee +
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * raffle.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * raffle.globalBytes) +
      childAppMBR +
      weightsMBR
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
      })
      .submit()

    const appId = raffle.call
      .create({
        args: [
          prizeID,
          isPrizeBox,
          ticketAsset,
          startTimestamp,
          endTimestamp,
          Txn.sender,
          { account: payment.sender, amount: totalMBR },
          creatorRoyalty,
          minTickets,
          maxTickets,
          gateID,
          marketplace,
          this.akitaDAO.value,
          this.akitaDAOEscrow.value,
        ],
      })
      .itxn
      .createdApp

    if (!isAlgoTicket) {
      raffle.call.optin({
        appId,
        args: [
          itxn.payment({
            receiver: appId.address,
            amount: Global.assetOptInMinBalance,
          }),
          ticketAsset,
        ],
      })
    }

    abiCall<typeof Raffle.prototype.init>({
      appId,
      args: [
        itxn.payment({
          receiver: appId.address,
          amount: weightsMBR,
        }),
        weightsListCount,
      ],
    })

    return appId
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, childVersion: string, akitaDAO: Application, akitaDAOEscrow: Application): void {
    this.version.value = version
    this.childContractVersion.value = childVersion
    this.akitaDAO.value = akitaDAO
    this.akitaDAOEscrow.value = akitaDAOEscrow
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
    marketplace: Account,
    name: string,
    proof: Proof,
    weightsListCount: uint64
  ): uint64 {

    // make sure they actually sent the asset(s) they want to raffle
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
      marketplace,
      weightsListCount
    )

    const raffle = compileArc4(Raffle)

    // optin child contract to asset (we can use the AuctionBase)
    raffle.call.optin({
      appId: raffleApp,
      args: [
        itxn.payment({
          receiver: raffleApp.address,
          amount: Global.assetOptInMinBalance,
        }),
        assetXfer.xferAsset.id,
      ],
    })

    // xfer asset to child
    itxn
      .assetTransfer({
        assetReceiver: raffleApp.address,
        assetAmount: assetXfer.assetAmount,
        xferAsset: assetXfer.xferAsset,
      })
      .submit()

    return raffleApp.id
  }

  newPrizeBoxRaffle(
    payment: gtxn.PaymentTxn,
    prizeBox: Application,
    ticketAsset: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64,
    minTickets: uint64,
    maxTickets: uint64,
    gateID: uint64,
    marketplace: Account,
    weightsListCount: uint64
  ): uint64 {

    assert(getPrizeBoxOwner(this.akitaDAO.value, prizeBox) === Global.currentApplicationAddress, ERR_NOT_PRIZE_BOX_OWNER)

    const raffleApp = this.createChildApp(
      true,
      payment,
      prizeBox.id,
      ticketAsset,
      startTimestamp,
      endTimestamp,
      0,
      minTickets,
      maxTickets,
      gateID,
      marketplace,
      weightsListCount
    )

    const costs = this.mbr()
    const childAppMBR: uint64 = (weightsListCount * costs.weights)

    abiCall<typeof Raffle.prototype.init>({
      appId: raffleApp,
      args: [
        itxn.payment({
          receiver: raffleApp.address,
          amount: childAppMBR,
        }),
        weightsListCount,
      ],
    })

    abiCall<typeof PrizeBox.prototype.transfer>({
      appId: prizeBox.id,
      args: [raffleApp.address],
    })

    return raffleApp.id
  }

  deleteRaffle(appId: Application): void {
    assert(appId.creator === Global.currentApplicationAddress, ERR_NOT_A_RAFFLE)

    abiCall<typeof Raffle.prototype.deleteApplication>({
      appId
    })

    const { account: receiver, amount } = getFunder(appId)

    itxn
      .payment({ amount, receiver })
      .submit()
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  // TODO: implement readonly listing methods
}
