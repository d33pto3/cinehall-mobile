import { useAuthStore } from "@/store/authStore";
import { router, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

/**
 * Auth Provider - Checks authentication status on app load
 * Place this in your _layout.tsx or root component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading, checkAuth } = useAuthStore();
  const segments = useSegments();

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Redirect based on auth status
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/(auth)/login");
    } else if (isLoggedIn && inAuthGroup) {
      // Redirect to home if already authenticated
      router.replace("/");
    }
  }, [isLoggedIn, isLoading, segments]);

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return <>{children}</>;
}
