import axios from "axios";

// TODO: move to .env
const API_BASE_URL = "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// TODO: Interceptors for auth tokens, logging, etc

export default api;
