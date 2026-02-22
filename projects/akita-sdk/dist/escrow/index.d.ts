import { BaseSDK } from "../base";
import { EscrowClient } from '../generated/EscrowClient';
import { EscrowFactoryClient } from '../generated/EscrowFactoryClient';
import { NewContractSDKParams } from "../types";
import { NewEscrowParams, RegisterParams, DeleteEscrowParams, ExistsParams, GetParams, GetListParams, RekeyParams } from "./types";
export * from "./types";
/**
 * SDK for interacting with an individual Escrow contract.
 * Escrows are minimal contracts that hold funds and can be rekeyed.
 */
export declare class EscrowSDK extends BaseSDK<EscrowClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Gets the creator of the escrow.
     */
    getCreator(): Promise<string>;
    /**
     * Rekeys the escrow to a new account.
     * Can only be called by the factory (creator).
     */
    rekey({ sender, signer, rekeyTo }: RekeyParams): Promise<void>;
}
/**
 * SDK for interacting with the Escrow Factory contract.
 * Used to create, register, and delete escrows.
 */
export declare class EscrowFactorySDK extends BaseSDK<EscrowFactoryClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Creates a new escrow and returns an EscrowSDK instance.
     * @returns EscrowSDK for the newly created escrow
     */
    new(params?: NewEscrowParams): Promise<EscrowSDK>;
    /**
     * Gets an EscrowSDK instance for an existing escrow.
     * @param appId - The app ID of the escrow
     * @returns EscrowSDK for the specified escrow
     */
    get({ appId }: {
        appId: bigint;
    }): EscrowSDK;
    /**
     * Registers an escrow (or self) to enable lookup by address.
     */
    register({ sender, signer, app }: RegisterParams): Promise<void>;
    /**
     * Deletes an escrow and refunds MBR.
     */
    delete({ sender, signer, id }: DeleteEscrowParams): Promise<void>;
    /**
     * Gets the cost to create a new escrow.
     */
    cost(): Promise<bigint>;
    /**
     * Gets the cost to register an escrow.
     */
    registerCost(): Promise<bigint>;
    /**
     * Checks if an escrow exists for an address.
     */
    exists({ address }: ExistsParams): Promise<boolean>;
    /**
     * Gets the creator bytes for an address.
     * Returns empty bytes if not found.
     */
    getCreator({ address }: GetParams): Promise<Uint8Array>;
    /**
     * Gets creator bytes for multiple addresses.
     */
    getList({ addresses }: GetListParams): Promise<Uint8Array[]>;
}
/**
 * Convenience function to create a new escrow and return the SDK.
 */
export declare function newEscrow({ factoryParams, algorand, readerAccount, sendParams, ...escrowParams }: NewContractSDKParams & NewEscrowParams): Promise<EscrowSDK>;
