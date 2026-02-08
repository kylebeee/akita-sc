import { AbstractAccountBoxMbrData, AbstractedAccountArgs, AbstractedAccountFactory, AllowanceKey, EscrowInfo, PluginKey, type AbstractedAccountClient, ExecutionInfo, AbstractedAccountComposer, PluginInfoFromTuple, EscrowInfoFromTuple } from '../generated/AbstractedAccountClient'
import { AddAllowanceArgs, AddPluginArgs, AllowanceInfo, BuildWalletUsePluginParams, CanCallParams, ExecutionBuildGroup, MbrParams, MethodOffset, PluginInfo, RekeyArgs, WalletAddPluginParams, WalletGlobalState, WalletUsePluginParams } from './types';
import { isPluginSDKReturn, MaybeSigner, NewContractSDKParams, SDKClient, GroupReturn, TxnReturn, hasSenderSigner, ExpandedSendParamsWithSigner } from '../types';
import { BaseSDK } from '../base';
import { ENV_VAR_NAMES } from '../config';
import algosdk, { Address, ALGORAND_ZERO_ADDRESS_STRING, makeEmptyTransactionSigner } from 'algosdk';
import { MAX_UINT64 } from '../constants';
import { AllowanceInfoTranslate, AllowancesToTuple, domainBoxKey, executionBoxKey, forceProperties, OverWriteProperties, ValueMap } from './utils';
import { NewEscrowFeeAmount } from './constants';
import { encodeLease, microAlgo } from '@algorandfoundation/algokit-utils';
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
import { BoxIdentifier, BoxReference } from '@algorandfoundation/algokit-utils/types/app-manager';
import { Txn } from '@algorandfoundation/algokit-utils/types/composer';
import { prepareGroupWithCost } from '../simulate/prepare';
import { ExpectedCost } from '../simulate/types';
import { estimateFallbackCost } from '../simulate/fallback';

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
    super({ factory: AbstractedAccountFactory, ...params }, ENV_VAR_NAMES.WALLET_APP_ID);
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
  }: WalletUsePluginParams): Promise<{ plugin: bigint, caller: string, useRounds: boolean, length: number, group: AbstractedAccountComposer<[]>, sendParams: ExpandedSendParamsWithSigner }> {

    const sendParams = this.getSendParams({ sender, signer });

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
    let totalOpUpCount = 0
    for (let i = 0; i < calls.length; i++) {
      const call = calls[i];
      const { appId, getTxns, opUpCount = 0 } = call(spendingAddress);

      if (i === 0) {
        plugin = appId;
      }

      if (appId !== plugin) {
        throw new Error(`All calls must be to the same plugin app ID: ${plugin}, but got ${appId}`);
      }

      txns.push(...(await getTxns({ wallet: this.client.appId })))
      totalOpUpCount += opUpCount;
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
    } else {
      ({ methods, useRounds, useExecutionKey } = await this.getPluginByKey(key))
    }

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
      if (!hasSenderSigner(sendParams)) {
        throw new Error('Sender and signer must be provided');
      }

      boxReferences.push(domainBoxKey(sendParams.sender))
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

    // Add opUp transactions if requested by plugin calls
    // These are added after verifyAuthAddr and provide additional resource reference slots
    const hasSigner = hasSenderSigner(sendParams);
    const opUpLimit = Math.min(totalOpUpCount, (16 - (txns.length + 2)));
    console.log(`[WalletSDK] opUp debug: totalOpUpCount=${totalOpUpCount}, hasSigner=${hasSigner}, txnsLength=${txns.length}, opUpLimit=${opUpLimit}`);
    if (totalOpUpCount > 0 && hasSigner) {
      const opUpComposer = await group.composer();
      for (let i = 0; i < opUpLimit; i++) {
        opUpComposer.addAppCallMethodCall({
          sender: sendParams.sender,
          signer: sendParams.signer,
          appId: plugin,
          method: algosdk.ABIMethod.fromSignature('opUp()void'),
          args: [],
          maxFee: microAlgo(1_000),
          // Add unique note to differentiate opUp calls
          note: new TextEncoder().encode(String(i))
        });
      }
    }

    const length = await (await group.composer()).count()
    console.log(`[WalletSDK] Final group length: ${length} (rekey + ${txns.length} plugin txns + verifyAuth + ${opUpLimit} opUps)`)

    return { plugin, caller, useRounds, length, group, sendParams: sendParams as ExpandedSendParamsWithSigner }
  }

  async register({ sender, signer, escrow }: ContractArgs['register(string)void'] & MaybeSigner): Promise<void> {

    const sendParams = this.getSendParams({ sender, signer });

    await this.client.send.register({
      ...sendParams,
      args: {
        escrow
      }
    });
  }

  async changeRevocationApp({ sender, signer, app }: MaybeSigner & { app: bigint }): Promise<void> {

    const sendParams = this.getSendParams({ sender, signer });

    await this.client.send.setRevocationApp({
      ...sendParams,
      args: { app },
    });
  }

  async setNickname({ sender, signer, nickname }: MaybeSigner & { nickname: string }): Promise<void> {

    const sendParams = this.getSendParams({ sender, signer });

    await this.client.send.setNickname({
      ...sendParams,
      args: { nickname }
    });
  }

  async setAvatar({ sender, signer, avatar }: MaybeSigner & { avatar: bigint }): Promise<void> {

    const sendParams = this.getSendParams({ sender, signer });

    await this.client.send.setAvatar({
      ...sendParams,
      args: { avatar }
    });
  }

  async setBanner({ sender, signer, banner }: MaybeSigner & { banner: bigint }): Promise<void> {

    const sendParams = this.getSendParams({ sender, signer });

    await this.client.send.setBanner({
      ...sendParams,
      args: { banner }
    });
  }

  async setBio({ sender, signer, bio }: MaybeSigner & { bio: string }): Promise<void> {

    const sendParams = this.getSendParams({ sender, signer });

    await this.client.send.setBio({
      ...sendParams,
      args: { bio }
    });
  }

  async changeAdmin({ sender, signer, newAdmin }: MaybeSigner & { newAdmin: string }): Promise<void> {
    const sendParams = this.getSendParams({ sender, signer });

    await this.client.send.arc58ChangeAdmin({
      ...sendParams,
      args: { newAdmin }
    });
  }

  async verifyAuthAddress(params?: MaybeSigner): Promise<void> {

    const sendParams = this.getSendParams(params);

    await this.client.send.arc58VerifyAuthAddress({
      ...sendParams,
      args: {}
    });
  }

  async rekeyTo({ sender, signer, ...args }: MaybeSigner & ContractArgs['arc58_rekeyTo(address,bool)void']): Promise<void> {

    const sendParams = this.getSendParams({ sender, signer });

    await this.client.send.arc58RekeyTo({ ...sendParams, args });
  }

  async canCall({ sender, signer, ...args }: CanCallParams): Promise<boolean[]> {

    const sendParams = this.getSendParams({ sender, signer });

    const methods = isPluginSDKReturn(args.methods)
      ? args.methods().selectors
      : args.methods;

    const result = await Promise.allSettled(methods.flatMap(method => {
      return this.client.send.arc58CanCall({ ...sendParams, args: { ...args, method } }) as unknown as Promise<boolean>;
    }))

    return result.map(x => x.status === 'fulfilled' ? x.value : false)
  }

  async usePlugin(params: WalletUsePluginParams): Promise<GroupReturn> {

    const sendParams = this.getSendParams(params);
      
    const { plugin, caller, length, group, sendParams: preparedSendParams } = await this.prepareUsePlugin(params);
    const { escrow = '', fundsRequest, consolidateFees = false } = params;

    let result: GroupReturn;

    if (consolidateFees) {
      // Build the ATC from the group
      const atc = (await (await group.composer()).build()).atc;
      const appliedAtc = forceProperties(atc, { 
        sender: preparedSendParams.sender, 
        signer: preparedSendParams.signer 
      });

      // Get suggested params for fee calculation
      const suggestedParams = await this.client.algorand.getSuggestedParams();
      
      // Set max fees for all transactions to allow prepareGroupWithCost to work
      const maxFees = new Map<number, AlgoAmount>(
        Array.from({ length }, (_, i) => [i, microAlgo(BigInt(suggestedParams.minFee) * 272n)])
      );

      // Use prepareGroupWithCost to populate resources and calculate fees
      const { atc: populatedAtc } = await prepareGroupWithCost(
        appliedAtc,
        this.client.algorand.client.algod,
        {
          coverAppCallInnerTransactionFees: true,
          populateAppCallResources: true
        },
        {
          maxFees,
          suggestedParams
        }
      );

      // Consolidate all fees to the first transaction
      const feeGroup = populatedAtc.clone().buildGroup();
      const totalFees = feeGroup.reduce((acc, txn) => acc + txn.txn.fee, 0n);
      
      const consolidatedAtc = forceProperties(populatedAtc, {
        fees: new Map([
          [0, microAlgo(totalFees)],
          ...Array.from({ length: length - 1 }, (_, i) => [i + 1, microAlgo(0n)] as [number, AlgoAmount]),
        ])
      });

      // Use AlgoKit Utils TransactionComposer to send and get proper confirmations
      result = await this.client.algorand.newGroup()
        .addAtc(consolidatedAtc)
        .send() as unknown as GroupReturn;
    } else {
      result = await group.send({ ...sendParams });
    }

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
    coverFees = false,
    defaultToEscrow = false,
    allowances = []
  }: WalletAddPluginParams<TClient>): Promise<GroupReturn> {

    const sendParams = this.getSendParams({ sender, signer });

    // Get the plugin app ID from the SDK client
    const plugin = client.appId;

    if (global) {
      caller = ALGORAND_ZERO_ADDRESS_STRING
    }

    let transformedMethods: [Uint8Array<ArrayBufferLike>, number | bigint][] = [];
    if (methods.length > 0) {
      transformedMethods = methods.reduce<[Uint8Array<ArrayBufferLike>, number | bigint][]>(
        (acc, method) => {
          if (isPluginSDKReturn(method.name)) {
            const selectors = method.name().selectors ?? [];
            selectors.forEach((selector) => acc.push([selector, method.cooldown]));
          } else {
            method.name.forEach(x => acc.push([x, method.cooldown]));
          }
          return acc;
        },
        []
      );
    }

    const newEscrow = escrow !== '' && !this.escrows.get(escrow);

    // Check if controlled address differs from app address - requires extra fee for MBR transfer inner txn
    const controlledAddress = await this.client.state.global.controlledAddress();
    const hasExternalControlledAddress = controlledAddress !== this.client.appAddress.toString();

    // Calculate extra fee:
    // - NewEscrowFeeAmount (6000) if creating a new escrow
    // - 1000 if controlled address is external (for MBR transfer inner txn)
    const extraFee = microAlgo((newEscrow ? NewEscrowFeeAmount : 0n) + (hasExternalControlledAddress ? 1000n : 0n));

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
      coverFees,
      defaultToEscrow
    }

    const group = this.client.newGroup();

    if (name !== '') {
      group.arc58AddNamedPlugin({
        ...sendParams,
        args: { name, ...args },
        extraFee
      });
    } else {
      group.arc58AddPlugin({
        ...sendParams,
        args,
        extraFee
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

    const sendParams = this.getSendParams({ sender, signer });

    return await this.client.send.arc58RemovePlugin({
      ...sendParams,
      args
    });
  }

  async newEscrow({ sender, signer, ...args }: ContractArgs['arc58_newEscrow(string)uint64'] & MaybeSigner): Promise<TxnReturn<bigint>> {

    const sendParams = this.getSendParams({ sender, signer });

    return await this.client.send.arc58NewEscrow({
      ...sendParams,
      args
    });
  }

  async toggleEscrowLock({ sender, signer, ...args }: ContractArgs['arc58_toggleEscrowLock(string)(uint64,bool)'] & MaybeSigner): Promise<TxnReturn<EscrowInfo>> {

    const sendParams = this.getSendParams({ sender, signer });

    return await this.client.send.arc58ToggleEscrowLock({
      ...sendParams,
      args
    });
  }

  async reclaimFunds({ sender, signer, ...args }: ContractArgs['arc58_reclaim(string,(uint64,uint64,bool)[])void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = this.getSendParams({ sender, signer });

    return await this.client.send.arc58Reclaim({
      ...sendParams,
      args
    });
  }

  async optinEscrow({ sender, signer, ...args }: ContractArgs['arc58_optinEscrow(string,uint64[])void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = this.getSendParams({ sender, signer });

    return await this.client.send.arc58OptinEscrow({ ...sendParams, args });
  }

  async addAllowances({ sender, signer, escrow, allowances }: { escrow: string, allowances: AddAllowanceArgs[] } & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = this.getSendParams({ sender, signer });

    return await this.client.send.arc58AddAllowances({
      ...sendParams,
      args: {
        escrow,
        allowances: AllowancesToTuple(allowances)
      }
    });
  }

  async removeAllowances({ sender, signer, ...args }: ContractArgs['arc58_removeAllowances(string,uint64[])void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = this.getSendParams({ sender, signer });

    return await this.client.send.arc58RemoveAllowances({
      ...sendParams,
      args
    });
  }

  async addExecutionKey({ sender, signer, lease, groups, firstValid, lastValid }: ContractArgs['arc58_addExecutionKey(byte[32],byte[32][],uint64,uint64)void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = this.getSendParams({ sender, signer });

    return await this.client.send.arc58AddExecutionKey({
      ...sendParams,
      args: { lease, groups, firstValid, lastValid }
    });
  }

  async removeExecutionKey({ sender, signer, ...args }: ContractArgs['arc58_removeExecutionKey(byte[32])void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = this.getSendParams({ sender, signer });

    return await this.client.send.arc58RemoveExecutionKey({
      ...sendParams,
      args
    });
  }

  readonly build = {

    usePlugin: async ({ firstValid = 0n, windowSize = 0n, consolidateFees = true, skipSignatures = false, ...args }: BuildWalletUsePluginParams): Promise<ExecutionBuildGroup> => {

      const { lease } = args;

      const [
        suggestedParams,
        { useRounds, length, group, sendParams },
        admin
      ] = await Promise.all([
        this.client.algorand.getSuggestedParams(),
        this.prepareUsePlugin(args),
        this.client.state.global.admin()
      ]);

      const validityPeriod = 1000n;
      const start = firstValid !== 0n ? firstValid : BigInt(suggestedParams.firstValid);

      if (windowSize === 0n) {
        windowSize = BigInt(suggestedParams.lastValid) - BigInt(suggestedParams.firstValid);
      }

      const f = (await (await group.composer()).build()).atc
      const f1 = forceProperties(f, { sender: admin, signer: makeEmptyTransactionSigner() })

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

      const maxFees = new Map<number, AlgoAmount>([
        ...Array.from({ length: length }, (_, i) => [i, microAlgo(BigInt(suggestedParams.minFee) * 272n)] as [number, AlgoAmount]),
      ]);

      // Use prepareGroupWithCost to get both the prepared group and cost information
      const { atc: populatedGroup, expectedCost } = await prepareGroupWithCost(
        f1,
        this.client.algorand.client.algod,
        {
          coverAppCallInnerTransactionFees: true,
          populateAppCallResources: true
        },
        {
          maxFees,
          suggestedParams: suggestedParams,
        },
        admin, // simulateAccount for account deltas
      );

      // Determine which signer to use at build time
      const signerToUse = skipSignatures 
        ? makeEmptyTransactionSigner()  // Placeholder - will be replaced at send() time
        : sendParams.signer;

      const groups: ExecutionBuildGroup = {
        lease: encodeLease(lease)!,
        firstValid: start,
        lastValid: endTarget,
        useRounds,
        ids: [],
        atcs: [],
        expectedCost,
        send: async (options) => {
          // Get current round to determine which group is valid
          const status = await this.client.algorand.client.algod.status().do();
          const currentRound = BigInt(status.lastRound);
          
          // Find the group whose validity window includes the current round
          let selectedIndex = -1;
          
          for (let i = 0; i < groups.atcs.length; i++) {
            const groupStart = groups.firstValid + (BigInt(i) * validityPeriod);
            const groupEnd = i === groups.atcs.length - 1 
              ? groups.lastValid 
              : groupStart + validityPeriod - 1n;
            
            if (currentRound >= groupStart && currentRound <= groupEnd) {
              selectedIndex = i;
              break;
            }
          }
          
          if (selectedIndex === -1) {
            throw new Error(
              `No valid group for current round ${currentRound}. ` +
              `Window: ${groups.firstValid}-${groups.lastValid}`
            );
          }
          
          const atc = groups.atcs[selectedIndex];
          
          if (skipSignatures) {
            if (!options?.signer) {
              throw new Error('signer is required when skipSignatures is true');
            }
            const signedAtc = forceProperties(atc, { signer: options.signer });
            // Use AlgoKit Utils TransactionComposer to send and get proper confirmations
            return await this.client.algorand.newGroup()
              .addAtc(signedAtc)
              .send() as unknown as GroupReturn;
          } else {
            const finalAtc = options?.signer 
              ? forceProperties(atc, { signer: options.signer })
              : atc;
            // Use AlgoKit Utils TransactionComposer to send and get proper confirmations
            return await this.client.algorand.newGroup()
              .addAtc(finalAtc)
              .send() as unknown as GroupReturn;
          }
        }
      }

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

        let overwrite: OverWriteProperties = {
          sender: sendParams.sender,
          signer: signerToUse,
          firstValid: groupStartRound,
          lastValid: groupEndRound,
          lease: groups.lease,
        }

        if (consolidateFees) {
          const feeConsolidation = populatedGroup.clone().buildGroup();
          const totalFees = feeConsolidation.reduce((acc, txn) => acc + txn.txn.fee, 0n);
          overwrite.fees = new Map([
            [0, microAlgo(totalFees)],
            ...Array.from({ length: length - 1 }, (_, i) => [i + 1, microAlgo(0)] as [number, AlgoAmount]),
          ])
        }

        const finalGroup = forceProperties(populatedGroup, overwrite)

        const groupID = finalGroup.buildGroup()[0].txn.group!

        groups.ids.push(groupID);
        groups.atcs.push(finalGroup);
      }

      return groups;
    }
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
}