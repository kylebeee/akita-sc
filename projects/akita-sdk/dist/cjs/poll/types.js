"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VOTES_MBR = exports.PollTypeEnum = void 0;
// Poll type constants
var PollTypeEnum;
(function (PollTypeEnum) {
    PollTypeEnum[PollTypeEnum["SingleChoice"] = 10] = "SingleChoice";
    PollTypeEnum[PollTypeEnum["MultipleChoice"] = 20] = "MultipleChoice";
    PollTypeEnum[PollTypeEnum["SingleChoiceImpact"] = 30] = "SingleChoiceImpact";
    PollTypeEnum[PollTypeEnum["MultipleChoiceImpact"] = 40] = "MultipleChoiceImpact";
})(PollTypeEnum || (exports.PollTypeEnum = PollTypeEnum = {}));
// MBR constant for votes box
exports.VOTES_MBR = 15300n;
//# sourceMappingURL=types.js.map