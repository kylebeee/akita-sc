import { AbstractedAccountFactoryArgs, AbstractedAccountFactoryFactory, type AbstractedAccountFactoryClient } from '../generated/AbstractedAccountFactoryClient';
import { NewContractSDKParams, WithSigner } from '../types';
import { WalletSDK } from './index';
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
import { BaseSDK } from '../base';
import { emptySigner, SIMULATE_PARAMS } from '../constants';

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

    const amount = this.localCost();

    const payment = await this.client.algorand.createTransaction.payment({
      sender,
      signer,
      receiver: this.client.appAddress,
      amount,
    })

    const { return: appId } = await this.client.send.new({
      args: {
        payment,
        controlledAddress: controlledAddress!,
        admin: admin!,
        nickname
      },
    })

    if (!appId) {
      throw new Error('Failed to create new wallet');
    }

    return new WalletSDK({ algorand: this.algorand, factoryParams: { appId } })
  }

  async get(appId: bigint): Promise<WalletSDK> {
    return new WalletSDK({ algorand: this.algorand, factoryParams: { appId } })
  }

  localCost(): AlgoAmount {
    return new AlgoAmount({
      microAlgo: (
        300_000 + // max pages
        (28_500 * 10) + // global uints
        (50_000 * 54) + // global bytes
        100_000 + // min account balance
        12_100 // registry box entry
      )
    })
  }

  async cost(): Promise<AlgoAmount> {
    // return new AlgoAmount({ microAlgos: await this.client.send.cost({ args: {}, sender: this.readerAccount, signer: emptySigner }) as unknown as bigint })
    const {
      returns: [retVal],
    } = await this.client
      .newGroup()
      .cost({ args: {}, sender: this.readerAccount, signer: emptySigner })
      .simulate(SIMULATE_PARAMS);
    return new AlgoAmount({ microAlgos: retVal ?? 0n });
  }
}

export async function newWallet({
  factoryParams,
  algorand,
  readerAccount,
  sendParams,
  sender,
  signer,
  controlledAddress = '',
  admin = '',
  nickname,
}: NewContractSDKParams & NewParams): Promise<WalletSDK> {
  const factory = new WalletFactorySDK({ factoryParams, algorand, readerAccount, sendParams });
  return await factory.new({ sender, signer, controlledAddress, admin, nickname });
}