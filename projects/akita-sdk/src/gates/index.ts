import { BaseSDK } from "../base";
import { TxnReturn } from '../types'
import { GateArgs, GateClient, GateFactory } from '../generated/GateClient'
import { hasSenderSigner, MaybeSigner, NewContractSDKParams } from "../types";
import { microAlgo } from "@algorandfoundation/algokit-utils";
import { emptySigner } from "../constants";
import { GateCheckArg, GateRegistrationArg, GateType, LogicalOperator } from "./types";
import { getABIEncodedValue, StructField } from "@algorandfoundation/algokit-utils/types/app-arc56";
import { APP_SPEC as AssetAppSpec } from '../generated/AssetGateClient'
import { APP_SPEC as MerkleAddressAppSpec } from '../generated/MerkleAddressGateClient'
import { APP_SPEC as MerkleAssetAppSpec } from '../generated/MerkleAssetGateClient'
import { APP_SPEC as NFDAppSpec } from '../generated/NFDGateClient'
import { APP_SPEC as NFDRootAppSpec } from '../generated/NFDGateClient'
import { APP_SPEC as SocialActivityAppSpec } from '../generated/SocialActivityGateClient'
import { APP_SPEC as SocialFollowerCountAppSpec } from '../generated/SocialFollowerCountGateClient'
import { APP_SPEC as SocialFollowerIndexGateAppSpec } from '../generated/SocialFollowerIndexGateClient'
import { APP_SPEC as SocialImpactGateAppSpec } from '../generated/SocialImpactGateClient'
import { APP_SPEC as SocialModeratorGateAppSpec } from '../generated/SocialModeratorGateClient'
import { APP_SPEC as StakingAmountGateAppSpec } from '../generated/StakingAmountGateClient'
import { APP_SPEC as StakingPowerGateAppSpec } from '../generated/StakingPowerGateClient'
import { APP_SPEC as SubscriptionGateAppSpec } from '../generated/SubscriptionGateClient'
import { APP_SPEC as SubscriptionStreakGateAppSpec } from '../generated/SubscriptionStreakGateClient'
import { encodeUint64 } from "algosdk";

type ContractArgs = GateArgs["obj"];

type GateEncodingInfo<T extends Record<string, StructField[]> = Record<string, StructField[]>> = {
  registerShape: keyof T
  checkShape: keyof T
  structs: T
}

export class GateSDK extends BaseSDK<GateClient> {

  gateEncodings: { [K in GateType]: GateEncodingInfo } = {
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

  constructor(params: NewContractSDKParams) {
    super({ factory: GateFactory, ...params });
  }

  private async buildRegistryArgs(args: GateRegistrationArg[]): Promise<{ filters: [bigint | number, bigint | number, bigint | number][]; args: Uint8Array[]; }> {

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
        case 'asset':
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
        case 'nfd_root': {
          const { root } = arg;
          data = getABIEncodedValue(
            { root },
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
          const { op, asset, stakingType, amount, includeStaked } = arg;
          data = getABIEncodedValue(
            { op, asset, stakingType, amount, includeStaked },
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

  private async buildCheckArgs(args: GateCheckArg[]): Promise<Uint8Array[]> {

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

  async register({ sender, signer, args }: { args: GateRegistrationArg[] } & MaybeSigner): Promise<TxnReturn<bigint>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    const preppedArgs = await this.buildRegistryArgs(args);

    // figure out cost
    const cost = await this.cost(preppedArgs)

    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      receiver: this.client.appAddress,
      amount: microAlgo(cost),
    })

    return this.client.send.register({
      ...sendParams,
      args: { payment, ...preppedArgs }
    });
  }

  async check({ sender, signer, caller, gateId, args }: Omit<ContractArgs['check(address,uint64,byte[][])bool'], 'args'> & { args: GateCheckArg[] } & MaybeSigner): Promise<TxnReturn<boolean>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    const preppedArgs = await this.buildCheckArgs(args);

    return this.client.send.check({
      ...sendParams,
      args: { caller, gateId, args: preppedArgs }
    });
  }

  async mustCheck({ sender, signer, caller, gateId, args }: Omit<ContractArgs['check(address,uint64,byte[][])bool'], 'args'> & { args: GateCheckArg[] } & MaybeSigner): Promise<TxnReturn<void>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    const preppedArgs = await this.buildCheckArgs(args);

    return this.client.send.mustCheck({
      ...sendParams,
      args: { caller, gateId, args: preppedArgs }
    });
  }

  async cost({ sender, signer, ...args }: ContractArgs['cost((uint64,uint64,uint8)[],byte[][])uint64'] & MaybeSigner): Promise<bigint> {

    const defaultParams = {
      ...this.sendParams,
      sender: this.readerAccount,
      signer: emptySigner
    }

    const sendParams = {
      ...defaultParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    const { return: cost } = await this.client.send.cost({ ...sendParams, args });

    if (cost === undefined) {
      throw new Error('Failed to get cost for gate registration');
    }

    return cost;
  }
}