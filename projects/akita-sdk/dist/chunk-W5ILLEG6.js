"use strict";Object.defineProperty(exports, "__esModule", {value: true}); var _class;




var _chunkHY3H6JQIjs = require('./chunk-HY3H6JQI.js');


var _chunk2WS6GQO5js = require('./chunk-2WS6GQO5.js');

// src/base.ts
var _algosdk = require('algosdk');
var BaseSDK = (_class = class {
  
  
  
  __init() {this.readerAccount = _chunkHY3H6JQIjs.DEFAULT_READER}
  __init2() {this.sendParams = _chunkHY3H6JQIjs.DEFAULT_SEND_PARAMS}
  /** The detected network for this SDK instance */
  
  /**
   * Override this in subclasses to specify the environment variable name for the app ID
   */
  static __initStatic() {this.envVarName = ""}
  constructor({ factoryParams, algorand, factory, readerAccount, sendParams }, envVarName) {;_class.prototype.__init.call(this);_class.prototype.__init2.call(this);
    this.network = _chunkHY3H6JQIjs.detectNetworkFromClient.call(void 0, algorand);
    const resolvedAppId = _chunkHY3H6JQIjs.resolveAppIdWithClient.call(void 0, 
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
    if (!_chunk2WS6GQO5js.hasSenderSigner.call(void 0, sendParams)) {
      throw new Error("Sender and signer must be provided either explicitly or through defaults at SDK instantiation");
    }
    return sendParams;
  }
  getReaderSendParams({ sender } = {}) {
    return {
      ...this.sendParams,
      ...sender !== void 0 ? { sender } : { sender: this.readerAccount },
      signer: _algosdk.makeEmptyTransactionSigner.call(void 0, )
    };
  }
}, _class.__initStatic(), _class);



exports.BaseSDK = BaseSDK;
//# sourceMappingURL=chunk-W5ILLEG6.js.map