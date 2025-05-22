import { Contract, gtxn, uint64 } from "@algorandfoundation/algorand-typescript";

export class OptInPluginInterface extends Contract {
    optInToAsset(walletID: uint64, rekeyBack: boolean, assets: uint64[], mbrPayment: gtxn.PaymentTxn): void {}
}