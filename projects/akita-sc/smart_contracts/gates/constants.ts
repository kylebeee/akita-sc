import { uint64 } from "@algorandfoundation/algorand-typescript"

export const GateGlobalStateKeyCursor = 'gate_cursor'
export const GateGlobalStateKeyRegistryCursor = 'registry_cursor'

export const GateGlobalStateKeyRegistrationShape = 'registration_shape'
export const GateGlobalStateKeyCheckShape = 'check_shape'

export const GateBoxPrefixAppRegistry = 'a'
export const GateBoxPrefixGateRegistry = 'g'

export const OperatorAndValueByteLength: uint64 = 9

export const OperatorAndValueRegistryMBR: uint64 = 9_300
export const UserOperatorValueRegistryMBR: uint64 = 22_100
export const MinMetaMerkleRegistryMBR: uint64 = 18_500