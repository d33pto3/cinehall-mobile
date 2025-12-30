import { getSeats, holdSeats, releaseSeats } from "@/api/seats";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { getOrCreateGuestId } from "@/utility/guestUtils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";

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
          bg: "bg-neutral-800",
          border: "border-neutral-900",
          text: "text-neutral-500",
          opacity: "opacity-40",
          disabled: true,
        };
      }

      if (status === "held") {
        // Held by other users
        return {
          bg: "bg-red-500/20",
          border: "border-red-500/50",
          text: "text-red-500",
          opacity: "opacity-100",
          disabled: true,
        };
      }

      if (status === "selected") {
        // Selected by current user
        return {
          bg: "bg-primary",
          border: "border-primary",
          text: "text-black",
          opacity: "opacity-100",
          disabled: false,
        };
      }

      // Available
      return {
        bg: "bg-card",
        border: "border-border",
        text: "text-white",
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
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#FAAA47" />
        <Text className="text-lg mt-4 text-muted font-bold italic tracking-widest">LOADING EXPERIENCE...</Text>
      </View>
    );
  }

  if (isError || !seatsData) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <View className="bg-red-950/20 p-8 rounded-3xl border border-red-500/30">
          <Text className="text-red-500 text-xl font-black text-center uppercase tracking-tighter">
            ⚠️ Connection Lost
          </Text>
          <Text className="text-red-400 text-sm mt-2 text-center">
            The projector failed. Try again soon.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-[#1A1A1A] px-6 pt-12 pb-6 border-b border-border/50">
          <Text className="text-3xl font-black text-white italic">
            CHOOSE SEATS
          </Text>
          <View className="flex-row items-center gap-2 mt-1">
            <Text className="text-primary font-bold">
              {seatsData.screen?.name || "Premium Screen"}
            </Text>
            <View className="w-1 h-1 rounded-full bg-muted" />
            <Text className="text-muted text-xs uppercase font-medium">Show ID: {showId}</Text>
          </View>
        </View>

        {/* Screen Indicator */}
        <View className="items-center mt-10 mb-8 px-6">
          <View className="w-full h-1 bg-primary/30 rounded-full shadow-lg shadow-primary/50" />
          <View className="w-full h-8 bg-gradient-to-b from-primary/10 to-transparent rounded-b-3xl mt-1 opacity-50" />
          <Text className="text-[10px] text-primary font-black tracking-[8px] mt-2 uppercase opacity-80">
            SCREEN
          </Text>
        </View>

        {/* Legend */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          className="mb-10"
        >
          <View className="flex-row gap-6">
            <View className="flex-row items-center gap-2">
              <View className="w-5 h-5 bg-card rounded-md border border-border" />
              <Text className="text-[10px] text-muted font-bold uppercase">Available</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-5 h-5 bg-primary rounded-md" />
              <Text className="text-[10px] text-muted font-bold uppercase">Selected</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-5 h-5 bg-neutral-800 rounded-md" />
              <Text className="text-[10px] text-muted font-bold uppercase">Sold</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-5 h-5 bg-red-500/20 border border-red-500/50 rounded-md" />
              <Text className="text-[10px] text-muted font-bold uppercase">Held</Text>
            </View>
          </View>
        </ScrollView>

        {/* Seat Grid */}
        <View className="px-2">
          {rows.map((row) => {
            const rowSeats = seatsByRow[row].sort(
              (a: Seat, b: Seat) => a.column - b.column
            );

            return (
              <View key={row} className="mb-4">
                <View className="flex-row items-center">
                  {/* Row Label */}
                  <View className="w-8 justify-center items-center">
                    <Text className="text-xs font-black text-primary/50">
                      {row}
                    </Text>
                  </View>

                  {/* Seats Row */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 4 }}
                  >
                    <View className="flex-row gap-2">
                      {rowSeats.map((seat: Seat) => {
                        const styles = getSeatStyles(seat);

                        return (
                          <TouchableOpacity
                            key={seat._id}
                            className={`w-9 h-9 rounded-xl justify-center items-center border ${styles.bg} ${styles.border} ${styles.opacity}`}
                            onPress={() => handleSelectSeat(seat)}
                            activeOpacity={0.7}
                            disabled={styles.disabled}
                          >
                            <Text
                              className={`text-[10px] font-black ${styles.text}`}
                            >
                              {seat.seatNumber}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>

                  {/* Row Label (Right) */}
                  <View className="w-8 justify-center items-center">
                    <Text className="text-xs font-black text-primary/50">
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
        <View className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-border/50 px-6 pt-6 pb-10 shadow-2xl">
          <View className="flex-row justify-between items-center mb-5">
            <View className="flex-1">
              <Text className="text-[10px] text-muted font-black uppercase tracking-widest">Selected Seats</Text>
              <Text className="text-lg font-black text-white italic">
                {seatsData.seats
                  .filter((s: Seat) => selectedSeats.includes(s._id))
                  .map((s: Seat) => s.seatNumber)
                  .join(", ")}
              </Text>
            </View>
            <View className="bg-primary/10 border border-primary/30 px-4 py-2 rounded-2xl">
              <Text className="text-primary font-black uppercase text-xs">
                {selectedSeats.length}{" "}
                {selectedSeats.length === 1 ? "Seat" : "Seats"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              router.replace("/booking");
            }}
            className="bg-primary py-5 rounded-2xl items-center shadow-xl shadow-primary/30"
          >
            <Text className="text-black text-center font-black uppercase text-lg tracking-widest">
              Check Out
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
