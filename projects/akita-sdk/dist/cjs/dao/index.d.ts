import { AkitaDaoArgs, AkitaDaoClient, ProposalCostInfo } from '../generated/AkitaDAOClient';
import { AkitaDaoTypesClient } from '../generated/AkitaDAOTypesClient';
import { BaseSDK } from "../base";
import { GroupReturn, MaybeSigner, NewContractSDKParams, SDKClient, TxnReturn } from "../types";
import { WalletSDK } from "../wallet";
import { AkitaDaoGlobalState, DecodedProposal, EditProposalParams, NewProposalParams, ProposalAction } from "./types";
import { AppReturn } from "@algorandfoundation/algokit-utils/types/app";
export * from './constants';
export * from "./types";
type ContractArgs = AkitaDaoArgs["obj"];
export declare class AkitaDaoSDK extends BaseSDK<AkitaDaoClient> {
    typeClient: AkitaDaoTypesClient;
    wallet: WalletSDK;
    constructor(params: NewContractSDKParams);
    private prepProposalActions;
    setup(params?: MaybeSigner): Promise<GroupReturn>;
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
