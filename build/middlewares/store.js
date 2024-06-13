"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTempStorage = exports.setTempStorage = void 0;
let tempStore = {};
function setTempStorage(sessionID, facebookProfile) {
    return tempStore[sessionID] = facebookProfile;
}
exports.setTempStorage = setTempStorage;
function getTempStorage(sessionID) {
    const facebookProfile = tempStore[sessionID];
    //   delete tempStore[sessionID]; // remove the temporary storage
    return facebookProfile;
}
exports.getTempStorage = getTempStorage;
