import { Contract } from "@algorandfoundation/tealscript";
import { Raffle } from "./raffle.algo";
import { ContractWithOptIn } from "../../utils/base_contracts/optin.algo";
import { AKITA_DAO_VRF_BEACON_APP_ID_KEY } from "../dao/constants";

const errs = {
    NOT_AKITA_DAO: 'Only the Akita DAO can call this function',
    MARKETPLACE_NOT_OPTED_INTO_TICKET_ASSET: 'factory not opted into ticket asset',
}

export class RaffleFactory extends ContractWithOptIn {

    /** the version of the child contract */
    childContractVersion = GlobalStateKey<string>({ key: 'child_contract_version' });
    /** The App ID of the Akita DAO contract */
    akitaDaoAppID = TemplateVar<AppID>();

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
                100_000 // requires 3 extra pages
                + (28_500 * Raffle.schema.global.numUint)
                + (50_000 * Raffle.schema.global.numByteSlice)
                + optinMBR
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
            extraProgramPages: 0,
            fee: 0,
        });

        const raffleAppID = this.itxn.createdApplicationID;

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
}