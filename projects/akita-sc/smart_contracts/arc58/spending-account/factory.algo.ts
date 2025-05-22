import { Application, assert, assertMatch, BoxMap, bytes, Contract, Global, gtxn, itxn, Uint64, uint64 } from "@algorandfoundation/algorand-typescript";
import { abimethod, Address, compileArc4, DynamicArray, StaticBytes, UintN64 } from "@algorandfoundation/algorand-typescript/arc4";
import { SpendingAccountContract } from "./contract.algo";
import { SpendingAccountFactoryBoxPrefixWalletIDsByAccounts } from "./constants";
import { ERR_FORBIDDEN, ERR_INVALID_PAYMENT, ERR_ONLY_APPS } from "./errors";
import { AccountMinimumBalance, fee, GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MIN_PROGRAM_PAGES } from '../../utils/constants'
import { bytes16 } from "../../utils/types/base";
import { SpendingAccountFactoryInterface } from "../../utils/types/spend-accounts";

export class SpendingAccountFactory extends Contract implements SpendingAccountFactoryInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  walletIDsByAccounts = BoxMap<bytes<16>, uint64>({ keyPrefix: SpendingAccountFactoryBoxPrefixWalletIDsByAccounts })

  // SPENDING ACCOUNT FACTORY METHODS -------------------------------------------------------------

  mint(payment: gtxn.PaymentTxn, plugin: uint64): uint64 {
    const caller = Global.callerApplicationId
    assert(caller !== 0, ERR_ONLY_APPS)

    const spendingAccount = compileArc4(SpendingAccountContract);

    const childAppMBR: uint64 = (
      MIN_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * spendingAccount.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * spendingAccount.globalBytes) +
      AccountMinimumBalance +
      12_500
    )

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: childAppMBR,
      },
      ERR_INVALID_PAYMENT
    )

    const newSpendAccount = spendingAccount.call
      .create({
        args: [caller, plugin],
        fee
      })
      .itxn
      .createdApp

    const id = newSpendAccount.id
    const spendAccount = bytes16(newSpendAccount.address.bytes)

    this.walletIDsByAccounts(spendAccount).value = caller

    itxn
      .payment({
        receiver: newSpendAccount.address,
        amount: AccountMinimumBalance,
        fee,
      })
      .submit()

    return id
  }

  delete(id: uint64): void {
    const caller = Global.callerApplicationId
    assert(caller !== 0, ERR_ONLY_APPS)
    const key = bytes16(Application(id).address.bytes)
    assert(
      this.walletIDsByAccounts(key).exists &&
      caller === this.walletIDsByAccounts(key).value,
      ERR_FORBIDDEN
    )

    const spendingAccount = compileArc4(SpendingAccountContract);

    const childAppMBR: uint64 = (
      MIN_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * spendingAccount.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * spendingAccount.globalBytes) +
      AccountMinimumBalance +
      12_500
    )

    spendingAccount.call.deleteApplication({ appId: id, fee })

    this.walletIDsByAccounts(key).delete()

    itxn
      .payment({
        amount: childAppMBR,
        rekeyTo: Global.callerApplicationAddress,
        fee,
      })
      .submit()
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  @abimethod({ readonly: true })
  exists(address: Address): boolean {
    return this.walletIDsByAccounts(bytes16(address.native.bytes)).exists
  }

  @abimethod({ readonly: true })
  get(address: Address): uint64 {
    if (!this.walletIDsByAccounts(bytes16(address.native.bytes)).exists) {
      return 0
    }
    return this.walletIDsByAccounts(bytes16(address.native.bytes)).value
  }

  @abimethod({ readonly: true })
  mustGet(address: Address): uint64 {
    assert(this.walletIDsByAccounts(bytes16(address.native.bytes)).exists, 'Account not found')
    return this.walletIDsByAccounts(bytes16(address.native.bytes)).value
  }

  @abimethod({ readonly: true })
  getList(addresses: Address[]): uint64[] {
    let apps: uint64[] = []
    for (let i: uint64 = 0; i < addresses.length; i++) {
      const address = addresses[i]
      if (this.walletIDsByAccounts(bytes16(address.native.bytes)).exists) {
        apps = [
          ...apps,
          this.walletIDsByAccounts(bytes16(address.native.bytes)).value
        ]
      } else {
        apps = [...apps, Uint64(0)]
      }
    }
    return apps
  }

  @abimethod({ readonly: true })
  mustGetList(addresses: Address[]): uint64[] {
    let apps: uint64[] = []
    for (let i: uint64 = 0; i < addresses.length; i++) {
      const address = addresses[i]
      assert(this.walletIDsByAccounts(bytes16(address.native.bytes)).exists, 'Account not found')
      apps = [
        ...apps,
        this.walletIDsByAccounts(bytes16(address.native.bytes)).value
      ]
    }
    return apps
  }
}