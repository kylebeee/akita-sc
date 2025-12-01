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
// max description chunk size per transaction
// [selector:4][offset:8][data:2036] = 2048
export const MAX_DESCRIPTION_CHUNK_SIZE = 2036