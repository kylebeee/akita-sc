"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAbstractedAccountFactoryClient = exports.MockAbstractedAccountFactoryFactory = exports.MockAbstractedAccountFactoryParamsFactory = exports.APP_SPEC = void 0;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "MockAbstractedAccountFactory", "structs": {}, "methods": [{ "name": "update", "args": [{ "type": "string", "name": "newVersion" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["UpdateApplication"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "ping", "args": [], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 0, "bytes": 0 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": {}, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": ["NoOp"], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [72], "errorMessage": "OnCompletion must be NoOp && can only call when creating" }, { "pc": [34], "errorMessage": "OnCompletion must be NoOp && can only call when not creating" }, { "pc": [61], "errorMessage": "OnCompletion must be UpdateApplication && can only call when not creating" }, { "pc": [86], "errorMessage": "invalid number of bytes for (len+utf8[])" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICAvLyBzbWFydF9jb250cmFjdHMvbW9ja3Mvd2FsbGV0LWZhY3RvcnkvbW9jay5hbGdvLnRzOjQKICAgIC8vIGV4cG9ydCBjbGFzcyBNb2NrQWJzdHJhY3RlZEFjY291bnRGYWN0b3J5IGV4dGVuZHMgQ29udHJhY3QgewogICAgdHhuIE51bUFwcEFyZ3MKICAgIGJ6IG1haW5fX19hbGdvdHNfXy5kZWZhdWx0Q3JlYXRlQDYKICAgIHB1c2hieXRlc3MgMHhlYTkxODBkZCAweDFkNWM1NjFiIC8vIG1ldGhvZCAidXBkYXRlKHN0cmluZyl2b2lkIiwgbWV0aG9kICJwaW5nKCl1aW50NjQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBtYWluX3VwZGF0ZV9yb3V0ZUAzIG1haW5fcGluZ19yb3V0ZUA0CiAgICBlcnIKCm1haW5fcGluZ19yb3V0ZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL21vY2tzL3dhbGxldC1mYWN0b3J5L21vY2suYWxnby50czo5CiAgICAvLyBwaW5nKCk6IHVpbnQ2NCB7CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgJiYKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gbXVzdCBiZSBOb09wICYmIGNhbiBvbmx5IGNhbGwgd2hlbiBub3QgY3JlYXRpbmcKICAgIHB1c2hieXRlcyAweDE1MWY3Yzc1MDAwMDAwMDAwMDAwMTA5MgogICAgbG9nCiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCgptYWluX3VwZGF0ZV9yb3V0ZUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL21vY2tzL3dhbGxldC1mYWN0b3J5L21vY2suYWxnby50czo2CiAgICAvLyBAYWJpbWV0aG9kKHsgYWxsb3dBY3Rpb25zOiBbJ1VwZGF0ZUFwcGxpY2F0aW9uJ10gfSkKICAgIHR4biBPbkNvbXBsZXRpb24KICAgIHB1c2hpbnQgNCAvLyBVcGRhdGVBcHBsaWNhdGlvbgogICAgPT0KICAgIHR4biBBcHBsaWNhdGlvbklECiAgICAmJgogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBtdXN0IGJlIFVwZGF0ZUFwcGxpY2F0aW9uICYmIGNhbiBvbmx5IGNhbGwgd2hlbiBub3QgY3JlYXRpbmcKICAgIGIgdXBkYXRlCgptYWluX19fYWxnb3RzX18uZGVmYXVsdENyZWF0ZUA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL21vY2tzL3dhbGxldC1mYWN0b3J5L21vY2suYWxnby50czo0CiAgICAvLyBleHBvcnQgY2xhc3MgTW9ja0Fic3RyYWN0ZWRBY2NvdW50RmFjdG9yeSBleHRlbmRzIENvbnRyYWN0IHsKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICAhCiAgICAmJgogICAgcmV0dXJuIC8vIG9uIGVycm9yOiBPbkNvbXBsZXRpb24gbXVzdCBiZSBOb09wICYmIGNhbiBvbmx5IGNhbGwgd2hlbiBjcmVhdGluZwoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9tb2Nrcy93YWxsZXQtZmFjdG9yeS9tb2NrLmFsZ28udHM6Ok1vY2tBYnN0cmFjdGVkQWNjb3VudEZhY3RvcnkudXBkYXRlW3JvdXRpbmddKCkgLT4gdm9pZDoKdXBkYXRlOgogICAgLy8gc21hcnRfY29udHJhY3RzL21vY2tzL3dhbGxldC1mYWN0b3J5L21vY2suYWxnby50czo2CiAgICAvLyBAYWJpbWV0aG9kKHsgYWxsb3dBY3Rpb25zOiBbJ1VwZGF0ZUFwcGxpY2F0aW9uJ10gfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgcHVzaGludCAwIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBwdXNoaW50IDIgLy8gMgogICAgKwogICAgc3dhcAogICAgbGVuCiAgICA9PQogICAgcmV0dXJuIC8vIG9uIGVycm9yOiBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCg==", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CzEbQQA7ggIE6pGA3QQdXFYbNhoAjgIAGgABADEZFDEYEESADBUffHUAAAAAAAAQkrCBAUMxGYEEEjEYEERCAAgxGRQxGBQQQzYaAUmBAFmBAghMFRJD", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the MockAbstractedAccountFactory smart contract
 */
class MockAbstractedAccountFactoryParamsFactory {
    /**
     * Gets available update ABI call param factories
     */
    static get update() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'update':
                    case 'update(string)void':
                        return MockAbstractedAccountFactoryParamsFactory.update.update(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs update ABI call params for the MockAbstractedAccountFactory smart contract using the update(string)void ABI method
             *
             * @param params Parameters for the call
             * @returns An `AppClientMethodCallParams` object for the call
             */
            update(params) {
                return {
                    ...params,
                    method: 'update(string)void',
                    args: Array.isArray(params.args) ? params.args : [params.args.newVersion],
                };
            },
        };
    }
    /**
     * Constructs a no op call for the ping()uint64 ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static ping(params) {
        return {
            ...params,
            method: 'ping()uint64',
            args: Array.isArray(params.args) ? params.args : [],
        };
    }
}
exports.MockAbstractedAccountFactoryParamsFactory = MockAbstractedAccountFactoryParamsFactory;
/**
 * A factory to create and deploy one or more instance of the MockAbstractedAccountFactory smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class MockAbstractedAccountFactoryFactory {
    /**
     * Creates a new instance of `MockAbstractedAccountFactoryFactory`
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
                 * Creates a new instance of the MockAbstractedAccountFactory smart contract using a bare call.
                 *
                 * @param params The params for the bare (raw) call
                 * @returns The params for a create call
                 */
                bare: (params) => {
                    return this.appFactory.params.bare.create(params);
                },
            },
            /**
             * Gets available deployUpdate methods
             */
            deployUpdate: {
                /**
                 * Updates an existing instance of the MockAbstractedAccountFactory smart contract using the update(string)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The deployUpdate params
                 */
                update: (params) => {
                    return this.appFactory.params.deployUpdate(MockAbstractedAccountFactoryParamsFactory.update.update(params));
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
                 * Creates a new instance of the MockAbstractedAccountFactory smart contract using a bare call.
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
                 * Creates a new instance of the MockAbstractedAccountFactory smart contract using a bare call.
                 *
                 * @param params The params for the bare (raw) call
                 * @returns The create result
                 */
                bare: async (params) => {
                    const result = await this.appFactory.send.bare.create(params);
                    return { result: result.result, appClient: new MockAbstractedAccountFactoryClient(result.appClient) };
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
        return new MockAbstractedAccountFactoryClient(this.appFactory.getAppClientById(params));
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
        return new MockAbstractedAccountFactoryClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the MockAbstractedAccountFactory smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            updateParams: params.updateParams?.method ? MockAbstractedAccountFactoryParamsFactory.update._resolveByMethod(params.updateParams) : params.updateParams ? params.updateParams : undefined,
        });
        return { result: result.result, appClient: new MockAbstractedAccountFactoryClient(result.appClient) };
    }
}
exports.MockAbstractedAccountFactoryFactory = MockAbstractedAccountFactoryFactory;
/**
 * A client to make calls to the MockAbstractedAccountFactory smart contract
 */
class MockAbstractedAccountFactoryClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Gets available update methods
             */
            update: {
                /**
                 * Updates an existing instance of the MockAbstractedAccountFactory smart contract using the `update(string)void` ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The update params
                 */
                update: (params) => {
                    return this.appClient.params.update(MockAbstractedAccountFactoryParamsFactory.update.update(params));
                },
            },
            /**
             * Makes a clear_state call to an existing instance of the MockAbstractedAccountFactory smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the MockAbstractedAccountFactory smart contract using the `ping()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            ping: (params = { args: [] }) => {
                return this.appClient.params.call(MockAbstractedAccountFactoryParamsFactory.ping(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Gets available update methods
             */
            update: {
                /**
                 * Updates an existing instance of the MockAbstractedAccountFactory smart contract using the `update(string)void` ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The update transaction
                 */
                update: (params) => {
                    return this.appClient.createTransaction.update(MockAbstractedAccountFactoryParamsFactory.update.update(params));
                },
            },
            /**
             * Makes a clear_state call to an existing instance of the MockAbstractedAccountFactory smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the MockAbstractedAccountFactory smart contract using the `ping()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            ping: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(MockAbstractedAccountFactoryParamsFactory.ping(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Gets available update methods
             */
            update: {
                /**
                 * Updates an existing instance of the MockAbstractedAccountFactory smart contract using the `update(string)void` ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The update result
                 */
                update: async (params) => {
                    const result = await this.appClient.send.update(MockAbstractedAccountFactoryParamsFactory.update.update(params));
                    return { ...result, return: result.return };
                },
            },
            /**
             * Makes a clear_state call to an existing instance of the MockAbstractedAccountFactory smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the MockAbstractedAccountFactory smart contract using the `ping()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            ping: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(MockAbstractedAccountFactoryParamsFactory.ping(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current MockAbstractedAccountFactory app
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
     * Returns a new `MockAbstractedAccountFactoryClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new MockAbstractedAccountFactoryClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `MockAbstractedAccountFactoryClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new MockAbstractedAccountFactoryClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
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
        return new MockAbstractedAccountFactoryClient(this.appClient.clone(params));
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a ping()uint64 method call against the MockAbstractedAccountFactory contract
             */
            ping(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.ping(params)));
                resultMappers.push((v) => client.decodeReturnValue('ping()uint64', v));
                return this;
            },
            get update() {
                return {
                    update: (params) => {
                        promiseChain = promiseChain.then(async () => composer.addAppUpdateMethodCall(await client.params.update.update(params)));
                        resultMappers.push(undefined);
                        return this;
                    },
                };
            },
            /**
             * Add a clear state call to the MockAbstractedAccountFactory contract
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
exports.MockAbstractedAccountFactoryClient = MockAbstractedAccountFactoryClient;
//# sourceMappingURL=MockAbstractedAccountFactoryClient.js.map