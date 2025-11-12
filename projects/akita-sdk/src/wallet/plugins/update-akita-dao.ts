import { BaseSDK } from "../../base";
import { UpdateAkitaDaoPluginArgs, UpdateAkitaDaoPluginClient, UpdateAkitaDaoPluginFactory } from "../../generated/UpdateAkitaDAOPluginClient";
import { NewContractSDKParams, MaybeSigner, hasSenderSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { Txn } from "@algorandfoundation/algokit-utils/types/composer";
import { microAlgo } from "@algorandfoundation/algokit-utils";

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
  Omit<ContractArgs['updateApp(uint64,bool,uint64,string)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
)

type UpdateDaoArgs = (
  Omit<ContractArgs['updateDao(uint64,bool,uint64,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
)

type UpdateAkitaDaoForAppArgs = (
  Omit<ContractArgs['updateAkitaDaoForApp(uint64,bool,uint64,uint64)void'], 'wallet' | 'rekeyBack'>
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
        selector: this.client.appClient.getABIMethod(methodName).getSelector(),
        getTxns: async ({ }: PluginHookParams) => { return {} as Txn }
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
      selector: this.client.appClient.getABIMethod(methodName).getSelector(),
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const params = (
          await this.client.params.initBoxedContract({
            ...sendParams,
            args: { wallet, rekeyBack, version, size }
          })
        )

        return {
          type: 'methodCall',
          ...params
        }
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
        selector: this.client.appClient.getABIMethod(methodName).getSelector(),
        getTxns: async ({ }: PluginHookParams) => { return {} as Txn }
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
      selector: this.client.appClient.getABIMethod(methodName).getSelector(),
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const params = (
          await this.client.params.loadBoxedContract({
            ...sendParams,
            args: { wallet, rekeyBack, offset, data }
          })
        )

        return {
          type: 'methodCall',
          ...params
        }
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
        selector: this.client.appClient.getABIMethod(methodName).getSelector(),
        getTxns: async ({ }: PluginHookParams) => { return {} as Txn }
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
      selector: this.client.appClient.getABIMethod(methodName).getSelector(),
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const params = (
          await this.client.params.deleteBoxedContract({
            ...sendParams,
            args: { wallet, rekeyBack }
          })
        )

        return {
          type: 'methodCall',
          ...params
        }
      }
    });
  }

  updateApp(): PluginSDKReturn
  updateApp(args: UpdateAppArgs): PluginSDKReturn
  updateApp(args?: UpdateAppArgs): PluginSDKReturn {
    const methodName = 'updateApp';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selector: this.client.appClient.getABIMethod(methodName).getSelector(),
        getTxns: async ({ }: PluginHookParams) => { return {} as Txn }
      });
    }

    const { sender, signer, appId, newVersion } = args;

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
      selector: this.client.appClient.getABIMethod(methodName).getSelector(),
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const params = (
          await this.client.params.updateApp({
            ...sendParams,
            args: { wallet, rekeyBack, appId, newVersion }
          })
        )

        return {
          type: 'methodCall',
          ...params
        }
      }
    });
  }

  updateDao(): PluginSDKReturn
  updateDao(args: UpdateDaoArgs): PluginSDKReturn
  updateDao(args?: UpdateDaoArgs): PluginSDKReturn {
    const methodName = 'updateDao';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selector: this.client.appClient.getABIMethod(methodName).getSelector(),
        getTxns: async ({ }: PluginHookParams) => { return {} as Txn }
      });
    }

    const { sender, signer, proposalId, index } = args;

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
      selector: this.client.appClient.getABIMethod(methodName).getSelector(),
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const params = (
          await this.client.params.updateDao({
            ...sendParams,
            args: { wallet, rekeyBack, proposalId, index }
          })
        )

        return {
          type: 'methodCall',
          ...params
        }
      }
    });
  }

  updateAkitaDaoForApp(): PluginSDKReturn
  updateAkitaDaoForApp(args: UpdateAkitaDaoForAppArgs): PluginSDKReturn
  updateAkitaDaoForApp(args?: UpdateAkitaDaoForAppArgs): PluginSDKReturn {
    const methodName = 'updateAkitaDaoForApp';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selector: this.client.appClient.getABIMethod(methodName).getSelector(),
        getTxns: async ({ }: PluginHookParams) => { return {} as Txn }
      });
    }

    const { sender, signer, appId, newAkitaDao } = args;

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
      selector: this.client.appClient.getABIMethod(methodName).getSelector(),
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const params = (
          await this.client.params.updateAkitaDaoForApp({
            ...sendParams,
            args: { wallet, rekeyBack, appId, newAkitaDao }
          })
        )

        return {
          type: 'methodCall',
          ...params
        }
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
        selector: this.client.appClient.getABIMethod(methodName).getSelector(),
        getTxns: async ({ }: PluginHookParams) => { return {} as Txn }
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
      selector: this.client.appClient.getABIMethod(methodName).getSelector(),
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const params = (
          await this.client.params.updateAkitaDaoEscrowForApp({
            ...sendParams,
            args: { wallet, rekeyBack, appId, newEscrow },
            extraFee: microAlgo(1_000),
          })
        )

        return {
          type: 'methodCall',
          ...params
        }
      }
    });
  }
}