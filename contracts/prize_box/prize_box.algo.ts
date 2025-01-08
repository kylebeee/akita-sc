import { Contract } from "@algorandfoundation/tealscript";

const errs = {
    ALREADY_OPTED_IN: 'Asset is already opted in',
    NOT_OWNER: 'Only the owner can withdraw funds',
    NOT_EMPTY: 'Cannot delete application with prizes',
}

export type AssetInfo = {
    asset: AssetID;
    amount: uint64;
}

export class PrizeBox extends Contract {
    /** the owner of the box of prizes */
    owner = GlobalStateKey<Address>({ key: 'owner' });
    /** the current count of prizes opted in */
    count = GlobalStateKey<uint64>({ key: 'count' });

    createApplication(owner: Address): void {
        this.owner.value = owner;
        this.count.value = 0;
    }

    transfer(newOwner: Address): void {
        assert(this.txn.sender === this.owner.value, errs.NOT_OWNER);
        this.owner.value = newOwner;
    }

    optin(payment: PayTxn, asset: AssetID): void {
        assert(this.txn.sender === this.owner.value, errs.NOT_OWNER);
        // ensure the asset is not already opted in
        assert(!this.app.address.isOptedInToAsset(asset), errs.ALREADY_OPTED_IN);

        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: globals.assetOptInMinBalance,
        });

        sendAssetTransfer({
            assetReceiver: this.app.address,
            xferAsset: asset,
            assetAmount: 0,
            fee: 0,
        });
    }

    withdraw(assets: AssetInfo[]): void {
        assert(this.txn.sender === this.owner.value, errs.NOT_OWNER);

        for (let i = 0; i < assets.length; i += 1) {
            if (assets[i].asset.id !== 0) {
                const closeOut = this.app.address.assetBalance(assets[i].asset) === assets[i].amount;
                if (closeOut) {
                    this.count.value -= 1;
                    sendAssetTransfer({
                        xferAsset: assets[i].asset,
                        assetAmount: assets[i].amount,
                        assetReceiver: this.owner.value,
                        assetCloseTo: this.owner.value,
                        fee: 0,
                    });
                } else {
                    sendAssetTransfer({
                        xferAsset: assets[i].asset,
                        assetAmount: assets[i].amount,
                        assetReceiver: this.owner.value,
                        assetCloseTo: this.owner.value,
                        fee: 0,
                    });
                }
            } else {
                sendPayment({
                    amount: assets[i].amount,
                    receiver: this.owner.value,
                });
            }
        }
    }

    deleteApplication(): void {
        assert(this.txn.sender === this.owner.value, errs.NOT_OWNER);
        assert(this.count.value === 0, errs.NOT_EMPTY)
        sendPayment({
            receiver: this.owner.value,
            closeRemainderTo: this.owner.value,
        });
    }
}