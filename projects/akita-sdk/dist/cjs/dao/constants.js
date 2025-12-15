"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAOProposalVotesMBR = exports.EMPTY_CID = exports.ProposalActionEnum = void 0;
var ProposalActionEnum;
(function (ProposalActionEnum) {
    ProposalActionEnum[ProposalActionEnum["UpgradeApp"] = 10] = "UpgradeApp";
    ProposalActionEnum[ProposalActionEnum["AddPlugin"] = 20] = "AddPlugin";
    ProposalActionEnum[ProposalActionEnum["AddNamedPlugin"] = 21] = "AddNamedPlugin";
    ProposalActionEnum[ProposalActionEnum["ExecutePlugin"] = 30] = "ExecutePlugin";
    ProposalActionEnum[ProposalActionEnum["RemoveExecutePlugin"] = 31] = "RemoveExecutePlugin";
    ProposalActionEnum[ProposalActionEnum["RemovePlugin"] = 40] = "RemovePlugin";
    ProposalActionEnum[ProposalActionEnum["RemoveNamedPlugin"] = 41] = "RemoveNamedPlugin";
    ProposalActionEnum[ProposalActionEnum["AddAllowances"] = 50] = "AddAllowances";
    ProposalActionEnum[ProposalActionEnum["RemoveAllowances"] = 60] = "RemoveAllowances";
    ProposalActionEnum[ProposalActionEnum["NewEscrow"] = 70] = "NewEscrow";
    ProposalActionEnum[ProposalActionEnum["ToggleEscrowLock"] = 71] = "ToggleEscrowLock";
    ProposalActionEnum[ProposalActionEnum["UpdateFields"] = 80] = "UpdateFields";
})(ProposalActionEnum || (exports.ProposalActionEnum = ProposalActionEnum = {}));
exports.EMPTY_CID = Buffer.from('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
exports.DAOProposalVotesMBR = 22500n;
//# sourceMappingURL=constants.js.map