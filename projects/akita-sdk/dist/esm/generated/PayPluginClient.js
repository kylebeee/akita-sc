"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayPluginClient = exports.PayPluginFactory = exports.PayPluginParamsFactory = exports.APP_SPEC = void 0;
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "PayPlugin", "structs": {}, "methods": [{ "name": "pay", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "(address,uint64,uint64)[]", "name": "payments" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 0, "bytes": 0 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": {}, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": ["NoOp"], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [42], "errorMessage": "OnCompletion must be NoOp && can only call when creating" }, { "pc": [31], "errorMessage": "OnCompletion must be NoOp && can only call when not creating" }, { "pc": [58], "errorMessage": "application exists" }, { "pc": [145], "errorMessage": "index access is out of bounds" }, { "pc": [106], "errorMessage": "invalid number of bytes for (len+(uint8[32],uint64,uint64)[])" }, { "pc": [82], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [72], "errorMessage": "invalid number of bytes for uint64" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCAxIDQ4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9wYXkvY29udHJhY3QuYWxnby50czo1CiAgICAvLyBleHBvcnQgY2xhc3MgUGF5UGx1Z2luIGV4dGVuZHMgQ29udHJhY3QgewogICAgdHhuIE51bUFwcEFyZ3MKICAgIGJ6IG1haW5fX19hbGdvdHNfXy5kZWZhdWx0Q3JlYXRlQDUKICAgIHB1c2hieXRlcyAweGY5NzM4NDkyIC8vIG1ldGhvZCAicGF5KHVpbnQ2NCxib29sLChhZGRyZXNzLHVpbnQ2NCx1aW50NjQpW10pdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIG1haW5fcGF5X3JvdXRlQDMKICAgIGVycgoKbWFpbl9wYXlfcm91dGVAMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3BheS9jb250cmFjdC5hbGdvLnRzOjcKICAgIC8vIHBheSh3YWxsZXQ6IEFwcGxpY2F0aW9uLCByZWtleUJhY2s6IGJvb2xlYW4sIHBheW1lbnRzOiBQYXlQYXJhbXNbXSk6IHZvaWQgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgICYmCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgTm9PcCAmJiBjYW4gb25seSBjYWxsIHdoZW4gbm90IGNyZWF0aW5nCiAgICBiIHBheQoKbWFpbl9fX2FsZ290c19fLmRlZmF1bHRDcmVhdGVANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3BheS9jb250cmFjdC5hbGdvLnRzOjUKICAgIC8vIGV4cG9ydCBjbGFzcyBQYXlQbHVnaW4gZXh0ZW5kcyBDb250cmFjdCB7CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgIQogICAgJiYKICAgIHJldHVybiAvLyBvbiBlcnJvcjogT25Db21wbGV0aW9uIG11c3QgYmUgTm9PcCAmJiBjYW4gb25seSBjYWxsIHdoZW4gY3JlYXRpbmcKCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjpyZWtleUFkZHJlc3MocmVrZXlCYWNrOiB1aW50NjQsIHdhbGxldDogdWludDY0KSAtPiBieXRlczoKcmVrZXlBZGRyZXNzOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozMjEKICAgIC8vIGV4cG9ydCBmdW5jdGlvbiByZWtleUFkZHJlc3MocmVrZXlCYWNrOiBib29sZWFuLCB3YWxsZXQ6IEFwcGxpY2F0aW9uKTogQWNjb3VudCB7CiAgICBwcm90byAyIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzIyCiAgICAvLyBpZiAoIXJla2V5QmFjaykgewogICAgZnJhbWVfZGlnIC0yCiAgICBibnogcmVrZXlBZGRyZXNzX2FmdGVyX2lmX2Vsc2VAMgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozMjMKICAgIC8vIHJldHVybiBHbG9iYWwuemVyb0FkZHJlc3MKICAgIGdsb2JhbCBaZXJvQWRkcmVzcwogICAgcmV0c3ViCgpyZWtleUFkZHJlc3NfYWZ0ZXJfaWZfZWxzZUAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozMjYKICAgIC8vIHJldHVybiB3YWxsZXQuYWRkcmVzcwogICAgZnJhbWVfZGlnIC0xCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9wYXkvY29udHJhY3QuYWxnby50czo6UGF5UGx1Z2luLnBheVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnBheToKICAgIGludGNfMCAvLyAwCiAgICBwdXNoYnl0ZXMgIiIKICAgIGR1cAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvcGF5L2NvbnRyYWN0LmFsZ28udHM6NwogICAgLy8gcGF5KHdhbGxldDogQXBwbGljYXRpb24sIHJla2V5QmFjazogYm9vbGVhbiwgcGF5bWVudHM6IFBheVBhcmFtc1tdKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCA4IC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgZHVwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBzd2FwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAKICAgIGNvdmVyIDMKICAgIGludGNfMiAvLyA0OAogICAgKgogICAgcHVzaGludCAyIC8vIDIKICAgICsKICAgIHN3YXAKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbisodWludDhbMzJdLHVpbnQ2NCx1aW50NjQpW10pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgcHVzaGJ5dGVzICJzcGVuZGluZ19hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvcGF5L2NvbnRyYWN0LmFsZ28udHM6MTAKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBwYXltZW50cy5sZW5ndGg7IGkrKykgewogICAgaW50Y18wIC8vIDAKCnBheV93aGlsZV90b3BAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3BheS9jb250cmFjdC5hbGdvLnRzOjEwCiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgcGF5bWVudHMubGVuZ3RoOyBpKyspIHsKICAgIGR1cAogICAgZGlnIDMKICAgIDwKICAgIGJ6IHBheV9hZnRlcl93aGlsZUAxNQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvcGF5L2NvbnRyYWN0LmFsZ28udHM6MTEKICAgIC8vIGNvbnN0IHsgcmVjZWl2ZXIsIGFzc2V0LCBhbW91bnQgfSA9IHBheW1lbnRzW2ldOwogICAgZGlnIDMKICAgIGV4dHJhY3QgMiAwCiAgICBkaWcgMQogICAgaW50Y18yIC8vIDQ4CiAgICAqCiAgICBpbnRjXzIgLy8gNDgKICAgIGV4dHJhY3QzIC8vIG9uIGVycm9yOiBpbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgZHVwCiAgICBleHRyYWN0IDAgMzIKICAgIGJ1cnkgMTAKICAgIGR1cAogICAgcHVzaGludCAzMiAvLyAzMgogICAgZXh0cmFjdF91aW50NjQKICAgIGR1cAogICAgY292ZXIgMgogICAgYnVyeSA5CiAgICBwdXNoaW50IDQwIC8vIDQwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgYnVyeSA5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9wYXkvY29udHJhY3QuYWxnby50czoxMwogICAgLy8gaWYgKGFzc2V0ID09PSAwKSB7CiAgICBibnogcGF5X2Vsc2VfYm9keUA5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9wYXkvY29udHJhY3QuYWxnby50czoxNC0yMQogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyLAogICAgLy8gICAgIHJlY2VpdmVyLAogICAgLy8gICAgIGFtb3VudCwKICAgIC8vICAgICByZWtleVRvOiBpIDwgKHBheW1lbnRzLmxlbmd0aCAtIDEpID8gR2xvYmFsLnplcm9BZGRyZXNzIDogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KSwKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9wYXkvY29udHJhY3QuYWxnby50czoxOQogICAgLy8gcmVrZXlUbzogaSA8IChwYXltZW50cy5sZW5ndGggLSAxKSA/IEdsb2JhbC56ZXJvQWRkcmVzcyA6IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCksCiAgICBkaWcgMgogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGRpZyAxCiAgICA+CiAgICBieiBwYXlfdGVybmFyeV9mYWxzZUA2CiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKCnBheV90ZXJuYXJ5X21lcmdlQDc6CiAgICBpdHhuX2ZpZWxkIFJla2V5VG8KICAgIGRpZyA3CiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgZGlnIDgKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIGRpZyAxCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvcGF5L2NvbnRyYWN0LmFsZ28udHM6MTQtMjAKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlciwKICAgIC8vICAgICByZWNlaXZlciwKICAgIC8vICAgICBhbW91bnQsCiAgICAvLyAgICAgcmVrZXlUbzogaSA8IChwYXltZW50cy5sZW5ndGggLSAxKSA/IEdsb2JhbC56ZXJvQWRkcmVzcyA6IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCksCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9wYXkvY29udHJhY3QuYWxnby50czoxNC0yMQogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyLAogICAgLy8gICAgIHJlY2VpdmVyLAogICAgLy8gICAgIGFtb3VudCwKICAgIC8vICAgICByZWtleVRvOiBpIDwgKHBheW1lbnRzLmxlbmd0aCAtIDEpID8gR2xvYmFsLnplcm9BZGRyZXNzIDogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KSwKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAoKcGF5X2FmdGVyX2lmX2Vsc2VAMTQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9wYXkvY29udHJhY3QuYWxnby50czoxMAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IHBheW1lbnRzLmxlbmd0aDsgaSsrKSB7CiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBidXJ5IDEKICAgIGIgcGF5X3doaWxlX3RvcEAyCgpwYXlfdGVybmFyeV9mYWxzZUA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvcGF5L2NvbnRyYWN0LmFsZ28udHM6MTkKICAgIC8vIHJla2V5VG86IGkgPCAocGF5bWVudHMubGVuZ3RoIC0gMSkgPyBHbG9iYWwuemVyb0FkZHJlc3MgOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpLAogICAgZGlnIDQKICAgIGRpZyA2CiAgICBjYWxsc3ViIHJla2V5QWRkcmVzcwogICAgYiBwYXlfdGVybmFyeV9tZXJnZUA3CgpwYXlfZWxzZV9ib2R5QDk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9wYXkvY29udHJhY3QuYWxnby50czoyMy0zMQogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgc2VuZGVyLAogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IHJlY2VpdmVyLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiBhbW91bnQsCiAgICAvLyAgICAgeGZlckFzc2V0OiBhc3NldCwKICAgIC8vICAgICByZWtleVRvOiBpIDwgKHBheW1lbnRzLmxlbmd0aCAtIDEpID8gR2xvYmFsLnplcm9BZGRyZXNzIDogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KSwKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9wYXkvY29udHJhY3QuYWxnby50czoyOQogICAgLy8gcmVrZXlUbzogaSA8IChwYXltZW50cy5sZW5ndGggLSAxKSA/IEdsb2JhbC56ZXJvQWRkcmVzcyA6IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCksCiAgICBkaWcgMgogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGRpZyAxCiAgICA+CiAgICBieiBwYXlfdGVybmFyeV9mYWxzZUAxMQogICAgZ2xvYmFsIFplcm9BZGRyZXNzCgpwYXlfdGVybmFyeV9tZXJnZUAxMjoKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgZGlnIDYKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICBkaWcgNwogICAgaXR4bl9maWVsZCBBc3NldEFtb3VudAogICAgZGlnIDgKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgZGlnIDEKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9wYXkvY29udHJhY3QuYWxnby50czoyMy0zMAogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgc2VuZGVyLAogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IHJlY2VpdmVyLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiBhbW91bnQsCiAgICAvLyAgICAgeGZlckFzc2V0OiBhc3NldCwKICAgIC8vICAgICByZWtleVRvOiBpIDwgKHBheW1lbnRzLmxlbmd0aCAtIDEpID8gR2xvYmFsLnplcm9BZGRyZXNzIDogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KSwKICAgIC8vICAgfSkKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3BheS9jb250cmFjdC5hbGdvLnRzOjIzLTMxCiAgICAvLyBpdHhuCiAgICAvLyAgIC5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBzZW5kZXIsCiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogcmVjZWl2ZXIsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IGFtb3VudCwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IGFzc2V0LAogICAgLy8gICAgIHJla2V5VG86IGkgPCAocGF5bWVudHMubGVuZ3RoIC0gMSkgPyBHbG9iYWwuemVyb0FkZHJlc3MgOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpLAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CiAgICBiIHBheV9hZnRlcl9pZl9lbHNlQDE0CgpwYXlfdGVybmFyeV9mYWxzZUAxMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3BheS9jb250cmFjdC5hbGdvLnRzOjI5CiAgICAvLyByZWtleVRvOiBpIDwgKHBheW1lbnRzLmxlbmd0aCAtIDEpID8gR2xvYmFsLnplcm9BZGRyZXNzIDogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KSwKICAgIGRpZyA0CiAgICBkaWcgNgogICAgY2FsbHN1YiByZWtleUFkZHJlc3MKICAgIGIgcGF5X3Rlcm5hcnlfbWVyZ2VAMTIKCnBheV9hZnRlcl93aGlsZUAxNToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3BheS9jb250cmFjdC5hbGdvLnRzOjcKICAgIC8vIHBheSh3YWxsZXQ6IEFwcGxpY2F0aW9uLCByZWtleUJhY2s6IGJvb2xlYW4sIHBheW1lbnRzOiBQYXlQYXJhbXNbXSk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyADAAEwMRtBABiABPlzhJI2GgCOAQABADEZFDEYEERCABkxGRQxGBQQQ4oCAYv+QAADMgOJi/9yCESJIoAASTYaAUkVgQgSRBdJNhoCSRUjEkQiU0w2GgNJTgJJIllJTgMkC4ECCEwVEkSAEHNwZW5kaW5nX2FkZHJlc3NlSCJJSwMMQQCKSwNXAgBLASQLJFhJVwAgRQpJgSBbSU4CRQmBKFtFCUAANLFLAiMJSwENQQAfMgOyIEsHsghLCLIHSwGyACOyECKyAbNJIwhFAUL/rUsESwaI/1FC/9mxSwIjCUsBDUEAHzIDsiBLBrIRSweyEksIshRLAbIAgQSyECKyAbNC/8RLBEsGiP8dQv/ZI0M=", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the PayPlugin smart contract
 */
class PayPluginParamsFactory {
    /**
     * Constructs a no op call for the pay(uint64,bool,(address,uint64,uint64)[])void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static pay(params) {
        return {
            ...params,
            method: 'pay(uint64,bool,(address,uint64,uint64)[])void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.payments],
        };
    }
}
exports.PayPluginParamsFactory = PayPluginParamsFactory;
/**
 * A factory to create and deploy one or more instance of the PayPlugin smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class PayPluginFactory {
    /**
     * Creates a new instance of `PayPluginFactory`
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
                 * Creates a new instance of the PayPlugin smart contract using a bare call.
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
                 * Creates a new instance of the PayPlugin smart contract using a bare call.
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
                 * Creates a new instance of the PayPlugin smart contract using a bare call.
                 *
                 * @param params The params for the bare (raw) call
                 * @returns The create result
                 */
                bare: async (params) => {
                    const result = await this.appFactory.send.bare.create(params);
                    return { result: result.result, appClient: new PayPluginClient(result.appClient) };
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
        return new PayPluginClient(this.appFactory.getAppClientById(params));
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
        return new PayPluginClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the PayPlugin smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
        });
        return { result: result.result, appClient: new PayPluginClient(result.appClient) };
    }
}
exports.PayPluginFactory = PayPluginFactory;
/**
 * A client to make calls to the PayPlugin smart contract
 */
class PayPluginClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the PayPlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the PayPlugin smart contract using the `pay(uint64,bool,(address,uint64,uint64)[])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            pay: (params) => {
                return this.appClient.params.call(PayPluginParamsFactory.pay(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the PayPlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the PayPlugin smart contract using the `pay(uint64,bool,(address,uint64,uint64)[])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            pay: (params) => {
                return this.appClient.createTransaction.call(PayPluginParamsFactory.pay(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the PayPlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the PayPlugin smart contract using the `pay(uint64,bool,(address,uint64,uint64)[])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            pay: async (params) => {
                const result = await this.appClient.send.call(PayPluginParamsFactory.pay(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current PayPlugin app
         */
        this.state = {};
        this.appClient = appClientOrParams instanceof app_client_1.AppClient ? appClientOrParams : new app_client_1.AppClient({
            ...appClientOrParams,
            appSpec: exports.APP_SPEC,
        });
    }
    /**
     * Returns a new `PayPluginClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new PayPluginClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `PayPluginClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new PayPluginClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
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
        return new PayPluginClient(this.appClient.clone(params));
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a pay(uint64,bool,(address,uint64,uint64)[])void method call against the PayPlugin contract
             */
            pay(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.pay(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a clear state call to the PayPlugin contract
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
exports.PayPluginClient = PayPluginClient;
//# sourceMappingURL=PayPluginClient.js.map