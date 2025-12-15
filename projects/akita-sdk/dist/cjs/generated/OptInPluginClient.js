"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptInPluginClient = exports.OptInPluginFactory = exports.OptInPluginParamsFactory = exports.APP_SPEC = void 0;
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "OptInPlugin", "structs": {}, "methods": [{ "name": "optIn", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "uint64[]", "name": "assets" }, { "type": "pay", "name": "mbrPayment" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 0, "bytes": 0 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": {}, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": ["NoOp"], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [139], "errorMessage": "Invalid payment" }, { "pc": [42], "errorMessage": "OnCompletion must be NoOp && can only call when creating" }, { "pc": [31], "errorMessage": "OnCompletion must be NoOp && can only call when not creating" }, { "pc": [172], "errorMessage": "already opted in" }, { "pc": [230], "errorMessage": "application exists" }, { "pc": [88], "errorMessage": "invalid number of bytes for (len+uint64[])" }, { "pc": [62], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [52], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [98], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMSAwIDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL29wdGluL2NvbnRyYWN0LmFsZ28udHM6NgogICAgLy8gZXhwb3J0IGNsYXNzIE9wdEluUGx1Z2luIGV4dGVuZHMgQ29udHJhY3QgewogICAgdHhuIE51bUFwcEFyZ3MKICAgIGJ6IG1haW5fX19hbGdvdHNfXy5kZWZhdWx0Q3JlYXRlQDUKICAgIHB1c2hieXRlcyAweDY4MzVlM2JjIC8vIG1ldGhvZCAib3B0SW4odWludDY0LGJvb2wsdWludDY0W10scGF5KXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBtYWluX29wdEluX3JvdXRlQDMKICAgIGVycgoKbWFpbl9vcHRJbl9yb3V0ZUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvb3B0aW4vY29udHJhY3QuYWxnby50czo4CiAgICAvLyBvcHRJbih3YWxsZXQ6IEFwcGxpY2F0aW9uLCByZWtleUJhY2s6IGJvb2xlYW4sIGFzc2V0czogdWludDY0W10sIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4bik6IHZvaWQgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgICYmCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgTm9PcCAmJiBjYW4gb25seSBjYWxsIHdoZW4gbm90IGNyZWF0aW5nCiAgICBiIG9wdEluCgptYWluX19fYWxnb3RzX18uZGVmYXVsdENyZWF0ZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvb3B0aW4vY29udHJhY3QuYWxnby50czo2CiAgICAvLyBleHBvcnQgY2xhc3MgT3B0SW5QbHVnaW4gZXh0ZW5kcyBDb250cmFjdCB7CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgIQogICAgJiYKICAgIHJldHVybiAvLyBvbiBlcnJvcjogT25Db21wbGV0aW9uIG11c3QgYmUgTm9PcCAmJiBjYW4gb25seSBjYWxsIHdoZW4gY3JlYXRpbmcKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9vcHRpbi9jb250cmFjdC5hbGdvLnRzOjpPcHRJblBsdWdpbi5vcHRJbltyb3V0aW5nXSgpIC0+IHZvaWQ6Cm9wdEluOgogICAgcHVzaGJ5dGVzICIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9vcHRpbi9jb250cmFjdC5hbGdvLnRzOjgKICAgIC8vIG9wdEluKHdhbGxldDogQXBwbGljYXRpb24sIHJla2V5QmFjazogYm9vbGVhbiwgYXNzZXRzOiB1aW50NjRbXSwgbWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgZHVwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18wIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzEgLy8gMAogICAgZ2V0Yml0CiAgICBzd2FwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgaW50Y18xIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAKICAgIGNvdmVyIDMKICAgIGR1cAogICAgaW50Y18yIC8vIDgKICAgICoKICAgIHB1c2hpbnQgMiAvLyAyCiAgICArCiAgICB1bmNvdmVyIDIKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50NjRbXSkKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzAgLy8gMQogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgaW50Y18wIC8vIHBheQogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIHBheQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgdW5jb3ZlciAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgcHVzaGJ5dGVzICJzcGVuZGluZ19hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgZHVwCiAgICBjb3ZlciAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9vcHRpbi9jb250cmFjdC5hbGdvLnRzOjExLTE4CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBzZW5kZXIsCiAgICAvLyAgICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UgKiBhc3NldHMubGVuZ3RoCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgIGRpZyAxCiAgICBndHhucyBSZWNlaXZlcgogICAgPT0KICAgIHN3YXAKICAgIGd0eG5zIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvb3B0aW4vY29udHJhY3QuYWxnby50czoxNQogICAgLy8gYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UgKiBhc3NldHMubGVuZ3RoCiAgICBnbG9iYWwgQXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgIHVuY292ZXIgMwogICAgKgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvb3B0aW4vY29udHJhY3QuYWxnby50czoxMS0xOAogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogc2VuZGVyLAogICAgLy8gICAgIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlICogYXNzZXRzLmxlbmd0aAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgJiYKICAgIGFzc2VydCAvLyBJbnZhbGlkIHBheW1lbnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL29wdGluL2NvbnRyYWN0LmFsZ28udHM6MjAKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhc3NldHMubGVuZ3RoOyBpKyspIHsKICAgIGludGNfMSAvLyAwCgpvcHRJbl93aGlsZV90b3BAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL29wdGluL2NvbnRyYWN0LmFsZ28udHM6MjAKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhc3NldHMubGVuZ3RoOyBpKyspIHsKICAgIGR1cAogICAgZGlnIDMKICAgIDwKICAgIGJ6IG9wdEluX2FmdGVyX3doaWxlQDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL29wdGluL2NvbnRyYWN0LmFsZ28udHM6MjEKICAgIC8vIGFzc2VydCghc2VuZGVyLmlzT3B0ZWRJbihBc3NldChhc3NldHNbaV0pKSwgRVJSX0FMUkVBRFlfT1BURURfSU4pCiAgICBkaWcgMwogICAgZXh0cmFjdCAyIDAKICAgIGRpZyAxCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGludGNfMiAvLyA4CiAgICAqCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZHVwCiAgICBidXJ5IDkKICAgIGRpZyAzCiAgICBzd2FwCiAgICBhc3NldF9ob2xkaW5nX2dldCBBc3NldEJhbGFuY2UKICAgIGJ1cnkgMQogICAgIQogICAgYXNzZXJ0IC8vIGFscmVhZHkgb3B0ZWQgaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL29wdGluL2NvbnRyYWN0LmFsZ28udHM6MjMtMzEKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIHNlbmRlciwKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBzZW5kZXIsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IDAsCiAgICAvLyAgICAgeGZlckFzc2V0OiBBc3NldChhc3NldHNbaV0pLAogICAgLy8gICAgIHJla2V5VG86IGkgPCAoYXNzZXRzLmxlbmd0aCAtIDEpID8gR2xvYmFsLnplcm9BZGRyZXNzIDogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9vcHRpbi9jb250cmFjdC5hbGdvLnRzOjI5CiAgICAvLyByZWtleVRvOiBpIDwgKGFzc2V0cy5sZW5ndGggLSAxKSA/IEdsb2JhbC56ZXJvQWRkcmVzcyA6IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIGRpZyAzCiAgICBpbnRjXzAgLy8gMQogICAgLQogICAgPAogICAgYnogb3B0SW5fdGVybmFyeV9mYWxzZUA1CiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKCm9wdEluX3Rlcm5hcnlfbWVyZ2VANjoKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgZGlnIDYKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9vcHRpbi9jb250cmFjdC5hbGdvLnRzOjI3CiAgICAvLyBhc3NldEFtb3VudDogMCwKICAgIGludGNfMSAvLyAwCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBkaWcgMQogICAgZHVwCiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9vcHRpbi9jb250cmFjdC5hbGdvLnRzOjIzLTMwCiAgICAvLyBpdHhuCiAgICAvLyAgIC5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBzZW5kZXIsCiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogc2VuZGVyLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiAwLAogICAgLy8gICAgIHhmZXJBc3NldDogQXNzZXQoYXNzZXRzW2ldKSwKICAgIC8vICAgICByZWtleVRvOiBpIDwgKGFzc2V0cy5sZW5ndGggLSAxKSA/IEdsb2JhbC56ZXJvQWRkcmVzcyA6IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vICAgfSkKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL29wdGluL2NvbnRyYWN0LmFsZ28udHM6MjMtMzEKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIHNlbmRlciwKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBzZW5kZXIsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IDAsCiAgICAvLyAgICAgeGZlckFzc2V0OiBBc3NldChhc3NldHNbaV0pLAogICAgLy8gICAgIHJla2V5VG86IGkgPCAoYXNzZXRzLmxlbmd0aCAtIDEpID8gR2xvYmFsLnplcm9BZGRyZXNzIDogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvb3B0aW4vY29udHJhY3QuYWxnby50czoyMAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFzc2V0cy5sZW5ndGg7IGkrKykgewogICAgZHVwCiAgICBpbnRjXzAgLy8gMQogICAgKwogICAgYnVyeSAxCiAgICBiIG9wdEluX3doaWxlX3RvcEAyCgpvcHRJbl90ZXJuYXJ5X2ZhbHNlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjMyMgogICAgLy8gaWYgKCFyZWtleUJhY2spIHsKICAgIGRpZyA0CiAgICBibnogb3B0SW5fYWZ0ZXJfaWZfZWxzZUAxMQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozMjMKICAgIC8vIHJldHVybiBHbG9iYWwuemVyb0FkZHJlc3MKICAgIGdsb2JhbCBaZXJvQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvb3B0aW4vY29udHJhY3QuYWxnby50czoyOQogICAgLy8gcmVrZXlUbzogaSA8IChhc3NldHMubGVuZ3RoIC0gMSkgPyBHbG9iYWwuemVyb0FkZHJlc3MgOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICBiIG9wdEluX3Rlcm5hcnlfbWVyZ2VANgoKb3B0SW5fYWZ0ZXJfaWZfZWxzZUAxMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzI2CiAgICAvLyByZXR1cm4gd2FsbGV0LmFkZHJlc3MKICAgIGRpZyA1CiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9vcHRpbi9jb250cmFjdC5hbGdvLnRzOjI5CiAgICAvLyByZWtleVRvOiBpIDwgKGFzc2V0cy5sZW5ndGggLSAxKSA/IEdsb2JhbC56ZXJvQWRkcmVzcyA6IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIGIgb3B0SW5fdGVybmFyeV9tZXJnZUA2CgpvcHRJbl9hZnRlcl93aGlsZUA4OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvb3B0aW4vY29udHJhY3QuYWxnby50czo4CiAgICAvLyBvcHRJbih3YWxsZXQ6IEFwcGxpY2F0aW9uLCByZWtleUJhY2s6IGJvb2xlYW4sIGFzc2V0czogdWludDY0W10sIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4bik6IHZvaWQgewogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyADAQAIMRtBABiABGg147w2GgCOAQABADEZFDEYEERCAAgxGRQxGBQQQ4AANhoBSRUkEkQXSTYaAkkVIhJEI1NMNhoDSU4CSSNZSU4DSSQLgQIITwIVEkQxFiIJSTgQIhJETwKAEHNwZW5kaW5nX2FkZHJlc3NlSElOA0sBOAcSTDgIMhBPAwsSEEQjSUsDDEEAVksDVwIASwFJTgIkC1tJRQlLA0xwAEUBFESxSwMiCQxBACIyA7IgSwayESOyEksBSbIUsgCBBLIQI7IBs0kiCEUBQv+1SwRAAAUyA0L/1ksFcghEQv/OIkM=", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the OptInPlugin smart contract
 */
class OptInPluginParamsFactory {
    /**
     * Constructs a no op call for the optIn(uint64,bool,uint64[],pay)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static optIn(params) {
        return {
            ...params,
            method: 'optIn(uint64,bool,uint64[],pay)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.assets, params.args.mbrPayment],
        };
    }
}
exports.OptInPluginParamsFactory = OptInPluginParamsFactory;
/**
 * A factory to create and deploy one or more instance of the OptInPlugin smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class OptInPluginFactory {
    /**
     * Creates a new instance of `OptInPluginFactory`
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
                 * Creates a new instance of the OptInPlugin smart contract using a bare call.
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
                 * Creates a new instance of the OptInPlugin smart contract using a bare call.
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
                 * Creates a new instance of the OptInPlugin smart contract using a bare call.
                 *
                 * @param params The params for the bare (raw) call
                 * @returns The create result
                 */
                bare: async (params) => {
                    const result = await this.appFactory.send.bare.create(params);
                    return { result: result.result, appClient: new OptInPluginClient(result.appClient) };
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
        return new OptInPluginClient(this.appFactory.getAppClientById(params));
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
        return new OptInPluginClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the OptInPlugin smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
        });
        return { result: result.result, appClient: new OptInPluginClient(result.appClient) };
    }
}
exports.OptInPluginFactory = OptInPluginFactory;
/**
 * A client to make calls to the OptInPlugin smart contract
 */
class OptInPluginClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the OptInPlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the OptInPlugin smart contract using the `optIn(uint64,bool,uint64[],pay)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            optIn: (params) => {
                return this.appClient.params.call(OptInPluginParamsFactory.optIn(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the OptInPlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the OptInPlugin smart contract using the `optIn(uint64,bool,uint64[],pay)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            optIn: (params) => {
                return this.appClient.createTransaction.call(OptInPluginParamsFactory.optIn(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the OptInPlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the OptInPlugin smart contract using the `optIn(uint64,bool,uint64[],pay)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            optIn: async (params) => {
                const result = await this.appClient.send.call(OptInPluginParamsFactory.optIn(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current OptInPlugin app
         */
        this.state = {};
        this.appClient = appClientOrParams instanceof app_client_1.AppClient ? appClientOrParams : new app_client_1.AppClient({
            ...appClientOrParams,
            appSpec: exports.APP_SPEC,
        });
    }
    /**
     * Returns a new `OptInPluginClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new OptInPluginClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `OptInPluginClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new OptInPluginClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
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
        return new OptInPluginClient(this.appClient.clone(params));
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a optIn(uint64,bool,uint64[],pay)void method call against the OptInPlugin contract
             */
            optIn(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.optIn(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a clear state call to the OptInPlugin contract
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
exports.OptInPluginClient = OptInPluginClient;
//# sourceMappingURL=OptInPluginClient.js.map