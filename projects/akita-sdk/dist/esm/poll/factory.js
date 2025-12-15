import { microAlgo } from "@algorandfoundation/algokit-utils";
import { BaseSDK } from "../base";
import { ENV_VAR_NAMES } from "../config";
import { PollFactoryFactory, } from '../generated/PollFactoryClient';
import { PollSDK } from "./index";
/**
 * SDK for interacting with the Poll Factory contract.
 * Used to create new polls.
 */
export class PollFactorySDK extends BaseSDK {
    constructor(params) {
        super({ factory: PollFactoryFactory, ...params }, ENV_VAR_NAMES.POLL_FACTORY_APP_ID);
    }
    /**
     * Creates a new poll and returns a PollSDK instance.
     * @returns PollSDK for the newly created poll
     */
    async new({ sender, signer, type, endTime, maxSelected, question, options, gateId, }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Get the cost for creating a new poll
        const cost = await this.cost();
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: microAlgo(cost),
            receiver: this.client.appAddress,
        });
        const { return: appId } = await this.client.send.new({
            ...sendParams,
            args: {
                payment,
                type,
                endTime,
                maxSelected,
                question,
                options,
                gateId,
            },
        });
        if (appId === undefined) {
            throw new Error('Failed to create new poll');
        }
        return new PollSDK({
            algorand: this.algorand,
            factoryParams: {
                appId,
                defaultSender: sendParams.sender,
                defaultSigner: sendParams.signer,
            },
        });
    }
    /**
     * Gets a PollSDK instance for an existing poll.
     * @param appId - The app ID of the poll
     * @returns PollSDK for the specified poll
     */
    get({ appId }) {
        return new PollSDK({
            algorand: this.algorand,
            factoryParams: {
                appId,
                defaultSender: this.sendParams.sender,
                defaultSigner: this.sendParams.signer,
            },
        });
    }
    /**
     * Gets the cost to create a new poll.
     */
    async cost() {
        return await this.client.newPollCost();
    }
    /**
     * Updates the Akita DAO reference.
     */
    async updateAkitaDAO({ sender, signer, akitaDao }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.updateAkitaDao({
            ...sendParams,
            args: { akitaDao },
        });
    }
    /**
     * Updates the Akita DAO Escrow reference.
     */
    async updateAkitaDAOEscrow({ sender, signer, app }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.updateAkitaDaoEscrow({
            ...sendParams,
            args: { app },
        });
    }
}
/**
 * Convenience function to create a new poll and return the SDK.
 * Creates a factory SDK, creates the poll, and returns the poll SDK.
 */
export async function newPoll({ factoryParams, algorand, readerAccount, sendParams, ...pollParams }) {
    const factory = new PollFactorySDK({ factoryParams, algorand, readerAccount, sendParams });
    return await factory.new(pollParams);
}
//# sourceMappingURL=factory.js.map