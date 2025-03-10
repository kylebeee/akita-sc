import { Contract } from '@algorandfoundation/tealscript';

export const lockMBR = 28_900;
const heartBeatMBR = 44_100;
const ONE_YEAR = 31_536_000; // 365 days * 24 hours * 60 minutes * 60 seconds

const errs = {
    NOT_AKITA_DAO: 'Only the Akita DAO can call this function',
    NO_LOCK: 'Lock not found',
    BAD_EXPIRATION: 'Expiration must be in the future or hardlock disabled',
    BAD_EXPIRATION_UPDATE: 'Expiration must be greater than or equal to the current unlock time or hardlock disabled',
    BAD_AMOUNT_HELD: 'Insufficient amount held',
    LOCKED: 'This asset is still locked',
    PLUGIN_NOT_AUTH_ADDR: 'This plugin does not have control of the account',
    STAKE_NOT_FOUND: 'Stake not found',
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    WITHDRAW_IS_ONLY_FOR_HARD_OR_LOCK: 'Withdraw is only for hard or lock',
    HEARTBEAT_CANNOT_UPDATE: 'Heartbeat stakes cannot be updated',
    NOT_HEARTBEAT_MANAGER: 'Only the heartbeat manager can call this method',
    HEARBEAT_NOT_FOUND: 'Heartbeat not found',
    STAKE_DOESNT_EXIST: 'Stake does not exist',
}

export type StakingType = uint64;

/**
 * Heartbeat staking uses the average of the last 4 heartbeats
 * triggered with random jitter 4 times a day
 * 
*/
export const STAKING_TYPE_HEARTBEAT = 0;

/**
 * Soft staking uses incentivized account watching to flag
 * users that drop below their committed balance
 */
export const STAKING_TYPE_SOFT = 1;

/**
 * Hard staking uses an escrowed balance
 * 
 */
export const STAKING_TYPE_HARD = 2;

/**
 * Hard locked staking uses an escrowed balance
 * and locks the balance for a set period of time
 * 
 */
export const STAKING_TYPE_LOCK = 3;

export type StakeKey = {
    address: Address;
    asset: AssetID;
    type: StakingType;
}

export type StakeValue = {
    amount: uint64;
    lastUpdate: uint64;
    expiration: uint64;
}

export type EscrowValue = {
    hard: uint64;
    lock: uint64;
}

export type HeartbeatKey = {
    address: Address;
    asset: AssetID;
}

export type HeartbeatValues = {
    amount: uint64;
    timestamp: uint64;
}

export type StakeInfo = {
    asset: AssetID;
    type: StakingType;
}

export type AssetCheck = {
    asset: AssetID;
    amount: uint64;
}

export class Staking extends Contract {
    /** The App ID of the Akita DAO contract */
    akitaDaoAppID = TemplateVar<AppID>();
    /** The address that is allowed to call the 'beat' method to create heartbeat records */
    heartbeatManagerAddress = GlobalStateKey<Address>({ key: 'heartbeat_manager_address' });

    // 2_500 + (400 * (42 + 24)) = 28,900
    stakes = BoxMap<StakeKey, StakeValue>();
    // 2_500 + (400 * (40 + 64)) = 44,100
    heartbeats = BoxMap<HeartbeatKey, StaticArray<HeartbeatValues, 4>>();

    @abi.readonly
    getTimeLeft(address: Address, asset: AssetID): uint64 {
        const sk: StakeKey = { address: address, asset: asset, type: STAKING_TYPE_LOCK };

        if (!this.stakes(sk).exists || globals.latestTimestamp >= this.stakes(sk).value.expiration) {
            return 0;
        }

        return this.stakes(sk).value.expiration - globals.latestTimestamp;
    }

    @abi.readonly
    mustGetTimeLeft(address: Address, asset: AssetID): uint64 {
        const sk: StakeKey = { address: address, asset: asset, type: STAKING_TYPE_LOCK };
        assert(this.stakes(sk).exists, errs.NO_LOCK);
        assert(globals.latestTimestamp < this.stakes(sk).value.expiration, errs.LOCKED);
        return this.stakes(sk).value.expiration - globals.latestTimestamp;
    }

    @abi.readonly
    getInfo(address: Address, stake: StakeInfo): StakeValue {
        const sk: StakeKey = { address: address, asset: stake.asset, type: stake.type };
        if (!this.stakes(sk).exists) {
            return { amount: 0, lastUpdate: 0, expiration: 0 };
        }
        return this.stakes(sk).value;
    }

    @abi.readonly
    mustGetInfo(address: Address, stake: StakeInfo): StakeValue {
        const sk: StakeKey = { address: address, asset: stake.asset, type: stake.type };
        assert(this.stakes(sk).exists, errs.NO_LOCK);
        return this.stakes(sk).value;
    }

    @abi.readonly
    getEscrowInfo(address: Address, asset: AssetID): EscrowValue {
        const sk: StakeKey = { address: address, asset: asset, type: STAKING_TYPE_HARD };
        const lk: StakeKey = { address: address, asset: asset, type: STAKING_TYPE_LOCK };

        let hard = 0;
        let lock = 0;

        if (this.stakes(sk).exists) {
            hard = this.stakes(sk).value.amount;
        }

        if (this.stakes(lk).exists) {
            lock = this.stakes(lk).value.amount;
        }

        return { hard: hard, lock: lock };
    }

    @abi.readonly
    getHeartbeat(address: Address, asset: AssetID): StaticArray<HeartbeatValues, 4> {
        const hbk: HeartbeatKey = { address: address, asset: asset };
        if (!this.heartbeats(hbk).exists) {
            const z: HeartbeatValues = { amount: 0, timestamp: 0 };
            return [z, z, z, z];
        }

        return this.heartbeats({ address: address, asset: asset }).value;
    }

    @abi.readonly
    mustGetHeartbeat(address: Address, asset: AssetID): StaticArray<HeartbeatValues, 4> {
        const hbk: HeartbeatKey = { address: address, asset: asset };
        assert(this.heartbeats(hbk).exists, errs.HEARBEAT_NOT_FOUND);
        return this.heartbeats({ address: address, asset: asset }).value;
    }

    @abi.readonly
    getHeartbeatAverage(address: Address, asset: AssetID): uint64 {
        if (!this.heartbeats({ address: address, asset: asset }).exists) {
            return 0;
        }

        const heartbeats = this.heartbeats({ address: address, asset: asset }).value as StaticArray<HeartbeatValues, 4>;
        let total = 0;
        heartbeats.forEach((hb) => {
            total += hb.amount;
        });
        return total / heartbeats.length;
    }

    @abi.readonly
    mustGetHeartbeatAverage(address: Address, asset: AssetID): uint64 {
        assert(this.heartbeats({ address: address, asset: asset }).exists, errs.HEARBEAT_NOT_FOUND);
        
        const heartbeats = this.heartbeats({ address: address, asset: asset }).value as StaticArray<HeartbeatValues, 4>;
        let total = 0;
        heartbeats.forEach((hb) => {
            total += hb.amount;
        });
        return total / heartbeats.length;
    }

    @abi.readonly
    getInfoList(address: Address, type: StakingType, assets: AssetID[]): StakeValue[] {
        let results: StakeValue[] = [];
        for (let i = 0; i < assets.length; i += 1) {
            const sk = { address: address, asset: assets[i], type: type };
            if (!this.stakes(sk).exists) {
                results.push({ amount: 0, lastUpdate: 0, expiration: 0 });
                continue;
            }
            results.push(this.stakes(sk).value);
        }
        return results;
    }

    @abi.readonly
    mustGetInfoList(address: Address, type: StakingType, assets: AssetID[]): StakeValue[] {
        let results: StakeValue[] = [];
        for (let i = 0; i < assets.length; i += 1) {
            const sk = { address: address, asset: assets[i], type: type };
            assert(this.stakes(sk).exists, errs.STAKE_NOT_FOUND);
            results.push(this.stakes(sk).value);
        }
        return results;
    }

    @abi.readonly
    stakeCheck(address: Address, assetChecks: AssetCheck[], type: StakingType): boolean {
        for (let i = 0; i < assetChecks.length; i += 1) {
            const sk: StakeKey = { address: address, asset: assetChecks[i].asset, type: type };
            if (!this.stakes(sk).exists) {
                return false;
            }

            const stake = this.stakes(sk).value;
            
            let amountToCheck = stake.amount
            if (type === STAKING_TYPE_HEARTBEAT) {
                amountToCheck = this.getHeartbeatAverage(address, assetChecks[i].asset)
            }

            if (assetChecks[i].amount >= amountToCheck) {
                return false;
            }
        }
        return true;
    }

    createApplication(): void {}

    updateApplication(): void {
        assert(this.txn.sender === this.akitaDaoAppID.address, errs.NOT_AKITA_DAO);
    }

    stake(
        payment: PayTxn,
        type: StakingType,
        amount: uint64,
        expiration: uint64,
        isUpdate: boolean,
    ): void {
        const inTheFuture = expiration > globals.latestTimestamp;
        const lessThanOneYearInTheFuture = expiration <= (globals.latestTimestamp + ONE_YEAR);
        const locked = type !== STAKING_TYPE_LOCK;
        const isEscrow = type === STAKING_TYPE_HARD || type === STAKING_TYPE_LOCK;

        assert((inTheFuture && lessThanOneYearInTheFuture) || !locked, errs.BAD_EXPIRATION);

        const sk: StakeKey = { address: this.txn.sender, asset: AssetID.fromUint64(0), type: type };

        if (!isUpdate) {
            if (isEscrow) {
                verifyPayTxn(payment, {
                    receiver: this.app.address,
                    amount: amount + lockMBR,
                });
            } else if (type === STAKING_TYPE_HEARTBEAT) {

                assert(this.txn.sender.balance >= amount, errs.BAD_AMOUNT_HELD);

                verifyPayTxn(payment, {
                    receiver: this.app.address,
                    amount: heartBeatMBR + lockMBR,
                });

                const heartbeatKey: HeartbeatKey = {
                    address: this.txn.sender,
                    asset: AssetID.fromUint64(0)
                };

                this.heartbeats(heartbeatKey).value = [{
                    amount: amount,
                    timestamp: globals.latestTimestamp
                }];
            } else {
                assert(this.txn.sender.balance >= amount, errs.BAD_AMOUNT_HELD);

                verifyPayTxn(payment, {
                    receiver: this.app.address,
                    amount: lockMBR,
                });
            }

            this.stakes(sk).value = {
                amount: amount,
                lastUpdate: globals.latestTimestamp,
                expiration: expiration,
            };
        } else {
            assert(this.stakes(sk).exists, errs.STAKE_NOT_FOUND);
            assert(type !== STAKING_TYPE_HEARTBEAT, errs.HEARTBEAT_CANNOT_UPDATE);
            const currentLock = this.stakes(sk).value;
            assert(expiration >= currentLock.expiration || !locked, errs.BAD_EXPIRATION_UPDATE);

            if (isEscrow) {
                verifyPayTxn(payment, {
                    receiver: this.app.address,
                    amount: amount,
                });
            } else {
                assert(this.txn.sender.balance >= (currentLock.amount + amount), errs.INSUFFICIENT_BALANCE);
            }

            this.stakes(sk).value = {
                amount: (currentLock.amount + amount),
                lastUpdate: globals.latestTimestamp,
                expiration: expiration
            };
        }
    }

    stakeAsa(
        payment: PayTxn,
        assetXfer: AssetTransferTxn,
        type: StakingType,
        amount: uint64,
        expiration: uint64,
        isUpdate: boolean,
    ): void {
        const inTheFuture = expiration > globals.latestTimestamp;
        const lessThanOneYearInTheFuture = expiration <= (globals.latestTimestamp + ONE_YEAR);
        const locked = type !== STAKING_TYPE_LOCK;
        const isEscrow = type === STAKING_TYPE_HARD || type === STAKING_TYPE_LOCK;

        assert((inTheFuture && lessThanOneYearInTheFuture) || !locked, errs.BAD_EXPIRATION);

        const asset = assetXfer.xferAsset;
        const sk: StakeKey = { address: this.txn.sender, asset: asset, type: type };

        if (!isUpdate) {
            if (isEscrow) {
                verifyPayTxn(payment, {
                    receiver: this.app.address,
                    amount: lockMBR,
                });

                verifyAssetTransferTxn(assetXfer, {
                    assetReceiver: this.app.address,
                    assetAmount: amount,
                    xferAsset: asset,
                });
            } else if (type === STAKING_TYPE_HEARTBEAT) {

                assert(this.txn.sender.assetBalance(asset) >= amount, errs.BAD_AMOUNT_HELD);

                verifyPayTxn(payment, {
                    receiver: this.app.address,
                    amount: heartBeatMBR + lockMBR,
                });

                verifyAssetTransferTxn(assetXfer, {
                    assetAmount: 0,
                    assetReceiver: this.app.address,
                    xferAsset: asset,
                });

                const heartbeatKey: HeartbeatKey = {
                    address: this.txn.sender,
                    asset: asset
                };

                this.heartbeats(heartbeatKey).value = [{
                    amount: amount,
                    timestamp: globals.latestTimestamp
                }];
            } else {
                assert(this.txn.sender.assetBalance(asset) >= amount, errs.BAD_AMOUNT_HELD);

                verifyPayTxn(payment, {
                    receiver: this.app.address,
                    amount: lockMBR,
                });

                verifyAssetTransferTxn(assetXfer, {
                    assetAmount: 0,
                    assetReceiver: this.app.address,
                    xferAsset: asset,
                });
            }

            this.stakes(sk).value = {
                amount: amount,
                lastUpdate: globals.latestTimestamp,
                expiration: expiration,
            };
        } else {
            assert(this.stakes(sk).exists, errs.STAKE_NOT_FOUND);
            assert(type !== STAKING_TYPE_HEARTBEAT, errs.HEARTBEAT_CANNOT_UPDATE);
            const currentLock = this.stakes(sk).value;
            assert(expiration >= currentLock.expiration || !locked, errs.BAD_EXPIRATION_UPDATE);

            verifyPayTxn(payment, {
                receiver: this.app.address,
                amount: 0,
            });

            if (isEscrow) {
                verifyAssetTransferTxn(assetXfer, {
                    assetAmount: amount,
                    assetReceiver: this.app.address,
                    xferAsset: asset,
                });
            } else {
                assert(this.txn.sender.assetBalance(asset) >= (currentLock.amount + amount), errs.INSUFFICIENT_BALANCE);
            }

            this.stakes(sk).value = {
                amount: (currentLock.amount + amount),
                lastUpdate: globals.latestTimestamp,
                expiration: expiration
            };
        }
    }

    withdraw(asset: AssetID, type: StakingType): void {
        assert(type === STAKING_TYPE_HARD || type === STAKING_TYPE_LOCK, errs.WITHDRAW_IS_ONLY_FOR_HARD_OR_LOCK);

        const sk: StakeKey = { address: this.txn.sender, asset: asset, type: type };
        assert(this.stakes(sk).exists, errs.NO_LOCK);

        const currentLock = this.stakes(sk).value;
        assert(type !== STAKING_TYPE_LOCK || currentLock.expiration < globals.latestTimestamp, errs.LOCKED);

        if (asset.id === 0) {
            sendPayment({
                amount: currentLock.amount,
                receiver: this.txn.sender,
                fee: 0,
            });
        } else {
            sendAssetTransfer({
                assetAmount: currentLock.amount,
                assetReceiver: this.txn.sender,
                xferAsset: asset,
                fee: 0,
            });
        }
        this.stakes(sk).delete();
    }

    createHeartbeat(address: Address, asset: AssetID): void {

        assert(this.txn.sender === this.heartbeatManagerAddress.value, errs.NOT_HEARTBEAT_MANAGER);

        const heartbeatKey: HeartbeatKey = { address: address, asset: asset };

        assert(this.heartbeats(heartbeatKey).exists, errs.HEARBEAT_NOT_FOUND);

        const heartbeats = this.heartbeats(heartbeatKey).value;

        let amount = address.assetBalance(asset);
        const hardStakeKey: StakeKey = { address: address, asset: asset, type: STAKING_TYPE_HARD };
        if (this.stakes(hardStakeKey).exists) {
            amount += this.stakes(hardStakeKey).value.amount
        }

        const lockStakeKey: StakeKey = { address: address, asset: asset, type: STAKING_TYPE_LOCK };
        if (this.stakes(lockStakeKey).exists) {
            amount += this.stakes(lockStakeKey).value.amount
        }

        /**
         * The index with the highest timestamp is the newest 
         * since we only keep history of the last 4 heartbeats
         * all we need to do is check which timestamp in the array
         * is the highest and replace the one after it with the new heartbeat
         * 
        */
        for (let i = 0; i < 4; i += 1) {
            if (i === 3 || heartbeats[i].timestamp > heartbeats[i + 1].timestamp) {
                const indexToModify = i === 3 ? 0 : i + 1;
                this.heartbeats(heartbeatKey).value[indexToModify] = {
                    amount: amount,
                    timestamp: globals.latestTimestamp
                }
                return;
            }
        }
    }

    softCheck(address: Address, asset: AssetID): boolean {
        const sk: StakeKey = { address: address, asset: asset, type: STAKING_TYPE_SOFT };
        assert(this.stakes(sk).exists, errs.STAKE_DOESNT_EXIST);
        
        const stake = this.stakes(sk).value;
        if (asset.id === 0) {
            const valid = address.balance >= stake.amount;
            if (!valid) {
                this.stakes(sk).value = {
                    amount: address.balance,
                    lastUpdate: globals.latestTimestamp,
                    expiration: 0,
                };
            }
            return valid;
        }
        const valid = address.assetBalance(asset) >= stake.amount;
        if (!valid) {
            this.stakes(sk).value = {
                amount: address.assetBalance(asset),
                lastUpdate: globals.latestTimestamp,
                expiration: 0,
            };
        }
        return valid;
    }
}