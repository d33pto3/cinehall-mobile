import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ToastManager from "toastify-react-native";

import { getOrCreateGuestId } from "@/utility/guestUtils";
import { useEffect } from "react";
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
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>

        {/* ToastManager must be at the root */}
      </SafeAreaView>
      <ToastManager duration={3000} position="top" animationStyle="slide" />
    </QueryClientProvider>
  );
}
