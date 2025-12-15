import { BaseSDK } from "../../base";
import { NfdPluginArgs, NfdPluginClient, NfdPluginFactory } from "../../generated/NFDPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { getTxns } from "../utils";

type ContractArgs = NfdPluginArgs["obj"];

type DeleteFieldsArgs = (
  Omit<ContractArgs['deleteFields(uint64,bool,uint64,byte[][])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type UpdateFieldsArgs = (
  Omit<ContractArgs['updateFields(uint64,bool,uint64,byte[][])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type OfferForSaleArgs = (
  Omit<ContractArgs['offerForSale(uint64,bool,uint64,uint64,address)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type CancelSaleArgs = (
  Omit<ContractArgs['cancelSale(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type PostOfferArgs = (
  Omit<ContractArgs['postOffer(uint64,bool,uint64,uint64,string)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type PurchaseArgs = (
  Omit<ContractArgs['purchase(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type UpdateHashArgs = (
  Omit<ContractArgs['updateHash(uint64,bool,uint64,byte[])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type ContractLockArgs = (
  Omit<ContractArgs['contractLock(uint64,bool,uint64,bool)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type SegmentLockArgs = (
  Omit<ContractArgs['segmentLock(uint64,bool,uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type VaultOptInLockArgs = (
  Omit<ContractArgs['vaultOptInLock(uint64,bool,uint64,bool)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type VaultOptInArgs = (
  Omit<ContractArgs['vaultOptIn(uint64,bool,uint64,uint64[])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type VaultSendArgs = (
  Omit<ContractArgs['vaultSend(uint64,bool,uint64,uint64,address,string,uint64,uint64[])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type RenewArgs = (
  Omit<ContractArgs['renew(uint64,bool,uint64,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type SetPrimaryAddressArgs = (
  Omit<ContractArgs['setPrimaryAddress(uint64,bool,uint64,string,address)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

export class NFDPluginSDK extends BaseSDK<NfdPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: NfdPluginFactory, ...params });
  }

  deleteFields(): PluginSDKReturn;
  deleteFields(args: DeleteFieldsArgs): PluginSDKReturn;
  deleteFields(args?: DeleteFieldsArgs): PluginSDKReturn {
    const methodName = 'deleteFields';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.deleteFields({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  updateFields(): PluginSDKReturn;
  updateFields(args: UpdateFieldsArgs): PluginSDKReturn;
  updateFields(args?: UpdateFieldsArgs): PluginSDKReturn {
    const methodName = 'updateFields';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.updateFields({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  offerForSale(): PluginSDKReturn;
  offerForSale(args: OfferForSaleArgs): PluginSDKReturn;
  offerForSale(args?: OfferForSaleArgs): PluginSDKReturn {
    const methodName = 'offerForSale';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.offerForSale({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  cancelSale(): PluginSDKReturn;
  cancelSale(args: CancelSaleArgs): PluginSDKReturn;
  cancelSale(args?: CancelSaleArgs): PluginSDKReturn {
    const methodName = 'cancelSale';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.cancelSale({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  postOffer(): PluginSDKReturn;
  postOffer(args: PostOfferArgs): PluginSDKReturn;
  postOffer(args?: PostOfferArgs): PluginSDKReturn {
    const methodName = 'postOffer';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.postOffer({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  purchase(): PluginSDKReturn;
  purchase(args: PurchaseArgs): PluginSDKReturn;
  purchase(args?: PurchaseArgs): PluginSDKReturn {
    const methodName = 'purchase';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.purchase({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  updateHash(): PluginSDKReturn;
  updateHash(args: UpdateHashArgs): PluginSDKReturn;
  updateHash(args?: UpdateHashArgs): PluginSDKReturn {
    const methodName = 'updateHash';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.updateHash({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  contractLock(): PluginSDKReturn;
  contractLock(args: ContractLockArgs): PluginSDKReturn;
  contractLock(args?: ContractLockArgs): PluginSDKReturn {
    const methodName = 'contractLock';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.contractLock({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  segmentLock(): PluginSDKReturn;
  segmentLock(args: SegmentLockArgs): PluginSDKReturn;
  segmentLock(args?: SegmentLockArgs): PluginSDKReturn {
    const methodName = 'segmentLock';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.segmentLock({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  vaultOptInLock(): PluginSDKReturn;
  vaultOptInLock(args: VaultOptInLockArgs): PluginSDKReturn;
  vaultOptInLock(args?: VaultOptInLockArgs): PluginSDKReturn {
    const methodName = 'vaultOptInLock';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.vaultOptInLock({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  vaultOptIn(): PluginSDKReturn;
  vaultOptIn(args: VaultOptInArgs): PluginSDKReturn;
  vaultOptIn(args?: VaultOptInArgs): PluginSDKReturn {
    const methodName = 'vaultOptIn';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.vaultOptIn({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  vaultSend(): PluginSDKReturn;
  vaultSend(args: VaultSendArgs): PluginSDKReturn;
  vaultSend(args?: VaultSendArgs): PluginSDKReturn {
    const methodName = 'vaultSend';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.vaultSend({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  renew(): PluginSDKReturn;
  renew(args: RenewArgs): PluginSDKReturn;
  renew(args?: RenewArgs): PluginSDKReturn {
    const methodName = 'renew';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.renew({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  setPrimaryAddress(): PluginSDKReturn;
  setPrimaryAddress(args: SetPrimaryAddressArgs): PluginSDKReturn;
  setPrimaryAddress(args?: SetPrimaryAddressArgs): PluginSDKReturn {
    const methodName = 'setPrimaryAddress';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.setPrimaryAddress({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }
}
