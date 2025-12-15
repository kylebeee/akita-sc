import { AppClient as _AppClient, } from '@algorandfoundation/algokit-utils/types/app-client';
import { AppFactory as _AppFactory } from '@algorandfoundation/algokit-utils/types/app-factory';
export const APP_SPEC = { "name": "Escrow", "structs": {}, "methods": [{ "name": "create", "args": [{ "type": "byte[]", "name": "creator" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "rekey", "args": [{ "type": "address", "name": "rekeyTo" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "delete", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["DeleteApplication"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 0, "bytes": 1 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "creator": { "keyType": "AVMString", "valueType": "AVMBytes", "key": "Y3JlYXRvcg==" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [63], "errorMessage": "OnCompletion must be DeleteApplication && can only call when not creating" }, { "pc": [21], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [136], "errorMessage": "Only the factory can delete the application" }, { "pc": [80], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [105], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [111], "errorMessage": "only the creator can rekey a spend contract" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMSAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6NgogICAgLy8gZXhwb3J0IGNsYXNzIEVzY3JvdyBleHRlbmRzIENvbnRyYWN0IHsKICAgIHB1c2hieXRlcyAweDI0Mzc4ZDNjIC8vIG1ldGhvZCAiZGVsZXRlKCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggbWFpbl9kZWxldGVfcm91dGVAMgoKbWFpbl9zd2l0Y2hfY2FzZV9uZXh0QDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6NgogICAgLy8gZXhwb3J0IGNsYXNzIEVzY3JvdyBleHRlbmRzIENvbnRyYWN0IHsKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gbXVzdCBiZSBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYnogbWFpbl9jcmVhdGVfTm9PcEA3CiAgICBwdXNoYnl0ZXMgMHg2NWE5N2JjYyAvLyBtZXRob2QgInJla2V5KGFkZHJlc3Mpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIHJla2V5CiAgICBlcnIKCm1haW5fY3JlYXRlX05vT3BANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvY29udHJhY3QuYWxnby50czo2CiAgICAvLyBleHBvcnQgY2xhc3MgRXNjcm93IGV4dGVuZHMgQ29udHJhY3QgewogICAgcHVzaGJ5dGVzIDB4OGU3OTM1OGQgLy8gbWV0aG9kICJjcmVhdGUoYnl0ZVtdKXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBjcmVhdGUKICAgIGVycgoKbWFpbl9kZWxldGVfcm91dGVAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvY29udHJhY3QuYWxnby50czoyNwogICAgLy8gQGFiaW1ldGhvZCh7IGFsbG93QWN0aW9uczogJ0RlbGV0ZUFwcGxpY2F0aW9uJyB9KQogICAgdHhuIE9uQ29tcGxldGlvbgogICAgcHVzaGludCA1IC8vIERlbGV0ZUFwcGxpY2F0aW9uCiAgICA9PQogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgICYmCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgRGVsZXRlQXBwbGljYXRpb24gJiYgY2FuIG9ubHkgY2FsbCB3aGVuIG5vdCBjcmVhdGluZwogICAgYiBkZWxldGUKCgovLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6OkVzY3Jvdy5jcmVhdGVbcm91dGluZ10oKSAtPiB2b2lkOgpjcmVhdGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6MTAKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMSAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgcHVzaGludCAyIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6OAogICAgLy8gY3JlYXRvciA9IEdsb2JhbFN0YXRlPGJ5dGVzPih7IGtleTogRXNjcm93R2xvYmFsU3RhdGVLZXlzQ3JlYXRvciB9KQogICAgcHVzaGJ5dGVzICJjcmVhdG9yIgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjEyCiAgICAvLyB0aGlzLmNyZWF0b3IudmFsdWUgPSBjcmVhdG9yCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjEwCiAgICAvLyBAYWJpbWV0aG9kKHsgb25DcmVhdGU6ICdyZXF1aXJlJyB9KQogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvY29udHJhY3QuYWxnby50czo6RXNjcm93LnJla2V5W3JvdXRpbmddKCkgLT4gdm9pZDoKcmVrZXk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6MTUKICAgIC8vIHJla2V5KHJla2V5VG86IEFjY291bnQpOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvY29udHJhY3QuYWxnby50czoxNgogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IEdsb2JhbC5jcmVhdG9yQWRkcmVzcywgRVJSX09OTFlfQ1JFQVRPUl9DQU5fUkVLRVkpCiAgICB0eG4gU2VuZGVyCiAgICBnbG9iYWwgQ3JlYXRvckFkZHJlc3MKICAgID09CiAgICBhc3NlcnQgLy8gb25seSB0aGUgY3JlYXRvciBjYW4gcmVrZXkgYSBzcGVuZCBjb250cmFjdAogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjE4LTI0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBhbW91bnQ6IDAsCiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIHJla2V5VG8KICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6MjEKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBpdHhuX2ZpZWxkIFJla2V5VG8KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvY29udHJhY3QuYWxnby50czoyMAogICAgLy8gYW1vdW50OiAwLAogICAgaW50Y18xIC8vIDAKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6MTgtMjMKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIGFtb3VudDogMCwKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgcmVrZXlUbwogICAgLy8gICB9KQogICAgaW50Y18wIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMSAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjE4LTI0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBhbW91bnQ6IDAsCiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIHJla2V5VG8KICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjE1CiAgICAvLyByZWtleShyZWtleVRvOiBBY2NvdW50KTogdm9pZCB7CiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjpFc2Nyb3cuZGVsZXRlW3JvdXRpbmddKCkgLT4gdm9pZDoKZGVsZXRlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjI5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gR2xvYmFsLmNyZWF0b3JBZGRyZXNzLCBFUlJfT05MWV9GQUNUT1JZX0NBTl9ERUxFVEUpCiAgICB0eG4gU2VuZGVyCiAgICBnbG9iYWwgQ3JlYXRvckFkZHJlc3MKICAgID09CiAgICBhc3NlcnQgLy8gT25seSB0aGUgZmFjdG9yeSBjYW4gZGVsZXRlIHRoZSBhcHBsaWNhdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjMxLTMzCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsgY2xvc2VSZW1haW5kZXJUbzogR2xvYmFsLmNyZWF0b3JBZGRyZXNzIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjMyCiAgICAvLyAucGF5bWVudCh7IGNsb3NlUmVtYWluZGVyVG86IEdsb2JhbC5jcmVhdG9yQWRkcmVzcyB9KQogICAgZ2xvYmFsIENyZWF0b3JBZGRyZXNzCiAgICBpdHhuX2ZpZWxkIENsb3NlUmVtYWluZGVyVG8KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvY29udHJhY3QuYWxnby50czozMS0zMgogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7IGNsb3NlUmVtYWluZGVyVG86IEdsb2JhbC5jcmVhdG9yQWRkcmVzcyB9KQogICAgaW50Y18wIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMSAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjMxLTMzCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsgY2xvc2VSZW1haW5kZXJUbzogR2xvYmFsLmNyZWF0b3JBZGRyZXNzIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvY29udHJhY3QuYWxnby50czoyNwogICAgLy8gQGFiaW1ldGhvZCh7IGFsbG93QWN0aW9uczogJ0RlbGV0ZUFwcGxpY2F0aW9uJyB9KQogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyACAQCABCQ3jTw2GgCOAQAlMRkURDEYQQAOgARlqXvMNhoAjgEAOQCABI55NY02GgCOAQANADEZgQUSMRgQREIAQDYaAUkjWYECCEsBFRJEVwIAgAdjcmVhdG9yTGciQzYaAUkVgSASRDEAMgkSRLEyCrIHsiAjsggishAjsgGzIkMxADIJEkSxMgmyCSKyECOyAbMiQw==", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the Escrow smart contract
 */
export class EscrowParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(byte[])void':
                        return EscrowParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the Escrow smart contract using the create(byte[])void ABI method
             *
             * @param params Parameters for the call
             * @returns An `AppClientMethodCallParams` object for the call
             */
            create(params) {
                return {
                    ...params,
                    method: 'create(byte[])void',
                    args: Array.isArray(params.args) ? params.args : [params.args.creator],
                };
            },
        };
    }
    /**
     * Gets available delete ABI call param factories
     */
    static get delete() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'delete':
                    case 'delete()void':
                        return EscrowParamsFactory.delete.delete(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs delete ABI call params for the Escrow smart contract using the delete()void ABI method
             *
             * @param params Parameters for the call
             * @returns An `AppClientMethodCallParams` object for the call
             */
            delete(params) {
                return {
                    ...params,
                    method: 'delete()void',
                    args: Array.isArray(params.args) ? params.args : [],
                };
            },
        };
    }
    /**
     * Constructs a no op call for the rekey(address)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static rekey(params) {
        return {
            ...params,
            method: 'rekey(address)void',
            args: Array.isArray(params.args) ? params.args : [params.args.rekeyTo],
        };
    }
}
/**
 * A factory to create and deploy one or more instance of the Escrow smart contract and to create one or more app clients to interact with those (or other) app instances
 */
export class EscrowFactory {
    /**
     * Creates a new instance of `EscrowFactory`
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
                 * Creates a new instance of the Escrow smart contract using the create(byte[])void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create params
                 */
                create: (params) => {
                    return this.appFactory.params.create(EscrowParamsFactory.create.create(params));
                },
            },
            /**
             * Gets available deployDelete methods
             */
            deployDelete: {
                /**
                 * Deletes an existing instance of the Escrow smart contract using the delete()void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The deployDelete params
                 */
                delete: (params = { args: [] }) => {
                    return this.appFactory.params.deployDelete(EscrowParamsFactory.delete.delete(params));
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
                 * Creates a new instance of the Escrow smart contract using the create(byte[])void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create transaction
                 */
                create: (params) => {
                    return this.appFactory.createTransaction.create(EscrowParamsFactory.create.create(params));
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
                 * Creates a new instance of the Escrow smart contract using an ABI method call using the create(byte[])void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create result
                 */
                create: async (params) => {
                    const result = await this.appFactory.send.create(EscrowParamsFactory.create.create(params));
                    return { result: { ...result.result, return: result.result.return }, appClient: new EscrowClient(result.appClient) };
                },
            },
        };
        this.appFactory = new _AppFactory({
            ...params,
            appSpec: APP_SPEC,
        });
    }
    /** The name of the app (from the ARC-32 / ARC-56 app spec or override). */
    get appName() {
        return this.appFactory.appName;
    }
    /** The ARC-56 app spec being used */
    get appSpec() {
        return APP_SPEC;
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
        return new EscrowClient(this.appFactory.getAppClientById(params));
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
        return new EscrowClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the Escrow smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? EscrowParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
            deleteParams: params.deleteParams?.method ? EscrowParamsFactory.delete._resolveByMethod(params.deleteParams) : params.deleteParams ? params.deleteParams : undefined,
        });
        return { result: result.result, appClient: new EscrowClient(result.appClient) };
    }
}
/**
 * A client to make calls to the Escrow smart contract
 */
export class EscrowClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Gets available delete methods
             */
            delete: {
                /**
                 * Deletes an existing instance of the Escrow smart contract using the `delete()void` ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The delete params
                 */
                delete: (params = { args: [] }) => {
                    return this.appClient.params.delete(EscrowParamsFactory.delete.delete(params));
                },
            },
            /**
             * Makes a clear_state call to an existing instance of the Escrow smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the Escrow smart contract using the `rekey(address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            rekey: (params) => {
                return this.appClient.params.call(EscrowParamsFactory.rekey(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Gets available delete methods
             */
            delete: {
                /**
                 * Deletes an existing instance of the Escrow smart contract using the `delete()void` ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The delete transaction
                 */
                delete: (params = { args: [] }) => {
                    return this.appClient.createTransaction.delete(EscrowParamsFactory.delete.delete(params));
                },
            },
            /**
             * Makes a clear_state call to an existing instance of the Escrow smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the Escrow smart contract using the `rekey(address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            rekey: (params) => {
                return this.appClient.createTransaction.call(EscrowParamsFactory.rekey(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Gets available delete methods
             */
            delete: {
                /**
                 * Deletes an existing instance of the Escrow smart contract using the `delete()void` ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The delete result
                 */
                delete: async (params = { args: [] }) => {
                    const result = await this.appClient.send.delete(EscrowParamsFactory.delete.delete(params));
                    return { ...result, return: result.return };
                },
            },
            /**
             * Makes a clear_state call to an existing instance of the Escrow smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the Escrow smart contract using the `rekey(address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            rekey: async (params) => {
                const result = await this.appClient.send.call(EscrowParamsFactory.rekey(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current Escrow app
         */
        this.state = {
            /**
             * Methods to access global state for the current Escrow app
             */
            global: {
                /**
                 * Get all current keyed values from global state
                 */
                getAll: async () => {
                    const result = await this.appClient.state.global.getAll();
                    return {
                        creator: new BinaryStateValue(result.creator),
                    };
                },
                /**
                 * Get the current value of the creator key in global state
                 */
                creator: async () => { return new BinaryStateValue((await this.appClient.state.global.getValue("creator"))); },
            },
        };
        this.appClient = appClientOrParams instanceof _AppClient ? appClientOrParams : new _AppClient({
            ...appClientOrParams,
            appSpec: APP_SPEC,
        });
    }
    /**
     * Returns a new `EscrowClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new EscrowClient(await _AppClient.fromCreatorAndName({ ...params, appSpec: APP_SPEC }));
    }
    /**
     * Returns an `EscrowClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new EscrowClient(await _AppClient.fromNetwork({ ...params, appSpec: APP_SPEC }));
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
        return new EscrowClient(this.appClient.clone(params));
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a rekey(address)void method call against the Escrow contract
             */
            rekey(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.rekey(params)));
                resultMappers.push(undefined);
                return this;
            },
            get delete() {
                return {
                    delete: (params) => {
                        promiseChain = promiseChain.then(async () => composer.addAppDeleteMethodCall(await client.params.delete.delete(params)));
                        resultMappers.push(undefined);
                        return this;
                    },
                };
            },
            /**
             * Add a clear state call to the Escrow contract
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
//# sourceMappingURL=EscrowClient.js.map