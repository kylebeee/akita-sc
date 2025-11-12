import { microAlgo } from "@algorandfoundation/algokit-utils";
import { BaseSDK } from "../base";
import { Service, ServicesKey, SubscriptionInfo, SubscriptionsArgs, SubscriptionsClient, SubscriptionsFactory } from '../generated/SubscriptionsClient'
import { hasSenderSigner, MaybeSigner, NewContractSDKParams } from "../types";
import { ValueMap } from "../wallet/utils";
import { SubscribeParams } from "./types";
import { Transaction } from "algosdk";
import { AppCallMethodCall } from "@algorandfoundation/algokit-utils/types/composer";

type ContractArgs = SubscriptionsArgs["obj"];

export class SubscriptionsSDK extends BaseSDK<SubscriptionsClient> {

  private serviceMapKeyGenerator = ({ address, id }: ServicesKey) => (`${address}${id}`)
  public services: ValueMap<ServicesKey, Service> = new ValueMap(this.serviceMapKeyGenerator);

  constructor(params: NewContractSDKParams) {
    super({ factory: SubscriptionsFactory, ...params });
  }

  async isBlocked({ address, blocked }: { address: string, blocked: string }): Promise<boolean> {
    return (await this.client.send.isBlocked({ args: { address, blocked } })).return!
  }

  async isShutdown({ address, id }: { address: string, id: bigint | number }): Promise<boolean> {
    return (await this.client.send.isShutdown({ args: { address, id } })).return!
  }

  async getServices(): Promise<ValueMap<ServicesKey, Service>> {
    this.services = new ValueMap(
      this.serviceMapKeyGenerator,
      await this.client.state.box.services.getMap()
    );
    return this.services
  }

  async getService({ address, id }: { address: string, id: number }): Promise<Service> {
    return (await this.client.send.getService({ args: { address, id } })).return!
  }

  async getServicesByAddress({ address, start = 0n, windowSize = 20n }: { address: string, start?: bigint | number, windowSize?: bigint | number }): Promise<Service[]> {
    return (await this.client.send.getServicesByAddress({ args: { address, start, windowSize } })).return! as unknown as Service[]
  }

  async getSubscription({ address, id }: { address: string, id: number }): Promise<SubscriptionInfo> {
    return (await this.client.send.getSubscription({ args: { address, id } })).return!
  }

  async getSubscriptionWithPasses({ address, id }: { address: string, id: number }): Promise<SubscriptionInfo> {
    return (await this.client.send.getSubscriptionWithPasses({ args: { address, id } })).return!
  }

  async isFirstSubscription({ address }: { address: string }): Promise<boolean> {
    return (await this.client.send.isFirstSubscription({ args: { address } })).return!
  }

  async newService({ sender, signer, asset = 0n, passes = 0n, gateId = 0n, ...rest }: MaybeSigner & Omit<ContractArgs['newService(pay,uint64,uint64,uint64,uint64,uint64,byte[36])uint64'], 'payment'>): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(0), // TODO: calc costs
      receiver: this.client.appAddress,
    })

    await this.client.send.newService({
      ...sendParams,
      args: {
        payment,
        asset,
        passes,
        gateId,
        ...rest
      }
    });
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

  async activateService({ sender, signer, id }: MaybeSigner & ContractArgs['activateService(uint64)void']): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    await this.client.send.activateService({
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

    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(0), // TODO: calc costs
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
  }: MaybeSigner & SubscribeParams): Promise<bigint> {

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

    const payment = await this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: isAlgoSubscription ? microAlgo(0) : microAlgo(0n + BigInt(initialDepositAmount)), // TODO: calc costs
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

  async triggerPayment({ sender, signer, address, id, gateTxn }: MaybeSigner & { address: string, id: bigint | number, gateTxn?: AppCallMethodCall }): Promise<void> {
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (gateTxn !== undefined) {
      await this.client.send.gatedTriggerPayment({
        ...sendParams,
        args: {
          address,
          id: BigInt(id),
          gateTxn
        }
      })
    } else {
      await this.client.send.triggerPayment({
        ...sendParams,
        args: {
          address,
          id: BigInt(id)
        }
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