import { AkitaDaoArgs, AkitaDaoClient, ProposalCostInfo } from '../generated/AkitaDAOClient';
import { AkitaDaoTypesClient } from '../generated/AkitaDAOTypesClient';
import { BaseSDK } from "../base";
import { MaybeSigner, NewContractSDKParams, SDKClient, TxnReturn } from "../types";
import { WalletSDK } from "../wallet";
import { AkitaDaoGlobalState, DecodedProposal, EditProposalParams, NewProposalParams, ProposalAction } from "./types";
import { AppReturn } from "@algorandfoundation/algokit-utils/types/app";
export * from './constants';
export * from "./types";
type ContractArgs = AkitaDaoArgs["obj"];
export declare class AkitaDaoSDK extends BaseSDK<AkitaDaoClient> {
    typeClient: AkitaDaoTypesClient;
    private _wallet;
    private _walletInitPromise;
    private _constructorParams;
    constructor(params: NewContractSDKParams);
    /**
     * Get the wallet SDK associated with this DAO.
     * Lazily fetches the wallet app ID from the DAO's global state on first access.
     */
    getWallet(): Promise<WalletSDK>;
    private _initializeWallet;
    /**
     * @deprecated Use getWallet() instead for proper async initialization.
     * This getter exists for backwards compatibility but will throw if the wallet
     * hasn't been initialized yet via getWallet() or setup().
     */
    get wallet(): WalletSDK;
    /**
     * Allows setting the wallet directly (used by setup() and for testing)
     */
    set wallet(wallet: WalletSDK);
    private prepProposalActions;
    initialize(params?: MaybeSigner): Promise<TxnReturn<void>>;
    newProposal<TClient extends SDKClient>({ sender, signer, cid, actions, consolidateFees }: NewProposalParams<TClient>): Promise<{
        groupId: string;
        confirmedRound: bigint;
        txIDs: string[];
    } & AppReturn<bigint | undefined>>;
    editProposal<TClient extends SDKClient>({ sender, signer, id, cid, actions }: EditProposalParams<TClient>): Promise<TxnReturn<void>>;
    submitProposal({ sender, signer, proposalId }: ContractArgs['submitProposal(uint64)void'] & MaybeSigner): Promise<TxnReturn<void>>;
    voteProposal({ proposalId, vote, sender, signer }: ContractArgs['voteProposal(pay,uint64,uint8)void'] & MaybeSigner): Promise<TxnReturn<void>>;
    finalizeProposal({ sender, signer, proposalId }: ContractArgs['finalizeProposal(uint64)void'] & MaybeSigner): Promise<TxnReturn<void>>;
    executeProposal({ proposalId, sender, signer }: ContractArgs['executeProposal(uint64)void'] & MaybeSigner): Promise<TxnReturn<void>>;
    getGlobalState(): Promise<AkitaDaoGlobalState>;
    setupCost(params?: MaybeSigner): Promise<bigint>;
    proposalCost<TClient extends SDKClient>({ sender, signer, actions }: {
        actions: ProposalAction<TClient>[];
    } & MaybeSigner): Promise<ProposalCostInfo>;
    /**
     * Maps proposal action type enum to its corresponding struct type name
     */
    private getActionStructType;
    /**
     * Decodes the raw action bytes into their typed struct representation
     */
    private decodeProposalAction;
    /**
     * Fetches a proposal by ID and decodes all action data into typed structs
     */
    getProposal(proposalId: bigint): Promise<DecodedProposal>;
}
