//@ts-nocheck
import axios from "axios";

import { BASE_API_URL } from "../common/utils/constant/META";

const http = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export default http;
