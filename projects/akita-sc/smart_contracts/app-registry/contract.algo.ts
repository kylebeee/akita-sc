import { abimethod, Application, assert, assertMatch, BoxMap, Bytes, bytes, Contract, Global, gtxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { Address, StaticBytes } from "@algorandfoundation/algorand-typescript/arc4";
import { itob, sha512_256 } from "@algorandfoundation/algorand-typescript/op";

const ERR_APP_NOT_REGISTERED = 'App not registered'
const ERR_INVALID_PAYMENT = 'Invalid payment'

function bytes4(value: bytes) {
  return new StaticBytes<4>(value.slice(0, 4))
}

function addrBytes4(value: Address) {
  return bytes4(value.bytes)
}

export class AppRegistry extends Contract {

  apps = BoxMap<StaticBytes<4>, uint64[]>({ keyPrefix: '' })

  private findMatch(address: Address, apps: uint64[]): uint64 {
    for (let i: uint64 = 0; i < apps.length; i++) {
      if (address.native.bytes === this.deriveAddr(apps[i])) {
        return apps[i]
      }
    }

    return 0
  }

  private deriveAddr(app: uint64): bytes {
   return sha512_256(Bytes('appID').concat(itob(app)))
  }

  register(
    payment: gtxn.PaymentTxn,
    app: uint64,
  ): void {
    const key = bytes4(Application(app).address.bytes)
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

      this.apps(key).value = [
        ...this.apps(key).value,
        app,
      ]
    }
  }

  @abimethod({ readonly: true })
  exists(address: Address): boolean {
    if (!this.apps(addrBytes4(address)).exists) {
      return false
    }

    const apps = this.apps(addrBytes4(address)).value
    const matchingAppID = this.findMatch(address, apps)

    return matchingAppID !== 0
  }

  @abimethod({ readonly: true })
  get(address: Address): uint64 {
    if (!this.apps(addrBytes4(address)).exists) {
      return 0
    }

    const apps = this.apps(addrBytes4(address)).value
    const matchingAppID = this.findMatch(address, apps)

    return matchingAppID
  }

  @abimethod({ readonly: true })
  mustGet(address: Address): uint64 {
    if (!this.apps(addrBytes4(address)).exists) {
      return 0
    }

    const apps = this.apps(addrBytes4(address)).value
    const matchingAppID = this.findMatch(address, apps)

    assert(matchingAppID !== 0, ERR_APP_NOT_REGISTERED)

    return matchingAppID
  }

  @abimethod({ readonly: true })
  getList(addresses: Address[]): uint64[] {
    const apps: uint64[] = []
    for (const address of addresses) {
      if (!this.apps(addrBytes4(address)).exists) {
        apps.push(0)
        continue
      }

      const appList = this.apps(addrBytes4(address)).value
      apps.push(this.findMatch(address, appList))
    }
    return apps
  }

  @abimethod({ readonly: true })
  mustGetList(addresses: Address[]): uint64[] {
    const apps: uint64[] = []
    for (const address of addresses) {
      if (!this.apps(addrBytes4(address)).exists) {
        assert(false, ERR_APP_NOT_REGISTERED)
      }

      const appList = this.apps(addrBytes4(address)).value
      const matchingAppID = this.findMatch(address, appList)

      assert(matchingAppID !== 0, ERR_APP_NOT_REGISTERED)
      apps.push(matchingAppID)
    }
    return apps
  }
}