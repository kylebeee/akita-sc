export enum ServiceStatus {
  None = 0,
  Draft = 10,
  Active = 20,
  Paused = 30,
  Shutdown = 40
}

export enum HighlightMessage {
  None = 0,
  BestValue = 1,
  Popular = 2,
  New = 3,
  LimitedOffer = 4,
  Recommended = 5,
  Trending = 6,
  StaffPick = 7,
  TopRated = 8,
  EditorChoice = 9,
  HotDeal = 10,
  Seasonal = 11,
  FlashSale = 12,
  Exclusive = 13,
  LimitedEdition = 14,
  EarlyAccess = 15
}

export const MAX_DESCRIPTION_LENGTH = 3151

// max chunk size for Subscriptions.setServiceDescription(offset, data)
// [selector:4][offset:8][data_length:2][data:N] = 2048
// overhead = 14 bytes, max data = 2034 bytes
export const MAX_DESCRIPTION_CHUNK_SIZE = 2034

// max chunk size for SubscriptionsPlugin.loadDescription(wallet, offset, data)
// [selector:4][wallet:8][offset:8][data_length:2][data:N] = 2048
// overhead = 22 bytes, max data = 2026 bytes
export const MAX_LOAD_DESCRIPTION_CHUNK_SIZE = 2026