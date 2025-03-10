import { AkitaAppIDsDAO, MAX_UINT64 } from '../../utils/constants';
import { ContractWithOptIn } from '../../utils/base_contracts/optin.algo';

const errs = {
    PLUGIN_DOES_NOT_CONTROL_WALLET: 'Plugin does not control wallet',
    TOKEN_ALLOCATION_BOX_ALREADY_EXISTS: 'Token allocation box already exists',
    TOKEN_ALLOCATION_BOX_DOES_NOT_EXIST: 'Token allocation box does not exist',
    YOU_ARE_NOT_THE_CREATOR: 'You are not the creator of this disbursement',
    APP_NOT_OPTED_INTO_ASSET: 'App is not opted into asset',
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
    /** the asset id being distributed */
    asset: AssetID;
}

export type UserAlloction = {
    /** the address of the account */
    address: Address;
    /** the amount the user is owed */
    amount: uint64;
}

export type AllocationReclaimDetails = Omit<UserAllocationsKey, 'disbursementID'>

export class Rewards extends ContractWithOptIn {
    programVersion = 10;

    /** version of the subscription contract */
    version = GlobalStateKey<uint64>({ key: 'version' });
    /** the app id for the Akita DAO */
    daoAppID = GlobalStateKey<AppID>({ key: 'dao_app_id' });
    /** the disbursement */
    disbursementID = GlobalStateKey<uint64>({ key: 'disbursement_id' });

    /** the disbursement map of the bones token 
     * 
     * the key is the uint64 id of the disbursement
     * the value is the details of the disbursement
     * 
    */
    disbursements = BoxMap<uint64, DisbursementDetails>({ prefix: 'd' });

    /** the user allocations of disbursements
     * 
     * the key is the address of the qualified account with the uint64 id of the disbursement
     * the value is the asset and amount they are owed
     */
    userAllocations = BoxMap<UserAllocationsKey, uint64>({ prefix: 'u' });

    private newDisbursementID(): uint64 {
        const id = this.disbursementID.value;
        this.disbursementID.value += 1;
        return id;
    }

    getDisbursementMBR(title: string, note: string): uint64 {
        const currentMBR = this.app.address.minBalance;
        this.disbursements(MAX_UINT64).value = {
            creator: this.txn.sender,
            status: DISBURSEMENT_STATUS_DRAFT,
            title: title,
            amount: 0,
            timeToUnlock: 0,
            expiration: 0,
            allocations: 0,
            distributed: 0,
            note: note,
        };
        const afterMBR = this.app.address.minBalance;
        this.disbursements(MAX_UINT64).delete();
        return (afterMBR - currentMBR)
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
        
        const currentMBR = this.app.address.minBalance;
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
        const afterMBR = this.app.address.minBalance;

        const mbrAmount = (afterMBR - currentMBR);
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

    createUserAllocations(payment: PayTxn, id: uint64, allocations: UserAlloction[]): void {
        assert(this.disbursements(id).exists, errs.DISBURSEMENT_DOES_NOT_EXIST);

        const disbursement = this.disbursements(id).value;
        assert(disbursement.status === DISBURSEMENT_STATUS_DRAFT, errs.DISBURSEMENT_ALREADY_FINAL);

        let sum = 0;
        for (let i = 0; i < allocations.length; i += 1) {
            const userAllocationsKey: UserAllocationsKey = {
                disbursementID: id,
                address: allocations[i].address,
                asset: AssetID.fromUint64(0),
            };
            assert(!this.userAllocations(userAllocationsKey).exists, errs.ALLOCATION_ALREADY_EXISTS);

            this.userAllocations(userAllocationsKey).value = allocations[i].amount;

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
        asset: AssetID,
        allocations: UserAlloction[],
    ): void {
        assert(this.app.address.isOptedInToAsset(asset), errs.APP_NOT_OPTED_INTO_ASSET);
        assert(this.disbursements(id).exists, errs.DISBURSEMENT_DOES_NOT_EXIST);

        const disbursement = this.disbursements(id).value;
        assert(disbursement.status === DISBURSEMENT_STATUS_DRAFT, errs.DISBURSEMENT_ALREADY_FINAL);

        let matchSum = 0;
        for (let i = 0; i < allocations.length; i += 1) {
            const userAllocationsKey: UserAllocationsKey = {
                disbursementID: id,
                address: allocations[i].address,
                asset: asset,
            };
            assert(!this.userAllocations(userAllocationsKey).exists, errs.ALLOCATION_ALREADY_EXISTS);

            this.userAllocations(userAllocationsKey).value = allocations[i].amount

            this.disbursements(id).value.allocations += 1;
            this.disbursements(id).value.amount += allocations[i].amount;
            matchSum += allocations[i].amount;
        }

        assert(assetXfer.assetAmount === matchSum, errs.INVALID_SUM);

        // each user allocation box raises the MBR by 24,900 microAlgo
        const mbrAmount = (24_900 * allocations.length);

        verifyPayTxn(mbrPayment, {
            amount: mbrAmount,
            receiver: this.app.address,
        });

        verifyAssetTransferTxn(assetXfer, {
            assetReceiver: this.app.address,
            assetAmount: {
                greaterThan: 0,
            },
            xferAsset: asset,
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

    claimRewards(rewards: { id: uint64, asset: AssetID }[]): void {
        for (let i = 0; i < rewards.length; i += 1) {
            assert(this.disbursements(rewards[i].id).exists, errs.DISBURSEMENT_DOES_NOT_EXIST);

            const disbursement = this.disbursements(rewards[i].id).value;
            assert(disbursement.timeToUnlock <= globals.latestTimestamp - 60, errs.DISBURSEMENT_LOCKED);
            assert(disbursement.expiration >= globals.latestTimestamp, errs.DISBURSEMENT_LOCKED);
            assert(disbursement.amount > disbursement.distributed, errs.DISBURSEMENT_FULLY_DISTRIBUTED);

            const userAllocationsKey: UserAllocationsKey = {
                disbursementID: rewards[i].id,
                address: this.txn.sender,
                asset: rewards[i].asset,
            };
            assert(this.userAllocations(userAllocationsKey).exists, errs.ALLOCATION_DOES_NOT_EXIST);
            const userAllocation = this.userAllocations(userAllocationsKey).value;

            this.disbursements(rewards[i].id).value.allocations -= 1;
            this.disbursements(rewards[i].id).value.distributed += userAllocation;
            this.userAllocations(userAllocationsKey).delete();

            this.pendingGroup.addPayment({
                receiver: disbursement.creator,
                amount: 24_900,
                fee: 0,
            });

            const isAlgo = rewards[i].asset.id === 0;

            if (!isAlgo) {
                this.pendingGroup.addAssetTransfer({
                    assetReceiver: this.txn.sender,
                    assetAmount: userAllocation,
                    xferAsset: rewards[i].asset,
                    fee: 0,
                    note: disbursement.note,
                });
            } else {
                this.pendingGroup.addPayment({
                    receiver: this.txn.sender,
                    amount: userAllocation,
                    fee: 0,
                    note: disbursement.note,
                });
            }

            this.pendingGroup.submit();
        }
    }

    reclaimRewards(id: uint64, allocations: AllocationReclaimDetails[]): void {
        assert(this.disbursements(id).exists, errs.DISBURSEMENT_DOES_NOT_EXIST);
        const disbursement = this.disbursements(id).value;

        assert(disbursement.creator === this.txn.sender, errs.YOU_ARE_NOT_THE_CREATOR);
        assert(disbursement.status === DISBURSEMENT_STATUS_FINAL, errs.DISBURSEMENT_ALREADY_FINAL);
        assert(disbursement.expiration <= globals.latestTimestamp, errs.DISBURSEMENT_NOT_EXPIRED);

        for (let i = 0; i < allocations.length; i += 1) {
            const userAllocationsKey: UserAllocationsKey = {
                disbursementID: id,
                address: allocations[i].address,
                asset: allocations[i].asset,
            };
            assert(this.userAllocations(userAllocationsKey).exists, errs.ALLOCATION_DOES_NOT_EXIST);

            const userAllocation = this.userAllocations(userAllocationsKey).value;

            this.disbursements(id).value.amount -= userAllocation;
            this.disbursements(id).value.allocations -= 1;
            this.userAllocations(userAllocationsKey).delete();

            const isAlgo = allocations[i].asset.id === 0;

            if (!isAlgo) {
                this.pendingGroup.addAssetTransfer({
                    assetReceiver: disbursement.creator,
                    assetAmount: userAllocation,
                    xferAsset: allocations[i].asset,
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
                    amount: userAllocation + allocationMBR,
                    fee: 0,
                });
            }

            this.pendingGroup.submit();
        }
    }
}