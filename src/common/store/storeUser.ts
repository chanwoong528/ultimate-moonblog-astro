//@ts-nocheck

import { persistentMap } from "@nanostores/persistent";

/**
 * @typedef {Object} userInfo
 * @property {string} id
 * @property {string} loginType
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {Date} createdDate
 * @property {Date} updatedDate
 * @property {Boolean} verified
 * @property {Boolean} marketingConsent
 * @property {Boolean} privacyConsent
 */
export const userInfo = persistentMap("userInfo:", {
  id: "",
  loginType: "",
  name: "",
  email: "",
  role: "",
  createdDate: "",
  updatedDate: "",
  verified: "",
  marketingConsent: "",
  privacyConsent: "",
});
export const patchUserInfo = (newUserInfo) => {

  const existingEntry = !!userInfo.get().id;
  if (existingEntry) {
    userInfo.set({ ...userInfo, ...newUserInfo });
    console.log(userInfo.get());
  } else {
    userInfo.set({ ...newUserInfo });
    console.log(userInfo.get());
  }
};
