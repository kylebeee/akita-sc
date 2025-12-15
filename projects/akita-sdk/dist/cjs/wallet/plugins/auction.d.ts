import { BaseSDK } from "../../base";
import { AuctionPluginArgs, AuctionPluginClient } from "../../generated/AuctionPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = AuctionPluginArgs["obj"];
type NewAuctionArgs = (Omit<ContractArgs['new(uint64,bool,uint64,uint64,string,byte[32][],uint64,uint64,uint64,uint64,uint64,uint64,uint64,address,uint64)uint64'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type BidArgs = (Omit<ContractArgs['bid(uint64,bool,uint64,uint64,byte[][],address)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type ClaimPrizeArgs = (Omit<ContractArgs['claimPrize(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type RefundBidArgs = (Omit<ContractArgs['refundBid(uint64,bool,uint64,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type CancelArgs = (Omit<ContractArgs['cancel(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class AuctionPluginSDK extends BaseSDK<AuctionPluginClient> {
    constructor(params: NewContractSDKParams);
    new(): PluginSDKReturn;
    new(args: NewAuctionArgs): PluginSDKReturn;
    bid(): PluginSDKReturn;
    bid(args: BidArgs): PluginSDKReturn;
    claimPrize(): PluginSDKReturn;
    claimPrize(args: ClaimPrizeArgs): PluginSDKReturn;
    refundBid(): PluginSDKReturn;
    refundBid(args: RefundBidArgs): PluginSDKReturn;
    cancel(): PluginSDKReturn;
    cancel(args: CancelArgs): PluginSDKReturn;
}
export {};
