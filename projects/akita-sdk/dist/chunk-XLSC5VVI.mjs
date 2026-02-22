import {
  BaseSDK
} from "./chunk-JXQTRU3Z.mjs";
import {
  ENV_VAR_NAMES
} from "./chunk-WBPQYKCD.mjs";

// src/escrow/index.ts
import { microAlgo } from "@algorandfoundation/algokit-utils";

// src/generated/EscrowClient.ts
import {
  AppClient as _AppClient
} from "@algorandfoundation/algokit-utils/types/app-client";
import { AppFactory as _AppFactory } from "@algorandfoundation/algokit-utils/types/app-factory";
var APP_SPEC = { "name": "Escrow", "structs": {}, "methods": [{ "name": "create", "args": [{ "type": "byte[]", "name": "creator" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "rekey", "args": [{ "type": "address", "name": "rekeyTo" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "delete", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["DeleteApplication"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 0, "bytes": 1 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "creator": { "keyType": "AVMString", "valueType": "AVMBytes", "key": "Y3JlYXRvcg==" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [63], "errorMessage": "OnCompletion must be DeleteApplication && can only call when not creating" }, { "pc": [21], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [136], "errorMessage": "Only the factory can delete the application" }, { "pc": [80], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [105], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [111], "errorMessage": "only the creator can rekey a spend contract" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMSAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6NgogICAgLy8gZXhwb3J0IGNsYXNzIEVzY3JvdyBleHRlbmRzIENvbnRyYWN0IHsKICAgIHB1c2hieXRlcyAweDI0Mzc4ZDNjIC8vIG1ldGhvZCAiZGVsZXRlKCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggbWFpbl9kZWxldGVfcm91dGVAMgoKbWFpbl9zd2l0Y2hfY2FzZV9uZXh0QDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6NgogICAgLy8gZXhwb3J0IGNsYXNzIEVzY3JvdyBleHRlbmRzIENvbnRyYWN0IHsKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gbXVzdCBiZSBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYnogbWFpbl9jcmVhdGVfTm9PcEA3CiAgICBwdXNoYnl0ZXMgMHg2NWE5N2JjYyAvLyBtZXRob2QgInJla2V5KGFkZHJlc3Mpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIHJla2V5CiAgICBlcnIKCm1haW5fY3JlYXRlX05vT3BANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvY29udHJhY3QuYWxnby50czo2CiAgICAvLyBleHBvcnQgY2xhc3MgRXNjcm93IGV4dGVuZHMgQ29udHJhY3QgewogICAgcHVzaGJ5dGVzIDB4OGU3OTM1OGQgLy8gbWV0aG9kICJjcmVhdGUoYnl0ZVtdKXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBjcmVhdGUKICAgIGVycgoKbWFpbl9kZWxldGVfcm91dGVAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvY29udHJhY3QuYWxnby50czoyNwogICAgLy8gQGFiaW1ldGhvZCh7IGFsbG93QWN0aW9uczogJ0RlbGV0ZUFwcGxpY2F0aW9uJyB9KQogICAgdHhuIE9uQ29tcGxldGlvbgogICAgcHVzaGludCA1IC8vIERlbGV0ZUFwcGxpY2F0aW9uCiAgICA9PQogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgICYmCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgRGVsZXRlQXBwbGljYXRpb24gJiYgY2FuIG9ubHkgY2FsbCB3aGVuIG5vdCBjcmVhdGluZwogICAgYiBkZWxldGUKCgovLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6OkVzY3Jvdy5jcmVhdGVbcm91dGluZ10oKSAtPiB2b2lkOgpjcmVhdGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6MTAKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMSAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgcHVzaGludCAyIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6OAogICAgLy8gY3JlYXRvciA9IEdsb2JhbFN0YXRlPGJ5dGVzPih7IGtleTogRXNjcm93R2xvYmFsU3RhdGVLZXlzQ3JlYXRvciB9KQogICAgcHVzaGJ5dGVzICJjcmVhdG9yIgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjEyCiAgICAvLyB0aGlzLmNyZWF0b3IudmFsdWUgPSBjcmVhdG9yCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjEwCiAgICAvLyBAYWJpbWV0aG9kKHsgb25DcmVhdGU6ICdyZXF1aXJlJyB9KQogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvY29udHJhY3QuYWxnby50czo6RXNjcm93LnJla2V5W3JvdXRpbmddKCkgLT4gdm9pZDoKcmVrZXk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6MTUKICAgIC8vIHJla2V5KHJla2V5VG86IEFjY291bnQpOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvY29udHJhY3QuYWxnby50czoxNgogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IEdsb2JhbC5jcmVhdG9yQWRkcmVzcywgRVJSX09OTFlfQ1JFQVRPUl9DQU5fUkVLRVkpCiAgICB0eG4gU2VuZGVyCiAgICBnbG9iYWwgQ3JlYXRvckFkZHJlc3MKICAgID09CiAgICBhc3NlcnQgLy8gb25seSB0aGUgY3JlYXRvciBjYW4gcmVrZXkgYSBzcGVuZCBjb250cmFjdAogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjE4LTI0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBhbW91bnQ6IDAsCiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIHJla2V5VG8KICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6MjEKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBpdHhuX2ZpZWxkIFJla2V5VG8KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvY29udHJhY3QuYWxnby50czoyMAogICAgLy8gYW1vdW50OiAwLAogICAgaW50Y18xIC8vIDAKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2NvbnRyYWN0LmFsZ28udHM6MTgtMjMKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIGFtb3VudDogMCwKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgcmVrZXlUbwogICAgLy8gICB9KQogICAgaW50Y18wIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMSAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjE4LTI0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBhbW91bnQ6IDAsCiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIHJla2V5VG8KICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjE1CiAgICAvLyByZWtleShyZWtleVRvOiBBY2NvdW50KTogdm9pZCB7CiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjpFc2Nyb3cuZGVsZXRlW3JvdXRpbmddKCkgLT4gdm9pZDoKZGVsZXRlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjI5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gR2xvYmFsLmNyZWF0b3JBZGRyZXNzLCBFUlJfT05MWV9GQUNUT1JZX0NBTl9ERUxFVEUpCiAgICB0eG4gU2VuZGVyCiAgICBnbG9iYWwgQ3JlYXRvckFkZHJlc3MKICAgID09CiAgICBhc3NlcnQgLy8gT25seSB0aGUgZmFjdG9yeSBjYW4gZGVsZXRlIHRoZSBhcHBsaWNhdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjMxLTMzCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsgY2xvc2VSZW1haW5kZXJUbzogR2xvYmFsLmNyZWF0b3JBZGRyZXNzIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjMyCiAgICAvLyAucGF5bWVudCh7IGNsb3NlUmVtYWluZGVyVG86IEdsb2JhbC5jcmVhdG9yQWRkcmVzcyB9KQogICAgZ2xvYmFsIENyZWF0b3JBZGRyZXNzCiAgICBpdHhuX2ZpZWxkIENsb3NlUmVtYWluZGVyVG8KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvY29udHJhY3QuYWxnby50czozMS0zMgogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7IGNsb3NlUmVtYWluZGVyVG86IEdsb2JhbC5jcmVhdG9yQWRkcmVzcyB9KQogICAgaW50Y18wIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMSAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9jb250cmFjdC5hbGdvLnRzOjMxLTMzCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsgY2xvc2VSZW1haW5kZXJUbzogR2xvYmFsLmNyZWF0b3JBZGRyZXNzIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvY29udHJhY3QuYWxnby50czoyNwogICAgLy8gQGFiaW1ldGhvZCh7IGFsbG93QWN0aW9uczogJ0RlbGV0ZUFwcGxpY2F0aW9uJyB9KQogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyACAQCABCQ3jTw2GgCOAQAlMRkURDEYQQAOgARlqXvMNhoAjgEAOQCABI55NY02GgCOAQANADEZgQUSMRgQREIAQDYaAUkjWYECCEsBFRJEVwIAgAdjcmVhdG9yTGciQzYaAUkVgSASRDEAMgkSRLEyCrIHsiAjsggishAjsgGzIkMxADIJEkSxMgmyCSKyECOyAbMiQw==", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
var BinaryStateValue = class {
  constructor(value) {
    this.value = value;
  }
  asByteArray() {
    return this.value;
  }
  asString() {
    return this.value !== void 0 ? Buffer.from(this.value).toString("utf-8") : void 0;
  }
};
var EscrowParamsFactory = class _EscrowParamsFactory {
  /**
   * Gets available create ABI call param factories
   */
  static get create() {
    return {
      _resolveByMethod(params) {
        switch (params.method) {
          case "create":
          case "create(byte[])void":
            return _EscrowParamsFactory.create.create(params);
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
          method: "create(byte[])void",
          args: Array.isArray(params.args) ? params.args : [params.args.creator]
        };
      }
    };
  }
  /**
   * Gets available delete ABI call param factories
   */
  static get delete() {
    return {
      _resolveByMethod(params) {
        switch (params.method) {
          case "delete":
          case "delete()void":
            return _EscrowParamsFactory.delete.delete(params);
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
          method: "delete()void",
          args: Array.isArray(params.args) ? params.args : []
        };
      }
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
      method: "rekey(address)void",
      args: Array.isArray(params.args) ? params.args : [params.args.rekeyTo]
    };
  }
};
var EscrowFactory = class {
  /**
   * The underlying `AppFactory` for when you want to have more flexibility
   */
  appFactory;
  /**
   * Creates a new instance of `EscrowFactory`
   *
   * @param params The parameters to initialise the app factory with
   */
  constructor(params) {
    this.appFactory = new _AppFactory({
      ...params,
      appSpec: APP_SPEC
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
    var _a, _b;
    const result = await this.appFactory.deploy({
      ...params,
      createParams: ((_a = params.createParams) == null ? void 0 : _a.method) ? EscrowParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : void 0,
      deleteParams: ((_b = params.deleteParams) == null ? void 0 : _b.method) ? EscrowParamsFactory.delete._resolveByMethod(params.deleteParams) : params.deleteParams ? params.deleteParams : void 0
    });
    return { result: result.result, appClient: new EscrowClient(result.appClient) };
  }
  /**
   * Get parameters to create transactions (create and deploy related calls) for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
   */
  params = {
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
      }
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
      }
    }
  };
  /**
   * Create transactions for the current app
   */
  createTransaction = {
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
      }
    }
  };
  /**
   * Send calls to the current app
   */
  send = {
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
      }
    }
  };
};
var EscrowClient = class _EscrowClient {
  /**
   * The underlying `AppClient` for when you want to have more flexibility
   */
  appClient;
  constructor(appClientOrParams) {
    this.appClient = appClientOrParams instanceof _AppClient ? appClientOrParams : new _AppClient({
      ...appClientOrParams,
      appSpec: APP_SPEC
    });
  }
  /**
   * Returns a new `EscrowClient` client, resolving the app by creator address and name
   * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
   * @param params The parameters to create the app client
   */
  static async fromCreatorAndName(params) {
    return new _EscrowClient(await _AppClient.fromCreatorAndName({ ...params, appSpec: APP_SPEC }));
  }
  /**
   * Returns an `EscrowClient` instance for the current network based on
   * pre-determined network-specific app IDs specified in the ARC-56 app spec.
   *
   * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
   * @param params The parameters to create the app client
   */
  static async fromNetwork(params) {
    return new _EscrowClient(await _AppClient.fromNetwork({ ...params, appSpec: APP_SPEC }));
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
   * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
   */
  params = {
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
      }
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
    }
  };
  /**
   * Create transactions for the current app
   */
  createTransaction = {
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
      }
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
    }
  };
  /**
   * Send calls to the current app
   */
  send = {
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
      }
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
    }
  };
  /**
   * Clone this app client with different params
   *
   * @param params The params to use for the the cloned app client. Omit a param to keep the original value. Set a param to override the original value. Setting to undefined will clear the original value.
   * @returns A new app client with the altered params
   */
  clone(params) {
    return new _EscrowClient(this.appClient.clone(params));
  }
  /**
   * Methods to access state for the current Escrow app
   */
  state = {
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
          creator: new BinaryStateValue(result.creator)
        };
      },
      /**
       * Get the current value of the creator key in global state
       */
      creator: async () => {
        return new BinaryStateValue(await this.appClient.state.global.getValue("creator"));
      }
    }
  };
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
        resultMappers.push(void 0);
        return this;
      },
      get delete() {
        return {
          delete: (params) => {
            promiseChain = promiseChain.then(async () => composer.addAppDeleteMethodCall(await client.params.delete.delete(params)));
            resultMappers.push(void 0);
            return this;
          }
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
        var _a;
        await promiseChain;
        const result = await (!options ? composer.simulate() : composer.simulate(options));
        return {
          ...result,
          returns: (_a = result.returns) == null ? void 0 : _a.map((val, i) => resultMappers[i] !== void 0 ? resultMappers[i](val) : val.returnValue)
        };
      },
      async send(params) {
        var _a;
        await promiseChain;
        const result = await composer.send(params);
        return {
          ...result,
          returns: (_a = result.returns) == null ? void 0 : _a.map((val, i) => resultMappers[i] !== void 0 ? resultMappers[i](val) : val.returnValue)
        };
      }
    };
  }
};

// src/generated/EscrowFactoryClient.ts
import { getArc56ReturnValue } from "@algorandfoundation/algokit-utils/types/app-arc56";
import {
  AppClient as _AppClient2
} from "@algorandfoundation/algokit-utils/types/app-client";
import { AppFactory as _AppFactory2 } from "@algorandfoundation/algokit-utils/types/app-factory";
var APP_SPEC2 = { "name": "EscrowFactory", "structs": {}, "methods": [{ "name": "new", "args": [{ "type": "pay", "name": "payment" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "register", "args": [{ "type": "pay", "name": "payment" }, { "type": "uint64", "name": "app" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "delete", "args": [{ "type": "uint64", "name": "id" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "cost", "args": [], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "registerCost", "args": [], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "exists", "args": [{ "type": "address", "name": "address" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "get", "args": [{ "type": "address", "name": "address" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "mustGet", "args": [{ "type": "address", "name": "address" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getList", "args": [{ "type": "address[]", "name": "addresses" }], "returns": { "type": "byte[][]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "mustGetList", "args": [{ "type": "address[]", "name": "addresses" }], "returns": { "type": "byte[][]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 0, "bytes": 0 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": {}, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "walletIDsByAccounts": { "keyType": "AVMBytes", "valueType": "AVMBytes", "prefix": "" } } } }, "bareActions": { "create": ["NoOp"], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [947, 1117], "errorMessage": "Account not found" }, { "pc": [928, 952, 1024, 1122], "errorMessage": "Box must have value" }, { "pc": [322, 702], "errorMessage": "Invalid payment" }, { "pc": [280], "errorMessage": "Length must be 16" }, { "pc": [29], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [135], "errorMessage": "OnCompletion must be NoOp && can only call when creating" }, { "pc": [674], "errorMessage": "already registered" }, { "pc": [529, 624, 636, 665, 741], "errorMessage": "application exists" }, { "pc": [750], "errorMessage": "does not exist" }, { "pc": [1005, 1109], "errorMessage": "index access is out of bounds" }, { "pc": [632], "errorMessage": "invalid app to register" }, { "pc": [660], "errorMessage": "invalid creator" }, { "pc": [985, 1086], "errorMessage": "invalid number of bytes for (len+uint8[32][])" }, { "pc": [612, 733], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [870, 898, 939], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [771, 847], "errorMessage": "only the creator wallet can delete a spending account" }, { "pc": [292, 603], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMSAwIDIgMzIgMTUwMDAwCiAgICBieXRlY2Jsb2NrIDB4MTUxZjdjNzUgIiIgMHgwMDAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxNwogICAgLy8gZXhwb3J0IGNsYXNzIEVzY3Jvd0ZhY3RvcnkgZXh0ZW5kcyBDb250cmFjdCB7CiAgICB0eG4gTnVtQXBwQXJncwogICAgYnogbWFpbl9fX2FsZ290c19fLmRlZmF1bHRDcmVhdGVAMTcKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gbXVzdCBiZSBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYXNzZXJ0CiAgICBwdXNoYnl0ZXNzIDB4ZDg1Y2YxODQgMHg2MDdlNzA0NiAweDhhMzllNzlmIDB4OWI2N2ZhNmQgMHgzYzc1NDEyMCAweDRjOWZiNjU2IDB4M2MxYTZmMzMgMHgyYjU2MDJhMyAweDEzZGM1MDhhIDB4NDc1ZDM3NzMgLy8gbWV0aG9kICJuZXcocGF5KXVpbnQ2NCIsIG1ldGhvZCAicmVnaXN0ZXIocGF5LHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJkZWxldGUodWludDY0KXZvaWQiLCBtZXRob2QgImNvc3QoKXVpbnQ2NCIsIG1ldGhvZCAicmVnaXN0ZXJDb3N0KCl1aW50NjQiLCBtZXRob2QgImV4aXN0cyhhZGRyZXNzKWJvb2wiLCBtZXRob2QgImdldChhZGRyZXNzKWJ5dGVbXSIsIG1ldGhvZCAibXVzdEdldChhZGRyZXNzKWJ5dGVbXSIsIG1ldGhvZCAiZ2V0TGlzdChhZGRyZXNzW10pYnl0ZVtdW10iLCBtZXRob2QgIm11c3RHZXRMaXN0KGFkZHJlc3NbXSlieXRlW11bXSIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIG5ldyByZWdpc3RlciBkZWxldGUgY29zdCBtYWluX3JlZ2lzdGVyQ29zdF9yb3V0ZUA4IGV4aXN0cyBnZXQgbXVzdEdldCBnZXRMaXN0IG11c3RHZXRMaXN0CiAgICBlcnIKCm1haW5fcmVnaXN0ZXJDb3N0X3JvdXRlQDg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxNDgKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgcHVzaGJ5dGVzIDB4MTUxZjdjNzUwMDAwMDAwMDAwMDAyZjQ0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCm1haW5fX19hbGdvdHNfXy5kZWZhdWx0Q3JlYXRlQDE3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTcKICAgIC8vIGV4cG9ydCBjbGFzcyBFc2Nyb3dGYWN0b3J5IGV4dGVuZHMgQ29udHJhY3QgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgICEKICAgICYmCiAgICByZXR1cm4gLy8gb24gZXJyb3I6IE9uQ29tcGxldGlvbiBtdXN0IGJlIE5vT3AgJiYgY2FuIG9ubHkgY2FsbCB3aGVuIGNyZWF0aW5nCgoKLy8gX3B1eWFfbGliLmFyYzQuZHluYW1pY19hcnJheV9jb25jYXRfYnl0ZV9sZW5ndGhfaGVhZChhcnJheTogYnl0ZXMsIG5ld19pdGVtc19ieXRlczogYnl0ZXMsIG5ld19pdGVtc19jb3VudDogdWludDY0KSAtPiBieXRlczoKZHluYW1pY19hcnJheV9jb25jYXRfYnl0ZV9sZW5ndGhfaGVhZDoKICAgIHByb3RvIDMgMQogICAgZnJhbWVfZGlnIC0zCiAgICBpbnRjXzEgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGR1cAogICAgZnJhbWVfZGlnIC0xCiAgICArCiAgICBzd2FwCiAgICBpbnRjXzIgLy8gMgogICAgKgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgY292ZXIgMgogICAgZnJhbWVfZGlnIC0zCiAgICBpbnRjXzIgLy8gMgogICAgZGlnIDIKICAgIHN1YnN0cmluZzMKICAgIGZyYW1lX2RpZyAtMQogICAgaW50Y18yIC8vIDIKICAgICoKICAgIGJ6ZXJvCiAgICBjb25jYXQKICAgIGZyYW1lX2RpZyAtMwogICAgbGVuCiAgICBmcmFtZV9kaWcgLTMKICAgIHVuY292ZXIgMwogICAgdW5jb3ZlciAyCiAgICBzdWJzdHJpbmczCiAgICBjb25jYXQKICAgIGZyYW1lX2RpZyAtMgogICAgY29uY2F0CiAgICBzd2FwCiAgICBpbnRjXzIgLy8gMgogICAgKgogICAgZHVwCiAgICBpbnRjXzEgLy8gMAoKZHluYW1pY19hcnJheV9jb25jYXRfYnl0ZV9sZW5ndGhfaGVhZF9mb3JfaGVhZGVyQDI6CiAgICBmcmFtZV9kaWcgNAogICAgZnJhbWVfZGlnIDIKICAgIDwKICAgIGJ6IGR5bmFtaWNfYXJyYXlfY29uY2F0X2J5dGVfbGVuZ3RoX2hlYWRfYWZ0ZXJfZm9yQDUKICAgIGZyYW1lX2RpZyAzCiAgICBkdXAKICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBmcmFtZV9kaWcgMQogICAgZnJhbWVfZGlnIDQKICAgIGR1cAogICAgY292ZXIgNAogICAgdW5jb3ZlciAyCiAgICByZXBsYWNlMwogICAgZHVwCiAgICBmcmFtZV9idXJ5IDEKICAgIGRpZyAxCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgICsKICAgIGZyYW1lX2J1cnkgMwogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGZyYW1lX2J1cnkgNAogICAgYiBkeW5hbWljX2FycmF5X2NvbmNhdF9ieXRlX2xlbmd0aF9oZWFkX2Zvcl9oZWFkZXJAMgoKZHluYW1pY19hcnJheV9jb25jYXRfYnl0ZV9sZW5ndGhfaGVhZF9hZnRlcl9mb3JANToKICAgIGZyYW1lX2RpZyAwCiAgICBmcmFtZV9kaWcgMQogICAgY29uY2F0CiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjpieXRlczE2KGFjYzogYnl0ZXMpIC0+IGJ5dGVzOgpieXRlczE2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTMKICAgIC8vIGZ1bmN0aW9uIGJ5dGVzMTYoYWNjOiBBY2NvdW50KTogYnl0ZXM8MTY+IHsKICAgIHByb3RvIDEgMQogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTQKICAgIC8vIHJldHVybiBhY2MuYnl0ZXMuc2xpY2UoMCwgMTYpLnRvRml4ZWQoeyBsZW5ndGg6IDE2IH0pCiAgICBmcmFtZV9kaWcgLTEKICAgIGxlbgogICAgaW50Y18xIC8vIDAKICAgIGRpZyAxCiAgICA+PQogICAgaW50Y18xIC8vIDAKICAgIGRpZyAyCiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgcHVzaGludCAxNiAvLyAxNgogICAgZGlnIDIKICAgID49CiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICB1bmNvdmVyIDMKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBmcmFtZV9kaWcgLTEKICAgIGNvdmVyIDIKICAgIHN1YnN0cmluZzMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICA9PQogICAgYXNzZXJ0IC8vIExlbmd0aCBtdXN0IGJlIDE2CiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo6RXNjcm93RmFjdG9yeS5uZXdbcm91dGluZ10oKSAtPiB2b2lkOgpuZXc6CiAgICBieXRlY18xIC8vICIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czozMwogICAgLy8gbmV3KHBheW1lbnQ6IGd0eG4uUGF5bWVudFR4bik6IHVpbnQ2NCB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18wIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMCAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjM0CiAgICAvLyBjb25zdCBub25BcHBDYWxsZXIgPSBHbG9iYWwuY2FsbGVyQXBwbGljYXRpb25JZCA9PT0gMAogICAgZ2xvYmFsIENhbGxlckFwcGxpY2F0aW9uSUQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjI3CiAgICAvLyBjb25zdCBub25BcHBDYWxsZXIgPSBHbG9iYWwuY2FsbGVyQXBwbGljYXRpb25JZCA9PT0gMAogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoyOC0zMAogICAgLy8gcmV0dXJuIG5vbkFwcENhbGxlcgogICAgLy8gICA/IEJ5dGVzKGJ5dGVzMTYoVHhuLnNlbmRlcikpCiAgICAvLyAgIDogQnl0ZXMoaXRvYihHbG9iYWwuY2FsbGVyQXBwbGljYXRpb25JZCkpCiAgICBibnogbmV3X3Rlcm5hcnlfZmFsc2VAOQogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MjkKICAgIC8vID8gQnl0ZXMoYnl0ZXMxNihUeG4uc2VuZGVyKSkKICAgIHR4biBTZW5kZXIKICAgIGNhbGxzdWIgYnl0ZXMxNgoKbmV3X3Rlcm5hcnlfbWVyZ2VAMTA6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo0NC01MQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBjaGlsZEFwcE1CUiArIEdsb2JhbC5taW5CYWxhbmNlLAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBkaWcgMgogICAgZHVwCiAgICBndHhucyBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6NDcKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo0NC01MQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBjaGlsZEFwcE1CUiArIEdsb2JhbC5taW5CYWxhbmNlLAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgc3dhcAogICAgZ3R4bnMgQW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo0OAogICAgLy8gYW1vdW50OiBjaGlsZEFwcE1CUiArIEdsb2JhbC5taW5CYWxhbmNlLAogICAgaW50YyA0IC8vIDE1MDAwMAogICAgZ2xvYmFsIE1pbkJhbGFuY2UKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjQ0LTUxCiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgcGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IGNoaWxkQXBwTUJSICsgR2xvYmFsLm1pbkJhbGFuY2UsCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICAmJgogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6NTMtNTcKICAgIC8vIGNvbnN0IG5ld0VzY3JvdyA9IGVzY3Jvdy5jYWxsLmNyZWF0ZSgKICAgIC8vICAgewogICAgLy8gICAgIGFyZ3M6IFtjcmVhdG9yXSwKICAgIC8vICAgfQogICAgLy8gKS5pdHhuLmNyZWF0ZWRBcHAKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjU1CiAgICAvLyBhcmdzOiBbY3JlYXRvcl0sCiAgICBkdXAKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6NTMtNTcKICAgIC8vIGNvbnN0IG5ld0VzY3JvdyA9IGVzY3Jvdy5jYWxsLmNyZWF0ZSgKICAgIC8vICAgewogICAgLy8gICAgIGFyZ3M6IFtjcmVhdG9yXSwKICAgIC8vICAgfQogICAgLy8gKS5pdHhuLmNyZWF0ZWRBcHAKICAgIHB1c2hieXRlcyAweDhlNzkzNThkIC8vIG1ldGhvZCAiY3JlYXRlKGJ5dGVbXSl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czozNwogICAgLy8gY29uc3QgZXNjcm93ID0gY29tcGlsZUFyYzQoRXNjcm93KTsKICAgIGludGNfMCAvLyAxCiAgICBpdHhuX2ZpZWxkIEdsb2JhbE51bUJ5dGVTbGljZQogICAgcHVzaGJ5dGVzIGJhc2U2NChDNEVCUXc9PSkKICAgIGl0eG5fZmllbGQgQ2xlYXJTdGF0ZVByb2dyYW1QYWdlcwogICAgcHVzaGJ5dGVzIGJhc2U2NChDeUFDQVFDQUJDUTNqVHcyR2dDT0FRQWxNUmtVUkRFWVFRQU9nQVJscVh2TU5ob0FqZ0VBT1FDQUJJNTVOWTAyR2dDT0FRQU5BREVaZ1FVU01SZ1FSRUlBUURZYUFVa2pXWUVDQ0VzQkZSSkVWd0lBZ0FkamNtVmhkRzl5VEdjaVF6WWFBVWtWZ1NBU1JERUFNZ2tTUkxFeUNySUhzaUFqc2dnaXNoQWpzZ0d6SWtNeEFESUpFa1N4TWdteUNTS3lFQ095QWJNaVF3PT0pCiAgICBpdHhuX2ZpZWxkIEFwcHJvdmFsUHJvZ3JhbVBhZ2VzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo1My01NwogICAgLy8gY29uc3QgbmV3RXNjcm93ID0gZXNjcm93LmNhbGwuY3JlYXRlKAogICAgLy8gICB7CiAgICAvLyAgICAgYXJnczogW2NyZWF0b3JdLAogICAgLy8gICB9CiAgICAvLyApLml0eG4uY3JlYXRlZEFwcAogICAgaW50Y18xIC8vIDAKICAgIGl0eG5fZmllbGQgT25Db21wbGV0aW9uCiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18xIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgZ2l0eG4gMCBDcmVhdGVkQXBwbGljYXRpb25JRAogICAgZHVwCiAgICBidXJ5IDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjU5LTY0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogbmV3RXNjcm93LmFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBHbG9iYWwubWluQmFsYW5jZQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjYxCiAgICAvLyByZWNlaXZlcjogbmV3RXNjcm93LmFkZHJlc3MsCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo2MgogICAgLy8gYW1vdW50OiBHbG9iYWwubWluQmFsYW5jZQogICAgZ2xvYmFsIE1pbkJhbGFuY2UKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo1OS02MwogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IG5ld0VzY3Jvdy5hZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogR2xvYmFsLm1pbkJhbGFuY2UKICAgIC8vICAgfSkKICAgIGludGNfMCAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjU5LTY0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogbmV3RXNjcm93LmFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBHbG9iYWwubWluQmFsYW5jZQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo2Ni03MQogICAgLy8gZXNjcm93LmNhbGwucmVrZXkoewogICAgLy8gICBhcHBJZDogbmV3RXNjcm93LmlkLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgbm9uQXBwQ2FsbGVyID8gVHhuLnNlbmRlciA6IEdsb2JhbC5jYWxsZXJBcHBsaWNhdGlvbkFkZHJlc3MKICAgIC8vICAgXQogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjY5CiAgICAvLyBub25BcHBDYWxsZXIgPyBUeG4uc2VuZGVyIDogR2xvYmFsLmNhbGxlckFwcGxpY2F0aW9uQWRkcmVzcwogICAgZHVwCiAgICBibnogbmV3X3Rlcm5hcnlfZmFsc2VANQogICAgdHhuIFNlbmRlcgoKbmV3X3Rlcm5hcnlfbWVyZ2VANjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjY2LTcxCiAgICAvLyBlc2Nyb3cuY2FsbC5yZWtleSh7CiAgICAvLyAgIGFwcElkOiBuZXdFc2Nyb3cuaWQsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBub25BcHBDYWxsZXIgPyBUeG4uc2VuZGVyIDogR2xvYmFsLmNhbGxlckFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gICBdCiAgICAvLyB9KQogICAgcHVzaGJ5dGVzIDB4NjVhOTdiY2MgLy8gbWV0aG9kICJyZWtleShhZGRyZXNzKXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGludGNfMSAvLyAwCiAgICBpdHhuX2ZpZWxkIE9uQ29tcGxldGlvbgogICAgZGlnIDIKICAgIGR1cAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18xIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MzMKICAgIC8vIG5ldyhwYXltZW50OiBndHhuLlBheW1lbnRUeG4pOiB1aW50NjQgewogICAgaXRvYgogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKbmV3X3Rlcm5hcnlfZmFsc2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjY5CiAgICAvLyBub25BcHBDYWxsZXIgPyBUeG4uc2VuZGVyIDogR2xvYmFsLmNhbGxlckFwcGxpY2F0aW9uQWRkcmVzcwogICAgZ2xvYmFsIENhbGxlckFwcGxpY2F0aW9uQWRkcmVzcwogICAgYiBuZXdfdGVybmFyeV9tZXJnZUA2CgpuZXdfdGVybmFyeV9mYWxzZUA5OgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MzAKICAgIC8vIDogQnl0ZXMoaXRvYihHbG9iYWwuY2FsbGVyQXBwbGljYXRpb25JZCkpCiAgICBnbG9iYWwgQ2FsbGVyQXBwbGljYXRpb25JRAogICAgaXRvYgogICAgYiBuZXdfdGVybmFyeV9tZXJnZUAxMAoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjpFc2Nyb3dGYWN0b3J5LnJlZ2lzdGVyW3JvdXRpbmddKCkgLT4gdm9pZDoKcmVnaXN0ZXI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo3NgogICAgLy8gcmVnaXN0ZXIocGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhcHA6IHVpbnQ2NCk6IHZvaWQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMCAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCA4IC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo3OAogICAgLy8gYXNzZXJ0KEdsb2JhbC5jYWxsZXJBcHBsaWNhdGlvbklkICE9PSAwKQogICAgZ2xvYmFsIENhbGxlckFwcGxpY2F0aW9uSUQKICAgIGFzc2VydAogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6ODEKICAgIC8vIGFzc2VydChhcHAgPT09IDAgfHwgQXBwbGljYXRpb24oYXBwKS5jcmVhdG9yID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywgRVJSX0lOVkFMSURfQVBQKQogICAgYnogcmVnaXN0ZXJfYm9vbF90cnVlQDMKICAgIGR1cAogICAgYXBwX3BhcmFtc19nZXQgQXBwQ3JlYXRvcgogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgID09CiAgICBieiByZWdpc3Rlcl9ib29sX2ZhbHNlQDQKCnJlZ2lzdGVyX2Jvb2xfdHJ1ZUAzOgogICAgaW50Y18wIC8vIDEKCnJlZ2lzdGVyX2Jvb2xfbWVyZ2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjgxCiAgICAvLyBhc3NlcnQoYXBwID09PSAwIHx8IEFwcGxpY2F0aW9uKGFwcCkuY3JlYXRvciA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsIEVSUl9JTlZBTElEX0FQUCkKICAgIGFzc2VydCAvLyBpbnZhbGlkIGFwcCB0byByZWdpc3RlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6ODQKICAgIC8vIGlmIChBcHBsaWNhdGlvbihhcHApLmNyZWF0b3IgPT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzKSB7CiAgICBkdXAKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcENyZWF0b3IKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICA9PQogICAgYnogcmVnaXN0ZXJfZWxzZV9ib2R5QDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjg1CiAgICAvLyBjcmVhdG9yID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYXBwLCBCeXRlcyhFc2Nyb3dHbG9iYWxTdGF0ZUtleXNDcmVhdG9yKSlbMF0KICAgIGR1cAogICAgcHVzaGJ5dGVzICJjcmVhdG9yIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo4NgogICAgLy8gYXNzZXJ0KGJ0b2koY3JlYXRvcikgPT09IEdsb2JhbC5jYWxsZXJBcHBsaWNhdGlvbklkLCBFUlJfSU5WQUxJRF9DUkVBVE9SKQogICAgYnRvaQogICAgZ2xvYmFsIENhbGxlckFwcGxpY2F0aW9uSUQKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBjcmVhdG9yCgpyZWdpc3Rlcl9hZnRlcl9pZl9lbHNlQDg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo5MgogICAgLy8gY29uc3QgYXBwQWRkcmVzcyA9IGJ5dGVzMTYoQXBwbGljYXRpb24oYXBwKS5hZGRyZXNzKQogICAgZGlnIDEKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIGNhbGxzdWIgYnl0ZXMxNgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6OTMKICAgIC8vIGFzc2VydCghdGhpcy53YWxsZXRJRHNCeUFjY291bnRzKGFwcEFkZHJlc3MpLmV4aXN0cywgRVJSX0FMUkVBRFlfUkVHSVNURVJFRCkKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICAhCiAgICBhc3NlcnQgLy8gYWxyZWFkeSByZWdpc3RlcmVkCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo5NS0xMDIKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBwYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5tYnIoY3JlYXRvci5sZW5ndGgpLAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBkaWcgMwogICAgZHVwCiAgICBndHhucyBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6OTgKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo5NS0xMDIKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBwYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5tYnIoY3JlYXRvci5sZW5ndGgpLAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgc3dhcAogICAgZ3R4bnMgQW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo5OQogICAgLy8gYW1vdW50OiB0aGlzLm1icihjcmVhdG9yLmxlbmd0aCksCiAgICB1bmNvdmVyIDMKICAgIGR1cAogICAgY292ZXIgMwogICAgbGVuCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoyMwogICAgLy8gcmV0dXJuIE1pbldhbGxldElEc0J5QWNjb3VudHNNYnIgKyAobGVuZ3RoICogQm94Q29zdFBlckJ5dGUpCiAgICBwdXNoaW50IDQwMCAvLyA0MDAKICAgICoKICAgIHB1c2hpbnQgODkwMCAvLyA4OTAwCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo5NS0xMDIKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBwYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5tYnIoY3JlYXRvci5sZW5ndGgpLAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgJiYKICAgIGFzc2VydCAvLyBJbnZhbGlkIHBheW1lbnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjEwNAogICAgLy8gdGhpcy53YWxsZXRJRHNCeUFjY291bnRzKGFwcEFkZHJlc3MpLnZhbHVlID0gY3JlYXRvcgogICAgZGlnIDEKICAgIGJveF9kZWwKICAgIHBvcAogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6NzYKICAgIC8vIHJlZ2lzdGVyKHBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgYXBwOiB1aW50NjQpOiB2b2lkIHsKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCnJlZ2lzdGVyX2Vsc2VfYm9keUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6ODgKICAgIC8vIGNyZWF0b3IgPSBCeXRlcyhpdG9iKEdsb2JhbC5jYWxsZXJBcHBsaWNhdGlvbklkKSkKICAgIGdsb2JhbCBDYWxsZXJBcHBsaWNhdGlvbklECiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo4OQogICAgLy8gYXBwID0gR2xvYmFsLmNhbGxlckFwcGxpY2F0aW9uSWQKICAgIGdsb2JhbCBDYWxsZXJBcHBsaWNhdGlvbklECiAgICBidXJ5IDIKICAgIGIgcmVnaXN0ZXJfYWZ0ZXJfaWZfZWxzZUA4CgpyZWdpc3Rlcl9ib29sX2ZhbHNlQDQ6CiAgICBpbnRjXzEgLy8gMAogICAgYiByZWdpc3Rlcl9ib29sX21lcmdlQDUKCgovLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo6RXNjcm93RmFjdG9yeS5kZWxldGVbcm91dGluZ10oKSAtPiB2b2lkOgpkZWxldGU6CiAgICBieXRlY18xIC8vICIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxMDcKICAgIC8vIGRlbGV0ZShpZDogdWludDY0KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCA4IC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxMDgKICAgIC8vIGNvbnN0IGNhbGxlciA9IEdsb2JhbC5jYWxsZXJBcHBsaWNhdGlvbklkCiAgICBnbG9iYWwgQ2FsbGVyQXBwbGljYXRpb25JRAogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTA5CiAgICAvLyBjb25zdCBrZXkgPSBieXRlczE2KEFwcGxpY2F0aW9uKGlkKS5hZGRyZXNzKQogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgY2FsbHN1YiBieXRlczE2CiAgICBkdXBuIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjExMAogICAgLy8gYXNzZXJ0KHRoaXMud2FsbGV0SURzQnlBY2NvdW50cyhrZXkpLmV4aXN0cywgRVJSX0RPRVNOVF9FWElTVCkKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIGRvZXMgbm90IGV4aXN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxMTIKICAgIC8vIGNvbnN0IGNyZWF0b3IgPSB0aGlzLndhbGxldElEc0J5QWNjb3VudHMoa2V5KS52YWx1ZQogICAgYm94X2dldAogICAgcG9wCiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjExMwogICAgLy8gaWYgKGNyZWF0b3IubGVuZ3RoID09PSA4KSB7CiAgICBsZW4KICAgIGR1cAogICAgY292ZXIgMgogICAgcHVzaGludCA4IC8vIDgKICAgID09CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGJ6IGRlbGV0ZV9lbHNlX2JvZHlAMwogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTE0CiAgICAvLyBhc3NlcnQoY2FsbGVyID09PSBidG9pKGNyZWF0b3IpLCBFUlJfRk9SQklEREVOKTsKICAgIGJ0b2kKICAgIGRpZyA0CiAgICA9PQogICAgYXNzZXJ0IC8vIG9ubHkgdGhlIGNyZWF0b3Igd2FsbGV0IGNhbiBkZWxldGUgYSBzcGVuZGluZyBhY2NvdW50CgpkZWxldGVfYWZ0ZXJfaWZfZWxzZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MjMKICAgIC8vIHJldHVybiBNaW5XYWxsZXRJRHNCeUFjY291bnRzTWJyICsgKGxlbmd0aCAqIEJveENvc3RQZXJCeXRlKQogICAgZGlnIDEKICAgIHB1c2hpbnQgNDAwIC8vIDQwMAogICAgKgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTIyLTEyNAogICAgLy8gTWluUGFnZXMgKwogICAgLy8gR0xPQkFMX1NUQVRFX0tFWV9CWVRFU19DT1NUICsKICAgIC8vIHRoaXMubWJyKGNyZWF0b3IubGVuZ3RoKQogICAgcHVzaGludCAxNTg5MDAgLy8gMTU4OTAwCiAgICArCiAgICBidXJ5IDYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjEyNwogICAgLy8gc3BlbmRpbmdBY2NvdW50LmNhbGwuZGVsZXRlKHsgYXBwSWQ6IGlkIH0pCiAgICBpdHhuX2JlZ2luCiAgICBwdXNoYnl0ZXMgMHgyNDM3OGQzYyAvLyBtZXRob2QgImRlbGV0ZSgpdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBwdXNoaW50IDUgLy8gNQogICAgaXR4bl9maWVsZCBPbkNvbXBsZXRpb24KICAgIGRpZyA0CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxMjkKICAgIC8vIHRoaXMud2FsbGV0SURzQnlBY2NvdW50cyhrZXkpLmRlbGV0ZSgpCiAgICBkaWcgMgogICAgYm94X2RlbAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxMzEtMTM2CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogY3JlYXRvci5sZW5ndGggPT09IDggPyBHbG9iYWwuY2FsbGVyQXBwbGljYXRpb25BZGRyZXNzIDogVHhuLnNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IHJlZnVuZEFtb3VudAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjEzMwogICAgLy8gcmVjZWl2ZXI6IGNyZWF0b3IubGVuZ3RoID09PSA4ID8gR2xvYmFsLmNhbGxlckFwcGxpY2F0aW9uQWRkcmVzcyA6IFR4bi5zZW5kZXIsCiAgICBkdXAKICAgIGJ6IGRlbGV0ZV90ZXJuYXJ5X2ZhbHNlQDcKICAgIGdsb2JhbCBDYWxsZXJBcHBsaWNhdGlvbkFkZHJlc3MKCmRlbGV0ZV90ZXJuYXJ5X21lcmdlQDg6CiAgICBkaWcgNgogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjEzMS0xMzUKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBjcmVhdG9yLmxlbmd0aCA9PT0gOCA/IEdsb2JhbC5jYWxsZXJBcHBsaWNhdGlvbkFkZHJlc3MgOiBUeG4uc2VuZGVyLAogICAgLy8gICAgIGFtb3VudDogcmVmdW5kQW1vdW50CiAgICAvLyAgIH0pCiAgICBpbnRjXzAgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18xIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxMzEtMTM2CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogY3JlYXRvci5sZW5ndGggPT09IDggPyBHbG9iYWwuY2FsbGVyQXBwbGljYXRpb25BZGRyZXNzIDogVHhuLnNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IHJlZnVuZEFtb3VudAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxMDcKICAgIC8vIGRlbGV0ZShpZDogdWludDY0KTogdm9pZCB7CiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgpkZWxldGVfdGVybmFyeV9mYWxzZUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTMzCiAgICAvLyByZWNlaXZlcjogY3JlYXRvci5sZW5ndGggPT09IDggPyBHbG9iYWwuY2FsbGVyQXBwbGljYXRpb25BZGRyZXNzIDogVHhuLnNlbmRlciwKICAgIHR4biBTZW5kZXIKICAgIGIgZGVsZXRlX3Rlcm5hcnlfbWVyZ2VAOAoKZGVsZXRlX2Vsc2VfYm9keUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTE2CiAgICAvLyBhc3NlcnQoQnl0ZXMoYnl0ZXMxNihUeG4uc2VuZGVyKSkgPT09IGNyZWF0b3IsIEVSUl9GT1JCSURERU4pOwogICAgdHhuIFNlbmRlcgogICAgY2FsbHN1YiBieXRlczE2CiAgICA9PQogICAgYXNzZXJ0IC8vIG9ubHkgdGhlIGNyZWF0b3Igd2FsbGV0IGNhbiBkZWxldGUgYSBzcGVuZGluZyBhY2NvdW50CiAgICBiIGRlbGV0ZV9hZnRlcl9pZl9lbHNlQDQKCgovLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo6RXNjcm93RmFjdG9yeS5jb3N0W3JvdXRpbmddKCkgLT4gdm9pZDoKY29zdDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE0Mi0xNDMKICAgIC8vIE1pblBhZ2VzICsKICAgIC8vIEdMT0JBTF9TVEFURV9LRVlfQllURVNfQ09TVCArCiAgICBpbnRjIDQgLy8gMTUwMDAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxNDQKICAgIC8vIEdsb2JhbC5taW5CYWxhbmNlCiAgICBnbG9iYWwgTWluQmFsYW5jZQogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTQyLTE0NAogICAgLy8gTWluUGFnZXMgKwogICAgLy8gR0xPQkFMX1NUQVRFX0tFWV9CWVRFU19DT1NUICsKICAgIC8vIEdsb2JhbC5taW5CYWxhbmNlCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxMzkKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgaXRvYgogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjpFc2Nyb3dGYWN0b3J5LmV4aXN0c1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmV4aXN0czoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE1MwogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE1NQogICAgLy8gcmV0dXJuIHRoaXMud2FsbGV0SURzQnlBY2NvdW50cyhieXRlczE2KGFkZHJlc3MpKS5leGlzdHMKICAgIGNhbGxzdWIgYnl0ZXMxNgogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxNTMKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgcHVzaGJ5dGVzIDB4MDAKICAgIGludGNfMSAvLyAwCiAgICB1bmNvdmVyIDIKICAgIHNldGJpdAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjpFc2Nyb3dGYWN0b3J5LmdldFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmdldDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE1OAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXBuIDIKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE2MAogICAgLy8gaWYgKCF0aGlzLndhbGxldElEc0J5QWNjb3VudHMoYnl0ZXMxNihhZGRyZXNzKSkuZXhpc3RzKSB7CiAgICBjYWxsc3ViIGJ5dGVzMTYKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYm56IGdldF9hZnRlcl9pZl9lbHNlQDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE2MQogICAgLy8gcmV0dXJuIEJ5dGVzKCcnKQogICAgYnl0ZWNfMSAvLyAiIgoKZ2V0X2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6OkVzY3Jvd0ZhY3RvcnkuZ2V0QDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxNTgKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgZHVwCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCmdldF9hZnRlcl9pZl9lbHNlQDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxNjMKICAgIC8vIHJldHVybiB0aGlzLndhbGxldElEc0J5QWNjb3VudHMoYnl0ZXMxNihhZGRyZXNzKSkudmFsdWUKICAgIGR1cAogICAgY2FsbHN1YiBieXRlczE2CiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTU4CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGIgZ2V0X2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6OkVzY3Jvd0ZhY3RvcnkuZ2V0QDQKCgovLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czo6RXNjcm93RmFjdG9yeS5tdXN0R2V0W3JvdXRpbmddKCkgLT4gdm9pZDoKbXVzdEdldDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE2NgogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE2OAogICAgLy8gYXNzZXJ0KHRoaXMud2FsbGV0SURzQnlBY2NvdW50cyhieXRlczE2KGFkZHJlc3MpKS5leGlzdHMsICdBY2NvdW50IG5vdCBmb3VuZCcpCiAgICBkdXAKICAgIGNhbGxzdWIgYnl0ZXMxNgogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gQWNjb3VudCBub3QgZm91bmQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE2OQogICAgLy8gcmV0dXJuIHRoaXMud2FsbGV0SURzQnlBY2NvdW50cyhieXRlczE2KGFkZHJlc3MpKS52YWx1ZQogICAgY2FsbHN1YiBieXRlczE2CiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTY2CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGR1cAogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgc3dhcAogICAgY29uY2F0CiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6OkVzY3Jvd0ZhY3RvcnkuZ2V0TGlzdFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmdldExpc3Q6CiAgICBpbnRjXzEgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTcyCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cG4gMgogICAgaW50Y18xIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGludGNfMyAvLyAzMgogICAgKgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIHN3YXAKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFszMl1bXSkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE3NAogICAgLy8gY29uc3QgYXBwczogYnl0ZXNbXSA9IFtdCiAgICBieXRlY18yIC8vIDB4MDAwMAogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTc1CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYWRkcmVzc2VzLmxlbmd0aDsgaSsrKSB7CiAgICBpbnRjXzEgLy8gMAoKZ2V0TGlzdF93aGlsZV90b3BAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE3NQogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFkZHJlc3Nlcy5sZW5ndGg7IGkrKykgewogICAgZHVwCiAgICBkaWcgMwogICAgPAogICAgYnogZ2V0TGlzdF9hZnRlcl93aGlsZUA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxNzYKICAgIC8vIGNvbnN0IGFkZHJlc3MgPSBhZGRyZXNzZXNbaV0KICAgIGRpZyAzCiAgICBleHRyYWN0IDIgMAogICAgZGlnIDEKICAgIGludGNfMyAvLyAzMgogICAgKgogICAgaW50Y18zIC8vIDMyCiAgICBleHRyYWN0MyAvLyBvbiBlcnJvcjogaW5kZXggYWNjZXNzIGlzIG91dCBvZiBib3VuZHMKICAgIGR1cAogICAgYnVyeSA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxNzcKICAgIC8vIGlmICh0aGlzLndhbGxldElEc0J5QWNjb3VudHMoYnl0ZXMxNihhZGRyZXNzKSkuZXhpc3RzKSB7CiAgICBjYWxsc3ViIGJ5dGVzMTYKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYnogZ2V0TGlzdF9lbHNlX2JvZHlANQogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTc4CiAgICAvLyBhcHBzLnB1c2godGhpcy53YWxsZXRJRHNCeUFjY291bnRzKGJ5dGVzMTYoYWRkcmVzcykpLnZhbHVlKQogICAgZGlnIDQKICAgIGNhbGxzdWIgYnl0ZXMxNgogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGR1cAogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgc3dhcAogICAgY29uY2F0CiAgICBkaWcgMgogICAgc3dhcAogICAgaW50Y18wIC8vIDEKICAgIGNhbGxzdWIgZHluYW1pY19hcnJheV9jb25jYXRfYnl0ZV9sZW5ndGhfaGVhZAogICAgYnVyeSAyCgpnZXRMaXN0X2FmdGVyX2lmX2Vsc2VANjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE3NQogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFkZHJlc3Nlcy5sZW5ndGg7IGkrKykgewogICAgZHVwCiAgICBpbnRjXzAgLy8gMQogICAgKwogICAgYnVyeSAxCiAgICBiIGdldExpc3Rfd2hpbGVfdG9wQDIKCmdldExpc3RfZWxzZV9ib2R5QDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxODAKICAgIC8vIGFwcHMucHVzaChCeXRlcygnJykpCiAgICBkaWcgMQogICAgYnl0ZWNfMiAvLyAweDAwMDAKICAgIGludGNfMCAvLyAxCiAgICBjYWxsc3ViIGR5bmFtaWNfYXJyYXlfY29uY2F0X2J5dGVfbGVuZ3RoX2hlYWQKICAgIGJ1cnkgMgogICAgYiBnZXRMaXN0X2FmdGVyX2lmX2Vsc2VANgoKZ2V0TGlzdF9hZnRlcl93aGlsZUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTcyCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgZGlnIDIKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6OkVzY3Jvd0ZhY3RvcnkubXVzdEdldExpc3Rbcm91dGluZ10oKSAtPiB2b2lkOgptdXN0R2V0TGlzdDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE4NgogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXBuIDIKICAgIGludGNfMSAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBpbnRjXzMgLy8gMzIKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbMzJdW10pCiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxODgKICAgIC8vIGNvbnN0IGFwcHM6IGJ5dGVzW10gPSBbXQogICAgYnl0ZWNfMiAvLyAweDAwMDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE4OQogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFkZHJlc3Nlcy5sZW5ndGg7IGkrKykgewogICAgaW50Y18xIC8vIDAKCm11c3RHZXRMaXN0X3doaWxlX3RvcEAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTg5CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYWRkcmVzc2VzLmxlbmd0aDsgaSsrKSB7CiAgICBkdXAKICAgIGRpZyAzCiAgICA8CiAgICBieiBtdXN0R2V0TGlzdF9hZnRlcl93aGlsZUA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZXNjcm93L2ZhY3RvcnkuYWxnby50czoxOTAKICAgIC8vIGNvbnN0IGFkZHJlc3MgPSBhZGRyZXNzZXNbaV0KICAgIGRpZyAzCiAgICBleHRyYWN0IDIgMAogICAgZGlnIDEKICAgIGR1cAogICAgY292ZXIgMgogICAgaW50Y18zIC8vIDMyCiAgICAqCiAgICBpbnRjXzMgLy8gMzIKICAgIGV4dHJhY3QzIC8vIG9uIGVycm9yOiBpbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTkxCiAgICAvLyBhc3NlcnQodGhpcy53YWxsZXRJRHNCeUFjY291bnRzKGJ5dGVzMTYoYWRkcmVzcykpLmV4aXN0cywgJ0FjY291bnQgbm90IGZvdW5kJykKICAgIGR1cAogICAgY2FsbHN1YiBieXRlczE2CiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBBY2NvdW50IG5vdCBmb3VuZAogICAgLy8gc21hcnRfY29udHJhY3RzL2VzY3Jvdy9mYWN0b3J5LmFsZ28udHM6MTkyCiAgICAvLyBhcHBzLnB1c2godGhpcy53YWxsZXRJRHNCeUFjY291bnRzKGJ5dGVzMTYoYWRkcmVzcykpLnZhbHVlKQogICAgY2FsbHN1YiBieXRlczE2CiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgZHVwCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGRpZyAzCiAgICBzd2FwCiAgICBpbnRjXzAgLy8gMQogICAgY2FsbHN1YiBkeW5hbWljX2FycmF5X2NvbmNhdF9ieXRlX2xlbmd0aF9oZWFkCiAgICBidXJ5IDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE4OQogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFkZHJlc3Nlcy5sZW5ndGg7IGkrKykgewogICAgaW50Y18wIC8vIDEKICAgICsKICAgIGJ1cnkgMQogICAgYiBtdXN0R2V0TGlzdF93aGlsZV90b3BAMgoKbXVzdEdldExpc3RfYWZ0ZXJfd2hpbGVANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9lc2Nyb3cvZmFjdG9yeS5hbGdvLnRzOjE4NgogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIGRpZyAyCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAFAQACIPCTCSYDBBUffHUAAgAAMRtBAGYxGRREMRhEggoE2FzxhARgfnBGBIo5558Em2f6bQQ8dUEgBEyftlYEPBpvMwQrVgKjBBPcUIoER103czYaAI4KAKwB5AJmAuUAAQLxAwwDNgNZA78AgAwVH3x1AAAAAAAAL0SwIkMxGRQxGBQQQ4oDAYv9I1lJi/8ITCQLJAhLARZXBgJOAov9JEsCUov/JAuvUIv9FYv9TwNPAlJQi/5QTCQLSSOLBIsCDEEAI4sDSRZXBgKLAYsESU4ETwJdSYwBSwFZJAgIjAMkCIwEQv/ViwCLAVCMAImKAQGL/xUjSwEPI0sCTwJNgRBLAg+BEE8DTwJNi/9OAlJJFYEQEkSJKTEWIglJOBAiEkQyDUlAASExAIj/wksCSTgHMgoSTDgIIQQyAQgSEESxSRUWVwYCTFCABI55NY2yGrIaIrI1gAQLgQFDskKAlwELIAIBAIAEJDeNPDYaAI4BACUxGRREMRhBAA6ABGWpe8w2GgCOAQA5AIAEjnk1jTYaAI4BAA0AMRmBBRIxGBBEQgBANhoBSSNZgQIISwEVEkRXAgCAB2NyZWF0b3JMZyJDNhoBSRWBIBJEMQAyCRJEsTIKsgeyICOyCCKyECOyAbMiQzEAMgkSRLEyCbIJIrIQI7IBsyJDskAjshmBBrIQI7IBs7cAPUlFBLFyCEQyAbIIsgcishAjsgGzsUlAACMxAIAEZal7zLIashojshlLAkmyGIEGshAjsgGzFihMULAiQzIOQv/aMg0WQv7eMRYiCUk4ECISRDYaAUkVgQgSRBdJMg1EQQAKSXIHRDIKEkEAWSJESXIHRDIKEkEAQ0mAB2NyZWF0b3JlSEkXMg0SREsBcghEiP5VSb1FARRESwNJOAcyChJMOAhPA0lOAxWBkAMLgcRFCBIQREsBvEi/IkMyDRYyDUUCQv/FI0L/pCk2GgFJFYEIEkQXSTINTHIIRIj+CUcCvUUBRL5ISRVJTgKBCBJJTgJBAEoXSwQSREsBgZADC4G02QkIRQaxgAQkN408shqBBbIZSwSyGIEGshAjsgGzSwK8SLFJQQARMg5LBrIIsgcishAjsgGzIkMxAEL/7DEAiP2kEkRC/7EhBDIBCBYoTFCwIkM2GgFJFSUSRIj9iL1FAYABACNPAlQoTFCwIkM2GgFHAhUlEkSI/Wy9RQFAAA8pSRUWVwYCTFAoTFCwIkNJiP1TvkRC/+k2GgFJFSUSREmI/UK9RQFEiP07vkRJFRZXBgJMUChMULAiQyM2GgFHAiNZSU4CJQskCEwVEkQqI0lLAwxBAENLA1cCAEsBJQslWElFBoj8/r1FAUEAIEsEiPzzvkRJFRZXBgJMUEsCTCKI/HhFAkkiCEUBQv/CSwEqIoj8Z0UCQv/sKEsCULAiQzYaAUcCI1lJTgIlCyQITBUSRCojSUsDDEEAM0sDVwIASwFJTgIlCyVYSYj8mL1FAUSI/JG+REkVFlcGAkxQSwNMIoj8FkUDIghFAUL/xihLAlCwIkM=", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
var EscrowFactoryParamsFactory = class {
  /**
   * Constructs a no op call for the new(pay)uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static new(params) {
    return {
      ...params,
      method: "new(pay)uint64",
      args: Array.isArray(params.args) ? params.args : [params.args.payment]
    };
  }
  /**
   * Constructs a no op call for the register(pay,uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static register(params) {
    return {
      ...params,
      method: "register(pay,uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.payment, params.args.app]
    };
  }
  /**
   * Constructs a no op call for the delete(uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static delete(params) {
    return {
      ...params,
      method: "delete(uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.id]
    };
  }
  /**
   * Constructs a no op call for the cost()uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static cost(params) {
    return {
      ...params,
      method: "cost()uint64",
      args: Array.isArray(params.args) ? params.args : []
    };
  }
  /**
   * Constructs a no op call for the registerCost()uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static registerCost(params) {
    return {
      ...params,
      method: "registerCost()uint64",
      args: Array.isArray(params.args) ? params.args : []
    };
  }
  /**
   * Constructs a no op call for the exists(address)bool ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static exists(params) {
    return {
      ...params,
      method: "exists(address)bool",
      args: Array.isArray(params.args) ? params.args : [params.args.address]
    };
  }
  /**
   * Constructs a no op call for the get(address)byte[] ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static get(params) {
    return {
      ...params,
      method: "get(address)byte[]",
      args: Array.isArray(params.args) ? params.args : [params.args.address]
    };
  }
  /**
   * Constructs a no op call for the mustGet(address)byte[] ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static mustGet(params) {
    return {
      ...params,
      method: "mustGet(address)byte[]",
      args: Array.isArray(params.args) ? params.args : [params.args.address]
    };
  }
  /**
   * Constructs a no op call for the getList(address[])byte[][] ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static getList(params) {
    return {
      ...params,
      method: "getList(address[])byte[][]",
      args: Array.isArray(params.args) ? params.args : [params.args.addresses]
    };
  }
  /**
   * Constructs a no op call for the mustGetList(address[])byte[][] ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static mustGetList(params) {
    return {
      ...params,
      method: "mustGetList(address[])byte[][]",
      args: Array.isArray(params.args) ? params.args : [params.args.addresses]
    };
  }
};
var EscrowFactoryFactory = class {
  /**
   * The underlying `AppFactory` for when you want to have more flexibility
   */
  appFactory;
  /**
   * Creates a new instance of `EscrowFactoryFactory`
   *
   * @param params The parameters to initialise the app factory with
   */
  constructor(params) {
    this.appFactory = new _AppFactory2({
      ...params,
      appSpec: APP_SPEC2
    });
  }
  /** The name of the app (from the ARC-32 / ARC-56 app spec or override). */
  get appName() {
    return this.appFactory.appName;
  }
  /** The ARC-56 app spec being used */
  get appSpec() {
    return APP_SPEC2;
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
    return new EscrowFactoryClient(this.appFactory.getAppClientById(params));
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
    return new EscrowFactoryClient(await this.appFactory.getAppClientByCreatorAndName(params));
  }
  /**
   * Idempotently deploys the EscrowFactory smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  async deploy(params = {}) {
    const result = await this.appFactory.deploy({
      ...params
    });
    return { result: result.result, appClient: new EscrowFactoryClient(result.appClient) };
  }
  /**
   * Get parameters to create transactions (create and deploy related calls) for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
   */
  params = {
    /**
     * Gets available create methods
     */
    create: {
      /**
       * Creates a new instance of the EscrowFactory smart contract using a bare call.
       *
       * @param params The params for the bare (raw) call
       * @returns The params for a create call
       */
      bare: (params) => {
        return this.appFactory.params.bare.create(params);
      }
    }
  };
  /**
   * Create transactions for the current app
   */
  createTransaction = {
    /**
     * Gets available create methods
     */
    create: {
      /**
       * Creates a new instance of the EscrowFactory smart contract using a bare call.
       *
       * @param params The params for the bare (raw) call
       * @returns The transaction for a create call
       */
      bare: (params) => {
        return this.appFactory.createTransaction.bare.create(params);
      }
    }
  };
  /**
   * Send calls to the current app
   */
  send = {
    /**
     * Gets available create methods
     */
    create: {
      /**
       * Creates a new instance of the EscrowFactory smart contract using a bare call.
       *
       * @param params The params for the bare (raw) call
       * @returns The create result
       */
      bare: async (params) => {
        const result = await this.appFactory.send.bare.create(params);
        return { result: result.result, appClient: new EscrowFactoryClient(result.appClient) };
      }
    }
  };
};
var EscrowFactoryClient = class _EscrowFactoryClient {
  /**
   * The underlying `AppClient` for when you want to have more flexibility
   */
  appClient;
  constructor(appClientOrParams) {
    this.appClient = appClientOrParams instanceof _AppClient2 ? appClientOrParams : new _AppClient2({
      ...appClientOrParams,
      appSpec: APP_SPEC2
    });
  }
  /**
   * Checks for decode errors on the given return value and maps the return value to the return type for the given method
   * @returns The typed return value or undefined if there was no value
   */
  decodeReturnValue(method, returnValue) {
    return returnValue !== void 0 ? getArc56ReturnValue(returnValue, this.appClient.getABIMethod(method), APP_SPEC2.structs) : void 0;
  }
  /**
   * Returns a new `EscrowFactoryClient` client, resolving the app by creator address and name
   * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
   * @param params The parameters to create the app client
   */
  static async fromCreatorAndName(params) {
    return new _EscrowFactoryClient(await _AppClient2.fromCreatorAndName({ ...params, appSpec: APP_SPEC2 }));
  }
  /**
   * Returns an `EscrowFactoryClient` instance for the current network based on
   * pre-determined network-specific app IDs specified in the ARC-56 app spec.
   *
   * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
   * @param params The parameters to create the app client
   */
  static async fromNetwork(params) {
    return new _EscrowFactoryClient(await _AppClient2.fromNetwork({ ...params, appSpec: APP_SPEC2 }));
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
   * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
   */
  params = {
    /**
     * Makes a clear_state call to an existing instance of the EscrowFactory smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.params.bare.clearState(params);
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `new(pay)uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    new: (params) => {
      return this.appClient.params.call(EscrowFactoryParamsFactory.new(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `register(pay,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    register: (params) => {
      return this.appClient.params.call(EscrowFactoryParamsFactory.register(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `delete(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    delete: (params) => {
      return this.appClient.params.call(EscrowFactoryParamsFactory.delete(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `cost()uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    cost: (params = { args: [] }) => {
      return this.appClient.params.call(EscrowFactoryParamsFactory.cost(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `registerCost()uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    registerCost: (params = { args: [] }) => {
      return this.appClient.params.call(EscrowFactoryParamsFactory.registerCost(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `exists(address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    exists: (params) => {
      return this.appClient.params.call(EscrowFactoryParamsFactory.exists(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `get(address)byte[]` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    get: (params) => {
      return this.appClient.params.call(EscrowFactoryParamsFactory.get(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `mustGet(address)byte[]` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    mustGet: (params) => {
      return this.appClient.params.call(EscrowFactoryParamsFactory.mustGet(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `getList(address[])byte[][]` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    getList: (params) => {
      return this.appClient.params.call(EscrowFactoryParamsFactory.getList(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `mustGetList(address[])byte[][]` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    mustGetList: (params) => {
      return this.appClient.params.call(EscrowFactoryParamsFactory.mustGetList(params));
    }
  };
  /**
   * Create transactions for the current app
   */
  createTransaction = {
    /**
     * Makes a clear_state call to an existing instance of the EscrowFactory smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.createTransaction.bare.clearState(params);
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `new(pay)uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    new: (params) => {
      return this.appClient.createTransaction.call(EscrowFactoryParamsFactory.new(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `register(pay,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    register: (params) => {
      return this.appClient.createTransaction.call(EscrowFactoryParamsFactory.register(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `delete(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    delete: (params) => {
      return this.appClient.createTransaction.call(EscrowFactoryParamsFactory.delete(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `cost()uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    cost: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(EscrowFactoryParamsFactory.cost(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `registerCost()uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    registerCost: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(EscrowFactoryParamsFactory.registerCost(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `exists(address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    exists: (params) => {
      return this.appClient.createTransaction.call(EscrowFactoryParamsFactory.exists(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `get(address)byte[]` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    get: (params) => {
      return this.appClient.createTransaction.call(EscrowFactoryParamsFactory.get(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `mustGet(address)byte[]` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    mustGet: (params) => {
      return this.appClient.createTransaction.call(EscrowFactoryParamsFactory.mustGet(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `getList(address[])byte[][]` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    getList: (params) => {
      return this.appClient.createTransaction.call(EscrowFactoryParamsFactory.getList(params));
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `mustGetList(address[])byte[][]` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    mustGetList: (params) => {
      return this.appClient.createTransaction.call(EscrowFactoryParamsFactory.mustGetList(params));
    }
  };
  /**
   * Send calls to the current app
   */
  send = {
    /**
     * Makes a clear_state call to an existing instance of the EscrowFactory smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.send.bare.clearState(params);
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `new(pay)uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    new: async (params) => {
      const result = await this.appClient.send.call(EscrowFactoryParamsFactory.new(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `register(pay,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    register: async (params) => {
      const result = await this.appClient.send.call(EscrowFactoryParamsFactory.register(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `delete(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    delete: async (params) => {
      const result = await this.appClient.send.call(EscrowFactoryParamsFactory.delete(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `cost()uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    cost: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(EscrowFactoryParamsFactory.cost(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `registerCost()uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    registerCost: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(EscrowFactoryParamsFactory.registerCost(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `exists(address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    exists: async (params) => {
      const result = await this.appClient.send.call(EscrowFactoryParamsFactory.exists(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `get(address)byte[]` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    get: async (params) => {
      const result = await this.appClient.send.call(EscrowFactoryParamsFactory.get(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `mustGet(address)byte[]` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    mustGet: async (params) => {
      const result = await this.appClient.send.call(EscrowFactoryParamsFactory.mustGet(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `getList(address[])byte[][]` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    getList: async (params) => {
      const result = await this.appClient.send.call(EscrowFactoryParamsFactory.getList(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the EscrowFactory smart contract using the `mustGetList(address[])byte[][]` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    mustGetList: async (params) => {
      const result = await this.appClient.send.call(EscrowFactoryParamsFactory.mustGetList(params));
      return { ...result, return: result.return };
    }
  };
  /**
   * Clone this app client with different params
   *
   * @param params The params to use for the the cloned app client. Omit a param to keep the original value. Set a param to override the original value. Setting to undefined will clear the original value.
   * @returns A new app client with the altered params
   */
  clone(params) {
    return new _EscrowFactoryClient(this.appClient.clone(params));
  }
  /**
   * Makes a readonly (simulated) call to the EscrowFactory smart contract using the `cost()uint64` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async cost(params = { args: [] }) {
    const result = await this.appClient.send.call(EscrowFactoryParamsFactory.cost(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the EscrowFactory smart contract using the `registerCost()uint64` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async registerCost(params = { args: [] }) {
    const result = await this.appClient.send.call(EscrowFactoryParamsFactory.registerCost(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the EscrowFactory smart contract using the `exists(address)bool` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async exists(params) {
    const result = await this.appClient.send.call(EscrowFactoryParamsFactory.exists(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the EscrowFactory smart contract using the `get(address)byte[]` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async get(params) {
    const result = await this.appClient.send.call(EscrowFactoryParamsFactory.get(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the EscrowFactory smart contract using the `mustGet(address)byte[]` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async mustGet(params) {
    const result = await this.appClient.send.call(EscrowFactoryParamsFactory.mustGet(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the EscrowFactory smart contract using the `getList(address[])byte[][]` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async getList(params) {
    const result = await this.appClient.send.call(EscrowFactoryParamsFactory.getList(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the EscrowFactory smart contract using the `mustGetList(address[])byte[][]` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async mustGetList(params) {
    const result = await this.appClient.send.call(EscrowFactoryParamsFactory.mustGetList(params));
    return result.return;
  }
  /**
   * Methods to access state for the current EscrowFactory app
   */
  state = {
    /**
     * Methods to access box state for the current EscrowFactory app
     */
    box: {
      /**
       * Get all current keyed values from box state
       */
      getAll: async () => {
        const result = await this.appClient.state.box.getAll();
        return {};
      },
      /**
       * Get values from the walletIDsByAccounts map in box state
       */
      walletIDsByAccounts: {
        /**
         * Get all current values of the walletIDsByAccounts map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("walletIDsByAccounts");
        },
        /**
         * Get a current value of the walletIDsByAccounts map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("walletIDsByAccounts", key);
        }
      }
    }
  };
  newGroup() {
    const client = this;
    const composer = this.algorand.newGroup();
    let promiseChain = Promise.resolve();
    const resultMappers = [];
    return {
      /**
       * Add a new(pay)uint64 method call against the EscrowFactory contract
       */
      new(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.new(params)));
        resultMappers.push((v) => client.decodeReturnValue("new(pay)uint64", v));
        return this;
      },
      /**
       * Add a register(pay,uint64)void method call against the EscrowFactory contract
       */
      register(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.register(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a delete(uint64)void method call against the EscrowFactory contract
       */
      delete(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.delete(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a cost()uint64 method call against the EscrowFactory contract
       */
      cost(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.cost(params)));
        resultMappers.push((v) => client.decodeReturnValue("cost()uint64", v));
        return this;
      },
      /**
       * Add a registerCost()uint64 method call against the EscrowFactory contract
       */
      registerCost(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.registerCost(params)));
        resultMappers.push((v) => client.decodeReturnValue("registerCost()uint64", v));
        return this;
      },
      /**
       * Add a exists(address)bool method call against the EscrowFactory contract
       */
      exists(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.exists(params)));
        resultMappers.push((v) => client.decodeReturnValue("exists(address)bool", v));
        return this;
      },
      /**
       * Add a get(address)byte[] method call against the EscrowFactory contract
       */
      get(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.get(params)));
        resultMappers.push((v) => client.decodeReturnValue("get(address)byte[]", v));
        return this;
      },
      /**
       * Add a mustGet(address)byte[] method call against the EscrowFactory contract
       */
      mustGet(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.mustGet(params)));
        resultMappers.push((v) => client.decodeReturnValue("mustGet(address)byte[]", v));
        return this;
      },
      /**
       * Add a getList(address[])byte[][] method call against the EscrowFactory contract
       */
      getList(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getList(params)));
        resultMappers.push((v) => client.decodeReturnValue("getList(address[])byte[][]", v));
        return this;
      },
      /**
       * Add a mustGetList(address[])byte[][] method call against the EscrowFactory contract
       */
      mustGetList(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.mustGetList(params)));
        resultMappers.push((v) => client.decodeReturnValue("mustGetList(address[])byte[][]", v));
        return this;
      },
      /**
       * Add a clear state call to the EscrowFactory contract
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
        var _a;
        await promiseChain;
        const result = await (!options ? composer.simulate() : composer.simulate(options));
        return {
          ...result,
          returns: (_a = result.returns) == null ? void 0 : _a.map((val, i) => resultMappers[i] !== void 0 ? resultMappers[i](val) : val.returnValue)
        };
      },
      async send(params) {
        var _a;
        await promiseChain;
        const result = await composer.send(params);
        return {
          ...result,
          returns: (_a = result.returns) == null ? void 0 : _a.map((val, i) => resultMappers[i] !== void 0 ? resultMappers[i](val) : val.returnValue)
        };
      }
    };
  }
};

// src/escrow/index.ts
var EscrowSDK = class extends BaseSDK {
  constructor(params) {
    super({ factory: EscrowFactory, ...params });
  }
  // ========== Read Methods ==========
  /**
   * Gets the creator of the escrow.
   */
  async getCreator() {
    var _a;
    const state = await this.client.state.global.getAll();
    return ((_a = state.creator) == null ? void 0 : _a.toString()) ?? "";
  }
  // ========== Write Methods ==========
  /**
   * Rekeys the escrow to a new account.
   * Can only be called by the factory (creator).
   */
  async rekey({ sender, signer, rekeyTo }) {
    const sendParams = this.getSendParams({ sender, signer });
    await this.client.send.rekey({
      ...sendParams,
      args: { rekeyTo }
    });
  }
};
var EscrowFactorySDK = class extends BaseSDK {
  constructor(params) {
    super({ factory: EscrowFactoryFactory, ...params }, ENV_VAR_NAMES.ESCROW_FACTORY_APP_ID);
  }
  // ========== Factory Methods ==========
  /**
   * Creates a new escrow and returns an EscrowSDK instance.
   * @returns EscrowSDK for the newly created escrow
   */
  async new(params) {
    const sendParams = this.getRequiredSendParams(params);
    const cost = await this.cost();
    const payment = await this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(cost),
      receiver: this.client.appAddress
    });
    const { return: appId } = await this.client.send.new({
      ...sendParams,
      args: { payment }
    });
    if (appId === void 0) {
      throw new Error("Failed to create new escrow");
    }
    return new EscrowSDK({
      algorand: this.algorand,
      factoryParams: {
        appId,
        defaultSender: sendParams.sender,
        defaultSigner: sendParams.signer
      }
    });
  }
  /**
   * Gets an EscrowSDK instance for an existing escrow.
   * @param appId - The app ID of the escrow
   * @returns EscrowSDK for the specified escrow
   */
  get({ appId }) {
    return new EscrowSDK({
      algorand: this.algorand,
      factoryParams: {
        appId,
        defaultSender: this.sendParams.sender,
        defaultSigner: this.sendParams.signer
      }
    });
  }
  /**
   * Registers an escrow (or self) to enable lookup by address.
   */
  async register({ sender, signer, app }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const cost = await this.registerCost();
    const payment = await this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(cost),
      receiver: this.client.appAddress
    });
    await this.client.send.register({
      ...sendParams,
      args: {
        payment,
        app
      }
    });
  }
  /**
   * Deletes an escrow and refunds MBR.
   */
  async delete({ sender, signer, id }) {
    const sendParams = this.getSendParams({ sender, signer });
    await this.client.send.delete({
      ...sendParams,
      args: { id }
    });
  }
  // ========== Read Methods ==========
  /**
   * Gets the cost to create a new escrow.
   */
  async cost() {
    return await this.client.cost();
  }
  /**
   * Gets the cost to register an escrow.
   */
  async registerCost() {
    return await this.client.registerCost();
  }
  /**
   * Checks if an escrow exists for an address.
   */
  async exists({ address }) {
    const exists = await this.client.exists({ args: { address } });
    return exists ?? false;
  }
  /**
   * Gets the creator bytes for an address.
   * Returns empty bytes if not found.
   */
  async getCreator({ address }) {
    const creator = await this.client.get({ args: { address } });
    return creator ?? new Uint8Array();
  }
  /**
   * Gets creator bytes for multiple addresses.
   */
  async getList({ addresses }) {
    const creators = await this.client.getList({ args: { addresses } });
    return creators ?? [];
  }
};
async function newEscrow({
  factoryParams,
  algorand,
  readerAccount,
  sendParams,
  ...escrowParams
}) {
  const factory = new EscrowFactorySDK({ factoryParams, algorand, readerAccount, sendParams });
  return await factory.new(escrowParams);
}

export {
  EscrowSDK,
  EscrowFactorySDK,
  newEscrow
};
//# sourceMappingURL=chunk-XLSC5VVI.mjs.map