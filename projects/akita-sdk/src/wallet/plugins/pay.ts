import { BaseSDK } from "../../base";
import { PayPluginArgs, PayPluginClient, PayPluginFactory } from "../../generated/PayPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { microAlgo } from "@algorandfoundation/algokit-utils";
import { getTxns } from "../utils";

type CreatePaymentParams = {
  receiver: Address | string,
  amount: bigint | number,
  asset: bigint | number,
}

type ContractArgs = PayPluginArgs["obj"];

type PayArgs = (
  Omit<ContractArgs['pay(uint64,bool,(address,uint64,uint64)[])void'], 'wallet' | 'rekeyBack' | 'payments'>
  & MaybeSigner
  & {
    rekeyBack?: boolean
    payments: CreatePaymentParams[]
  }
);

export class PayPluginSDK extends BaseSDK<PayPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: PayPluginFactory, ...params });
  }

  pay(): PluginSDKReturn;
  pay(args: PayArgs): PluginSDKReturn;
  pay(args?: PayArgs): PluginSDKReturn {
    const methodName = 'pay';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer, payments } = args;

    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const paymentsTuple = payments.map(payment => [
          payment.receiver.toString(),
          payment.asset,
          payment.amount,
        ]) as [string, bigint | number, bigint | number][];

        const params = (
          await this.client.params.pay({
            ...sendParams,
            args: { wallet, payments: paymentsTuple, rekeyBack },
            extraFee: microAlgo(1_000 * payments.length),
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