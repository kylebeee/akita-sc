import { Account, arc4, uint64 } from "@algorandfoundation/algorand-typescript";
import { Bool, DynamicArray, StaticBytes, Struct, UintN64, UintN8 } from "@algorandfoundation/algorand-typescript/arc4";

export type AllowanceKey = {
  application: uint64;
  allowedCaller: Account;
  asset: uint64;
}

export type SpendAllowanceType = UintN8

export const SpendAllowanceTypeFlat: SpendAllowanceType = new UintN8(1)
export const SpendAllowanceTypeWindow: SpendAllowanceType = new UintN8(2)
export const SpendAllowanceTypeDrip: SpendAllowanceType = new UintN8(3)

export type AllowanceInfo = {
  type: SpendAllowanceType
  max: uint64
  allowed: uint64
  spent: uint64
  interval: uint64
  last: uint64
}

export type FundsRequest = {
  asset: uint64;
  amount: uint64;
}

export type PluginKey = {
  application: uint64;
  allowedCaller: Account;
}

export const DelegationTypeSelf = new UintN8(1)
export const DelegationTypeAgent = new UintN8(2)
export const DelegationTypeOther = new UintN8(3)

export type PluginInfo = {
  admin: boolean;
  delegationType: UintN8;
  spendingApp: uint64;
  lastValid: uint64;
  cooldown: uint64;
  methods: DynamicArray<arc4MethodInfo>;
  useAllowance: boolean;
  useRounds: boolean;
  lastCalled: uint64;
  start: uint64;
}

export class arc4PluginInfo extends Struct<{
  /** Whether the plugin has permissions to change the admin account */
  admin: Bool;
  /** the type of delegation the plugin is using */
  delegationType: UintN8;
  /** the spending account to use for the plugin */
  spendingApp: UintN64;
  /** The last round or unix time at which this plugin can be called */
  lastValid: UintN64;
  /** The number of rounds or seconds that must pass before the plugin can be called again */
  cooldown: UintN64;
  /** The methods that are allowed to be called for the plugin by the address */
  methods: DynamicArray<arc4MethodInfo>;
  /** Whether the plugin has allowance restrictions */
  useAllowance: Bool;
  /** Whether to use unix timestamps or round for lastValid and cooldown */
  useRounds: Bool;
  /** The last round or unix time the plugin was called */
  lastCalled: UintN64;
  /** The round or unix time the plugin was installed */
  start: UintN64;
}> { }

export type MethodRestriction = {
  selector: StaticBytes<4>;
  cooldown: uint64;
}

export type MethodInfo = {
  selector: StaticBytes<4>;
  cooldown: uint64;
  lastCalled: uint64;
}

export class arc4MethodInfo extends arc4.Struct<{
  selector: StaticBytes<4>;
  cooldown: UintN64;
  lastCalled: UintN64;
}> {}

export type PluginValidation = {
  exists: boolean;
  expired: boolean;
  hasCooldown: boolean;
  onCooldown: boolean;
  hasMethodRestrictions: boolean;
  valid: boolean;
}

export type MethodValidation = {
  methodAllowed: boolean;
  methodHasCooldown: boolean;
  methodOnCooldown: boolean;
}

export type FullPluginValidation = {
  exists: boolean;
  expired: boolean;
  hasCooldown: boolean;
  onCooldown: boolean;
  hasMethodRestrictions: boolean;
  methodAllowed: boolean;
  methodHasCooldown: boolean;
  methodOnCooldown: boolean;
  valid: boolean;
}