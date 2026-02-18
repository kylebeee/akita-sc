/**
 * General-purpose connection request/response types for the Akita Connect protocol.
 *
 * These types define the payloads sent over a WebRTC data channel after a
 * liquid:// URI-based connection is established between two peers.
 */
/** Parsed liquid:// connect URI */
export interface AkitaConnectUri {
    /** Signaling server origin (e.g. "signal.akita.community") */
    origin: string;
    /** Session request ID (UUID) */
    requestId: string;
}
export type SerializedAllowance = {
    asset: string;
    type: 'flat';
    amount: string;
    useRounds?: boolean;
} | {
    asset: string;
    type: 'window';
    amount: string;
    interval: string;
    useRounds?: boolean;
} | {
    asset: string;
    type: 'drip';
    rate: string;
    max: string;
    interval: string;
    useRounds?: boolean;
};
export interface SerializedMethodDefinition {
    /** 4-byte ABI method selector as hex string (e.g. "a1b2c3d4") */
    name: string;
    cooldown: string;
}
export interface AgentInstallPlugin {
    /** Plugin identifier (sdkKey from NetworkAppIds, e.g. "payPlugin") */
    id: string;
    /** Whether the wallet owner covers transaction fees */
    coverFees?: boolean;
    /** Method cooldown in seconds (default 0) */
    cooldown?: string;
    /** Spending allowances for this plugin */
    allowances?: SerializedAllowance[];
    /** Method restrictions */
    methods?: SerializedMethodDefinition[];
}
export interface AgentInstallRequest {
    type: 'agent-install';
    v: 1;
    agent: {
        name: string;
        address: string;
    };
    network: 'localnet' | 'testnet' | 'mainnet';
    escrowName: string;
    /** When true, the app sends 4.352 ALGO to the agent address for MBR */
    newAgentAccount: boolean;
    plugins: AgentInstallPlugin[];
}
export type ConnectRequest = AgentInstallRequest;
export interface AgentInstallResponse {
    type: 'agent-install';
    success: true;
    walletAppId: string;
    escrowAddress: string;
    network: string;
}
export interface ConnectErrorResponse {
    type: 'error';
    success: false;
    message: string;
}
export type ConnectResponse = AgentInstallResponse | ConnectErrorResponse;
