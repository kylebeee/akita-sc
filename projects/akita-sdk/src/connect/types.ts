/**
 * General-purpose connection request/response types for the Akita Connect protocol.
 *
 * These types define the payloads sent over a WebRTC data channel after a
 * liquid:// URI-based connection is established between two peers.
 */

// ---------------------------------------------------------------------------
// URI
// ---------------------------------------------------------------------------

/** Parsed liquid:// connect URI */
export interface AkitaConnectUri {
  /** Signaling server origin (e.g. "signal.akita.community") */
  origin: string
  /** Session request ID (UUID) */
  requestId: string
}

// ---------------------------------------------------------------------------
// Serialized allowance (bigints encoded as strings for JSON transport)
// ---------------------------------------------------------------------------

export type SerializedAllowance =
  | {
      asset: string
      type: 'flat'
      amount: string
      useRounds?: boolean
    }
  | {
      asset: string
      type: 'window'
      amount: string
      interval: string
      useRounds?: boolean
    }
  | {
      asset: string
      type: 'drip'
      rate: string
      max: string
      interval: string
      useRounds?: boolean
    }

// ---------------------------------------------------------------------------
// Serialized plugin method definition
// ---------------------------------------------------------------------------

export interface SerializedMethodDefinition {
  /** 4-byte ABI method selector as hex string (e.g. "a1b2c3d4") */
  name: string
  cooldown: string
}

// ---------------------------------------------------------------------------
// Agent install plugin entry
// ---------------------------------------------------------------------------

export interface AgentInstallPlugin {
  /** Plugin identifier (sdkKey from NetworkAppIds, e.g. "payPlugin") */
  id: string
  /** 0 = Global, 1 = Admin, 2 = Agent (caller-scoped) */
  delegationType: number
  /** Whether the wallet owner covers transaction fees */
  coverFees?: boolean
  /** Whether to default plugin execution to the escrow */
  defaultToEscrow?: boolean
  /** Whether to use an execution key */
  useExecutionKey?: boolean
  /** Method cooldown in seconds (default 0) */
  cooldown?: string
  /** Spending allowances for this plugin */
  allowances?: SerializedAllowance[]
  /** Method restrictions */
  methods?: SerializedMethodDefinition[]
}

// ---------------------------------------------------------------------------
// Connect requests (discriminated union by `type`)
// ---------------------------------------------------------------------------

export interface AgentInstallRequest {
  type: 'agent-install'
  v: 1
  agent: {
    name: string
    address: string
  }
  network: 'localnet' | 'testnet' | 'mainnet'
  escrowName: string
  /** When true, the app sends 4.352 ALGO to the agent address for MBR */
  newAgentAccount: boolean
  plugins: AgentInstallPlugin[]
}

// Future request types can be added here:
// export interface PasskeyCreateRequest { type: 'passkey-create'; ... }

export type ConnectRequest = AgentInstallRequest
// = AgentInstallRequest | PasskeyCreateRequest | ...

// ---------------------------------------------------------------------------
// Connect responses (discriminated union by `type`)
// ---------------------------------------------------------------------------

export interface AgentInstallResponse {
  type: 'agent-install'
  success: true
  walletAppId: string
  escrowAddress: string
  network: string
}

export interface ConnectErrorResponse {
  type: 'error'
  success: false
  message: string
}

export type ConnectResponse = AgentInstallResponse | ConnectErrorResponse
