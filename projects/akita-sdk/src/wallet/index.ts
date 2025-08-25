import { AbstractAccountBoxMbrData, AbstractedAccountArgs, AbstractedAccountFactory, AllowanceInfo as SubAllowanceInfo, AllowanceKey, EscrowInfo, PluginKey, type AbstractedAccountClient, ExecutionInfo, AbstractedAccountComposer, PluginInfoFromTuple, EscrowInfoFromTuple } from '../generated/AbstractedAccountClient'
import { AddAllowanceArgs, AddPluginArgs, AllowanceInfo, BuildWalletUsePluginParams, CanCallParams, ExecutionBuildGroup, MbrParams, MethodOffset, PluginInfo, RekeyArgs, WalletAddPluginParams, WalletGlobalState, WalletUsePluginParams } from './types';
import { isPluginSDKReturn, MaybeSigner, NewContractSDKParams, SDKClient, GroupReturn, TxnReturn } from '../types';
import { BaseSDK } from '../base';
import algosdk, { Address, ALGORAND_ZERO_ADDRESS_STRING, makeEmptyTransactionSigner } from 'algosdk';
import { MAX_UINT64 } from '../constants';
import { AllowanceInfoTranslate, AllowancesToTuple, domainBoxKey, executionBoxKey, forceProperties, ValueMap } from './utils';
import { NewEscrowFeeAmount } from './constants';
import { algo, encodeLease, microAlgo, prepareGroupForSending } from '@algorandfoundation/algokit-utils';
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
import { BoxIdentifier, BoxReference } from '@algorandfoundation/algokit-utils/types/app-manager';
import { Txn } from '@algorandfoundation/algokit-utils/types/composer';

export * from './constants';
export * from './factory';
export * from './plugins';
export * from "./types";

type ContractArgs = AbstractedAccountArgs["obj"];

// things i want to include in the SDK
// - [x] wallet creation
// - [ ] passkey signer creation
// - [x] plugin installs & management
// - [x] escrow creation & management

export class WalletSDK extends BaseSDK<AbstractedAccountClient> {

  private pluginMapKeyGenerator = ({ plugin, caller = ALGORAND_ZERO_ADDRESS_STRING, escrow = '' }: Partial<Omit<PluginKey, 'plugin'>> & { plugin: bigint }) => (`${plugin}${caller}${escrow}`)
  public plugins: ValueMap<PluginKey, PluginInfo> = new ValueMap(this.pluginMapKeyGenerator);
  public namedPlugins: Map<string, PluginKey> = new Map();

  public escrows: Map<string, EscrowInfo> = new Map();

  private allowanceMapKeyGenerator = ({ asset, escrow }: AllowanceKey) => (`${asset}${escrow}`);
  public allowances: ValueMap<AllowanceKey, AllowanceInfo> = new ValueMap(this.allowanceMapKeyGenerator);

  public executions: Map<Uint8Array, ExecutionInfo> = new Map();

  constructor(params: NewContractSDKParams) {
    super({ factory: AbstractedAccountFactory, ...params });
  }

  private async updateCache(key: PluginKey, allowances?: bigint[]): Promise<void> {
    const { escrow } = key;

    const requestList: any[] = [this.getPluginByKey(key)]

    if (escrow !== '' && !this.escrows.has(escrow)) {
      requestList.push(this.getEscrow(escrow))
    } else {
      requestList.push(Promise.resolve());
    }

    const fetchAllFloor = 5
    if (allowances && allowances.length > 0) {
      if (allowances.length > fetchAllFloor) {
        requestList.push(this.getAllowances());
      } else {
        for (const allowance of allowances) {
          requestList.push(this.getAllowance({ asset: allowance, escrow }));
        }
      }
    }

    const settled = await Promise.allSettled(requestList);

    if (settled[0].status === 'fulfilled') {
      this.plugins.set(key, settled[0].value);
    }

    if (escrow !== '' && !this.escrows.has(escrow) && settled[1].status === 'fulfilled') {
      this.escrows.set(escrow, settled[1].value);
    }

    if (allowances && allowances.length > 0 && !(allowances.length > fetchAllFloor)) {
      for (let i = 0; i < allowances.length; i++) {
        const req = settled[i + 2];
        if (req.status === 'fulfilled') {
          this.allowances.set(
            { asset: allowances[i], escrow },
            req.value
          );
        }
      }
    }
  }

  private async prepareUsePlugin({
    sender,
    signer,
    name = '',
    global = false,
    escrow = '',
    fundsRequest = [],
    calls,
    lease = ''
  }: WalletUsePluginParams): Promise<{ plugin: bigint, caller: string, useRounds: boolean, length: number, group: AbstractedAccountComposer<[]> }> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    let spendingAddress = (await this.client.state.global.controlledAddress())!
    if (escrow !== '') {
      let id = 0n
      if (this.escrows.has(escrow)) {
        id = this.escrows.get(escrow)!.id
      } else {
        try {
          id = (await this.getEscrow(escrow)).id
        } catch (error) {
          throw new Error(`Escrow with name ${escrow} does not exist`);
        }
      }
      spendingAddress = algosdk.getApplicationAddress(id).toString();
    }

    // call the functions provided by the plugin SDK to
    // inject our wallet ID and get back the transactions
    let plugin = 0n
    let txns: Txn[] = []
    for (let i = 0; i < calls.length; i++) {
      const call = calls[i];
      const { appId, getTxns } = call(spendingAddress);

      if (i === 0) {
        plugin = appId;
      }

      if (appId !== plugin) {
        throw new Error(`All calls must be to the same plugin app ID: ${plugin}, but got ${appId}`);
      }

      txns.push(await getTxns({ walletId: this.client.appId }))
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
    const methodOffsets: number[] = []
    const key: PluginKey = { plugin, caller, escrow }
    let methods: MethodOffset[] = []
    let useRounds = false;
    let useExecutionKey = false;
    if (this.plugins.has(key)) {
      ({ methods, useRounds, useExecutionKey } = this.plugins.get(key)!);
      const methodSignatures: string[] = []

      if (methods.length > 0) {
        for (let i = 0; i < methods.length; i++) {
          methodSignatures.push(methods[i].name.toString());
        }

        for (const txn of txns) {
          if (txn.type === 'methodCall' && 'appId' in txn && txn.appId === plugin) {
            const selector = txn.method.getSelector()

            if (!methodSignatures.includes(selector.toString())) {
              throw new Error(`Transaction selector does not match any allowed method signatures`);
            }

            methodOffsets.push(methodSignatures.indexOf(selector.toString()));
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

    let boxReferences: (BoxIdentifier | BoxReference)[] = [];

    if (lease !== '') {
      boxReferences.push(executionBoxKey(lease));
    }

    if (useExecutionKey) {
      boxReferences.push(domainBoxKey(sender!))
    }

    const group = this.client.newGroup()

    if (name) {
      group.arc58RekeyToNamedPlugin({
        ...sendParams,
        args: {
          name,
          ...rekeyArgs
        },
        extraFee: microAlgo(1_000n + BigInt(fundsRequest.length * 1_000)),
        boxReferences: boxReferences.length > 0 ? boxReferences : undefined
      });
    } else {
      group.arc58RekeyToPlugin({
        ...sendParams,
        args: {
          plugin,
          ...rekeyArgs
        },
        extraFee: microAlgo(1_000n + BigInt(fundsRequest.length * 1_000)),
        boxReferences: boxReferences.length > 0 ? boxReferences : undefined
      });
    }

    if (!!lease) {
      console.log(`Lease key: ${lease}: ${executionBoxKey(lease).toString()}`);
    }

    const composer = await group.composer()
    for (const txn of txns) {
      switch (txn.type) {
        case 'pay': { composer.addPayment(txn); break; }
        case 'assetCreate': { composer.addAssetCreate(txn); break; }
        case 'assetConfig': { composer.addAssetConfig(txn); break; }
        case 'assetFreeze': { composer.addAssetFreeze(txn); break; }
        case 'assetDestroy': { composer.addAssetDestroy(txn); break; }
        case 'assetTransfer': { composer.addAssetTransfer(txn); break; }
        case 'assetOptIn': { composer.addAssetOptIn(txn); break; }
        case 'assetOptOut': { composer.addAssetOptOut(txn); break; }
        case 'appCall': {
          if ('appId' in txn && 'approvalProgram' in txn) {
            composer.addAppUpdate(txn);
          } else if ('appId' in txn) {
            composer.addAppCall(txn);
          } else {
            composer.addAppCreate(txn);
          }
          break;
        }
        case 'keyReg': {
          if ('voteKey' in txn) {
            composer.addOnlineKeyRegistration(txn);
          } else {
            composer.addOfflineKeyRegistration(txn);
          }
          break;
        }
        case 'txnWithSigner': { composer.addTransaction(txn.txn, txn.signer); break; }
        case 'atc': { composer.addAtc(txn.atc); break; }
        case 'methodCall': {
          if ('appId' in txn && 'approvalProgram' in txn) {
            composer.addAppUpdateMethodCall(txn);
          } else if ('appId' in txn) {
            composer.addAppCallMethodCall(txn);
          } else {
            composer.addAppCreateMethodCall(txn);
          }
          break;
        }
        default: {
          throw new Error(`Unknown transaction type`);
        }
      }
    }

    group.arc58VerifyAuthAddress({ ...sendParams, args: {} })

    const length = await (await group.composer()).count()

    return { plugin, caller, useRounds, length, group }
  }

  async register({ sender, signer, escrow }: ContractArgs['register(string)void'] & MaybeSigner): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    await this.client.send.register({
      ...sendParams,
      args: {
        escrow
      }
    });
  }

  async changeRevocationApp({ sender, signer, app }: MaybeSigner & { app: bigint }): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    await this.client.send.setRevocationApp({
      ...sendParams,
      args: { app },
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

  async verifyAuthAddress(params?: MaybeSigner): Promise<void> {

    const { sender, signer } = params || {};
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

  async rekeyTo({ sender, signer, ...args }: MaybeSigner & ContractArgs['arc58_rekeyTo(address,bool)void']): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    await this.client.send.arc58RekeyTo({ ...sendParams, args });
  }

  async canCall({ sender, signer, ...args }: CanCallParams): Promise<boolean> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    const method = isPluginSDKReturn(args.method)
      ? args.method().selector
      : args.method;

    return await this.client.send.arc58CanCall({ ...sendParams, args: { ...args, method } }) as unknown as boolean;
  }

  async usePlugin(params: WalletUsePluginParams): Promise<GroupReturn> {

    const { plugin, caller, group } = await this.prepareUsePlugin(params);

    const result = await group.send();

    const { escrow = '', fundsRequest } = params;

    await this.updateCache(
      { plugin, caller, escrow },
      fundsRequest?.map(({ asset }) => asset)
    ).catch(error => {
      console.warn('Failed to update plugin cache:', error);
    });

    return result;
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
    lastValid = MAX_UINT64,
    cooldown = 0n,
    useRounds = false,
    useExecutionKey = false,
    defaultToEscrow = false,
    allowances = []
  }: WalletAddPluginParams<TClient>): Promise<GroupReturn> {

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

    const newEscrow = escrow !== '' && !this.escrows.get(escrow);

    const args: AddPluginArgs = {
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

    const group = this.client.newGroup();

    if (name !== '') {
      group.arc58AddNamedPlugin({
        ...sendParams,
        args: { name, ...args },
        extraFee: microAlgo(newEscrow ? NewEscrowFeeAmount : 0n)
      });
    } else {
      group.arc58AddPlugin({
        ...sendParams,
        args,
        extraFee: microAlgo(newEscrow ? NewEscrowFeeAmount : 0n)
      });
    }

    if (allowances.length > 0) {

      if (escrow === '') {
        throw new Error('Allowances can only be added to plugins with an escrow');
      }

      group.arc58AddAllowances({
        ...sendParams,
        args: {
          escrow,
          allowances: AllowancesToTuple(allowances)
        }
      });
    }

    // console.log('txns',
    //   (await (await group.composer()).build()).transactions.map(txn => txn.txn)
    // )

    const result = await group.send();

    const postProcess: any[] = []
    if (newEscrow) {
      postProcess.push(this.register({ escrow }))
    }

    postProcess.push(this.updateCache(
      { plugin, caller: caller!, escrow },
      allowances.map(allowance => allowance.asset)
    ).catch(error => {
      console.warn('Failed to update plugin cache:', error);
    }));

    await Promise.all(postProcess);

    return result;
  }

  async removePlugin({ sender, signer, ...args }: ContractArgs['arc58_removePlugin(uint64,address,string)void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    return await this.client.send.arc58RemovePlugin({
      ...sendParams,
      args
    });
  }

  async newEscrow({ sender, signer, ...args }: ContractArgs['arc58_newEscrow(string)uint64'] & MaybeSigner): Promise<TxnReturn<bigint>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    return await this.client.send.arc58NewEscrow({
      ...sendParams,
      args
    });
  }

  async toggleEscrowLock({ sender, signer, ...args }: ContractArgs['arc58_toggleEscrowLock(string)(uint64,bool)'] & MaybeSigner): Promise<TxnReturn<EscrowInfo>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    return await this.client.send.arc58ToggleEscrowLock({
      ...sendParams,
      args
    });
  }

  async reclaimFunds({ sender, signer, ...args }: ContractArgs['arc58_reclaim(string,(uint64,uint64,bool)[])void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    return await this.client.send.arc58Reclaim({
      ...sendParams,
      args
    });
  }

  async optinEscrow({ sender, signer, ...args }: ContractArgs['arc58_optinEscrow(string,uint64[])void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    return await this.client.send.arc58OptinEscrow({ ...sendParams, args });
  }

  async addAllowances({ sender, signer, escrow, allowances }: { escrow: string, allowances: AddAllowanceArgs[] } & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    return await this.client.send.arc58AddAllowances({
      ...sendParams,
      args: {
        escrow,
        allowances: AllowancesToTuple(allowances)
      }
    });
  }

  async removeAllowances({ sender, signer, ...args }: ContractArgs['arc58_removeAllowances(string,uint64[])void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    return await this.client.send.arc58RemoveAllowances({
      ...sendParams,
      args
    });
  }

  async addExecutionKey({ sender, signer, lease, groups, firstValid, lastValid }: ContractArgs['arc58_addExecutionKey(byte[32],byte[32][],uint64,uint64)void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    return await this.client.send.arc58AddExecutionKey({
      ...sendParams,
      args: { lease, groups, firstValid, lastValid }
    });
  }

  async removeExecutionKey({ sender, signer, ...args }: ContractArgs['arc58_removeExecutionKey(byte[32])void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    return await this.client.send.arc58RemoveExecutionKey({
      ...sendParams,
      args
    });
  }

  async getGlobalState(): Promise<WalletGlobalState> {
    return await this.client.state.global.getAll() as unknown as WalletGlobalState;
  }

  async getAdmin(): Promise<string> {
    return (await this.client.send.arc58GetAdmin()).return as unknown as string;
  }

  async getPlugins(): Promise<ValueMap<PluginKey, PluginInfo>> {
    this.plugins = new ValueMap(
      this.pluginMapKeyGenerator,
      Array.from(
        await this.client.state.box.plugins.getMap(),
        ([key, info]) => {
          return [
            key,
            {
              ...info,
              methods: info.methods.map((method) => ({
                name: method[0],
                cooldown: method[1],
                lastCalled: method[2]
              }))
            }
          ];
        }
      )
    );
    return this.plugins;
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

  async getNamedPlugins(): Promise<Map<string, PluginKey>> {
    this.namedPlugins = await this.client.state.box.namedPlugins.getMap()
    return this.namedPlugins;
  }

  async getPluginByName(name: string): Promise<PluginInfo> {
    const infos = (await this.client.send.arc58GetNamedPlugins({ args: { names: [name] } })).return!;
    const info = PluginInfoFromTuple(infos[0])
    const methods = info.methods.map((method) => ({
      name: method[0],
      cooldown: method[1],
      lastCalled: method[2]
    }));
    return { ...info, methods };
  }

  async getEscrows(): Promise<Map<string, EscrowInfo>> {
    this.escrows = await this.client.state.box.escrows.getMap()
    return this.escrows
  }

  async getEscrow(escrow: string): Promise<EscrowInfo> {
    return EscrowInfoFromTuple((await this.client.send.arc58GetEscrows({ args: { escrows: [escrow] } })).return![0])
  }

  async getAllowances(): Promise<ValueMap<AllowanceKey, AllowanceInfo>> {
    this.allowances = new ValueMap(
      this.allowanceMapKeyGenerator,
      Array.from(
        await this.client.state.box.allowances.getMap(),
        ([key, info]) => {
          return [
            key,
            AllowanceInfoTranslate(info)
          ];
        }
      )
    );
    return this.allowances;
  }

  async getAllowance(key: AllowanceKey): Promise<AllowanceInfo> {
    return AllowanceInfoTranslate((await this.client.state.box.allowances.value(key))!);
  }

  async getExecutions(): Promise<Map<Uint8Array, ExecutionInfo>> {
    this.executions = await this.client.state.box.executions.getMap();
    return this.executions;
  }

  async getExecution(lease: Uint8Array<ArrayBufferLike>): Promise<ExecutionInfo> {
    return await this.client.state.box.executions.value(lease)! as unknown as ExecutionInfo;
  }

  async getMbr(args: MbrParams): Promise<AbstractAccountBoxMbrData> {
    return (await this.client.send.mbr({ args })).return as unknown as AbstractAccountBoxMbrData;
  }

  async balance(assets: bigint[]): Promise<bigint[]> {
    return (await this.client.send.balance({ args: { assets } })).return as unknown as bigint[];
  }

  readonly build = {

    usePlugin: async ({ firstValid = 0n, windowSize, ...args }: BuildWalletUsePluginParams): Promise<ExecutionBuildGroup> => {

      const { lease } = args;

      const suggestedParams = await this.client.algorand.getSuggestedParams()

      const validityPeriod = 1000n;
      const start = firstValid !== 0n ? firstValid : BigInt(suggestedParams.firstValid);

      const { useRounds, length, group } = await this.prepareUsePlugin(args);

      const foundation = (await (await group.composer()).build()).atc

      const admin = (await this.client.state.global.admin())!

      const f1 = forceProperties(foundation, { sender: admin, signer: makeEmptyTransactionSigner() })

      let numGroupsToBuild: number;
      let endTarget: bigint;

      if (useRounds) {
        endTarget = start + windowSize;
        numGroupsToBuild = Math.ceil(Number(windowSize) / Number(validityPeriod));
      } else {
        // Convert seconds to rounds (assuming ~2.7s per round)
        const roundsNeeded = BigInt(Math.ceil(Number(windowSize) / 2.7));
        endTarget = start + roundsNeeded;
        numGroupsToBuild = Math.ceil(Number(roundsNeeded) / Number(validityPeriod));
      }

      const populated = await prepareGroupForSending(
        f1,
        this.client.algorand.client.algod,
        {
          coverAppCallInnerTransactionFees: true,
          populateAppCallResources: true
        },
        {
          maxFees: new Map([
            [0, algo(1)],
            ...Array.from({ length: length - 1 }, (_, i) => [i + 1, microAlgo(0)] as [number, AlgoAmount]),
          ]),
          suggestedParams: suggestedParams,
        },
      )

      let groups: ExecutionBuildGroup = {
        lease: encodeLease(lease)!,
        firstValid: start,
        lastValid: endTarget,
        useRounds,
        ids: [],
        atcs: []
      }

      const sendParams = {
        ...this.sendParams,
        ...(args.sender !== undefined && { sender: args.sender }),
        ...(args.signer !== undefined && { signer: args.signer })
      };

      for (let i = 0; i < numGroupsToBuild; i++) {
        const groupStartRound = start + (BigInt(i) * validityPeriod);
        let groupEndRound: bigint;

        // For the last group, ensure it ends exactly at the target expiration
        if (i === (numGroupsToBuild - 1)) {
          groupEndRound = endTarget - 1n;
        } else {
          groupEndRound = groupStartRound + validityPeriod - 1n;
        }

        console.log(`Building group ${i + 1}/${numGroupsToBuild} with start: ${groupStartRound}, end: ${groupEndRound}`);

        const newAtc = forceProperties(populated, {
          sender: sendParams.sender,
          signer: sendParams.signer,
          firstValid: groupStartRound,
          lastValid: groupEndRound,
          lease: groups.lease
        })

        const groupID = newAtc.buildGroup()[0].txn.group!

        groups.ids.push(groupID);
        groups.atcs.push(newAtc);
      }

      return groups;
    }
  }
}