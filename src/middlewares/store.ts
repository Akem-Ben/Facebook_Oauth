let tempStore:any = {};

export function setTempStorage(sessionID:any, facebookProfile:any) {
  return tempStore[sessionID] = facebookProfile;
}

export function getTempStorage(sessionID:any) {
  const facebookProfile = tempStore[sessionID];
  delete tempStore[sessionID]; // remove the temporary storage
  return facebookProfile;
}