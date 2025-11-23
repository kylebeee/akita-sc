import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";
import { SubscriptionsMBRData } from "./types";
import { BlocksMBR, MAX_PASSES, MinPassesMBR, ServicesListMBR, ServicesMBR, SubscriptionsListMBR, SubscriptionsMBR } from "./constants";
import { AccountLength, BoxCostPerBox } from "../utils/constants";

export class BaseSubscriptions extends Contract {
  protected mbr(): SubscriptionsMBRData {
    return {
      subscriptions: SubscriptionsMBR,
      subscriptionslist: SubscriptionsListMBR,
      services: ServicesMBR,
      serviceslist: ServicesListMBR,
      blocks: BlocksMBR,
      passes: MinPassesMBR + (BoxCostPerBox * (AccountLength * MAX_PASSES)),
    }
  }
}