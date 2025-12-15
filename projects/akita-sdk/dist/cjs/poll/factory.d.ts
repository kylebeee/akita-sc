import { BaseSDK } from "../base";
import { PollFactoryClient, PollFactoryArgs } from '../generated/PollFactoryClient';
import { MaybeSigner, NewContractSDKParams } from "../types";
import { PollSDK } from "./index";
import { NewPollParams } from "./types";
export type PollFactoryContractArgs = PollFactoryArgs["obj"];
/**
 * SDK for interacting with the Poll Factory contract.
 * Used to create new polls.
 */
export declare class PollFactorySDK extends BaseSDK<PollFactoryClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Creates a new poll and returns a PollSDK instance.
     * @returns PollSDK for the newly created poll
     */
    new({ sender, signer, type, endTime, maxSelected, question, options, gateId, }: NewPollParams): Promise<PollSDK>;
    /**
     * Gets a PollSDK instance for an existing poll.
     * @param appId - The app ID of the poll
     * @returns PollSDK for the specified poll
     */
    get({ appId }: {
        appId: bigint;
    }): PollSDK;
    /**
     * Gets the cost to create a new poll.
     */
    cost(): Promise<bigint>;
    /**
     * Updates the Akita DAO reference.
     */
    updateAkitaDAO({ sender, signer, akitaDao }: MaybeSigner & PollFactoryContractArgs['updateAkitaDAO(uint64)void']): Promise<void>;
    /**
     * Updates the Akita DAO Escrow reference.
     */
    updateAkitaDAOEscrow({ sender, signer, app }: MaybeSigner & PollFactoryContractArgs['updateAkitaDAOEscrow(uint64)void']): Promise<void>;
}
/**
 * Convenience function to create a new poll and return the SDK.
 * Creates a factory SDK, creates the poll, and returns the poll SDK.
 */
export declare function newPoll({ factoryParams, algorand, readerAccount, sendParams, ...pollParams }: NewContractSDKParams & NewPollParams): Promise<PollSDK>;
