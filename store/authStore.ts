import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  getUser as getUserService,
  login as loginService,
  logout as logoutService,
  register as registerService,
} from "../services/authServices";

interface User {
  _id: string;
  email: string;
  username: string;
  role: string;
  phone?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: true,

      login: async (email, password) => {
        try {
          set({ isLoading: true });
          const userData = await loginService(email, password);
          set({ user: userData, isLoggedIn: true, isLoading: false });
        } catch (error) {
          set({ user: null, isLoggedIn: false, isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, username: string) => {
        try {
          set({ isLoading: true });
          const userData = await registerService(email, password, username);
          set({ user: userData, isLoggedIn: true, isLoading: false });
        } catch (error) {
          set({ user: null, isLoggedIn: false, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await logoutService();
        } catch (error) {
          console.error("Logout API error:", error);
          // Continue with local cleanup even if API fails
        } finally {
          set({ user: null, isLoggedIn: false });
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });

          // Since you're using httpOnly cookies, just try to fetch user
          // If it fails with 401, the interceptor will handle cleanup
          const userData = await getUserService();

          set({ user: userData, isLoggedIn: true, isLoading: false });
        } catch (error: any) {
          // If 401, interceptor already cleared storage
          // For other errors, also clear state
          set({ user: null, isLoggedIn: false, isLoading: false });
        }
      },

      setUser: (user) => {
        set({ user, isLoggedIn: true, isLoading: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist user data, not loading states
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
