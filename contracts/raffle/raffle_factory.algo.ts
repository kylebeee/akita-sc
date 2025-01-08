import { Contract } from "@algorandfoundation/tealscript";
import { Raffle } from "./raffle.algo";
import { ContractWithOptIn } from "../../utils/base_contracts/optin.algo";


export class RaffleFactory extends ContractWithOptIn {

    /** the version of the child contract */
    childContractVersion = GlobalStateKey<string>({ key: 'child_contract_version' });

    createApplication(version: string): void {
        this.childContractVersion.value = version;
    }

    updateApplication(): void {
        assert(this.txn.sender === this.app.creator)
    }

    mint(
        payment: PayTxn,
        assetXfer: AssetTransferTxn,
        ticketAsset: AssetID,
        startingRound: uint64,
        endingRound: uint64,
        minTickets: uint64,
        maxTickets: uint64,
        gateID: uint64,
    ): AppID {

        const ticketAndPrizeTheSame = ticketAsset === assetXfer.xferAsset;

        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: (
                100_000 // requires 3 extra pages
                + (28_500 * Raffle.schema.global.numUint)
                + (50_000 * Raffle.schema.global.numByteSlice)
                + (ticketAndPrizeTheSame
                    ? globals.assetOptInMinBalance * 2
                    : globals.assetOptInMinBalance
                )
            ),
        });

        verifyAssetTransferTxn(assetXfer, { assetReceiver: this.app.address });

        this.pendingGroup.addMethodCall<typeof Raffle.prototype.createApplication, void>({
            methodArgs: [
                ticketAsset,
                startingRound,
                endingRound,
                minTickets,
                maxTickets,
                assetXfer.xferAsset,
                assetXfer.assetAmount,
                gateID
            ],
            approvalProgram: Raffle.approvalProgram(),
            clearStateProgram: Raffle.clearProgram(),
            globalNumUint: Raffle.schema.global.numUint,
            globalNumByteSlice: Raffle.schema.global.numByteSlice,
            extraProgramPages: 0,
            fee: 0,
        });

        const raffleAppID = this.itxn.createdApplicationID;

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

        if (ticketAndPrizeTheSame) {
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

        

        this.pendingGroup.submit();

        return this.itxn.createdApplicationID;
    }
}