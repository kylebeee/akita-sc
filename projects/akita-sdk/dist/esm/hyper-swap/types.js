// Offer states
export var OfferState;
(function (OfferState) {
    OfferState[OfferState["Offered"] = 10] = "Offered";
    OfferState[OfferState["Escrowing"] = 20] = "Escrowing";
    OfferState[OfferState["Disbursing"] = 30] = "Disbursing";
    OfferState[OfferState["Completed"] = 40] = "Completed";
    OfferState[OfferState["Cancelled"] = 50] = "Cancelled";
    OfferState[OfferState["CancelCompleted"] = 60] = "CancelCompleted";
})(OfferState || (OfferState = {}));
//# sourceMappingURL=types.js.map