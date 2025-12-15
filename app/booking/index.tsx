import { ENDPOINTS } from "@/api/endpoints";
import api from "@/services/api";
import { createBooking } from "@/api/booking";
import { getOrCreateGuestId } from "@/utility/guestUtils";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
} from "react-native";
import { Toast } from "toastify-react-native";

export default function Booking() {
  const { getBookingSummary, isBookingComplete } = useBookingStore();

  const { isLoggedIn, user, register } = useAuthStore();
  const [guestModalVisible, setGuestModalVisible] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  console.log(user);

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
      setGuestModalVisible(true);
      return;
    }
    await processBooking();
  };

  const handleGuestSubmit = async () => {
    if (!guestName || !guestEmail) {
      Toast.error("Please enter both Name and Email");
      return;
    }

    try {
      setIsRegistering(true);
      // Auto-register guest
      // Password generation: Guest + short random string or simple default
      // Using a constant password for simplicity as per plan "GuestPass123!"
      await register(guestEmail, "GuestPass123!", guestName);
      
      setGuestModalVisible(false);
      // Proceed to booking now that we are logged in
      await processBooking();

    } catch (error: any) {
       const msg = error?.response?.data?.message || "Guest registration failed";
       Toast.error(msg);
    } finally {
      setIsRegistering(false);
    }
  };

  const processBooking = async () => {
    try {
      const guestId = await getOrCreateGuestId();
      // Refetch user from store as it might be updated after register
      const currentUser = useAuthStore.getState().user; 

      const payload = {
        userId: currentUser?._id,
        guestId,
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
    <View className="flex-1 bg-gray-50">
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
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
    </ScrollView>

      {/* Action Buttons */}
      <View className="p-4 space-y-3 bg-white border-t border-gray-200 absolute bottom-0 left-0 right-0">
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

      {/* Guest Modal */}
       <Modal
        animationType="slide"
        transparent={true}
        visible={guestModalVisible}
        onRequestClose={() => setGuestModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white m-5 p-6 rounded-2xl w-[90%] shadow-xl">
            <Text className="text-xl font-bold text-gray-900 mb-4">Guest Checkout</Text>
            <Text className="text-gray-500 mb-4">Enter your details to proceed with payment.</Text>
            
            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 font-medium mb-1">Full Name</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="John Doe"
                  value={guestName}
                  onChangeText={setGuestName}
                />
              </View>
              
              <View>
                <Text className="text-gray-700 font-medium mb-1">Email Address</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="john@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={guestEmail}
                  onChangeText={setGuestEmail}
                />
              </View>
            </View>

             <View className="mt-6 flex-row justify-end space-x-3 gap-2">
                <TouchableOpacity 
                   onPress={() => setGuestModalVisible(false)}
                   className="px-4 py-3 bg-gray-200 rounded-lg"
                   disabled={isRegistering}
                >
                   <Text className="text-gray-700 font-semibold">Cancel</Text>
                </TouchableOpacity>

                 <TouchableOpacity 
                   onPress={handleGuestSubmit}
                   className="px-4 py-3 bg-blue-600 rounded-lg"
                   disabled={isRegistering}
                >
                   <Text className="text-white font-semibold">
                     {isRegistering ? "Processing..." : "Continue to Pay"}
                   </Text>
                </TouchableOpacity>
             </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
