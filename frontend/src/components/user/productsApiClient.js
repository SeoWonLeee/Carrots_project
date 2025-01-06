import axios from "axios";

const productsApiClient = axios.create({
  baseURL: "http://localhost:8080/products", // products 관련 API의 기본 URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default productsApiClient;
