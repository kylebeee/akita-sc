import { arc4, assert, BoxMap, bytes, Global, GlobalState, itxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { AkitaBaseContract } from "../../../../utils/base_contracts/base.algo";
import { GateGlobalStateKeyRegistryCursor } from "../../constants";
import { arc4SubscriptionGateCheckParams, arc4SubscriptionStreakRegistryInfo } from "./types";
import { Address, decodeArc4, interpretAsArc4, methodSelector } from "@algorandfoundation/algorand-typescript/arc4";
import { Subscriptions } from "../../../subscriptions/subscriptions.algo";
import { SubscriptionInfoWithPasses } from "../../../subscriptions/types";
import { Equal, GreaterThan, GreaterThanOrEqualTo, LessThan, LessThanOrEqualTo, NotEqual } from "../../../../utils/operators";
import { ERR_INVALID_ARG_COUNT } from "../../errors";

export class SubscriptionStreakGate extends AkitaBaseContract {

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  registry = BoxMap<uint64, arc4SubscriptionStreakRegistryInfo>({ keyPrefix: '' })

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private subscriptionStreakGate(
    address: Address,
    merchant: Address,
    id: uint64,
    op: uint64,
    streak: uint64
  ): boolean {

    const infoTxn = itxn
      .applicationCall({
        appId: super.getAppList().subscriptions,
        appArgs: [
          methodSelector(Subscriptions.prototype.getSubsriptionInfo),
          address,
          id
        ]
      })
      .submit()

    const info = decodeArc4<SubscriptionInfoWithPasses>(infoTxn.lastLog)

    const toMerchant = info.recipient === merchant

    const lastWindowStart = Global.latestTimestamp - (
      ((Global.latestTimestamp - info.startDate) % info.interval) + info.interval
    )

    const notStale = info.lastPayment > lastWindowStart

    if (!(toMerchant && notStale)) {
      return false;
    }

    if (op === Equal) {
      return info.streak === streak
    } else if (op === NotEqual) {
      return info.streak !== streak
    } else if (op === LessThan) {
      return info.streak < streak
    } else if (op === LessThanOrEqualTo) {
      return info.streak <= streak
    } else if (op === GreaterThan) {
      return info.streak > streak
    } else if (op === GreaterThanOrEqualTo) {
      return info.streak >= streak
    }

    return false
  }

  register(args: bytes): uint64 {
    assert(args.length === arc4SubscriptionStreakRegistryInfo.length, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4SubscriptionStreakRegistryInfo>(args)
    const id = this.newRegistryID()
    this.registry(id).value = params
    return id
  }

  check(args: bytes): boolean {
    assert(args.length === arc4SubscriptionGateCheckParams.length, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4SubscriptionGateCheckParams>(args)
    const info = this.registry(params.registryID.native).value
    return this.subscriptionStreakGate(params.user, info.merchant, info.id.native, info.op.native, info.streak.native)
  }
}