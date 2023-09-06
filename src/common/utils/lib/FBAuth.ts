//@ts-nocheck

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { FB_API_CONFIG } from "../constant/META";
import { snsSignInUser } from "../../../http/auth/ApiUser";

const app = initializeApp(FB_API_CONFIG);
const analytics = getAnalytics(app);
const authService = getAuth();

export const snsLoginGithub = async () => {
  const provider = new GithubAuthProvider();
  try {
    const snsResult = await signInWithPopup(authService, provider);
    let userBody = {
      loginType: snsResult.providerId,
      email: snsResult.user.email,
      pw: "",
      name: snsResult.user.displayName,
      snsLoginId: snsResult.user.uid,
    };
    const postSNSUser = await snsSignInUser(userBody);
    console.log(postSNSUser);
  } catch (error) {}
};

export const snsLoginGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const snsResult = await signInWithPopup(authService, provider);
    let userBody = {
      loginType: snsResult.providerId,
      email: snsResult.user.email,
      pw: "",
      name: snsResult.user.displayName,
      snsLoginId: snsResult.user.uid,
    };
    const postSNSUser = await snsSignInUser(userBody);
  } catch (error) {}
};

// export const snsLoginGoogle = async () => {};
