import { AkitaDaoArgs, AkitaDaoClient, AkitaDaoComposer, AkitaDaoFactory } from '../generated/AkitaDAOClient'
import { BaseSDK } from "../base";
import { GroupReturn, hasSenderSigner, isPluginSDKReturn, MaybeSigner, NewContractSDKParams, SDKClient, TxnReturn } from "../types";
import { AddPluginArgs, WalletSDK } from "../wallet";
import { AkitaDaoGlobalState, EditProposalParams, NewProposalParams, ProposalAction, ProposalAddPluginArgs } from "./types";
import { DAOProposalVotesMBR, ProposalActionEnum } from "./constants";
import { ABIStruct, getABIEncodedValue } from "@algorandfoundation/algokit-utils/types/app-arc56";
import algosdk, { ALGORAND_ZERO_ADDRESS_STRING, encodeUint64 } from "algosdk";
import { AppReturn } from "@algorandfoundation/algokit-utils/types/app";
import { algo, microAlgo, prepareGroupForSending } from "@algorandfoundation/algokit-utils";
import { emptySigner, MAX_UINT64 } from "../constants";
import { EMPTY_CID } from "./constants"
import { AllowancesToTuple } from '../wallet/utils';
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';

export * from './constants';
export * from "./types";

type ContractArgs = AkitaDaoArgs["obj"]

export class AkitaDaoSDK extends BaseSDK<AkitaDaoClient> {

  wallet: WalletSDK;

  constructor(params: NewContractSDKParams) {
    super({ factory: AkitaDaoFactory, ...params });
    this.wallet = new WalletSDK(params);
  }

  private async prepProposalActions<TClient extends SDKClient>(actions: ProposalAction<TClient>[]): Promise<any> {
    // parse args & rebuild
    const preppedActions: [number | bigint, Uint8Array<ArrayBufferLike>][] = []
    for (let i = 0; i < actions.length; i++) {
      const typedAction = actions[i]
      // const toAbiStruct = (params: any): ABIStruct => (params)
      let abiAction: ABIStruct
      let structType: string = ''

      switch (typedAction.type) {
        case ProposalActionEnum.UpgradeApp: {
          const { type, ...action } = typedAction

          abiAction = action
          structType = 'ProposalUpgradeApp'
          break;
        }
        case ProposalActionEnum.AddPlugin:
        case ProposalActionEnum.AddNamedPlugin: {
          const { type, ...action } = typedAction

          let {
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
            fee = 0n,
            power = 0n,
            duration = 0n,
            participation = 0n,
            approval = 0n,
            sourceLink = '',
            allowances = []
          } = action;

          if (
            useExecutionKey && (
              duration === 0n ||
              participation === 0n ||
              approval === 0n
            )
          ) {
            throw new Error('Proposal Settings must be set when using execution key');
          }

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

          const args: ProposalAddPluginArgs = {
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
            defaultToEscrow,
            fee,
            power,
            duration,
            participation,
            approval,
            sourceLink,
            allowances: AllowancesToTuple(allowances)
          }

          if (name) {
            abiAction = { name, ...args };
            structType = 'ProposalAddNamedPlugin';
          } else {
            abiAction = args;
            structType = 'ProposalAddPlugin';
          }

          break;
        }
        case ProposalActionEnum.ExecutePlugin: {
          const { type, ...action } = typedAction
          const { plugin, escrow } = action

          if (!this.wallet.plugins.has({ plugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow })) {
            try {
              await this.wallet.getPluginByKey({ plugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow })
            } catch (e) {
              throw new Error(`Plugin: ${plugin} for escrow: ${escrow} not found`);
            }
          }

          abiAction = action;
          structType = 'ProposalExecutePlugin';
          break;
        }
        case ProposalActionEnum.ExecuteNamedPlugin: {
          const { type, ...action } = typedAction

          if (!this.wallet.namedPlugins.has(action.name)) {
            try {
              await this.wallet.getPluginByName(action.name)
            } catch (e) {
              throw new Error(`Plugin named: ${action.name} not found`);
            }
          }

          abiAction = action;
          structType = 'ProposalExecuteNamedPlugin';
          break;
        }
        case ProposalActionEnum.RemoveExecutePlugin: {
          const { type, ...action } = typedAction

          if (!this.wallet.executions.has(action.executionKey)) {
            try {
              await this.wallet.getExecution(action.executionKey)
            } catch (e) {
              throw new Error(`Execution with key: ${action.executionKey} not found`);
            }
          }

          abiAction = action;
          structType = 'ProposalRemoveExecutePlugin';
          break;
        }
        case ProposalActionEnum.RemovePlugin: {
          const { type, ...action } = typedAction
          const { plugin, caller, escrow } = action;

          if (!this.wallet.plugins.has({ plugin, caller, escrow })) {
            try {
              await this.wallet.getPluginByKey({ plugin, caller, escrow })
            } catch (e) {
              throw new Error(`Plugin: ${plugin} with caller: ${caller} for escrow: ${escrow} not found`);
            }
          }

          abiAction = action;
          structType = 'ProposalRemovePlugin';
          break;
        }
        case ProposalActionEnum.RemoveNamedPlugin: {
          const { type, ...action } = typedAction
          const { name } = action;

          if (!this.wallet.namedPlugins.has(name)) {
            try {
              await this.wallet.getPluginByName(name)
            } catch (e) {
              throw new Error(`Plugin named: ${name} not found`);
            }
          }

          abiAction = action
          structType = 'ProposalRemoveNamedPlugin';
          break;
        }
        case ProposalActionEnum.AddAllowances: {
          const { escrow, allowances } = typedAction

          abiAction = { escrow, allowances: AllowancesToTuple(allowances) };
          structType = 'ProposalAddAllowances';
          break;
        }
        case ProposalActionEnum.RemoveAllowances: {
          const { type, ...action } = typedAction

          abiAction = action;
          structType = 'ProposalRemoveAllowances';
          break;
        }
        case ProposalActionEnum.NewEscrow: {
          const { type, ...action } = typedAction

          abiAction = action;
          structType = 'ProposalNewEscrow';
          break;
        }
        case ProposalActionEnum.ToggleEscrowLock: {
          const { type, ...action } = typedAction

          abiAction = action;
          structType = 'ProposalToggleEscrowLock';
          break;
        }
        case ProposalActionEnum.UpdateFields: {
          const { type, ...action } = typedAction

          let data: Uint8Array<ArrayBufferLike>
          switch (action.field) {
            case 'content_policy': {
              data = action.value
              break;
            }
            case 'proposal_action_limit':
            case 'min_rewards_impact': {
              data = encodeUint64(action.value)
              break;
            }
            case 'akita_al': {
              const currentApps = await this.client.state.global.akitaAppList()

              const {
                staking = currentApps?.staking ?? 0n,
                rewards = currentApps?.rewards ?? 0n,
                pool = currentApps?.pool ?? 0n,
                prizeBox = currentApps?.prizeBox ?? 0n,
                subscriptions = currentApps?.subscriptions ?? 0n,
                gate = currentApps?.gate ?? 0n,
                auction = currentApps?.auction ?? 0n,
                hyperSwap = currentApps?.hyperSwap ?? 0n,
                raffle = currentApps?.raffle ?? 0n,
                metaMerkles = currentApps?.metaMerkles ?? 0n,
                marketplace = currentApps?.marketplace ?? 0n,
                wallet = currentApps?.wallet ?? 0n,
                social = currentApps?.social ?? 0n,
                impact = currentApps?.impact ?? 0n
              } = action.value;

              const abiData = {
                staking,
                rewards,
                pool,
                prizeBox,
                subscriptions,
                gate,
                auction,
                hyperSwap,
                raffle,
                metaMerkles,
                marketplace,
                wallet,
                social,
                impact
              };

              data = getABIEncodedValue(abiData, 'AkitaAppList', this.client.appClient.appSpec.structs)
              break;
            }
            case 'plugn_al': {
              const currentApps = await this.client.state.global.pluginAppList()

              const { optin = currentApps?.optin ?? 0n } = action.value;

              data = getABIEncodedValue({ optin }, 'PluginAppList', this.client.appClient.appSpec.structs)
              break;
            }
            case 'other_al': {
              const currentApps = await this.client.state.global.otherAppList()

              const {
                vrfBeacon = currentApps?.vrfBeacon ?? 0n,
                nfdRegistry = currentApps?.nfdRegistry ?? 0n,
                assetInbox = currentApps?.assetInbox ?? 0n,
                escrow = currentApps?.escrow ?? 0n,
                poll = currentApps?.poll ?? 0n,
                akitaNfd = currentApps?.akitaNfd ?? 0n
              } = action.value;

              const abiData = {
                vrfBeacon,
                nfdRegistry,
                assetInbox,
                escrow,
                poll,
                akitaNfd
              };

              console.log('OtherAppList ABI Data:', abiData);

              data = getABIEncodedValue(abiData, 'OtherAppList', this.client.appClient.appSpec.structs)
              break;
            }
            case 'wallet_fees': {

              const currentFees = await this.client.state.global.walletFees()

              const {
                createFee = currentFees?.createFee ?? 0n,
              } = action.value;

              data = getABIEncodedValue({ createFee }, 'WalletFees', this.client.appClient.appSpec.structs)
              break;
            }
            case 'social_fees': {
              const currentFees = await this.client.state.global.socialFees()

              const {
                postFee = currentFees?.postFee ?? 0n,
                reactFee = currentFees?.reactFee ?? 0n,
                impactTaxMin = currentFees?.impactTaxMin ?? 0n,
                impactTaxMax = currentFees?.impactTaxMax ?? 0n
              } = action.value;

              const abiData = {
                postFee,
                reactFee,
                impactTaxMin,
                impactTaxMax
              };

              data = getABIEncodedValue(abiData, 'SocialFees', this.client.appClient.appSpec.structs)
              break;
            }
            case 'staking_fees': {
              const currentFees = await this.client.state.global.stakingFees()

              const {
                creationFee = currentFees?.creationFee ?? 0n,
                impactTaxMin = currentFees?.impactTaxMin ?? 0n,
                impactTaxMax = currentFees?.impactTaxMax ?? 0n
              } = action.value;

              const abiData = {
                creationFee,
                impactTaxMin,
                impactTaxMax
              };

              data = getABIEncodedValue(abiData, 'StakingFees', this.client.appClient.appSpec.structs)
              break;
            }
            case 'subscription_fees': {
              const currentFees = await this.client.state.global.subscriptionFees()

              const {
                serviceCreationFee = currentFees?.serviceCreationFee ?? 0n,
                paymentPercentage = currentFees?.paymentPercentage ?? 0n,
                triggerPercentage = currentFees?.triggerPercentage ?? 0n,
              } = action.value;

              const abiData = {
                serviceCreationFee,
                paymentPercentage,
                triggerPercentage
              };

              data = getABIEncodedValue(abiData, 'SubscriptionFees', this.client.appClient.appSpec.structs)
              break;
            }
            case 'nft_fees': {
              const currentFees = await this.client.state.global.nftFees()

              const {
                marketplaceSalePercentageMin = currentFees?.marketplaceSalePercentageMin ?? 0n,
                marketplaceSalePercentageMax = currentFees?.marketplaceSalePercentageMax ?? 0n,
                marketplaceComposablePercentage = currentFees?.marketplaceComposablePercentage ?? 0n,
                marketplaceRoyaltyDefaultPercentage = currentFees?.marketplaceRoyaltyDefaultPercentage ?? 0n,
                shuffleSalePercentage = currentFees?.shuffleSalePercentage ?? 0n,
                omnigemSaleFee = currentFees?.omnigemSaleFee ?? 0n,
                auctionCreationFee = currentFees?.auctionCreationFee ?? 0n,
                auctionSaleImpactTaxMin = currentFees?.auctionSaleImpactTaxMin ?? 0n,
                auctionSaleImpactTaxMax = currentFees?.auctionSaleImpactTaxMax ?? 0n,
                auctionComposablePercentage = currentFees?.auctionComposablePercentage ?? 0n,
                auctionRafflePercentage = currentFees?.auctionRafflePercentage ?? 0n,
                raffleCreationFee = currentFees?.raffleCreationFee ?? 0n,
                raffleSaleImpactTaxMin = currentFees?.raffleSaleImpactTaxMin ?? 0n,
                raffleSaleImpactTaxMax = currentFees?.raffleSaleImpactTaxMax ?? 0n,
                raffleComposablePercentage = currentFees?.raffleComposablePercentage ?? 0n,
              } = action.value;

              const abiData = {
                marketplaceSalePercentageMin,
                marketplaceSalePercentageMax,
                marketplaceComposablePercentage,
                marketplaceRoyaltyDefaultPercentage,
                shuffleSalePercentage,
                omnigemSaleFee,
                auctionCreationFee,
                auctionSaleImpactTaxMin,
                auctionSaleImpactTaxMax,
                auctionComposablePercentage,
                auctionRafflePercentage,
                raffleCreationFee,
                raffleSaleImpactTaxMin,
                raffleSaleImpactTaxMax,
                raffleComposablePercentage
              };

              data = getABIEncodedValue(abiData, 'NftFees', this.client.appClient.appSpec.structs)
              break;
            }
            case 'swap_fees': {
              const currentFees = await this.client.state.global.swapFees()

              const {
                impactTaxMin = currentFees?.impactTaxMin ?? 0n,
                impactTaxMax = currentFees?.impactTaxMax ?? 0n
              } = action.value;

              const abiData = {
                impactTaxMin,
                impactTaxMax
              };

              data = getABIEncodedValue(abiData, 'SwapFees', this.client.appClient.appSpec.structs)
              break;
            }
            case 'akita_assets': {
              const currentAssets = await this.client.state.global.akitaAssets()

              const {
                akta = currentAssets?.akta ?? 0n,
                bones = currentAssets?.bones ?? 0n
              } = action.value;

              data = getABIEncodedValue({ akta, bones }, 'AkitaAssets', this.client.appClient.appSpec.structs)
              break;
            }
            case 'upgrade_app_ps':
            case 'add_plugin_ps':
            case 'remove_plugin_ps':
            case 'add_allowance_ps':
            case 'remove_allowance_ps':
            case 'new_escrow_ps':
            case 'update_fields_ps': {
              data = getABIEncodedValue(action.value, "ProposalSettings", this.client.appClient.appSpec.structs)
              break;
            }
            default:
              throw new Error(`Unsupported field`);
          }

          abiAction = { field: action.field, value: data }
          structType = 'ProposalUpdateField';
          break;
        }
        default: {
          throw new Error(`Unsupported proposal action type`);
        }
      }

      preppedActions.push([
        typedAction.type,
        getABIEncodedValue(abiAction, structType, this.client.appClient.appSpec.structs)
      ])
    }

    return preppedActions;
  }

  async setup(params?: MaybeSigner): Promise<GroupReturn> {

    const { sender, signer } = params || {};
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    const group = this.client.newGroup()

    group.setup({
      ...sendParams,
      args: { nickname: 'Akita DAO' },
      maxFee: (6_000).microAlgo()
    })

    group.opUp({ args: {}, maxFee: (1_000).microAlgos() })

    const result = await group.send({ ...sendParams })

    if (result.returns === undefined) {
      throw new Error('Failed to setup Akita DAO');
    }

    this.wallet = new WalletSDK({
      algorand: this.algorand,
      factoryParams: {
        appId: result.returns[0] as bigint,
        defaultSender: sendParams.sender,
        defaultSigner: sendParams.signer
      }
    })

    await this.wallet.register({ ...sendParams, escrow: '' })

    return result;
  }

  async initialize(params?: MaybeSigner): Promise<TxnReturn<void>> {

    const { sender, signer } = params || {};
    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    return await this.client.send.initialize({
      ...sendParams,
      args: {}
    })
  }

  async newProposal<TClient extends SDKClient>({
    sender,
    signer,
    cid = EMPTY_CID,
    actions
  }: NewProposalParams<TClient>): Promise<{
    groupId: string;
    confirmedRound: bigint;
    txIDs: string[];
  } & AppReturn<bigint | undefined>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    const preppedActions = await this.prepProposalActions<TClient>(actions)

    // determine which call to use
    const initialized = (await this.client.state.global.initialized())! === 1n

    const group = this.client.newGroup()

    if (initialized) {

      const results = await this.client.send.proposalCost(preppedActions)
      const cost = results.return?.totalFee ?? 0n;

      const payment = this.client.algorand.createTransaction.payment({
        ...sendParams,
        receiver: this.client.appAddress.toString(),
        amount: microAlgo(cost),
      })

      group.newProposal({
        ...sendParams,
        args: {
          payment,
          cid,
          actions: preppedActions
        }
      })
    } else {
      group.newProposalPreInitialized({
        ...sendParams,
        args: {
          cid,
          actions: preppedActions
        }
      })
    }

    for (let i = 0; i < actions.length; i++) {
      group.opUp({ args: {}, note: `${i}` })
    }

    const length = await (await group.composer()).count()

    const suggestedParams = await this.client.algorand.getSuggestedParams()
    const foundation = (await (await group.composer()).build()).atc

    const populatedGroup = await prepareGroupForSending(
      foundation,
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

    const groupId = populatedGroup.buildGroup()[0].txn.group!.toString()

    const { methodResults, ...rest } = await populatedGroup.execute(this.client.algorand.client.algod, 10)

    return { groupId, ...rest, return: methodResults ? methodResults[0].returnValue as bigint : undefined }
  }

  async editProposal<TClient extends SDKClient>({
    sender,
    signer,
    id,
    cid,
    actions
  }: EditProposalParams<TClient>): Promise<TxnReturn<void>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    const preppedActions = await this.prepProposalActions<TClient>(actions)

    const req = await Promise.allSettled([
      this.client.state.box.proposals.value(id),
      this.client.send.proposalCost(preppedActions)
    ])

    if (req[0].status === 'rejected' || req[0].value === undefined) {
      throw new Error(`Proposal with id: ${id} not found`);
    }

    const { feesPaid } = req[0].value;

    if (req[1].status === 'rejected') {
      throw new Error(`Failed to calculate proposal cost: ${req[1].reason}`);
    }

    const results = req[1].value;
    const cost = results.return?.totalFee ?? 0n;

    let paymentRequired = feesPaid < cost;

    if (paymentRequired) {
      const payment = this.client.algorand.createTransaction.payment({
        ...sendParams,
        receiver: this.client.appAddress.toString(),
        amount: microAlgo(cost - feesPaid),
      })

      return await this.client.send.editProposalWithPayment({
        ...sendParams,
        args: {
          payment,
          id,
          cid,
          actions: preppedActions,
        }
      })
    } else {
      return await this.client.send.editProposal({
        ...sendParams,
        args: {
          id,
          cid,
          actions: preppedActions
        }
      })
    }
  }

  async submitProposal({ sender, signer, proposalId }: ContractArgs['submitProposal(uint64)void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    return await this.client.send.submitProposal({
      ...sendParams,
      args: { proposalId }
    })
  }

  async voteProposal({ proposalId, vote, sender, signer }: ContractArgs['voteProposal(pay,uint64,uint8)void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    const mbrPayment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      receiver: this.client.appAddress.toString(),
      amount: microAlgo(DAOProposalVotesMBR),
    });

    return await this.client.send.voteProposal({
      ...sendParams,
      args: { mbrPayment, proposalId, vote }
    })
  }

  async finalizeProposal({ sender, signer, proposalId }: ContractArgs['finalizeProposal(uint64)void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    return await this.client.send.finalizeProposal({
      ...sendParams,
      args: { proposalId }
    })
  }

  async executeProposal({ proposalId, sender, signer }: ContractArgs['executeProposal(uint64)void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    return await this.client.send.executeProposal({
      ...sendParams,
      args: { proposalId }
    })
  }

  async getGlobalState(): Promise<AkitaDaoGlobalState> {
    return await this.client.state.global.getAll() as unknown as AkitaDaoGlobalState;
  }

  async setupCost(params?: MaybeSigner): Promise<bigint> {

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
    };

    const { return: cost } = await this.client.send.setupCost({
      ...sendParams,
      args: {}
    });

    if (cost === undefined) {
      throw new Error('Failed to get setup cost for Akita DAO');
    }

    return cost;
  }

  async proposalCost<TClient extends SDKClient>({ sender, signer, actions }: { actions: ProposalAction<TClient>[] } & MaybeSigner): Promise<bigint> {

    const defaultParams = {
      ...this.sendParams,
      sender: this.readerAccount,
      signer: emptySigner
    }

    const sendParams = {
      ...defaultParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    const { return: requirements } = await this.client.send.proposalCost({
      ...sendParams,
      args: { actions: await this.prepProposalActions(actions) },
    });

    if (requirements === undefined) {
      throw new Error('Failed to get proposal cost for Akita DAO');
    }

    return requirements.totalFee;
  }
}