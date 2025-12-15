import { microAlgo } from "@algorandfoundation/algokit-utils";
import { BaseSDK } from "../base";
import { RaffleFactory, } from '../generated/RaffleClient';
/** The number of entries stored in each weights box */
const CHUNK_SIZE = 4096n;
export * from "./factory";
export * from "./types";
/**
 * SDK for interacting with an individual Raffle contract.
 * Use this to manage raffle entries, draw winners, and claim prizes.
 */
export class RaffleSDK extends BaseSDK {
    constructor(params) {
        super({ factory: RaffleFactory, ...params });
    }
    // ========== Read Methods ==========
    /**
     * Gets the current state of the raffle.
     */
    async state() {
        const { return: state } = await this.client.send.getState({ args: {} });
        if (state === undefined) {
            throw new Error('Failed to get raffle state');
        }
        return state;
    }
    /**
     * Checks if the raffle is currently live (accepting entries).
     */
    async isLive() {
        const isLive = await this.client.isLive();
        return isLive ?? false;
    }
    /**
     * Gets the MBR (Minimum Balance Requirement) data for raffle operations.
     */
    async mbr() {
        const mbrData = await this.client.mbr();
        return {
            entries: mbrData.entries,
            weights: mbrData.weights,
            entriesByAddress: mbrData.entriesByAddress,
        };
    }
    /**
     * Gets an entry by its ID.
     */
    async getEntry({ entryId }) {
        const entry = await this.client.state.box.entries.value(entryId);
        if (entry === undefined) {
            throw new Error(`Entry ${entryId} not found`);
        }
        return entry;
    }
    /**
     * Checks if an address has entered the raffle.
     */
    async isEntered({ address }) {
        try {
            const entryId = await this.client.state.box.entriesByAddress.value(address);
            return entryId !== undefined;
        }
        catch {
            return false;
        }
    }
    /**
     * Gets the entry ID for an address.
     */
    async getEntryByAddress({ address }) {
        const entryId = await this.client.state.box.entriesByAddress.value(address);
        if (entryId === undefined) {
            throw new Error(`No entry found for address ${address}`);
        }
        return entryId;
    }
    /**
     * Gets the ticket count for an entry from the weights boxmap.
     * @param entryId - The entry ID to look up
     * @returns The ticket count for the entry
     */
    async getTicketCount({ entryId }) {
        const id = BigInt(entryId);
        const boxIndex = id / CHUNK_SIZE;
        const slotIndex = Number(id % CHUNK_SIZE);
        const weightsBox = await this.client.state.box.weights.value(boxIndex);
        if (weightsBox === undefined) {
            throw new Error(`Weights box ${boxIndex} not found`);
        }
        return weightsBox[slotIndex];
    }
    /**
     * Gets an entry with its ticket count combined.
     * This is a convenience method that fetches both entry data and the ticket count
     * from the weights boxmap in a single call.
     */
    async getEntryWithTickets({ entryId }) {
        const id = BigInt(entryId);
        const boxIndex = id / CHUNK_SIZE;
        const slotIndex = Number(id % CHUNK_SIZE);
        const [entry, weightsBox] = await Promise.all([
            this.client.state.box.entries.value(id),
            this.client.state.box.weights.value(boxIndex),
        ]);
        if (entry === undefined) {
            throw new Error(`Entry ${entryId} not found`);
        }
        if (weightsBox === undefined) {
            throw new Error(`Weights box ${boxIndex} not found`);
        }
        return {
            ...entry,
            entryId: id,
            ticketCount: weightsBox[slotIndex],
        };
    }
    /**
     * Gets an entry with its ticket count by address.
     * This is a convenience method that looks up the entry ID by address,
     * then fetches both entry data and the ticket count.
     */
    async getEntryWithTicketsByAddress({ address }) {
        let entryId;
        try {
            entryId = await this.client.state.box.entriesByAddress.value(address);
        }
        catch (error) {
            // Box not found (404) means the address hasn't entered
            if (error?.message?.includes('box not found') || error?.message?.includes('404')) {
                throw new Error(`No entry found for address ${address}`);
            }
            throw error;
        }
        if (entryId === undefined) {
            throw new Error(`No entry found for address ${address}`);
        }
        return this.getEntryWithTickets({ entryId });
    }
    /**
     * Gets all entries with their ticket counts.
     * This fetches all entries and their corresponding ticket counts from the weights boxmap.
     * Note: For large raffles, this may require multiple reads.
     */
    async getAllEntriesWithTickets() {
        const [entriesMap, state] = await Promise.all([
            this.client.state.box.entries.getMap(),
            this.state(),
        ]);
        const entryCount = state.entryCount;
        const boxCount = (entryCount + CHUNK_SIZE - 1n) / CHUNK_SIZE;
        // Fetch all weights boxes in parallel
        const weightsPromises = [];
        for (let i = 0n; i < boxCount; i++) {
            weightsPromises.push(this.client.state.box.weights.value(i));
        }
        const weightsBoxes = await Promise.all(weightsPromises);
        const result = [];
        for (const [entryId, entry] of entriesMap) {
            const boxIndex = Number(entryId / CHUNK_SIZE);
            const slotIndex = Number(entryId % CHUNK_SIZE);
            const weightsBox = weightsBoxes[boxIndex];
            if (weightsBox === undefined) {
                throw new Error(`Weights box ${boxIndex} not found`);
            }
            result.push({
                ...entry,
                entryId,
                ticketCount: weightsBox[slotIndex],
            });
        }
        return result;
    }
    // ========== Write Methods ==========
    /**
     * Enters the raffle with tickets.
     * Use `isAsa: true` and `ticketAsset` for ASA tickets, otherwise ALGO is used.
     */
    async enter({ sender, signer, amount, marketplace, isAsa = false, proofs = [], ...rest }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Get MBR costs
        const mbrData = await this.mbr();
        const mbrCost = mbrData.entries + mbrData.entriesByAddress;
        // Use opUps to handle app reference limits (gate checks, DAO access, etc.)
        const group = this.client.newGroup();
        if (isAsa) {
            const { ticketAsset } = rest;
            const payment = await this.client.algorand.createTransaction.payment({
                ...sendParams,
                amount: microAlgo(mbrCost),
                receiver: this.client.appAddress,
            });
            const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
                ...sendParams,
                amount: BigInt(amount),
                assetId: BigInt(ticketAsset),
                receiver: this.client.appAddress,
            });
            group.enterAsa({
                ...sendParams,
                args: {
                    payment,
                    assetXfer,
                    marketplace,
                    args: proofs,
                },
            });
        }
        else {
            const payment = await this.client.algorand.createTransaction.payment({
                ...sendParams,
                amount: microAlgo(BigInt(amount) + mbrCost),
                receiver: this.client.appAddress,
            });
            group.enter({
                ...sendParams,
                args: {
                    payment,
                    marketplace,
                    args: proofs,
                },
            });
        }
        // Add opUps to increase app reference limit
        // enter + payment (and possibly assetXfer) = 2-3 transactions, so we can add up to 13-14 opUps
        for (let i = 0; i < 10; i++) {
            group.opUp({ ...sendParams, args: {}, note: i > 0 ? `opUp-${i}` : undefined });
        }
        await group.send(sendParams);
    }
    /**
     * Adds more tickets to an existing entry.
     * Use `isAsa: true` and `ticketAsset` for ASA tickets, otherwise ALGO is used.
     */
    async add({ sender, signer, amount, isAsa = false, proofs = [], ...rest }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Use opUps to handle app reference limits (gate checks, DAO access, etc.)
        const group = this.client.newGroup();
        if (isAsa) {
            const { ticketAsset } = rest;
            const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
                ...sendParams,
                amount: BigInt(amount),
                assetId: BigInt(ticketAsset),
                receiver: this.client.appAddress,
            });
            group.addAsa({
                ...sendParams,
                args: {
                    assetXfer,
                    args: proofs,
                },
            });
        }
        else {
            const payment = await this.client.algorand.createTransaction.payment({
                ...sendParams,
                amount: microAlgo(amount),
                receiver: this.client.appAddress,
            });
            group.add({
                ...sendParams,
                args: {
                    payment,
                    args: proofs,
                },
            });
        }
        // Add opUps to increase app reference limit
        // add + payment (and possibly assetXfer) = 2-3 transactions, so we can add up to 13-14 opUps
        for (let i = 0; i < 10; i++) {
            group.opUp({ ...sendParams, args: {}, note: i > 0 ? `opUp-${i}` : undefined });
        }
        await group.send(sendParams);
    }
    /**
     * Triggers the raffle to draw the winning ticket number.
     * Can only be called after the raffle has ended.
     */
    async raffle(params) {
        const sendParams = this.getSendParams(params);
        await this.client.send.raffle({
            ...sendParams,
            args: {},
        });
    }
    /**
     * Iterates to find the winner based on the winning ticket.
     * May need to be called multiple times for large raffles.
     */
    async findWinner({ sender, signer, iterationAmount }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.findWinner({
            ...sendParams,
            args: { iterationAmount },
        });
    }
    /**
     * Claims the raffle prize for the winner.
     * Also distributes royalties to marketplace, creator, and Akita.
     */
    async claimPrize(params) {
        const sendParams = this.getSendParams(params);
        await this.client.send.claimRafflePrize({
            ...sendParams,
            args: {},
        });
    }
    /**
     * Refunds MBR to raffle participants after the winner is found.
     * May need to be called multiple times for large raffles.
     */
    async refundMBR({ sender, signer, iterationAmount }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.refundMbr({
            ...sendParams,
            args: { iterationAmount },
        });
    }
    /**
     * Clears the weights boxes after the prize has been claimed.
     * Returns the MBR for the weights boxes to the factory.
     */
    async clearWeightsBoxes(params) {
        const sendParams = this.getSendParams(params);
        const { return: returnAmount } = await this.client.send.clearWeightsBoxes({
            ...sendParams,
            args: {},
        });
        if (returnAmount === undefined) {
            throw new Error('Failed to clear weights boxes');
        }
        return returnAmount;
    }
}
//# sourceMappingURL=index.js.map