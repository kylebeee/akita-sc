"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/connect/uri.ts
function encodeConnectUri({ origin, requestId }) {
  return `liquid://${origin}?requestId=${encodeURIComponent(requestId)}`;
}
function decodeConnectUri(uri) {
  const trimmed = uri.trim();
  if (!trimmed.toLowerCase().startsWith("liquid://")) {
    throw new Error(`Invalid connect URI: expected liquid:// scheme, got "${trimmed}"`);
  }
  const asHttps = "https://" + trimmed.slice("liquid://".length);
  const parsed = new URL(asHttps);
  const origin = parsed.host;
  if (!origin) {
    throw new Error(`Invalid connect URI: missing host in "${trimmed}"`);
  }
  const requestId = parsed.searchParams.get("requestId") || parsed.searchParams.get("request_id");
  if (!requestId) {
    throw new Error(`Invalid connect URI: missing requestId parameter in "${trimmed}"`);
  }
  return { origin, requestId };
}




exports.encodeConnectUri = encodeConnectUri; exports.decodeConnectUri = decodeConnectUri;
//# sourceMappingURL=chunk-Q5ZVFKLX.js.map