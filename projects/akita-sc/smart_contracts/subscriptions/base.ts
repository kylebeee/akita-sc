import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";
import { SubscriptionsMBRData } from "./types";

export class BaseSubscriptions extends Contract {
  protected mbr(passes: uint64): SubscriptionsMBRData {
    return {
      subscriptions: 54_100,
      subscriptionslist: 18_900,
      services: 49_700,
      serviceslist: 18_900,
      blocks: 28_100,
      passes: 18_900 + (400 * (32 * passes)),
    }
  }
}