import { Service as ServiceContract, SubscriptionInfoWithDetails as SubscriptionInfoWithDetailsContract, SubscriptionsArgs } from '../generated/SubscriptionsClient';
import { AppCallMethodCall } from "@algorandfoundation/algokit-utils/types/composer";
import { HighlightMessage, ServiceStatus } from "./constants";
import { MaybeSigner } from '../types';
type ContractArgs = SubscriptionsArgs["obj"];
export type SubscribeArgs = {
    asset: bigint;
    amount: bigint | number;
    interval: bigint | number;
    recipient: string;
    serviceId?: bigint | number;
    initialDepositAmount?: bigint | number;
    gateTxn?: AppCallMethodCall;
};
export type NewServiceArgs = Omit<ContractArgs['newService(pay,uint64,uint64,uint64,uint64,uint64,string,byte[36],uint8,byte[3])uint64'], 'payment' | 'highlightColor'> & {
    highlightColor: string;
    description: string;
} & MaybeSigner;
export type Service = Omit<ServiceContract, 'status' | 'highlightMessage' | 'highlightColor'> & {
    status: ServiceStatus;
    highlightMessage: HighlightMessage;
    highlightColor: string;
};
export type SubscriptionInfoWithDetails = Omit<SubscriptionInfoWithDetailsContract, 'highlightColor'> & {
    highlightMessage: HighlightMessage;
    highlightColor: string;
};
export type SubscriptionTimestampUnit = 'seconds' | 'milliseconds';
export type PaidUpCheckOptions = {
    now?: bigint | number;
    nowUnit?: SubscriptionTimestampUnit;
    startDateUnit?: SubscriptionTimestampUnit;
    lastPaymentUnit?: SubscriptionTimestampUnit;
    intervalUnit?: SubscriptionTimestampUnit;
};
export type SubscriptionStatus = {
    paidUp: boolean;
    windowStart: bigint;
    now: bigint;
    startDate: bigint;
    lastPayment: bigint;
    interval: bigint;
};
export {};
