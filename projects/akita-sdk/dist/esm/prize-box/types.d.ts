import { MaybeSigner } from "../types";
import { PrizeBoxArgs } from '../generated/PrizeBoxClient';
import { PrizeBoxFactoryArgs } from '../generated/PrizeBoxFactoryClient';
type FactoryContractArgs = PrizeBoxFactoryArgs["obj"];
export type MintParams = MaybeSigner & Omit<FactoryContractArgs['mint(pay,address)uint64'], 'payment'>;
type PrizeBoxContractArgs = PrizeBoxArgs["obj"];
export type OptInParams = MaybeSigner & Omit<PrizeBoxContractArgs['optin(pay,uint64)void'], 'payment'>;
export type TransferParams = MaybeSigner & PrizeBoxContractArgs['transfer(address)void'];
export type AssetInfo = {
    asset: bigint | number;
    amount: bigint | number;
};
export type WithdrawParams = MaybeSigner & {
    assets: AssetInfo[];
};
export type PrizeBoxState = {
    owner: string;
    optinCount: bigint;
};
export {};
