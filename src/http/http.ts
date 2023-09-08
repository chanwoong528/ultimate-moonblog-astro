//@ts-nocheck
import axios from "axios";

import { BASE_API_URL } from "../common/utils/constant/META";
import { AstroCookies } from "astro";

const http = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
http.interceptors.request.use((config) => {
  let token = localStorage.getItem("userInfo:accessToken");
  config.headers["x-access-token"] = token;
  return config;
});

http.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log("customAxios[error]: ", error.response);
    if (error.response.status === 408) {
      // const refToken = localStorage.getItem("refToken");
      // const refToken = AstroCookies
      const res = await axios.post(`${BASE_API_URL}/user/token`, {
        refToken,
      });
      localStorage.setItem("accToken", res.data.accToken);
      originalRequest.headers["x-access-token"] = res.data.accToken;
      http.defaults.headers.common["x-access-token"] = res.data.accToken;
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);
export default http;
