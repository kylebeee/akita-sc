import {
    abimethod,
    Application,
    assert,
    Global,
    itxn,
    Txn,
    uint64,
} from '@algorandfoundation/algorand-typescript'
import { classes } from 'polytype'
import { abiCall, Address, compileArc4, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { ContractWithOptIn } from '../../utils/base_contracts/optin.algo'
import { arc4AppCreatorKey, ServiceFactoryContract } from '../../utils/base_contracts/factory.algo'
import { ERR_NOT_AKITA_DAO } from '../errors'
import { Raffle } from './raffle.algo'
import { ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER, ERR_NOT_PRIZE_BOX_OWNER } from '../../utils/errors'
import { ERR_APP_CREATOR_NOT_FOUND } from './errors'
import { PrizeBox } from '../prize_box/prize_box.algo'
import { BaseRaffle } from './base.algo'
import { PaymentTxn } from '@algorandfoundation/algorand-typescript/gtxn'

const raffle = compileArc4(Raffle)

export class RaffleFactory extends classes(ServiceFactoryContract, ContractWithOptIn, BaseRaffle) {

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
        payment: PaymentTxn,
        prize: uint64,
        ticketAsset: uint64,
        startingRound: uint64,
        endingRound: uint64,
        minTickets: uint64,
        maxTickets: uint64,
        gateID: uint64,
        weightsListCount: uint64
    ): uint64 {
        let optinMBR = Global.assetOptInMinBalance
        const ticketAssetIsAlgo = ticketAsset === 0
        if (!ticketAssetIsAlgo) {
            optinMBR += Global.assetOptInMinBalance
        }

        assert(super.getPrizeBoxOwner(Application(prize)) === Global.currentApplicationAddress, ERR_NOT_PRIZE_BOX_OWNER)

        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)

        const fcosts = this.fmbr()
        const costs = this.mbr()

        assert(
            payment.amount >=
                300_000 +
                    28_500 * raffle.globalUints +
                    50_000 * raffle.globalBytes +
                    optinMBR +
                    weightsListCount * costs.weights +
                    fcosts.appCreators,
            ERR_INVALID_PAYMENT_AMOUNT
        )

        const raffleApp = raffle.call.createApplication({
            args: [
                prize,
                ticketAsset,
                startingRound,
                endingRound,
                new Address(Txn.sender),
                minTickets,
                maxTickets,
                gateID,
                this.akitaDAO.value.id,
            ],
        }).itxn.createdApp

        const appCreatorKey = new arc4AppCreatorKey({
            address: new Address(payment.sender),
            appID: new UintN64(raffleApp.id),
        })
        this.appCreators(appCreatorKey).value = fcosts.appCreators

        raffle.call.init({
            appId: raffleApp,
            args: [
                itxn.payment({
                    receiver: raffleApp.address,
                    amount: weightsListCount * costs.weights,
                    fee: 0,
                }),
                weightsListCount,
            ],
            fee: 0,
        })

        if (!ticketAssetIsAlgo) {
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

        abiCall(PrizeBox.prototype.transfer, {
            appId: prize,
            args: [new Address(raffleApp.address)],
            fee: 0,
        })

        return raffleApp.id
    }

    clearWeightsBoxes(address: Address, appID: uint64): void {
        const keys = new arc4AppCreatorKey({ address, appID: new UintN64(appID) })
        assert(this.appCreators(keys).exists, ERR_APP_CREATOR_NOT_FOUND)

        const returnedAmount = raffle.call.clearWeightsBoxes({
            appId: appID,
            fee: 0,
        }).returnValue

        this.appCreators(keys).value += returnedAmount
    }

    deleteRaffle(address: Address, appID: uint64): void {
        const keys = new arc4AppCreatorKey({ address, appID: new UintN64(appID) })
        assert(this.appCreators(keys).exists, ERR_APP_CREATOR_NOT_FOUND)

        const before = Global.minBalance

        raffle.call.deleteApplication({ appId: appID, fee: 0 })

        const appCreatorAmount = this.appCreators(keys).value

        this.appCreators(keys).delete()

        const after = Global.minBalance

        itxn.payment({
            amount: appCreatorAmount + (before - after),
            receiver: address.native,
            fee: 0,
        }).submit()

        this.appCreators(keys).delete()
    }
}
