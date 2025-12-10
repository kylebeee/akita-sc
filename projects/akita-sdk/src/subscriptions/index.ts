import { microAlgo } from "@algorandfoundation/algokit-utils";
import { microAlgos } from "@algorandfoundation/algokit-utils";
import { BaseSDK } from "../base";
import { ServiceFromTuple, ServicesKey, SubscriptionInfo, SubscriptionsArgs, SubscriptionsClient, SubscriptionsFactory } from '../generated/SubscriptionsClient'
import { MaybeSigner, NewContractSDKParams } from "../types";
import { ValueMap } from "../wallet/utils";
import { NewServiceArgs, Service, SubscribeArgs, SubscriptionInfoWithDetails } from "./types";
import { AppCallMethodCall } from "@algorandfoundation/algokit-utils/types/composer";
import { bytesToHexColor, hexColorToBytes, validateHexColor } from "./utils";
import { convertToUnixTimestamp } from "../utils";
import { MAX_DESCRIPTION_CHUNK_SIZE, MAX_DESCRIPTION_LENGTH } from "./constants";

type ContractArgs = SubscriptionsArgs["obj"];

export * from './constants';
export * from './types';
export * from './utils';

export class SubscriptionsSDK extends BaseSDK<SubscriptionsClient> {

  private serviceMapKeyGenerator = ({ address, id }: ServicesKey) => (`${address}${id}`)
  public services: ValueMap<ServicesKey, Service> = new ValueMap(this.serviceMapKeyGenerator);

  constructor(params: NewContractSDKParams) {
    super({ factory: SubscriptionsFactory, ...params });
  }

  /**
   * Get the cost to create a new service from the contract
   */
  async newServiceCost({ sender, signer, asset = 0n }: MaybeSigner & { asset?: bigint | number } = {}): Promise<bigint> {
    const sendParams = this.getSendParams({ sender, signer });
    return (await this.client.newServiceCost({ ...sendParams, args: { asset } }))
  }

  async blockCost({ sender, signer }: MaybeSigner = {}): Promise<bigint> {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.client.blockCost({ ...sendParams, args: [] })
  }

  /**
   * Get the cost to create a new subscription from the contract
   */
  async newSubscriptionCost({ sender, signer, recipient, asset = 0n, serviceId = 0n }: MaybeSigner & { recipient: string, asset?: bigint | number, serviceId?: bigint | number }): Promise<bigint> {
    const sendParams = this.getSendParams({ sender, signer });
    return (await this.client.newSubscriptionCost({ ...sendParams, args: { recipient, asset, serviceId } }))
  }

  async isBlocked({ sender, signer, address, blocked }: MaybeSigner & { address: string, blocked: string }): Promise<boolean> {
    const sendParams = this.getSendParams({ sender, signer });
    return (await this.client.isBlocked({ ...sendParams, args: { address, blocked } }))
  }

  async isShutdown({ sender, signer, address, id }: MaybeSigner & { address: string, id: bigint | number }): Promise<boolean> {
    const sendParams = this.getSendParams({ sender, signer });
    return (await this.client.isShutdown({ ...sendParams, args: { address, id } }))
  }

  async getServices(): Promise<ValueMap<ServicesKey, Service>> {
    const rawServices = await this.client.state.box.services.getMap();
    const transformedEntries = Array.from(rawServices.entries()).map(([key, value]) => [
      key,
      {
        ...value,
        highlightColor: bytesToHexColor(value.highlightColor)
      }
    ] as [ServicesKey, Service]);

    this.services = new ValueMap(
      this.serviceMapKeyGenerator,
      new Map(transformedEntries)
    );
    return this.services
  }

  async getService({ sender, signer, address, id }: MaybeSigner & { address: string, id: number }): Promise<Service> {
    const sendParams = this.getSendParams({ sender, signer });
    const result = (await this.client.getService({ ...sendParams, args: { address, id } }))

    return {
      ...result,
      highlightColor: bytesToHexColor(result.highlightColor)
    }
  }

  async getServicesByAddress({ sender, signer, address, start = 0n, windowSize = 20n }: MaybeSigner & { address: string, start?: bigint | number, windowSize?: bigint | number }): Promise<Service[]> {
    const sendParams = this.getSendParams({ sender, signer });
    const result = await this.client.getServicesByAddress({ ...sendParams, args: { address, start, windowSize } });
    // The return is an array of tuples, convert to Service objects
    const tuples = result as unknown as [number, bigint, bigint, bigint, bigint, bigint, string, string, Uint8Array, number, Uint8Array][];
    return tuples.map(tuple => {
      const result = ServiceFromTuple(tuple)
      return {
        ...result,
        highlightColor: bytesToHexColor(result.highlightColor)
      }
    });
  }

  async getSubscription({ sender, signer, address, id }: MaybeSigner & { address: string, id: bigint }): Promise<SubscriptionInfo> {
    const sendParams = this.getSendParams({ sender, signer });
    const result = (await this.client.mustGetSubscription({ ...sendParams, args: { key: { address, id } } }))
    return {
      ...result,
      lastPayment: convertToUnixTimestamp(result.lastPayment)
    }
  }

  async getSubscriptionWithDetails({ sender, signer, address, id }: MaybeSigner & { address: string, id: bigint }): Promise<SubscriptionInfoWithDetails> {
    const sendParams = this.getSendParams({ sender, signer });
    const result = (await this.client.getSubscriptionWithDetails({ ...sendParams, args: { key: { address, id } } }))
    return {
      ...result,
      highlightColor: bytesToHexColor(result.highlightColor),
      lastPayment: convertToUnixTimestamp(result.lastPayment),
    }
  }

  async isFirstSubscription({ sender, signer, address }: MaybeSigner & { address: string }): Promise<boolean> {
    const sendParams = this.getSendParams({ sender, signer });
    return (await this.client.isFirstSubscription({ ...sendParams, args: { address } }))
  }

  async newService({ sender, signer, asset = 0n, passes = 0n, gateId = 0n, ...rest }: NewServiceArgs): Promise<bigint> {

    const sendParams = this.getRequiredSendParams({ sender, signer });

    validateHexColor(rest.highlightColor);
    const highlightColor = hexColorToBytes(rest.highlightColor);
    // Use contract method to get the exact cost
    const paymentAmount = await this.newServiceCost({ ...sendParams, asset });

    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(paymentAmount),
      receiver: this.client.appAddress,
    })

    if (rest.description.length === 0) {
      throw new Error('Description cannot be empty');
    }

    const group = this.client.newGroup();

    group.newService({
      ...sendParams,
      args: {
        payment,
        asset,
        passes,
        gateId,
        ...rest,
        highlightColor
      }
    });

    // chunk description, max is: 3151
    if (rest.description.length > MAX_DESCRIPTION_LENGTH) {
      throw new Error(`Description length exceeds maximum of ${MAX_DESCRIPTION_LENGTH} characters`);
    }
    // [selector:4][offset:8][data:>=2036]
    // setServiceDescription(offset: uint64, data: bytes): void {
    if (rest.description.length > MAX_DESCRIPTION_CHUNK_SIZE) {
      group.setServiceDescription({
        ...sendParams,
        args: {
          offset: 0n,
          data: Buffer.from(rest.description).subarray(0, MAX_DESCRIPTION_CHUNK_SIZE)
        }
      });

      group.setServiceDescription({
        ...sendParams,
        args: {
          offset: BigInt(MAX_DESCRIPTION_CHUNK_SIZE),
          data: Buffer.from(rest.description).subarray(MAX_DESCRIPTION_CHUNK_SIZE)
        }
      });
    } else {
      group.setServiceDescription({
        ...sendParams,
        args: {
          offset: 0n,
          data: Buffer.from(rest.description)
        }
      });
    }

    group.activateService({
      ...sendParams,
      args: []
    })
    
    const result = await group.send({ ...sendParams })    
    return result.returns[0] as bigint;
  }

  async pauseService({ sender, signer, id }: MaybeSigner & ContractArgs['pauseService(uint64)void']): Promise<void> {

    const sendParams = this.getSendParams({ sender, signer });

    const group = this.client.newGroup();

    group.pauseService({
      ...sendParams,
      args: { id }
    });

    group.opUp({
      ...sendParams,
      args: {},
      maxFee: microAlgos(1_000),
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }

  async shutdownService({ sender, signer, id }: MaybeSigner & ContractArgs['shutdownService(uint64)void']): Promise<void> {

    const sendParams = this.getSendParams({ sender, signer });

    const group = this.client.newGroup();

    group.shutdownService({
      ...sendParams,
      args: { id }
    });

    group.opUp({
      ...sendParams,
      args: {},
      maxFee: microAlgos(1_000),
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }

  async block({ sender, signer, block }: MaybeSigner & { block: string }): Promise<void> {

    const sendParams = this.getRequiredSendParams({ sender, signer });

    const paymentAmount = await this.blockCost({ sender, signer });

    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(paymentAmount),
      receiver: this.client.appAddress,
    })

    const group = this.client.newGroup();

    group.block({
      ...sendParams,
      args: {
        payment,
        blocked: block
      }
    });

    group.opUp({
      ...sendParams,
      args: {},
      maxFee: microAlgos(1_000),
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }

  async unblock({ sender, signer, blocked }: MaybeSigner & ContractArgs['unblock(address)void']): Promise<void> {

    const sendParams = this.getSendParams({ sender, signer });

    const group = this.client.newGroup();

    group.unblock({
      ...sendParams,
      args: { blocked }
    });

    group.opUp({
      ...sendParams,
      args: {},
      maxFee: microAlgos(1_000),
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }

  async subscribe({
    sender,
    signer,
    asset = 0n,
    serviceId = 0n,
    initialDepositAmount = 0n,
    amount,
    interval,
    recipient,
    gateTxn
  }: MaybeSigner & SubscribeArgs): Promise<bigint> {

    const sendParams = this.getRequiredSendParams({ sender, signer });

    const isAlgoSubscription = asset === 0n;
    const isGated = gateTxn !== undefined;

    // Use contract method to get the exact subscription cost
    const subscribeCost = await this.newSubscriptionCost({
      ...sendParams,
      recipient,
      asset,
      serviceId
    });

    // For algo subscriptions, payment includes the subscription amount
    // For ASA subscriptions, payment only covers MBR
    const paymentAmount = isAlgoSubscription
      ? BigInt(amount) + subscribeCost + BigInt(initialDepositAmount)
      : subscribeCost;

    const payment = await this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(paymentAmount),
      receiver: this.client.appAddress,
    })

    const group = this.client.newGroup();

    if (isAlgoSubscription) {
      if (isGated) {
        group.gatedSubscribe({
          ...sendParams,
          args: {
            payment,
            gateTxn,
            amount,
            interval: BigInt(interval),
            recipient,
            serviceId,
          }
        });
      } else {
        group.subscribe({
          ...sendParams,
          args: {
            payment,
            amount,
            interval: BigInt(interval),
            recipient,
            serviceId,
          }
        });
      }
    } else {
      const assetTransfer = this.client.algorand.createTransaction.assetTransfer({
        ...sendParams,
        amount: 0n,
        assetId: asset,
        receiver: this.client.appAddress,
      })

      if (isGated) {
        group.gatedSubscribeAsa({
          ...sendParams,
          args: {
            payment,
            gateTxn,
            amount,
            interval: BigInt(interval),
            recipient,
            serviceId,
          }
        });
      } else {
        group.subscribeAsa({
          ...sendParams,
          args: {
            payment,
            assetXfer: assetTransfer,
            amount,
            interval: BigInt(interval),
            recipient,
            serviceId,
          }
        });
      }
    }

    // Add opUp calls to get more reference slots
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: microAlgos(1_000),
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: microAlgos(1_000),
      note: '1'
    });

    const result = await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
    const subscriptionId = result.returns[0] as bigint | undefined;

    if (subscriptionId === undefined) {
      throw new Error('Subscription failed, no subscription ID returned');
    }

    return subscriptionId;
  }

  async unsubscribe({ sender, signer, id }: MaybeSigner & ContractArgs['unsubscribe(uint64)void']): Promise<void> {
    const sendParams = this.getSendParams({ sender, signer });
    
    const group = this.client.newGroup();

    group.unsubscribe({
      ...sendParams,
      args: { id: BigInt(id) }
    });

    group.opUp({
      ...sendParams,
      args: {},
      maxFee: microAlgos(1_000),
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }

  async deposit({ sender, signer, asset = 0n, amount, id }: MaybeSigner & { asset?: bigint | number, amount: bigint | number, id: bigint | number }): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    const group = this.client.newGroup();

    if (asset !== 0n) {
      const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
        ...sendParams,
        amount: BigInt(amount),
        assetId: BigInt(asset),
        receiver: this.client.appAddress,
      })

      group.depositAsa({
        ...sendParams,
        args: {
          assetXfer,
          id: BigInt(id)
        }
      });
    } else {
      const payment = await this.client.algorand.createTransaction.payment({
        ...sendParams,
        amount: microAlgo(amount),
        receiver: this.client.appAddress,
      })

      group.deposit({
        ...sendParams,
        args: {
          payment,
          id: BigInt(id)
        }
      });
    }

    group.opUp({
      ...sendParams,
      args: {},
      maxFee: microAlgos(1_000),
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }

  async withdraw({
    sender,
    signer,
    asset = 0n,
    amount,
    id
  }:
    MaybeSigner & {
      asset?: bigint | number,
      amount: bigint | number,
      id: bigint | number
    }): Promise<void> {
    const sendParams = this.getSendParams({ sender, signer });

    const group = this.client.newGroup();

    group.withdraw({
      ...sendParams,
      args: {
        amount: BigInt(amount),
        id: BigInt(id)
      }
    });

    group.opUp({
      ...sendParams,
      args: {},
      maxFee: microAlgos(1_000),
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }

  async triggerPayment({ sender, signer, address, id, gateTxn }: MaybeSigner & { address: string, id: bigint, gateTxn?: AppCallMethodCall }): Promise<void> {
    const sendParams = this.getSendParams({ sender, signer });

    const group = this.client.newGroup();

    if (gateTxn !== undefined) {
      group.gatedTriggerPayment({
        ...sendParams,
        args: {
          gateTxn,
          key: { address, id }
        }
      });
    } else {
      group.triggerPayment({
        ...sendParams,
        args: { key: { address, id } }
      });
    }

    group.opUp({
      ...sendParams,
      args: {},
      maxFee: microAlgos(1_000),
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }

  async setPasses({ sender, signer, id, passes }: MaybeSigner & { id: bigint | number, passes: string[] }): Promise<void> {
    const sendParams = this.getSendParams({ sender, signer });

    const group = this.client.newGroup();

    group.setPasses({
      ...sendParams,
      args: {
        id: BigInt(id),
        addresses: passes
      }
    });

    group.opUp({
      ...sendParams,
      args: {},
      maxFee: microAlgos(1_000),
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }
}