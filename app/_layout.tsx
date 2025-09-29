import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { View } from "react-native";
import ToastManager from "toastify-react-native";

export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>

        {/* ToastManager must be at the root */}
      </View>
      <ToastManager duration={3000} position="top" animationStyle="slide" />
    </QueryClientProvider>
  );
}
