import { uint64 } from "@algorandfoundation/algorand-typescript"

export const AbstractAccountNumGlobalBytes: uint64 = 54
export const AbstractAccountNumGlobalUints: uint64 = 10

export const AbstractAccountGlobalStateKeysAdmin = 'admin'
export const AbstractAccountGlobalStateKeysControlledAddress = 'controlled_address'
export const AbstractAccountGlobalStateKeysNickname = 'nickname'
export const AbstractAccountGlobalStateKeysAvatar = 'avatar'
export const AbstractAccountGlobalStateKeysBanner = 'banner'
export const AbstractAccountGlobalStateKeysBio = 'bio'
export const AbstractAccountGlobalStateKeysLastUserInteraction = 'last_user_interaction'
export const AbstractAccountGlobalStateKeysLastChange = 'last_change'
export const AbstractAccountGlobalStateKeysSpendingAddress = 'spending_address'
export const AbstractAccountGlobalStateKeysCurrentEscrowID = 'current_escrow_id'
export const AbstractAccountGlobalStateKeysRekeyIndex = 'rekey_index'
export const AbstractAccountGlobalStateKeysEscrowFactory = 'escrow_factory'
export const AbstractAccountGlobalStateKeysFactoryApp = 'factory_app'

export const AbstractAccountBoxPrefixPlugins = 'p'
export const AbstractAccountBoxPrefixNamedPlugins = 'n'
export const AbstractAccountBoxPrefixEscrows = 'e'
export const AbstractAccountBoxPrefixAllowances = 'a'
export const AbstractAccountBoxPrefixDomainKeys = 'd'
export const AbstractAccountBoxPrefixExecutions = 'x'

export const MethodRestrictionByteLength: uint64 = 20

export const MinPluginMBR: uint64 = 39_700
export const MinNamedPluginMBR: uint64 = 18_900
export const EscrowsMBR: uint64 = 6_500
export const MinNamedEscrowsMBR: uint64 = 6_100
export const AllowanceMBR: uint64 = 29_300
export const MinDomainKeysMBR: uint64 = 15_700

export const ABSTRACTED_ACCOUNT_MINT_PAYMENT: uint64 = 1_028_000 + 12_100 // 1_028_000 for the account, 12_100 for the escrow factory