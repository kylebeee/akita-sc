import { AlgorandClient } from '@algorandfoundation/algokit-utils/types/algorand-client';
import { AbstractedAccountFactoryArgs, AbstractedAccountFactoryFactory, type AbstractedAccountFactoryClient } from '../generated/AbstractedAccountFactoryClient';
import { NewContractSDKParams, WithSigner } from '../types';
import { WalletSDK } from './index';
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
import { BaseSDK } from '../base';

export type FactoryContractArgs = AbstractedAccountFactoryArgs["obj"];

export type NewParams = (
  Omit<FactoryContractArgs['new(pay,address,address,string)uint64'], 'payment' | 'controlledAddress' | 'admin'> & 
  WithSigner & 
  Partial<Pick<FactoryContractArgs['new(pay,address,address,string)uint64'], 'controlledAddress' | 'admin'>>
)

export class WalletFactorySDK extends BaseSDK<AbstractedAccountFactoryClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: AbstractedAccountFactoryFactory, ...params });
  }

  async new({
    sender,
    signer,
    controlledAddress,
    admin,
    nickname,
  }: NewParams): Promise<WalletSDK> {

    if (!admin) {
      admin = sender;
    }

    const payment = await this.client.algorand.createTransaction.payment({
      sender,
      signer,
      receiver: this.client.appAddress,
      amount: await this.cost(),
    })

    const { return: appId } = await this.client.send.new({ 
      args: { 
        payment, 
        controlledAddress: controlledAddress!, 
        admin: admin!, 
        nickname 
      }, 
      sender, 
      signer 
    })

    if (!appId) {
      throw new Error('Failed to create new wallet');
    }

    return new WalletSDK({ algorand: this.algorand, appId })
  }

  async get(appId: bigint): Promise<WalletSDK> {
    return new WalletSDK({ algorand: this.algorand, appId })
  }

  async cost(): Promise<AlgoAmount> {
    return new AlgoAmount({ microAlgos: await this.client.send.costNew() as unknown as bigint })
  }
}

export async function newWallet({
  factoryId,
  algorand,
  sender,
  signer,
  controlledAddress = '',
  admin = '',
  nickname,
}: { factoryId: bigint, algorand: AlgorandClient; } & NewParams): Promise<WalletSDK> {
  const factory = new WalletFactorySDK({ appId: factoryId, algorand });
  return await factory.new({ sender, signer, controlledAddress, admin, nickname });
}