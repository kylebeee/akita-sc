"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasSenderSigner = hasSenderSigner;
exports.isPluginSDKReturn = isPluginSDKReturn;
// Type guard function
function hasSenderSigner(params) {
    return params.sender !== undefined && params.signer !== undefined;
}
function isPluginSDKReturn(value) {
    return typeof value === 'function';
}
//# sourceMappingURL=types.js.map