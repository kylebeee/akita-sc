import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";
import { SubscriptionsMBRData } from "./types";
import { BlocksMBR, MinPassesMBR, ServicesListMBR, ServicesMBR, SubscriptionsListMBR, SubscriptionsMBR } from "./constants";
import { AccountLength, BoxCostPerBox } from "../utils/constants";

export class BaseSubscriptions extends Contract {
  protected mbr(passes: uint64): SubscriptionsMBRData {
    return {
      subscriptions: SubscriptionsMBR,
      subscriptionslist: SubscriptionsListMBR,
      services: ServicesMBR,
      serviceslist: ServicesListMBR,
      blocks: BlocksMBR,
      passes: MinPassesMBR + (BoxCostPerBox * (AccountLength * passes)),
    }
  }
}