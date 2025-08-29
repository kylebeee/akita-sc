import { uint64 } from "@algorandfoundation/algorand-typescript"

export const AbstractAccountNumGlobalBytes: uint64 = 9 // 450_000
export const AbstractAccountNumGlobalUints: uint64 = 9 // 256_500

// min: 656_500 gs
// total: 1_056_500 algo

// max: 2_985_000 gs
// total: 3_385_000 algo

export const AbstractAccountGlobalStateKeysAdmin = 'admin'
export const AbstractAccountGlobalStateKeysDomain = 'domain'
export const AbstractAccountGlobalStateKeysControlledAddress = 'controlled_address'
export const AbstractAccountGlobalStateKeysNickname = 'nickname'
export const AbstractAccountGlobalStateKeysAvatar = 'avatar'
export const AbstractAccountGlobalStateKeysBanner = 'banner'
export const AbstractAccountGlobalStateKeysBio = 'bio'
export const AbstractAccountGlobalStateKeysLastUserInteraction = 'last_user_interaction'
export const AbstractAccountGlobalStateKeysLastChange = 'last_change'
export const AbstractAccountGlobalStateKeysSpendingAddress = 'spending_address'
export const AbstractAccountGlobalStateKeysCurrentEscrow = 'current_escrow'
export const AbstractAccountGlobalStateKeysRekeyIndex = 'rekey_index'
export const AbstractAccountGlobalStateKeysEscrowFactory = 'escrow_factory'
export const AbstractAccountGlobalStateKeysFactoryApp = 'factory_app'
export const AbstractAccountGlobalStateKeysReferrer = 'referrer'

export const AbstractAccountBoxPrefixPlugins = 'p'
export const AbstractAccountBoxPrefixNamedPlugins = 'n'
export const AbstractAccountBoxPrefixEscrows = 'e'
export const AbstractAccountBoxPrefixAllowances = 'a'
export const AbstractAccountBoxPrefixDomainKeys = 'd'
export const AbstractAccountBoxPrefixExecutions = 'x'

export const MethodRestrictionByteLength: uint64 = 20

export const MinPluginMBR: uint64 = 38_900
export const MinNamedPluginMBR: uint64 = 18_900
export const MinEscrowsMBR: uint64 = 6_500
export const MinAllowanceMBR: uint64 = 27_700
export const MinExecutionsMBR: uint64 = 20_500
export const MinDomainKeysMBR: uint64 = 15_700

export const AbstractedAccountFactoryGlobalStateKeyDomain = 'domain'

export const ABSTRACTED_ACCOUNT_MINT_PAYMENT: uint64 = 1_028_000 + 12_100 // 1_028_000 for the account, 12_100 for the escrow factory