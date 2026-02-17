"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AkitaDaoSDK = void 0;
const AkitaDAOClient_1 = require("../generated/AkitaDAOClient");
const AkitaDAOTypesClient_1 = require("../generated/AkitaDAOTypesClient");
const base_1 = require("../base");
const config_1 = require("../config");
const types_1 = require("../types");
const wallet_1 = require("../wallet");
const types_2 = require("./types");
const constants_1 = require("./constants");
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const algosdk_1 = require("algosdk");
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const constants_2 = require("../constants");
const constants_3 = require("./constants");
const utils_1 = require("../wallet/utils");
__exportStar(require("./constants"), exports);
__exportStar(require("./types"), exports);
class AkitaDaoSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: AkitaDAOClient_1.AkitaDaoFactory, ...params }, config_1.ENV_VAR_NAMES.DAO_APP_ID);
        this._wallet = null;
        this._walletInitPromise = null;
        this.typeClient = new AkitaDAOTypesClient_1.AkitaDaoTypesClient({ algorand: this.algorand, appId: 0n });
        this._constructorParams = params;
    }
    /**
     * Get the wallet SDK associated with this DAO.
     * Lazily fetches the wallet app ID from the DAO's global state on first access.
     */
    async getWallet() {
        if (this._wallet) {
            return this._wallet;
        }
        // Use a promise to prevent multiple concurrent initializations
        if (!this._walletInitPromise) {
            this._walletInitPromise = this._initializeWallet();
        }
        return this._walletInitPromise;
    }
    async _initializeWallet() {
        // Fetch wallet app ID from DAO global state
        const walletAppId = await this.client.state.global.wallet();
        if (!walletAppId) {
            throw new Error('Could not read wallet app ID from DAO global state. Has the DAO been set up?');
        }
        this._wallet = new wallet_1.WalletSDK({
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
    get wallet() {
        if (!this._wallet) {
            throw new Error('Wallet not initialized. Call "await dao.getWallet()" first to initialize the wallet SDK, ' +
                'or use "await dao.setup()" to create a new DAO with its wallet.');
        }
        return this._wallet;
    }
    /**
     * Allows setting the wallet directly (used by setup() and for testing)
     */
    set wallet(wallet) {
        this._wallet = wallet;
        this._walletInitPromise = Promise.resolve(wallet);
    }
    async prepProposalActions(actions) {
        // Only fetch wallet when needed for validation (ExecutePlugin, RemoveExecutePlugin, RemovePlugin, RemoveNamedPlugin)
        const needsWallet = actions.some(a => a.type === constants_1.ProposalActionEnum.ExecutePlugin ||
            a.type === constants_1.ProposalActionEnum.RemoveExecutePlugin ||
            a.type === constants_1.ProposalActionEnum.RemovePlugin ||
            a.type === constants_1.ProposalActionEnum.RemoveNamedPlugin);
        const wallet = needsWallet ? await this.getWallet() : null;
        // parse args & rebuild
        const preppedActions = [];
        for (let i = 0; i < actions.length; i++) {
            const typedAction = actions[i];
            let abiAction;
            let structType = '';
            switch (typedAction.type) {
                case constants_1.ProposalActionEnum.UpgradeApp: {
                    const { type, ...action } = typedAction;
                    abiAction = action;
                    structType = 'ProposalUpgradeApp';
                    break;
                }
                case constants_1.ProposalActionEnum.AddPlugin:
                case constants_1.ProposalActionEnum.AddNamedPlugin: {
                    const { type, ...action } = typedAction;
                    let { name = '', client, caller, global = false, methods = [], escrow = '', admin = false, delegationType = 0n, lastValid = constants_2.MAX_UINT64, cooldown = 0n, useRounds = false, useExecutionKey = false, coverFees = false, defaultToEscrow = false, sourceLink = '', allowances = [] } = action;
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
                        caller = algosdk_1.ALGORAND_ZERO_ADDRESS_STRING;
                    }
                    let transformedMethods = [];
                    if (methods.length > 0) {
                        transformedMethods = methods.reduce((acc, method) => {
                            if ((0, types_1.isPluginSDKReturn)(method.name)) {
                                const selectors = method.name().selectors ?? [];
                                selectors.forEach((selector) => acc.push([selector, method.cooldown]));
                            }
                            else {
                                method.name.forEach(x => acc.push([x, method.cooldown]));
                            }
                            return acc;
                        }, []);
                    }
                    const args = {
                        plugin,
                        caller: caller,
                        escrow,
                        admin,
                        delegationType,
                        lastValid,
                        cooldown,
                        methods: transformedMethods,
                        useRounds,
                        useExecutionKey,
                        coverFees,
                        canReclaim: false,
                        defaultToEscrow,
                        fee,
                        power,
                        duration,
                        participation,
                        approval,
                        sourceLink,
                        allowances: (0, utils_1.AllowancesToTuple)(allowances)
                    };
                    if (name) {
                        abiAction = { name, ...args };
                        structType = 'ProposalAddNamedPlugin';
                    }
                    else {
                        abiAction = args;
                        structType = 'ProposalAddPlugin';
                    }
                    break;
                }
                case constants_1.ProposalActionEnum.ExecutePlugin: {
                    const { type, ...action } = typedAction;
                    const { plugin, escrow } = action;
                    if (!wallet.plugins.has({ plugin, caller: algosdk_1.ALGORAND_ZERO_ADDRESS_STRING, escrow })) {
                        try {
                            await wallet.getPluginByKey({ plugin, caller: algosdk_1.ALGORAND_ZERO_ADDRESS_STRING, escrow });
                        }
                        catch (e) {
                            throw new Error(`Plugin: ${plugin} for escrow: ${escrow} not found`);
                        }
                    }
                    abiAction = action;
                    structType = 'ProposalExecutePlugin';
                    break;
                }
                case constants_1.ProposalActionEnum.RemoveExecutePlugin: {
                    const { type, ...action } = typedAction;
                    if (!wallet.executions.has(action.executionKey)) {
                        try {
                            await wallet.getExecution(action.executionKey);
                        }
                        catch (e) {
                            throw new Error(`Execution with key: ${action.executionKey} not found`);
                        }
                    }
                    abiAction = action;
                    structType = 'ProposalRemoveExecutePlugin';
                    break;
                }
                case constants_1.ProposalActionEnum.RemovePlugin: {
                    const { type, ...action } = typedAction;
                    const { plugin, caller, escrow } = action;
                    if (!wallet.plugins.has({ plugin, caller, escrow })) {
                        try {
                            await wallet.getPluginByKey({ plugin, caller, escrow });
                        }
                        catch (e) {
                            throw new Error(`Plugin: ${plugin} with caller: ${caller} for escrow: ${escrow} not found`);
                        }
                    }
                    abiAction = action;
                    structType = 'ProposalRemovePlugin';
                    break;
                }
                case constants_1.ProposalActionEnum.RemoveNamedPlugin: {
                    const { type, ...action } = typedAction;
                    const { name } = action;
                    if (!wallet.namedPlugins.has(name)) {
                        try {
                            await wallet.getPluginByName(name);
                        }
                        catch (e) {
                            throw new Error(`Plugin named: ${name} not found`);
                        }
                    }
                    abiAction = action;
                    structType = 'ProposalRemoveNamedPlugin';
                    break;
                }
                case constants_1.ProposalActionEnum.AddAllowances: {
                    const { escrow, allowances } = typedAction;
                    abiAction = { escrow, allowances: (0, utils_1.AllowancesToTuple)(allowances) };
                    structType = 'ProposalAddAllowances';
                    break;
                }
                case constants_1.ProposalActionEnum.RemoveAllowances: {
                    const { type, ...action } = typedAction;
                    abiAction = action;
                    structType = 'ProposalRemoveAllowances';
                    break;
                }
                case constants_1.ProposalActionEnum.NewEscrow: {
                    const { type, ...action } = typedAction;
                    abiAction = action;
                    structType = 'ProposalNewEscrow';
                    break;
                }
                case constants_1.ProposalActionEnum.ToggleEscrowLock: {
                    const { type, ...action } = typedAction;
                    abiAction = action;
                    structType = 'ProposalToggleEscrowLock';
                    break;
                }
                case constants_1.ProposalActionEnum.UpdateFields: {
                    const { type, ...action } = typedAction;
                    let data;
                    switch (action.field) {
                        case 'content_policy': {
                            data = action.value;
                            break;
                        }
                        case 'proposal_action_limit':
                        case 'min_rewards_impact': {
                            data = (0, algosdk_1.encodeUint64)(action.value);
                            break;
                        }
                        case 'aal': {
                            const currentApps = await this.client.state.global.akitaAppList();
                            const { staking = currentApps?.staking ?? 0n, rewards = currentApps?.rewards ?? 0n, pool = currentApps?.pool ?? 0n, prizeBox = currentApps?.prizeBox ?? 0n, subscriptions = currentApps?.subscriptions ?? 0n, gate = currentApps?.gate ?? 0n, auction = currentApps?.auction ?? 0n, hyperSwap = currentApps?.hyperSwap ?? 0n, raffle = currentApps?.raffle ?? 0n, metaMerkles = currentApps?.metaMerkles ?? 0n, marketplace = currentApps?.marketplace ?? 0n, wallet = currentApps?.wallet ?? 0n, } = action.value;
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
                            data = (0, app_arc56_1.getABIEncodedValue)(abiData, 'AkitaAppList', this.client.appClient.appSpec.structs);
                            break;
                        }
                        case 'sal': {
                            const currentApps = await this.client.state.global.akitaSocialAppList();
                            const { social = currentApps?.social ?? 0n, graph = currentApps?.graph ?? 0n, impact = currentApps?.impact ?? 0n, moderation = currentApps?.moderation ?? 0n } = action.value;
                            const abiData = {
                                social,
                                graph,
                                impact,
                                moderation
                            };
                            data = (0, app_arc56_1.getABIEncodedValue)(abiData, 'AkitaSocialAppList', this.client.appClient.appSpec.structs);
                            break;
                        }
                        case 'pal': {
                            const currentApps = await this.client.state.global.pluginAppList();
                            const { optin = currentApps?.optin ?? 0n, revenueManager = currentApps?.revenueManager ?? 0n, update = currentApps?.update ?? 0n } = action.value;
                            data = (0, app_arc56_1.getABIEncodedValue)({ optin, revenueManager, update }, 'PluginAppList', this.client.appClient.appSpec.structs);
                            break;
                        }
                        case 'oal': {
                            const currentApps = await this.client.state.global.otherAppList();
                            const { vrfBeacon = currentApps?.vrfBeacon ?? 0n, nfdRegistry = currentApps?.nfdRegistry ?? 0n, assetInbox = currentApps?.assetInbox ?? 0n, escrow = currentApps?.escrow ?? 0n, poll = currentApps?.poll ?? 0n, akitaNfd = currentApps?.akitaNfd ?? 0n } = action.value;
                            const abiData = {
                                vrfBeacon,
                                nfdRegistry,
                                assetInbox,
                                escrow,
                                poll,
                                akitaNfd
                            };
                            data = (0, app_arc56_1.getABIEncodedValue)(abiData, 'OtherAppList', this.client.appClient.appSpec.structs);
                            break;
                        }
                        case 'wallet_fees': {
                            const currentFees = await this.client.state.global.walletFees();
                            const { createFee = currentFees?.createFee ?? 0n, } = action.value;
                            data = (0, app_arc56_1.getABIEncodedValue)({ createFee }, 'WalletFees', this.client.appClient.appSpec.structs);
                            break;
                        }
                        case 'social_fees': {
                            const currentFees = await this.client.state.global.socialFees();
                            const { postFee = currentFees?.postFee ?? 0n, reactFee = currentFees?.reactFee ?? 0n, impactTaxMin = currentFees?.impactTaxMin ?? 0n, impactTaxMax = currentFees?.impactTaxMax ?? 0n } = action.value;
                            const abiData = {
                                postFee,
                                reactFee,
                                impactTaxMin,
                                impactTaxMax
                            };
                            data = (0, app_arc56_1.getABIEncodedValue)(abiData, 'SocialFees', this.client.appClient.appSpec.structs);
                            break;
                        }
                        case 'staking_fees': {
                            const currentFees = await this.client.state.global.stakingFees();
                            const { creationFee = currentFees?.creationFee ?? 0n, impactTaxMin = currentFees?.impactTaxMin ?? 0n, impactTaxMax = currentFees?.impactTaxMax ?? 0n } = action.value;
                            const abiData = {
                                creationFee,
                                impactTaxMin,
                                impactTaxMax
                            };
                            data = (0, app_arc56_1.getABIEncodedValue)(abiData, 'StakingFees', this.client.appClient.appSpec.structs);
                            break;
                        }
                        case 'subscription_fees': {
                            const currentFees = await this.client.state.global.subscriptionFees();
                            const { serviceCreationFee = currentFees?.serviceCreationFee ?? 0n, paymentPercentage = currentFees?.paymentPercentage ?? 0n, triggerPercentage = currentFees?.triggerPercentage ?? 0n, } = action.value;
                            const abiData = {
                                serviceCreationFee,
                                paymentPercentage,
                                triggerPercentage
                            };
                            data = (0, app_arc56_1.getABIEncodedValue)(abiData, 'SubscriptionFees', this.client.appClient.appSpec.structs);
                            break;
                        }
                        case 'nft_fees': {
                            const currentFees = await this.client.state.global.nftFees();
                            const { marketplaceSalePercentageMin = currentFees?.marketplaceSalePercentageMin ?? 0n, marketplaceSalePercentageMax = currentFees?.marketplaceSalePercentageMax ?? 0n, marketplaceComposablePercentage = currentFees?.marketplaceComposablePercentage ?? 0n, marketplaceRoyaltyDefaultPercentage = currentFees?.marketplaceRoyaltyDefaultPercentage ?? 0n, shuffleSalePercentage = currentFees?.shuffleSalePercentage ?? 0n, omnigemSaleFee = currentFees?.omnigemSaleFee ?? 0n, auctionCreationFee = currentFees?.auctionCreationFee ?? 0n, auctionSaleImpactTaxMin = currentFees?.auctionSaleImpactTaxMin ?? 0n, auctionSaleImpactTaxMax = currentFees?.auctionSaleImpactTaxMax ?? 0n, auctionComposablePercentage = currentFees?.auctionComposablePercentage ?? 0n, auctionRafflePercentage = currentFees?.auctionRafflePercentage ?? 0n, raffleCreationFee = currentFees?.raffleCreationFee ?? 0n, raffleSaleImpactTaxMin = currentFees?.raffleSaleImpactTaxMin ?? 0n, raffleSaleImpactTaxMax = currentFees?.raffleSaleImpactTaxMax ?? 0n, raffleComposablePercentage = currentFees?.raffleComposablePercentage ?? 0n, } = action.value;
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
                            data = (0, app_arc56_1.getABIEncodedValue)(abiData, 'NftFees', this.client.appClient.appSpec.structs);
                            break;
                        }
                        case 'swap_fees': {
                            const currentFees = await this.client.state.global.swapFees();
                            const { impactTaxMin = currentFees?.impactTaxMin ?? 0n, impactTaxMax = currentFees?.impactTaxMax ?? 0n } = action.value;
                            const abiData = {
                                impactTaxMin,
                                impactTaxMax
                            };
                            data = (0, app_arc56_1.getABIEncodedValue)(abiData, 'SwapFees', this.client.appClient.appSpec.structs);
                            break;
                        }
                        case 'akita_assets': {
                            const currentAssets = await this.client.state.global.akitaAssets();
                            const { akta = currentAssets?.akta ?? 0n, bones = currentAssets?.bones ?? 0n } = action.value;
                            data = (0, app_arc56_1.getABIEncodedValue)({ akta, bones }, 'AkitaAssets', this.client.appClient.appSpec.structs);
                            break;
                        }
                        case 'upgrade_app_ps':
                        case 'add_plugin_ps':
                        case 'remove_plugin_ps':
                        case 'add_allowance_ps':
                        case 'remove_allowance_ps':
                        case 'new_escrow_ps':
                        case 'update_fields_ps': {
                            data = (0, app_arc56_1.getABIEncodedValue)(action.value, "ProposalSettings", this.client.appClient.appSpec.structs);
                            break;
                        }
                        case 'revenue_splits': {
                            data = (0, app_arc56_1.getABIEncodedValue)((0, types_2.SplitsToTuples)(action.value), '((uint64,string),uint8,uint64)[]', this.client.appClient.appSpec.structs);
                            break;
                        }
                        default:
                            throw new Error(`Unsupported field`);
                    }
                    abiAction = { field: action.field, value: data };
                    structType = 'ProposalUpdateField';
                    break;
                }
                default: {
                    throw new Error(`Unsupported proposal action type`);
                }
            }
            preppedActions.push([
                typedAction.type,
                (0, app_arc56_1.getABIEncodedValue)(abiAction, structType, this.typeClient.appClient.appSpec.structs)
            ]);
        }
        return preppedActions;
    }
    async initialize(params) {
        const sendParams = this.getSendParams(params);
        return await this.client.send.initialize({
            ...sendParams,
            args: {}
        });
    }
    async newProposal({ sender, signer, cid = constants_3.EMPTY_CID, actions, consolidateFees = true }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const preppedActions = await this.prepProposalActions(actions);
        const group = this.client.newGroup();
        const { total } = await this.client.proposalCost({ args: { actions: preppedActions } });
        const payment = this.client.algorand.createTransaction.payment({
            ...sendParams,
            receiver: this.client.appAddress.toString(),
            amount: (0, algokit_utils_1.microAlgo)(total),
        });
        group.newProposal({
            ...sendParams,
            args: {
                payment,
                cid,
                actions: preppedActions
            }
        });
        for (let i = 0; i < actions.length; i++) {
            group.opUp({ args: {}, note: `${i}` });
        }
        const length = await (await group.composer()).count();
        const suggestedParams = await this.client.algorand.getSuggestedParams();
        const foundation = (await (await group.composer()).build()).atc;
        const maxFees = new Map();
        for (let i = 0; i < length; i += 1) {
            maxFees.set(i, (0, algokit_utils_1.microAlgo)(257000));
        }
        const populatedGroup = await (0, algokit_utils_1.prepareGroupForSending)(foundation, this.client.algorand.client.algod, {
            coverAppCallInnerTransactionFees: true,
            populateAppCallResources: true
        }, {
            maxFees,
            suggestedParams: suggestedParams,
        });
        let overwrite = {};
        if (consolidateFees) {
            const feeConsolidation = populatedGroup.clone().buildGroup();
            const totalFees = feeConsolidation.reduce((acc, txn) => acc + txn.txn.fee, 0n);
            overwrite.fees = new Map([
                [0, (0, algokit_utils_1.microAlgo)(totalFees)],
                ...Array.from({ length: length - 1 }, (_, i) => [i + 1, (0, algokit_utils_1.microAlgo)(0)]),
            ]);
        }
        const finalGroup = (0, utils_1.forceProperties)(populatedGroup, overwrite);
        const groupId = finalGroup.buildGroup()[0].txn.group.toString();
        const { methodResults, ...rest } = await finalGroup.execute(this.client.algorand.client.algod, 10);
        return { groupId, ...rest, return: methodResults ? methodResults[0].returnValue : undefined };
    }
    async editProposal({ sender, signer, id, cid, actions }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const preppedActions = await this.prepProposalActions(actions);
        const req = await Promise.allSettled([
            this.client.state.box.proposals.value(id),
            this.client.proposalCost({ args: { actions: preppedActions } })
        ]);
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
                amount: (0, algokit_utils_1.microAlgo)(cost - feesPaid),
            });
            return await this.client.send.editProposalWithPayment({
                ...sendParams,
                args: {
                    payment,
                    id,
                    cid,
                    actions: preppedActions,
                }
            });
        }
        else {
            return await this.client.send.editProposal({
                ...sendParams,
                args: {
                    id,
                    cid,
                    actions: preppedActions
                }
            });
        }
    }
    async submitProposal({ sender, signer, proposalId }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return await this.client.send.submitProposal({
            ...sendParams,
            args: { proposalId }
        });
    }
    async voteProposal({ proposalId, vote, sender, signer }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const mbrPayment = this.client.algorand.createTransaction.payment({
            ...sendParams,
            receiver: this.client.appAddress.toString(),
            amount: (0, algokit_utils_1.microAlgo)(constants_1.DAOProposalVotesMBR),
        });
        return await this.client.send.voteProposal({
            ...sendParams,
            args: { mbrPayment, proposalId, vote }
        });
    }
    async finalizeProposal({ sender, signer, proposalId }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return await this.client.send.finalizeProposal({
            ...sendParams,
            args: { proposalId }
        });
    }
    async executeProposal({ proposalId, sender, signer }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        return await this.client.send.executeProposal({
            ...sendParams,
            args: { proposalId }
        });
    }
    async getGlobalState() {
        return await this.client.state.global.getAll();
    }
    async setupCost(params) {
        const sendParams = this.getSendParams({
            sender: this.readerAccount,
            signer: constants_2.emptySigner,
            ...params
        });
        const cost = await this.client.setupCost({
            ...sendParams,
            args: {}
        });
        return cost;
    }
    async proposalCost({ sender, signer, actions }) {
        const sendParams = this.getSendParams({
            sender: sender ?? this.readerAccount,
            signer: signer ?? constants_2.emptySigner
        });
        const requirements = await this.client.proposalCost({
            ...sendParams,
            args: { actions: await this.prepProposalActions(actions) },
        });
        return requirements;
    }
    /**
     * Maps proposal action type enum to its corresponding struct type name
     */
    getActionStructType(actionType) {
        switch (actionType) {
            case constants_1.ProposalActionEnum.UpgradeApp:
                return 'ProposalUpgradeApp';
            case constants_1.ProposalActionEnum.AddPlugin:
                return 'ProposalAddPlugin';
            case constants_1.ProposalActionEnum.AddNamedPlugin:
                return 'ProposalAddNamedPlugin';
            case constants_1.ProposalActionEnum.ExecutePlugin:
                return 'ProposalExecutePlugin';
            case constants_1.ProposalActionEnum.RemoveExecutePlugin:
                return 'ProposalRemoveExecutePlugin';
            case constants_1.ProposalActionEnum.RemovePlugin:
                return 'ProposalRemovePlugin';
            case constants_1.ProposalActionEnum.RemoveNamedPlugin:
                return 'ProposalRemoveNamedPlugin';
            case constants_1.ProposalActionEnum.AddAllowances:
                return 'ProposalAddAllowances';
            case constants_1.ProposalActionEnum.RemoveAllowances:
                return 'ProposalRemoveAllowances';
            case constants_1.ProposalActionEnum.NewEscrow:
                return 'ProposalNewEscrow';
            case constants_1.ProposalActionEnum.ToggleEscrowLock:
                return 'ProposalToggleEscrowLock';
            case constants_1.ProposalActionEnum.UpdateFields:
                return 'ProposalUpdateField';
            default:
                throw new Error(`Unknown proposal action type: ${actionType}`);
        }
    }
    /**
     * Decodes the raw action bytes into their typed struct representation
     */
    decodeProposalAction(actionType, actionData) {
        const structType = this.getActionStructType(actionType);
        const structs = this.typeClient.appClient.appSpec.structs;
        switch (actionType) {
            case constants_1.ProposalActionEnum.UpgradeApp: {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(actionData, structType, structs);
                return { type: constants_1.ProposalActionEnum.UpgradeApp, ...decoded };
            }
            case constants_1.ProposalActionEnum.AddPlugin: {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(actionData, structType, structs);
                return { type: constants_1.ProposalActionEnum.AddPlugin, ...decoded };
            }
            case constants_1.ProposalActionEnum.AddNamedPlugin: {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(actionData, structType, structs);
                return { type: constants_1.ProposalActionEnum.AddNamedPlugin, ...decoded };
            }
            case constants_1.ProposalActionEnum.ExecutePlugin: {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(actionData, structType, structs);
                return { type: constants_1.ProposalActionEnum.ExecutePlugin, ...decoded };
            }
            case constants_1.ProposalActionEnum.RemoveExecutePlugin: {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(actionData, structType, structs);
                return { type: constants_1.ProposalActionEnum.RemoveExecutePlugin, ...decoded };
            }
            case constants_1.ProposalActionEnum.RemovePlugin: {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(actionData, structType, structs);
                return { type: constants_1.ProposalActionEnum.RemovePlugin, ...decoded };
            }
            case constants_1.ProposalActionEnum.RemoveNamedPlugin: {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(actionData, structType, structs);
                return { type: constants_1.ProposalActionEnum.RemoveNamedPlugin, ...decoded };
            }
            case constants_1.ProposalActionEnum.AddAllowances: {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(actionData, structType, structs);
                return { type: constants_1.ProposalActionEnum.AddAllowances, ...decoded };
            }
            case constants_1.ProposalActionEnum.RemoveAllowances: {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(actionData, structType, structs);
                return { type: constants_1.ProposalActionEnum.RemoveAllowances, ...decoded };
            }
            case constants_1.ProposalActionEnum.NewEscrow: {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(actionData, structType, structs);
                return { type: constants_1.ProposalActionEnum.NewEscrow, ...decoded };
            }
            case constants_1.ProposalActionEnum.ToggleEscrowLock: {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(actionData, structType, structs);
                return { type: constants_1.ProposalActionEnum.ToggleEscrowLock, ...decoded };
            }
            case constants_1.ProposalActionEnum.UpdateFields: {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(actionData, structType, structs);
                return { type: constants_1.ProposalActionEnum.UpdateFields, ...decoded };
            }
            default:
                throw new Error(`Unknown proposal action type: ${actionType}`);
        }
    }
    /**
     * Fetches a proposal by ID and decodes all action data into typed structs
     */
    async getProposal(proposalId) {
        const proposal = await this.client.getProposal({ args: { proposalId } });
        if (!proposal) {
            throw new Error(`Proposal with id: ${proposalId} not found`);
        }
        const decodedActions = proposal.actions.map(([actionType, actionData]) => {
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
exports.AkitaDaoSDK = AkitaDaoSDK;
//# sourceMappingURL=index.js.map