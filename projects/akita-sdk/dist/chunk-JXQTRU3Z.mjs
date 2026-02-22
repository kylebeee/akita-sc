import {
  DEFAULT_READER,
  DEFAULT_SEND_PARAMS,
  detectNetworkFromClient,
  resolveAppIdWithClient
} from "./chunk-WBPQYKCD.mjs";
import {
  hasSenderSigner
} from "./chunk-V3TNOMIB.mjs";

// src/base.ts
import { makeEmptyTransactionSigner } from "algosdk";
var BaseSDK = class {
  appId;
  client;
  algorand;
  readerAccount = DEFAULT_READER;
  sendParams = DEFAULT_SEND_PARAMS;
  /** The detected network for this SDK instance */
  network;
  /**
   * Override this in subclasses to specify the environment variable name for the app ID
   */
  static envVarName = "";
  constructor({ factoryParams, algorand, factory, readerAccount, sendParams }, envVarName) {
    this.network = detectNetworkFromClient(algorand);
    const resolvedAppId = resolveAppIdWithClient(
      algorand,
      factoryParams.appId,
      envVarName || this.constructor.envVarName || "",
      this.constructor.name
    );
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
    this.client = new factory({ algorand }).getAppClientById({
      ...factoryParams,
      appId: resolvedAppId
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
      ...sender !== void 0 && { sender },
      ...signer !== void 0 && { signer }
    };
  }
  getRequiredSendParams(params = {}) {
    const sendParams = this.getSendParams(params);
    if (!hasSenderSigner(sendParams)) {
      throw new Error("Sender and signer must be provided either explicitly or through defaults at SDK instantiation");
    }
    return sendParams;
  }
  getReaderSendParams({ sender } = {}) {
    return {
      ...this.sendParams,
      ...sender !== void 0 ? { sender } : { sender: this.readerAccount },
      signer: makeEmptyTransactionSigner()
    };
  }
};

export {
  BaseSDK
};
//# sourceMappingURL=chunk-JXQTRU3Z.mjs.map