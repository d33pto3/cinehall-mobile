import { ENDPOINTS } from "@/api/endpoints";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Payment() {
  const { getBookingSummary, isBookingComplete, resetBooking } =
    useBookingStore();

  const { isLoggedIn, user } = useAuthStore();

  const bookingSummary = getBookingSummary();

  // Redirect if booking is incomplete
  useEffect(() => {
    if (!isBookingComplete()) {
      Alert.alert(
        "Incomplete Booking",
        "Please complete your seat selection first.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/"),
          },
        ]
      );
    }
  }, [isBookingComplete]);

  if (!bookingSummary) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-600">Loading booking details...</Text>
      </View>
    );
  }

  const handleConfirmBooking = async () => {
    if (!isLoggedIn) {
      router.replace("/(auth)/login");
      return;
    }
    try {
      const payload = {
        userId: user?._id,
        showId: bookingSummary.showId,
        screenId: bookingSummary.screenId,
        movieId: bookingSummary.movie._id,
        seats: bookingSummary.seats.map((s) => s._id),
        totalPrice: bookingSummary.totalSeats * 400,
        paymentMethod: "card",
      };

      const response = await api.post(ENDPOINTS.CREATE_BOOKING, payload);

      console.log("response-----", response);

      // TODO: Call your payment/booking API here
      // await bookSeats(bookingSummary.showId, bookingSummary.seats.map(s => s._id), userId);

      Alert.alert("Success", "Booking confirmed!", [
        {
          text: "OK",
          onPress: () => {
            // resetBooking();
            // router.replace("/");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to confirm booking. Please try again.");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-white px-4 pt-6 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Booking Summary
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Review your booking details
        </Text>
      </View>

      {/* Movie Info */}
      <View className="bg-white mt-2 p-4">
        <View className="flex-row">
          <Image
            source={{ uri: bookingSummary.movie.imageUrl }}
            className="w-24 h-36 rounded-lg"
            resizeMode="cover"
          />
          <View className="flex-1 ml-4">
            <Text className="text-xl font-bold text-gray-900">
              {bookingSummary.movie.title}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              {bookingSummary.movie.genre}
            </Text>
            <Text className="text-sm text-gray-600">
              {bookingSummary.movie.duration} minutes
            </Text>
          </View>
        </View>
      </View>

      {/* Booking Details */}
      <View className="bg-white mt-2 p-4">
        <Text className="text-lg font-bold text-gray-900 mb-4">
          Show Details
        </Text>

        <View className="space-y-3">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Date</Text>
            <Text className="font-semibold text-gray-900">
              {formatDate(bookingSummary.date)}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Time Slot</Text>
            <Text className="font-semibold text-gray-900">
              {bookingSummary.slot}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Screen</Text>
            <Text className="font-semibold text-gray-900">
              {bookingSummary.screenId}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Seats</Text>
            <Text className="font-semibold text-gray-900">
              {bookingSummary.seatNumbers}
            </Text>
          </View>

          <View className="border-t border-gray-200 pt-3 mt-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Total Seats</Text>
              <Text className="font-bold text-lg text-gray-900">
                {bookingSummary.totalSeats}{" "}
                {bookingSummary.totalSeats === 1 ? "Seat" : "Seats"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="p-4 space-y-3">
        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-xl items-center shadow-sm"
          onPress={handleConfirmBooking}
        >
          <Text className="text-white text-base font-bold">Confirm & Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-200 py-4 rounded-xl items-center"
          onPress={() => router.back()}
        >
          <Text className="text-gray-700 text-base font-semibold">
            Back to Seats
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
