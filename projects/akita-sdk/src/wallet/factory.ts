import { AbstractedAccountFactoryArgs, AbstractedAccountFactoryFactory, type AbstractedAccountFactoryClient } from '../generated/AbstractedAccountFactoryClient';
import { NewContractSDKParams, MaybeSigner } from '../types';
import { WalletSDK } from './index';
import { BaseSDK } from '../base';
import { emptySigner } from '../constants';
import { ALGORAND_ZERO_ADDRESS_STRING, Address } from 'algosdk';
import { microAlgo } from '@algorandfoundation/algokit-utils';

export type WalletFactoryContractArgs = AbstractedAccountFactoryArgs["obj"];

export type NewParams = (
  Omit<WalletFactoryContractArgs['newAccount(pay,address,address,string,address)uint64'], 'payment' | 'controlledAddress' | 'admin' | 'referrer'> &
  MaybeSigner &
  Partial<Pick<WalletFactoryContractArgs['newAccount(pay,address,address,string,address)uint64'], 'controlledAddress' | 'admin' | 'referrer'>>
)

export class WalletFactorySDK extends BaseSDK<AbstractedAccountFactoryClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: AbstractedAccountFactoryFactory, ...params });
  }

  async new({
    sender,
    signer,
    controlledAddress = ALGORAND_ZERO_ADDRESS_STRING,
    admin = '',
    nickname,
    referrer = ALGORAND_ZERO_ADDRESS_STRING
  }: NewParams): Promise<WalletSDK> {

    const sendParams = this.getRequiredSendParams({ sender, signer });

    const cost = await this.cost()

    const payment = await this.client.algorand.createTransaction.payment({
      ...sendParams,
      receiver: this.client.appAddress,
      amount: microAlgo(cost),
    })

    if (!admin) {
      admin = sendParams.sender instanceof Address
        ? sendParams.sender.toString()
        : sendParams.sender;
    }

    const group = this.client.newGroup()

    const results = await group
      .newAccount({
        ...sendParams,
        args: {
          payment,
          controlledAddress,
          admin,
          nickname,
          referrer
        },
        maxFee: (5_000).microAlgos()
      })
      .opUp({ args: {}, maxFee: (1_000).microAlgos() })
      .send({ ...sendParams })

    const appId = results.returns[0];

    if (!appId) {
      throw new Error('Failed to create new wallet');
    }

    return new WalletSDK({
      algorand: this.algorand,
      factoryParams: {
        appId,
        defaultSender: sendParams.sender,
        defaultSigner: sendParams.signer
      }
    })
  }

  async get({ appId }: { appId: bigint }): Promise<WalletSDK> {
    return new WalletSDK({
      algorand: this.algorand,
      factoryParams: {
        appId,
        defaultSender: this.sendParams.sender,
        defaultSigner: this.sendParams.signer
      }
    })
  }

  async cost(params?: MaybeSigner): Promise<bigint> {

    const sendParams = this.getSendParams({
      sender: this.readerAccount,
      signer: emptySigner,
      ...params
    });

    const { return: cost } = await this.client.send.cost({
      ...sendParams,
      args: {}
    })

    if (cost === undefined) {
      throw new Error('Failed to get cost for wallet creation');
    }

    return cost;
  }
}

export async function newWallet({
  factoryParams,
  algorand,
  readerAccount,
  sendParams,
  sender,
  signer,
  controlledAddress = ALGORAND_ZERO_ADDRESS_STRING,
  admin = '',
  nickname,
  referrer = ALGORAND_ZERO_ADDRESS_STRING
}: NewContractSDKParams & NewParams): Promise<WalletSDK> {
  const factory = new WalletFactorySDK({ factoryParams, algorand, readerAccount, sendParams });
  const sdk = await factory.new({ sender, signer, controlledAddress, admin, nickname, referrer });
  await sdk.register({ escrow: '' })
  return sdk;
}