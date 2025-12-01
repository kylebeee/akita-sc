export enum ProposalActionEnum {
  UpgradeApp = 10,
  AddPlugin = 20,
  AddNamedPlugin = 21,
  ExecutePlugin = 30,
  RemoveExecutePlugin = 31,
  RemovePlugin = 40,
  RemoveNamedPlugin = 41,
  AddAllowances = 50,
  RemoveAllowances = 60,
  NewEscrow = 70,
  ToggleEscrowLock = 71,
  UpdateFields = 80
}

export const EMPTY_CID = Buffer.from('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')

export const DAOProposalVotesMBR: bigint = 22_500n