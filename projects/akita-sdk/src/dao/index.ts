import { AkitaDaoArgs, AkitaDaoClient, AkitaDaoFactory, ProposalCostInfo, ProposalDetails, ProposalVoteTotals } from '../generated/AkitaDAOClient'
import {
  AkitaDaoTypesClient,
  ProposalAddAllowances,
  ProposalAddNamedPlugin,
  ProposalAddPlugin,
  ProposalExecutePlugin,
  ProposalNewEscrow,
  ProposalRemoveAllowances,
  ProposalRemoveExecutePlugin,
  ProposalRemoveNamedPlugin,
  ProposalRemovePlugin,
  ProposalToggleEscrowLock,
  ProposalUpdateField,
  ProposalUpgradeApp
} from '../generated/AkitaDAOTypesClient'
import { BaseSDK } from "../base";
import { ENV_VAR_NAMES } from "../config";
import { GroupReturn, isPluginSDKReturn, MaybeSigner, NewContractSDKParams, SDKClient, TxnReturn } from "../types";
import { WalletSDK } from "../wallet";
import { AkitaDaoGlobalState, DecodedProposal, DecodedProposalAction, EditProposalParams, NewProposalParams, ProposalAction, ProposalAddPluginArgs, SplitsToTuples } from "./types";
import { DAOProposalVotesMBR, ProposalActionEnum } from "./constants";
import { ABIStruct, getABIDecodedValue, getABIEncodedValue } from "@algorandfoundation/algokit-utils/types/app-arc56";
import { ALGORAND_ZERO_ADDRESS_STRING, encodeUint64 } from "algosdk";
import { AppReturn } from "@algorandfoundation/algokit-utils/types/app";
import { microAlgo, prepareGroupForSending } from "@algorandfoundation/algokit-utils";
import { emptySigner, MAX_UINT64 } from "../constants";
import { EMPTY_CID } from "./constants"
import { AllowancesToTuple, forceProperties, OverWriteProperties } from '../wallet/utils';
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';

export * from './constants';
export * from "./types";

type ContractArgs = AkitaDaoArgs["obj"]

export class AkitaDaoSDK extends BaseSDK<AkitaDaoClient> {

  typeClient: AkitaDaoTypesClient
  private _wallet: WalletSDK | null = null;
  private _walletInitPromise: Promise<WalletSDK> | null = null;
  private _constructorParams: NewContractSDKParams;

  constructor(params: NewContractSDKParams) {
    super({ factory: AkitaDaoFactory, ...params }, ENV_VAR_NAMES.DAO_APP_ID);
    this.typeClient = new AkitaDaoTypesClient({ algorand: this.algorand, appId: 0n });
    this._constructorParams = params;
  }

  /**
   * Get the wallet SDK associated with this DAO.
   * Lazily fetches the wallet app ID from the DAO's global state on first access.
   */
  async getWallet(): Promise<WalletSDK> {
    if (this._wallet) {
      return this._wallet;
    }

    // Use a promise to prevent multiple concurrent initializations
    if (!this._walletInitPromise) {
      this._walletInitPromise = this._initializeWallet();
    }

    return this._walletInitPromise;
  }

  private async _initializeWallet(): Promise<WalletSDK> {
    // Fetch wallet app ID from DAO global state
    const walletAppId = await this.client.state.global.wallet();
    if (!walletAppId) {
      throw new Error('Could not read wallet app ID from DAO global state. Has the DAO been set up?');
    }

    this._wallet = new WalletSDK({
      ...this._constructorParams,
      factoryParams: {
        ...this._constructorParams.factoryParams,
        appId: walletAppId,
        defaultSender: this.sendParams.sender,
        defaultSigner: this.sendParams.signer
      }
    });

    return this._wallet;
  }

  /**
   * @deprecated Use getWallet() instead for proper async initialization.
   * This getter exists for backwards compatibility but will throw if the wallet
   * hasn't been initialized yet via getWallet() or setup().
   */
  get wallet(): WalletSDK {
    if (!this._wallet) {
      throw new Error(
        'Wallet not initialized. Call "await dao.getWallet()" first to initialize the wallet SDK, ' +
        'or use "await dao.setup()" to create a new DAO with its wallet.'
      );
    }
    return this._wallet;
  }

  /**
   * Allows setting the wallet directly (used by setup() and for testing)
   */
  set wallet(wallet: WalletSDK) {
    this._wallet = wallet;
    this._walletInitPromise = Promise.resolve(wallet);
  }

  private async prepProposalActions<TClient extends SDKClient>(actions: ProposalAction<TClient>[]): Promise<any> {
    // Get wallet lazily - only fetches app ID on first access
    const wallet = await this.getWallet();
    
    // parse args & rebuild
    const preppedActions: [number | bigint, Uint8Array<ArrayBufferLike>][] = []
    for (let i = 0; i < actions.length; i++) {
      const typedAction = actions[i]
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
            sourceLink = '',
            allowances = []
          } = action;

          // Default the conditional properties
          let fee = 0n;
          let power = 0n;
          let duration = 0n;
          let participation = 0n;
          let approval = 0n;

          // Narrow the type and extract execution key props
          if (action.useExecutionKey) {
            fee = action.fee;
            power = action.power;
            duration = action.duration;
            participation = action.participation;
            approval = action.approval;

            // Move the validation inside the narrowed block
            if (duration === 0n || participation === 0n || approval === 0n) {
              throw new Error('Proposal Settings must be set when using execution key');
            }
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

          if (!wallet.plugins.has({ plugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow })) {
            try {
              await wallet.getPluginByKey({ plugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow })
            } catch (e) {
              throw new Error(`Plugin: ${plugin} for escrow: ${escrow} not found`);
            }
          }

          abiAction = action;
          structType = 'ProposalExecutePlugin';
          break;
        }
        case ProposalActionEnum.RemoveExecutePlugin: {
          const { type, ...action } = typedAction

          if (!wallet.executions.has(action.executionKey)) {
            try {
              await wallet.getExecution(action.executionKey)
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

          if (!wallet.plugins.has({ plugin, caller, escrow })) {
            try {
              await wallet.getPluginByKey({ plugin, caller, escrow })
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

          if (!wallet.namedPlugins.has(name)) {
            try {
              await wallet.getPluginByName(name)
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
            case 'aal': {
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
              };

              data = getABIEncodedValue(abiData, 'AkitaAppList', this.client.appClient.appSpec.structs)
              break;
            }
            case 'sal': {
              const currentApps = await this.client.state.global.akitaSocialAppList()

              const {
                social = currentApps?.social ?? 0n,
                graph = currentApps?.graph ?? 0n,
                impact = currentApps?.impact ?? 0n,
                moderation = currentApps?.moderation ?? 0n
              } = action.value;

              const abiData = {
                social,
                graph,
                impact,
                moderation
              };

              data = getABIEncodedValue(abiData, 'AkitaSocialAppList', this.client.appClient.appSpec.structs)
              break;
            }
            case 'pal': {
              const currentApps = await this.client.state.global.pluginAppList()

              const {
                optin = currentApps?.optin ?? 0n,
                revenueManager = currentApps?.revenueManager ?? 0n,
                update = currentApps?.update ?? 0n
              } = action.value;

              data = getABIEncodedValue({ optin, revenueManager, update }, 'PluginAppList', this.client.appClient.appSpec.structs)
              break;
            }
            case 'oal': {
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
            case 'revenue_splits': {
              data = getABIEncodedValue(SplitsToTuples(action.value), '((uint64,string),uint8,uint64)[]', this.client.appClient.appSpec.structs)
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
        getABIEncodedValue(abiAction, structType, this.typeClient.appClient.appSpec.structs)
      ])
    }

    return preppedActions;
  }

  async setup(params?: MaybeSigner): Promise<GroupReturn> {

    const sendParams = this.getSendParams(params);

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

    const sendParams = this.getSendParams(params);

    return await this.client.send.initialize({
      ...sendParams,
      args: {}
    })
  }

  async newProposal<TClient extends SDKClient>({
    sender,
    signer,
    cid = EMPTY_CID,
    actions,
    consolidateFees = true
  }: NewProposalParams<TClient>): Promise<{
    groupId: string;
    confirmedRound: bigint;
    txIDs: string[];
  } & AppReturn<bigint | undefined>> {

    const sendParams = this.getRequiredSendParams({ sender, signer });

    const preppedActions = await this.prepProposalActions<TClient>(actions)

    const group = this.client.newGroup()

    const { total } = await this.client.proposalCost({ args: { actions: preppedActions } })

    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      receiver: this.client.appAddress.toString(),
      amount: microAlgo(total),
    })

    group.newProposal({
      ...sendParams,
      args: {
        payment,
        cid,
        actions: preppedActions
      }
    })

    for (let i = 0; i < actions.length; i++) {
      group.opUp({ args: {}, note: `${i}` })
    }

    const length = await (await group.composer()).count()

    const suggestedParams = await this.client.algorand.getSuggestedParams()
    const foundation = (await (await group.composer()).build()).atc

    const maxFees = new Map<number, AlgoAmount>();
    for (let i = 0; i < length; i += 1) {
      maxFees.set(i, microAlgo(257_000));
    }

    const populatedGroup = await prepareGroupForSending(
      foundation,
      this.client.algorand.client.algod,
      {
        coverAppCallInnerTransactionFees: true,
        populateAppCallResources: true
      },
      {
        maxFees,
        suggestedParams: suggestedParams,
      },
    )

    let overwrite: OverWriteProperties = {}

    if (consolidateFees) {
      const feeConsolidation = populatedGroup.clone().buildGroup();
      const totalFees = feeConsolidation.reduce((acc, txn) => acc + txn.txn.fee, 0n);
      overwrite.fees = new Map([
        [0, microAlgo(totalFees)],
        ...Array.from({ length: length - 1 }, (_, i) => [i + 1, microAlgo(0)] as [number, AlgoAmount]),
      ])
    }

    const finalGroup = forceProperties(populatedGroup, overwrite)

    const groupId = finalGroup.buildGroup()[0].txn.group!.toString()

    const { methodResults, ...rest } = await finalGroup.execute(this.client.algorand.client.algod, 10)

    return { groupId, ...rest, return: methodResults ? methodResults[0].returnValue as bigint : undefined }
  }

  async editProposal<TClient extends SDKClient>({
    sender,
    signer,
    id,
    cid,
    actions
  }: EditProposalParams<TClient>): Promise<TxnReturn<void>> {

    const sendParams = this.getRequiredSendParams({ sender, signer });

    const preppedActions = await this.prepProposalActions<TClient>(actions)

    const req = await Promise.allSettled([
      this.client.state.box.proposals.value(id),
      this.client.proposalCost({ args: { actions: preppedActions } })
    ])

    if (req[0].status === 'rejected' || req[0].value === undefined) {
      throw new Error(`Proposal with id: ${id} not found`);
    }

    const { feesPaid } = req[0].value;

    if (req[1].status === 'rejected') {
      throw new Error(`Failed to calculate proposal cost: ${req[1].reason}`);
    }

    const results = req[1].value;
    const cost = results.total ?? 0n;

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

    const sendParams = this.getRequiredSendParams({ sender, signer });

    return await this.client.send.submitProposal({
      ...sendParams,
      args: { proposalId }
    })
  }

  async voteProposal({ proposalId, vote, sender, signer }: ContractArgs['voteProposal(pay,uint64,uint8)void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = this.getRequiredSendParams({ sender, signer });

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

    const sendParams = this.getRequiredSendParams({ sender, signer });

    return await this.client.send.finalizeProposal({
      ...sendParams,
      args: { proposalId }
    })
  }

  async executeProposal({ proposalId, sender, signer }: ContractArgs['executeProposal(uint64)void'] & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = this.getRequiredSendParams({ sender, signer });

    return await this.client.send.executeProposal({
      ...sendParams,
      args: { proposalId }
    })
  }

  async getGlobalState(): Promise<AkitaDaoGlobalState> {
    return await this.client.state.global.getAll() as unknown as AkitaDaoGlobalState;
  }

  async setupCost(params?: MaybeSigner): Promise<bigint> {

    const sendParams = this.getSendParams({
      sender: this.readerAccount,
      signer: emptySigner,
      ...params
    });

    const cost = await this.client.setupCost({
      ...sendParams,
      args: {}
    });

    return cost;
  }

  async proposalCost<TClient extends SDKClient>({ sender, signer, actions }: { actions: ProposalAction<TClient>[] } & MaybeSigner): Promise<ProposalCostInfo> {

    const sendParams = this.getSendParams({
      sender: sender ?? this.readerAccount,
      signer: signer ?? emptySigner
    });

    const requirements = await this.client.proposalCost({
      ...sendParams,
      args: { actions: await this.prepProposalActions(actions) },
    });

    return requirements
  }

  /**
   * Maps proposal action type enum to its corresponding struct type name
   */
  private getActionStructType(actionType: number): string {
    switch (actionType) {
      case ProposalActionEnum.UpgradeApp:
        return 'ProposalUpgradeApp';
      case ProposalActionEnum.AddPlugin:
        return 'ProposalAddPlugin';
      case ProposalActionEnum.AddNamedPlugin:
        return 'ProposalAddNamedPlugin';
      case ProposalActionEnum.ExecutePlugin:
        return 'ProposalExecutePlugin';
      case ProposalActionEnum.RemoveExecutePlugin:
        return 'ProposalRemoveExecutePlugin';
      case ProposalActionEnum.RemovePlugin:
        return 'ProposalRemovePlugin';
      case ProposalActionEnum.RemoveNamedPlugin:
        return 'ProposalRemoveNamedPlugin';
      case ProposalActionEnum.AddAllowances:
        return 'ProposalAddAllowances';
      case ProposalActionEnum.RemoveAllowances:
        return 'ProposalRemoveAllowances';
      case ProposalActionEnum.NewEscrow:
        return 'ProposalNewEscrow';
      case ProposalActionEnum.ToggleEscrowLock:
        return 'ProposalToggleEscrowLock';
      case ProposalActionEnum.UpdateFields:
        return 'ProposalUpdateField';
      default:
        throw new Error(`Unknown proposal action type: ${actionType}`);
    }
  }

  /**
   * Decodes the raw action bytes into their typed struct representation
   */
  private decodeProposalAction(actionType: number, actionData: Uint8Array): DecodedProposalAction {
    const structType = this.getActionStructType(actionType);
    const structs = this.typeClient.appClient.appSpec.structs;

    switch (actionType) {
      case ProposalActionEnum.UpgradeApp: {
        const decoded = getABIDecodedValue(actionData, structType, structs) as ProposalUpgradeApp;
        return { type: ProposalActionEnum.UpgradeApp, ...decoded };
      }
      case ProposalActionEnum.AddPlugin: {
        const decoded = getABIDecodedValue(actionData, structType, structs) as ProposalAddPlugin;
        return { type: ProposalActionEnum.AddPlugin, ...decoded };
      }
      case ProposalActionEnum.AddNamedPlugin: {
        const decoded = getABIDecodedValue(actionData, structType, structs) as ProposalAddNamedPlugin;
        return { type: ProposalActionEnum.AddNamedPlugin, ...decoded };
      }
      case ProposalActionEnum.ExecutePlugin: {
        const decoded = getABIDecodedValue(actionData, structType, structs) as ProposalExecutePlugin;
        return { type: ProposalActionEnum.ExecutePlugin, ...decoded };
      }
      case ProposalActionEnum.RemoveExecutePlugin: {
        const decoded = getABIDecodedValue(actionData, structType, structs) as ProposalRemoveExecutePlugin;
        return { type: ProposalActionEnum.RemoveExecutePlugin, ...decoded };
      }
      case ProposalActionEnum.RemovePlugin: {
        const decoded = getABIDecodedValue(actionData, structType, structs) as ProposalRemovePlugin;
        return { type: ProposalActionEnum.RemovePlugin, ...decoded };
      }
      case ProposalActionEnum.RemoveNamedPlugin: {
        const decoded = getABIDecodedValue(actionData, structType, structs) as ProposalRemoveNamedPlugin;
        return { type: ProposalActionEnum.RemoveNamedPlugin, ...decoded };
      }
      case ProposalActionEnum.AddAllowances: {
        const decoded = getABIDecodedValue(actionData, structType, structs) as ProposalAddAllowances;
        return { type: ProposalActionEnum.AddAllowances, ...decoded };
      }
      case ProposalActionEnum.RemoveAllowances: {
        const decoded = getABIDecodedValue(actionData, structType, structs) as ProposalRemoveAllowances;
        return { type: ProposalActionEnum.RemoveAllowances, ...decoded };
      }
      case ProposalActionEnum.NewEscrow: {
        const decoded = getABIDecodedValue(actionData, structType, structs) as ProposalNewEscrow;
        return { type: ProposalActionEnum.NewEscrow, ...decoded };
      }
      case ProposalActionEnum.ToggleEscrowLock: {
        const decoded = getABIDecodedValue(actionData, structType, structs) as ProposalToggleEscrowLock;
        return { type: ProposalActionEnum.ToggleEscrowLock, ...decoded };
      }
      case ProposalActionEnum.UpdateFields: {
        const decoded = getABIDecodedValue(actionData, structType, structs) as ProposalUpdateField;
        return { type: ProposalActionEnum.UpdateFields, ...decoded };
      }
      default:
        throw new Error(`Unknown proposal action type: ${actionType}`);
    }
  }

  /**
   * Fetches a proposal by ID and decodes all action data into typed structs
   */
  async getProposal(proposalId: bigint): Promise<DecodedProposal> {
    const proposal = await this.client.getProposal({ args: { proposalId } });

    if (!proposal) {
      throw new Error(`Proposal with id: ${proposalId} not found`);
    }

    const decodedActions: DecodedProposalAction[] = proposal.actions.map(([actionType, actionData]) => {
      return this.decodeProposalAction(actionType, actionData);
    });

    return {
      status: proposal.status,
      cid: proposal.cid,
      votes: proposal.votes,
      creator: proposal.creator,
      votingTs: proposal.votingTs,
      created: proposal.created,
      feesPaid: proposal.feesPaid,
      actions: decodedActions
    };
  }
}