export var PoolStatus;
(function (PoolStatus) {
    PoolStatus[PoolStatus["Draft"] = 0] = "Draft";
    PoolStatus[PoolStatus["Final"] = 10] = "Final";
})(PoolStatus || (PoolStatus = {}));
export var StakingPoolStakingType;
(function (StakingPoolStakingType) {
    StakingPoolStakingType[StakingPoolStakingType["NONE"] = 0] = "NONE";
    StakingPoolStakingType[StakingPoolStakingType["HEARTBEAT"] = 10] = "HEARTBEAT";
    StakingPoolStakingType[StakingPoolStakingType["SOFT"] = 20] = "SOFT";
    StakingPoolStakingType[StakingPoolStakingType["HARD"] = 30] = "HARD";
    StakingPoolStakingType[StakingPoolStakingType["LOCK"] = 40] = "LOCK";
})(StakingPoolStakingType || (StakingPoolStakingType = {}));
export var DistributionType;
(function (DistributionType) {
    DistributionType[DistributionType["Percentage"] = 10] = "Percentage";
    DistributionType[DistributionType["Flat"] = 20] = "Flat";
    DistributionType[DistributionType["Even"] = 30] = "Even";
    DistributionType[DistributionType["Shuffle"] = 40] = "Shuffle";
})(DistributionType || (DistributionType = {}));
export var DisbursementPhase;
(function (DisbursementPhase) {
    DisbursementPhase[DisbursementPhase["Idle"] = 0] = "Idle";
    DisbursementPhase[DisbursementPhase["Preparation"] = 10] = "Preparation";
    DisbursementPhase[DisbursementPhase["Allocation"] = 20] = "Allocation";
    DisbursementPhase[DisbursementPhase["Finalization"] = 30] = "Finalization";
})(DisbursementPhase || (DisbursementPhase = {}));
//# sourceMappingURL=types.js.map