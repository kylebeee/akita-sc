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
      checkShape: 'AssetGateCheckParams',
      structs: AssetAppSpec.structs
    },
    merkle_address: {
      registerShape: 'MerkleAddressGateRegistryInfo',
      checkShape: 'MerkleAddressGateCheckParams',
      structs: MerkleAddressAppSpec.structs
    },
    merkle_asset: {
      registerShape: 'MerkleAssetGateRegistryInfo',
      checkShape: 'MerkleAssetGateCheckParams',
      structs: MerkleAssetAppSpec.structs
    },
    nfd: {
      registerShape: 'None',
      checkShape: 'NFDGateCheckParams',
      structs: NFDAppSpec.structs
    },
    nfd_root: {
      registerShape: 'NFDRootGateRegistryInfo',
      checkShape: 'NFDRootGateCheckParams',
      structs: NFDRootAppSpec.structs
    },
    social_activity: {
      registerShape: 'SocialActivityGateRegistryInfo',
      checkShape: 'SocialActivityGateCheckParams',
      structs: SocialActivityAppSpec.structs
    },
    social_follower_count: {
      registerShape: 'SocialFollowerCountGateRegistryInfo',
      checkShape: 'SocialFollowerCountGateCheckParams',
      structs: SocialFollowerCountAppSpec.structs
    },
    social_follower_index: {
      registerShape: 'SocialFollowerIndexGateRegistryInfo',
      checkShape: 'SocialFollowerIndexGateCheckParams',
      structs: SocialFollowerIndexGateAppSpec.structs
    },
    social_impact: {
      registerShape: 'SocialImpactGateRegistryInfo',
      checkShape: 'SocialImpactGateCheckParams',
      structs: SocialImpactGateAppSpec.structs
    },
    social_moderator: {
      registerShape: 'SocialModeratorGateRegistryInfo',
      checkShape: 'SocialModeratorGateCheckParams',
      structs: SocialModeratorGateAppSpec.structs
    },
    staking_amount: {
      registerShape: 'StakingAmountGateRegistryInfo',
      checkShape: 'StakingAmountGateCheckParams',
      structs: StakingAmountGateAppSpec.structs
    },
    staking_power: {
      registerShape: 'StakingPowerGateRegistryInfo',
      checkShape: 'StakingPowerGateCheckParams',
      structs: StakingPowerGateAppSpec.structs
    },
    subscription: {
      registerShape: 'SubscriptionGateRegistryInfo',
      checkShape: 'SubscriptionGateCheckParams',
      structs: SubscriptionGateAppSpec.structs
    },
    subscription_streak: {
      registerShape: 'SubscriptionGateRegistryInfo',
      checkShape: 'SubscriptionGateCheckParams',
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

      const lo = logicalOperator === 'and'
        ? LogicalOperator.And
        : LogicalOperator.Or;

      filters.push([layer, appId, lo] as [bigint | number, bigint | number, bigint | number]);

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

  private async buildCheckArgs(args: GateCheckArg[]) {

    let data: Uint8Array[] = [];

    for (const arg of args) {
      const { type } = arg;

      switch (type) {
        case 'asset': {

          break;
        }
        case 'social_activity':
        case 'social_follower_count':
        case 'social_impact':
        case 'social_moderator': {

          break;
        }
        case 'merkle_address':
        case 'merkle_asset': {

          break;
        }
        case 'nfd_root': {

          break;
        }
        case 'social_follower_index': {

          break;
        }
        case 'staking_amount': {

          break;
        }
        case 'staking_power': {

          break;
        }
        case 'subscription': {

          break;
        }
        case 'subscription_streak': {

          break;
        }
        default: {
          throw new Error(`Unsupported gate type: ${type}`);
        }
      }
    }
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

  async check({ sender, signer, caller, gateId, args }: ContractArgs['check(address,uint64,byte[][])bool'] & MaybeSigner): Promise<TxnReturn<boolean>> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    return this.client.send.check({
      ...sendParams,
      args: { caller, gateId, args }
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