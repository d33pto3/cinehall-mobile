import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export async function login(email: string, password: string) {
  const response = await api.post("/auth/login/email", { email, password });

  const { user } = response.data;

  // Note: token is now stored in cookies by backend, not manually
  if (user) {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  }

  return user;
}

export async function register(
  email: string,
  password: string,
  username: string
) {
  const response = await api.post("/auth/register", {
    email,
    password,
    username,
  });
  return response.data.user; // make sure backend returns { user }
}

export async function logout() {
  try {
    // Call backend logout to clear cookie
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear local storage regardless
    await AsyncStorage.removeItem("user");
  }
}

export async function getStoreToken() {
  return AsyncStorage.getItem("token");
}

export async function getStoredUser() {
  const userString = await AsyncStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
}

export async function getUser() {
  const response = await api.get("/auth/user");
  return response.data;
}
