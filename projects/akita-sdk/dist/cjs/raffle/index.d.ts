import { BaseSDK } from "../base";
import { RaffleClient, RaffleState, EntryData } from '../generated/RaffleClient';
import { MaybeSigner, NewContractSDKParams } from "../types";
import { EnterParams, AddParams, RefundMBRParams, FindWinnerParams, GetEntryParams, IsEnteredParams, GetEntryByAddressParams, GetEntryWithTicketsParams, GetEntryWithTicketsByAddressParams, RaffleMbrData, EntryWithTickets } from "./types";
export * from "./factory";
export * from "./types";
/**
 * SDK for interacting with an individual Raffle contract.
 * Use this to manage raffle entries, draw winners, and claim prizes.
 */
export declare class RaffleSDK extends BaseSDK<RaffleClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Gets the current state of the raffle.
     */
    state(): Promise<RaffleState>;
    /**
     * Checks if the raffle is currently live (accepting entries).
     */
    isLive(): Promise<boolean>;
    /**
     * Gets the MBR (Minimum Balance Requirement) data for raffle operations.
     */
    mbr(): Promise<RaffleMbrData>;
    /**
     * Gets an entry by its ID.
     */
    getEntry({ entryId }: GetEntryParams): Promise<EntryData>;
    /**
     * Checks if an address has entered the raffle.
     */
    isEntered({ address }: IsEnteredParams): Promise<boolean>;
    /**
     * Gets the entry ID for an address.
     */
    getEntryByAddress({ address }: GetEntryByAddressParams): Promise<bigint>;
    /**
     * Gets the ticket count for an entry from the weights boxmap.
     * @param entryId - The entry ID to look up
     * @returns The ticket count for the entry
     */
    getTicketCount({ entryId }: GetEntryWithTicketsParams): Promise<bigint>;
    /**
     * Gets an entry with its ticket count combined.
     * This is a convenience method that fetches both entry data and the ticket count
     * from the weights boxmap in a single call.
     */
    getEntryWithTickets({ entryId }: GetEntryWithTicketsParams): Promise<EntryWithTickets>;
    /**
     * Gets an entry with its ticket count by address.
     * This is a convenience method that looks up the entry ID by address,
     * then fetches both entry data and the ticket count.
     */
    getEntryWithTicketsByAddress({ address }: GetEntryWithTicketsByAddressParams): Promise<EntryWithTickets>;
    /**
     * Gets all entries with their ticket counts.
     * This fetches all entries and their corresponding ticket counts from the weights boxmap.
     * Note: For large raffles, this may require multiple reads.
     */
    getAllEntriesWithTickets(): Promise<EntryWithTickets[]>;
    /**
     * Enters the raffle with tickets.
     * Use `isAsa: true` and `ticketAsset` for ASA tickets, otherwise ALGO is used.
     */
    enter({ sender, signer, amount, marketplace, isAsa, proofs, ...rest }: EnterParams): Promise<void>;
    /**
     * Adds more tickets to an existing entry.
     * Use `isAsa: true` and `ticketAsset` for ASA tickets, otherwise ALGO is used.
     */
    add({ sender, signer, amount, isAsa, proofs, ...rest }: AddParams): Promise<void>;
    /**
     * Triggers the raffle to draw the winning ticket number.
     * Can only be called after the raffle has ended.
     */
    raffle(params?: MaybeSigner): Promise<void>;
    /**
     * Iterates to find the winner based on the winning ticket.
     * May need to be called multiple times for large raffles.
     */
    findWinner({ sender, signer, iterationAmount }: FindWinnerParams): Promise<void>;
    /**
     * Claims the raffle prize for the winner.
     * Also distributes royalties to marketplace, creator, and Akita.
     */
    claimPrize(params?: MaybeSigner): Promise<void>;
    /**
     * Refunds MBR to raffle participants after the winner is found.
     * May need to be called multiple times for large raffles.
     */
    refundMBR({ sender, signer, iterationAmount }: RefundMBRParams): Promise<void>;
    /**
     * Clears the weights boxes after the prize has been claimed.
     * Returns the MBR for the weights boxes to the factory.
     */
    clearWeightsBoxes(params?: MaybeSigner): Promise<bigint>;
}
