"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_LOAD_DESCRIPTION_CHUNK_SIZE = exports.MAX_DESCRIPTION_CHUNK_SIZE = exports.MAX_DESCRIPTION_LENGTH = exports.HighlightMessage = exports.ServiceStatus = void 0;
var ServiceStatus;
(function (ServiceStatus) {
    ServiceStatus[ServiceStatus["None"] = 0] = "None";
    ServiceStatus[ServiceStatus["Draft"] = 10] = "Draft";
    ServiceStatus[ServiceStatus["Active"] = 20] = "Active";
    ServiceStatus[ServiceStatus["Paused"] = 30] = "Paused";
    ServiceStatus[ServiceStatus["Shutdown"] = 40] = "Shutdown";
})(ServiceStatus || (exports.ServiceStatus = ServiceStatus = {}));
var HighlightMessage;
(function (HighlightMessage) {
    HighlightMessage[HighlightMessage["None"] = 0] = "None";
    HighlightMessage[HighlightMessage["BestValue"] = 1] = "BestValue";
    HighlightMessage[HighlightMessage["Popular"] = 2] = "Popular";
    HighlightMessage[HighlightMessage["New"] = 3] = "New";
    HighlightMessage[HighlightMessage["LimitedOffer"] = 4] = "LimitedOffer";
    HighlightMessage[HighlightMessage["Recommended"] = 5] = "Recommended";
    HighlightMessage[HighlightMessage["Trending"] = 6] = "Trending";
    HighlightMessage[HighlightMessage["StaffPick"] = 7] = "StaffPick";
    HighlightMessage[HighlightMessage["TopRated"] = 8] = "TopRated";
    HighlightMessage[HighlightMessage["EditorChoice"] = 9] = "EditorChoice";
    HighlightMessage[HighlightMessage["HotDeal"] = 10] = "HotDeal";
    HighlightMessage[HighlightMessage["Seasonal"] = 11] = "Seasonal";
    HighlightMessage[HighlightMessage["FlashSale"] = 12] = "FlashSale";
    HighlightMessage[HighlightMessage["Exclusive"] = 13] = "Exclusive";
    HighlightMessage[HighlightMessage["LimitedEdition"] = 14] = "LimitedEdition";
    HighlightMessage[HighlightMessage["EarlyAccess"] = 15] = "EarlyAccess";
})(HighlightMessage || (exports.HighlightMessage = HighlightMessage = {}));
exports.MAX_DESCRIPTION_LENGTH = 3151;
// max chunk size for Subscriptions.setServiceDescription(offset, data)
// [selector:4][offset:8][data_length:2][data:N] = 2048
// overhead = 14 bytes, max data = 2034 bytes
exports.MAX_DESCRIPTION_CHUNK_SIZE = 2034;
// max chunk size for SubscriptionsPlugin.loadDescription(wallet, offset, data)
// [selector:4][wallet:8][offset:8][data_length:2][data:N] = 2048
// overhead = 22 bytes, max data = 2026 bytes
exports.MAX_LOAD_DESCRIPTION_CHUNK_SIZE = 2026;
//# sourceMappingURL=constants.js.map