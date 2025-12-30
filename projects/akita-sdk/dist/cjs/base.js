"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSDK = void 0;
const constants_1 = require("./constants");
const config_1 = require("./config");
const types_1 = require("./types");
const algosdk_1 = require("algosdk");
class BaseSDK {
    constructor({ factoryParams, algorand, factory, readerAccount, sendParams }, envVarName) {
        this.readerAccount = constants_1.DEFAULT_READER;
        this.sendParams = constants_1.DEFAULT_SEND_PARAMS;
        // Detect network from AlgorandClient
        this.network = (0, config_1.detectNetworkFromClient)(algorand);
        // Resolve app ID from provided value, environment, or network config
        const resolvedAppId = (0, config_1.resolveAppIdWithClient)(algorand, factoryParams.appId, envVarName || this.constructor.envVarName || '', this.constructor.name);
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
        if (!(0, types_1.hasSenderSigner)(sendParams)) {
            throw new Error('Sender and signer must be provided either explicitly or through defaults at SDK instantiation');
        }
        return sendParams;
    }
    getReaderSendParams({ sender } = {}) {
        return {
            ...this.sendParams,
            ...(sender !== undefined ? { sender } : { sender: this.readerAccount }),
            signer: (0, algosdk_1.makeEmptyTransactionSigner)()
        };
    }
}
exports.BaseSDK = BaseSDK;
/**
 * Override this in subclasses to specify the environment variable name for the app ID
 */
BaseSDK.envVarName = '';
//# sourceMappingURL=base.js.map