/**
 * Encode/decode helpers for the liquid:// connect URI scheme.
 *
 * URI format: liquid://<signaling-server-host>?requestId=<uuid>
 */
import type { AkitaConnectUri } from './types';
/**
 * Encode a connect URI from its components.
 *
 * @example
 * encodeConnectUri({ origin: "signal.akita.community", requestId: "abc-123" })
 * // => "liquid://signal.akita.community?requestId=abc-123"
 */
export declare function encodeConnectUri({ origin, requestId }: AkitaConnectUri): string;
/**
 * Decode a liquid:// connect URI into its components.
 *
 * @throws {Error} If the URI is not a valid liquid:// connect URI or is missing requestId.
 */
export declare function decodeConnectUri(uri: string): AkitaConnectUri;
