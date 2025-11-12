import { AppCallMethodCall } from "@algorandfoundation/algokit-utils/types/composer";

export type SubscribeParams = {
  asset: bigint;
  amount: bigint | number
  interval: bigint | number
  recipient: string
  serviceId?: bigint | number
  initialDepositAmount?: bigint | number
  gateTxn?: AppCallMethodCall
}