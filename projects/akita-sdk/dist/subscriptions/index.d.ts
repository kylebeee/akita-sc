import { BaseSDK } from "../base";
import { ServicesKey, SubscriptionInfo, SubscriptionsArgs, SubscriptionsClient } from '../generated/SubscriptionsClient';
import { MaybeSigner, NewContractSDKParams } from "../types";
import { ValueMap } from "../wallet/utils";
import { NewServiceArgs, PaidUpCheckOptions, Service, SubscribeArgs, SubscriptionInfoWithDetails, SubscriptionStatus } from "./types";
import { AppCallMethodCall } from "@algorandfoundation/algokit-utils/types/composer";
export { ServicesKey } from '../generated/SubscriptionsClient';
type ContractArgs = SubscriptionsArgs["obj"];
export * from './constants';
export * from './types';
export * from './utils';
export declare class SubscriptionsSDK extends BaseSDK<SubscriptionsClient> {
    private serviceMapKeyGenerator;
    services: ValueMap<ServicesKey, Service>;
    constructor(params: NewContractSDKParams);
    /**
     * Get the cost to create a new service from the contract
     */
    newServiceCost({ sender, signer, asset }?: MaybeSigner & {
        asset?: bigint | number;
    }): Promise<bigint>;
    blockCost({ sender, signer }?: MaybeSigner): Promise<bigint>;
    /**
     * Get the cost to create a new subscription from the contract
     */
    newSubscriptionCost({ sender, signer, recipient, asset, serviceId }: MaybeSigner & {
        recipient: string;
        asset?: bigint | number;
        serviceId?: bigint | number;
    }): Promise<bigint>;
    /**
     * Get the cost to opt the contract into an asset
     */
    optInCost({ sender, signer, asset }: MaybeSigner & {
        asset: bigint | number;
    }): Promise<bigint>;
    /**
     * Check if the contract is opted into a specific asset
     */
    isOptedInToAsset(asset: bigint | number): Promise<boolean>;
    isBlocked({ sender, signer, address, blocked }: MaybeSigner & {
        address: string;
        blocked: string;
    }): Promise<boolean>;
    isShutdown({ sender, signer, address, id }: MaybeSigner & {
        address: string;
        id: bigint | number;
    }): Promise<boolean>;
    getServices(): Promise<ValueMap<ServicesKey, Service>>;
    getService({ sender, address, id }: {
        sender?: string;
    } & {
        address: string;
        id: number;
    }): Promise<Service>;
    getServicesByAddress({ sender, address, start, windowSize }: {
        sender?: string;
    } & {
        address: string;
        start?: bigint | number;
        windowSize?: bigint | number;
    }): Promise<Service[]>;
    getSubscription({ sender, address, id }: {
        sender?: string;
    } & {
        address: string;
        id: bigint;
    }): Promise<SubscriptionInfo>;
    getSubscriptionWithDetails({ sender, address, id }: {
        sender?: string;
    } & {
        address: string;
        id: bigint;
    }): Promise<SubscriptionInfoWithDetails>;
    /**
     * Compute paid-up status and current payment window for a subscription.
     *
     * Defaults align with SDK-returned data:
     * - startDate: seconds (on-chain)
     * - interval: seconds (on-chain)
     * - lastPayment: milliseconds (SDK converts it)
     * - now: milliseconds (Date.now())
     */
    getSubscriptionStatus(subscription: SubscriptionInfo, options?: PaidUpCheckOptions): SubscriptionStatus;
    /**
     * Convenience wrapper for paid-up boolean.
     */
    isSubscriptionPaidUp(subscription: SubscriptionInfo, options?: PaidUpCheckOptions): boolean;
    isFirstSubscription({ sender, address }: {
        sender?: string;
    } & {
        address: string;
    }): Promise<boolean>;
    getSubscriptionList({ sender, address }: {
        sender?: string;
    } & {
        address: string;
    }): Promise<bigint>;
    getServiceList({ sender, address }: {
        sender?: string;
    } & {
        address: string;
    }): Promise<bigint>;
    newService({ sender, signer, asset, passes, gateId, ...rest }: NewServiceArgs): Promise<bigint>;
    pauseService({ sender, signer, id }: MaybeSigner & ContractArgs['pauseService(uint64)void']): Promise<void>;
    shutdownService({ sender, signer, id }: MaybeSigner & ContractArgs['shutdownService(uint64)void']): Promise<void>;
    block({ sender, signer, block }: MaybeSigner & {
        block: string;
    }): Promise<void>;
    unblock({ sender, signer, blocked }: MaybeSigner & ContractArgs['unblock(address)void']): Promise<void>;
    subscribe({ sender, signer, asset, serviceId, initialDepositAmount, amount, interval, recipient, gateTxn }: MaybeSigner & SubscribeArgs): Promise<bigint>;
    unsubscribe({ sender, signer, id }: MaybeSigner & ContractArgs['unsubscribe(uint64)void']): Promise<void>;
    deposit({ sender, signer, asset, amount, id }: MaybeSigner & {
        asset?: bigint | number;
        amount: bigint | number;
        id: bigint | number;
    }): Promise<void>;
    withdraw({ sender, signer, asset, amount, id }: MaybeSigner & {
        asset?: bigint | number;
        amount: bigint | number;
        id: bigint | number;
    }): Promise<void>;
    triggerPayment({ sender, signer, address, id, gateTxn }: MaybeSigner & {
        address: string;
        id: bigint;
        gateTxn?: AppCallMethodCall;
    }): Promise<void>;
    setPasses({ sender, signer, id, passes }: MaybeSigner & {
        id: bigint | number;
        passes: string[];
    }): Promise<void>;
}
