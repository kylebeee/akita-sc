"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayWallType = exports.RefType = void 0;
// RefType enum matching the contract
var RefType;
(function (RefType) {
    RefType[RefType["Post"] = 10] = "Post";
    RefType[RefType["Asset"] = 20] = "Asset";
    RefType[RefType["Address"] = 30] = "Address";
    RefType[RefType["App"] = 40] = "App";
    RefType[RefType["External"] = 50] = "External";
})(RefType || (exports.RefType = RefType = {}));
// ============================================================================
// PayWall types
// ============================================================================
var PayWallType;
(function (PayWallType) {
    PayWallType[PayWallType["OneTimePayment"] = 0] = "OneTimePayment";
    PayWallType[PayWallType["Subscription"] = 1] = "Subscription";
})(PayWallType || (exports.PayWallType = PayWallType = {}));
//# sourceMappingURL=types.js.map