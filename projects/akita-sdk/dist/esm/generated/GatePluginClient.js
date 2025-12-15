import { AppClient as _AppClient, } from '@algorandfoundation/algokit-utils/types/app-client';
import { AppFactory as _AppFactory } from '@algorandfoundation/algokit-utils/types/app-factory';
export const APP_SPEC = { "name": "GatePlugin", "structs": {}, "methods": [{ "name": "create", "args": [{ "type": "uint64", "name": "gateAppID" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "register", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "(uint64,uint64,uint8)[]", "name": "filters" }, { "type": "byte[][]", "name": "args" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 1, "bytes": 0 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "gateAppID": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "Z2F0ZV9hcHBfaWQ=" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [243], "errorMessage": "Bytes has valid prefix" }, { "pc": [25], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [159, 252], "errorMessage": "application exists" }, { "pc": [156], "errorMessage": "check GlobalState exists" }, { "pc": [113], "errorMessage": "invalid number of bytes for (len+(uint64,uint64,uint8)[])" }, { "pc": [90], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [66, 80, 247], "errorMessage": "invalid number of bytes for uint64" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCA4IDEgNjEwMAogICAgYnl0ZWNibG9jayAiZ2F0ZV9hcHBfaWQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9nYXRlL2NvbnRyYWN0LmFsZ28udHM6MTMKICAgIC8vIGV4cG9ydCBjbGFzcyBHYXRlUGx1Z2luIGV4dGVuZHMgQmFzZUdhdGUgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBtdXN0IGJlIE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBieiBtYWluX2NyZWF0ZV9Ob09wQDUKICAgIHB1c2hieXRlcyAweDJmYTMxMjM2IC8vIG1ldGhvZCAicmVnaXN0ZXIodWludDY0LGJvb2wsKHVpbnQ2NCx1aW50NjQsdWludDgpW10sYnl0ZVtdW10pdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIHJlZ2lzdGVyCiAgICBlcnIKCm1haW5fY3JlYXRlX05vT3BANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2dhdGUvY29udHJhY3QuYWxnby50czoxMwogICAgLy8gZXhwb3J0IGNsYXNzIEdhdGVQbHVnaW4gZXh0ZW5kcyBCYXNlR2F0ZSB7CiAgICBwdXNoYnl0ZXMgMHgyNDBkMmY2NyAvLyBtZXRob2QgImNyZWF0ZSh1aW50NjQpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIGNyZWF0ZQogICAgZXJyCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZ2F0ZS9jb250cmFjdC5hbGdvLnRzOjpHYXRlUGx1Z2luLmNyZWF0ZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmNyZWF0ZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2dhdGUvY29udHJhY3QuYWxnby50czoyMQogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9nYXRlL2NvbnRyYWN0LmFsZ28udHM6MTcKICAgIC8vIGdhdGVBcHBJRCA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2F0ZVBsdWdpbkdsb2JhbFN0YXRlS2V5R2F0ZUFwcElEIH0pCiAgICBieXRlY18wIC8vICJnYXRlX2FwcF9pZCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2dhdGUvY29udHJhY3QuYWxnby50czoyMwogICAgLy8gdGhpcy5nYXRlQXBwSUQudmFsdWUgPSBBcHBsaWNhdGlvbihnYXRlQXBwSUQpCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZ2F0ZS9jb250cmFjdC5hbGdvLnRzOjIxCiAgICAvLyBAYWJpbWV0aG9kKHsgb25DcmVhdGU6ICdyZXF1aXJlJyB9KQogICAgaW50Y18yIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2dhdGUvY29udHJhY3QuYWxnby50czo6R2F0ZVBsdWdpbi5yZWdpc3Rlcltyb3V0aW5nXSgpIC0+IHZvaWQ6CnJlZ2lzdGVyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZ2F0ZS9jb250cmFjdC5hbGdvLnRzOjI4LTMzCiAgICAvLyByZWdpc3RlcigKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICBmaWx0ZXJzOiBHYXRlRmlsdGVyW10sCiAgICAvLyAgIGFyZ3M6IEdhdGVBcmdzCiAgICAvLyApOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBkdXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgY292ZXIgMwogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGR1cAogICAgcHVzaGludCAxNyAvLyAxNwogICAgKgogICAgcHVzaGludCAyIC8vIDIKICAgICsKICAgIHVuY292ZXIgMgogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuKyh1aW50NjQsdWludDY0LHVpbnQ4KVtdKQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgdW5jb3ZlciAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgcHVzaGJ5dGVzICJzcGVuZGluZ19hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgZHVwCiAgICBjb3ZlciAyCiAgICBjb3ZlciAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9nYXRlL2NvbnRyYWN0LmFsZ28udHM6MzYtNDkKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEdhdGUucHJvdG90eXBlLnJlZ2lzdGVyPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHRoaXMuZ2F0ZUFwcElELnZhbHVlLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHNlbmRlciwKICAgIC8vICAgICAgIHJlY2VpdmVyOiB0aGlzLmdhdGVBcHBJRC52YWx1ZS5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiB0aGlzLm1icihmaWx0ZXJzLmxlbmd0aCkuZ2F0ZVJlZ2lzdHJ5CiAgICAvLyAgICAgfSksCiAgICAvLyAgICAgZmlsdGVycywKICAgIC8vICAgICBhcmdzLAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZ2F0ZS9jb250cmFjdC5hbGdvLnRzOjQyCiAgICAvLyByZWNlaXZlcjogdGhpcy5nYXRlQXBwSUQudmFsdWUuYWRkcmVzcywKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9nYXRlL2NvbnRyYWN0LmFsZ28udHM6MTcKICAgIC8vIGdhdGVBcHBJRCA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2F0ZVBsdWdpbkdsb2JhbFN0YXRlS2V5R2F0ZUFwcElEIH0pCiAgICBieXRlY18wIC8vICJnYXRlX2FwcF9pZCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2dhdGUvY29udHJhY3QuYWxnby50czo0MgogICAgLy8gcmVjZWl2ZXI6IHRoaXMuZ2F0ZUFwcElELnZhbHVlLmFkZHJlc3MsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgc3dhcAogICAgZHVwCiAgICBjb3ZlciAyCiAgICBjb3ZlciA1CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvYmFzZS50czo4CiAgICAvLyBnYXRlUmVnaXN0cnk6IDZfMTAwICsgKDQwMCAqICgzMiAqIGxlbmd0aCkpLAogICAgc3dhcAogICAgcHVzaGludCAxMjgwMCAvLyAxMjgwMAogICAgKgogICAgaW50Y18zIC8vIDYxMDAKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9iYXNlLnRzOjcKICAgIC8vIGFwcFJlZ2lzdHJ5OiA2XzEwMCwKICAgIGludGNfMyAvLyA2MTAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvYmFzZS50czo2LTkKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIGFwcFJlZ2lzdHJ5OiA2XzEwMCwKICAgIC8vICAgZ2F0ZVJlZ2lzdHJ5OiA2XzEwMCArICg0MDAgKiAoMzIgKiBsZW5ndGgpKSwKICAgIC8vIH0KICAgIGl0b2IKICAgIHN3YXAKICAgIGl0b2IKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZ2F0ZS9jb250cmFjdC5hbGdvLnRzOjQzCiAgICAvLyBhbW91bnQ6IHRoaXMubWJyKGZpbHRlcnMubGVuZ3RoKS5nYXRlUmVnaXN0cnkKICAgIGludGNfMSAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9nYXRlL2NvbnRyYWN0LmFsZ28udHM6NDAtNDQKICAgIC8vIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgcmVjZWl2ZXI6IHRoaXMuZ2F0ZUFwcElELnZhbHVlLmFkZHJlc3MsCiAgICAvLyAgIGFtb3VudDogdGhpcy5tYnIoZmlsdGVycy5sZW5ndGgpLmdhdGVSZWdpc3RyeQogICAgLy8gfSksCiAgICBpbnRjXzIgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9nYXRlL2NvbnRyYWN0LmFsZ28udHM6MzYtNDkKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEdhdGUucHJvdG90eXBlLnJlZ2lzdGVyPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHRoaXMuZ2F0ZUFwcElELnZhbHVlLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHNlbmRlciwKICAgIC8vICAgICAgIHJlY2VpdmVyOiB0aGlzLmdhdGVBcHBJRC52YWx1ZS5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiB0aGlzLm1icihmaWx0ZXJzLmxlbmd0aCkuZ2F0ZVJlZ2lzdHJ5CiAgICAvLyAgICAgfSksCiAgICAvLyAgICAgZmlsdGVycywKICAgIC8vICAgICBhcmdzLAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgaXR4bl9uZXh0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjMyMgogICAgLy8gaWYgKCFyZWtleUJhY2spIHsKICAgIGJueiByZWdpc3Rlcl9hZnRlcl9pZl9lbHNlQDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzIzCiAgICAvLyByZXR1cm4gR2xvYmFsLnplcm9BZGRyZXNzCiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKCnJlZ2lzdGVyX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo6cmVrZXlBZGRyZXNzQDg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9nYXRlL2NvbnRyYWN0LmFsZ28udHM6MzYtNDkKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEdhdGUucHJvdG90eXBlLnJlZ2lzdGVyPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHRoaXMuZ2F0ZUFwcElELnZhbHVlLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHNlbmRlciwKICAgIC8vICAgICAgIHJlY2VpdmVyOiB0aGlzLmdhdGVBcHBJRC52YWx1ZS5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiB0aGlzLm1icihmaWx0ZXJzLmxlbmd0aCkuZ2F0ZVJlZ2lzdHJ5CiAgICAvLyAgICAgfSksCiAgICAvLyAgICAgZmlsdGVycywKICAgIC8vICAgICBhcmdzLAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgcHVzaGJ5dGVzIDB4YzIxYzdiYTAgLy8gbWV0aG9kICJyZWdpc3RlcihwYXksKHVpbnQ2NCx1aW50NjQsdWludDgpW10sYnl0ZVtdW10pdWludDY0IgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyA0CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZGlnIDMKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIFJla2V5VG8KICAgIGR1cAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBkaWcgMQogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBnaXR4biAxIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIHN3YXAKICAgIGV4dHJhY3QgMCA0CiAgICBwdXNoYnl0ZXMgMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICBsZW4KICAgIGludGNfMSAvLyA4CiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvZ2F0ZS9jb250cmFjdC5hbGdvLnRzOjI4LTMzCiAgICAvLyByZWdpc3RlcigKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICBmaWx0ZXJzOiBHYXRlRmlsdGVyW10sCiAgICAvLyAgIGFyZ3M6IEdhdGVBcmdzCiAgICAvLyApOiB2b2lkIHsKICAgIHJldHVybiAvLyBvbiBlcnJvcjogaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAoKcmVnaXN0ZXJfYWZ0ZXJfaWZfZWxzZUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozMjYKICAgIC8vIHJldHVybiB3YWxsZXQuYWRkcmVzcwogICAgZGlnIDQKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2dhdGUvY29udHJhY3QuYWxnby50czo0OAogICAgLy8gcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgYiByZWdpc3Rlcl9hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OnJla2V5QWRkcmVzc0A4Cg==", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAAgB1C8mAQtnYXRlX2FwcF9pZDEZFEQxGEEADoAEL6MSNjYaAI4BAB0AgAQkDS9nNhoAjgEAAQA2GgFJFSMSRBcoTGckQzYaAUkVIxJEF0k2GgJJFSQSRCJTNhoDSU4DSSJZSYERC4ECCE8CFRJENhoETgNPAoAQc3BlbmRpbmdfYWRkcmVzc2VISU4CTgOxIihlTElOAk4FRHIIREyBgGQLJQglFkwWUCNbsgiyB7IAJLIQIrIBtkAAOjIDgATCHHugshpLBLIaSwOyGrIgSbIYSwGyAIEGshAisgGztwE+SVcEAExXAASABBUffHUSRBUjEkNLBHIIREL/wA==", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the GatePlugin smart contract
 */
export class GatePluginParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(uint64)void':
                        return GatePluginParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the GatePlugin smart contract using the create(uint64)void ABI method
             *
             * @param params Parameters for the call
             * @returns An `AppClientMethodCallParams` object for the call
             */
            create(params) {
                return {
                    ...params,
                    method: 'create(uint64)void',
                    args: Array.isArray(params.args) ? params.args : [params.args.gateAppId],
                };
            },
        };
    }
    /**
     * Constructs a no op call for the register(uint64,bool,(uint64,uint64,uint8)[],byte[][])void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static register(params) {
        return {
            ...params,
            method: 'register(uint64,bool,(uint64,uint64,uint8)[],byte[][])void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.filters, params.args.args],
        };
    }
}
/**
 * A factory to create and deploy one or more instance of the GatePlugin smart contract and to create one or more app clients to interact with those (or other) app instances
 */
export class GatePluginFactory {
    /**
     * Creates a new instance of `GatePluginFactory`
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
                 * Creates a new instance of the GatePlugin smart contract using the create(uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create params
                 */
                create: (params) => {
                    return this.appFactory.params.create(GatePluginParamsFactory.create.create(params));
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
                 * Creates a new instance of the GatePlugin smart contract using the create(uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create transaction
                 */
                create: (params) => {
                    return this.appFactory.createTransaction.create(GatePluginParamsFactory.create.create(params));
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
                 * Creates a new instance of the GatePlugin smart contract using an ABI method call using the create(uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create result
                 */
                create: async (params) => {
                    const result = await this.appFactory.send.create(GatePluginParamsFactory.create.create(params));
                    return { result: { ...result.result, return: result.result.return }, appClient: new GatePluginClient(result.appClient) };
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
        return new GatePluginClient(this.appFactory.getAppClientById(params));
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
        return new GatePluginClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the GatePlugin smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? GatePluginParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new GatePluginClient(result.appClient) };
    }
}
/**
 * A client to make calls to the GatePlugin smart contract
 */
export class GatePluginClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the GatePlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the GatePlugin smart contract using the `register(uint64,bool,(uint64,uint64,uint8)[],byte[][])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            register: (params) => {
                return this.appClient.params.call(GatePluginParamsFactory.register(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the GatePlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the GatePlugin smart contract using the `register(uint64,bool,(uint64,uint64,uint8)[],byte[][])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            register: (params) => {
                return this.appClient.createTransaction.call(GatePluginParamsFactory.register(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the GatePlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the GatePlugin smart contract using the `register(uint64,bool,(uint64,uint64,uint8)[],byte[][])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            register: async (params) => {
                const result = await this.appClient.send.call(GatePluginParamsFactory.register(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current GatePlugin app
         */
        this.state = {
            /**
             * Methods to access global state for the current GatePlugin app
             */
            global: {
                /**
                 * Get all current keyed values from global state
                 */
                getAll: async () => {
                    const result = await this.appClient.state.global.getAll();
                    return {
                        gateAppId: result.gateAppID,
                    };
                },
                /**
                 * Get the current value of the gateAppID key in global state
                 */
                gateAppId: async () => { return (await this.appClient.state.global.getValue("gateAppID")); },
            },
        };
        this.appClient = appClientOrParams instanceof _AppClient ? appClientOrParams : new _AppClient({
            ...appClientOrParams,
            appSpec: APP_SPEC,
        });
    }
    /**
     * Returns a new `GatePluginClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new GatePluginClient(await _AppClient.fromCreatorAndName({ ...params, appSpec: APP_SPEC }));
    }
    /**
     * Returns an `GatePluginClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new GatePluginClient(await _AppClient.fromNetwork({ ...params, appSpec: APP_SPEC }));
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
        return new GatePluginClient(this.appClient.clone(params));
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a register(uint64,bool,(uint64,uint64,uint8)[],byte[][])void method call against the GatePlugin contract
             */
            register(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.register(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a clear state call to the GatePlugin contract
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
//# sourceMappingURL=GatePluginClient.js.map