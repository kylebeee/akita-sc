import { microAlgo } from "@algorandfoundation/algokit-utils";
import { BaseSDK } from "../base";
import { ServiceFromTuple, ServicesKey, SubscriptionInfo, SubscriptionsArgs, SubscriptionsClient, SubscriptionsFactory } from '../generated/SubscriptionsClient'
import { hasSenderSigner, MaybeSigner, NewContractSDKParams } from "../types";
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
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }
    return (await this.client.newServiceCost({ ...sendParams, args: { asset } }))
  }

  async blockCost({ sender, signer }: MaybeSigner = {}): Promise<bigint> {
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }
    return await this.client.blockCost({ ...sendParams, args: [] })
  }

  /**
   * Get the cost to create a new subscription from the contract
   */
  async newSubscriptionCost({ sender, signer, recipient, asset = 0n, serviceId = 0n }: MaybeSigner & { recipient: string, asset?: bigint | number, serviceId?: bigint | number }): Promise<bigint> {
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }
    return (await this.client.newSubscriptionCost({ ...sendParams, args: { recipient, asset, serviceId } }))
  }

  async isBlocked({ sender, signer, address, blocked }: MaybeSigner & { address: string, blocked: string }): Promise<boolean> {
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }
    return (await this.client.isBlocked({ ...sendParams, args: { address, blocked } }))
  }

  async isShutdown({ sender, signer, address, id }: MaybeSigner & { address: string, id: bigint | number }): Promise<boolean> {
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }
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
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }
    const result = (await this.client.getService({ ...sendParams, args: { address, id } }))

    return {
      ...result,
      highlightColor: bytesToHexColor(result.highlightColor)
    }
  }

  async getServicesByAddress({ sender, signer, address, start = 0n, windowSize = 20n }: MaybeSigner & { address: string, start?: bigint | number, windowSize?: bigint | number }): Promise<Service[]> {
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }
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
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }
    const result = (await this.client.getSubscription({ ...sendParams, args: { key: { address, id } } }))
    return {
      ...result,
      lastPayment: convertToUnixTimestamp(result.lastPayment)
    }
  }

  async getSubscriptionWithDetails({ sender, signer, address, id }: MaybeSigner & { address: string, id: bigint }): Promise<SubscriptionInfoWithDetails> {
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }
    const result = (await this.client.getSubscriptionWithDetails({ ...sendParams, args: { key: { address, id } } }))
    return {
      ...result,
      highlightColor: bytesToHexColor(result.highlightColor),
      lastPayment: convertToUnixTimestamp(result.lastPayment),
    }
  }

  async isFirstSubscription({ sender, signer, address }: MaybeSigner & { address: string }): Promise<boolean> {
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }
    return (await this.client.isFirstSubscription({ ...sendParams, args: { address } }))
  }

  async newService({ sender, signer, asset = 0n, passes = 0n, gateId = 0n, ...rest }: NewServiceArgs): Promise<bigint> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

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

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    await this.client.send.pauseService({
      ...sendParams,
      args: { id }
    })
  }

  async shutdownService({ sender, signer, id }: MaybeSigner & ContractArgs['shutdownService(uint64)void']): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    await this.client.send.shutdownService({
      ...sendParams,
      args: { id }
    })
  }

  async block({ sender, signer, block }: MaybeSigner & { block: string }): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    const paymentAmount = await this.blockCost({ sender, signer });

    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(paymentAmount),
      receiver: this.client.appAddress,
    })

    await this.client.send.block({
      ...sendParams,
      args: {
        payment,
        blocked: block
      }
    })
  }

  async unblock({ sender, signer, blocked }: MaybeSigner & ContractArgs['unblock(address)void']): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    await this.client.send.unblock({
      ...sendParams,
      args: { blocked }
    })
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

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    const isAlgoSubscription = asset === 0n;
    const isGated = gateTxn !== undefined;

    let subscriptionId: bigint | undefined = 0n;

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

    if (isAlgoSubscription) {
      if (isGated) {
        // const group = this.client.newGroup();
        // const composer = await group.composer();
        // composer.addAppCall(gateTxn);

        ({ return: subscriptionId } = await this.client.send.gatedSubscribe({
          ...sendParams,
          args: {
            payment,
            gateTxn,
            amount,
            interval: BigInt(interval),
            recipient,
            serviceId,
          }
        }));
      } else {
        ({ return: subscriptionId } = await this.client.send.subscribe({
          ...sendParams,
          args: {
            payment,
            amount,
            interval: BigInt(interval),
            recipient,
            serviceId,
          }
        }))
      }
    } else {
      const assetTransfer = this.client.algorand.createTransaction.assetTransfer({
        ...sendParams,
        amount: 0n,
        assetId: asset,
        receiver: this.client.appAddress,
      })

      if (isGated) {
        ({ return: subscriptionId } = await this.client.send.gatedSubscribeAsa({
          ...sendParams,
          args: {
            payment,
            gateTxn,
            amount,
            interval: BigInt(interval),
            recipient,
            serviceId,
          }
        }));
      } else {
        ({ return: subscriptionId } = await this.client.send.subscribeAsa({
          ...sendParams,
          args: {
            payment,
            assetXfer: assetTransfer,
            amount,
            interval: BigInt(interval),
            recipient,
            serviceId,
          }
        }))
      }
    }

    if (subscriptionId === undefined) {
      throw new Error('Subscription failed, no subscription ID returned');
    }

    return subscriptionId;
  }

  async unsubscribe({ sender, signer, id }: MaybeSigner & ContractArgs['unsubscribe(uint64)void']): Promise<void> {
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }
    await this.client.send.unsubscribe({ ...sendParams, args: { id: BigInt(id) } })
  }

  async deposit({ sender, signer, asset = 0n, amount, id }: MaybeSigner & { asset?: bigint | number, amount: bigint | number, id: bigint | number }): Promise<void> {
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    if (asset !== 0n) {
      const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
        ...sendParams,
        amount: BigInt(amount),
        assetId: BigInt(asset),
        receiver: this.client.appAddress,
      })

      await this.client.send.depositAsa({
        ...sendParams,
        args: {
          assetXfer,
          id: BigInt(id)
        }
      })
    } else {
      const payment = await this.client.algorand.createTransaction.payment({
        ...sendParams,
        amount: microAlgo(amount),
        receiver: this.client.appAddress,
      })

      await this.client.send.deposit({
        ...sendParams,
        args: {
          payment,
          id: BigInt(id)
        }
      })
    }
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
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    await this.client.send.withdraw({
      ...sendParams,
      args: {
        amount: BigInt(amount),
        id: BigInt(id)
      }
    })
  }

  async triggerPayment({ sender, signer, address, id, gateTxn }: MaybeSigner & { address: string, id: bigint, gateTxn?: AppCallMethodCall }): Promise<void> {
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (gateTxn !== undefined) {
      await this.client.send.gatedTriggerPayment({
        ...sendParams,
        args: {
          gateTxn,
          key: { address, id }
        }
      })
    } else {
      await this.client.send.triggerPayment({
        ...sendParams,
        args: { key: { address, id } }
      })
    }
  }

  async setPasses({ sender, signer, id, passes }: MaybeSigner & { id: bigint | number, passes: string[] }): Promise<void> {
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    await this.client.send.setPasses({
      ...sendParams,
      args: {
        id: BigInt(id),
        addresses: passes
      }
    })
  }
}