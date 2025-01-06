import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/users", // 백엔드 기본 URL
  withCredentials: true, // 세션 쿠키 포함
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
