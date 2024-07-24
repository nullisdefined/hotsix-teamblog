import axios from "axios";
import { getCookie } from "../utils/cookies";

// DEV PRODUCTION MODE 설정 필요
const axiosInstance = axios.create({
  baseURL: `http://${window.location.hostname}:${import.meta.env.VITE_APP_PORT}/api`,
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
