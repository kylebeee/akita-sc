export function convertToUnixTimestamp(timestamp: bigint): bigint {
  return timestamp * 1_000n;
}

export function convertFromUnixTimestamp(timestamp: bigint): bigint {
  return timestamp / 1_000n;
}