import { BaseSDK } from "../../base";
import { SubscriptionsPluginArgs, SubscriptionsPluginClient } from "../../generated/SubscriptionsPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = SubscriptionsPluginArgs["obj"];
type OptInArgs = (Omit<ContractArgs['optIn(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type InitDescriptionArgs = (Omit<ContractArgs['initDescription(uint64,uint64)void'], 'wallet'> & MaybeSigner);
type LoadDescriptionArgs = (Omit<ContractArgs['loadDescription(uint64,uint64,byte[])void'], 'wallet'> & MaybeSigner);
type NewServiceArgs = (Omit<ContractArgs['newService(uint64,bool,uint64,uint64,uint64,uint64,uint64,string,byte[36],uint8,byte[3])uint64'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type PauseServiceArgs = (Omit<ContractArgs['pauseService(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type ShutdownServiceArgs = (Omit<ContractArgs['shutdownService(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type BlockArgs = (Omit<ContractArgs['block(uint64,bool,address)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type UnblockArgs = (Omit<ContractArgs['unblock(uint64,bool,address)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type SubscribeArgs = (Omit<ContractArgs['subscribe(uint64,bool,uint64,address,uint64,uint64,uint64,byte[][])void'], 'wallet' | 'rekeyBack' | 'index' | 'args' | 'asset'> & MaybeSigner & {
    rekeyBack?: boolean;
    index?: bigint | number;
    args?: Uint8Array[];
    asset?: bigint | number;
});
type TriggerPaymentArgs = (Omit<ContractArgs['triggerPayment(uint64,bool,address,uint64,byte[][])void'], 'wallet' | 'rekeyBack' | 'args'> & MaybeSigner & {
    rekeyBack?: boolean;
    args?: Uint8Array[];
});
type StreakCheckArgs = (Omit<ContractArgs['streakCheck(uint64,bool,(address,uint64))void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type SetPassesArgs = (Omit<ContractArgs['setPasses(uint64,bool,uint64,address[])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class SubscriptionsPluginSDK extends BaseSDK<SubscriptionsPluginClient> {
    constructor(params: NewContractSDKParams);
    optIn(): PluginSDKReturn;
    optIn(args: OptInArgs): PluginSDKReturn;
    initDescription(): PluginSDKReturn;
    initDescription(args: InitDescriptionArgs): PluginSDKReturn;
    loadDescription(): PluginSDKReturn;
    loadDescription(args: LoadDescriptionArgs): PluginSDKReturn;
    newService(): PluginSDKReturn;
    newService(args: NewServiceArgs): PluginSDKReturn;
    pauseService(): PluginSDKReturn;
    pauseService(args: PauseServiceArgs): PluginSDKReturn;
    shutdownService(): PluginSDKReturn;
    shutdownService(args: ShutdownServiceArgs): PluginSDKReturn;
    block(): PluginSDKReturn;
    block(args: BlockArgs): PluginSDKReturn;
    unblock(): PluginSDKReturn;
    unblock(args: UnblockArgs): PluginSDKReturn;
    subscribe(): PluginSDKReturn;
    subscribe(args: SubscribeArgs): PluginSDKReturn;
    triggerPayment(): PluginSDKReturn;
    triggerPayment(args: TriggerPaymentArgs): PluginSDKReturn;
    streakCheck(): PluginSDKReturn;
    streakCheck(args: StreakCheckArgs): PluginSDKReturn;
    setPasses(): PluginSDKReturn;
    setPasses(args: SetPassesArgs): PluginSDKReturn;
}
export {};
