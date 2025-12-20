import { microAlgo } from "@algorandfoundation/algokit-utils";
import { microAlgos } from "@algorandfoundation/algokit-utils";
import { isValidAddress } from "algosdk";
import { BaseSDK } from "../base";
import { ENV_VAR_NAMES } from "../config";
import { ServiceFromTuple, ServicesKey, SubscriptionInfo, SubscriptionsArgs, SubscriptionsClient, SubscriptionsFactory } from '../generated/SubscriptionsClient'
import { MaybeSigner, NewContractSDKParams } from "../types";
import { ValueMap } from "../wallet/utils";
import { NewServiceArgs, Service, SubscribeArgs, SubscriptionInfoWithDetails } from "./types";
import { AppCallMethodCall } from "@algorandfoundation/algokit-utils/types/composer";
import { bytesToHexColor, hexColorToBytes, validateHexColor } from "./utils";
import { convertToUnixTimestamp } from "../utils";
import { MAX_DESCRIPTION_CHUNK_SIZE, MAX_DESCRIPTION_LENGTH } from "./constants";

// Re-export key types from generated client
export { ServicesKey } from '../generated/SubscriptionsClient';

type ContractArgs = SubscriptionsArgs["obj"];

export * from './constants';
export * from './types';
export * from './utils';

export class SubscriptionsSDK extends BaseSDK<SubscriptionsClient> {

  private serviceMapKeyGenerator = ({ address, id }: ServicesKey) => (`${address}${id}`)
  public services: ValueMap<ServicesKey, Service> = new ValueMap(this.serviceMapKeyGenerator);

  constructor(params: NewContractSDKParams) {
    super({ factory: SubscriptionsFactory, ...params }, ENV_VAR_NAMES.SUBSCRIPTIONS_APP_ID);
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

  /**
   * Get the cost to opt the contract into an asset
   */
  async optInCost({ sender, signer, asset }: MaybeSigner & { asset: bigint | number }): Promise<bigint> {
    const sendParams = this.getSendParams({ sender, signer });
    return (await this.client.optInCost({ ...sendParams, args: { asset } }))
  }

  /**
   * Check if the contract is opted into a specific asset
   */
  async isOptedInToAsset(asset: bigint | number): Promise<boolean> {
    try {
      const appAddress = this.client.appAddress.toString();
      const assetId = BigInt(asset);

      // Use the algod endpoint /v2/accounts/{address}/assets/{asset-id}
      const algod = this.client.algorand.client.algod;
      // If the asset-holding exists, we're opted in. If it 404s, we're not.
      const response = await algod.accountAssetInformation(appAddress, assetId).do();
      return !!response.assetHolding;
    } catch (error: any) {
      // If not opted in, algod returns 404 for this endpoint
      if (error?.response?.status === 404) {
        return false;
      }
      console.warn('[SubscriptionsSDK] Error checking asset opt-in:', error);
      return false;
    }
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

  async getSubscriptionList({ sender, signer, address }: MaybeSigner & { address: string }): Promise<bigint> {
    const sendParams = this.getSendParams({ sender, signer });
    return (await this.client.getSubscriptionList({ ...sendParams, args: { address } }))
  }

  async getServiceList({ sender, signer, address }: MaybeSigner & { address: string }): Promise<bigint> {
    const sendParams = this.getSendParams({ sender, signer });
    return (await this.client.getServiceList({ ...sendParams, args: { address } }))
  }

  async newService({ sender, signer, asset = 0n, passes = 0n, gateId = 0n, ...rest }: NewServiceArgs): Promise<bigint> {

    const sendParams = this.getRequiredSendParams({ sender, signer });

    validateHexColor(rest.highlightColor);
    const highlightColor = hexColorToBytes(rest.highlightColor);
    
    // Check if we need to opt the contract into the asset (ASA services only)
    const isAsaService = asset !== 0n;
    let needsOptIn = false;
    let optInCost = 0n;
    if (isAsaService) {
      needsOptIn = !(await this.isOptedInToAsset(asset));
      if (needsOptIn) {
        optInCost = await this.optInCost({ ...sendParams, asset });
      }
    }
    
    // Use contract method to get the exact cost
    const paymentAmount = await this.newServiceCost({ ...sendParams, asset });

    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(paymentAmount),
      receiver: this.client.appAddress.toString(),
    })

    if (rest.description.length === 0) {
      throw new Error('Description cannot be empty');
    }

    const group = this.client.newGroup();

    // If contract needs to opt into the asset, add the opt-in call first
    if (needsOptIn) {
      const optInPayment = await this.client.algorand.createTransaction.payment({
        ...sendParams,
        amount: microAlgo(optInCost),
        receiver: this.client.appAddress.toString(),
      });
      
      group.optIn({
        ...sendParams,
        args: {
          payment: optInPayment,
          asset: BigInt(asset),
        }
      });
    }

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
    // If we added an opt-in call, the service ID will be at index 1, otherwise index 0
    const returnIndex = needsOptIn ? 1 : 0;
    return result.returns[returnIndex] as bigint;
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
      receiver: this.client.appAddress.toString(),
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

    // Check if we need to opt the contract into the asset (ASA subscriptions only)
    const needsOptIn = !(await this.isOptedInToAsset(asset));

    // Use contract method to get the exact subscription cost
    const subscribeCost = await this.newSubscriptionCost({
      ...sendParams,
      recipient,
      asset,
      serviceId
    });

    // For algo subscriptions, payment includes the subscription amount
    // For ASA subscriptions, payment only covers MBR
    // If we need to opt in, add the opt-in cost to the payment
    const paymentAmount = isAlgoSubscription
      ? BigInt(amount) + subscribeCost + BigInt(initialDepositAmount)
      : subscribeCost

    const payment = await this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(paymentAmount),
      receiver: this.client.appAddress.toString(), // Convert Address to string to avoid instanceof issues
    })

    const group = this.client.newGroup();

    // If contract needs to opt into the asset, add the opt-in call first
    if (needsOptIn) {
      const optInCost = await this.optInCost({ ...sendParams, asset });
      const optInPayment = await this.client.algorand.createTransaction.payment({
        ...sendParams,
        amount: microAlgo(optInCost),
        receiver: this.client.appAddress.toString(),
      });
      
      group.optIn({
        ...sendParams,
        args: {
          payment: optInPayment,
          asset: BigInt(asset),
        }
      });
    }

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
        amount: BigInt(amount) + BigInt(initialDepositAmount),
        assetId: asset,
        receiver: this.client.appAddress.toString(),
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

    console.log('group built:', (await (await group.composer()).build()).transactions)
  

    const result = await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
    // If we added an opt-in call, the subscription ID will be at index 1, otherwise index 0
    const returnIndex = needsOptIn ? 1 : 0;
    const subscriptionId = result.returns[returnIndex] as bigint | undefined;

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
        receiver: this.client.appAddress.toString(),
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
        receiver: this.client.appAddress.toString(),
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