import { AbstractAccountBoxMbrData, AbstractedAccountArgs, AbstractedAccountFactory, AbstractedAccountReturns, EscrowInfo, PluginKey, type AbstractedAccountClient } from '../generated/AbstractedAccountClient'
import { AddPluginReturn, MbrParams, PluginInfo, RekeyArgs, UsePluginReturn, WalletAddPluginParams, WalletGlobalState, WalletUsePluginParams } from './types';
import { isPluginSDKReturn, MaybeSigner, NewContractSDKParams, SDKClient } from '../types';
import { BaseSDK } from '../base';
import algosdk, { Address, ALGORAND_ZERO_ADDRESS_STRING } from 'algosdk';

export * from "./types";
export * from './factory';
export * from './plugins';


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

  async init(): Promise<void>;
  async init(args?: MaybeSigner): Promise<void> {

    const { sender, signer } = args || {};

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    console.log('init', this.client.appId, sendParams);

    await this.client.send.init({
      ...sendParams,
      args: {}
    });
  }

  async changeRevocationApp({ sender, signer, newRevocationApp }: MaybeSigner & { newRevocationApp: bigint }): Promise<void> {
    
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    await this.client.send.changeRevocationApp({
      ...sendParams,
      args: { newRevocationApp },
    });
  }

  async setNickname({ sender, signer, nickname }: MaybeSigner & { nickname: string }): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    await this.client.send.setNickname({
      ...sendParams,
      args: { nickname }
    });
  }

  async setAvatar({ sender, signer, avatar }: MaybeSigner & { avatar: bigint }): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    await this.client.send.setAvatar({
      ...sendParams,
      args: { avatar }
    });
  }

  async setBanner({ sender, signer, banner }: MaybeSigner & { banner: bigint }): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    await this.client.send.setBanner({
      ...sendParams,
      args: { banner }
    });
  }

  async setBio({ sender, signer, bio }: MaybeSigner & { bio: string }): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    await this.client.send.setBio({
      ...sendParams,
      args: { bio }
    });
  }

  async changeAdmin({ sender, signer, newAdmin }: MaybeSigner & { newAdmin: string }): Promise<void> {
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    await this.client.send.arc58ChangeAdmin({
      ...sendParams,
      args: { newAdmin }
    });
  }

  async verifyAuthAddress({ sender, signer }: MaybeSigner): Promise<void> {
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    await this.client.send.arc58VerifyAuthAddress({
      ...sendParams,
      args: {}
    });
  }

  async rekeyTo(rekeyToArgs: MaybeSigner & ContractArgs['arc58_rekeyTo(address,bool)void']): Promise<void> {

    const {
      sender,
      signer,
      ...args
    } = rekeyToArgs;

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    await this.client.send.arc58RekeyTo({ ...sendParams, args });
  }

  async canCall(canCallArgs: MaybeSigner & ContractArgs['arc58_canCall(uint64,bool,address,string,byte[4])bool']): Promise<boolean> {
    
    const {
      sender,
      signer,
      ...args
    } = canCallArgs;
    
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    return await this.client.send.arc58CanCall({ ...sendParams, args }) as unknown as boolean;
  }

  async usePlugin({
    sender,
    signer,
    name = '',
    global,
    escrow = '',
    fundsRequest = [],
    calls
  }: WalletUsePluginParams): Promise<UsePluginReturn> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    // Get the plugin app ID from the SDK client
    const plugin = calls[0]().appId;

    // call the functions provided by the plugin SDK to
    // inject our wallet ID and get back the transactions
    let txns: algosdk.Transaction[] = []
    for (const call of calls) {
      if (call().appId !== plugin) {
        throw new Error(`All calls must be to the same plugin app ID: ${plugin}, but got ${call().appId}`);
      }

      txns.push(...(await call().getTxns({ walletId: this.client.appId })))
    }

    let caller = ''
    if (global) {
      caller = ALGORAND_ZERO_ADDRESS_STRING
    } else if (sendParams.sender !== undefined) {
      caller = sendParams.sender instanceof Address
        ? sendParams.sender.toString()
        : sendParams.sender;
    } else {
      throw new Error('Sender must be provided for non-global plugin calls');
    }

    // calculate method offsets
    const methods = (await this.getPluginByKey({ plugin, caller, escrow })).methods
    const methodOffsets: number[] = []
    const methodSignatures = new Map<Uint8Array, number>();
    if (methods.length > 0) {
      for (let i = 0; i < methods.length; i++) {
        methodSignatures.set(methods[i].name, i);
      }

      for (const txn of txns) {
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

    const rekeyArgs: RekeyArgs = {
      global,
      escrow,
      methodOffsets,
      fundsRequest: fundsRequest?.map(({ asset, amount }) => ([asset, amount]))
    }

    const group = this.client.newGroup()

    if (name) {
      group.arc58RekeyToNamedPlugin({
        ...sendParams,
        args: {
          name,
          ...rekeyArgs
        }
      });
    } else {
      group.arc58RekeyToPlugin({
        ...sendParams,
        args: {
          plugin,
          ...rekeyArgs
        }
      });
    }

    for (const txn of txns) {
      console.log('TXN: ', txn)
      group.addTransaction(txn)
    }

    group.arc58VerifyAuthAddress({ ...sendParams, args: {} })

    return await group.send({ ...sendParams });
  }

  async addPlugin<TClient extends SDKClient>({
    sender,
    signer,
    name = '',
    client,
    caller,
    global = false,
    methods = [],
    escrow = '',
    admin = false,
    delegationType = 0n,
    lastValid = 0n,
    cooldown = 0n,
    useRounds = false,
    useExecutionKey = false,
    defaultToEscrow = false,
  }: WalletAddPluginParams<TClient>): Promise<AddPluginReturn> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    // Get the plugin app ID from the SDK client
    const plugin = client.appId;

    if (global) {
      caller = ALGORAND_ZERO_ADDRESS_STRING
    }

    let transformedMethods: [Uint8Array<ArrayBufferLike>, number | bigint][] = [];
    if (methods.length > 0) {
      transformedMethods = methods.map((method) => {
        const selector = isPluginSDKReturn(method.name)
          ? method.name().selector
          : method.name;

        return [selector, method.cooldown];
      });
    }

    if (name !== '') {
      return await this.client.send.arc58AddNamedPlugin({
        ...sendParams,
        args: {
          name,
          plugin,
          caller: caller!,
          escrow,
          admin,
          delegationType,
          lastValid,
          cooldown,
          methods: transformedMethods,
          useRounds,
          useExecutionKey,
          defaultToEscrow
        }
      });
    }

    // Call the contract method with properly typed parameters
    return await this.client.send.arc58AddPlugin({
      ...sendParams,
      args: {
        plugin,
        caller: caller!,
        escrow,
        admin,
        delegationType,
        lastValid,
        cooldown,
        methods: transformedMethods,
        useRounds,
        useExecutionKey,
        defaultToEscrow
      }
    });
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
    return (await this.client.send.arc58GetEscrow({ args: { name } })).return as unknown as EscrowInfo;
  }

  async getMbr(args: MbrParams): Promise<AbstractAccountBoxMbrData> {
    return (await this.client.send.mbr({ args })).return as unknown as AbstractAccountBoxMbrData;
  }

  async balance(assets: bigint[]): Promise<bigint[]> {
    return (await this.client.send.balance({ args: { assets } })).return as unknown as bigint[];
  }
}