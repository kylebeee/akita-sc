import { BaseSDK } from "../../base";
import { UpdateAkitaDaoPluginArgs, UpdateAkitaDaoPluginClient, UpdateAkitaDaoPluginFactory } from "../../generated/UpdateAkitaDAOPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { getTxns } from "../utils";
import { microAlgo } from "@algorandfoundation/algokit-utils";
import { Txn } from "@algorandfoundation/algokit-utils/types/composer";

type ContractArgs = UpdateAkitaDaoPluginArgs["obj"];

type DeleteBoxedContractArgs = (
  Omit<ContractArgs['deleteBoxedContract(uint64,bool)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
)

type UpdateAppArgs = (
  Omit<ContractArgs['updateApp(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'>
  & { version: string, data: Uint8Array; }
  & MaybeSigner
  & { rekeyBack?: boolean }
)

type UpdateAkitaDaoAppIDForAppArgs = (
  Omit<ContractArgs['updateAkitaDaoAppIDForApp(uint64,bool,uint64,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean } 
)

type UpdateAkitaDaoEscrowForAppArgs = (
  Omit<ContractArgs['updateAkitaDaoEscrowForApp(uint64,bool,uint64,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
)

export class UpdateAkitaDAOPluginSDK extends BaseSDK<UpdateAkitaDaoPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: UpdateAkitaDaoPluginFactory, ...params });
  }

  deleteBoxedContract(): PluginSDKReturn
  deleteBoxedContract(args: DeleteBoxedContractArgs): PluginSDKReturn
  deleteBoxedContract(args?: DeleteBoxedContractArgs): PluginSDKReturn {
    const methodName = 'deleteBoxedContract';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;

    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const params = (
          await this.client.params.deleteBoxedContract({
            ...sendParams,
            args: { wallet, rekeyBack }
          })
        )

        return [{
          type: 'methodCall',
          ...params
        }]
      }
    });
  }

  updateApp(): PluginSDKReturn
  updateApp(args: UpdateAppArgs): PluginSDKReturn
  updateApp(args?: UpdateAppArgs): PluginSDKReturn {
    const methodNames = ['initBoxedContract', 'loadBoxedContract', 'updateApp'];
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: methodNames.map(methodName => this.client.appClient.getABIMethod(methodName).getSelector()),
        getTxns
      });
    }

    const { sender, signer, appId, version, data } = args;

    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: methodNames.map(methodName => this.client.appClient.getABIMethod(methodName).getSelector()),
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const txns: Txn[] = [];

        const initParams = (
          await this.client.params.initBoxedContract({
            ...sendParams,
            args: { wallet, version, size: data.length }
          })
        )

        txns.push({
          type: 'methodCall',
          ...initParams
        })

        // max loadContract calls necessary is 4
        // max loadContract data size is 2036
        // [selector:4][offset:8][data:>=2036] = 2048 bytes (max txn args size)
        // so we need to split the data into at most 4 chunks
        for (let i = 0; i < data.length; i += 2036) {
          const chunk = data.slice(i, i + 2036);
          const loadParams = (
            await this.client.params.loadBoxedContract({
              ...sendParams,
              args: { wallet, offset: i, data: chunk }
            })
          )

          txns.push({
            type: 'methodCall',
            ...loadParams
          })
        }

        const updateParams = (
          await this.client.params.updateApp({
            ...sendParams,
            args: { wallet, rekeyBack, appId }
          })
        )

        txns.push({
          type: 'methodCall',
          ...updateParams
        })

        return txns;
      }
    });
  }

  updateAkitaDaoAppIDForApp(): PluginSDKReturn
  updateAkitaDaoAppIDForApp(args: UpdateAkitaDaoAppIDForAppArgs): PluginSDKReturn
  updateAkitaDaoAppIDForApp(args?: UpdateAkitaDaoAppIDForAppArgs): PluginSDKReturn {
    const methodName = 'updateAkitaDaoAppIDForApp';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer, appId, newAkitaDaoAppId } = args;

    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const params = (
          await this.client.params.updateAkitaDaoAppIdForApp({
            ...sendParams,
            args: { wallet, rekeyBack, appId, newAkitaDaoAppId }
          })
        )

        return [{
          type: 'methodCall',
          ...params
        }]
      }
    });
  }

  updateAkitaDaoEscrowForApp(): PluginSDKReturn
  updateAkitaDaoEscrowForApp(args: UpdateAkitaDaoEscrowForAppArgs): PluginSDKReturn
  updateAkitaDaoEscrowForApp(args?: UpdateAkitaDaoEscrowForAppArgs): PluginSDKReturn {
    const methodName = 'updateAkitaDaoEscrowForApp';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer, appId, newEscrow } = args;

    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const params = (
          await this.client.params.updateAkitaDaoEscrowForApp({
            ...sendParams,
            args: { wallet, rekeyBack, appId, newEscrow },
          })
        )

        return [{
          type: 'methodCall',
          ...params
        }]
      }
    });
  }
}