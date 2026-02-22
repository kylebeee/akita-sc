"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/types.ts
function hasSenderSigner(params) {
  return params.sender !== void 0 && params.signer !== void 0;
}
function isPluginSDKReturn(value) {
  return typeof value === "function";
}




exports.hasSenderSigner = hasSenderSigner; exports.isPluginSDKReturn = isPluginSDKReturn;
//# sourceMappingURL=chunk-2WS6GQO5.js.map