"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPluginDefaults = void 0;
exports.isFlatAllowance = isFlatAllowance;
exports.isWindowAllowance = isWindowAllowance;
exports.isDripAllowance = isDripAllowance;
exports.isValidPluginSDK = isValidPluginSDK;
exports.getPluginAppId = getPluginAppId;
// Default values for addPlugin method
exports.AddPluginDefaults = {
    escrow: '',
    name: '',
    useExecutionKey: false,
    useRounds: false,
    admin: false,
    delegationType: 0n,
    coverFees: false,
};
// allowance info type guards
function isFlatAllowance(info) {
    return info.type === 'flat';
}
function isWindowAllowance(info) {
    return info.type === 'window';
}
function isDripAllowance(info) {
    return info.type === 'drip';
}
/**
 * Type guard to check if an object is a valid AkitaSDK instance for use with plugins
 */
function isValidPluginSDK(sdk) {
    return (sdk &&
        typeof sdk === 'object' &&
        typeof sdk.appId === 'bigint' &&
        sdk.client &&
        typeof sdk.client.appId === 'bigint' &&
        typeof sdk.client.appAddress === 'string' &&
        sdk.algorand);
}
/**
 * Extract the app ID from a plugin SDK instance in a type-safe way
 */
function getPluginAppId(plugin) {
    return plugin.appId;
}
//# sourceMappingURL=types.js.map