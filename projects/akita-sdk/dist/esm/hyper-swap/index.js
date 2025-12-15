import { microAlgo } from "@algorandfoundation/algokit-utils";
import { BaseSDK } from "../base";
import { ENV_VAR_NAMES } from "../config";
import { HyperSwapFactory, } from '../generated/HyperSwapClient';
export * from "./types";
/**
 * SDK for interacting with the HyperSwap contract.
 * HyperSwap enables atomic multi-party trades using merkle tree proofs.
 */
export class HyperSwapSDK extends BaseSDK {
    constructor(params) {
        super({ factory: HyperSwapFactory, ...params }, ENV_VAR_NAMES.HYPER_SWAP_APP_ID);
    }
    // ========== Read Methods ==========
    /**
     * Gets the MBR data for HyperSwap operations.
     */
    async mbr() {
        const mbr = await this.client.mbr();
        return {
            offers: mbr.offers,
            participants: mbr.participants,
            hashes: mbr.hashes,
            mm: {
                root: mbr.mm.root,
                data: mbr.mm.data,
            },
        };
    }
    /**
     * Gets an offer by its ID.
     */
    async getOffer({ id }) {
        const offer = await this.client.state.box.offers.value(id);
        if (offer === undefined) {
            throw new Error(`Offer ${id} not found`);
        }
        return {
            state: Number(offer.state),
            root: offer.root,
            leaves: offer.leaves,
            escrowed: offer.escrowed,
            participantsRoot: offer.participantsRoot,
            participantsLeaves: offer.participantsLeaves,
            acceptances: offer.acceptances,
            expiration: offer.expiration,
        };
    }
    // ========== Write Methods ==========
    /**
     * Opts the HyperSwap contract into an asset.
     */
    async optIn({ sender, signer, asset }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: microAlgo(100000), // Asset opt-in MBR
            receiver: this.client.appAddress,
        });
        await this.client.send.optIn({
            ...sendParams,
            args: {
                payment,
                asset,
            },
        });
    }
    /**
     * Creates a new offer for an atomic multi-party trade.
     */
    async offer({ sender, signer, root, leaves, participantsRoot, participantsLeaves, expiration, }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const mbrData = await this.mbr();
        const metaMerklesCost = mbrData.mm.root + mbrData.mm.data;
        const totalMbr = mbrData.offers + mbrData.participants + (metaMerklesCost * 2n);
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: microAlgo(totalMbr),
            receiver: this.client.appAddress,
        });
        await this.client.send.offer({
            ...sendParams,
            args: {
                payment,
                root,
                leaves,
                participantsRoot,
                participantsLeaves,
                expiration,
            },
        });
    }
    /**
     * Accepts an offer as a participant.
     */
    async accept({ sender, signer, id, proof }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const mbrData = await this.mbr();
        const mbrPayment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: microAlgo(mbrData.participants),
            receiver: this.client.appAddress,
        });
        await this.client.send.accept({
            ...sendParams,
            args: {
                mbrPayment,
                id,
                proof,
            },
        });
    }
    /**
     * Escrows assets for a trade leaf.
     * Use `isAsa: true` and `asset` for ASA escrows, otherwise ALGO is used.
     */
    async escrow({ sender, signer, id, receiver, amount, proof, isAsa = false, ...rest }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const mbrData = await this.mbr();
        if (isAsa) {
            const { asset } = rest;
            // MBR includes potential arc59 costs if receiver not opted in
            const mbrPayment = await this.client.algorand.createTransaction.payment({
                ...sendParams,
                amount: microAlgo(mbrData.hashes + 200000n), // Extra for potential arc59
                receiver: this.client.appAddress,
            });
            const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
                ...sendParams,
                amount: BigInt(amount),
                assetId: BigInt(asset),
                receiver: this.client.appAddress,
            });
            await this.client.send.escrowAsa({
                ...sendParams,
                args: {
                    mbrPayment,
                    assetXfer,
                    id,
                    receiver,
                    asset,
                    amount,
                    proof,
                },
            });
        }
        else {
            const payment = await this.client.algorand.createTransaction.payment({
                ...sendParams,
                amount: microAlgo(BigInt(amount) + mbrData.hashes),
                receiver: this.client.appAddress,
            });
            await this.client.send.escrow({
                ...sendParams,
                args: {
                    payment,
                    id,
                    receiver,
                    amount,
                    proof,
                },
            });
        }
    }
    /**
     * Disburses assets for a trade leaf.
     * @param receiverWallet - The receiver's ARC58 wallet app ID (0 if not an ARC58 wallet)
     */
    async disburse({ sender, signer, id, receiverWallet, receiver, asset, amount }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.disburse({
            ...sendParams,
            args: {
                id,
                receiverWallet,
                receiver,
                asset,
                amount,
            },
        });
    }
    /**
     * Cancels an offer.
     */
    async cancel({ sender, signer, id, proof }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.cancel({
            ...sendParams,
            args: {
                id,
                proof,
            },
        });
    }
    /**
     * Withdraws escrowed assets from a cancelled offer.
     */
    async withdraw({ sender, signer, id, receiver, asset, amount, proof }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.withdraw({
            ...sendParams,
            args: {
                id,
                receiver,
                asset,
                amount,
                proof,
            },
        });
    }
}
//# sourceMappingURL=index.js.map