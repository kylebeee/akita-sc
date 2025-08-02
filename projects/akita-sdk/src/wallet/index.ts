import { AbstractAccountBoxMbrData, AbstractedAccountArgs, AbstractedAccountFactory, EscrowInfo, PluginKey, type AbstractedAccountClient } from '../generated/AbstractedAccountClient'
import { MbrParams, PluginInfo, RekeyArgs, WalletAddPluginParams, WalletGlobalState, WalletPluginParams } from './types';
import { NewContractSDKParams, WithSigner } from '../types';
import { BaseSDK } from '../base';
import algosdk from 'algosdk';
import { ABIReturn } from '@algorandfoundation/algokit-utils/types/app';

export * from "./types";
export * from './factory';
export * from './optin';

type ContractArgs = AbstractedAccountArgs["obj"];

// things i want to include in the SDK
// - [ ] wallet creation
// - [ ] passkey signer creation
// - [ ] plugin installs & management
// - [ ] escrow creation & management

export class WalletSDK extends BaseSDK<AbstractedAccountClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: AbstractedAccountFactory, ...params });
  }

  async init(): Promise<void> {
    await this.client.send.init({ args: {}, ...this.sendParams });
  }

  async changeRevocationApp(newRevocationApp: bigint): Promise<void> {
    await this.client.send.changeRevocationApp({ args: { newRevocationApp }, ...this.sendParams });
  }

  async setNickname(nickname: string): Promise<void> {
    await this.client.send.setNickname({ args: { nickname }, ...this.sendParams });
  }

  async setAvatar(avatar: bigint): Promise<void> {
    await this.client.send.setAvatar({ args: { avatar }, ...this.sendParams });
  }

  async setBanner(banner: bigint): Promise<void> {
    await this.client.send.setBanner({ args: { banner }, ...this.sendParams });
  }

  async setBio(bio: string): Promise<void> {
    await this.client.send.setBio({ args: { bio }, ...this.sendParams });
  }

  async changeAdmin(newAdmin: string): Promise<void> {
    await this.client.send.arc58ChangeAdmin({ args: { newAdmin }, ...this.sendParams });
  }

  async verifyAuthAddress(): Promise<void> {
    await this.client.send.arc58VerifyAuthAddress({ args: {}, ...this.sendParams });
  }

  async rekeyTo(args: ContractArgs['arc58_rekeyTo(address,bool)void']): Promise<void> {
    await this.client.send.arc58RekeyTo({ args, ...this.sendParams });
  }

  async canCall(args: ContractArgs['arc58_canCall(uint64,bool,address,string,byte[4])bool']): Promise<boolean> {
    return await this.client.send.arc58CanCall({ args, ...this.sendParams }) as unknown as boolean;
  }

  async usePlugin<T>({
    sender,
    signer,
    name = '',
    global,
    escrow,
    fundsRequest = [],
    client,
    txns
  }: WalletPluginParams<T>): Promise<{
    groupId: string;
    txIds: string[];
    returns: ABIReturn[] & [];
    confirmations: algosdk.modelsv2.PendingTransactionResponse[];
    transactions: algosdk.Transaction[];
  }> {

    // @ts-ignore , TODO: type this properly
    const plugin = client.appId

    // calculate method offsets
    const methods = (await this.getPluginByKey({ plugin, caller: sender, escrow })).methods
    const methodOffsets: number[] = []
    const methodSignatures = new Map<Uint8Array, number>();
    if (methods.length > 0) {
      for (let i = 0; i < methods.length; i++) {
        methodSignatures.set(methods[i].name, i);
      }

      for (const innerTxns of txns) {
        for (const txn of innerTxns) {
          if (
            txn.applicationCall?.appIndex === plugin &&
            methods.length > 0
          ) {
            const sig = txn.applicationCall?.appArgs[0]
            if (sig && methodSignatures.has(sig)) {
              methodOffsets.push(methodSignatures.get(sig)!)
            }
          }
        }
      }
    }

    const rekeyArgs: RekeyArgs = {
      global,
      escrow,
      methodOffsets,
      fundsRequest: fundsRequest?.map(({ asset, amount }) => ([asset, amount]))
    }

    const group = this.client.newGroup()

    if (name) {
      group.arc58RekeyToNamedPlugin({ args: { name, ...rekeyArgs } })
    } else {
      group.arc58RekeyToPlugin({ args: { plugin, ...rekeyArgs } })
    }

    for (const innerTxns of txns) {
      for (const txn of innerTxns) {
        group.addTransaction(txn)
      }
    }

    group.arc58VerifyAuthAddress({ args: {}, sender, signer })

    const comp = await group.composer()
    comp

    return await group.send({ ...this.sendParams });
  }

  async addPlugin<T>({
    sender,
    signer,
    name = '',
    escrow,
    client,
  }: WalletAddPluginParams<T>): Promise<any> {
    
  }

  async getGlobalState(): Promise<WalletGlobalState> {
    return await this.client.state.global.getAll() as unknown as WalletGlobalState;
  }

  async getAdmin(): Promise<string> {
    return (await this.client.send.arc58GetAdmin()).return as unknown as string;
  }

  async getPlugins(): Promise<Map<PluginKey, PluginInfo>> {
    return new Map(Array.from(
      await this.client.state.box.plugins.getMap(),
      ([key, info]) => {
        return [key, {
          ...info,
          methods: info.methods.map((method) => ({
            name: method[0],
            cooldown: method[1],
            lastCalled: method[2]
          }))
        }];
      }
    ));
  }

  async getPluginByKey(key: PluginKey): Promise<PluginInfo> {
    const info = (await this.client.state.box.plugins.value(key))!
    const methods = info.methods.map((method) => ({
      name: method[0],
      cooldown: method[1],
      lastCalled: method[2]
    }));

    return { ...info, methods };
  }

  async getPluginByName(name: string): Promise<PluginInfo> {
    const info = (await this.client.send.arc58GetPlugin({ args: { name } })).return!;
    const methods = info.methods.map((method) => ({
      name: method[0],
      cooldown: method[1],
      lastCalled: method[2]
    }));
    return { ...info, methods };
  }

  async getEscrows(): Promise<Map<bigint, boolean>> {
    return new Map(Array.from(
      await this.client.state.box.escrows.getMap(),
      ([escrowID, locked]) => ([escrowID, locked ? true : false])
    ));
  }

  async getEscrow(name: string): Promise<EscrowInfo> {
    return await this.client.send.arc58GetEscrow({ args: { name } }) as unknown as EscrowInfo;
  }

  async getMbr(args: MbrParams): Promise<any> {
    return await this.client.send.mbr({ args }) as unknown as AbstractAccountBoxMbrData;
  }

  async balance(assets: bigint[]): Promise<bigint[]> {
    return await this.client.send.balance({ args: { assets } }) as unknown as bigint[];
  }
}