"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingType = void 0;
/** Staking type enum matching contract values */
var StakingType;
(function (StakingType) {
    StakingType[StakingType["Heartbeat"] = 10] = "Heartbeat";
    StakingType[StakingType["Soft"] = 20] = "Soft";
    StakingType[StakingType["Hard"] = 30] = "Hard";
    StakingType[StakingType["Lock"] = 40] = "Lock";
})(StakingType || (exports.StakingType = StakingType = {}));
//# sourceMappingURL=types.js.map