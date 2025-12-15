import { AppClient as _AppClient, } from '@algorandfoundation/algokit-utils/types/app-client';
import { AppFactory as _AppFactory } from '@algorandfoundation/algokit-utils/types/app-factory';
export const APP_SPEC = { "name": "DualStakePlugin", "structs": {}, "methods": [{ "name": "create", "args": [{ "type": "uint64", "name": "registry" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "mint", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "uint64", "name": "appId" }, { "type": "uint64", "name": "amount" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "redeem", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "uint64", "name": "appId" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 1, "bytes": 0 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "registry": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cnk=" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [245], "errorMessage": "Bytes has valid prefix" }, { "pc": [190, 462], "errorMessage": "Invalid dual stake app" }, { "pc": [339], "errorMessage": "Not enough ASA to pay for minting" }, { "pc": [43], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [100, 183, 188, 194, 345, 455, 460], "errorMessage": "application exists" }, { "pc": [180, 452], "errorMessage": "check GlobalState exists" }, { "pc": [137, 430], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [109, 127, 148, 160, 250, 421, 440], "errorMessage": "invalid number of bytes for uint64" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCA4IDEgNgogICAgYnl0ZWNibG9jayAicmVnaXN0cnkiICJzcGVuZGluZ19hZGRyZXNzIiAweDU1ODhkY2I0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9kdWFsLXN0YWtlL2NvbnRyYWN0LmFsZ28udHM6MTEKICAgIC8vIGV4cG9ydCBjbGFzcyBEdWFsU3Rha2VQbHVnaW4gZXh0ZW5kcyBDb250cmFjdCB7CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgTm9PcAogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGJ6IG1haW5fY3JlYXRlX05vT3BANgogICAgcHVzaGJ5dGVzcyAweDEzNGFlYjg3IDB4ZGZmN2NkMTUgLy8gbWV0aG9kICJtaW50KHVpbnQ2NCxib29sLHVpbnQ2NCx1aW50NjQpdm9pZCIsIG1ldGhvZCAicmVkZWVtKHVpbnQ2NCxib29sLHVpbnQ2NCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggbWludCByZWRlZW0KICAgIGVycgoKbWFpbl9jcmVhdGVfTm9PcEA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjExCiAgICAvLyBleHBvcnQgY2xhc3MgRHVhbFN0YWtlUGx1Z2luIGV4dGVuZHMgQ29udHJhY3QgewogICAgcHVzaGJ5dGVzIDB4MjQwZDJmNjcgLy8gbWV0aG9kICJjcmVhdGUodWludDY0KXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBjcmVhdGUKICAgIGVycgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OnJla2V5QWRkcmVzcyhyZWtleUJhY2s6IHVpbnQ2NCwgd2FsbGV0OiB1aW50NjQpIC0+IGJ5dGVzOgpyZWtleUFkZHJlc3M6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjMyMQogICAgLy8gZXhwb3J0IGZ1bmN0aW9uIHJla2V5QWRkcmVzcyhyZWtleUJhY2s6IGJvb2xlYW4sIHdhbGxldDogQXBwbGljYXRpb24pOiBBY2NvdW50IHsKICAgIHByb3RvIDIgMQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozMjIKICAgIC8vIGlmICghcmVrZXlCYWNrKSB7CiAgICBmcmFtZV9kaWcgLTIKICAgIGJueiByZWtleUFkZHJlc3NfYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjMyMwogICAgLy8gcmV0dXJuIEdsb2JhbC56ZXJvQWRkcmVzcwogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICByZXRzdWIKCnJla2V5QWRkcmVzc19hZnRlcl9pZl9lbHNlQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjMyNgogICAgLy8gcmV0dXJuIHdhbGxldC5hZGRyZXNzCiAgICBmcmFtZV9kaWcgLTEKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2R1YWwtc3Rha2UvY29udHJhY3QuYWxnby50czo6RHVhbFN0YWtlUGx1Z2luLmNyZWF0ZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmNyZWF0ZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2R1YWwtc3Rha2UvY29udHJhY3QuYWxnby50czoxOQogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9kdWFsLXN0YWtlL2NvbnRyYWN0LmFsZ28udHM6MTUKICAgIC8vIHJlZ2lzdHJ5ID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBEdWFsU3Rha2VQbHVnaW5HbG9iYWxTdGF0ZUtleSB9KQogICAgYnl0ZWNfMCAvLyAicmVnaXN0cnkiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9kdWFsLXN0YWtlL2NvbnRyYWN0LmFsZ28udHM6MjEKICAgIC8vIHRoaXMucmVnaXN0cnkudmFsdWUgPSBBcHBsaWNhdGlvbihyZWdpc3RyeSkKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9kdWFsLXN0YWtlL2NvbnRyYWN0LmFsZ28udHM6MTkKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICBpbnRjXzIgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjpEdWFsU3Rha2VQbHVnaW4ubWludFtyb3V0aW5nXSgpIC0+IHZvaWQ6Cm1pbnQ6CiAgICBwdXNoYnl0ZXMgIiIKICAgIGR1cG4gMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjI2LTMxCiAgICAvLyBtaW50KAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIGFwcElkOiBBcHBsaWNhdGlvbiwKICAgIC8vICAgYW1vdW50OiB1aW50NjQKICAgIC8vICk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIGR1cAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgc3dhcAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIGR1cAogICAgY292ZXIgMgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIGR1cAogICAgY292ZXIgMgogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgdW5jb3ZlciAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgYnl0ZWNfMSAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIGR1cAogICAgY292ZXIgMgogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjM0CiAgICAvLyBhc3NlcnQodGhpcy5yZWdpc3RyeS52YWx1ZS5hZGRyZXNzID09PSBhcHBJZC5jcmVhdG9yLCBFUlJfTk9UX0FfRFVBTFNUQUtFX0FQUCkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9kdWFsLXN0YWtlL2NvbnRyYWN0LmFsZ28udHM6MTUKICAgIC8vIHJlZ2lzdHJ5ID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBEdWFsU3Rha2VQbHVnaW5HbG9iYWxTdGF0ZUtleSB9KQogICAgYnl0ZWNfMCAvLyAicmVnaXN0cnkiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9kdWFsLXN0YWtlL2NvbnRyYWN0LmFsZ28udHM6MzQKICAgIC8vIGFzc2VydCh0aGlzLnJlZ2lzdHJ5LnZhbHVlLmFkZHJlc3MgPT09IGFwcElkLmNyZWF0b3IsIEVSUl9OT1RfQV9EVUFMU1RBS0VfQVBQKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIGRpZyAxCiAgICBhcHBfcGFyYW1zX2dldCBBcHBDcmVhdG9yCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgYXNzZXJ0IC8vIEludmFsaWQgZHVhbCBzdGFrZSBhcHAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2R1YWwtc3Rha2UvY29udHJhY3QuYWxnby50czozNi00MgogICAgLy8gaXR4bkNvbXBvc2UuYmVnaW4oCiAgICAvLyAgIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyLAogICAgLy8gICAgIHJlY2VpdmVyOiBhcHBJZC5hZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogYW1vdW50CiAgICAvLyAgIH0pCiAgICAvLyApCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9kdWFsLXN0YWtlL2NvbnRyYWN0LmFsZ28udHM6MzkKICAgIC8vIHJlY2VpdmVyOiBhcHBJZC5hZGRyZXNzLAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgdW5jb3ZlciAyCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgZHVwCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjM3LTQxCiAgICAvLyBpdHhuLnBheW1lbnQoewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIHJlY2VpdmVyOiBhcHBJZC5hZGRyZXNzLAogICAgLy8gICBhbW91bnQ6IGFtb3VudAogICAgLy8gfSkKICAgIGludGNfMiAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2R1YWwtc3Rha2UvY29udHJhY3QuYWxnby50czo0NAogICAgLy8gY29uc3QgcmF0ZSA9IGFiaUNhbGw8dHlwZW9mIER1YWxTdGFrZS5wcm90b3R5cGUuZ2V0X3JhdGU+KHsgc2VuZGVyIH0pLnJldHVyblZhbHVlCiAgICBpdHhuX2JlZ2luCiAgICBwdXNoYnl0ZXMgMHg4ZDQ0ZDFmMyAvLyBtZXRob2QgImdldF9yYXRlKCl1aW50NjQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGludGNfMyAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIHN3YXAKICAgIGV4dHJhY3QgMCA0CiAgICBwdXNoYnl0ZXMgMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9kdWFsLXN0YWtlL2NvbnRyYWN0LmFsZ28udHM6NDYKICAgIC8vIGlmIChyYXRlID4gMCkgewogICAgYnogbWludF9hZnRlcl9pZl9lbHNlQDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2R1YWwtc3Rha2UvY29udHJhY3QuYWxnby50czo0OC01MQogICAgLy8gaXR4bkNvbXBvc2UubmV4dDx0eXBlb2YgRHVhbFN0YWtlLnByb3RvdHlwZS5taW50Pih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQKICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIGJ5dGVjXzIgLy8gbWV0aG9kICJtaW50KCl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyAzCiAgICBkdXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgZGlnIDIKICAgIGR1cAogICAgY292ZXIgMgogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGludGNfMyAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2R1YWwtc3Rha2UvY29udHJhY3QuYWxnby50czo1MwogICAgLy8gY29uc3QgYXNhSUQgPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQoYXBwSWQsIEJ5dGVzKER1YWxTdGFrZUdsb2JhbFN0YXRlS2V5QXNhSUQpKVswXQogICAgZHVwCiAgICBwdXNoYnl0ZXMgImFzYV9pZCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIGR1cAogICAgY292ZXIgMgogICAgYnVyeSAxMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjU0CiAgICAvLyBjb25zdCBwcmVjaXNpb24gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQoYXBwSWQsIEJ5dGVzKER1YWxTdGFrZUdsb2JhbFN0YXRlS2V5UmF0ZVByZWNpc2lvbikpWzBdCiAgICBwdXNoYnl0ZXMgInJhdGVfcHJlY2lzaW9uIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjU1CiAgICAvLyBjb25zdCBhc2FBbW91bnQgPSBvcC5kaXZ3KC4uLm9wLm11bHcoYW1vdW50LCByYXRlKSwgcHJlY2lzaW9uKQogICAgZGlnIDUKICAgIGRpZyA0CiAgICBtdWx3CiAgICB1bmNvdmVyIDIKICAgIGRpdncKICAgIGJ1cnkgMTEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2R1YWwtc3Rha2UvY29udHJhY3QuYWxnby50czo1NwogICAgLy8gY29uc3QgW2hvbGRpbmdzLCBpc09wdGVkSW5dID0gb3AuQXNzZXRIb2xkaW5nLmFzc2V0QmFsYW5jZShzZW5kZXIsIGFzYUlEKQogICAgYXNzZXRfaG9sZGluZ19nZXQgQXNzZXRCYWxhbmNlCiAgICBzd2FwCiAgICBidXJ5IDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2R1YWwtc3Rha2UvY29udHJhY3QuYWxnby50czo1OAogICAgLy8gYXNzZXJ0KGlzT3B0ZWRJbiAmJiBob2xkaW5ncyA+PSBhc2FBbW91bnQsIEVSUl9OT1RfRU5PVUdIX09GX0FTQSkKICAgIGJ6IG1pbnRfYm9vbF9mYWxzZUA2CiAgICBkaWcgNgogICAgZGlnIDkKICAgID49CiAgICBieiBtaW50X2Jvb2xfZmFsc2VANgogICAgaW50Y18yIC8vIDEKCm1pbnRfYm9vbF9tZXJnZUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjU4CiAgICAvLyBhc3NlcnQoaXNPcHRlZEluICYmIGhvbGRpbmdzID49IGFzYUFtb3VudCwgRVJSX05PVF9FTk9VR0hfT0ZfQVNBKQogICAgYXNzZXJ0IC8vIE5vdCBlbm91Z2ggQVNBIHRvIHBheSBmb3IgbWludGluZwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjYwLTY4CiAgICAvLyBpdHhuQ29tcG9zZS5uZXh0KAogICAgLy8gICBpdHhuLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIHNlbmRlciwKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBhcHBJZC5hZGRyZXNzLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiBhc2FBbW91bnQsCiAgICAvLyAgICAgeGZlckFzc2V0OiBhc2FJRCwKICAgIC8vICAgICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyAgIH0pCiAgICAvLyApCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2R1YWwtc3Rha2UvY29udHJhY3QuYWxnby50czo2MwogICAgLy8gYXNzZXRSZWNlaXZlcjogYXBwSWQuYWRkcmVzcywKICAgIGRpZyAzCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9kdWFsLXN0YWtlL2NvbnRyYWN0LmFsZ28udHM6NjYKICAgIC8vIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIGRpZyA1CiAgICBkaWcgNwogICAgY2FsbHN1YiByZWtleUFkZHJlc3MKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgZGlnIDgKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICBkaWcgOQogICAgaXR4bl9maWVsZCBBc3NldEFtb3VudAogICAgaXR4bl9maWVsZCBBc3NldFJlY2VpdmVyCiAgICBkaWcgMQogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2R1YWwtc3Rha2UvY29udHJhY3QuYWxnby50czo2MS02NwogICAgLy8gaXR4bi5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhc3NldFJlY2VpdmVyOiBhcHBJZC5hZGRyZXNzLAogICAgLy8gICBhc3NldEFtb3VudDogYXNhQW1vdW50LAogICAgLy8gICB4ZmVyQXNzZXQ6IGFzYUlELAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgcHVzaGludCA0IC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjcwCiAgICAvLyBpdHhuQ29tcG9zZS5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKCm1pbnRfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9kdWFsLXN0YWtlL2NvbnRyYWN0LmFsZ28udHM6OkR1YWxTdGFrZVBsdWdpbi5taW50QDk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9kdWFsLXN0YWtlL2NvbnRyYWN0LmFsZ28udHM6MjYtMzEKICAgIC8vIG1pbnQoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgYXBwSWQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICBhbW91bnQ6IHVpbnQ2NAogICAgLy8gKTogdm9pZCB7CiAgICBpbnRjXzIgLy8gMQogICAgcmV0dXJuCgptaW50X2Jvb2xfZmFsc2VANjoKICAgIGludGNfMCAvLyAwCiAgICBiIG1pbnRfYm9vbF9tZXJnZUA3CgptaW50X2FmdGVyX2lmX2Vsc2VAODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2R1YWwtc3Rha2UvY29udHJhY3QuYWxnby50czo3Ni04MAogICAgLy8gaXR4bkNvbXBvc2UubmV4dDx0eXBlb2YgRHVhbFN0YWtlLnByb3RvdHlwZS5taW50Pih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQsCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2R1YWwtc3Rha2UvY29udHJhY3QuYWxnby50czo3OQogICAgLy8gcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgZGlnIDQKICAgIGRpZyA2CiAgICBjYWxsc3ViIHJla2V5QWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjc2LTgwCiAgICAvLyBpdHhuQ29tcG9zZS5uZXh0PHR5cGVvZiBEdWFsU3Rha2UucHJvdG90eXBlLm1pbnQ+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZCwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIGJ5dGVjXzIgLy8gbWV0aG9kICJtaW50KCl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgZGlnIDMKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgZGlnIDEKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICBpbnRjXzMgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9kdWFsLXN0YWtlL2NvbnRyYWN0LmFsZ28udHM6ODIKICAgIC8vIGl0eG5Db21wb3NlLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjI2LTMxCiAgICAvLyBtaW50KAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIGFwcElkOiBBcHBsaWNhdGlvbiwKICAgIC8vICAgYW1vdW50OiB1aW50NjQKICAgIC8vICk6IHZvaWQgewogICAgYiBtaW50X2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjpEdWFsU3Rha2VQbHVnaW4ubWludEA5CgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjpEdWFsU3Rha2VQbHVnaW4ucmVkZWVtW3JvdXRpbmddKCkgLT4gdm9pZDoKcmVkZWVtOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjg1CiAgICAvLyByZWRlZW0od2FsbGV0OiBBcHBsaWNhdGlvbiwgcmVrZXlCYWNrOiBib29sZWFuLCBhcHBJZDogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgZGlnIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY4CiAgICAvLyBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICBieXRlY18xIC8vICJzcGVuZGluZ19hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgY292ZXIgMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjg4CiAgICAvLyBhc3NlcnQodGhpcy5yZWdpc3RyeS52YWx1ZS5hZGRyZXNzID09PSBhcHBJZC5jcmVhdG9yLCBFUlJfTk9UX0FfRFVBTFNUQUtFX0FQUCkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9kdWFsLXN0YWtlL2NvbnRyYWN0LmFsZ28udHM6MTUKICAgIC8vIHJlZ2lzdHJ5ID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBEdWFsU3Rha2VQbHVnaW5HbG9iYWxTdGF0ZUtleSB9KQogICAgYnl0ZWNfMCAvLyAicmVnaXN0cnkiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9kdWFsLXN0YWtlL2NvbnRyYWN0LmFsZ28udHM6ODgKICAgIC8vIGFzc2VydCh0aGlzLnJlZ2lzdHJ5LnZhbHVlLmFkZHJlc3MgPT09IGFwcElkLmNyZWF0b3IsIEVSUl9OT1RfQV9EVUFMU1RBS0VfQVBQKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIGRpZyAxCiAgICBhcHBfcGFyYW1zX2dldCBBcHBDcmVhdG9yCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgYXNzZXJ0IC8vIEludmFsaWQgZHVhbCBzdGFrZSBhcHAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2R1YWwtc3Rha2UvY29udHJhY3QuYWxnby50czo5MC05NAogICAgLy8gYWJpQ2FsbDx0eXBlb2YgRHVhbFN0YWtlLnByb3RvdHlwZS5yZWRlZW0+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZCwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2R1YWwtc3Rha2UvY29udHJhY3QuYWxnby50czo5MwogICAgLy8gcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgc3dhcAogICAgdW5jb3ZlciAzCiAgICBjYWxsc3ViIHJla2V5QWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjkwLTk0CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBEdWFsU3Rha2UucHJvdG90eXBlLnJlZGVlbT4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgcHVzaGJ5dGVzIDB4MjcxNzJmNGEgLy8gbWV0aG9kICJyZWRlZW0oKXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBSZWtleVRvCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICBpbnRjXzMgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZHVhbC1zdGFrZS9jb250cmFjdC5hbGdvLnRzOjg1CiAgICAvLyByZWRlZW0od2FsbGV0OiBBcHBsaWNhdGlvbiwgcmVrZXlCYWNrOiBib29sZWFuLCBhcHBJZDogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIGludGNfMiAvLyAxCiAgICByZXR1cm4K", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAAgBBiYDCHJlZ2lzdHJ5EHNwZW5kaW5nX2FkZHJlc3MEVYjctDEZFEQxGEEAFoICBBNK64cE3/fNFTYaAI4CAC4BWACABCQNL2c2GgCOAQASAIoCAYv+QAADMgOJi/9yCESJNhoBSRUjEkQXKExnJEOAAEcCNhoBSRUjEkQXSTYaAkkVJBJEIlNMNhoDSRUjEkQXSU4CNhoESRUjEkQXSU4CTgNPAillSElOAk4DIihlRHIIREsBcgdEEkSxcghETwKyCLIHSbIAJLIQIrIBsYAEjUTR87IasgAlshAisgGztD5JVwQATFcABIAEFR98dRJESRUjEkQXSUEAf7YqshpLA0myGEsCSU4CsgAlshAisgFJgAZhc2FfaWRlSElOAkULgA5yYXRlX3ByZWNpc2lvbmVISwVLBB1PApdFC3AATEUIQQAxSwZLCQ9BACkkRLZLA3IIREsFSweI/vSyIEsIshFLCbISshRLAbIAgQSyECKyAbMkQyJC/9S2SwRLBoj+ziqyGrIgSwOyGEsBsgAlshAisgGzQv/bNhoBSRUjEkQXNhoCSRUkEkQiUzYaA0kVIxJEF0sCKWVITgIiKGVEcghESwFyB0QSRLFMTwOI/n+ABCcXL0qyGrIgshiyACWyECKyAbMkQw==", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the DualStakePlugin smart contract
 */
export class DualStakePluginParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(uint64)void':
                        return DualStakePluginParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the DualStakePlugin smart contract using the create(uint64)void ABI method
             *
             * @param params Parameters for the call
             * @returns An `AppClientMethodCallParams` object for the call
             */
            create(params) {
                return {
                    ...params,
                    method: 'create(uint64)void',
                    args: Array.isArray(params.args) ? params.args : [params.args.registry],
                };
            },
        };
    }
    /**
     * Constructs a no op call for the mint(uint64,bool,uint64,uint64)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static mint(params) {
        return {
            ...params,
            method: 'mint(uint64,bool,uint64,uint64)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.appId, params.args.amount],
        };
    }
    /**
     * Constructs a no op call for the redeem(uint64,bool,uint64)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static redeem(params) {
        return {
            ...params,
            method: 'redeem(uint64,bool,uint64)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.appId],
        };
    }
}
/**
 * A factory to create and deploy one or more instance of the DualStakePlugin smart contract and to create one or more app clients to interact with those (or other) app instances
 */
export class DualStakePluginFactory {
    /**
     * Creates a new instance of `DualStakePluginFactory`
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
                 * Creates a new instance of the DualStakePlugin smart contract using the create(uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create params
                 */
                create: (params) => {
                    return this.appFactory.params.create(DualStakePluginParamsFactory.create.create(params));
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
                 * Creates a new instance of the DualStakePlugin smart contract using the create(uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create transaction
                 */
                create: (params) => {
                    return this.appFactory.createTransaction.create(DualStakePluginParamsFactory.create.create(params));
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
                 * Creates a new instance of the DualStakePlugin smart contract using an ABI method call using the create(uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create result
                 */
                create: async (params) => {
                    const result = await this.appFactory.send.create(DualStakePluginParamsFactory.create.create(params));
                    return { result: { ...result.result, return: result.result.return }, appClient: new DualStakePluginClient(result.appClient) };
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
        return new DualStakePluginClient(this.appFactory.getAppClientById(params));
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
        return new DualStakePluginClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the DualStakePlugin smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? DualStakePluginParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new DualStakePluginClient(result.appClient) };
    }
}
/**
 * A client to make calls to the DualStakePlugin smart contract
 */
export class DualStakePluginClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the DualStakePlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the DualStakePlugin smart contract using the `mint(uint64,bool,uint64,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            mint: (params) => {
                return this.appClient.params.call(DualStakePluginParamsFactory.mint(params));
            },
            /**
             * Makes a call to the DualStakePlugin smart contract using the `redeem(uint64,bool,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            redeem: (params) => {
                return this.appClient.params.call(DualStakePluginParamsFactory.redeem(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the DualStakePlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the DualStakePlugin smart contract using the `mint(uint64,bool,uint64,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            mint: (params) => {
                return this.appClient.createTransaction.call(DualStakePluginParamsFactory.mint(params));
            },
            /**
             * Makes a call to the DualStakePlugin smart contract using the `redeem(uint64,bool,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            redeem: (params) => {
                return this.appClient.createTransaction.call(DualStakePluginParamsFactory.redeem(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the DualStakePlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the DualStakePlugin smart contract using the `mint(uint64,bool,uint64,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            mint: async (params) => {
                const result = await this.appClient.send.call(DualStakePluginParamsFactory.mint(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the DualStakePlugin smart contract using the `redeem(uint64,bool,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            redeem: async (params) => {
                const result = await this.appClient.send.call(DualStakePluginParamsFactory.redeem(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current DualStakePlugin app
         */
        this.state = {
            /**
             * Methods to access global state for the current DualStakePlugin app
             */
            global: {
                /**
                 * Get all current keyed values from global state
                 */
                getAll: async () => {
                    const result = await this.appClient.state.global.getAll();
                    return {
                        registry: result.registry,
                    };
                },
                /**
                 * Get the current value of the registry key in global state
                 */
                registry: async () => { return (await this.appClient.state.global.getValue("registry")); },
            },
        };
        this.appClient = appClientOrParams instanceof _AppClient ? appClientOrParams : new _AppClient({
            ...appClientOrParams,
            appSpec: APP_SPEC,
        });
    }
    /**
     * Returns a new `DualStakePluginClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new DualStakePluginClient(await _AppClient.fromCreatorAndName({ ...params, appSpec: APP_SPEC }));
    }
    /**
     * Returns an `DualStakePluginClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new DualStakePluginClient(await _AppClient.fromNetwork({ ...params, appSpec: APP_SPEC }));
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
        return new DualStakePluginClient(this.appClient.clone(params));
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a mint(uint64,bool,uint64,uint64)void method call against the DualStakePlugin contract
             */
            mint(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.mint(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a redeem(uint64,bool,uint64)void method call against the DualStakePlugin contract
             */
            redeem(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.redeem(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a clear state call to the DualStakePlugin contract
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
//# sourceMappingURL=DualStakePluginClient.js.map