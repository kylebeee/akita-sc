"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCloseOutPluginClient = exports.TestCloseOutPluginFactory = exports.TestCloseOutPluginParamsFactory = exports.APP_SPEC = void 0;
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "TestCloseOutPlugin", "structs": {}, "methods": [{ "name": "closeOutAlgo", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "address", "name": "receiver" }, { "type": "uint64", "name": "amount" }, { "type": "address", "name": "closeTo" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Close out ALGO balance of the spending account.\nSends `amount` to `receiver` and optionally closes the remaining ALGO balance to `closeTo`.\nIf closeTo equals the sender (wallet address), no close-out is performed.", "events": [], "recommendations": {} }, { "name": "closeOutAsset", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "uint64", "name": "asset" }, { "type": "address", "name": "receiver" }, { "type": "address", "name": "assetCloseTo" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Close out an ASA balance of the spending account.\nSends `amount` to `receiver` and closes the remaining asset balance to `assetCloseTo`.", "events": [], "recommendations": {} }], "arcs": [22, 28], "desc": "Test plugin for close-out scenarios.\n\nThis plugin can:\n- Close out ALGO balance to a specified address\n- Close out ASA balance to a specified address", "networks": {}, "state": { "schema": { "global": { "ints": 0, "bytes": 0 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": {}, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": ["NoOp"], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [34], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [67], "errorMessage": "OnCompletion must be NoOp && can only call when creating" }, { "pc": [83], "errorMessage": "application exists" }, { "pc": [101, 178], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [92, 119, 169, 188], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [111, 128, 197, 205], "errorMessage": "invalid number of bytes for uint8[32]" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMSAwIDggMzIKICAgIGJ5dGVjYmxvY2sgInNwZW5kaW5nX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy90ZXN0LWNsb3NlLW91dC9jb250cmFjdC5hbGdvLnRzOjExCiAgICAvLyBleHBvcnQgY2xhc3MgVGVzdENsb3NlT3V0UGx1Z2luIGV4dGVuZHMgQ29udHJhY3QgewogICAgdHhuIE51bUFwcEFyZ3MKICAgIGJ6IG1haW5fX19hbGdvdHNfXy5kZWZhdWx0Q3JlYXRlQDkKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gbXVzdCBiZSBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYXNzZXJ0CiAgICBwdXNoYnl0ZXNzIDB4ZjM3ZmNmMTEgMHhkM2Q0NTQwZSAvLyBtZXRob2QgImNsb3NlT3V0QWxnbyh1aW50NjQsYm9vbCxhZGRyZXNzLHVpbnQ2NCxhZGRyZXNzKXZvaWQiLCBtZXRob2QgImNsb3NlT3V0QXNzZXQodWludDY0LGJvb2wsdWludDY0LGFkZHJlc3MsYWRkcmVzcyl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggY2xvc2VPdXRBbGdvIGNsb3NlT3V0QXNzZXQKICAgIGVycgoKbWFpbl9fX2FsZ290c19fLmRlZmF1bHRDcmVhdGVAOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3Rlc3QtY2xvc2Utb3V0L2NvbnRyYWN0LmFsZ28udHM6MTEKICAgIC8vIGV4cG9ydCBjbGFzcyBUZXN0Q2xvc2VPdXRQbHVnaW4gZXh0ZW5kcyBDb250cmFjdCB7CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgIQogICAgJiYKICAgIHJldHVybiAvLyBvbiBlcnJvcjogT25Db21wbGV0aW9uIG11c3QgYmUgTm9PcCAmJiBjYW4gb25seSBjYWxsIHdoZW4gY3JlYXRpbmcKCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjpyZWtleUFkZHJlc3MocmVrZXlCYWNrOiB1aW50NjQsIHdhbGxldDogdWludDY0KSAtPiBieXRlczoKcmVrZXlBZGRyZXNzOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozMjEKICAgIC8vIGV4cG9ydCBmdW5jdGlvbiByZWtleUFkZHJlc3MocmVrZXlCYWNrOiBib29sZWFuLCB3YWxsZXQ6IEFwcGxpY2F0aW9uKTogQWNjb3VudCB7CiAgICBwcm90byAyIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzIyCiAgICAvLyBpZiAoIXJla2V5QmFjaykgewogICAgZnJhbWVfZGlnIC0yCiAgICBibnogcmVrZXlBZGRyZXNzX2FmdGVyX2lmX2Vsc2VAMgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozMjMKICAgIC8vIHJldHVybiBHbG9iYWwuemVyb0FkZHJlc3MKICAgIGdsb2JhbCBaZXJvQWRkcmVzcwogICAgcmV0c3ViCgpyZWtleUFkZHJlc3NfYWZ0ZXJfaWZfZWxzZUAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozMjYKICAgIC8vIHJldHVybiB3YWxsZXQuYWRkcmVzcwogICAgZnJhbWVfZGlnIC0xCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy90ZXN0LWNsb3NlLW91dC9jb250cmFjdC5hbGdvLnRzOjpUZXN0Q2xvc2VPdXRQbHVnaW4uY2xvc2VPdXRBbGdvW3JvdXRpbmddKCkgLT4gdm9pZDoKY2xvc2VPdXRBbGdvOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvdGVzdC1jbG9zZS1vdXQvY29udHJhY3QuYWxnby50czoxOC0yNAogICAgLy8gY2xvc2VPdXRBbGdvKAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIHJlY2VpdmVyOiBBY2NvdW50LAogICAgLy8gICBhbW91bnQ6IHVpbnQ2NCwKICAgIC8vICAgY2xvc2VUbzogQWNjb3VudAogICAgLy8gKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMCAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18xIC8vIDAKICAgIGdldGJpdAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2Ni0yNjkKICAgIC8vIGNvbnN0IFtzcGVuZGluZ0FkZHJlc3NCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcygKICAgIC8vICAgd2FsbGV0LAogICAgLy8gICBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICAvLyApCiAgICBkaWcgNAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjgKICAgIC8vIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIGJ5dGVjXzAgLy8gInNwZW5kaW5nX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2Ni0yNjkKICAgIC8vIGNvbnN0IFtzcGVuZGluZ0FkZHJlc3NCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcygKICAgIC8vICAgd2FsbGV0LAogICAgLy8gICBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICAvLyApCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy90ZXN0LWNsb3NlLW91dC9jb250cmFjdC5hbGdvLnRzOjI3LTM1CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXIsCiAgICAvLyAgICAgcmVjZWl2ZXIsCiAgICAvLyAgICAgYW1vdW50LAogICAgLy8gICAgIGNsb3NlUmVtYWluZGVyVG86IGNsb3NlVG8sCiAgICAvLyAgICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KSwKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpOwogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvdGVzdC1jbG9zZS1vdXQvY29udHJhY3QuYWxnby50czozMwogICAgLy8gcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KSwKICAgIHVuY292ZXIgNAogICAgdW5jb3ZlciA1CiAgICBjYWxsc3ViIHJla2V5QWRkcmVzcwogICAgaXR4bl9maWVsZCBSZWtleVRvCiAgICBpdHhuX2ZpZWxkIENsb3NlUmVtYWluZGVyVG8KICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvdGVzdC1jbG9zZS1vdXQvY29udHJhY3QuYWxnby50czoyNy0zNAogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyLAogICAgLy8gICAgIHJlY2VpdmVyLAogICAgLy8gICAgIGFtb3VudCwKICAgIC8vICAgICBjbG9zZVJlbWFpbmRlclRvOiBjbG9zZVRvLAogICAgLy8gICAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCksCiAgICAvLyAgIH0pCiAgICBpbnRjXzAgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18xIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy90ZXN0LWNsb3NlLW91dC9jb250cmFjdC5hbGdvLnRzOjI3LTM1CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXIsCiAgICAvLyAgICAgcmVjZWl2ZXIsCiAgICAvLyAgICAgYW1vdW50LAogICAgLy8gICAgIGNsb3NlUmVtYWluZGVyVG86IGNsb3NlVG8sCiAgICAvLyAgICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KSwKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpOwogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3Rlc3QtY2xvc2Utb3V0L2NvbnRyYWN0LmFsZ28udHM6MTgtMjQKICAgIC8vIGNsb3NlT3V0QWxnbygKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICByZWNlaXZlcjogQWNjb3VudCwKICAgIC8vICAgYW1vdW50OiB1aW50NjQsCiAgICAvLyAgIGNsb3NlVG86IEFjY291bnQKICAgIC8vICk6IHZvaWQgewogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3Rlc3QtY2xvc2Utb3V0L2NvbnRyYWN0LmFsZ28udHM6OlRlc3RDbG9zZU91dFBsdWdpbi5jbG9zZU91dEFzc2V0W3JvdXRpbmddKCkgLT4gdm9pZDoKY2xvc2VPdXRBc3NldDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3Rlc3QtY2xvc2Utb3V0L2NvbnRyYWN0LmFsZ28udHM6NDItNDgKICAgIC8vIGNsb3NlT3V0QXNzZXQoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgYXNzZXQ6IEFzc2V0LAogICAgLy8gICByZWNlaXZlcjogQWNjb3VudCwKICAgIC8vICAgYXNzZXRDbG9zZVRvOiBBY2NvdW50CiAgICAvLyApOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18wIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzEgLy8gMAogICAgZ2V0Yml0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA1CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGRpZyA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgYnl0ZWNfMCAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3Rlc3QtY2xvc2Utb3V0L2NvbnRyYWN0LmFsZ28udHM6NTEtNjAKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIHNlbmRlciwKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiByZWNlaXZlciwKICAgIC8vICAgICBhc3NldEFtb3VudDogMCwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IGFzc2V0LAogICAgLy8gICAgIGFzc2V0Q2xvc2VUbywKICAgIC8vICAgICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpLAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy90ZXN0LWNsb3NlLW91dC9jb250cmFjdC5hbGdvLnRzOjU4CiAgICAvLyByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpLAogICAgdW5jb3ZlciA0CiAgICB1bmNvdmVyIDUKICAgIGNhbGxzdWIgcmVrZXlBZGRyZXNzCiAgICBpdHhuX2ZpZWxkIFJla2V5VG8KICAgIGl0eG5fZmllbGQgQXNzZXRDbG9zZVRvCiAgICB1bmNvdmVyIDIKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy90ZXN0LWNsb3NlLW91dC9jb250cmFjdC5hbGdvLnRzOjU1CiAgICAvLyBhc3NldEFtb3VudDogMCwKICAgIGludGNfMSAvLyAwCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgaXR4bl9maWVsZCBBc3NldFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy90ZXN0LWNsb3NlLW91dC9jb250cmFjdC5hbGdvLnRzOjUxLTU5CiAgICAvLyBpdHhuCiAgICAvLyAgIC5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBzZW5kZXIsCiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogcmVjZWl2ZXIsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IDAsCiAgICAvLyAgICAgeGZlckFzc2V0OiBhc3NldCwKICAgIC8vICAgICBhc3NldENsb3NlVG8sCiAgICAvLyAgICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KSwKICAgIC8vICAgfSkKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3Rlc3QtY2xvc2Utb3V0L2NvbnRyYWN0LmFsZ28udHM6NTEtNjAKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIHNlbmRlciwKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiByZWNlaXZlciwKICAgIC8vICAgICBhc3NldEFtb3VudDogMCwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IGFzc2V0LAogICAgLy8gICAgIGFzc2V0Q2xvc2VUbywKICAgIC8vICAgICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpLAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvdGVzdC1jbG9zZS1vdXQvY29udHJhY3QuYWxnby50czo0Mi00OAogICAgLy8gY2xvc2VPdXRBc3NldCgKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICBhc3NldDogQXNzZXQsCiAgICAvLyAgIHJlY2VpdmVyOiBBY2NvdW50LAogICAgLy8gICBhc3NldENsb3NlVG86IEFjY291bnQKICAgIC8vICk6IHZvaWQgewogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAQAIICYBEHNwZW5kaW5nX2FkZHJlc3MxG0EAHTEZFEQxGESCAgTzf88RBNPUVA42GgCOAgAaAGcAMRkUMRgUEEOKAgGL/kAAAzIDiYv/cghEiTYaAUkVJBJEFzYaAkkVIhJEI1M2GgNJFSUSRDYaBEkVJBJEFzYaBUkVJRJESwQoZUhMsU8ETwWI/7WyILIJsgCyCLIHIrIQI7IBsyJDNhoBSRUkEkQXNhoCSRUiEkQjUzYaA0kVJBJEFzYaBEkVJRJENhoFSRUlEkRLBChlSEyxTwRPBYj/aLIgshVPArIRI7ISsgCyFIEEshAjsgGzIkM=", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the TestCloseOutPlugin smart contract
 */
class TestCloseOutPluginParamsFactory {
    /**
     * Constructs a no op call for the closeOutAlgo(uint64,bool,address,uint64,address)void ABI method
     *
    * Close out ALGO balance of the spending account.
    Sends `amount` to `receiver` and optionally closes the remaining ALGO balance to `closeTo`.
    If closeTo equals the sender (wallet address), no close-out is performed.
  
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static closeOutAlgo(params) {
        return {
            ...params,
            method: 'closeOutAlgo(uint64,bool,address,uint64,address)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.receiver, params.args.amount, params.args.closeTo],
        };
    }
    /**
     * Constructs a no op call for the closeOutAsset(uint64,bool,uint64,address,address)void ABI method
     *
    * Close out an ASA balance of the spending account.
    Sends `amount` to `receiver` and closes the remaining asset balance to `assetCloseTo`.
  
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static closeOutAsset(params) {
        return {
            ...params,
            method: 'closeOutAsset(uint64,bool,uint64,address,address)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.asset, params.args.receiver, params.args.assetCloseTo],
        };
    }
}
exports.TestCloseOutPluginParamsFactory = TestCloseOutPluginParamsFactory;
/**
 * A factory to create and deploy one or more instance of the TestCloseOutPlugin smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class TestCloseOutPluginFactory {
    /**
     * Creates a new instance of `TestCloseOutPluginFactory`
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
                 * Creates a new instance of the TestCloseOutPlugin smart contract using a bare call.
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
                 * Creates a new instance of the TestCloseOutPlugin smart contract using a bare call.
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
                 * Creates a new instance of the TestCloseOutPlugin smart contract using a bare call.
                 *
                 * @param params The params for the bare (raw) call
                 * @returns The create result
                 */
                bare: async (params) => {
                    const result = await this.appFactory.send.bare.create(params);
                    return { result: result.result, appClient: new TestCloseOutPluginClient(result.appClient) };
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
        return new TestCloseOutPluginClient(this.appFactory.getAppClientById(params));
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
        return new TestCloseOutPluginClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the TestCloseOutPlugin smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
        });
        return { result: result.result, appClient: new TestCloseOutPluginClient(result.appClient) };
    }
}
exports.TestCloseOutPluginFactory = TestCloseOutPluginFactory;
/**
 * A client to make calls to the TestCloseOutPlugin smart contract
 */
class TestCloseOutPluginClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the TestCloseOutPlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the TestCloseOutPlugin smart contract using the `closeOutAlgo(uint64,bool,address,uint64,address)void` ABI method.
             *
            * Close out ALGO balance of the spending account.
            Sends `amount` to `receiver` and optionally closes the remaining ALGO balance to `closeTo`.
            If closeTo equals the sender (wallet address), no close-out is performed.
        
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            closeOutAlgo: (params) => {
                return this.appClient.params.call(TestCloseOutPluginParamsFactory.closeOutAlgo(params));
            },
            /**
             * Makes a call to the TestCloseOutPlugin smart contract using the `closeOutAsset(uint64,bool,uint64,address,address)void` ABI method.
             *
            * Close out an ASA balance of the spending account.
            Sends `amount` to `receiver` and closes the remaining asset balance to `assetCloseTo`.
        
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            closeOutAsset: (params) => {
                return this.appClient.params.call(TestCloseOutPluginParamsFactory.closeOutAsset(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the TestCloseOutPlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the TestCloseOutPlugin smart contract using the `closeOutAlgo(uint64,bool,address,uint64,address)void` ABI method.
             *
            * Close out ALGO balance of the spending account.
            Sends `amount` to `receiver` and optionally closes the remaining ALGO balance to `closeTo`.
            If closeTo equals the sender (wallet address), no close-out is performed.
        
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            closeOutAlgo: (params) => {
                return this.appClient.createTransaction.call(TestCloseOutPluginParamsFactory.closeOutAlgo(params));
            },
            /**
             * Makes a call to the TestCloseOutPlugin smart contract using the `closeOutAsset(uint64,bool,uint64,address,address)void` ABI method.
             *
            * Close out an ASA balance of the spending account.
            Sends `amount` to `receiver` and closes the remaining asset balance to `assetCloseTo`.
        
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            closeOutAsset: (params) => {
                return this.appClient.createTransaction.call(TestCloseOutPluginParamsFactory.closeOutAsset(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the TestCloseOutPlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the TestCloseOutPlugin smart contract using the `closeOutAlgo(uint64,bool,address,uint64,address)void` ABI method.
             *
            * Close out ALGO balance of the spending account.
            Sends `amount` to `receiver` and optionally closes the remaining ALGO balance to `closeTo`.
            If closeTo equals the sender (wallet address), no close-out is performed.
        
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            closeOutAlgo: async (params) => {
                const result = await this.appClient.send.call(TestCloseOutPluginParamsFactory.closeOutAlgo(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the TestCloseOutPlugin smart contract using the `closeOutAsset(uint64,bool,uint64,address,address)void` ABI method.
             *
            * Close out an ASA balance of the spending account.
            Sends `amount` to `receiver` and closes the remaining asset balance to `assetCloseTo`.
        
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            closeOutAsset: async (params) => {
                const result = await this.appClient.send.call(TestCloseOutPluginParamsFactory.closeOutAsset(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current TestCloseOutPlugin app
         */
        this.state = {};
        this.appClient = appClientOrParams instanceof app_client_1.AppClient ? appClientOrParams : new app_client_1.AppClient({
            ...appClientOrParams,
            appSpec: exports.APP_SPEC,
        });
    }
    /**
     * Returns a new `TestCloseOutPluginClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new TestCloseOutPluginClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `TestCloseOutPluginClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new TestCloseOutPluginClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
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
        return new TestCloseOutPluginClient(this.appClient.clone(params));
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a closeOutAlgo(uint64,bool,address,uint64,address)void method call against the TestCloseOutPlugin contract
             */
            closeOutAlgo(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.closeOutAlgo(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a closeOutAsset(uint64,bool,uint64,address,address)void method call against the TestCloseOutPlugin contract
             */
            closeOutAsset(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.closeOutAsset(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a clear state call to the TestCloseOutPlugin contract
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
exports.TestCloseOutPluginClient = TestCloseOutPluginClient;
//# sourceMappingURL=TestCloseOutPluginClient.js.map