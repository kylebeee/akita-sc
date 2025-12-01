import { uint64 } from '@algorandfoundation/algorand-typescript'

export const StakingGlobalStateKeyHeartbeatManagerAddress = 'heartbeat_manager_address'

export const StakingBoxPrefixStakes = 's'
export const StakingBoxPrefixHeartbeats = 'h'
export const StakingBoxPrefixTotals = 't'
export const StakingBoxPrefixSettings = 'e'

export const StakesMBR: uint64 = 28_900
export const HeartbeatsMBR: uint64 = 70_100
export const SettingsMBR: uint64 = 9_300
export const totalsMBR: uint64 = 12_500

export const ONE_YEAR: uint64 = 31_536_000 // 365 days * 24 hours * 60 minutes * 60 seconds
