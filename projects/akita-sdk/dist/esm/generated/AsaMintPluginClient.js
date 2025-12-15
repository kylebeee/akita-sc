import { getArc56ReturnValue } from '@algorandfoundation/algokit-utils/types/app-arc56';
import { AppClient as _AppClient, } from '@algorandfoundation/algokit-utils/types/app-client';
import { AppFactory as _AppFactory } from '@algorandfoundation/algokit-utils/types/app-factory';
export const APP_SPEC = { "name": "AsaMintPlugin", "structs": {}, "methods": [{ "name": "mint", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "(string,string,uint64,uint64,address,address,address,address,bool,string)[]", "name": "assets" }, { "type": "pay", "name": "mbrPayment" }], "returns": { "type": "uint64[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 0, "bytes": 0 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": {}, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": ["NoOp"], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [42], "errorMessage": "OnCompletion must be NoOp && can only call when creating" }, { "pc": [31], "errorMessage": "OnCompletion must be NoOp && can only call when not creating" }, { "pc": [393], "errorMessage": "application exists" }, { "pc": [175], "errorMessage": "index access is out of bounds" }, { "pc": [68], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [58], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [132], "errorMessage": "invalid payment" }, { "pc": [358], "errorMessage": "max array length exceeded" }, { "pc": [87], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCAxIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2FzYS1taW50L2NvbnRyYWN0LmFsZ28udHM6NwogICAgLy8gZXhwb3J0IGNsYXNzIEFzYU1pbnRQbHVnaW4gZXh0ZW5kcyBDb250cmFjdCB7CiAgICB0eG4gTnVtQXBwQXJncwogICAgYnogbWFpbl9fX2FsZ290c19fLmRlZmF1bHRDcmVhdGVANQogICAgcHVzaGJ5dGVzIDB4MGRhMzk5MzkgLy8gbWV0aG9kICJtaW50KHVpbnQ2NCxib29sLChzdHJpbmcsc3RyaW5nLHVpbnQ2NCx1aW50NjQsYWRkcmVzcyxhZGRyZXNzLGFkZHJlc3MsYWRkcmVzcyxib29sLHN0cmluZylbXSxwYXkpdWludDY0W10iCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBtYWluX21pbnRfcm91dGVAMwogICAgZXJyCgptYWluX21pbnRfcm91dGVAMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2FzYS1taW50L2NvbnRyYWN0LmFsZ28udHM6OS0xNAogICAgLy8gbWludCgKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICBhc3NldHM6IENyZWF0ZUFzc2V0UGFyYW1zW10sCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4bgogICAgLy8gKTogdWludDY0W10gewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgICYmCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgTm9PcCAmJiBjYW4gb25seSBjYWxsIHdoZW4gbm90IGNyZWF0aW5nCiAgICBiIG1pbnQKCm1haW5fX19hbGdvdHNfXy5kZWZhdWx0Q3JlYXRlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9hc2EtbWludC9jb250cmFjdC5hbGdvLnRzOjcKICAgIC8vIGV4cG9ydCBjbGFzcyBBc2FNaW50UGx1Z2luIGV4dGVuZHMgQ29udHJhY3QgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgICEKICAgICYmCiAgICByZXR1cm4gLy8gb24gZXJyb3I6IE9uQ29tcGxldGlvbiBtdXN0IGJlIE5vT3AgJiYgY2FuIG9ubHkgY2FsbCB3aGVuIGNyZWF0aW5nCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvYXNhLW1pbnQvY29udHJhY3QuYWxnby50czo6QXNhTWludFBsdWdpbi5taW50W3JvdXRpbmddKCkgLT4gdm9pZDoKbWludDoKICAgIGludGNfMCAvLyAwCiAgICBkdXBuIDYKICAgIHB1c2hieXRlcyAiIgogICAgZHVwbiAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9hc2EtbWludC9jb250cmFjdC5hbGdvLnRzOjktMTQKICAgIC8vIG1pbnQoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgYXNzZXRzOiBDcmVhdGVBc3NldFBhcmFtc1tdLAogICAgLy8gICBtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4KICAgIC8vICk6IHVpbnQ2NFtdIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDggLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBkdXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgdW5jb3ZlciAyCiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMSAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY4CiAgICAvLyBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICBwdXNoYnl0ZXMgInNwZW5kaW5nX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2Ni0yNjkKICAgIC8vIGNvbnN0IFtzcGVuZGluZ0FkZHJlc3NCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcygKICAgIC8vICAgd2FsbGV0LAogICAgLy8gICBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICAvLyApCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICBkdXAKICAgIGNvdmVyIDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2FzYS1taW50L2NvbnRyYWN0LmFsZ28udHM6MTctMjQKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IEdsb2JhbC5hc3NldENyZWF0ZU1pbkJhbGFuY2UgKiBhc3NldHMubGVuZ3RoCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgIGRpZyAxCiAgICBndHhucyBSZWNlaXZlcgogICAgPT0KICAgIHN3YXAKICAgIGd0eG5zIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvYXNhLW1pbnQvY29udHJhY3QuYWxnby50czoyMQogICAgLy8gYW1vdW50OiBHbG9iYWwuYXNzZXRDcmVhdGVNaW5CYWxhbmNlICogYXNzZXRzLmxlbmd0aAogICAgZ2xvYmFsIEFzc2V0Q3JlYXRlTWluQmFsYW5jZQogICAgdW5jb3ZlciAzCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGR1cAogICAgY292ZXIgNAogICAgKgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvYXNhLW1pbnQvY29udHJhY3QuYWxnby50czoxNy0yNAogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogc2VuZGVyLAogICAgLy8gICAgIGFtb3VudDogR2xvYmFsLmFzc2V0Q3JlYXRlTWluQmFsYW5jZSAqIGFzc2V0cy5sZW5ndGgKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgICYmCiAgICBhc3NlcnQgLy8gaW52YWxpZCBwYXltZW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9hc2EtbWludC9jb250cmFjdC5hbGdvLnRzOjI2CiAgICAvLyBsZXQgYXNzZXRzQ3JlYXRlZDogdWludDY0W10gPSBbXTsKICAgIHB1c2hieXRlcyAweDAwMDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2FzYS1taW50L2NvbnRyYWN0LmFsZ28udHM6MjcKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhc3NldHMubGVuZ3RoOyBpKyspIHsKICAgIGludGNfMCAvLyAwCgptaW50X3doaWxlX3RvcEAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvYXNhLW1pbnQvY29udHJhY3QuYWxnby50czoyNwogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFzc2V0cy5sZW5ndGg7IGkrKykgewogICAgZHVwCiAgICBkaWcgMwogICAgPAogICAgYnogbWludF9hZnRlcl93aGlsZUA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9hc2EtbWludC9jb250cmFjdC5hbGdvLnRzOjM5CiAgICAvLyB9ID0gYXNzZXRzW2ldOwogICAgZGlnIDQKICAgIGV4dHJhY3QgMiAwCiAgICBkaWcgMQogICAgZHVwCiAgICBjb3ZlciAyCiAgICBpbnRjXzIgLy8gMgogICAgKgogICAgZGlnIDEKICAgIHN3YXAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkaWcgMgogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGR1cAogICAgYnVyeSAxMwogICAgZGlnIDYKICAgIGR1cAogICAgY292ZXIgNAogICAgZGlnIDEKICAgIC0gLy8gb24gZXJyb3I6IGluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICBkaWcgMwogICAgbGVuCiAgICB1bmNvdmVyIDIKICAgIGludGNfMiAvLyAyCiAgICAqCiAgICBkaWcgNAogICAgc3dhcAogICAgZXh0cmFjdF91aW50MTYKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBzdWJzdHJpbmczCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZGlnIDEKICAgIGludGNfMiAvLyAyCiAgICBleHRyYWN0X3VpbnQxNgogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgZGlnIDIKICAgIHN1YnN0cmluZzMKICAgIGV4dHJhY3QgMiAwCiAgICBidXJ5IDIyCiAgICBkaWcgMQogICAgcHVzaGludCAxNDkgLy8gMTQ5CiAgICBleHRyYWN0X3VpbnQxNgogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgZGlnIDIKICAgIHN1YnN0cmluZzMKICAgIGV4dHJhY3QgMiAwCiAgICBidXJ5IDE3CiAgICBkaWcgMQogICAgcHVzaGludCA0IC8vIDQKICAgIGV4dHJhY3RfdWludDY0CiAgICBidXJ5IDEyCiAgICBkaWcgMQogICAgcHVzaGludCAxMiAvLyAxMgogICAgZXh0cmFjdF91aW50NjQKICAgIGJ1cnkgMTUKICAgIGRpZyAxCiAgICBleHRyYWN0IDIwIDMyCiAgICBidXJ5IDE5CiAgICBkaWcgMQogICAgZXh0cmFjdCA1MiAzMgogICAgYnVyeSAxOAogICAgZGlnIDEKICAgIGV4dHJhY3QgODQgMzIKICAgIGJ1cnkgMjAKICAgIGRpZyAxCiAgICBleHRyYWN0IDExNiAzMgogICAgYnVyeSAyMQogICAgZGlnIDEKICAgIHB1c2hpbnQgMTE4NCAvLyAxMTg0CiAgICBnZXRiaXQKICAgIGJ1cnkgMTQKICAgIGRpZyAxCiAgICBsZW4KICAgIHN1YnN0cmluZzMKICAgIGV4dHJhY3QgMiAwCiAgICBidXJ5IDE0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9hc2EtbWludC9jb250cmFjdC5hbGdvLnRzOjQxLTU2CiAgICAvLyBjb25zdCBjcmVhdGVUeG4gPSBpdHhuCiAgICAvLyAgIC5hc3NldENvbmZpZyh7CiAgICAvLyAgICAgc2VuZGVyLAogICAgLy8gICAgIGFzc2V0TmFtZSwKICAgIC8vICAgICB1bml0TmFtZSwKICAgIC8vICAgICB0b3RhbCwKICAgIC8vICAgICBkZWNpbWFscywKICAgIC8vICAgICBtYW5hZ2VyLAogICAgLy8gICAgIHJlc2VydmUsCiAgICAvLyAgICAgZnJlZXplLAogICAgLy8gICAgIGNsYXdiYWNrLAogICAgLy8gICAgIGRlZmF1bHRGcm96ZW4sCiAgICAvLyAgICAgdXJsLAogICAgLy8gICAgIHJla2V5VG86IGkgPCAoYXNzZXRzLmxlbmd0aCAtIDEpID8gR2xvYmFsLnplcm9BZGRyZXNzIDogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2FzYS1taW50L2NvbnRyYWN0LmFsZ28udHM6NTQKICAgIC8vIHJla2V5VG86IGkgPCAoYXNzZXRzLmxlbmd0aCAtIDEpID8gR2xvYmFsLnplcm9BZGRyZXNzIDogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIDwKICAgIGJ6IG1pbnRfdGVybmFyeV9mYWxzZUA1CiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKCm1pbnRfdGVybmFyeV9tZXJnZUA2OgogICAgaXR4bl9maWVsZCBSZWtleVRvCiAgICBkaWcgMTEKICAgIGl0eG5fZmllbGQgQ29uZmlnQXNzZXRVUkwKICAgIGRpZyA5CiAgICBpdHhuX2ZpZWxkIENvbmZpZ0Fzc2V0RGVmYXVsdEZyb3plbgogICAgZGlnIDE2CiAgICBpdHhuX2ZpZWxkIENvbmZpZ0Fzc2V0Q2xhd2JhY2sKICAgIGRpZyAxNQogICAgaXR4bl9maWVsZCBDb25maWdBc3NldEZyZWV6ZQogICAgZGlnIDEzCiAgICBpdHhuX2ZpZWxkIENvbmZpZ0Fzc2V0UmVzZXJ2ZQogICAgZGlnIDE0CiAgICBpdHhuX2ZpZWxkIENvbmZpZ0Fzc2V0TWFuYWdlcgogICAgZGlnIDEwCiAgICBpdHhuX2ZpZWxkIENvbmZpZ0Fzc2V0RGVjaW1hbHMKICAgIGRpZyA3CiAgICBpdHhuX2ZpZWxkIENvbmZpZ0Fzc2V0VG90YWwKICAgIGRpZyAxMgogICAgaXR4bl9maWVsZCBDb25maWdBc3NldFVuaXROYW1lCiAgICBkaWcgMTcKICAgIGl0eG5fZmllbGQgQ29uZmlnQXNzZXROYW1lCiAgICBkaWcgMwogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2FzYS1taW50L2NvbnRyYWN0LmFsZ28udHM6NDEtNTUKICAgIC8vIGNvbnN0IGNyZWF0ZVR4biA9IGl0eG4KICAgIC8vICAgLmFzc2V0Q29uZmlnKHsKICAgIC8vICAgICBzZW5kZXIsCiAgICAvLyAgICAgYXNzZXROYW1lLAogICAgLy8gICAgIHVuaXROYW1lLAogICAgLy8gICAgIHRvdGFsLAogICAgLy8gICAgIGRlY2ltYWxzLAogICAgLy8gICAgIG1hbmFnZXIsCiAgICAvLyAgICAgcmVzZXJ2ZSwKICAgIC8vICAgICBmcmVlemUsCiAgICAvLyAgICAgY2xhd2JhY2ssCiAgICAvLyAgICAgZGVmYXVsdEZyb3plbiwKICAgIC8vICAgICB1cmwsCiAgICAvLyAgICAgcmVrZXlUbzogaSA8IChhc3NldHMubGVuZ3RoIC0gMSkgPyBHbG9iYWwuemVyb0FkZHJlc3MgOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyAgIH0pCiAgICBwdXNoaW50IDMgLy8gMwogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9hc2EtbWludC9jb250cmFjdC5hbGdvLnRzOjQxLTU2CiAgICAvLyBjb25zdCBjcmVhdGVUeG4gPSBpdHhuCiAgICAvLyAgIC5hc3NldENvbmZpZyh7CiAgICAvLyAgICAgc2VuZGVyLAogICAgLy8gICAgIGFzc2V0TmFtZSwKICAgIC8vICAgICB1bml0TmFtZSwKICAgIC8vICAgICB0b3RhbCwKICAgIC8vICAgICBkZWNpbWFscywKICAgIC8vICAgICBtYW5hZ2VyLAogICAgLy8gICAgIHJlc2VydmUsCiAgICAvLyAgICAgZnJlZXplLAogICAgLy8gICAgIGNsYXdiYWNrLAogICAgLy8gICAgIGRlZmF1bHRGcm96ZW4sCiAgICAvLyAgICAgdXJsLAogICAgLy8gICAgIHJla2V5VG86IGkgPCAoYXNzZXRzLmxlbmd0aCAtIDEpID8gR2xvYmFsLnplcm9BZGRyZXNzIDogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIENyZWF0ZWRBc3NldElECiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9hc2EtbWludC9jb250cmFjdC5hbGdvLnRzOjU4CiAgICAvLyBhc3NldHNDcmVhdGVkLnB1c2goY3JlYXRlVHhuLmNyZWF0ZWRBc3NldC5pZCk7CiAgICBpdG9iCiAgICBkaWcgMgogICAgZHVwCiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdCAvLyBvbiBlcnJvcjogbWF4IGFycmF5IGxlbmd0aCBleGNlZWRlZAogICAgc3dhcAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHJlcGxhY2UyIDAKICAgIGJ1cnkgMgogICAgZGlnIDgKICAgIGJ1cnkgMQogICAgYiBtaW50X3doaWxlX3RvcEAyCgptaW50X3Rlcm5hcnlfZmFsc2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzIyCiAgICAvLyBpZiAoIXJla2V5QmFjaykgewogICAgZGlnIDUKICAgIGJueiBtaW50X2FmdGVyX2lmX2Vsc2VAMTEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzIzCiAgICAvLyByZXR1cm4gR2xvYmFsLnplcm9BZGRyZXNzCiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2FzYS1taW50L2NvbnRyYWN0LmFsZ28udHM6NTQKICAgIC8vIHJla2V5VG86IGkgPCAoYXNzZXRzLmxlbmd0aCAtIDEpID8gR2xvYmFsLnplcm9BZGRyZXNzIDogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgYiBtaW50X3Rlcm5hcnlfbWVyZ2VANgoKbWludF9hZnRlcl9pZl9lbHNlQDExOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozMjYKICAgIC8vIHJldHVybiB3YWxsZXQuYWRkcmVzcwogICAgZGlnIDYKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL2FzYS1taW50L2NvbnRyYWN0LmFsZ28udHM6NTQKICAgIC8vIHJla2V5VG86IGkgPCAoYXNzZXRzLmxlbmd0aCAtIDEpID8gR2xvYmFsLnplcm9BZGRyZXNzIDogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgYiBtaW50X3Rlcm5hcnlfbWVyZ2VANgoKbWludF9hZnRlcl93aGlsZUA4OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvYXNhLW1pbnQvY29udHJhY3QuYWxnby50czo5LTE0CiAgICAvLyBtaW50KAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIGFzc2V0czogQ3JlYXRlQXNzZXRQYXJhbXNbXSwKICAgIC8vICAgbWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuCiAgICAvLyApOiB1aW50NjRbXSB7CiAgICBwdXNoYnl0ZXMgMHgxNTFmN2M3NQogICAgZGlnIDIKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCg==", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyADAAECMRtBABiABA2jmTk2GgCOAQABADEZFDEYEERCAAgxGRQxGBQQQyJHBoAARwM2GgFJFYEIEkQXSTYaAkkVIxJEIlNMNhoDSU8CMRYjCUk4ECMSREyAEHNwZW5kaW5nX2FkZHJlc3NlSElOA0sBOAcSTDgIMg9PAyJZSU4ECxIQRIACAAAiSUsDDEEA/EsEVwIASwFJTgIkC0sBTFlLAiMISUUNSwZJTgRLAQlLAxVPAiQLSwRMWU8CTVJJIllLASRZSwJPAksCUlcCAEUWSwGBlQFZSwJPAksCUlcCAEURSwGBBFtFDEsBgQxbRQ9LAVcUIEUTSwFXNCBFEksBV1QgRRRLAVd0IEUVSwGBoAlTRQ5LARVSVwIARQ6xIwkMQQBVMgOyIEsLsidLCbIkSxCyLEsPsitLDbIqSw6yKUsKsiNLB7IiSwyyJUsRsiZLA7IAgQOyECKyAbO0PBZLAklPAlBMIlkjCBZXBgJcAEUCSwhFAUL/D0sFQAAFMgNC/6NLBnIIREL/m4AEFR98dUsCULAjQw==", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the AsaMintPlugin smart contract
 */
export class AsaMintPluginParamsFactory {
    /**
     * Constructs a no op call for the mint(uint64,bool,(string,string,uint64,uint64,address,address,address,address,bool,string)[],pay)uint64[] ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static mint(params) {
        return {
            ...params,
            method: 'mint(uint64,bool,(string,string,uint64,uint64,address,address,address,address,bool,string)[],pay)uint64[]',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.assets, params.args.mbrPayment],
        };
    }
}
/**
 * A factory to create and deploy one or more instance of the AsaMintPlugin smart contract and to create one or more app clients to interact with those (or other) app instances
 */
export class AsaMintPluginFactory {
    /**
     * Creates a new instance of `AsaMintPluginFactory`
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
                 * Creates a new instance of the AsaMintPlugin smart contract using a bare call.
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
                 * Creates a new instance of the AsaMintPlugin smart contract using a bare call.
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
                 * Creates a new instance of the AsaMintPlugin smart contract using a bare call.
                 *
                 * @param params The params for the bare (raw) call
                 * @returns The create result
                 */
                bare: async (params) => {
                    const result = await this.appFactory.send.bare.create(params);
                    return { result: result.result, appClient: new AsaMintPluginClient(result.appClient) };
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
        return new AsaMintPluginClient(this.appFactory.getAppClientById(params));
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
        return new AsaMintPluginClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the AsaMintPlugin smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
        });
        return { result: result.result, appClient: new AsaMintPluginClient(result.appClient) };
    }
}
/**
 * A client to make calls to the AsaMintPlugin smart contract
 */
export class AsaMintPluginClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the AsaMintPlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the AsaMintPlugin smart contract using the `mint(uint64,bool,(string,string,uint64,uint64,address,address,address,address,bool,string)[],pay)uint64[]` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            mint: (params) => {
                return this.appClient.params.call(AsaMintPluginParamsFactory.mint(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the AsaMintPlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the AsaMintPlugin smart contract using the `mint(uint64,bool,(string,string,uint64,uint64,address,address,address,address,bool,string)[],pay)uint64[]` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            mint: (params) => {
                return this.appClient.createTransaction.call(AsaMintPluginParamsFactory.mint(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the AsaMintPlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the AsaMintPlugin smart contract using the `mint(uint64,bool,(string,string,uint64,uint64,address,address,address,address,bool,string)[],pay)uint64[]` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            mint: async (params) => {
                const result = await this.appClient.send.call(AsaMintPluginParamsFactory.mint(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current AsaMintPlugin app
         */
        this.state = {};
        this.appClient = appClientOrParams instanceof _AppClient ? appClientOrParams : new _AppClient({
            ...appClientOrParams,
            appSpec: APP_SPEC,
        });
    }
    /**
     * Checks for decode errors on the given return value and maps the return value to the return type for the given method
     * @returns The typed return value or undefined if there was no value
     */
    decodeReturnValue(method, returnValue) {
        return returnValue !== undefined ? getArc56ReturnValue(returnValue, this.appClient.getABIMethod(method), APP_SPEC.structs) : undefined;
    }
    /**
     * Returns a new `AsaMintPluginClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new AsaMintPluginClient(await _AppClient.fromCreatorAndName({ ...params, appSpec: APP_SPEC }));
    }
    /**
     * Returns an `AsaMintPluginClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new AsaMintPluginClient(await _AppClient.fromNetwork({ ...params, appSpec: APP_SPEC }));
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
        return new AsaMintPluginClient(this.appClient.clone(params));
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a mint(uint64,bool,(string,string,uint64,uint64,address,address,address,address,bool,string)[],pay)uint64[] method call against the AsaMintPlugin contract
             */
            mint(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.mint(params)));
                resultMappers.push((v) => client.decodeReturnValue('mint(uint64,bool,(string,string,uint64,uint64,address,address,address,address,bool,string)[],pay)uint64[]', v));
                return this;
            },
            /**
             * Add a clear state call to the AsaMintPlugin contract
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
//# sourceMappingURL=AsaMintPluginClient.js.map