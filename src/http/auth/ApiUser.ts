//@ts-nocheck
import http from "../http";

export const snsSignInUser = async (snsUserInfo) => {
  try {
    const postUser = await http.post("/api/auth", { ...snsUserInfo }, {});
    const postUserData = await postUser.data;
    return postUserData;
  } catch (error) {
    console.error("snsSignInUser[error]: ", error);
  }
};
export const snsWebAgreement = async (snsUserInfo) => {
  try {
    const patchUser = await http.patch(
      `/certi/user/${snsUserInfo.id}`,
      { ...snsUserInfo, verified: "Y", active: "Y" },
      {}
    );
    const patchUserData = await patchUser.data;
    return patchUserData;
  } catch (error) {
    console.error("snsWebAgreement[error]: ", error);
  }
};
export const checkLoginUser = async () => {
  try {
    const getToken = await http.get("/api/auth");
    const getTokenData = await getToken.data;
  } catch (error) {
    console.error("checkLoginUser[error]: ", error);
  }
};
export const getLikesUserId = async (userId, contentType) => {
  try {
    const getUserLikes = await http.get("/");
  } catch (error) {
    console.error("getLikesUserId[error]: ", error);
  }
};
