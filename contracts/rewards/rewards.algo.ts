import { Contract } from '@algorandfoundation/tealscript';
import { AkitaAppIDsDAO } from '../../utils/constants';

const errs = {
    PLUGIN_DOES_NOT_CONTROL_WALLET: 'Plugin does not control wallet',
    TOKEN_ALLOCATION_BOX_ALREADY_EXISTS: 'Token allocation box already exists',
    TOKEN_ALLOCATION_BOX_DOES_NOT_EXIST: 'Token allocation box does not exist',
    YOU_ARE_NOT_THE_CREATOR: 'You are not the creator of this disbursement',
    DISBURSEMENT_DOES_NOT_EXIST: 'Disbursement does not exist',
    DISBURSEMENT_ALREADY_FINAL: 'Disbursement already final',
    ALLOCATION_ALREADY_EXISTS: 'Allocation already exists',
    INVALID_DISBURSEMENT_UNLOCK_TIME: 'Invalid disbursement unlock time',
    INVALID_DISBURSEMENT_EXPIRATION_TIME: 'Invalid disbursement expiration time',
    DISBURSEMENTS_CANNOT_BE_EMPTY: 'Disbursements cannot be empty',
    DISBURSEMENTS_MUST_HAVE_ALLOCATIONS: 'Disbursements must have allocations',
    DISBURSEMENT_LOCKED: 'Disbursement is locked',
    DISBURSEMENT_FULLY_DISTRIBUTED: 'Disbursement is fully distributed',
    ALLOCATION_DOES_NOT_EXIST: 'Allocation does not exist',
    DISBURSEMENT_NOT_EXPIRED: 'Disbursement has not expired',
    INVALID_SUM: 'Invalid sum',
}

const allocationMBR = 24_900;

const AKITA_DAO_REWARDS_DISTRIBUTION_FEE_KEY = 'rewards_distribution_fee';

export type DisbursementStatus = uint64;

export const DISBURSEMENT_STATUS_DRAFT = 0;
export const DISBURSEMENT_STATUS_FINAL = 2;

export type DisbursementDetails = {
    /** the creator of the disbursement */
    creator: Address;
    /** the disbursement status */
    status: DisbursementStatus;
    /** the disbursement title */
    title: string;
    /** the amount of tokens to distribute */
    amount: uint64;
    /** the unix timestamp of the disbursement */
    timeToUnlock: uint64;
    /** the expiration time as a unix timestamp */
    expiration: uint64;
    /** the number of users with allocations */
    allocations: uint64;
    /** the amount already distributed from this allocation */
    distributed: uint64;
    /** notes */
    note: string;
}

export type UserAllocationsKey = {
    /** the address of the account */
    address: Address;
    /** the disbursement id */
    disbursementID: uint64;
}

export type UserAllocationDetails = {
    /** the asset id being distributed */
    assetID: AssetID;
    /** the amount the user is owed */
    amount: uint64;
}

export type UserAlloction = {
    /** the address of the account */
    address: Address;
    /** the amount the user is owed */
    amount: uint64;
}

export class Rewards extends Contract {
    programVersion = 10;

    /** version of the subscription contract */
    version = GlobalStateKey<uint64>({ key: 'version' });
    /** the app id for the Akita DAO */
    daoAppID = GlobalStateKey<AppID>({ key: 'dao_app_id' });

    /** the disbursement */
    _disbursementID = GlobalStateKey<uint64>({ key: 'disbursement_id' });

    /** the disbursement map of the bones token 
     * 
     * the key is the uint64 id of the disbursement
     * the value is the details of the disbursement
     * 
    */
    disbursements = BoxMap<uint64, DisbursementDetails>({ prefix: 'd' });

    /** the user allocations of disbursements
     * 
     * the key is the uint64 id of the disbursement
     * the value is the address of the account that qualified
     */
    userAllocations = BoxMap<UserAllocationsKey, UserAllocationDetails>({ prefix: 'u' });

    private newDisbursementID(): uint64 {
        const id = this._disbursementID.value;
        this._disbursementID.value += 1;
        return id;
    }

    createDisbursement(
        mbrPayment: PayTxn,
        feePayment: PayTxn,
        title: string,
        timeToUnlock: uint64,
        expiration: uint64,
        note: string,
    ): uint64 {

        const id = this.newDisbursementID();

        this.disbursements(id).value = {
            creator: this.txn.sender,
            status: DISBURSEMENT_STATUS_DRAFT,
            title: title,
            amount: 0,
            timeToUnlock: timeToUnlock,
            expiration: expiration,
            allocations: 0,
            distributed: 0,
            note: note,
        };

        const mbrAmount = 1_000_000;
        verifyPayTxn(mbrPayment, {
            amount: mbrAmount,
            receiver: this.app.address,
        });

        const akitaDAO = AppID.fromUint64(AkitaAppIDsDAO);
        verifyPayTxn(feePayment, {
            amount: akitaDAO.globalState(AKITA_DAO_REWARDS_DISTRIBUTION_FEE_KEY) as uint64,
            receiver: akitaDAO.address,
        });

        return id;
    }

    editDisbursement(
        id: uint64,
        title: string,
        timeToUnlock: uint64,
        expiration: uint64,
        note: string,
    ): void {
        assert(this.disbursements(id).exists, errs.DISBURSEMENT_DOES_NOT_EXIST);

        const disbursement = clone(this.disbursements(id).value);
        assert(this.txn.sender === disbursement.creator, errs.YOU_ARE_NOT_THE_CREATOR);
        assert(disbursement.status === DISBURSEMENT_STATUS_DRAFT, errs.DISBURSEMENT_ALREADY_FINAL);

        this.disbursements(id).value = {
            creator: this.txn.sender,
            status: DISBURSEMENT_STATUS_DRAFT,
            title: title,
            amount: disbursement.amount,
            timeToUnlock: timeToUnlock,
            expiration: expiration,
            allocations: disbursement.allocations,
            distributed: disbursement.distributed,
            note: note,
        };
    }

    createUserAllocations(
        payment: PayTxn,
        id: uint64,
        allocations: UserAlloction[]
    ): void {
        assert(this.disbursements(id).exists, errs.DISBURSEMENT_DOES_NOT_EXIST);

        const disbursement = this.disbursements(id).value;
        assert(disbursement.status === DISBURSEMENT_STATUS_DRAFT, errs.DISBURSEMENT_ALREADY_FINAL);

        let sum = 0;
        for (let i = 0; i < allocations.length; i += 1) {
            const userAllocationsKey: UserAllocationsKey = { disbursementID: id, address: allocations[i].address };
            assert(!this.userAllocations(userAllocationsKey).exists, errs.ALLOCATION_ALREADY_EXISTS);

            this.userAllocations(userAllocationsKey).value = {
                assetID: AssetID.fromUint64(0),
                amount: allocations[i].amount,
            };

            this.disbursements(id).value.allocations += 1;
            this.disbursements(id).value.amount += allocations[i].amount;
            sum += allocations[i].amount;
        }

        // each user allocation box raises the MBR by 24,900 microAlgo
        const mbrAmount = (24_900 * allocations.length);

        verifyPayTxn(payment, {
            amount: mbrAmount + sum,
            receiver: this.app.address,
        });
    }

    createAsaUserAllocations(
        mbrPayment: PayTxn,
        assetXfer: AssetTransferTxn,
        id: uint64,
        assetID: AssetID,
        allocations: UserAlloction[],
        sum: uint64,
    ): void {
        assert(this.disbursements(id).exists, errs.DISBURSEMENT_DOES_NOT_EXIST);

        const disbursement = this.disbursements(id).value;
        assert(disbursement.status === DISBURSEMENT_STATUS_DRAFT, errs.DISBURSEMENT_ALREADY_FINAL);

        let matchSum = 0;
        for (let i = 0; i < allocations.length; i += 1) {
            const userAllocationsKey: UserAllocationsKey = { disbursementID: id, address: allocations[i].address };
            assert(!this.userAllocations(userAllocationsKey).exists, errs.ALLOCATION_ALREADY_EXISTS);

            this.userAllocations(userAllocationsKey).value = {
                assetID: assetID,
                amount: allocations[i].amount,
            };

            this.disbursements(id).value.allocations += 1;
            this.disbursements(id).value.amount += allocations[i].amount;
            matchSum += allocations[i].amount;
        }

        assert(sum === matchSum, errs.INVALID_SUM);

        // each user allocation box raises the MBR by 24,900 microAlgo
        const mbrAmount = (24_900 * allocations.length);

        verifyPayTxn(mbrPayment, {
            amount: mbrAmount,
            receiver: this.app.address,
        });

        if (!this.app.address.isOptedInToAsset(assetID)) { 
            this.pendingGroup.addAssetTransfer({
                assetReceiver: this.app.address,
                assetAmount: 0,
                xferAsset: assetID,
                fee: 0,
            });
        }

        verifyAssetTransferTxn(assetXfer, {
            assetReceiver: this.app.address,
            assetAmount: sum,
            xferAsset: assetID,
            fee: 0,
        });
    }

    finalizeDisbursement(id: uint64): void {
        assert(this.disbursements(id).exists, errs.DISBURSEMENT_DOES_NOT_EXIST);

        const disbursement = this.disbursements(id).value;
        assert(this.txn.sender === disbursement.creator, errs.YOU_ARE_NOT_THE_CREATOR);
        assert(disbursement.status === DISBURSEMENT_STATUS_DRAFT, errs.DISBURSEMENT_ALREADY_FINAL);
        assert(
            disbursement.timeToUnlock >= globals.latestTimestamp
            || disbursement.timeToUnlock === 0,
            errs.INVALID_DISBURSEMENT_UNLOCK_TIME
        );
        assert(
            disbursement.expiration >= globals.latestTimestamp + 60
            || disbursement.expiration === 0,
            errs.INVALID_DISBURSEMENT_EXPIRATION_TIME
        );
        assert(disbursement.amount > 0, errs.DISBURSEMENTS_CANNOT_BE_EMPTY);
        assert(disbursement.allocations > 0, errs.DISBURSEMENTS_MUST_HAVE_ALLOCATIONS);

        this.disbursements(id).value.status = DISBURSEMENT_STATUS_FINAL;
    }

    claimRewards(ids: uint64[]): void {
        for (let i = 0; i < ids.length; i += 1) {
            assert(this.disbursements(ids[i]).exists, errs.DISBURSEMENT_DOES_NOT_EXIST);

            const disbursement = this.disbursements(ids[i]).value;
            assert(disbursement.timeToUnlock <= globals.latestTimestamp - 60, errs.DISBURSEMENT_LOCKED);
            assert(disbursement.expiration >= globals.latestTimestamp, errs.DISBURSEMENT_LOCKED);
            assert(disbursement.amount > disbursement.distributed, errs.DISBURSEMENT_FULLY_DISTRIBUTED);

            const userAllocationsKey: UserAllocationsKey = { disbursementID: ids[i], address: this.txn.sender };
            assert(this.userAllocations(userAllocationsKey).exists, errs.ALLOCATION_DOES_NOT_EXIST);
            const userAllocation = this.userAllocations(userAllocationsKey).value;

            this.disbursements(ids[i]).value.allocations -= 1;
            this.disbursements(ids[i]).value.distributed += userAllocation.amount;
            this.userAllocations(userAllocationsKey).delete();

            this.pendingGroup.addPayment({
                receiver: disbursement.creator,
                amount: 24_900,
                fee: 0,
            });

            const isAlgo = userAllocation.assetID.id === 0;

            if (!isAlgo) {
                this.pendingGroup.addAssetTransfer({
                    assetReceiver: this.txn.sender,
                    assetAmount: userAllocation.amount,
                    xferAsset: userAllocation.assetID,
                    fee: 0,
                    note: disbursement.note,
                });
            } else {
                this.pendingGroup.addPayment({
                    receiver: this.txn.sender,
                    amount: userAllocation.amount,
                    fee: 0,
                    note: disbursement.note,
                });
            }

            this.pendingGroup.submit();
        }
    }

    reclaimRewards(id: uint64, allocations: UserAlloction[]): void {
        assert(this.disbursements(id).exists, errs.DISBURSEMENT_DOES_NOT_EXIST);
        const disbursement = this.disbursements(id).value;

        assert(disbursement.creator === this.txn.sender, errs.YOU_ARE_NOT_THE_CREATOR);
        assert(disbursement.status === DISBURSEMENT_STATUS_FINAL, errs.DISBURSEMENT_ALREADY_FINAL);
        assert(disbursement.expiration <= globals.latestTimestamp, errs.DISBURSEMENT_NOT_EXPIRED);

        for (let i = 0; i < allocations.length; i += 1) {
            const userAllocationsKey: UserAllocationsKey = { disbursementID: id, address: allocations[i].address };
            assert(this.userAllocations(userAllocationsKey).exists, errs.ALLOCATION_DOES_NOT_EXIST);

            const userAllocation = this.userAllocations(userAllocationsKey).value;
            assert(userAllocation.amount === allocations[i].amount, errs.ALLOCATION_DOES_NOT_EXIST);

            this.userAllocations(userAllocationsKey).delete();
            this.disbursements(id).value.amount -= allocations[i].amount;
            this.disbursements(id).value.allocations -= 1;

            const isAlgo = userAllocation.assetID.id === 0;

            if (!isAlgo) {
                this.pendingGroup.addAssetTransfer({
                    assetReceiver: disbursement.creator,
                    assetAmount: userAllocation.amount,
                    xferAsset: userAllocation.assetID,
                    fee: 0,
                });

                this.pendingGroup.addPayment({
                    receiver: disbursement.creator,
                    amount: allocationMBR,
                    fee: 0,
                });
            } else {
                this.pendingGroup.addPayment({
                    receiver: disbursement.creator,
                    amount: userAllocation.amount + allocationMBR,
                    fee: 0,
                });
            }

            this.pendingGroup.submit();
        }
    }
}