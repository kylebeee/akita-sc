import { BaseSDK } from "../../base";
import { UpdateAkitaDaoPluginArgs, UpdateAkitaDaoPluginClient, UpdateAkitaDaoPluginFactory } from "../../generated/UpdateAkitaDAOPluginClient";
import { NewContractSDKParams, MaybeSigner, hasSenderSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { getTxns } from "../utils";
import { microAlgo } from "@algorandfoundation/algokit-utils";
import { Txn } from "@algorandfoundation/algokit-utils/types/composer";

type ContractArgs = UpdateAkitaDaoPluginArgs["obj"];

type InitBoxedContractArgs = (
  Omit<ContractArgs['initBoxedContract(uint64,bool,string,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type LoadBoxedContractArgs = (
  Omit<ContractArgs['loadBoxedContract(uint64,bool,uint64,byte[])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
)

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

  initBoxedContract(): PluginSDKReturn
  initBoxedContract(args: InitBoxedContractArgs): PluginSDKReturn
  initBoxedContract(args?: InitBoxedContractArgs): PluginSDKReturn {
    const methodName = 'initBoxedContract';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer, version, size } = args;

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const params = (
          await this.client.params.initBoxedContract({
            ...sendParams,
            args: { wallet, rekeyBack, version, size }
          })
        )

        return [{
          type: 'methodCall',
          ...params
        }]
      }
    });
  }

  loadBoxedContract(): PluginSDKReturn
  loadBoxedContract(args: LoadBoxedContractArgs): PluginSDKReturn
  loadBoxedContract(args?: LoadBoxedContractArgs): PluginSDKReturn {
    const methodName = 'loadBoxedContract';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer, offset, data } = args;

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const params = (
          await this.client.params.loadBoxedContract({
            ...sendParams,
            args: { wallet, rekeyBack, offset, data }
          })
        )

        return [{
          type: 'methodCall',
          ...params
        }]
      }
    });
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

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

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

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: methodNames.map(methodName => this.client.appClient.getABIMethod(methodName).getSelector()),
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const txns: Txn[] = [];

        const initParams = (
          await this.client.params.initBoxedContract({
            ...sendParams,
            args: { wallet, rekeyBack, version, size: data.length }
          })
        )

        txns.push({
          type: 'methodCall',
          ...initParams
        })

        // max loadContract calls necessary is 5
        // max loadContract data size is 2027
        // [selector:4][wallet:8][rekeyBack:1][offset:8][data:2027] = 2048 bytes (max txn args size)
        // so we need to split the data into at most 5 chunks
        for (let i = 0; i < data.length; i += 2027) {
          const chunk = data.slice(i, i + 2027);
          const loadParams = (
            await this.client.params.loadBoxedContract({
              ...sendParams,
              args: { wallet, rekeyBack, offset: i, data: chunk }
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

  updateAkitaDaoForApp(): PluginSDKReturn
  updateAkitaDaoForApp(args: UpdateAkitaDaoAppIDForAppArgs): PluginSDKReturn
  updateAkitaDaoForApp(args?: UpdateAkitaDaoAppIDForAppArgs): PluginSDKReturn {
    const methodName = 'updateAkitaDaoForApp';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer, appId, newAkitaDaoAppId } = args;

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

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

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const params = (
          await this.client.params.updateAkitaDaoEscrowForApp({
            ...sendParams,
            args: { wallet, rekeyBack, appId, newEscrow },
            extraFee: microAlgo(1_000),
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