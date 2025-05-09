import { BoxMap, Contract, gtxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { abimethod, Address, StaticBytes } from "@algorandfoundation/algorand-typescript/arc4";

export class SpendingAccountFactory extends Contract {

  walletIDsByAccounts = BoxMap<StaticBytes<16>, uint64>({ keyPrefix: 'a' })

  create(payment: gtxn.PaymentTxn, plugin: uint64): uint64 { return 0 }

  delete(id: uint64): void {}

  // @ts-ignore
  @abimethod({ readonly: true })
  exists(address: Address): boolean { return false }

  // @ts-ignore
  @abimethod({ readonly: true })
  get(address: Address): uint64 { return 0}

  // @ts-ignore
  @abimethod({ readonly: true })
  mustGet(address: Address): uint64 { return 0 }

  // @ts-ignore
  @abimethod({ readonly: true })
  getList(addresses: Address[]): uint64[] { return [] }

  // @ts-ignore
  @abimethod({ readonly: true })
  mustGetList(addresses: Address[]): uint64[] { return [] }
}