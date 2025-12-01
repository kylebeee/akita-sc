import { RevenueManagerPluginArgs, RevenueManagerPluginClient, RevenueManagerPluginFactory } from "../../generated/RevenueManagerPluginClient"
import { BaseSDK } from "../../base";
import { hasSenderSigner, MaybeSigner, NewContractSDKParams, PluginHookParams, PluginSDKReturn } from "../../types";
import algosdk, { Address } from "algosdk";
import { getTxns } from "../utils";
import { microAlgo } from "@algorandfoundation/algokit-utils";

const assetOptInCost = 100_000 // This is the cost for asset opt-in, adjust as necessary

type ContractArgs = RevenueManagerPluginArgs["obj"];

type OptInContractArgs = (
  Omit<ContractArgs['optIn(uint64,bool,uint64[],pay)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type NewReceiveEscrowContractArgs = (
  Omit<ContractArgs['newReceiveEscrow(uint64,bool,string,address,bool,bool,(address,uint8,uint64)[])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
)

type NewReceiveEscrowWithRefContractArgs = (
  Omit<ContractArgs['newReceiveEscrowWithRef(uint64,bool,string,address,bool,bool,(uint64,byte[]))void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
)

type StartEscrowDisbursementContractArgs = (
  Omit<ContractArgs['startEscrowDisbursement(uint64,bool)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
)

type ProcessEscrowAllocationContractArgs = (
  Omit<ContractArgs['processEscrowAllocation(uint64,bool,uint64[])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
  & { ids: bigint[] }
)

type FinalizeEscrowDisbursementContractArgs = (
  Omit<ContractArgs['finalizeEscrowDisbursement(uint64,bool,uint64[])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
  & { ids: bigint[] }
)

export class RevenueManagerPluginSDK extends BaseSDK<RevenueManagerPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: RevenueManagerPluginFactory, ...params });
  }

  optIn(): PluginSDKReturn
  optIn(args: OptInContractArgs): PluginSDKReturn
  optIn(args?: OptInContractArgs): PluginSDKReturn {
    const methodName = 'optIn';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer, assets } = args;

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

        const mbrPayment = this.client.algorand.createTransaction.payment({
          ...sendParams,
          amount: microAlgo(assetOptInCost * assets.length),
          receiver: spendingAddress ? spendingAddress : algosdk.getApplicationAddress(wallet),
        })

        const params = (
          await this.client.params.optIn({
            ...sendParams,
            args: { wallet, rekeyBack, assets, mbrPayment }
          })
        )

        return [{
          type: 'methodCall',
          ...params
        }]
      }
    });
  }

  newReceiveEscrow(): PluginSDKReturn
  newReceiveEscrow(args: NewReceiveEscrowContractArgs): PluginSDKReturn
  newReceiveEscrow(args?: NewReceiveEscrowContractArgs): PluginSDKReturn {
    const methodName = 'newReceiveEscrow';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer, escrow, source, allocatable, optinAllowed, splits } = args;

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
          await this.client.params.newReceiveEscrow({
            ...sendParams,
            args: { wallet, rekeyBack, escrow, source, allocatable, optinAllowed, splits }
          })
        )

        return [{
          type: 'methodCall',
          ...params
        }]
      }
    });
  }

  newReceiveEscrowWithRef(): PluginSDKReturn
  newReceiveEscrowWithRef(args: NewReceiveEscrowWithRefContractArgs): PluginSDKReturn
  newReceiveEscrowWithRef(args?: NewReceiveEscrowWithRefContractArgs): PluginSDKReturn {
    const methodName = 'newReceiveEscrowWithRef';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer, escrow, source, allocatable, optinAllowed, splitRef } = args;

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
          await this.client.params.newReceiveEscrowWithRef({
            ...sendParams,
            args: { wallet, rekeyBack, escrow, source, allocatable, optinAllowed, splitRef }
          })
        )

        return [{
          type: 'methodCall',
          ...params
        }]
      }
    });
  }


  startEscrowDisbursement(): PluginSDKReturn
  startEscrowDisbursement(args: StartEscrowDisbursementContractArgs): PluginSDKReturn
  startEscrowDisbursement(args?: StartEscrowDisbursementContractArgs): PluginSDKReturn {
    const methodName = 'startEscrowDisbursement';
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
          await this.client.params.startEscrowDisbursement({
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

  processEscrowAllocation(): PluginSDKReturn
  processEscrowAllocation(args: ProcessEscrowAllocationContractArgs): PluginSDKReturn
  processEscrowAllocation(args?: ProcessEscrowAllocationContractArgs): PluginSDKReturn {
    const methodName = 'processEscrowAllocation';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer, ids } = args;

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
          await this.client.params.processEscrowAllocation({
            ...sendParams,
            args: { wallet, rekeyBack, ids }
          })
        )

        return [{
          type: 'methodCall',
          ...params
        }]
      }
    });
  }

  finalizeEscrowDisbursement(): PluginSDKReturn
  finalizeEscrowDisbursement(args: FinalizeEscrowDisbursementContractArgs): PluginSDKReturn
  finalizeEscrowDisbursement(args?: FinalizeEscrowDisbursementContractArgs): PluginSDKReturn {
    const methodName = 'finalizeEscrowDisbursement';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer, ids } = args;

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
          await this.client.params.finalizeEscrowDisbursement({
            ...sendParams,
            args: { wallet, rekeyBack, ids }
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