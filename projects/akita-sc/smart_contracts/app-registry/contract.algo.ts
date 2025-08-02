import { abimethod, Application, assert, assertMatch, BoxMap, bytes, clone, Contract, Global, gtxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";

const ERR_APP_NOT_REGISTERED = 'App not registered'
const ERR_INVALID_PAYMENT = 'Invalid payment'

export class AppRegistry extends Contract {

  apps = BoxMap<bytes<4>, uint64[]>({ keyPrefix: '' })

  private findMatch(address: Address, apps: uint64[]): uint64 {
    for (let i: uint64 = 0; i < apps.length; i++) {
      if (address.native.bytes === this.deriveAddr(apps[i])) {
        return apps[i]
      }
    }

    return 0
  }

  private deriveAddr(app: uint64): bytes<32> {
   return Application(app).address.bytes
  }

  register(
    payment: gtxn.PaymentTxn,
    app: uint64,
  ): void {
    const key = Application(app).address.bytes.slice(0, 4).toFixed({ length: 4 })
    if (!this.apps(key).exists) {
      assertMatch(
        payment,
        {
          receiver: Global.currentApplicationAddress,
          amount: 7_300,
        },
        ERR_INVALID_PAYMENT
      )

      this.apps(key).value = [app]
    } else {
      assertMatch(
        payment,
        {
          receiver: Global.currentApplicationAddress,
          amount: 4_800,
        },
        ERR_INVALID_PAYMENT
      )

      this.apps(key).value.push(app)
    }
  }

  @abimethod({ readonly: true })
  exists(address: Address): boolean {
    const addr4 = address.bytes.slice(0, 4).toFixed({ length: 4 })

    if (!this.apps(addr4).exists) {
      return false
    }

    const apps = clone(this.apps(addr4).value)
    const matchingAppID = this.findMatch(address, apps)

    return matchingAppID !== 0
  }

  @abimethod({ readonly: true })
  get(address: Address): uint64 {
    const addr4 = address.bytes.slice(0, 4).toFixed({ length: 4 })

    if (!this.apps(addr4).exists) {
      return 0
    }

    const apps = clone(this.apps(addr4).value)
    const matchingAppID = this.findMatch(address, apps)

    return matchingAppID
  }

  @abimethod({ readonly: true })
  mustGet(address: Address): uint64 {
    const addr4 = address.bytes.slice(0, 4).toFixed({ length: 4 })

    if (!this.apps(addr4).exists) {
      return 0
    }

    const apps = clone(this.apps(addr4).value)
    const matchingAppID = this.findMatch(address, apps)

    assert(matchingAppID !== 0, ERR_APP_NOT_REGISTERED)

    return matchingAppID
  }

  @abimethod({ readonly: true })
  getList(addresses: Address[]): uint64[] {
    let apps: uint64[] = []
    const zero: uint64 = 0
    for (const address of addresses) {
      const addr4 = address.bytes.slice(0, 4).toFixed({ length: 4 })

      if (!this.apps(addr4).exists) {
        apps = [...apps, zero]
        continue
      }

      const appList = clone(this.apps(addr4).value)
      apps = [
        ...apps,
        this.findMatch(address, appList)
      ]
    }
    return apps
  }

  @abimethod({ readonly: true })
  mustGetList(addresses: Address[]): uint64[] {
    let apps: uint64[] = []
    for (const address of addresses) {
      const addr4 = address.bytes.slice(0, 4).toFixed({ length: 4 })

      if (!this.apps(addr4).exists) {
        assert(false, ERR_APP_NOT_REGISTERED)
      }

      const appList = clone(this.apps(addr4).value)
      const matchingAppID = this.findMatch(address, appList)

      assert(matchingAppID !== 0, ERR_APP_NOT_REGISTERED)
      apps = [
        ...apps,
        matchingAppID
      ]
    }
    return apps
  }
}