// RefType enum matching the contract
export var RefType;
(function (RefType) {
    RefType[RefType["Post"] = 10] = "Post";
    RefType[RefType["Asset"] = 20] = "Asset";
    RefType[RefType["Address"] = 30] = "Address";
    RefType[RefType["App"] = 40] = "App";
    RefType[RefType["External"] = 50] = "External";
})(RefType || (RefType = {}));
// ============================================================================
// PayWall types
// ============================================================================
export var PayWallType;
(function (PayWallType) {
    PayWallType[PayWallType["OneTimePayment"] = 0] = "OneTimePayment";
    PayWallType[PayWallType["Subscription"] = 1] = "Subscription";
})(PayWallType || (PayWallType = {}));
//# sourceMappingURL=types.js.map