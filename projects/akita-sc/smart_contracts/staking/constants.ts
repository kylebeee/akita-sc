import { uint64 } from '@algorandfoundation/algorand-typescript'

export const StakingGlobalStateKeyHeartbeatManagerAddress = 'heartbeat_manager_address'

export const StakingBoxPrefixStakes = 's'
export const StakingBoxPrefixHeartbeats = 'h'
export const StakingBoxPrefixSettings = 'e'

export const ONE_YEAR: uint64 = 31_536_000 // 365 days * 24 hours * 60 minutes * 60 seconds
