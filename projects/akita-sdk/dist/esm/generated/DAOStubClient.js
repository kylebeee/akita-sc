"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaoStubClient = exports.DaoStubFactory = exports.DaoStubParamsFactory = exports.APP_SPEC = void 0;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "DAOStub", "structs": {}, "methods": [{ "name": "isValidUpgrade", "args": [{ "type": "byte[32]", "name": "lease" }, { "type": "uint64", "name": "appBeingUpgraded" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 0, "bytes": 0 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": {}, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": ["NoOp"], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [37], "errorMessage": "OnCompletion must be NoOp && can only call when creating" }, { "pc": [26], "errorMessage": "OnCompletion must be NoOp && can only call when not creating" }, { "pc": [53], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [45], "errorMessage": "invalid number of bytes for uint8[32]" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy91cGRhdGUtYWtpdGEtZGFvL2NvbnRyYWN0LmFsZ28udHM6MTUKICAgIC8vIGNsYXNzIERBT1N0dWIgZXh0ZW5kcyBDb250cmFjdCB7CiAgICB0eG4gTnVtQXBwQXJncwogICAgYnogbWFpbl9fX2FsZ290c19fLmRlZmF1bHRDcmVhdGVANQogICAgcHVzaGJ5dGVzIDB4MmMyZjUxYzMgLy8gbWV0aG9kICJpc1ZhbGlkVXBncmFkZShieXRlWzMyXSx1aW50NjQpYm9vbCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIG1haW5faXNWYWxpZFVwZ3JhZGVfcm91dGVAMwogICAgZXJyCgptYWluX2lzVmFsaWRVcGdyYWRlX3JvdXRlQDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy91cGRhdGUtYWtpdGEtZGFvL2NvbnRyYWN0LmFsZ28udHM6MTYKICAgIC8vIGlzVmFsaWRVcGdyYWRlKGxlYXNlOiBieXRlczwzMj4sIGFwcEJlaW5nVXBncmFkZWQ6IHVpbnQ2NCk6IGJvb2xlYW4gewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgICYmCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgTm9PcCAmJiBjYW4gb25seSBjYWxsIHdoZW4gbm90IGNyZWF0aW5nCiAgICBiIGlzVmFsaWRVcGdyYWRlCgptYWluX19fYWxnb3RzX18uZGVmYXVsdENyZWF0ZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvdXBkYXRlLWFraXRhLWRhby9jb250cmFjdC5hbGdvLnRzOjE1CiAgICAvLyBjbGFzcyBEQU9TdHViIGV4dGVuZHMgQ29udHJhY3QgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgICEKICAgICYmCiAgICByZXR1cm4gLy8gb24gZXJyb3I6IE9uQ29tcGxldGlvbiBtdXN0IGJlIE5vT3AgJiYgY2FuIG9ubHkgY2FsbCB3aGVuIGNyZWF0aW5nCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvdXBkYXRlLWFraXRhLWRhby9jb250cmFjdC5hbGdvLnRzOjpEQU9TdHViLmlzVmFsaWRVcGdyYWRlW3JvdXRpbmddKCkgLT4gdm9pZDoKaXNWYWxpZFVwZ3JhZGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy91cGRhdGUtYWtpdGEtZGFvL2NvbnRyYWN0LmFsZ28udHM6MTYKICAgIC8vIGlzVmFsaWRVcGdyYWRlKGxlYXNlOiBieXRlczwzMj4sIGFwcEJlaW5nVXBncmFkZWQ6IHVpbnQ2NCk6IGJvb2xlYW4gewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGxlbgogICAgcHVzaGludCA4IC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgcHVzaGJ5dGVzIDB4MTUxZjdjNzUwMAogICAgbG9nCiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CzEbQQAYgAQsL1HDNhoAjgEAAQAxGRQxGBBEQgAIMRkUMRgUEEM2GgEVgSASRDYaAhWBCBJEgAUVH3x1ALCBAUM=", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
class BinaryStateValue {
    constructor(value) {
        this.value = value;
    }
    asByteArray() {
        return this.value;
    }
    asString() {
        return this.value !== undefined ? Buffer.from(this.value).toString('utf-8') : undefined;
    }
}
/**
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the DaoStub smart contract
 */
class DaoStubParamsFactory {
    /**
     * Constructs a no op call for the isValidUpgrade(byte[32],uint64)bool ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static isValidUpgrade(params) {
        return {
            ...params,
            method: 'isValidUpgrade(byte[32],uint64)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.lease, params.args.appBeingUpgraded],
        };
    }
}
exports.DaoStubParamsFactory = DaoStubParamsFactory;
/**
 * A factory to create and deploy one or more instance of the DAOStub smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class DaoStubFactory {
    /**
     * Creates a new instance of `DaoStubFactory`
     *
     * @param params The parameters to initialise the app factory with
     */
    constructor(params) {
        /**
         * Get parameters to create transactions (create and deploy related calls) for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Gets available create methods
             */
            create: {
                /**
                 * Creates a new instance of the DAOStub smart contract using a bare call.
                 *
                 * @param params The params for the bare (raw) call
                 * @returns The params for a create call
                 */
                bare: (params) => {
                    return this.appFactory.params.bare.create(params);
                },
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Gets available create methods
             */
            create: {
                /**
                 * Creates a new instance of the DAOStub smart contract using a bare call.
                 *
                 * @param params The params for the bare (raw) call
                 * @returns The transaction for a create call
                 */
                bare: (params) => {
                    return this.appFactory.createTransaction.bare.create(params);
                },
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Gets available create methods
             */
            create: {
                /**
                 * Creates a new instance of the DAOStub smart contract using a bare call.
                 *
                 * @param params The params for the bare (raw) call
                 * @returns The create result
                 */
                bare: async (params) => {
                    const result = await this.appFactory.send.bare.create(params);
                    return { result: result.result, appClient: new DaoStubClient(result.appClient) };
                },
            },
        };
        this.appFactory = new app_factory_1.AppFactory({
            ...params,
            appSpec: exports.APP_SPEC,
        });
    }
    /** The name of the app (from the ARC-32 / ARC-56 app spec or override). */
    get appName() {
        return this.appFactory.appName;
    }
    /** The ARC-56 app spec being used */
    get appSpec() {
        return exports.APP_SPEC;
    }
    /** A reference to the underlying `AlgorandClient` this app factory is using. */
    get algorand() {
        return this.appFactory.algorand;
    }
    /**
     * Returns a new `AppClient` client for an app instance of the given ID.
     *
     * Automatically populates appName, defaultSender and source maps from the factory
     * if not specified in the params.
     * @param params The parameters to create the app client
     * @returns The `AppClient`
     */
    getAppClientById(params) {
        return new DaoStubClient(this.appFactory.getAppClientById(params));
    }
    /**
     * Returns a new `AppClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     *
     * Automatically populates appName, defaultSender and source maps from the factory
     * if not specified in the params.
     * @param params The parameters to create the app client
     * @returns The `AppClient`
     */
    async getAppClientByCreatorAndName(params) {
        return new DaoStubClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the DAOStub smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
        });
        return { result: result.result, appClient: new DaoStubClient(result.appClient) };
    }
}
exports.DaoStubFactory = DaoStubFactory;
/**
 * A client to make calls to the DAOStub smart contract
 */
class DaoStubClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the DAOStub smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the DAOStub smart contract using the `isValidUpgrade(byte[32],uint64)bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            isValidUpgrade: (params) => {
                return this.appClient.params.call(DaoStubParamsFactory.isValidUpgrade(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the DAOStub smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the DAOStub smart contract using the `isValidUpgrade(byte[32],uint64)bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            isValidUpgrade: (params) => {
                return this.appClient.createTransaction.call(DaoStubParamsFactory.isValidUpgrade(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the DAOStub smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the DAOStub smart contract using the `isValidUpgrade(byte[32],uint64)bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            isValidUpgrade: async (params) => {
                const result = await this.appClient.send.call(DaoStubParamsFactory.isValidUpgrade(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current DAOStub app
         */
        this.state = {};
        this.appClient = appClientOrParams instanceof app_client_1.AppClient ? appClientOrParams : new app_client_1.AppClient({
            ...appClientOrParams,
            appSpec: exports.APP_SPEC,
        });
    }
    /**
     * Checks for decode errors on the given return value and maps the return value to the return type for the given method
     * @returns The typed return value or undefined if there was no value
     */
    decodeReturnValue(method, returnValue) {
        return returnValue !== undefined ? (0, app_arc56_1.getArc56ReturnValue)(returnValue, this.appClient.getABIMethod(method), exports.APP_SPEC.structs) : undefined;
    }
    /**
     * Returns a new `DaoStubClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new DaoStubClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `DaoStubClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new DaoStubClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
    }
    /** The ID of the app instance this client is linked to. */
    get appId() {
        return this.appClient.appId;
    }
    /** The app address of the app instance this client is linked to. */
    get appAddress() {
        return this.appClient.appAddress;
    }
    /** The name of the app. */
    get appName() {
        return this.appClient.appName;
    }
    /** The ARC-56 app spec being used */
    get appSpec() {
        return this.appClient.appSpec;
    }
    /** A reference to the underlying `AlgorandClient` this app client is using. */
    get algorand() {
        return this.appClient.algorand;
    }
    /**
     * Clone this app client with different params
     *
     * @param params The params to use for the the cloned app client. Omit a param to keep the original value. Set a param to override the original value. Setting to undefined will clear the original value.
     * @returns A new app client with the altered params
     */
    clone(params) {
        return new DaoStubClient(this.appClient.clone(params));
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a isValidUpgrade(byte[32],uint64)bool method call against the DAOStub contract
             */
            isValidUpgrade(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.isValidUpgrade(params)));
                resultMappers.push((v) => client.decodeReturnValue('isValidUpgrade(byte[32],uint64)bool', v));
                return this;
            },
            /**
             * Add a clear state call to the DAOStub contract
             */
            clearState(params) {
                promiseChain = promiseChain.then(() => composer.addAppCall(client.params.clearState(params)));
                return this;
            },
            addTransaction(txn, signer) {
                promiseChain = promiseChain.then(() => composer.addTransaction(txn, signer));
                return this;
            },
            async composer() {
                await promiseChain;
                return composer;
            },
            async simulate(options) {
                await promiseChain;
                const result = await (!options ? composer.simulate() : composer.simulate(options));
                return {
                    ...result,
                    returns: result.returns?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i](val) : val.returnValue)
                };
            },
            async send(params) {
                await promiseChain;
                const result = await composer.send(params);
                return {
                    ...result,
                    returns: result.returns?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i](val) : val.returnValue)
                };
            }
        };
    }
}
exports.DaoStubClient = DaoStubClient;
//# sourceMappingURL=DAOStubClient.js.map