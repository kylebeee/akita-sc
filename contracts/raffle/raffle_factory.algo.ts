import { Contract } from "@algorandfoundation/tealscript";
import { Raffle, weightsListMBR } from "./raffle.algo";
import { ContractWithOptIn } from "../../utils/base_contracts/optin.algo";
import { AKITA_DAO_VRF_BEACON_APP_ID_KEY } from "../dao/constants";

const errs = {
    NOT_AKITA_DAO: 'Only the Akita DAO can call this function',
    MARKETPLACE_NOT_OPTED_INTO_TICKET_ASSET: 'factory not opted into ticket asset',
    APP_CREATOR_NOT_FOUND: 'App creator not found',
}

export const appCreatorsMBR = 18_500;
export type AppCreatorKey = {
    address: Address;
    appID: AppID;
}

export class RaffleFactory extends ContractWithOptIn {
    /** the version of the child contract */
    childContractVersion = GlobalStateKey<string>({ key: 'child_contract_version' });
    /** The App ID of the Akita DAO contract */
    akitaDaoAppID = TemplateVar<AppID>();

    appCreators = BoxMap<AppCreatorKey, uint64>();

    createApplication(version: string): void {
        this.childContractVersion.value = version;
    }

    updateApplication(): void {
        assert(this.txn.sender === this.akitaDaoAppID.address, errs.NOT_AKITA_DAO);
    }

    new(
        payment: PayTxn,
        assetXfer: AssetTransferTxn,
        ticketAsset: AssetID,
        startingRound: uint64,
        endingRound: uint64,
        minTickets: uint64,
        maxTickets: uint64,
        gateID: uint64,
        weightsListCount: uint64,
    ): AppID {
        let optinMBR = 0;
        const prizeAssetIsAlgo = assetXfer.xferAsset.id === 0;
        if (prizeAssetIsAlgo) {
            optinMBR = globals.assetOptInMinBalance;
        }

        const ticketAssetIsAlgo = ticketAsset.id === 0;
        if (ticketAssetIsAlgo) {
            optinMBR += globals.assetOptInMinBalance;
        }

        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: (
                300_000 // requires 2 extra pages
                + (28_500 * Raffle.schema.global.numUint)
                + (50_000 * Raffle.schema.global.numByteSlice)
                + optinMBR
                + (weightsListCount * weightsListMBR)
                + appCreatorsMBR
            ),
        });

        verifyAssetTransferTxn(assetXfer, { assetReceiver: this.app.address });

        this.pendingGroup.addMethodCall<typeof Raffle.prototype.createApplication, void>({
            methodArgs: [
                assetXfer.xferAsset,
                ticketAsset,
                startingRound,
                endingRound,
                this.txn.sender,
                minTickets,
                maxTickets,
                gateID,
                this.akitaDaoAppID.globalState(AKITA_DAO_VRF_BEACON_APP_ID_KEY) as AppID,
            ],
            approvalProgram: Raffle.approvalProgram(),
            clearStateProgram: Raffle.clearProgram(),
            globalNumUint: Raffle.schema.global.numUint,
            globalNumByteSlice: Raffle.schema.global.numByteSlice,
            extraProgramPages: 2,
            fee: 0,
        });

        const raffleAppID = this.itxn.createdApplicationID;
        this.appCreators({ address: payment.sender, appID: raffleAppID }).value = appCreatorsMBR;

        this.pendingGroup.addMethodCall<typeof Raffle.prototype.init, void>({
            applicationID: raffleAppID,
            methodArgs: [
                {
                    receiver: raffleAppID.address,
                    amount: weightsListCount * weightsListMBR,
                    fee: 0,
                },
                weightsListCount
            ],
            fee: 0,
        })

        if (!prizeAssetIsAlgo) {
            this.pendingGroup.addMethodCall<typeof Raffle.prototype.optin, void>({
                applicationID: raffleAppID,
                methodArgs: [
                    {
                        receiver: raffleAppID.address,
                        amount: globals.assetOptInMinBalance,
                        fee: 0,
                    },
                    assetXfer.xferAsset,
                ],
                fee: 0,
            });
        }

        this.pendingGroup.addAssetTransfer({
            assetReceiver: raffleAppID.address,
            assetAmount: assetXfer.assetAmount,
            xferAsset: assetXfer.xferAsset,
            fee: 0,
        });

        if (!ticketAssetIsAlgo) {
            this.pendingGroup.addMethodCall<typeof Raffle.prototype.optin, void>({
                applicationID: raffleAppID,
                methodArgs: [
                    {
                        receiver: raffleAppID.address,
                        amount: globals.assetOptInMinBalance,
                        fee: 0,
                    },
                    ticketAsset,
                ],
                fee: 0,
            });
        }

        this.pendingGroup.submit();

        return this.itxn.createdApplicationID;
    }

    clearWeightsBoxes(creator: Address, auctionAppID: AppID): void {
        const keys: AppCreatorKey = { address: creator, appID: auctionAppID };
        assert(this.appCreators(keys).exists, errs.APP_CREATOR_NOT_FOUND);

        const returnedAmount = sendMethodCall<typeof Raffle.prototype.clearWeightsBoxes, void>({
            applicationID: auctionAppID,
            methodArgs: [],
            fee: 0,
        });

        this.appCreators(keys).value += returnedAmount;
    }

    deleteAuctionApp(creator: Address, auctionAppID: AppID): void {
        const keys: AppCreatorKey = { address: creator, appID: auctionAppID };
        assert(this.appCreators(keys).exists, errs.APP_CREATOR_NOT_FOUND);

        const origMBR = this.app.address.minBalance;
        sendMethodCall<typeof Raffle.prototype.deleteApplication, uint64>({
            applicationID: auctionAppID,
            methodArgs: [],
            fee: 0,
        });
        const newMBR = this.app.address.minBalance;

        sendPayment({
            amount: this.appCreators(keys).value + (origMBR - newMBR),
            receiver: creator,
            fee: 0,
        })
    }
}