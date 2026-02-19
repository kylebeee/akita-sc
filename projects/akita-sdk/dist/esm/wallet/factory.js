"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletFactorySDK = void 0;
exports.newWallet = newWallet;
const AbstractedAccountFactoryClient_1 = require("../generated/AbstractedAccountFactoryClient");
const index_1 = require("./index");
const base_1 = require("../base");
const config_1 = require("../config");
const constants_1 = require("../constants");
const algosdk_1 = require("algosdk");
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
class WalletFactorySDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: AbstractedAccountFactoryClient_1.AbstractedAccountFactoryFactory, ...params }, config_1.ENV_VAR_NAMES.WALLET_FACTORY_APP_ID);
    }
    async new({ sender, signer, controlledAddress = algosdk_1.ALGORAND_ZERO_ADDRESS_STRING, admin = '', nickname, referrer = algosdk_1.ALGORAND_ZERO_ADDRESS_STRING }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const cost = await this.cost();
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            receiver: this.client.appAddress,
            amount: (0, algokit_utils_1.microAlgo)(cost),
        });
        if (!admin) {
            admin = sendParams.sender instanceof algosdk_1.Address
                ? sendParams.sender.toString()
                : sendParams.sender;
        }
        const group = this.client.newGroup();
        const results = await group
            .newAccount({
            ...sendParams,
            args: {
                payment,
                controlledAddress,
                admin,
                nickname,
                referrer
            },
            maxFee: (5000).microAlgos()
        })
            .opUp({ args: {}, maxFee: (1000).microAlgos() })
            .send({ ...sendParams });
        const appId = results.returns[0];
        if (!appId) {
            throw new Error('Failed to create new wallet');
        }
        return new index_1.WalletSDK({
            algorand: this.algorand,
            factoryParams: {
                appId,
                defaultSender: sendParams.sender,
                defaultSigner: sendParams.signer
            }
        });
    }
    async get({ appId }) {
        return new index_1.WalletSDK({
            algorand: this.algorand,
            factoryParams: {
                appId,
                defaultSender: this.sendParams.sender,
                defaultSigner: this.sendParams.signer
            }
        });
    }
    async cost(params) {
        const sendParams = this.getSendParams({
            sender: this.readerAccount,
            signer: constants_1.emptySigner,
            ...params
        });
        const { return: cost } = await this.client.send.cost({
            ...sendParams,
            args: {}
        });
        if (cost === undefined) {
            throw new Error('Failed to get cost for wallet creation');
        }
        return cost;
    }
}
exports.WalletFactorySDK = WalletFactorySDK;
async function newWallet({ factoryParams, algorand, readerAccount, sendParams, sender, signer, controlledAddress = algosdk_1.ALGORAND_ZERO_ADDRESS_STRING, admin = '', nickname, referrer = algosdk_1.ALGORAND_ZERO_ADDRESS_STRING }) {
    const factory = new WalletFactorySDK({ factoryParams, algorand, readerAccount, sendParams });
    const sdk = await factory.new({ sender, signer, controlledAddress, admin, nickname, referrer });
    await sdk.register({ escrow: '' });
    return sdk;
}
//# sourceMappingURL=factory.js.map