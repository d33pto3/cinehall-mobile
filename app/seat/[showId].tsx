import { getSeats, holdSeats, releaseSeats } from "@/api/seats";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { getOrCreateGuestId } from "@/utility/guestUtils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Seat {
  _id: string;
  showId: string;
  seatNumber: string;
  row: string;
  column: number;
  status: "BOOKED" | "AVAILABLE" | "HELD";
  heldBy: string | null;
  isHeld: boolean;
  heldUntil: string | null;
}

export default function Seats() {
  const { showId: storeShowId } = useBookingStore();
  const { showId: queryShowId } = useLocalSearchParams();

  const showId =
    (Array.isArray(queryShowId) ? queryShowId[0] : queryShowId) || storeShowId;

  const { isLoggedIn, user } = useAuthStore();
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]); // Current user's selections

  // Get or create guest ID on mount
  useEffect(() => {
    const initGuestId = async () => {
      if (isLoggedIn && user?._id) {
        setCurrentUserId(user._id);
      } else {
        const guestId = await getOrCreateGuestId();
        setCurrentUserId(guestId);
      }
    };
    initGuestId();
  }, [isLoggedIn, user?._id]);

  const {
    data: seatsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["seats", showId],
    queryFn: async () => {
      if (showId) {
        return getSeats(showId);
      }
      return null;
    },
    enabled: !!showId,
    retry: 2,
    refetchInterval: 10000, // Refresh to update held seats
  });

  // Hold seats mutation
  const holdSeatsMutation = useMutation({
    mutationFn: async (seatIds: string[]) => {
      return holdSeats(showId!, seatIds, currentUserId);
    },
    onSuccess: () => {
      refetch(); // Refresh to get updated seat status
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to hold seats"
      );
      // Revert selection on error
      setSelectedSeats([]);
    },
  });

  // Release seats mutation
  const releaseSeatsMutation = useMutation({
    mutationFn: async (seatIds: string[]) => {
      return releaseSeats(showId!, seatIds, currentUserId);
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Custom row sorting function
  const sortRows = (a: string, b: string) => {
    if (a.length !== b.length) {
      return a.length - b.length;
    }
    return a.localeCompare(b);
  };

  // Group seats by row
  const seatsByRow = useMemo(() => {
    if (!seatsData?.seats) return {};

    return seatsData.seats.reduce((acc: Record<string, Seat[]>, seat: Seat) => {
      if (!acc[seat.row]) {
        acc[seat.row] = [];
      }
      acc[seat.row].push(seat);
      return acc;
    }, {});
  }, [seatsData]);

  const rows = useMemo(() => {
    return Object.keys(seatsByRow).sort(sortRows);
  }, [seatsByRow]);

  // Determine seat status with proper separation
  const getSeatStatus = useCallback(
    (seat: Seat) => {
      const status = seat.status.toUpperCase();

      // Hard blocked/booked seats
      if (status === "BOOKED") return "booked";
      if (status === "BLOCKED" && !seat.isHeld) return "blocked";

      // Check if seat is held by current user (selected)
      if (seat.isHeld && seat.heldBy === currentUserId) {
        if (seat.heldUntil && new Date(seat.heldUntil) > new Date()) {
          return "selected"; // Current user's selection
        }
      }

      // Check if seat is held by another user
      if (seat.isHeld && seat.heldBy && seat.heldBy !== currentUserId) {
        if (seat.heldUntil && new Date(seat.heldUntil) > new Date()) {
          return "held"; // Other user's selection
        }
      }

      return "available";
    },
    [currentUserId]
  );

  // Sync selected seats with backend data
  useEffect(() => {
    if (!seatsData?.seats || !currentUserId) return;

    const userHeldSeats = seatsData.seats
      .filter((seat: Seat) => getSeatStatus(seat) === "selected")
      .map((seat: Seat) => seat._id);

    setSelectedSeats(userHeldSeats);
  }, [seatsData, currentUserId, getSeatStatus]);

  const handleSelectSeat = async (seat: Seat) => {
    const status = getSeatStatus(seat);

    // Can only interact with available or currently selected seats
    if (status !== "available" && status !== "selected") {
      return;
    }

    if (status === "selected") {
      // Deselect: Release the seat and remove from store
      const newSelected = selectedSeats.filter((id) => id !== seat._id);
      setSelectedSeats(newSelected);
      releaseSeatsMutation.mutate([seat._id]);
      useBookingStore.getState().removeSeat(seat._id);
    } else {
      // Select: Hold the seat and add to store
      const newSelected = [...selectedSeats, seat._id];
      setSelectedSeats(newSelected);
      holdSeatsMutation.mutate([seat._id]);
      useBookingStore.getState().addSeat(seat);
    }
  };

  const getSeatStyles = useCallback(
    (seat: Seat) => {
      const status = getSeatStatus(seat);

      if (status === "booked" || status === "blocked") {
        return {
          bg: "bg-gray-500",
          border: "border-gray-600",
          text: "text-white",
          opacity: "opacity-60",
          disabled: true,
        };
      }

      if (status === "held") {
        // Held by other users
        return {
          bg: "bg-orange-400",
          border: "border-orange-500",
          text: "text-white",
          opacity: "opacity-70",
          disabled: true,
        };
      }

      if (status === "selected") {
        // Selected by current user
        return {
          bg: "bg-blue-500",
          border: "border-blue-600",
          text: "text-white",
          opacity: "opacity-100",
          disabled: false,
        };
      }

      // Available
      return {
        bg: "bg-gray-200",
        border: "border-gray-300",
        text: "text-gray-600",
        opacity: "opacity-100",
        disabled: false,
      };
    },
    [getSeatStatus]
  );

  // Cleanup: Release seats when component unmounts
  useEffect(() => {
    return () => {
      if (selectedSeats.length > 0 && currentUserId) {
        releaseSeats(showId!, selectedSeats, currentUserId).catch(() => {
          // Silent fail on unmount
        });
      }
    };
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <View className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <Text className="text-lg mt-4 text-gray-600">Loading seats...</Text>
      </View>
    );
  }

  if (isError || !seatsData) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <View className="bg-red-50 p-6 rounded-2xl">
          <Text className="text-red-600 text-lg font-semibold">
            ⚠️ Failed to load seats
          </Text>
          <Text className="text-red-500 text-sm mt-2">
            Please try again later
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-white px-4 pt-6 pb-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">
            Select Your Seats
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {seatsData.screen?.name || "Screen"} • Show {showId}
          </Text>
        </View>

        {/* Screen Indicator */}
        <View className="items-center mt-8 mb-6 px-4">
          <View className="w-4/5 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full" />
          <View className="w-full h-12 bg-gradient-to-b from-gray-300 to-transparent rounded-b-3xl mt-1" />
          <Text className="text-xs text-gray-500 mt-2 font-semibold tracking-wider">
            SCREEN
          </Text>
        </View>

        {/* Legend */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          className="mb-6"
        >
          <View className="flex-row space-x-4">
            <View className="flex-row items-center space-x-2">
              <View className="w-6 h-6 bg-gray-200 rounded-md border border-gray-300" />
              <Text className="text-xs text-gray-600">Available</Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <View className="w-6 h-6 bg-blue-500 rounded-md" />
              <Text className="text-xs text-gray-600">Your Selection</Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <View className="w-6 h-6 bg-gray-500 rounded-md" />
              <Text className="text-xs text-gray-600">Booked</Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <View className="w-6 h-6 bg-orange-400 rounded-md" />
              <Text className="text-xs text-gray-600">Held by Others</Text>
            </View>
          </View>
        </ScrollView>

        {/* Seat Grid */}
        <View className="px-4">
          {rows.map((row) => {
            const rowSeats = seatsByRow[row].sort(
              (a: Seat, b: Seat) => a.column - b.column
            );

            return (
              <View key={row} className="mb-3">
                <View className="flex-row items-center">
                  {/* Row Label */}
                  <View className="w-10 justify-center items-center">
                    <Text className="text-sm font-bold text-gray-600">
                      {row}
                    </Text>
                  </View>

                  {/* Seats Row */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 32 }}
                  >
                    <View className="flex-row space-x-2">
                      {rowSeats.map((seat: Seat) => {
                        const styles = getSeatStyles(seat);

                        return (
                          <TouchableOpacity
                            key={seat._id}
                            className={`w-9 h-9 rounded-lg justify-center items-center border-2 ${styles.bg} ${styles.border} ${styles.opacity}`}
                            onPress={() => handleSelectSeat(seat)}
                            activeOpacity={0.7}
                            disabled={styles.disabled}
                          >
                            <Text
                              className={`text-xs font-semibold ${styles.text}`}
                            >
                              {seat.seatNumber}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>

                  {/* Row Label (Right) */}
                  <View className="w-10 justify-center items-center">
                    <Text className="text-sm font-bold text-gray-600">
                      {row}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      {selectedSeats.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <Text className="text-xs text-gray-500">Selected Seats</Text>
              <Text className="text-sm font-bold text-gray-900">
                {seatsData.seats
                  .filter((s: Seat) => selectedSeats.includes(s._id))
                  .map((s: Seat) => s.seatNumber)
                  .join(", ")}
              </Text>
            </View>
            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <Text className="text-blue-600 font-bold">
                {selectedSeats.length}{" "}
                {selectedSeats.length === 1 ? "Seat" : "Seats"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              router.replace("/payment");
            }}
            className="bg-blue-600 py-4 rounded-xl items-center shadow-sm"
          >
            <Text className="text-white text-base font-bold">
              Continue to Payment
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
