import "react-native-get-random-values";
import { getOrCreateGuestId } from "@/utility/guestUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ToastManager from "toastify-react-native";
import "./global.css";

export default function RootLayout() {
  const queryClient = new QueryClient();

  useEffect(() => {
    const setupGuestId = async () => {
      await getOrCreateGuestId();
    };
    setupGuestId();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </View>
        {/* ToastManager must be at the root */}
      </SafeAreaProvider>
      <ToastManager duration={3000} position="top" animationStyle="slide" />
    </QueryClientProvider>
  );
}
