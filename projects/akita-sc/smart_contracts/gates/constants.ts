import { uint64 } from "@algorandfoundation/algorand-typescript"

export const GateMustCheckAbiMethod = 'mustCheck(address,uint64,byte[][])void'

export const GateGlobalStateKeyCursor = 'gate_cursor'
export const GateGlobalStateKeyRegistryCursor = 'registry_cursor'

export const GateGlobalStateKeyRegistrationShape = 'registration_shape'
export const GateGlobalStateKeyCheckShape = 'check_shape'

export const GateBoxPrefixAppRegistry = 'a'
export const GateBoxPrefixGateRegistry = 'g'

export const OperatorAndValueByteLength: uint64 = 9

// AssetGateRegistryInfo: uint64 (asset) + uint8 (op) + uint64 (value) = 17 bytes
export const AssetGateRegistryInfoByteLength: uint64 = 17

export const OperatorAndValueRegistryMBR: uint64 = 9_300
export const UserOperatorValueRegistryMBR: uint64 = 22_100
export const MinMetaMerkleRegistryMBR: uint64 = 18_500