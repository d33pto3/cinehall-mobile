import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

// TODO: move to .env
const API_BASE_URL = "http://10.15.5.153:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token from AsyncStorage (before every request)
api.interceptors.request.use(async (config) => {
  const storedData = await AsyncStorage.getItem("auth-storage");
  if (storedData) {
    const parsed = JSON.parse(storedData);
    const token = parsed?.state?.user?.token; // adjust based on your store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// TODO: Interceptors for auth tokens, logging, etc
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      const AsyncStorage = await import(
        "@react-native-async-storage/async-storage"
      );
      await AsyncStorage.default.removeItem("auth-storage");
      await AsyncStorage.default.removeItem("user");

      // Redirect to login (only works if router is available)
      try {
        router.replace("/(auth)/login");
      } catch (e) {
        // Router not available yet
      }
    }
    return Promise.reject(error);
  }
);

export default api;
