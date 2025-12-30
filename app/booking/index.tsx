import { ENDPOINTS } from "@/api/endpoints";
import { createBooking } from "@/api/booking";
import { getOrCreateGuestId } from "@/utility/guestUtils";
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
import { Toast } from "toastify-react-native";

export default function Booking() {
  const { getBookingSummary, isBookingComplete } = useBookingStore();
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
      Alert.alert(
        "Sign In Required",
        "You need to be logged in to confirm your booking.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign In",
            onPress: () => {
              // Optionally pass a redirect param if your login flow supports it
              router.push("/(auth)/login");
            },
          },
        ]
      );
      return;
    }
    await processBooking();
  };

  const processBooking = async () => {
    try {
      const guestId = await getOrCreateGuestId();
      // Refetch user from store as it might be updated
      const currentUser = useAuthStore.getState().user; 

      const payload = {
        userId: currentUser?._id,
        guestId, // Keep guestId for reference or backend fallback logic if needed
        showId: bookingSummary.showId,
        screenId: bookingSummary.screenId,
        movieId: bookingSummary.movie._id,
        seats: bookingSummary.seats.map((s) => s._id),
        totalPrice: bookingSummary.totalSeats * 400,
        paymentMethod: "card",
      };
      
      const bookingData = await createBooking(payload);

      if (bookingData?.success && bookingData?.data?._id) {
        router.replace({
          pathname: "/payment",
          params: { bookingId: bookingData.data._id },
        });
      } else {
         Toast.error("Failed to create booking. Please try again.");
      }

    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to confirm booking.";
      Toast.error(msg);
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
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
       <View className="bg-[#1A1A1A] px-6 pt-12 pb-6 border-b border-border/50">
        <Text className="text-3xl font-black text-white italic">
          SUMMARY
        </Text>
        <Text className="text-muted text-xs uppercase font-bold tracking-widest mt-1">
          Review your cinematic experience
        </Text>
      </View>

      {/* Movie Info */}
      <View className="bg-card mt-2 p-6 border-y border-border/50">
        <View className="flex-row">
          <Image
            source={{ uri: bookingSummary.movie.imageUrl }}
            className="w-24 h-36 rounded-2xl border border-border"
            resizeMode="cover"
          />
          <View className="flex-1 ml-5 justify-center">
            <Text className="text-2xl font-black text-white italic uppercase">
              {bookingSummary.movie.title}
            </Text>
            <Text className="text-primary font-bold mt-1">
              {bookingSummary.movie.genre}
            </Text>
            <Text className="text-muted text-xs mt-1 font-medium">
              {bookingSummary.movie.duration} MINUTES
            </Text>
          </View>
        </View>
      </View>

      {/* Booking Details */}
      <View className="bg-card mt-2 p-6 border-y border-border/50">
        <Text className="text-lg font-black text-white italic mb-6 uppercase tracking-widest">
          Show Details
        </Text>

        <View className="gap-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-muted font-bold uppercase text-[10px]">Date</Text>
            <Text className="font-bold text-white">
              {formatDate(bookingSummary.date)}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-muted font-bold uppercase text-[10px]">Time Slot</Text>
            <Text className="font-bold text-primary">
              {bookingSummary.slot}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-muted font-bold uppercase text-[10px]">Screen</Text>
            <Text className="font-bold text-white">
              {bookingSummary.screenId}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-muted font-bold uppercase text-[10px]">Seats</Text>
            <Text className="font-bold text-white">
              {bookingSummary.seatNumbers}
            </Text>
          </View>

          <View className="border-t border-border/30 pt-5 mt-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-white font-black italic uppercase">Total Investment</Text>
              <Text className="font-black text-2xl text-primary italic">
                {bookingSummary.totalSeats}{" "}
                {bookingSummary.totalSeats === 1 ? "SEAT" : "SEATS"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>

      {/* Action Buttons */}
      <View className="p-6 gap-3 bg-[#1A1A1A] border-t border-border/50 absolute bottom-0 left-0 right-0">
        <TouchableOpacity
          className="bg-primary py-5 rounded-2xl items-center shadow-xl shadow-primary/30"
          onPress={handleConfirmBooking}
        >
          <Text className="text-black text-lg font-black uppercase tracking-widest">Confirm & Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-neutral-800 py-5 rounded-2xl items-center"
          onPress={() => router.back()}
        >
          <Text className="text-white text-sm font-bold uppercase tracking-widest">
            Back to Seats
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
