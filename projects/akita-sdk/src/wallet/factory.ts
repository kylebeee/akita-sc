import { AbstractedAccountFactoryArgs, AbstractedAccountFactoryFactory, type AbstractedAccountFactoryClient } from '../generated/AbstractedAccountFactoryClient';
import { NewContractSDKParams, MaybeSigner, hasSenderSigner } from '../types';
import { WalletSDK } from './index';
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
import { BaseSDK } from '../base';
import { emptySigner } from '../constants';
import { ALGORAND_ZERO_ADDRESS_STRING, Address } from 'algosdk';

export type FactoryContractArgs = AbstractedAccountFactoryArgs["obj"];

export type NewParams = (
  Omit<FactoryContractArgs['new(pay,address,address,string)uint64'], 'payment' | 'controlledAddress' | 'admin'> &
  MaybeSigner &
  Partial<Pick<FactoryContractArgs['new(pay,address,address,string)uint64'], 'controlledAddress' | 'admin'>>
)

export class WalletFactorySDK extends BaseSDK<AbstractedAccountFactoryClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: AbstractedAccountFactoryFactory, ...params });
  }

  async new({
    sender,
    signer,
    controlledAddress = '',
    admin = '',
    nickname,
  }: NewParams): Promise<WalletSDK> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    const payment = await this.client.algorand.createTransaction.payment({
      ...sendParams,
      receiver: this.client.appAddress,
      amount: await this.cost(),
    })

    if (!admin) {
      admin = sendParams.sender instanceof Address
        ? sendParams.sender.toString()
        : sendParams.sender;
    }

    if (!controlledAddress) {
      controlledAddress = ALGORAND_ZERO_ADDRESS_STRING;
    }

    const { return: appId } = await this.client.send.new({
      ...sendParams,
      args: {
        payment,
        controlledAddress: controlledAddress!,
        admin: admin!,
        nickname
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

  async get(appId: bigint): Promise<WalletSDK> {
    return new WalletSDK({
      algorand: this.algorand,
      factoryParams: {
        appId,
        defaultSender: this.sendParams.sender,
        defaultSigner: this.sendParams.signer
      }
    })
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
    const { return: result } = await this.client.send.cost({ args: {}, sender: this.readerAccount, signer: emptySigner })
    return new AlgoAmount({ microAlgos: result ?? 0n });
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
  await sdk.init()
  return sdk;
}