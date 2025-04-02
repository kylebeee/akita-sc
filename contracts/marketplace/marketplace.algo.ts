import {
    GlobalState,
    BoxMap,
    assert,
    arc4,
    uint64,
    Account,
    TransactionType,
    Application,
    gtxn,
    itxn,
    Asset,
    OnCompleteAction,
    abimethod,
    Bytes,
} from '@algorandfoundation/algorand-typescript'
import { AssetHolding, btoi, Global, itob, len, sha256, Txn } from '@algorandfoundation/algorand-typescript/op'
import { abiCall, Address, Byte, StaticBytes, compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { classes } from 'polytype'
import { GlobalStateKeyRevocationApp } from '../constants'
import { AkitaBaseContract } from '../../utils/base_contracts/base.algo'
// import { arc4MethodInfo, arc4MethodRestriction, arc4PluginInfo, arc4PluginsKey, FullPluginValidation, MethodInfo, MethodRestriction, MethodValidation, PluginsKey, PluginValidation } from './types'
import { AkitaDomain } from '../../utils/constants'
import { uint64Array } from '../../utils/types/base'

import { ContractWithOptIn } from '../../utils/base_contracts/optin.algo'
import { MetaMerkles } from '../meta_merkles/meta_merkles.algo'
import { AkitaAppIDsMetaMerkles } from '../../utils/constants'
import { Listing } from './listing.algo'
import { AKITA_LISTING_SELLER_KEY, AkitaMarketplaceGlobalStateKeysChildContractVersion } from './constants'

const errs = {
    NOT_AKITA_DAO: 'Only the Akita DAO can call this function',
    PRICE_TOO_LOW: 'Lowest price is 4 units for divisibility',
    MARKETPLACE_NOT_OPTED_INTO_PAYMENT_ASSET: 'Marketplace must be opted into payment asset',
    NOT_A_LISTING: 'Not a listing contract',
}

const creatorRoyaltyDefault = 500
const creatorRoyaltyMaximum = 5000

const childContractMBR = 100_000 + 28_500 * Listing.schema.global.numUint + 50_000 * Listing.schema.global.numByteSlice

export class Marketplace extends classes(AkitaBaseContract, ContractWithOptIn) {
    /** the version of the child contract */
    childContractVersion = GlobalState<string>({ key: AkitaMarketplaceGlobalStateKeysChildContractVersion })

    // @ts-ignore
    @abimethod({ onCreate: 'require' })
    public createApplication(version: string): void {
        this.childContractVersion.value = version
        super.class(AkitaBaseContract)
    }

    // @ts-ignore
    @abimethod({ allowActions: 'UpdateApplication' })
    public updateApplication(): void {
        assert(Txn.sender === super.class(AkitaBaseContract).akitaDAO.value.address, errs.NOT_AKITA_DAO)
    }

    public list(
        payment: gtxn.PaymentTxn,
        assetXfer: gtxn.AssetTransferTxn,
        price: uint64,
        paymentAsset: Asset,
        name: string,
        proof: StaticBytes<32>,
        marketplace: Address,
        expirationRound: uint64,
        reservedFor: Address,
        gateID: uint64
    ): uint64 {
        const isAlgoPayment = paymentAsset.id === 0

        if (!isAlgoPayment) {
            assert(
                Global.currentApplicationAddress.isOptedIn(paymentAsset),
                errs.MARKETPLACE_NOT_OPTED_INTO_PAYMENT_ASSET
            )
        }

        const optinMBR = isAlgoPayment ? Global.assetOptInMinBalance : Global.assetOptInMinBalance * 2

        const mbrAmount = childContractMBR + optinMBR

        // ensure they paid enough to cover the contract mint + mbr costs
        assert(payment.amount === mbrAmount)
        assert(payment.receiver === Global.currentApplicationAddress)

        // make sure they actually send the asset they want to sell
        assert(assetXfer.assetAmount > 0)
        assert(assetXfer.assetReceiver === Global.currentApplicationAddress)

        /* the lowest unit sale is 4
         * because of the number of addresses to pay
         * whenever this gets sold
         */
        assert(price >= 4, errs.PRICE_TOO_LOW)

        let creatorRoyalty = 0
        if (proof.length > 0) {
            // fetch the royalty set for the asset being sold
            const encodedCreatorRoyalty = abiCall(MetaMerkles.prototype.verifiedRead, {
                appId: AkitaAppIDsMetaMerkles,
                args: [
                    new Address(assetXfer.xferAsset.creator),
                    new arc4.Str(name),
                    new arc4.StaticBytes<32>(sha256(sha256(itob(assetXfer.xferAsset.id)))),
                    new arc4.DynamicArray(proof),
                    1,
                    new arc4.Str('royalty'),
                ],
                fee: 0,
            }).returnValue

            // we fail gracefully if the asset has no royalty set
            if (encodedCreatorRoyalty.native.length > 0) {
                creatorRoyalty = btoi(encodedCreatorRoyalty.bytes)
            } else {
                creatorRoyalty = creatorRoyaltyDefault
            }
        } else {
            creatorRoyalty = creatorRoyaltyDefault
        }

        // rather than fail out we just cap the royalty
        // both for the creator & for the marketplaces
        if (creatorRoyalty > creatorRoyaltyMaximum) {
            creatorRoyalty = creatorRoyaltyMaximum
        }

        // mint listing contract
        // initialize child
        // TODO: migrate linting contract first
    }
}
