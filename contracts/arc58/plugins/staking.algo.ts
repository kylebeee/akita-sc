import { Contract } from '@algorandfoundation/tealscript';

const lockMBR = 28_900;

const ONE_YEAR = 31_536_000; // 365 days * 24 hours * 60 minutes * 60 seconds

const errs = {
    NO_LOCK: 'Lock not found',
    BAD_EXPIRATION: 'Expiration must be in the future or hardlock disabled',
    BAD_EXPIRATION_UPDATE: 'Expiration must be greater than or equal to the current unlock time or hardlock disabled',
    LOCKED: 'This asset is still locked',
    PLUGIN_NOT_AUTH_ADDR: 'This plugin does not have control of the account'
}

interface StakeKey {
    user: Address;
    asset: AssetID;
    locked: boolean;
}

export interface StakeValue {
    amount: uint64;
    lastUpdate: uint64;
    expiration: uint64;
}

export interface AssetLock {
    asset: AssetID;
    locked: boolean;
}

export class StakingPlugin extends Contract {

    // 2_500 + (400 * (42 + 24)) = 28,900
    stake = BoxMap<StakeKey, StakeValue>();

    private controls(address: Address): boolean {
        return address.authAddr === this.app.address;
    }

    @abi.readonly
    timeLeft(user: Address, asset: AssetID): uint64 {

        const sk: StakeKey = { user: user, asset: asset, locked: true };
        
        if (!this.stake(sk).exists || globals.latestTimestamp >= this.stake(sk).value.expiration) {
            return 0;
        }

        return this.stake(sk).value.expiration - globals.latestTimestamp;
    }

    @abi.readonly
    getInfo(user: Address, lock: AssetLock): StakeValue {
        return this.stake({ user: user, asset: lock.asset, locked: lock.locked }).value;
    }

    @abi.readonly
    getInfoList(user: Address, locks: AssetLock[]): StakeValue[] {
        let results: StakeValue[] = [];
        for (let i = 0; i < locks.length; i += 1) {
            const lock = locks[i];
            results.push(this.stake({ user: user, asset: lock.asset, locked: lock.locked }).value);
        }
        return results;
    }

    @abi.readonly
    getLockedInfo(user: Address, asset: AssetID): StakeValue {
        return this.stake({ user: user, asset: asset, locked: true }).value;
    }

    @abi.readonly
    getLockedInfoList(user: Address, assets: AssetID[]): StakeValue[] {
        let results: StakeValue[] = [];
        for (let i = 0; i < assets.length; i += 1) {
            const asset = assets[i];
            results.push(this.stake({ user: user, asset: asset, locked: true }).value);
        }
        return results;
    }

    deposit(user: Address, asset: AssetID, locked: boolean, amount:uint64, expiration: uint64): void {
        const inTheFuture = expiration > globals.latestTimestamp;
        const lessThanOneYearInTheFuture = expiration <= (globals.latestTimestamp + ONE_YEAR);

        assert((inTheFuture && lessThanOneYearInTheFuture) || !locked, errs.BAD_EXPIRATION);
        const sk: StakeKey = { user: user, asset: asset, locked: locked };

        if (this.stake(sk).exists) {
            const currentLock = this.stake(sk).value;
            assert(expiration >= currentLock.expiration || !locked, errs.BAD_EXPIRATION_UPDATE);

            if (asset.id === 0) {
                sendPayment({
                    sender: user,
                    receiver: this.app.address,
                    amount: amount,
                });

                this.stake(sk).value = {
                    amount: (currentLock.amount + amount),
                    lastUpdate: globals.latestTimestamp,
                    expiration: expiration
                };
            } else {
                sendAssetTransfer({
                    sender: user,
                    assetAmount: amount,
                    assetReceiver: this.app.address,
                    xferAsset: asset,
                });

                this.stake(sk).value = {
                    amount: (currentLock.amount + amount),
                    lastUpdate: globals.latestTimestamp,
                    expiration: expiration
                };
            }
        } else if (asset.id === 0) {
            sendPayment({
                sender: user,
                receiver: this.app.address,
                amount: amount + lockMBR,
                fee: 0,
            });

            this.stake(sk).value = {
                amount: amount,
                lastUpdate: globals.latestTimestamp,
                expiration: expiration
            };
        } else {
            
            let mbrAmount = lockMBR;
            if (!this.app.address.isOptedInToAsset(asset)) {
                mbrAmount += globals.assetOptInMinBalance;

                this.pendingGroup.addAssetTransfer({
                    sender: this.app.address,
                    assetAmount: 0,
                    assetReceiver: this.app.address,
                    xferAsset: asset,
                    fee: 0,
                });
            }

            this.pendingGroup.addPayment({
                sender: user,
                receiver: this.app.address,
                amount: mbrAmount,
                fee: 0,
            });

            this.pendingGroup.addAssetTransfer({
                sender: user,
                assetAmount: amount,
                assetReceiver: this.app.address,
                xferAsset: asset,
                fee: 0,
            });

            this.pendingGroup.submit();

            this.stake(sk).value = {
                amount: amount,
                lastUpdate: globals.latestTimestamp,
                expiration: expiration,
            };
        }
    }

    withdraw(user: Address, asset: AssetID, locked: boolean): void {
        assert(this.controls(user), errs.PLUGIN_NOT_AUTH_ADDR);

        const sk: StakeKey = { user: user, asset: asset, locked: locked };
        assert(this.stake(sk).exists, errs.NO_LOCK);

        const currentLock = this.stake(sk).value;
        assert(!locked || currentLock.expiration < globals.latestTimestamp, errs.LOCKED);

        if (asset.id === 0) {
            sendPayment({
                amount: currentLock.amount,
                receiver: user,
                fee: 0,
            });
        } else {
            sendAssetTransfer({
                assetAmount: currentLock.amount,
                assetReceiver: user,
                xferAsset: asset,
            });
        }
        this.stake(sk).delete();
    }
}