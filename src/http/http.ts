//@ts-nocheck
import axios from "axios";
import Cookies from "universal-cookie";

import { resetUserInfo } from "../common/store/storeUser";

import { BASE_API_URL } from "../common/utils/constant/META";

const http = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const cookies = new Cookies(null, { path: "/" });
http.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 498) {
      //Token expired error code
      try {
        const refresh_token = cookies.get("refresh_token");
        const res = await axios.post(`${BASE_API_URL}/api/auth/token`, {
          refresh_token,
        });
        cookies.set("access_token", res.data.data.newAccessToken);
        return axios(originalRequest);
      } catch (error) {
        //If refresh fail, then logout user;
        cookies.remove("access_token");
        cookies.remove("refresh_token");
        resetUserInfo();
      }
    } else {
      //invalid Error -> logout user
      cookies.remove("access_token");
      cookies.remove("refresh_token");
      resetUserInfo();
    }
    return Promise.reject(error);
  }
);

export default http;
