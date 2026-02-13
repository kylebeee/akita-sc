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
export function encodeConnectUri({ origin, requestId }: AkitaConnectUri): string {
  return `liquid://${origin}?requestId=${encodeURIComponent(requestId)}`
}

/**
 * Decode a liquid:// connect URI into its components.
 *
 * @throws {Error} If the URI is not a valid liquid:// connect URI or is missing requestId.
 */
export function decodeConnectUri(uri: string): AkitaConnectUri {
  const trimmed = uri.trim()

  if (!trimmed.toLowerCase().startsWith('liquid://')) {
    throw new Error(`Invalid connect URI: expected liquid:// scheme, got "${trimmed}"`)
  }

  // Replace liquid:// with https:// so URL parser can handle it
  const asHttps = 'https://' + trimmed.slice('liquid://'.length)
  const parsed = new URL(asHttps)

  const origin = parsed.host
  if (!origin) {
    throw new Error(`Invalid connect URI: missing host in "${trimmed}"`)
  }

  const requestId = parsed.searchParams.get('requestId') || parsed.searchParams.get('request_id')
  if (!requestId) {
    throw new Error(`Invalid connect URI: missing requestId parameter in "${trimmed}"`)
  }

  return { origin, requestId }
}
