"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GateSDK = void 0;
const base_1 = require("../base");
const config_1 = require("../config");
const GateClient_1 = require("../generated/GateClient");
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const constants_1 = require("../constants");
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const algosdk_1 = require("algosdk");
const AkitaReferrerGateClient_1 = require("../generated/AkitaReferrerGateClient");
const AssetGateClient_1 = require("../generated/AssetGateClient");
const MerkleAddressGateClient_1 = require("../generated/MerkleAddressGateClient");
const MerkleAssetGateClient_1 = require("../generated/MerkleAssetGateClient");
const NFDGateClient_1 = require("../generated/NFDGateClient");
const NFDGateClient_2 = require("../generated/NFDGateClient");
const PollGateClient_1 = require("../generated/PollGateClient");
const SocialActivityGateClient_1 = require("../generated/SocialActivityGateClient");
const SocialFollowerCountGateClient_1 = require("../generated/SocialFollowerCountGateClient");
const SocialFollowerIndexGateClient_1 = require("../generated/SocialFollowerIndexGateClient");
const SocialImpactGateClient_1 = require("../generated/SocialImpactGateClient");
const SocialModeratorGateClient_1 = require("../generated/SocialModeratorGateClient");
const StakingAmountGateClient_1 = require("../generated/StakingAmountGateClient");
const StakingPowerGateClient_1 = require("../generated/StakingPowerGateClient");
const SubscriptionGateClient_1 = require("../generated/SubscriptionGateClient");
const SubscriptionStreakGateClient_1 = require("../generated/SubscriptionStreakGateClient");
__exportStar(require("./types"), exports);
class GateSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: GateClient_1.GateFactory, ...params }, config_1.ENV_VAR_NAMES.GATE_APP_ID);
        this.contractIdToType = new Map();
        this.gateEncodings = {
            akita_referrer: {
                registerShape: 'AkitaReferrerGateRegistryInfo',
                checkShape: 'uint64',
                structs: AkitaReferrerGateClient_1.APP_SPEC.structs
            },
            asset: {
                registerShape: 'AssetGateRegistryInfo',
                checkShape: 'None',
                structs: AssetGateClient_1.APP_SPEC.structs
            },
            merkle_address: {
                registerShape: 'MerkleAddressGateRegistryInfo',
                checkShape: 'Proof',
                structs: MerkleAddressGateClient_1.APP_SPEC.structs
            },
            merkle_asset: {
                registerShape: 'MerkleAssetGateRegistryInfo',
                checkShape: 'MerkleAssetGateCheckParams',
                structs: MerkleAssetGateClient_1.APP_SPEC.structs
            },
            nfd: {
                registerShape: 'None',
                checkShape: 'uint64',
                structs: NFDGateClient_1.APP_SPEC.structs
            },
            nfd_root: {
                registerShape: 'NFDRootGateRegistryInfo',
                checkShape: 'string',
                structs: NFDGateClient_2.APP_SPEC.structs
            },
            poll: {
                registerShape: 'PollGateRegistryInfo',
                checkShape: 'None',
                structs: PollGateClient_1.APP_SPEC.structs
            },
            social_activity: {
                registerShape: 'SocialActivityGateRegistryInfo',
                checkShape: 'None',
                structs: SocialActivityGateClient_1.APP_SPEC.structs
            },
            social_follower_count: {
                registerShape: 'SocialFollowerCountGateRegistryInfo',
                checkShape: 'None',
                structs: SocialFollowerCountGateClient_1.APP_SPEC.structs
            },
            social_follower_index: {
                registerShape: 'SocialFollowerIndexGateRegistryInfo',
                checkShape: 'uint64',
                structs: SocialFollowerIndexGateClient_1.APP_SPEC.structs
            },
            social_impact: {
                registerShape: 'SocialImpactGateRegistryInfo',
                checkShape: 'None',
                structs: SocialImpactGateClient_1.APP_SPEC.structs
            },
            social_moderator: {
                registerShape: 'SocialModeratorGateRegistryInfo',
                checkShape: 'None',
                structs: SocialModeratorGateClient_1.APP_SPEC.structs
            },
            staking_amount: {
                registerShape: 'StakingAmountGateRegistryInfo',
                checkShape: 'None',
                structs: StakingAmountGateClient_1.APP_SPEC.structs
            },
            staking_power: {
                registerShape: 'StakingPowerGateRegistryInfo',
                checkShape: 'None',
                structs: StakingPowerGateClient_1.APP_SPEC.structs
            },
            subscription: {
                registerShape: 'SubscriptionGateRegistryInfo',
                checkShape: 'None',
                structs: SubscriptionGateClient_1.APP_SPEC.structs
            },
            subscription_streak: {
                registerShape: 'SubscriptionGateRegistryInfo',
                checkShape: 'None',
                structs: SubscriptionStreakGateClient_1.APP_SPEC.structs
            }
        };
        this.build = {
            check: async ({ sender, signer, caller, gateId, args }) => {
                const sendParams = this.getRequiredSendParams({ sender, signer });
                const preppedArgs = await this.encodeGateCheckArgs(args);
                return await this.client.params.check({
                    ...sendParams,
                    args: { caller, gateId, args: preppedArgs }
                });
            },
            mustCheck: async ({ sender, signer, caller, gateId, args }) => {
                const sendParams = this.getRequiredSendParams({ sender, signer });
                const preppedArgs = await this.encodeGateCheckArgs(args);
                return await this.client.params.mustCheck({
                    ...sendParams,
                    args: { caller, gateId, args: preppedArgs }
                });
            }
        };
        Object.entries(params.gateRegistry).forEach(([type, contractId]) => {
            if (contractId !== undefined) {
                this.contractIdToType.set(contractId, type);
            }
        });
    }
    getGateTypeFromContractId(contractId) {
        const gateType = this.contractIdToType.get(contractId);
        if (!gateType) {
            throw new Error(`Unknown contract ID: ${contractId}`);
        }
        return gateType;
    }
    async encodeGateRegistryArgs(args) {
        let filters = [];
        let preppedArgs = [];
        let data = new Uint8Array();
        for (const arg of args) {
            const { type, appId, layer, logicalOperator } = arg;
            if (!(arg.type in this.gateEncodings)) {
                throw new Error(`Unsupported gate type: ${arg.type}`);
            }
            filters.push([layer, appId, logicalOperator]);
            const name = this.gateEncodings[arg.type].registerShape;
            if (name === 'None') {
                preppedArgs.push(data);
                continue;
            }
            switch (type) {
                case 'akita_referrer': {
                    const { referrer } = arg;
                    data = (0, app_arc56_1.getABIEncodedValue)({ referrer }, name, this.gateEncodings[type].structs);
                    break;
                }
                case 'asset': {
                    const { asset, op, value } = arg;
                    data = (0, app_arc56_1.getABIEncodedValue)({ asset, op, value }, name, this.gateEncodings[type].structs);
                    break;
                }
                case 'social_activity':
                case 'social_follower_count':
                case 'social_impact':
                case 'social_moderator': {
                    const { op, value } = arg;
                    data = (0, app_arc56_1.getABIEncodedValue)({ op, value }, name, this.gateEncodings[type].structs);
                    break;
                }
                case 'merkle_address':
                case 'merkle_asset': {
                    const { creator, name: listName } = arg;
                    data = (0, app_arc56_1.getABIEncodedValue)({ creator, name: listName }, name, this.gateEncodings[type].structs);
                    break;
                }
                case 'nfd': {
                    const { appId } = arg;
                    data = (0, app_arc56_1.getABIEncodedValue)({ appId }, name, this.gateEncodings[type].structs);
                    break;
                }
                case 'nfd_root': {
                    const { root } = arg;
                    data = Buffer.from(root);
                    break;
                }
                case 'poll': {
                    const { poll } = arg;
                    data = (0, app_arc56_1.getABIEncodedValue)({ poll }, name, this.gateEncodings[type].structs);
                    break;
                }
                case 'social_follower_index': {
                    const { user, op, value } = arg;
                    data = (0, app_arc56_1.getABIEncodedValue)({ user, op, value }, name, this.gateEncodings[type].structs);
                    break;
                }
                case 'staking_amount': {
                    const { op, asset, stakingType, amount, includeEscrowed } = arg;
                    data = (0, app_arc56_1.getABIEncodedValue)({ op, asset, stakingType, amount, includeEscrowed }, name, this.gateEncodings[type].structs);
                    break;
                }
                case 'staking_power': {
                    const { op, asset, power } = arg;
                    data = (0, app_arc56_1.getABIEncodedValue)({ op, asset, power }, name, this.gateEncodings[type].structs);
                    break;
                }
                case 'subscription': {
                    const { merchant, id } = arg;
                    data = (0, app_arc56_1.getABIEncodedValue)({ merchant, id }, name, this.gateEncodings[type].structs);
                    break;
                }
                case 'subscription_streak': {
                    const { merchant, id, op, streak } = arg;
                    data = (0, app_arc56_1.getABIEncodedValue)({ merchant, id, op, streak }, name, this.gateEncodings[type].structs);
                    break;
                }
                default: {
                    throw new Error(`Unsupported gate type: ${type}`);
                }
            }
            preppedArgs.push(data);
        }
        return { filters, args: preppedArgs };
    }
    decodeGateArgs(type, encoded) {
        const registrationName = this.gateEncodings[type].registerShape;
        if (registrationName === 'None') {
            return { type };
        }
        const structs = this.gateEncodings[type].structs;
        switch (type) {
            case 'asset': {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(encoded, registrationName, structs);
                return { type, ...decoded };
            }
            case 'merkle_address': {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(encoded, registrationName, structs);
                return { type, ...decoded };
            }
            case 'merkle_asset': {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(encoded, registrationName, structs);
                return { type, ...decoded };
            }
            case 'nfd_root': {
                return { type, root: encoded.toString() };
            }
            case 'social_activity':
            case 'social_follower_count':
            case 'social_impact':
            case 'social_moderator': {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(encoded, registrationName, structs);
                return { type, ...decoded };
            }
            case 'social_follower_index': {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(encoded, registrationName, structs);
                return { type, ...decoded };
            }
            case 'staking_amount': {
                const { type: stakingType, ...decoded } = (0, app_arc56_1.getABIDecodedValue)(encoded, registrationName, structs);
                return { type, stakingType, ...decoded };
            }
            case 'staking_power': {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(encoded, registrationName, structs);
                return { type, ...decoded };
            }
            case 'subscription': {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(encoded, registrationName, structs);
                return { type, ...decoded };
            }
            case 'subscription_streak': {
                const decoded = (0, app_arc56_1.getABIDecodedValue)(encoded, registrationName, structs);
                return { type, ...decoded };
            }
            default: {
                throw new Error(`Unsupported gate type: ${type}`);
            }
        }
    }
    async encodeGateCheckArgs(args) {
        let preppedArgs = [];
        let data = new Uint8Array();
        for (const arg of args) {
            const { type } = arg;
            const name = this.gateEncodings[arg.type].checkShape;
            if (name === 'None') {
                preppedArgs.push(data);
                continue;
            }
            switch (type) {
                case 'akita_referrer': {
                    const { wallet } = arg;
                    data = (0, algosdk_1.encodeUint64)(wallet);
                    break;
                }
                case 'merkle_address': {
                    const { proof } = arg;
                    data = (0, app_arc56_1.getABIEncodedValue)(proof, name, this.gateEncodings[type].structs);
                    break;
                }
                case 'merkle_asset': {
                    const { asset, proof } = arg;
                    data = (0, app_arc56_1.getABIEncodedValue)({ asset, proof }, name, this.gateEncodings[type].structs);
                    break;
                }
                case 'nfd': {
                    const { appId } = arg;
                    data = (0, algosdk_1.encodeUint64)(appId);
                    break;
                }
                case 'nfd_root': {
                    const { root } = arg;
                    data = Buffer.from(root);
                    break;
                }
                case 'social_follower_index': {
                    const { index } = arg;
                    data = (0, algosdk_1.encodeUint64)(index);
                    break;
                }
                default: {
                    throw new Error(`Unsupported gate type: ${type}`);
                }
            }
            preppedArgs.push(data);
        }
        return preppedArgs;
    }
    async register({ sender, signer, args }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const encodedArgs = await this.encodeGateRegistryArgs(args);
        // figure out cost
        const cost = await this.cost(encodedArgs);
        const payment = this.client.algorand.createTransaction.payment({
            ...sendParams,
            receiver: this.client.appAddress,
            amount: (0, algokit_utils_1.microAlgo)(cost),
        });
        return this.client.send.register({
            ...sendParams,
            args: { payment, ...encodedArgs }
        });
    }
    async check({ sender, signer, caller, gateId, args }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const preppedArgs = await this.encodeGateCheckArgs(args);
        return this.client.send.check({
            ...sendParams,
            args: { caller, gateId, args: preppedArgs }
        });
    }
    async mustCheck({ sender, signer, caller, gateId, args }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const preppedArgs = await this.encodeGateCheckArgs(args);
        return this.client.send.mustCheck({
            ...sendParams,
            args: { caller, gateId, args: preppedArgs }
        });
    }
    async getGate({ sender, signer, gateId }) {
        const sendParams = this.getSendParams({
            sender: sender ?? this.readerAccount,
            signer: signer ?? constants_1.emptySigner
        });
        const { return: gates } = await this.client.send.getGate({ ...sendParams, args: { gateId } });
        if (gates === undefined) {
            throw new Error('Failed to get gate info');
        }
        // decode the resulting args into a GateRegistrationArg[]
        const decodedGates = gates.map(gate => {
            const obj = (0, GateClient_1.GateFilterEntryWithArgsFromTuple)(gate);
            const gateType = this.getGateTypeFromContractId(obj.app);
            return this.decodeGateArgs(gateType, obj.args);
        });
        return decodedGates;
    }
    async cost({ sender, signer, ...args }) {
        const sendParams = this.getSendParams({
            sender: sender ?? this.readerAccount,
            signer: signer ?? constants_1.emptySigner
        });
        const { return: cost } = await this.client.send.cost({ ...sendParams, args });
        if (cost === undefined) {
            throw new Error('Failed to get cost for gate registration');
        }
        return cost;
    }
}
exports.GateSDK = GateSDK;
//# sourceMappingURL=index.js.map