export const BoxKeySubscriptionsDescription = 'd'

// max chunk size for loadDescription(wallet, offset, data)
// [selector:4][wallet:8][offset:8][data_length:2][data:N] = 2048
// overhead = 22 bytes, max data = 2026 bytes
export const MAX_LOAD_DESCRIPTION_CHUNK_SIZE = 2026