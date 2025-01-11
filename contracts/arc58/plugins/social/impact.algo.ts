import { Contract } from '@algorandfoundation/tealscript';
import { AkitaAppIDsAkitaSocialPlugin, AkitaAppIDsStakingPlugin, AkitaAppIDsSubscriptions, AkitaCollectionsPrefixAKC, AkitaCollectionsPrefixAOG, AkitaNFTCreatorAddress, OtherAppIDsAkitaRootNFD, OtherAppIDsNFDRegistry } from '../../../../utils/constants';
import { NFDRegistry } from '../../../../utils/types/nfd_registry';

import { NFD } from '../../../../utils/types/nfd';
import { AkitaSocialPlugin } from './social.algo';
import { StakeValue, Staking, STAKING_TYPE_SOFT } from '../../../staking/staking.algo';
import { Subscriptions } from '../../../subscriptions/subscriptions.algo';

const errs = {
    INVALID_NFD: 'Invalid NFD',
    NFD_CHANGED: 'NFD changed since impact last calculated',
    PLUGIN_NOT_AUTH_ADDR: 'This plugin does not have control of the account',
    AUTOMATED_ACCOUNT: 'This is an automated account',
    NOT_A_SUBSCRIPTION: 'Not an akita subscription contract',
    USER_DOES_NOT_OWN_NFD: 'User does not own this NFD',
    NOT_AN_AKITA_NFT: 'Not an akita NFT',
    USER_DOES_NOT_OWN_NFT: 'User does not own this NFT',
    NOT_AN_NFD: 'Not an NFD',
    NOT_DAO: 'Not the DAO',
};

const ONE_MILLION_AKITA = 1_000_000_000_000;
const TWO_HUNDRED_THOUSAND_AKITA = 200_000_000_000;
const TEN_THOUSAND_AKITA = 10_000_000_000;

const THIRTY_DAYS = 2_592_000;
const ONE_YEAR = 31_536_000

const NFD_PARENT_APP_KEY = 'i.parentAppID';
const NFD_VERSION_KEY = 'i.ver';
const NFD_NAME_KEY = 'i.name';
const NFD_TIME_CHANGED_KEY = 'i.timeChanged';
const NFD_VERIFIED_ADDRESSES_KEY = 'v.caAlgo.0.as';

const NFD_VERIFIED_DOMAIN_KEY = 'v.domain';
const NFD_VERIFIED_TWITTER_KEY = 'v.twitter';
const NFD_VERIFIED_DISCORD_KEY = 'v.discord';
const NFD_VERIFIED_TELEGRAM_KEY = 'v.telegram';

const AKITA_TOKEN_KEY = 'akita_id';

const subscriptionStateModifierMBR = 9_300;

export type MetaValue = {
    // the cached subscription App ID for the user
    subscriptionIndex: uint64;
    // the cached NFD for the user
    NFD: AppID;
    // the last time the NFD was updated and cached against this contract
    nfdTimeChanged: uint64;
    // the impact score from the cached NFD
    nfdImpact: uint64;
    // the cached akita NFT the user has
    akitaNFT: AssetID;
}

export class AkitaSocialImpact extends Contract {

    /** The App ID of the Akita DAO contract */
    akitaDaoAppID = TemplateVar<AppID>();

    /**
     * A map of the meta data for each user
     * 
     * key: the address of the user
     * key_length: 32
     * 
     * value: the meta data for the user
     * value_length: 105
     * 
     * cost: 2_500 + (400 * (32 + 105)) = 57_300
     */
    meta = BoxMap<Address, MetaValue>({ allowPotentialCollisions: true });

    /** 
     * A map of how each akita subscription affects impact calculation
     * 
     * key: index of the subscription
     * key_length: 1 + 8: 9
     * 
     * value: the modifier for the impact calculation 
     * value_length: 8
     * 
     * cost: 2_500 + (400 * (9 + 8)) = 9_300
     */
    subscriptionStateModifier = BoxMap<uint64, uint64>({ prefix: 's' });

    private isDAO(address: Address): boolean {
        return address === this.akitaDaoAppID.address;
    }

    private userHolds(address: Address, NFT: AssetID): boolean {
        return address.assetBalance(NFT) > 0;
    }

    private isSubscribed(address: Address, index: uint64): { active: boolean, index: uint64, streak: uint64 } {
        const info = sendMethodCall<typeof Subscriptions.prototype.getSubsriptionInfo>({
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [address, index],
            fee: 0,
        });

        // ensure they're subscribed to an Akita offering
        const toAkita = info.recipient === this.akitaDaoAppID.address;

        // box index zero is reserved for donations
        // if its higher than zero then they're subscribed to an offer
        const notDonating = info.index !== 0;

        const lastWindowStart = globals.latestTimestamp - (
            ((globals.latestTimestamp - info.startDate) % info.interval) + info.interval
        );

        // this doesn't tell us about the consistency of their payments,
        // only that their subscription isn't currently stale
        const notStale = info.lastPayment > lastWindowStart;

        return {
            active: (toAkita && notDonating && notStale),
            index: info.index,
            streak: info.streak
        };
    }

    private isNFD(NFD: AppID): boolean {
        const nfdName = NFD.globalState(NFD_NAME_KEY) as bytes;

        const valid = sendMethodCall<typeof NFDRegistry.prototype.isValidNfdAppId, boolean>({
            applicationID: AppID.fromUint64(OtherAppIDsNFDRegistry),
            methodArgs: [nfdName, NFD.id],
            fee: 0,
        });

        return valid;
    }

    // iterates over an NFD contracts verified addresses to check if the given address exists in the list
    private addressVerifiedOnNFD(address: Address, NFDAppID: AppID): boolean {

        const caAlgoData = sendMethodCall<typeof NFD.prototype.readField, bytes>({
            applicationID: NFDAppID,
            methodArgs: [NFD_VERIFIED_ADDRESSES_KEY],
            fee: 0,
        });

        for (let i = 0; i < caAlgoData.length; i += 32) {
            const addr = extract3(caAlgoData, i, 32);
            if (addr !== rawBytes(globals.zeroAddress) && addr === rawBytes(address)) {
                return true;
            }
        }

        return false;
    }

    private isAkitaNFT(akitaNFT: AssetID): boolean {
        return akitaNFT.creator === AkitaNFTCreatorAddress;
    }

    private userImpact(address: Address): uint64 {
        const meta = this.meta(address).value;

        const stakedAktaImpact = this.getStakingImpactScore(address); // Staked AKTA | up to 250
        const subscriberImpact = this.getSubscriberImpactScore(address, meta.subscriptionIndex); // Akita Subscriber | up to 250
        const nfdScore = this.getNFDImpactScore(address, meta.NFD); // NFD | up to 150
        const heldAkitaImpact = this.getHeldAktaImpactScore(address); // Held AKTA | up to 50
        const nftImpact = this.getNFTImpactScore(address, meta.akitaNFT); // Holds AKC/Omnigem | 50

        const total = stakedAktaImpact + subscriberImpact + nfdScore + heldAkitaImpact + nftImpact
        if (total === 0) {
            return 1
        }

        return total;
    }

    private userImpactWithSocial(address: Address): uint64 {
        const meta = this.meta(address).value;

        const stakedAktaImpact = this.getStakingImpactScore(address); // Staked AKTA | up to 250
        const subscriberImpact = this.getSubscriberImpactScore(address, meta.subscriptionIndex); // Akita Subscriber | up to 250
        const socialImpact = this.getSocialImpactScore(address); // Social Activity | up to 250
        const nfdScore = this.getNFDImpactScore(address, meta.NFD); // NFD | up to 150
        const heldAkitaImpact = this.getHeldAktaImpactScore(address); // Held AKTA | up to 50
        const nftImpact = this.getNFTImpactScore(address, meta.akitaNFT); // Holds AKC/Omnigem | 50

        const total = stakedAktaImpact + subscriberImpact + socialImpact + nfdScore + heldAkitaImpact + nftImpact
        if (total === 0) {
            return 1
        }

        return total;
    }

    private getStakingImpactScore(address: Address): uint64 {
        // - Staked AKTA | up to 250
        const info = sendMethodCall<typeof Staking.prototype.getInfo, StakeValue>({
            applicationID: AppID.fromUint64(AkitaAppIDsStakingPlugin),
            methodArgs: [
                address,
                {
                    asset: this.akitaDaoAppID.globalState(AKITA_TOKEN_KEY) as AssetID,
                    type: STAKING_TYPE_SOFT,
                },
            ],
            fee: 0,
        });

        const elapsed = globals.latestTimestamp - info.lastUpdate;

        // if the amount staked is too low or not much time has passed short circuit
        if (info.amount < TEN_THOUSAND_AKITA || elapsed < THIRTY_DAYS) {
            return 0;
        }

        // Calculate score based on time elapsed, capped by amount staked
        const amtCapped = info.amount >= TWO_HUNDRED_THOUSAND_AKITA ? TWO_HUNDRED_THOUSAND_AKITA : info.amount;

        // Calculate the maximum possible score based on the staked amount
        const maxScore = (amtCapped * 250) / TWO_HUNDRED_THOUSAND_AKITA;

        // Calculate the actual score based on time elapsed, capped by maxScore
        const timeCapped = elapsed >= ONE_YEAR ? ONE_YEAR : elapsed;

        return (timeCapped * maxScore) / ONE_YEAR;
    }

    private getHeldAktaImpactScore(address: Address): uint64 {
        const amount = address.assetBalance(this.akitaDaoAppID.globalState(AKITA_TOKEN_KEY) as AssetID);

        // if the amount is too low short circuit
        if (amount < TEN_THOUSAND_AKITA) {
            return 0;
        }

        const capped = amount >= ONE_MILLION_AKITA ? ONE_MILLION_AKITA : amount;
        return (capped * 50) / ONE_MILLION_AKITA;
    }

    private getSubscriberImpactScore(address: Address, subscriptionIndex: uint64): uint64 {
        let subscriberImpact = 0;

        const subscriptionState = this.isSubscribed(address, subscriptionIndex);

        if (!subscriptionState.active) {
            return subscriberImpact;
        }

        const modifier = this.subscriptionStateModifier(subscriptionState.index).value;

        // the streak will be up to date because we check for staleness in isSubscribed
        if (subscriptionState.streak >= 12) {
            subscriberImpact += (250 / modifier)
        } else {
            subscriberImpact += (subscriptionState.streak * 20) / modifier;
        }

        return subscriberImpact;
    }

    private getSocialImpactScore(address: Address): uint64 {
        return sendMethodCall<typeof AkitaSocialPlugin.prototype.getUserSocialImpact, uint64>({
            applicationID: AppID.fromUint64(AkitaAppIDsAkitaSocialPlugin),
            methodArgs: [ address ],
            fee: 0,
        });
    }

    private calcNFDImpactScore(NFDAppID: AppID): uint64 {
        // base | 50
        let nfdImpact = 50;

        if (
            NFDAppID.globalStateExists(NFD_PARENT_APP_KEY)
            && btoi(NFDAppID.globalState(NFD_PARENT_APP_KEY) as bytes) === AppID.fromUint64(OtherAppIDsAkitaRootNFD).id
        ) {
            nfdImpact += 50;
        }

        const version = extract3((NFDAppID.globalState(NFD_VERSION_KEY) as bytes), 0, 2);

        if (version !== '3.') {
            return nfdImpact;
        }
        const domain = sendMethodCall<typeof NFD.prototype.readField, bytes>({
            applicationID: NFDAppID,
            methodArgs: [NFD_VERIFIED_DOMAIN_KEY],
            fee: 0,
        });
        // website | 10
        if (domain !== '') {
            nfdImpact += 10;
        }

        const twitter = sendMethodCall<typeof NFD.prototype.readField, bytes>({
            applicationID: NFDAppID,
            methodArgs: [NFD_VERIFIED_TWITTER_KEY],
            fee: 0,
        });
        // twitter | 20
        if (twitter !== '') {
            nfdImpact += 20;
        }

        const discord = sendMethodCall<typeof NFD.prototype.readField, bytes>({
            applicationID: NFDAppID,
            methodArgs: [NFD_VERIFIED_DISCORD_KEY],
            fee: 0,
        });
        // discord | 10
        if (discord !== '') {
            nfdImpact += 10;
        }

        const telegram = sendMethodCall<typeof NFD.prototype.readField, bytes>({
            applicationID: NFDAppID,
            methodArgs: [NFD_VERIFIED_TELEGRAM_KEY],
            fee: 0,
        });
        // telegram | 10
        if (telegram !== '') {
            nfdImpact += 10;
        }

        return nfdImpact;
    }

    private getNFDImpactScore(address: Address, NFD: AppID): uint64 {
        const meta = this.meta(address).value;
        const timeChanged = btoi(meta.NFD.globalState(NFD_TIME_CHANGED_KEY) as bytes);

        assert(NFD.id === meta.NFD.id, errs.INVALID_NFD);
        assert(meta.nfdTimeChanged === timeChanged, errs.NFD_CHANGED);

        return meta.nfdImpact;
    }

    private getNFTImpactScore(address: Address, asa: AssetID): uint64 {
        const prefix = extract3(asa.unitName, 0, 3)
        if (asa.creator === AkitaNFTCreatorAddress && address.assetBalance(asa) > 0) {
            if (prefix === AkitaCollectionsPrefixAKC) {
                return 50;
            }
            if (prefix === AkitaCollectionsPrefixAOG) {
                return 25;
            }
        }
        return 0;
    }

    @abi.readonly
    socialGetUserImpact(address: Address, socialImpact: uint64): uint64 {
        return this.userImpact(address) + socialImpact;
    }

    @abi.readonly
    getUserImpact(address: Address): uint64 {
        return this.userImpactWithSocial(address);
    }

    @abi.readonly
    getMeta(user: Address): MetaValue {
        return this.meta(user).value;
    }

    cacheMeta(subscriptionIndex: uint64, NFD: AppID, akitaNFT: AssetID): uint64 {
        if (subscriptionIndex !== 0) {
            assert(this.isSubscribed(this.txn.sender, subscriptionIndex).active, errs.NOT_A_SUBSCRIPTION);
        }

        let nfdTimeChanged: uint64 = 0;
        let nfdImpact: uint64 = 0;
        if (NFD.id !== 0) {
            assert(this.isNFD(NFD), errs.NOT_AN_NFD);
            assert(this.addressVerifiedOnNFD(this.txn.sender, NFD), errs.USER_DOES_NOT_OWN_NFD);
            nfdTimeChanged = btoi(NFD.globalState(NFD_TIME_CHANGED_KEY) as bytes);
            nfdImpact = this.calcNFDImpactScore(NFD);
        }

        if (akitaNFT.id !== 0) {
            assert(this.isAkitaNFT(akitaNFT), errs.NOT_AN_AKITA_NFT);
            assert(this.userHolds(this.txn.sender, akitaNFT), errs.USER_DOES_NOT_OWN_NFT);
        }

        if (!this.meta(this.txn.sender).exists) {
            this.meta(this.txn.sender).value = {
                subscriptionIndex: subscriptionIndex,
                NFD: NFD,
                nfdTimeChanged: nfdTimeChanged,
                nfdImpact: nfdImpact,
                akitaNFT: akitaNFT,
            };
        } else {
            const meta = clone(this.meta(this.txn.sender).value);

            this.meta(this.txn.sender).value = {
                subscriptionIndex: subscriptionIndex,
                NFD: NFD,
                nfdTimeChanged: nfdTimeChanged,
                nfdImpact: nfdImpact,
                akitaNFT: akitaNFT,
            };
        }

        return nfdImpact;
    }

    updateSubscriptionStateModifier(payment: PayTxn, subscriptionIndex: uint64, newModifier: uint64): void {
        assert(this.isDAO(this.txn.sender), errs.NOT_DAO);

        this.subscriptionStateModifier(subscriptionIndex).value = newModifier;

        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: subscriptionStateModifierMBR,
        });
    }
}