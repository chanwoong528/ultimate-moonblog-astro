//@ts-nocheck
import http from "../http";

export const snsSignInUser = async (snsUserInfo) => {
  try {
    console.log("!!!!!!!!!!!!!", snsUserInfo);
    const postUser = await http.post("/api/user", { ...snsUserInfo }, {});
    const postUserData = await postUser.data;
    console.log("postUserData : ", postUserData);
    return postUserData;
  } catch (error) {
    console.error("snsSignInUser[error]: ", error);
  }
};
