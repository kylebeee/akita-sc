import { Contract } from '@algorandfoundation/tealscript'
import { MAX_ROOT_BOX_MBR, MAX_SCHEMA_BOX_MBR, MAX_TYPE_BOX_MBR, MetaMerkles } from '../meta_merkles/meta_merkles.algo'
import { arc59GetSendAssetInfoResponse, AssetInbox } from '../../utils/types/asset_inbox'
import { AkitaAppIDsDAO, AkitaAppIDsMetaMerkles, OtherAppIDsAssetInbox } from '../../utils/constants'

const errs = {
    OFFER_NAME_TOO_LONG: 'offers name is longer than 12 characters',
    BAD_ROOTS: 'root and participantsRoot cannot be the same',
}

const META_MERKLE_ADDRESS_SCHEMA = 1
const META_MERKLE_TRADE_SCHEMA = 4
const META_MERKLE_TRADE_TYPE = 3

const STATE_OFFERED = 0 // an offer has been made and is pending acceptance by the other parties
const STATE_ESCROWING = 1 // the offer is accepted by both parties and the contract is collecting the assets
const STATE_DISBURSING = 2 // the contract has collected all assets from both parties and is dispersing the assets to the other parties
const STATE_COMPLETED = 3 // the trade has completed and the contract can be deleted
const STATE_CANCELLED = 4 // the trade was cancelled
const STATE_CANCEL_COMPLETED = 5 // the trade was cancelled and any necessary withdraws completed

const AKITA_DAO_HYPER_SWAP_OFFER_FEE_KEY = 'hyper_swap_offer_fee'

export const HYPER_SWAP_OFFER_MBR_AMOUNT =
    18_500 + 50_500 + (MAX_ROOT_BOX_MBR + MAX_SCHEMA_BOX_MBR + MAX_TYPE_BOX_MBR) * 2
export const HYPER_SWAP_PARTICIPANT_MBR_AMOUNT = 18_500
export const HYPER_SWAP_HASH_MBR_AMOUNT = 22_100

export type OfferValue = {
    state: uint64
    root: bytes32
    leaves: uint64
    escrowed: uint64
    participantRoot: bytes32
    participantLeaves: uint64
    acceptances: uint64
    expiration: uint64
}

export type ParticipantKey = {
    id: uint64
    address: Address
}

export type EscrowKey = {
    id: uint64
    sender: Address
    asset: uint64
}

export type HashKey = {
    id: uint64
    hash: bytes32
}

export class HyperSwap extends Contract {
    /** global counter for offers */
    _offerCursor = GlobalStateKey<uint64>({ key: 'offer_cursor' })

    /** the app id for the Akita DAO */
    daoAppID = GlobalStateKey<AppID>({ key: 'dao_app_id' })

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
    offers = BoxMap<uint64, OfferValue>()

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
    participants = BoxMap<ParticipantKey, bytes<0>>()

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
    hashes = BoxMap<HashKey, uint64>({ prefix: 'h' })

    private newOfferID(): uint64 {
        const id = this._offerCursor.value
        this._offerCursor.value += 1
        return id
    }

    private arc59OptInAndSend(recipient: Address, asset: AssetID, amount: uint64): void {
        const canCallData = sendMethodCall<
            typeof AssetInbox.prototype.arc59_getSendAssetInfo,
            arc59GetSendAssetInfoResponse
        >({
            applicationID: AppID.fromUint64(OtherAppIDsAssetInbox),
            methodArgs: [recipient, asset.id],
            fee: 0,
        })

        const mbr = canCallData.mbr
        const routerOptedIn = canCallData.routerOptedIn
        const receiverAlgoNeededForClaim = canCallData.receiverAlgoNeededForClaim

        if (mbr || receiverAlgoNeededForClaim) {
            this.pendingGroup.addPayment({
                receiver: AppID.fromUint64(OtherAppIDsAssetInbox).address,
                amount: mbr + receiverAlgoNeededForClaim,
                fee: 0,
                isFirstTxn: true,
            })
        }

        if (!routerOptedIn) {
            this.pendingGroup.addMethodCall<typeof AssetInbox.prototype.arc59_optRouterIn, void>({
                applicationID: AppID.fromUint64(OtherAppIDsAssetInbox),
                methodArgs: [asset.id],
                fee: 0,
                isFirstTxn: !(mbr || receiverAlgoNeededForClaim),
            })
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
                recipient,
                receiverAlgoNeededForClaim,
            ],
            fee: 0,
            isFirstTxn: routerOptedIn && !(mbr || receiverAlgoNeededForClaim),
        })

        this.pendingGroup.submit()
    }

    /**
     * Creates a merkle tree based atomic payment/xfer group
     *
     *
     * @param root the merkle tree root of trades consisting of from address, recipient address, asset id & amount
     * @param leaves the number of leaves in the tree
     * @param participantsRoot the merkle tree root of participating addresses
     * @param participantLeaves the number of leaves in the participant tree
     * @param expiration the unix timestamp that the offer auto-expires at if it has not been accepted by all participants
     * @param marketplace the address of the marketplace to pay the fee to
     * @param marketFee the fee to pay the marketplace for facilitating the offer
     */
    offer(
        mbrPayment: PayTxn,
        feePayment: PayTxn,
        root: bytes32,
        leaves: uint64,
        participantsRoot: bytes32,
        participantLeaves: uint64,
        expiration: uint64
    ) {
        assert(root !== participantsRoot, errs.BAD_ROOTS)

        verifyPayTxn(mbrPayment, {
            amount: HYPER_SWAP_OFFER_MBR_AMOUNT,
            receiver: this.app.address,
        })

        const akitaFee = AppID.fromUint64(AkitaAppIDsDAO).globalState(AKITA_DAO_HYPER_SWAP_OFFER_FEE_KEY) as uint64
        verifyPayTxn(feePayment, {
            amount: akitaFee,
            receiver: AppID.fromUint64(AkitaAppIDsDAO).address,
        })

        // sendPayment({
        //     sender: sender.address,
        //     amount: 18_500 + 50_500 + ((MAX_ROOT_BOX_MBR + MAX_SCHEMA_BOX_MBR + MAX_TYPE_BOX_MBR) * 2),
        //     receiver: this.app.address,
        //     fee: 0,
        // });

        // add the root to the meta merkle contract
        this.pendingGroup.addMethodCall<typeof MetaMerkles.prototype.addRoot, boolean>({
            applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
            methodArgs: [
                {
                    amount: MAX_ROOT_BOX_MBR + MAX_SCHEMA_BOX_MBR + MAX_TYPE_BOX_MBR,
                    receiver: AppID.fromUint64(AkitaAppIDsMetaMerkles).address,
                    fee: 0,
                },
                root,
                root,
                META_MERKLE_TRADE_SCHEMA,
                META_MERKLE_TRADE_TYPE,
            ],
            fee: 0,
            isFirstTxn: true,
        })

        // add the participants root to the meta merkle contract
        this.pendingGroup.addMethodCall<typeof MetaMerkles.prototype.addRoot, boolean>({
            applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
            methodArgs: [
                {
                    amount: MAX_ROOT_BOX_MBR + MAX_SCHEMA_BOX_MBR + MAX_TYPE_BOX_MBR,
                    receiver: AppID.fromUint64(AkitaAppIDsMetaMerkles).address,
                    fee: 0,
                },
                participantsRoot,
                participantsRoot,
                META_MERKLE_ADDRESS_SCHEMA,
                META_MERKLE_TRADE_TYPE,
            ],
            fee: 0,
        })

        const id = this.newOfferID()

        // automatically set our sender as the first accepted participant
        this.participants({ id: id, address: this.txn.sender }).create(0)

        // create the offering box & default state
        this.offers(id).value = {
            state: STATE_OFFERED,
            root: root,
            leaves: leaves,
            escrowed: 0,
            participantRoot: participantsRoot,
            participantLeaves: participantLeaves,
            acceptances: 1,
            expiration: expiration,
        }

        // submit the txns
        this.pendingGroup.submit()

        // if (rekeyBack) {
        //     this.rekeyBack(sender.address);
        // }
    }

    /**
     * Accepts an offer
     *
     *
     * @param id the id of the offer being accepted
     * @param proof the bytes32 array proof of inclusion in the participants list
     */
    accept(mbrPayment: PayTxn, id: uint64, proof: bytes32[]) {
        // ensure this contract currently controls the sender
        // assert(this.controls(sender.address));
        // ensure the offer exists
        assert(this.offers(id).exists)
        const offer = this.offers(id).value
        // ensure we are still in the collecting acceptances stage
        assert(offer.state === STATE_OFFERED)
        // ensure they are a participant
        assert(
            sendMethodCall<typeof MetaMerkles.prototype.verify, boolean>({
                applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
                methodArgs: [
                    this.app.address,
                    offer.participantRoot,
                    sha256(sha256(this.txn.sender)),
                    proof,
                    META_MERKLE_TRADE_TYPE,
                ],
                fee: 0,
            })
        )
        // ensure they haven't already accepted
        assert(!this.participants({ id: id, address: this.txn.sender }).exists)
        // increment the acceptance count
        this.offers(id).value.acceptances += 1

        verifyPayTxn(mbrPayment, {
            amount: HYPER_SWAP_PARTICIPANT_MBR_AMOUNT,
            receiver: this.app.address,
        })

        // sendPayment({
        //     sender: sender.address,
        //     amount: 18_500,
        //     receiver: this.app.address,
        //     fee: 0,
        // });

        // flag this participant as accepted
        this.participants({ id: id, address: this.txn.sender }).create(0)
        // if we collected all needed acceptances switch to the gathering state
        if (offer.participantLeaves === offer.acceptances + 1) {
            this.offers(id).value.state = STATE_ESCROWING
        }

        // if (rekeyBack) {
        //     this.rekeyBack(sender.address);
        // }
    }

    /**
     * Escrows the assets in the trade for a given leaf in the tree
     *
     *
     * @param id the id of the offer
     * @param receiver the recipient in the offer leaf
     * @param asset the asset in the offer leaf
     * @param amount the amount in the offer leaf
     * @param proof the proof to verify the details are part of the tree
     */
    escrow(payment: PayTxn, id: uint64, receiver: Address, amount: uint64, proof: bytes32[]) {
        // ensure this contract currently controls the sender
        // assert(this.controls(sender.address));
        // ensure the offer exists
        assert(this.offers(id).exists)
        const offer = this.offers(id).value
        // ensure we are still in the collecting acceptances stage
        assert(offer.state === STATE_ESCROWING)
        // ensure they are a participant
        assert(this.participants({ id: id, address: this.txn.sender }).exists)
        // ensure this leaf has not already been escrowed
        const hash = sha256(sha256(concat(this.txn.sender, concat(receiver, itob(0) + itob(amount)))))
        assert(!this.hashes({ id: id, hash: hash }).exists)
        // verify the leaf
        assert(
            sendMethodCall<typeof MetaMerkles.prototype.verify, boolean>({
                applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
                methodArgs: [this.app.address, offer.root, hash, proof, META_MERKLE_TRADE_TYPE],
                fee: 0,
            })
        )

        verifyPayTxn(payment, {
            amount: amount + HYPER_SWAP_HASH_MBR_AMOUNT,
            receiver: this.app.address,
        })

        // add the leaf to the our escrowed list
        this.hashes({ id: id, hash: hash }).value = 0
        // increment our escrow count
        this.offers(id).value.escrowed += 1
        // if we collected all needed assets switch to the disbursement state
        if (offer.leaves === offer.escrowed + 1) {
            this.offers(id).value.state = STATE_DISBURSING
        }
    }

    /**
     * Escrows the assets in the trade for a given leaf in the tree
     *
     *
     * @param id the id of the offer
     * @param receiver the recipient in the offer leaf
     * @param asset the asset in the offer leaf
     * @param amount the amount in the offer leaf
     * @param proof the proof to verify the details are part of the tree
     */
    escrowAsa(
        mbrPayment: PayTxn,
        assetXfer: AssetTransferTxn,
        id: uint64,
        receiver: Address,
        asset: AssetID,
        amount: uint64,
        proof: bytes32[]
    ) {
        // ensure this contract currently controls the sender
        // assert(this.controls(sender.address));
        // ensure the offer exists
        assert(this.offers(id).exists)
        const offer = this.offers(id).value
        // ensure we are still in the collecting acceptances stage
        assert(offer.state === STATE_ESCROWING)
        // ensure they are a participant
        assert(this.participants({ id: id, address: this.txn.sender }).exists)
        // ensure this leaf has not already been escrowed
        const hash = sha256(sha256(concat(this.txn.sender, concat(receiver, itob(asset) + itob(amount)))))
        assert(!this.hashes({ id: id, hash: hash }).exists)
        // verify the leaf
        assert(
            sendMethodCall<typeof MetaMerkles.prototype.verify, boolean>({
                applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
                methodArgs: [this.app.address, offer.root, hash, proof, META_MERKLE_TRADE_TYPE],
                fee: 0,
            })
        )

        // track the mbr the app / receiver need
        let mbrAmount = HYPER_SWAP_HASH_MBR_AMOUNT

        // take the worst case possible amount incase we fallback to arc59
        if (!receiver.isOptedInToAsset(asset)) {
            mbrAmount += globals.minBalance + globals.assetOptInMinBalance + globals.minTxnFee
        }
        // opt the hyper swap plugin into the asset if its not already
        if (!this.app.address.isOptedInToAsset(asset)) {
            sendAssetTransfer({
                xferAsset: asset,
                assetAmount: 0,
                assetReceiver: this.app.address,
                fee: 0,
            })
            mbrAmount += globals.assetOptInMinBalance
        }

        verifyPayTxn(mbrPayment, {
            amount: mbrAmount,
            receiver: this.app.address,
        })

        verifyAssetTransferTxn(assetXfer, {
            xferAsset: asset,
            assetAmount: amount,
            assetReceiver: this.app.address,
        })

        // add the leaf to the our escrowed list
        this.hashes({ id: id, hash: hash }).value = mbrAmount
        // increment our escrow count
        this.offers(id).value.escrowed += 1
        // if we collected all needed assets switch to the disbursement state
        if (offer.leaves === offer.escrowed + 1) {
            this.offers(id).value.state = STATE_DISBURSING
        }
    }

    /**
     * Disburses assets for a leaf in the tree, ensuring ordered processing
     *
     *
     * @param id the id of the offer
     * @param receiver the recipient abstracted account app id for the address in the leaf
     * @param asset the asset being transferred
     * @param amount the amount being transferred
     */
    disburse(id: uint64, receiver: Address, asset: AssetID, amount: uint64) {
        // ensure the offer exists
        assert(this.offers(id).exists)
        const offer = this.offers(id).value
        // ensure we are still in the collecting acceptances stage
        assert(offer.state === STATE_DISBURSING)

        // ensure this leaf is escrowed
        const hash = sha256(sha256(concat(this.txn.sender, concat(receiver, itob(asset) + itob(amount)))))
        assert(this.hashes({ id: id, hash: hash }).exists)

        // process the transfer
        if (asset.id === 0) {
            sendPayment({
                amount: amount,
                receiver: receiver,
                fee: 0,
            })
        } else if (!receiver.isOptedInToAsset(asset)) {
            this.arc59OptInAndSend(receiver, asset, amount)
        } else {
            this.pendingGroup.addAssetTransfer({
                xferAsset: asset,
                assetAmount: amount,
                assetReceiver: receiver,
                fee: 0,
                isFirstTxn: true,
            })

            let refundAmount = this.hashes({ id: id, hash: hash }).value
            if (this.app.address.assetBalance(asset) - amount === 0) {
                this.pendingGroup.addAssetTransfer({
                    xferAsset: asset,
                    assetAmount: 0,
                    assetReceiver: asset.creator,
                    assetCloseTo: asset.creator,
                    fee: 0,
                })
            } else {
                refundAmount -= globals.assetOptInMinBalance
            }

            // TODO: check on this
            // this just gives the MBR to whoever
            // triggers the disbursement
            // maybe we'd rather just refund the sender
            // that created the hash entry instead?
            this.pendingGroup.addPayment({
                amount: refundAmount,
                receiver: this.txn.sender,
                fee: 0,
            })
        }

        this.hashes({ id: id, hash: hash }).delete()
        this.offers(id).value.escrowed -= 1

        // if we collected all needed assets switch to the disbursement state
        if (offer.escrowed - 1 === 0) {
            this.offers(id).value.state = STATE_COMPLETED
        }
    }

    /**
     *
     *
     * @param id the id of the offer being cancelled
     * @param proof a proof of inclusion in the participants list
     */
    cancel(id: uint64, proof: bytes32[]) {
        // assert(this.controls(sender.address));
        // ensure the offer exists
        assert(this.offers(id).exists)
        const offer = this.offers(id).value
        // ensure we're in a cancellable state
        assert(offer.state === STATE_OFFERED || offer.state === STATE_ESCROWING)
        // ensure they are a participant
        assert(
            sendMethodCall<typeof MetaMerkles.prototype.verify, boolean>({
                applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
                methodArgs: [
                    this.app.address,
                    offer.participantRoot,
                    sha256(sha256(this.txn.sender)),
                    proof,
                    META_MERKLE_TRADE_TYPE,
                ],
                fee: 0,
            })
        )
        // set the state to cancelled
        this.offers(id).value.state = STATE_CANCELLED
    }

    /**
     * Withdraws your assets from a cancelled swap if they're escrowed
     *
     *
     * @param id the id of the cancelled offer
     * @param receiver the receiver of the leaf's swap
     * @param asset the asset of the leaf's swap
     * @param amount the amount of the leaf's swap
     * @param proof the proof that the leaf is in the tree
     * @param rekeyBack whether the abstracted account should be rekeyed back at the end
     */
    withdraw(id: uint64, receiver: Address, asset: AssetID, amount: uint64, proof: bytes32[]) {
        // ensure the offer exists
        assert(this.offers(id).exists)
        const offer = this.offers(id).value
        // ensure the offer is cancelled
        assert(offer.state === STATE_CANCELLED)
        // ensure the escrow count isn't zero
        assert(offer.escrowed > 0)
        // ensure this leaf is still escrowed
        const hash = sha256(sha256(concat(this.txn.sender, concat(receiver, itob(asset) + itob(amount)))))
        assert(this.hashes({ id: id, hash: hash }).exists)
        // verify the leaf
        assert(
            sendMethodCall<typeof MetaMerkles.prototype.verify, boolean>({
                applicationID: AppID.fromUint64(AkitaAppIDsMetaMerkles),
                methodArgs: [this.app.address, offer.root, hash, proof, META_MERKLE_TRADE_TYPE],
                fee: 0,
            })
        )

        let refundAmount = this.hashes({ id: id, hash: hash }).value
        if (asset.id !== 0 && this.app.address.assetBalance(asset) - amount === 0) {
            this.pendingGroup.addAssetTransfer({
                xferAsset: asset,
                assetAmount: 0,
                assetReceiver: asset.creator,
                assetCloseTo: asset.creator,
                fee: 0,
            })
        } else {
            refundAmount -= globals.assetOptInMinBalance
        }

        if (asset.id === 0) {
            sendPayment({
                amount: amount + refundAmount,
                receiver: this.txn.sender,
                fee: 0,
            })
        } else {
            // send the user their asset back
            this.pendingGroup.addAssetTransfer({
                xferAsset: asset,
                assetAmount: amount,
                assetReceiver: this.txn.sender,
                fee: 0,
            })

            // TODO: check on this
            // this just gives the MBR to whoever
            // triggers the disbursement
            // maybe we'd rather just refund the sender
            // that created the hash entry instead?
            this.pendingGroup.addPayment({
                amount: refundAmount,
                receiver: this.txn.sender,
                fee: 0,
            })

            this.pendingGroup.submit()
        }

        // add the leaf to the our escrowed list
        this.hashes({ id: id, hash: hash }).delete()
        // increment our escrow count
        this.offers(id).value.escrowed -= 1
        // mark the cancelled offer as done if theres no more escrowed assets
        if (offer.escrowed - 1 === 0) {
            this.offers(id).value.state = STATE_CANCEL_COMPLETED
        }
    }
}
