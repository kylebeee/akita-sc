import { DEFAULT_READER, DEFAULT_SEND_PARAMS } from "./constants";
import { resolveAppIdWithClient, detectNetworkFromClient } from "./config";
import { hasSenderSigner } from "./types";
import { makeEmptyTransactionSigner } from "algosdk";
export class BaseSDK {
    constructor({ factoryParams, algorand, factory, readerAccount, sendParams }, envVarName) {
        this.readerAccount = DEFAULT_READER;
        this.sendParams = DEFAULT_SEND_PARAMS;
        // Detect network from AlgorandClient
        this.network = detectNetworkFromClient(algorand);
        // Resolve app ID from provided value, environment, or network config
        const resolvedAppId = resolveAppIdWithClient(algorand, factoryParams.appId, envVarName || this.constructor.envVarName || '', this.constructor.name);
        this.appId = resolvedAppId;
        this.algorand = algorand;
        if (readerAccount) {
            this.readerAccount = readerAccount;
        }
        if (sendParams) {
            this.sendParams = sendParams;
        }
        if (!!factoryParams.defaultSender) {
            this.sendParams.sender = factoryParams.defaultSender;
        }
        if (!!factoryParams.defaultSigner) {
            this.sendParams.signer = factoryParams.defaultSigner;
        }
        // Create the client with the resolved app ID
        this.client = new factory({ algorand }).getAppClientById({
            ...factoryParams,
            appId: resolvedAppId,
        });
    }
    setReaderAccount(readerAccount) {
        this.readerAccount = readerAccount;
    }
    setSendParams(sendParams) {
        this.sendParams = sendParams;
    }
    getSendParams({ sender, signer } = {}) {
        return {
            ...this.sendParams,
            ...(sender !== undefined && { sender }),
            ...(signer !== undefined && { signer }),
        };
    }
    getRequiredSendParams(params = {}) {
        const sendParams = this.getSendParams(params);
        if (!hasSenderSigner(sendParams)) {
            throw new Error('Sender and signer must be provided either explicitly or through defaults at SDK instantiation');
        }
        return sendParams;
    }
    getReaderSendParams({ sender } = {}) {
        return {
            ...this.sendParams,
            ...(sender !== undefined ? { sender } : { sender: this.readerAccount }),
            signer: makeEmptyTransactionSigner()
        };
    }
}
/**
 * Override this in subclasses to specify the environment variable name for the app ID
 */
BaseSDK.envVarName = '';
//# sourceMappingURL=base.js.map