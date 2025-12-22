import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { AkitaNetwork } from "./config";
import { ExpandedSendParams, ExpandedSendParamsWithSigner, MaybeSigner, NewBaseContractSDKParams } from "./types";
export declare abstract class BaseSDK<T> {
    appId: bigint;
    client: T;
    algorand: AlgorandClient;
    readerAccount: string;
    sendParams: ExpandedSendParams;
    /** The detected network for this SDK instance */
    network: AkitaNetwork;
    /**
     * Override this in subclasses to specify the environment variable name for the app ID
     */
    protected static envVarName: string;
    constructor({ factoryParams, algorand, factory, readerAccount, sendParams }: NewBaseContractSDKParams<T>, envVarName?: string);
    setReaderAccount(readerAccount: string): void;
    setSendParams(sendParams: ExpandedSendParams): void;
    protected getSendParams({ sender, signer }?: MaybeSigner): ExpandedSendParams;
    protected getRequiredSendParams(params?: MaybeSigner): ExpandedSendParamsWithSigner;
    protected getReaderSendParams({ sender }?: {
        sender?: string;
    }): ExpandedSendParams;
}
