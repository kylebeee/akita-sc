import { BaseSDK } from "../../base";
import { AkitaDaoPluginArgs, AkitaDaoPluginClient } from "../../generated/AkitaDAOPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = AkitaDaoPluginArgs["obj"];
type SetupArgs = (Omit<ContractArgs['setup(uint64,bool,string)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type NewProposalArgs = (Omit<ContractArgs['newProposal(uint64,bool,byte[36],(uint8,byte[])[])uint64'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type VoteProposalArgs = (Omit<ContractArgs['voteProposal(uint64,bool,uint64,uint8)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type FinalizeProposalArgs = (Omit<ContractArgs['finalizeProposal(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type ExecuteProposalArgs = (Omit<ContractArgs['executeProposal(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class DAOPluginSDK extends BaseSDK<AkitaDaoPluginClient> {
    constructor(params: NewContractSDKParams);
    setup(): PluginSDKReturn;
    setup(args: SetupArgs): PluginSDKReturn;
    newProposal(): PluginSDKReturn;
    newProposal(args: NewProposalArgs): PluginSDKReturn;
    voteProposal(): PluginSDKReturn;
    voteProposal(args: VoteProposalArgs): PluginSDKReturn;
    finalizeProposal(): PluginSDKReturn;
    finalizeProposal(args: FinalizeProposalArgs): PluginSDKReturn;
    executeProposal(): PluginSDKReturn;
    executeProposal(args: ExecuteProposalArgs): PluginSDKReturn;
}
export {};
