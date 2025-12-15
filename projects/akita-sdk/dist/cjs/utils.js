"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToUnixTimestamp = convertToUnixTimestamp;
exports.convertFromUnixTimestamp = convertFromUnixTimestamp;
function convertToUnixTimestamp(timestamp) {
    return timestamp * 1000n;
}
function convertFromUnixTimestamp(timestamp) {
    return timestamp / 1000n;
}
//# sourceMappingURL=utils.js.map