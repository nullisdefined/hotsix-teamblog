import axios from "axios";
import { getCookie } from "../utils/cookies";

const isProduction = process.env.NODE_ENV === "production";
const baseURL = isProduction
  ? "/api" // 프로덕션에서는 같은 도메인의 /api로 요청
  : `http://${window.location.hostname}:3001/api`;
const axiosInstance = axios.create({
  baseURL: baseURL,
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized, logging out...");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
