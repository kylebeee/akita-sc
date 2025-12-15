export var Operator;
(function (Operator) {
    Operator[Operator["Equal"] = 10] = "Equal";
    Operator[Operator["NotEqual"] = 20] = "NotEqual";
    Operator[Operator["LessThan"] = 30] = "LessThan";
    Operator[Operator["LessThanOrEqualTo"] = 40] = "LessThanOrEqualTo";
    Operator[Operator["GreaterThan"] = 50] = "GreaterThan";
    Operator[Operator["GreaterThanOrEqualTo"] = 60] = "GreaterThanOrEqualTo";
    Operator[Operator["IncludedIn"] = 70] = "IncludedIn";
    Operator[Operator["IncludedInRoot"] = 80] = "IncludedInRoot";
    Operator[Operator["NotIncludedIn"] = 90] = "NotIncludedIn";
})(Operator || (Operator = {}));
export var LogicalOperator;
(function (LogicalOperator) {
    LogicalOperator[LogicalOperator["None"] = 0] = "None";
    LogicalOperator[LogicalOperator["And"] = 10] = "And";
    LogicalOperator[LogicalOperator["Or"] = 20] = "Or";
})(LogicalOperator || (LogicalOperator = {}));
// export type GateFilter = {
//   layer: uint64 // the comparison nesting level
//   app: uint64 // the app id of the gate to use
//   logicalOperator: LogicalOperator // the logical operator to apply between this gate filter and the next
// }
//# sourceMappingURL=types.js.map