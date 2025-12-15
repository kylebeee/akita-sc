// Type guard function
export function hasSenderSigner(params) {
    return params.sender !== undefined && params.signer !== undefined;
}
export function isPluginSDKReturn(value) {
    return typeof value === 'function';
}
//# sourceMappingURL=types.js.map