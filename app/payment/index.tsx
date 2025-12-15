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
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-600">Initializing Payment...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center">
      <Text className="text-gray-700 text-center px-4 mb-5 text-lg">
        {paymentUrl
          ? "Redirecting you to the payment gateway..."
          : "Failed to load payment page."}
      </Text>

      {paymentUrl && (
        <TouchableOpacity
          onPress={() => Linking.openURL(paymentUrl)}
          className="mt-4 bg-orange-500 p-3 rounded"
        >
          <Text className="text-white font-bold">Pay Now</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => router.replace("/")}
        className="mt-4 bg-gray-200 p-3 rounded"
      >
        <Text>Go Back Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
