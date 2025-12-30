import { getUserBookings } from "@/api/booking";
import { EmptyMoviesFallback } from "@/components/shared/EmptyMoviesFallback";
import { useAuthStore } from "@/store/authStore";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Type definitions based on what we saw in the controller/model
interface Booking {
  _id: string;
  movieId: {
    _id: string;
    title: string;
    imageUrl: string;
  };
  showId: {
    _id: string;
    startTime: string;
    endTime: string;
  };
  seats: Array<{
    _id: string;
    seatNumber: string;
  }>;
  totalPrice: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  createdAt: string;
  tran_id?: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-green-500/20 text-green-500 border-green-500/50";
    case "PENDING":
      return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
    case "FAILED":
      return "bg-red-500/20 text-red-500 border-red-500/50";
    default:
      return "bg-gray-500/20 text-gray-500 border-gray-500/50";
  }
};

const BookingCard = ({ booking }: { booking: Booking }) => {
  return (
    <View className="mb-4 overflow-hidden rounded-2xl border border-border/50 bg-card/30">
      <View className="flex-row p-4">
        {/* Movie Poster */}
        <Image
          source={{ uri: booking.movieId?.imageUrl }}
          className="h-32 w-24 rounded-lg bg-gray-800"
          resizeMode="cover"
        />

        {/* Info */}
        <View className="ml-4 flex-1 justify-between">
          <View>
            <Text className="text-lg font-bold text-active" numberOfLines={1}>
              {booking.movieId?.title || "Unknown Movie"}
            </Text>
            <Text className="text-sm text-gray-400 mt-1">
              {booking.showId?.startTime
                ? formatDate(booking.showId.startTime)
                : "Time TBA"}
            </Text>
          </View>

          <View>
            <Text className="text-xs text-muted font-medium mb-1">SEATS</Text>
            <Text className="text-white font-semibold" numberOfLines={1}>
              {booking.seats?.map((s) => s.seatNumber).join(", ") ||
                "No seats"}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-primary font-black text-lg">
              ${booking.totalPrice}
            </Text>
            <View
              className={`px-3 py-1 rounded-full border ${getStatusColor(
                booking.paymentStatus
              ).split(" ")[2]} ${getStatusColor(booking.paymentStatus).split(" ")[0]}`}
            >
              {}
              <Text
                className={`text-[10px] font-bold uppercase ${
                  getStatusColor(booking.paymentStatus).split(" ")[1]
                }`}
              >
                {booking.paymentStatus}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Transaction ID Footer */}
      {booking.tran_id && (
        <View className="bg-white/5 px-4 py-2 flex-row justify-between items-center">
            <Text className="text-[10px] text-gray-500 uppercase tracking-widest">Transaction ID</Text>
            <Text className="text-[10px] text-gray-400 font-mono">{booking.tran_id}</Text>
        </View>
      )}
    </View>
  );
};

const BookingsScreen = () => {
  const { user, isLoggedIn } = useAuthStore();
  
  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ["bookings", user?._id],
    queryFn: () => getUserBookings(user?._id as string),
    enabled: !!isLoggedIn && !!user?._id,
  });

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn && user?._id) {
        refetch();
      }
    }, [isLoggedIn, user, refetch])
  );

  const renderContent = () => {
    if (!isLoggedIn) {
      return (
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-card w-24 h-24 rounded-full items-center justify-center mb-6 border border-border">
            <MaterialCommunityIcons name="ticket-account" size={40} color="#FAAA47" />
          </View>
          <Text className="text-2xl font-bold text-white mb-2 text-center">
            Sign In Required
          </Text>
          <Text className="text-muted text-center mb-8">
            Please sign in to view your booking history and manage tickets.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="bg-primary px-8 py-4 rounded-full w-full items-center active:opacity-90"
          >
            <Text className="text-black font-bold uppercase tracking-wider">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isLoading && !isRefetching && !data) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FAAA47" />
        </View>
      );
    }
    
    // Check if error
    if (error) {
         return (
        <View className="flex-1 items-center justify-center px-6">
           <Text className="text-white text-center mb-4">Failed to load bookings</Text>
           <TouchableOpacity
            onPress={() => refetch()}
            className="bg-card border border-border px-6 py-2 rounded-full"
          >
            <Text className="text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      )
    }

    const bookings = data?.bookings || [];

    if (bookings.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <EmptyMoviesFallback title="Bookings" />
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/movies")}
            className="mt-8 bg-transparent border border-primary px-8 py-3 rounded-full"
          >
            <Text className="text-primary font-bold uppercase tracking-wider">
              Book a Movie
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <BookingCard booking={item} />}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#FAAA47"
          />
        }
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 border-b border-border/20 mb-2">
          <Text className="text-2xl font-black text-white uppercase italic">
            My Bookings
          </Text>
        </View>

        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

export default BookingsScreen;
