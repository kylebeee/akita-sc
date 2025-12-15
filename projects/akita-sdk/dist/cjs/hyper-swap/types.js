"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferState = void 0;
// Offer states
var OfferState;
(function (OfferState) {
    OfferState[OfferState["Offered"] = 10] = "Offered";
    OfferState[OfferState["Escrowing"] = 20] = "Escrowing";
    OfferState[OfferState["Disbursing"] = 30] = "Disbursing";
    OfferState[OfferState["Completed"] = 40] = "Completed";
    OfferState[OfferState["Cancelled"] = 50] = "Cancelled";
    OfferState[OfferState["CancelCompleted"] = 60] = "CancelCompleted";
})(OfferState || (exports.OfferState = OfferState = {}));
//# sourceMappingURL=types.js.map