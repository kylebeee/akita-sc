import { Application, Contract, gtxn, uint64 } from "@algorandfoundation/algorand-typescript";

export class OptInPluginInterface extends Contract {
  optIn(wallet: Application, rekeyBack: boolean, assets: uint64[], mbrPayment: gtxn.PaymentTxn): void {}
}