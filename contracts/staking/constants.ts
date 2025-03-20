import { arc4Zero } from "../../utils/constants"
import { arc4HeartbeatValues } from "./types"

export const StakingGlobalStateKeyHeartbeatManagerAddress = 'heartbeat_manager_address'

export const StakingBoxPrefixStakes = 's'
export const StakingBoxPrefixHeartbeats = 'h'

export const EmptyHeartbeatValue = new arc4HeartbeatValues({
    held: arc4Zero,
    hard: arc4Zero,
    lock: arc4Zero,
    timestamp: arc4Zero
})

export const lockMBR = 28_900
export const heartBeatMBR = 44_100
export const ONE_YEAR = 31_536_000 // 365 days * 24 hours * 60 minutes * 60 seconds