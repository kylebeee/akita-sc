"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitDistributionType = void 0;
exports.SplitsToTuples = SplitsToTuples;
// [[bigint | number, string], bigint | number, bigint | number][]
var SplitDistributionType;
(function (SplitDistributionType) {
    SplitDistributionType[SplitDistributionType["Flat"] = 10] = "Flat";
    SplitDistributionType[SplitDistributionType["Percentage"] = 20] = "Percentage";
    SplitDistributionType[SplitDistributionType["Remainder"] = 30] = "Remainder";
})(SplitDistributionType || (exports.SplitDistributionType = SplitDistributionType = {}));
function SplitsToTuples(splits) {
    return splits.map((split) => [[split.receiver.wallet, split.receiver.escrow], split.type, split.value]);
}
//# sourceMappingURL=types.js.map