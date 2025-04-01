import { arc4, uint64 } from "@algorandfoundation/algorand-typescript"
import { Address, StaticBytes } from "@algorandfoundation/algorand-typescript/arc4"

export type PluginsKey = {
    application: uint64
    allowedCaller: Address
}

export class arc4PluginsKey extends arc4.Struct<{
    /** The application containing plugin logic */
    application: arc4.UintN64
    /** The address that is allowed to initiate a rekey to the plugin */
    allowedCaller: Address
}> { }

export type PluginInfo = {
    lastValidRound: uint64
    cooldown: uint64
    lastCalled: uint64
    adminPrivileges: boolean
    mehtods: MethodRestriction[]
}

export class arc4PluginInfo extends arc4.Struct<{
    /** The last round at which this plugin can be called */
    lastValidRound: arc4.UintN64
    /** The number of rounds that must pass before the plugin can be called again */
    cooldown: arc4.UintN64
    /** The last round the plugin was called */
    lastCalled: arc4.UintN64
    /** Whether the plugin has permissions to change the admin account */
    adminPrivileges: arc4.Bool
    /** The methods that are allowed to be called for the plugin by the address */
    methods: arc4.DynamicArray<arc4MethodInfo>
}> { }

export type MethodRestriction = {
    selector: StaticBytes<4>
    cooldown: uint64
}

export class arc4MethodRestriction extends arc4.Struct<{
    /** The method signature */
    selector: arc4.StaticBytes<4>
    /** The number of rounds that must pass before the method can be called again */
    cooldown: arc4.UintN64
}> { }

export type MethodInfo = {
    selector: StaticBytes<4>
    cooldown: uint64
    lastCalled: uint64
}

export class arc4MethodInfo extends arc4.Struct<{
    /** The method signature */
    selector: arc4.StaticBytes<4>
    /** The number of rounds that must pass before the method can be called again */
    cooldown: arc4.UintN64
    /** The last round the method was called */
    lastCalled: arc4.UintN64
}> { }

export type PluginValidation = {
    exists: boolean
    expired: boolean
    hasCooldown: boolean
    onCooldown: boolean
    hasMethodRestrictions: boolean
    valid: boolean
}

export type MethodValidation = {
    methodAllowed: boolean
    methodHasCooldown: boolean
    methodOnCooldown: boolean
}

export type FullPluginValidation = {
    exists: boolean
    expired: boolean
    hasCooldown: boolean
    onCooldown: boolean
    hasMethodRestrictions: boolean
    methodAllowed: boolean
    methodHasCooldown: boolean
    methodOnCooldown: boolean
    valid: boolean
}

export type AbstractAccountMBRData = {
    plugins: uint64
    namedPlugins: uint64
    domainKeys: uint64
}