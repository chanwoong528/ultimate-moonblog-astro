//@ts-nocheck
import http from "../http";

export const snsSignInUser = async (snsUserInfo) => {
  try {
    const postUser = await http.post("/api/user", { ...snsUserInfo }, {});
    const postUserData = await postUser.data;
    return postUserData;
  } catch (error) {
    console.error("snsSignInUser[error]: ", error);
  }
};
export const snsWebAgreement = async (snsUserInfo) => {
  console.log(snsUserInfo)
  try {
    const patchUser = await http.patch("/api/user", { ...snsUserInfo }, {});
    const patchUserData = await patchUser.data;
    return patchUserData;
  } catch (error) {
    console.error("snsSignInUser[error]: ", error);
  }
};
