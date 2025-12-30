import { initiatePayment } from "@/api/booking";
import { useBookingStore } from "@/store/bookingStore";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Toast } from "toastify-react-native";

export default function Payment() {
  const { bookingId } = useLocalSearchParams();
  const { resetBooking } = useBookingStore();
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle deep links
  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      if (url.includes("/payment/success")) {
        resetBooking();
        Toast.success("Payment Successful! Your seats are booked.");
        setTimeout(() => router.replace("/"), 2000);
      } else if (url.includes("/payment/fail")) {
        Toast.error("Payment Failed. Please try again.");
        setTimeout(() => router.back(), 2000);
      } else if (url.includes("/payment/cancel")) {
        Toast.error("Payment Cancelled.");
        setTimeout(() => router.back(), 2000);
      }
    };

    const subscription = Linking.addEventListener("url", handleUrl);
    return () => subscription.remove();
  }, []);

  // Fetch Payment URL from backend
  useEffect(() => {
    const fetchPaymentUrl = async () => {
      try {
        if (!bookingId) {
          Toast.error("No booking ID found");
          router.replace("/");
          return;
        }

        const redirects = {
          success: Linking.createURL("payment/success"),
          fail: Linking.createURL("payment/fail"),
          cancel: Linking.createURL("payment/cancel"),
        };

        const data = await initiatePayment(bookingId as string, redirects);
        if (data?.success && data?.url) {
          setPaymentUrl(data.url);

          // Open system browser
          const supported = await Linking.canOpenURL(data.url);
          if (supported) {
            await Linking.openURL(data.url);
          } else {
            Toast.error("Cannot open payment page.");
          }
        } else {
          Toast.error("Failed to initiate payment");
          router.back();
        }
      } catch (error) {
        // Toast.error("Something went wrong while initiating payment");
        // router.back();
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentUrl();
  }, [bookingId]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#FAAA47" />
        <Text className="mt-8 text-muted font-black italic uppercase tracking-widest text-sm">
          Securing the gateway...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center p-8">
      <View className="items-center mb-10">
        <Text className="text-3xl font-black text-white italic uppercase text-center mb-4">
          Almost There
        </Text>
        <Text className="text-muted text-center text-lg">
          {paymentUrl
            ? "Redirecting you to the secure payment gateway..."
            : "Failed to load payment page."}
        </Text>
      </View>

      {paymentUrl && (
        <TouchableOpacity
          onPress={() => Linking.openURL(paymentUrl)}
          className="w-full bg-primary py-5 rounded-2xl items-center shadow-xl shadow-primary/30 mb-4"
        >
          <Text className="text-black font-black uppercase text-lg tracking-widest">
            Pay Now
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => router.replace("/")}
        className="w-full bg-neutral-800 py-5 rounded-2xl items-center"
      >
        <Text className="text-white font-bold uppercase tracking-widest text-sm opacity-60">
          Go Back Home
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
