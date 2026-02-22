// src/types.ts
function hasSenderSigner(params) {
  return params.sender !== void 0 && params.signer !== void 0;
}
function isPluginSDKReturn(value) {
  return typeof value === "function";
}

export {
  hasSenderSigner,
  isPluginSDKReturn
};
//# sourceMappingURL=chunk-V3TNOMIB.mjs.map