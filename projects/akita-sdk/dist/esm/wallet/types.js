// Default values for addPlugin method
export const AddPluginDefaults = {
    escrow: '',
    name: '',
    useExecutionKey: false,
    useRounds: false,
    admin: false,
    delegationType: 0n,
    coverFees: false,
};
// allowance info type guards
export function isFlatAllowance(info) {
    return info.type === 'flat';
}
export function isWindowAllowance(info) {
    return info.type === 'window';
}
export function isDripAllowance(info) {
    return info.type === 'drip';
}
/**
 * Type guard to check if an object is a valid AkitaSDK instance for use with plugins
 */
export function isValidPluginSDK(sdk) {
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
export function getPluginAppId(plugin) {
    return plugin.appId;
}
//# sourceMappingURL=types.js.map