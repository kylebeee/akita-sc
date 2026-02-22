import { BaseSDK } from "../base";
import { HyperSwapClient, HyperSwapArgs } from '../generated/HyperSwapClient';
import { NewContractSDKParams } from "../types";
import { OfferParams, AcceptParams, EscrowParams, DisburseParams, CancelParams, WithdrawParams, OptInParams, GetOfferParams, OfferValue, HyperSwapMbrData } from "./types";
export * from "./types";
export type HyperSwapContractArgs = HyperSwapArgs["obj"];
/**
 * SDK for interacting with the HyperSwap contract.
 * HyperSwap enables atomic multi-party trades using merkle tree proofs.
 */
export declare class HyperSwapSDK extends BaseSDK<HyperSwapClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Gets the MBR data for HyperSwap operations.
     */
    mbr(): Promise<HyperSwapMbrData>;
    /**
     * Gets an offer by its ID.
     */
    getOffer({ id }: GetOfferParams): Promise<OfferValue>;
    /**
     * Opts the HyperSwap contract into an asset.
     */
    optIn({ sender, signer, asset }: OptInParams): Promise<void>;
    /**
     * Creates a new offer for an atomic multi-party trade.
     */
    offer({ sender, signer, root, leaves, participantsRoot, participantsLeaves, expiration, }: OfferParams): Promise<void>;
    /**
     * Accepts an offer as a participant.
     */
    accept({ sender, signer, id, proof }: AcceptParams): Promise<void>;
    /**
     * Escrows assets for a trade leaf.
     * Use `isAsa: true` and `asset` for ASA escrows, otherwise ALGO is used.
     */
    escrow({ sender, signer, id, receiver, amount, proof, isAsa, ...rest }: EscrowParams): Promise<void>;
    /**
     * Disburses assets for a trade leaf.
     * @param receiverWallet - The receiver's ARC58 wallet app ID (0 if not an ARC58 wallet)
     */
    disburse({ sender, signer, id, receiverWallet, receiver, asset, amount }: DisburseParams): Promise<void>;
    /**
     * Cancels an offer.
     */
    cancel({ sender, signer, id, proof }: CancelParams): Promise<void>;
    /**
     * Withdraws escrowed assets from a cancelled offer.
     */
    withdraw({ sender, signer, id, receiver, asset, amount, proof }: WithdrawParams): Promise<void>;
}
