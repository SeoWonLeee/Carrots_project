import axios from "axios";

const sellingProductsApiClient = axios.create({
  baseURL: "http://localhost:8080/transaction",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default sellingProductsApiClient;
