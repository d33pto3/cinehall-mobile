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
