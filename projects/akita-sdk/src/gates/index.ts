import { BaseSDK } from "../base";
import { ENV_VAR_NAMES } from "../config";
import { TxnReturn } from '../types'
import { GateArgs, GateClient, GateFactory, GateFilterEntryWithArgsFromTuple } from '../generated/GateClient'
import { MaybeSigner, NewContractSDKParams } from "../types";
import { microAlgo } from "@algorandfoundation/algokit-utils";
import { emptySigner } from "../constants";
import { GateCheckArg, GateEncodingInfo, GateRegistrationArg, GateRegistrationFilterAndArg, GateRegistryConfig, GateType } from "./types";
import { getABIDecodedValue, getABIEncodedValue } from "@algorandfoundation/algokit-utils/types/app-arc56";
import { ABIMethod, encodeUint64, Transaction, TransactionSigner } from "algosdk";
import { APP_SPEC as AkitaReferrerAppSpec } from '../generated/AkitaReferrerGateClient'
import { APP_SPEC as AssetAppSpec, AssetGateRegistryInfo } from '../generated/AssetGateClient'
import { APP_SPEC as MerkleAddressAppSpec, MerkleAddressGateRegistryInfo } from '../generated/MerkleAddressGateClient'
import { APP_SPEC as MerkleAssetAppSpec, MerkleAssetGateRegistryInfo } from '../generated/MerkleAssetGateClient'
import { APP_SPEC as NFDAppSpec } from '../generated/NFDGateClient'
import { APP_SPEC as NFDRootAppSpec } from '../generated/NFDGateClient'
import { APP_SPEC as PollAppSpec } from '../generated/PollGateClient'
import { OperatorAndValue, APP_SPEC as SocialActivityAppSpec } from '../generated/SocialActivityGateClient'
import { APP_SPEC as SocialFollowerCountAppSpec } from '../generated/SocialFollowerCountGateClient'
import { APP_SPEC as SocialFollowerIndexGateAppSpec, SocialFollowerIndexGateRegistryInfo } from '../generated/SocialFollowerIndexGateClient'
import { APP_SPEC as SocialImpactGateAppSpec } from '../generated/SocialImpactGateClient'
import { APP_SPEC as SocialModeratorGateAppSpec } from '../generated/SocialModeratorGateClient'
import { APP_SPEC as StakingAmountGateAppSpec, StakingAmountGateRegistryInfo } from '../generated/StakingAmountGateClient'
import { APP_SPEC as StakingPowerGateAppSpec, StakingPowerGateRegistryInfo } from '../generated/StakingPowerGateClient'
import { APP_SPEC as SubscriptionGateAppSpec, SubscriptionGateRegistryInfo } from '../generated/SubscriptionGateClient'
import { APP_SPEC as SubscriptionStreakGateAppSpec, SubscriptionStreakGateRegistryInfo } from '../generated/SubscriptionStreakGateClient'
import { AppCallMethodCall } from "@algorandfoundation/algokit-utils/types/composer";

type ContractArgs = GateArgs["obj"];

export * from './types'

export class GateSDK extends BaseSDK<GateClient> {

  private contractIdToType: Map<bigint, GateType> = new Map();

  private gateEncodings: { [K in GateType]: GateEncodingInfo } = {
    akita_referrer: {
      registerShape: 'AkitaReferrerGateRegistryInfo',
      checkShape: 'uint64',
      structs: AkitaReferrerAppSpec.structs
    },
    asset: {
      registerShape: 'AssetGateRegistryInfo',
      checkShape: 'None',
      structs: AssetAppSpec.structs
    },
    merkle_address: {
      registerShape: 'MerkleAddressGateRegistryInfo',
      checkShape: 'Proof',
      structs: MerkleAddressAppSpec.structs
    },
    merkle_asset: {
      registerShape: 'MerkleAssetGateRegistryInfo',
      checkShape: 'MerkleAssetGateCheckParams',
      structs: MerkleAssetAppSpec.structs
    },
    nfd: {
      registerShape: 'None',
      checkShape: 'uint64',
      structs: NFDAppSpec.structs
    },
    nfd_root: {
      registerShape: 'NFDRootGateRegistryInfo',
      checkShape: 'string',
      structs: NFDRootAppSpec.structs
    },
    poll: {
      registerShape: 'PollGateRegistryInfo',
      checkShape: 'None',
      structs: PollAppSpec.structs
    },
    social_activity: {
      registerShape: 'SocialActivityGateRegistryInfo',
      checkShape: 'None',
      structs: SocialActivityAppSpec.structs
    },
    social_follower_count: {
      registerShape: 'SocialFollowerCountGateRegistryInfo',
      checkShape: 'None',
      structs: SocialFollowerCountAppSpec.structs
    },
    social_follower_index: {
      registerShape: 'SocialFollowerIndexGateRegistryInfo',
      checkShape: 'uint64',
      structs: SocialFollowerIndexGateAppSpec.structs
    },
    social_impact: {
      registerShape: 'SocialImpactGateRegistryInfo',
      checkShape: 'None',
      structs: SocialImpactGateAppSpec.structs
    },
    social_moderator: {
      registerShape: 'SocialModeratorGateRegistryInfo',
      checkShape: 'None',
      structs: SocialModeratorGateAppSpec.structs
    },
    staking_amount: {
      registerShape: 'StakingAmountGateRegistryInfo',
      checkShape: 'None',
      structs: StakingAmountGateAppSpec.structs
    },
    staking_power: {
      registerShape: 'StakingPowerGateRegistryInfo',
      checkShape: 'None',
      structs: StakingPowerGateAppSpec.structs
    },
    subscription: {
      registerShape: 'SubscriptionGateRegistryInfo',
      checkShape: 'None',
      structs: SubscriptionGateAppSpec.structs
    },
    subscription_streak: {
      registerShape: 'SubscriptionGateRegistryInfo',
      checkShape: 'None',
      structs: SubscriptionStreakGateAppSpec.structs
    }
  }

  constructor(params: NewContractSDKParams & { gateRegistry: GateRegistryConfig }) {
    super({ factory: GateFactory, ...params }, ENV_VAR_NAMES.GATE_APP_ID);
    Object.entries(params.gateRegistry).forEach(([type, contractId]) => {
      if (contractId !== undefined) {
        this.contractIdToType.set(contractId, type as GateType);
      }
    });
  }

  private getGateTypeFromContractId(contractId: bigint): GateType {
    const gateType = this.contractIdToType.get(contractId);
    if (!gateType) {
      throw new Error(`Unknown contract ID: ${contractId}`);
    }
    return gateType;
  }

  private async encodeGateRegistryArgs(args: GateRegistrationFilterAndArg[]): Promise<{ filters: [bigint | number, bigint | number, bigint | number][]; args: Uint8Array[]; }> {

    let filters: [bigint | number, bigint | number, bigint | number][] = [];
    let preppedArgs: Uint8Array[] = [];
    let data: Uint8Array = new Uint8Array();

    for (const arg of args) {
      const { type, appId, layer, logicalOperator } = arg;

      if (!(arg.type in this.gateEncodings)) {
        throw new Error(`Unsupported gate type: ${arg.type}`);
      }

      filters.push([layer, appId, logicalOperator] as [bigint | number, bigint | number, bigint | number]);

      const name = this.gateEncodings[arg.type].registerShape;
      if (name === 'None') {
        preppedArgs.push(data);
        continue;
      }

      switch (type) {
        case 'akita_referrer': {
          const { referrer } = arg;
          data = getABIEncodedValue(
            { referrer },
            name,
            this.gateEncodings[type].structs
          );
          break;
        }
        case 'asset': {
          const { asset, op, value } = arg;
          data = getABIEncodedValue(
            { asset, op, value },
            name,
            this.gateEncodings[type].structs
          );
          break;
        }
        case 'social_activity':
        case 'social_follower_count':
        case 'social_impact':
        case 'social_moderator': {
          const { op, value } = arg;
          data = getABIEncodedValue(
            { op, value },
            name,
            this.gateEncodings[type].structs
          );
          break;
        }
        case 'merkle_address':
        case 'merkle_asset': {
          const { creator, name: listName } = arg;
          data = getABIEncodedValue(
            { creator, name: listName },
            name,
            this.gateEncodings[type].structs
          );
          break;
        }
        case 'nfd': {
          const { appId } = arg;
          data = getABIEncodedValue(
            { appId },
            name,
            this.gateEncodings[type].structs
          );
          break;
        }
        case 'nfd_root': {
          const { root } = arg;
          data = Buffer.from(root)
          break;
        }
        case 'poll': {
          const { poll } = arg;
          data = getABIEncodedValue(
            { poll },
            name,
            this.gateEncodings[type].structs
          );
          break;
        }
        case 'social_follower_index': {
          const { user, op, value } = arg;
          data = getABIEncodedValue(
            { user, op, value },
            name,
            this.gateEncodings[type].structs
          );
          break;
        }
        case 'staking_amount': {
          const { op, asset, stakingType, amount, includeEscrowed } = arg;
          data = getABIEncodedValue(
            { op, asset, stakingType, amount, includeEscrowed },
            name,
            this.gateEncodings[type].structs
          );
          break;
        }
        case 'staking_power': {
          const { op, asset, power } = arg;
          data = getABIEncodedValue(
            { op, asset, power },
            name,
            this.gateEncodings[type].structs
          );
          break;
        }
        case 'subscription': {
          const { merchant, id } = arg;
          data = getABIEncodedValue(
            { merchant, id },
            name,
            this.gateEncodings[type].structs
          );
          break;
        }
        case 'subscription_streak': {
          const { merchant, id, op, streak } = arg;
          data = getABIEncodedValue(
            { merchant, id, op, streak },
            name,
            this.gateEncodings[type].structs
          );
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

  private decodeGateArgs(type: GateType, encoded: Uint8Array): GateRegistrationArg {

    const registrationName = this.gateEncodings[type].registerShape;
    if (registrationName === 'None') {
      return { type } as GateRegistrationArg;
    }

    const structs = this.gateEncodings[type].structs;

    switch (type) {
      case 'asset': {
        const decoded = getABIDecodedValue(encoded, registrationName, structs) as AssetGateRegistryInfo
        return { type, ...decoded }
      }
      case 'merkle_address': {
        const decoded = getABIDecodedValue(encoded, registrationName, structs) as MerkleAddressGateRegistryInfo
        return { type, ...decoded }
      }
      case 'merkle_asset': {
        const decoded = getABIDecodedValue(encoded, registrationName, structs) as MerkleAssetGateRegistryInfo
        return { type, ...decoded }
      }
      case 'nfd_root': {
        return { type, root: encoded.toString() };
      }
      case 'social_activity':
      case 'social_follower_count':
      case 'social_impact':
      case 'social_moderator': {
        const decoded = getABIDecodedValue(encoded, registrationName, structs) as OperatorAndValue
        return { type, ...decoded }
      }
      case 'social_follower_index': {
        const decoded = getABIDecodedValue(encoded, registrationName, structs) as SocialFollowerIndexGateRegistryInfo
        return { type, ...decoded }
      }
      case 'staking_amount': {
        const { type: stakingType, ...decoded } = getABIDecodedValue(encoded, registrationName, structs) as StakingAmountGateRegistryInfo
        return { type, stakingType, ...decoded }
      }
      case 'staking_power': {
        const decoded = getABIDecodedValue(encoded, registrationName, structs) as StakingPowerGateRegistryInfo
        return { type, ...decoded }
      }
      case 'subscription': {
        const decoded = getABIDecodedValue(encoded, registrationName, structs) as SubscriptionGateRegistryInfo
        return { type, ...decoded }
      }
      case 'subscription_streak': {
        const decoded = getABIDecodedValue(encoded, registrationName, structs) as SubscriptionStreakGateRegistryInfo
        return { type, ...decoded }
      }
      default: {
        throw new Error(`Unsupported gate type: ${type}`);
      }
    }
  }

  private async encodeGateCheckArgs(args: GateCheckArg[]): Promise<Uint8Array[]> {

    let preppedArgs: Uint8Array[] = [];
    let data: Uint8Array = new Uint8Array();

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
          data = encodeUint64(wallet);
          break;
        }
        case 'merkle_address': {
          const { proof } = arg;
          data = getABIEncodedValue(
            proof,
            name,
            this.gateEncodings[type].structs
          );
          break;
        }
        case 'merkle_asset': {
          const { asset, proof } = arg;
          data = getABIEncodedValue(
            { asset, proof },
            name,
            this.gateEncodings[type].structs
          );
          break;
        }
        case 'nfd': {
          const { appId } = arg;
          data = encodeUint64(appId);
          break;
        }
        case 'nfd_root': {
          const { root } = arg;
          data = Buffer.from(root)
          break;
        }
        case 'social_follower_index': {
          const { index } = arg;
          data = encodeUint64(index);
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

  async register({ sender, signer, args }: { args: GateRegistrationFilterAndArg[] } & MaybeSigner): Promise<TxnReturn<bigint>> {

    const sendParams = this.getRequiredSendParams({ sender, signer });

    const encodedArgs = await this.encodeGateRegistryArgs(args);

    // figure out cost
    const cost = await this.cost(encodedArgs)

    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      receiver: this.client.appAddress,
      amount: microAlgo(cost),
    })

    return this.client.send.register({
      ...sendParams,
      args: { payment, ...encodedArgs }
    });
  }

  async check({ sender, signer, caller, gateId, args }: Omit<ContractArgs['check(address,uint64,byte[][])bool'], 'args'> & { args: GateCheckArg[] } & MaybeSigner): Promise<TxnReturn<boolean>> {

    const sendParams = this.getRequiredSendParams({ sender, signer });

    const preppedArgs = await this.encodeGateCheckArgs(args);

    return this.client.send.check({
      ...sendParams,
      args: { caller, gateId, args: preppedArgs }
    });
  }

  async mustCheck({ sender, signer, caller, gateId, args }: Omit<ContractArgs['check(address,uint64,byte[][])bool'], 'args'> & { args: GateCheckArg[] } & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = this.getRequiredSendParams({ sender, signer });

    const preppedArgs = await this.encodeGateCheckArgs(args);

    return this.client.send.mustCheck({
      ...sendParams,
      args: { caller, gateId, args: preppedArgs }
    });
  }

  async getGate({ sender, signer, gateId }: ContractArgs['getGate(uint64)(uint64,uint64,uint64,uint8,byte[])[]'] & MaybeSigner): Promise<any> {
    const sendParams = this.getSendParams({
      sender: sender ?? this.readerAccount,
      signer: signer ?? emptySigner
    });

    const { return: gates } = await this.client.send.getGate({ ...sendParams, args: { gateId } });

    if (gates === undefined) {
      throw new Error('Failed to get gate info');
    }

    // decode the resulting args into a GateRegistrationArg[]

    const decodedGates = gates.map(gate => {
      const obj = GateFilterEntryWithArgsFromTuple(gate)
      const gateType = this.getGateTypeFromContractId(obj.app);
      return this.decodeGateArgs(gateType, obj.args);
    });

    return decodedGates;
  }

  async cost({ sender, signer, ...args }: ContractArgs['cost((uint64,uint64,uint8)[],byte[][])uint64'] & MaybeSigner): Promise<bigint> {

    const sendParams = this.getSendParams({
      sender: sender ?? this.readerAccount,
      signer: signer ?? emptySigner
    });

    const { return: cost } = await this.client.send.cost({ ...sendParams, args });

    if (cost === undefined) {
      throw new Error('Failed to get cost for gate registration');
    }

    return cost;
  }

  readonly build = {

    check: async ({
      sender,
      signer,
      caller,
      gateId,
      args
    }: ( 
      Omit<ContractArgs['check(address,uint64,byte[][])bool'], 'args'>
      & { args: GateCheckArg[] }
      & MaybeSigner
    )): Promise<AppCallMethodCall> => {

      const sendParams = this.getRequiredSendParams({ sender, signer });

      const preppedArgs = await this.encodeGateCheckArgs(args);

      return await this.client.params.check({
        ...sendParams,
        args: { caller, gateId, args: preppedArgs }
      });
    },

    mustCheck: async ({
      sender,
      signer,
      caller,
      gateId,
      args
    }: ( 
      Omit<ContractArgs['check(address,uint64,byte[][])bool'], 'args'>
      & { args: GateCheckArg[] }
      & MaybeSigner
    )): Promise<AppCallMethodCall> => {

      const sendParams = this.getRequiredSendParams({ sender, signer });

      const preppedArgs = await this.encodeGateCheckArgs(args);

      return await this.client.params.mustCheck({
        ...sendParams,
        args: { caller, gateId, args: preppedArgs }
      });
    }
  }
}