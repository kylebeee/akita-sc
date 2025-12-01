import { AkitaAppList, AkitaAssets, AkitaDaoArgs, GlobalKeysState, NftFees, OtherAppList, PluginAppList, ProposalSettings, ProposalVoteTotals, SocialFees, StakingFees, SubscriptionFees, SwapFees, WalletFees } from "../generated/AkitaDAOClient";
import { 
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
} from "../generated/AkitaDAOTypesClient";
import { ProposalActionEnum } from "./constants";
import { AddAllowanceArgs, AddPluginArgs, WalletAddPluginParams } from "../wallet";
import { MaybeSigner, SDKClient } from "../types";

type ContractArgs = AkitaDaoArgs["obj"];

export type AkitaDaoGlobalState = GlobalKeysState;

export type ProposalAction<TClient extends SDKClient> = (
  | {
    type: ProposalActionEnum.UpgradeApp
    app: bigint
    executionKey: Uint8Array
    groups: Uint8Array[]
    firstValid: bigint
    lastValid: bigint
  }
  | (
    Omit<WalletAddPluginParams<TClient>, 'sender' | 'signer' | 'useExecutionKey'>
    & {
      type: ProposalActionEnum.AddPlugin | ProposalActionEnum.AddNamedPlugin
      sourceLink: string
    }
    & (
      {
        useExecutionKey: false
      }
      | {
        useExecutionKey: true
        fee: bigint
        power: bigint
        duration: bigint
        participation: bigint
        approval: bigint
      }
    )
  )
  | {
    type: ProposalActionEnum.ExecutePlugin
    plugin: bigint
    caller: string
    escrow: string
    executionKey: Uint8Array
    groups: Uint8Array[]
    firstValid: bigint
    lastValid: bigint
  }
  | {
    type: ProposalActionEnum.RemoveExecutePlugin
    executionKey: Uint8Array
  }
  | {
    type: ProposalActionEnum.RemovePlugin
    plugin: bigint
    caller: string
    escrow: string
  }
  | {
    type: ProposalActionEnum.RemoveNamedPlugin
    name: string
  }
  | {
    type: ProposalActionEnum.AddAllowances
    escrow: string
    allowances: AddAllowanceArgs[]
  }
  | {
    type: ProposalActionEnum.RemoveAllowances
    escrow: string
    assets: bigint[]
  }
  | {
    type: ProposalActionEnum.NewEscrow | ProposalActionEnum.ToggleEscrowLock
    escrow: string
  }
  | FieldUpdate & {
    type: ProposalActionEnum.UpdateFields
  }
)

export type FieldUpdate = (
  | { field: 'content_policy', value: Uint8Array }
  | {
    field: 'proposal_action_limit' | 'min_rewards_impact',
    value: number
  }
  | { field: 'akita_al', value: Partial<AkitaAppList> }
  | { field: 'plugn_al', value: Partial<PluginAppList> }
  | { field: 'other_al', value: Partial<OtherAppList> }
  | { field: 'wallet_fees', value: WalletFees } // only one value for now so no need for partial
  | { field: 'social_fees', value: Partial<SocialFees> }
  | { field: 'staking_fees', value: Partial<StakingFees> }
  | { field: 'subscription_fees', value: Partial<SubscriptionFees> }
  | { field: 'nft_fees', value: Partial<NftFees> }
  | { field: 'swap_fees', value: Partial<SwapFees> }
  | { field: 'akita_assets', value: Partial<AkitaAssets> }
  | {
    field: 'upgrade_app_ps' | 'add_plugin_ps' | 'remove_plugin_ps' | 'add_allowance_ps' | 'remove_allowance_ps' | 'new_escrow_ps' | 'update_fields_ps',
    value: Partial<ProposalSettings>
  }
)

export type NewProposalParams<TClient extends SDKClient> = (
  {
    cid?: Uint8Array;
    actions: ProposalAction<TClient>[],
    consolidateFees?: boolean
  } & MaybeSigner
)

export type EditProposalParams<TClient extends SDKClient> = (
  ContractArgs['editProposal(uint64,byte[36],(uint8,byte[])[])void']
  & {
    actions: ProposalAction<TClient>[]
  } & MaybeSigner
)

export type ProposalAddPluginArgs = (
  AddPluginArgs & {
    fee?: bigint;
    power?: bigint;
    duration?: bigint;
    participation?: bigint;
    approval?: bigint;
    sourceLink: string;
    allowances: [number | bigint, number | bigint, number | bigint, number | bigint, number | bigint, boolean][];
  }
)

/**
 * Union type for all decoded proposal action types
 */
export type DecodedProposalAction = (
  | ({ type: ProposalActionEnum.UpgradeApp } & ProposalUpgradeApp)
  | ({ type: ProposalActionEnum.AddPlugin } & ProposalAddPlugin)
  | ({ type: ProposalActionEnum.AddNamedPlugin } & ProposalAddNamedPlugin)
  | ({ type: ProposalActionEnum.ExecutePlugin } & ProposalExecutePlugin)
  | ({ type: ProposalActionEnum.RemoveExecutePlugin } & ProposalRemoveExecutePlugin)
  | ({ type: ProposalActionEnum.RemovePlugin } & ProposalRemovePlugin)
  | ({ type: ProposalActionEnum.RemoveNamedPlugin } & ProposalRemoveNamedPlugin)
  | ({ type: ProposalActionEnum.AddAllowances } & ProposalAddAllowances)
  | ({ type: ProposalActionEnum.RemoveAllowances } & ProposalRemoveAllowances)
  | ({ type: ProposalActionEnum.NewEscrow } & ProposalNewEscrow)
  | ({ type: ProposalActionEnum.ToggleEscrowLock } & ProposalToggleEscrowLock)
  | ({ type: ProposalActionEnum.UpdateFields } & ProposalUpdateField)
)

/**
 * Decoded proposal with typed actions
 */
export type DecodedProposal = {
  status: number;
  cid: Uint8Array;
  votes: ProposalVoteTotals;
  creator: string;
  votingTs: bigint;
  created: bigint;
  feesPaid: bigint;
  actions: DecodedProposalAction[];
}