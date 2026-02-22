export declare enum ServiceStatus {
    None = 0,
    Draft = 10,
    Active = 20,
    Paused = 30,
    Shutdown = 40
}
export declare enum HighlightMessage {
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
export declare const MAX_DESCRIPTION_LENGTH = 3151;
export declare const MAX_DESCRIPTION_CHUNK_SIZE = 2034;
export declare const MAX_LOAD_DESCRIPTION_CHUNK_SIZE = 2026;
