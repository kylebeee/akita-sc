import { BaseSDK } from "../base";
import { PrizeBoxClient } from '../generated/PrizeBoxClient';
import { PrizeBoxFactoryClient, PrizeBoxFactoryArgs } from '../generated/PrizeBoxFactoryClient';
import { MaybeSigner, NewContractSDKParams } from "../types";
import { MintParams, OptInParams, TransferParams, WithdrawParams, PrizeBoxState } from "./types";
export * from "./types";
/**
 * SDK for interacting with an individual PrizeBox contract.
 * PrizeBoxes hold multiple assets that can be transferred as a bundle.
 */
export declare class PrizeBoxSDK extends BaseSDK<PrizeBoxClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Gets the current state of the prize box.
     */
    state(): Promise<PrizeBoxState>;
    /**
     * Gets the owner of the prize box.
     */
    owner(): Promise<string>;
    /**
     * Opts the prize box into an asset.
     * Can only be called by the owner.
     */
    optIn({ sender, signer, asset }: OptInParams): Promise<void>;
    /**
     * Transfers ownership of the prize box to a new owner.
     * Can only be called by the current owner.
     */
    transfer({ sender, signer, newOwner }: TransferParams): Promise<void>;
    /**
     * Withdraws assets from the prize box.
     * Can only be called by the owner.
     */
    withdraw({ sender, signer, assets }: WithdrawParams): Promise<void>;
    /**
     * Deletes the prize box and returns MBR to owner.
     * Can only be called when the box is empty (optinCount === 0).
     */
    delete(params?: MaybeSigner): Promise<void>;
}
export type PrizeBoxFactoryContractArgs = PrizeBoxFactoryArgs["obj"];
/**
 * SDK for interacting with the PrizeBox Factory contract.
 * Used to create new prize boxes.
 */
export declare class PrizeBoxFactorySDK extends BaseSDK<PrizeBoxFactoryClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Creates a new prize box and returns a PrizeBoxSDK instance.
     * @returns PrizeBoxSDK for the newly created prize box
     */
    mint({ sender, signer, owner }: MintParams): Promise<PrizeBoxSDK>;
    /**
     * Gets a PrizeBoxSDK instance for an existing prize box.
     * @param appId - The app ID of the prize box
     * @returns PrizeBoxSDK for the specified prize box
     */
    get({ appId }: {
        appId: bigint;
    }): PrizeBoxSDK;
    /**
     * Gets the cost to create a new prize box.
     * Based on: MIN_PROGRAM_PAGES + (GLOBAL_STATE_KEY_UINT_COST * globalUints) + (GLOBAL_STATE_KEY_BYTES_COST * globalBytes) + Global.minBalance
     */
    cost(): bigint;
}
/**
 * Convenience function to create a new prize box and return the SDK.
 */
export declare function newPrizeBox({ factoryParams, algorand, readerAccount, sendParams, ...mintParams }: NewContractSDKParams & MintParams): Promise<PrizeBoxSDK>;
