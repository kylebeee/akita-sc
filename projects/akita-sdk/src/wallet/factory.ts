import { AbstractedAccountFactoryArgs, AbstractedAccountFactoryFactory, type AbstractedAccountFactoryClient } from '../generated/AbstractedAccountFactoryClient';
import { NewContractSDKParams, MaybeSigner, hasSenderSigner } from '../types';
import { WalletSDK } from './index';
import { BaseSDK } from '../base';
import { emptySigner } from '../constants';
import { ALGORAND_ZERO_ADDRESS_STRING, Address } from 'algosdk';
import { microAlgo } from '@algorandfoundation/algokit-utils';

export type FactoryContractArgs = AbstractedAccountFactoryArgs["obj"];

export type NewParams = (
  Omit<FactoryContractArgs['new(pay,address,address,string,address)uint64'], 'payment' | 'controlledAddress' | 'admin' | 'referrer'> &
  MaybeSigner &
  Partial<Pick<FactoryContractArgs['new(pay,address,address,string,address)uint64'], 'controlledAddress' | 'admin' | 'referrer'>>
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

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

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

    const { return: appId } = await this.client.send.new({
      ...sendParams,
      args: {
        payment,
        controlledAddress,
        admin,
        nickname,
        referrer
      }
    })

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

    const defaultParams = {
      ...this.sendParams,
      sender: this.readerAccount,
      signer: emptySigner
    }

    const { sender, signer } = params || {};
    const sendParams = {
      ...defaultParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

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
  controlledAddress = '',
  admin = '',
  nickname,
}: NewContractSDKParams & NewParams): Promise<WalletSDK> {
  const factory = new WalletFactorySDK({ factoryParams, algorand, readerAccount, sendParams });
  const sdk = await factory.new({ sender, signer, controlledAddress, admin, nickname });
  await sdk.register({ escrow: '' })
  return sdk;
}