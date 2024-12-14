import { Contract } from '@algorandfoundation/tealscript';
import { MAX_ROOT_BOX_MBR, MAX_SCHEMA_BOX_MBR, MAX_TYPE_BOX_MBR, MetaMerkles } from '../../metaMerkles/meta_merkles.algo';
import { AbstractedAccount } from '../abstracted_account.algo';
import { OptInPlugin } from './optin.algo';
import { arc59GetSendAssetInfoResponse, AssetInbox } from '../../../utils/types/asset_inbox';
import { AkitaAppIDsMetaMerkles, AkitaAppIDsOptinPlugin, bytes0, OtherAppIDsAssetInbox } from '../../../utils/constants';

const errs = {
    OFFER_NAME_TOO_LONG: 'offers name is longer than 12 characters',
    BAD_ROOTS: 'root and participantsRoot cannot be the same'
}

const META_MERKLE_ADDRESS_SCHEMA = 1;
const META_MERKLE_TRADE_SCHEMA = 4;
const META_MERKLE_TRADE_TYPE = 3;

const STATE_OFFERED = 0; // an offer has been made and is pending acceptance by the other parties
const STATE_ESCROWING = 1; // the offer is accepted by both parties and the contract is collecting the assets
const STATE_DISBURSING = 2; // the contract has collected all assets from both parties and is dispersing the assets to the other parties
const STATE_COMPLETED = 3; // the trade has completed and the contract can be deleted
const STATE_CANCELLED = 4; // the trade was cancelled
const STATE_CANCEL_COMPLETED = 5; // the trade was cancelled and any necessary withdraws completed

export type OfferValue = {
    state: uint64;
    root: bytes32;
    leaves: uint64;
    escrowed: uint64;
    participantRoot: bytes32;
    participantLeaves: uint64;
    acceptances: uint64;
    expiration: uint64;
}

export type ParticipantKey = {
    id: uint64;
    address: Address;
}

export type EscrowKey = {
    id: uint64;
    sender: Address;
    asset: uint64;
}

export type HashKey = {
    id: uint64;
    hash: bytes32;
}

export class HyperAtomicSwapPlugin extends Contract {

    /** 
     * Global counter for offers
     */
    counter = GlobalStateKey<uint64>({ key: 'counter' })

    /**
     * BoxMap of offers
     * 
     * key: index id of offers
     * key_length: 8
     * 
     * value: Offer details
     * value_length: 112
     * 
     * cost: 2_500 + (400 * (8 + 112)) = 50_500
     */
    offers = BoxMap<uint64, OfferValue>();

    /**
     * BoxMap of participants
     * 
     * key: id of the offer + address of the participant
     * key_length: 40
     * 
     * value: 0
     * value_length: 0
     * 
     * cost: 2_500 + (400 * 40) = 18_500
     */
    participants = BoxMap<ParticipantKey, bytes0>();

    /**
     * BoxMap of hashes
     * 
     * key: id of the offer + hash of the leaf
     * key_length: 1 + 8 + 32 = 41
     * 
     * value: amount of mbr needed
     * value_length: 8
     * 
     * cost: 2_500 + (400 * (41 + 8)) = 22_100
     */
    hashes = BoxMap<HashKey, uint64>({ prefix: 'h' });

    private controls(address: Address): boolean {
        return address.authAddr === this.app.address;
    }

    private rekeyBack(address: Address) {
        sendPayment({
            sender: address,
            amount: 0,
            receiver: address,
            rekeyTo: address,
            fee: 0,
        });
    }

    private canCallArc58OptIn(walletAppID: AppID): boolean {
        return sendMethodCall<typeof AbstractedAccount.prototype.arc58_canCall, boolean>({
            applicationID: walletAppID,
            methodArgs: [
                AppID.fromUint64(AkitaAppIDsOptinPlugin),
                this.app.address,
            ],
            fee: 0,
        });
    }

    private arc58OptInAndSend(recipientAppID: AppID, asset: AssetID, amount: uint64): void {
        this.pendingGroup.addMethodCall<typeof AbstractedAccount.prototype.arc58_rekeyToPlugin, void>({
            applicationID: recipientAppID,
            methodArgs: [
                AppID.fromUint64(AkitaAppIDsOptinPlugin),
            ],
            fee: 0,
        });

        this.pendingGroup.addMethodCall<typeof OptInPlugin.prototype.optInToAsset, void>({
            applicationID: AppID.fromUint64(AkitaAppIDsOptinPlugin),
            methodArgs: [
                recipientAppID,
                true,
                asset,
                {
                    receiver: recipientAppID.address,
                    amount: globals.assetOptInMinBalance,
                    fee: 0,
                }
            ],
            fee: 0,
        });

        this.pendingGroup.addMethodCall<typeof AbstractedAccount.prototype.arc58_verifyAuthAddr, void>({
            applicationID: recipientAppID,
            fee: 0,
        });

        this.pendingGroup.addAssetTransfer({
            assetReceiver: recipientAppID.address,
            assetAmount: amount,
            xferAsset: asset,
            fee: 0,
        });

        this.pendingGroup.submit();
    }

    private arc59OptInAndSend(recipientAppID: AppID, asset: AssetID, amount: uint64): void {
        const canCallData = sendMethodCall<typeof AssetInbox.prototype.arc59_getSendAssetInfo, arc59GetSendAssetInfoResponse>({
            applicationID: AppID.fromUint64(OtherAppIDsAssetInbox),
            methodArgs: [
                recipientAppID.address,
                asset.id,
            ],
            fee: 0,
        });

        const mbr = canCallData.mbr;
        const routerOptedIn = canCallData.routerOptedIn;
        const receiverAlgoNeededForClaim = canCallData.receiverAlgoNeededForClaim;

        if (mbr || receiverAlgoNeededForClaim) {
            this.pendingGroup.addPayment({
                receiver: AppID.fromUint64(OtherAppIDsAssetInbox).address,
                amount: (mbr + receiverAlgoNeededForClaim),
                fee: 0,
            });
        }

        if (!routerOptedIn) {
            this.pendingGroup.addMethodCall<typeof AssetInbox.prototype.arc59_optRouterIn, void>({
                applicationID: AppID.fromUint64(OtherAppIDsAssetInbox),
                methodArgs: [asset.id],
                fee: 0
            });
        }

        this.pendingGroup.addMethodCall<typeof AssetInbox.prototype.arc59_sendAsset, Address>({
            applicationID: AppID.fromUint64(OtherAppIDsAssetInbox),
            methodArgs: [
                {
                    assetReceiver: AppID.fromUint64(OtherAppIDsAssetInbox).address,
                    assetAmount: amount,
                    xferAsset: asset,
                    fee: 0,
                },
                recipientAppID.address,
                receiverAlgoNeededForClaim,
            ],
            fee: 0
        });

        this.pendingGroup.submit();
    }

    /**
     * Creates a merkle tree based atomic payment/xfer group
     * 
     * @param sender the account creating the offering
     * @param root the merkle tree root of trades consisting of from address, recipient address, asset id & amount
     * @param leaves the number of leaves in the tree
     * @param participantsRoot the merkle tree root of participating addresses
     * @param participantLeaves the number of leaves in the participant tree
     * @param expiration the unix timestamp that the offer auto-expires at if it has not been accepted by all participants
     * @param marketplace the address of the marketplace to pay the fee to
     * @param marketFee the fee to pay the marketplace for facilitating the offer
     */
    offer(
        sender: Address,
        root: bytes32,
        leaves: uint64,
        participantsRoot: bytes32,
        participantLeaves: uint64,
        expiration: uint64,
        marketplace: Address,
        marketFee: uint64,
    ) {
        assert(root !== participantsRoot, errs.BAD_ROOTS);

        // let the marketplace that facilitated this offer take a fee
        this.pendingGroup.addPayment({
            sender: sender,
            receiver: marketplace,
            amount: marketFee,
            fee: 0,
        });

        // add the root to the meta merkle contract
        this.pendingGroup.addMethodCall<typeof MetaMerkles.prototype.addRoot, boolean>({
            applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
            methodArgs: [
                {
                    amount: (MAX_ROOT_BOX_MBR + MAX_SCHEMA_BOX_MBR + MAX_TYPE_BOX_MBR),
                    receiver: AppID.fromUint64(AkitaAppIDsMetaMerkles).address,
                    fee: 0,
                },
                root,
                root,
                META_MERKLE_TRADE_SCHEMA,
                META_MERKLE_TRADE_TYPE
            ],
            fee: 0,
        });

        // add the participants root to the meta merkle contract
        this.pendingGroup.addMethodCall<typeof MetaMerkles.prototype.addRoot, boolean>({
            applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
            methodArgs: [
                {
                    amount: (MAX_ROOT_BOX_MBR + MAX_SCHEMA_BOX_MBR + MAX_TYPE_BOX_MBR),
                    receiver: AppID.fromUint64(AkitaAppIDsMetaMerkles).address,
                    fee: 0,
                },
                participantsRoot,
                participantsRoot,
                META_MERKLE_ADDRESS_SCHEMA,
                META_MERKLE_TRADE_TYPE
            ],
            fee: 0,
        });

        // submit the txns
        this.pendingGroup.submit();

        // automatically set our sender as the first accepted participant
        this.participants({ id: this.counter.value, address: sender }).create(0);

        // create the offering box & default state
        this.offers(this.counter.value).value = {
            state: STATE_OFFERED,
            root: root,
            leaves: leaves,
            escrowed: 0,
            participantRoot: participantsRoot,
            participantLeaves: participantLeaves,
            acceptances: 1,
            expiration: expiration
        };

        // increment the global offer counter
        this.counter.value += 1;
    }

    /**
     * Accepts an offer
     * 
     * @param sender the account accepting the offering
     * @param id the id of the offer being accepted
     * @param proof the bytes32 array proof of inclusion in the participants list
     */
    accept(sender: AppID, id: uint64, proof: bytes32[]) {
        // ensure this contract currently controls the sender
        assert(this.controls(sender.address));
        // ensure the offer exists
        assert(this.offers(id).exists);
        const offer = this.offers(id).value;
        // ensure we are still in the collecting acceptances stage
        assert(offer.state === STATE_OFFERED);
        // ensure they are a participant
        assert(
            sendMethodCall<typeof MetaMerkles.prototype.verify, boolean>({
                applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
                methodArgs: [
                    this.app.address,
                    offer.participantRoot,
                    sha256(sha256(sender.address)),
                    proof,
                    META_MERKLE_TRADE_TYPE
                ],
                fee: 0,
            })
        );
        // ensure they haven't already accepted
        assert(!this.participants({ id: id, address: sender.address }).exists);
        // increment the acceptance count
        this.offers(id).value.acceptances += 1;
        // flag this participant as accepted
        this.participants({ id: id, address: sender.address }).create(0);
        // if we collected all needed acceptances switch to the gathering state
        if (offer.participantLeaves === (offer.acceptances + 1)) {
            this.offers(id).value.state = STATE_ESCROWING;
        }
    }

    /**
     * Escrows the assets in the trade for a given leaf in the tree
     * 
     * @param sender the sender in the offer leaf
     * @param id the id of the offer
     * @param receiver the recipient in the offer leaf
     * @param asset the asset in the offer leaf
     * @param amount the amount in the offer leaf
     * @param proof the proof to verify the details are part of the tree
     */
    escrow(
        sender: AppID,
        id: uint64,
        receiver: Address,
        asset: AssetID,
        amount: uint64,
        proof: bytes32[]
    ) {
        // ensure this contract currently controls the sender
        assert(this.controls(sender.address));
        // ensure the offer exists
        assert(this.offers(id).exists);
        const offer = this.offers(id).value;
        // ensure we are still in the collecting acceptances stage
        assert(offer.state === STATE_ESCROWING);
        // ensure they are a participant
        assert(this.participants({ id: id, address: sender.address }).exists);
        // ensure this leaf has not already been escrowed
        const hash = sha256(sha256(concat(sender.address, concat(receiver, itob(asset) + itob(amount)))));
        assert(!this.hashes({ id: id, hash: hash }).exists);
        // verify the leaf
        assert(
            sendMethodCall<typeof MetaMerkles.prototype.verify, boolean>({
                applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
                methodArgs: [
                    this.app.address,
                    offer.root,
                    hash,
                    proof,
                    META_MERKLE_TRADE_TYPE
                ],
                fee: 0,
            })
        );

        // track the mbr the app / receiver need
        let mbrAmount = 0;
        // pull the assets into escrow
        if (asset.id === 0) {
            sendPayment({
                sender: sender.address,
                amount: amount,
                receiver: this.app.address,
                fee: 0,
            })
        } else {
            // take the worst case possible amount incase we fallback to arc59
            if (!receiver.isOptedInToAsset(asset)) {
                mbrAmount += globals.minBalance + globals.assetOptInMinBalance + globals.minTxnFee
            }
            // opt the hyper swap plugin into the asset if its not already
            if (!this.app.address.isOptedInToAsset(asset)) {
                this.pendingGroup.addAssetTransfer({
                    xferAsset: asset,
                    assetAmount: 0,
                    assetReceiver: this.app.address,
                    fee: 0,
                });
                mbrAmount += globals.assetOptInMinBalance;
            }
            // pull the necessary mbr from the sender
            this.pendingGroup.addPayment({
                sender: sender.address,
                amount: mbrAmount,
                receiver: this.app.address,
                fee: 0,
            });
            // transfer the asset to the hyper swap plugin
            this.pendingGroup.addAssetTransfer({
                sender: sender.address,
                xferAsset: asset,
                assetAmount: amount,
                assetReceiver: this.app.address,
                fee: 0,
            });
            // opt the user out of the asset if the after-balance is zero
            const leftOver = sender.address.assetBalance(asset) - amount;
            if (leftOver === 0) {
                this.pendingGroup.addAssetTransfer({
                    sender: sender.address,
                    xferAsset: asset,
                    assetAmount: 0,
                    assetReceiver: asset.creator,
                    assetCloseTo: asset.creator,
                    fee: 0,
                });
            }

            this.pendingGroup.submit();
        }

        // add the leaf to the our escrowed list
        this.hashes({ id: id, hash: hash }).value = mbrAmount;
        // increment our escrow count
        this.offers(id).value.escrowed += 1;
        // if we collected all needed assets switch to the disbursement state
        if (offer.leaves === (offer.escrowed + 1)) {
            this.offers(id).value.state = STATE_DISBURSING;
        }
    }

    /**
     * Disburses assets for a leaf in the tree, ensuring ordered processing
     * 
     * @param sender the sender abstracted account app id in the leaf
     * @param id the id of the offer
     * @param receiver the recipient abstracted account app id for the address in the leaf
     * @param asset the asset being transferred
     * @param amount the amount being transferred
     */
    disburse(
        sender: AppID,
        id: uint64,
        receiver: AppID,
        asset: AssetID,
        amount: uint64,
    ) {
        // ensure the offer exists
        assert(this.offers(id).exists);
        const offer = this.offers(id).value;
        // ensure we are still in the collecting acceptances stage
        assert(offer.state === STATE_DISBURSING);

        // ensure this leaf is escrowed
        const hash = sha256(sha256(concat(sender.address, concat(receiver.address, itob(asset) + itob(amount)))));
        assert(this.hashes({ id: id, hash: hash }).exists);

        // process the transfer
        if (asset.id === 0) {
            sendPayment({
                amount: amount,
                receiver: receiver.address,
                fee: 0,
            });
        } else {
            if (!receiver.address.isOptedInToAsset(asset)) {
                const canCallArc58OptIn = this.canCallArc58OptIn(receiver);
                if (canCallArc58OptIn) {
                    // calls 6 transactions
                    this.arc58OptInAndSend(receiver, asset, amount);
                } else {
                    // calls up to 6 transactions
                    this.arc59OptInAndSend(receiver, asset, amount);
                }
            } else {
                this.pendingGroup.addAssetTransfer({
                    xferAsset: asset,
                    assetAmount: amount,
                    assetReceiver: receiver.address,
                    fee: 0,
                });

                let refundAmount = this.hashes({ id: id, hash: hash }).value;
                if ((this.app.address.assetBalance(asset) - amount) === 0) {
                    this.pendingGroup.addAssetTransfer({
                        xferAsset: asset,
                        assetAmount: 0,
                        assetReceiver: asset.creator,
                        assetCloseTo: asset.creator,
                        fee: 0,
                    });
                } else {
                    refundAmount -= globals.assetOptInMinBalance;
                }

                this.pendingGroup.addPayment({
                    amount: refundAmount,
                    receiver: sender.address,
                    fee: 0,
                })
            }
        }

        this.hashes({ id: id, hash: hash }).delete();
        this.offers(id).value.escrowed -= 1;

        // if we collected all needed assets switch to the disbursement state
        if ((offer.escrowed - 1) === 0) {
            this.offers(id).value.state = STATE_COMPLETED;
        }
    }

    /**
     * 
     * @param sender the abstracted account of the user cancelling the swap
     * @param id the id of the offer being cancelled
     * @param proof a proof of inclusion in the participants list
     */
    cancel(sender: AppID, id: uint64, proof: bytes32[]) {
        assert(this.controls(sender.address));
        // ensure the offer exists
        assert(this.offers(id).exists);
        const offer = this.offers(id).value;
        // ensure we're in a cancellable state
        assert(offer.state === STATE_OFFERED || offer.state === STATE_ESCROWING);
        // ensure they are a participant
        assert(
            sendMethodCall<typeof MetaMerkles.prototype.verify, boolean>({
                applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
                methodArgs: [
                    this.app.address,
                    offer.participantRoot,
                    sha256(sha256(sender.address)),
                    proof,
                    META_MERKLE_TRADE_TYPE
                ],
                fee: 0,
            })
        );
        // set the state to cancelled
        this.offers(id).value.state = STATE_CANCELLED;
    }

    /**
     * Withdraws your assets from a cancelled swap if they're escrowed
     * 
     * @param sender the abstracted account of the user reclaiming their assets
     * @param id the id of the cancelled offer
     * @param receiver the receiver of the leaf's swap
     * @param asset the asset of the leaf's swap
     * @param amount the amount of the leaf's swap
     * @param proof the proof that the leaf is in the tree
     * @param rekeyBack whether the abstracted account should be rekeyed back at the end
     */
    withdraw(
        sender: AppID,
        id: uint64,
        receiver: Address,
        asset: AssetID,
        amount: uint64,
        proof: bytes32[],
        rekeyBack: boolean,
    ) {
        // ensure this contract currently controls the sender
        assert(this.controls(sender.address));
        // ensure the offer exists
        assert(this.offers(id).exists);
        const offer = this.offers(id).value;
        // ensure the offer is cancelled
        assert(offer.state === STATE_CANCELLED);
        // ensure the escrow count isn't zero
        assert(offer.escrowed > 0);
        // ensure this leaf is still escrowed
        const hash = sha256(sha256(concat(sender.address, concat(receiver, itob(asset) + itob(amount)))));
        assert(this.hashes({ id: id, hash: hash }).exists);
        // verify the leaf
        assert(
            sendMethodCall<typeof MetaMerkles.prototype.verify, boolean>({
                applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
                methodArgs: [
                    this.app.address,
                    offer.root,
                    hash,
                    proof,
                    META_MERKLE_TRADE_TYPE
                ],
                fee: 0,
            })
        );

        if (asset.id === 0) {
            sendPayment({
                amount: amount,
                receiver: sender.address,
                fee: 0,
            })

            if (rekeyBack) {
                this.rekeyBack(sender.address);
            }
        } else {
            // opt the user back into their asset if necessary
            if (!sender.address.isOptedInToAsset(asset) && rekeyBack) {
                this.pendingGroup.addAssetTransfer({
                    sender: sender.address,
                    xferAsset: asset,
                    assetAmount: 0,
                    assetReceiver: sender.address,
                    rekeyTo: sender.address,
                    fee: 0,
                });
            } else if (!sender.address.isOptedInToAsset(asset)) {
                this.pendingGroup.addAssetTransfer({
                    sender: sender.address,
                    xferAsset: asset,
                    assetAmount: 0,
                    assetReceiver: sender.address,
                    fee: 0,
                });
            }
            // send the user their asset back
            this.pendingGroup.addAssetTransfer({
                xferAsset: asset,
                assetAmount: amount,
                assetReceiver: sender.address,
                fee: 0,
            });

            this.pendingGroup.submit();
        }

        // add the leaf to the our escrowed list
        this.hashes({ id: id, hash: hash }).delete();
        // increment our escrow count
        this.offers(id).value.escrowed -= 1;
        // mark the cancelled offer as done if theres no more escrowed assets
        if ((offer.escrowed - 1) === 0) {
            this.offers(id).value.state = STATE_CANCEL_COMPLETED;
        }
    }
}