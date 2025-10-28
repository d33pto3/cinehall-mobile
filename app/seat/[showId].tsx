import { getScreen } from "@/api/screen";
import { useBookingStore } from "@/store/bookingStore";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Seats() {
  const { showId: storeShowId } = useBookingStore();
  const { showId: queryShowId, screenId } = useLocalSearchParams();

  const {
    data: screen,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["screen", screenId],
    queryFn: async () => {
      if (screenId) {
        return getScreen(Array.isArray(screenId) ? screenId[0] : screenId);
      }
      return null;
    },
    retry: 2,
  });

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <View className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <Text className="text-lg mt-4 text-gray-600">Loading screen...</Text>
      </View>
    );
  }

  if (isError || !screen) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <View className="bg-red-50 p-6 rounded-2xl">
          <Text className="text-red-600 text-lg font-semibold">
            ⚠️ Failed to load screen
          </Text>
          <Text className="text-red-500 text-sm mt-2">
            Please try again later
          </Text>
        </View>
      </View>
    );
  }

  const rows = Array.from({ length: screen.rows }, (_, i) => i + 1);
  const columns = Array.from({ length: screen.columns }, (_, i) => i + 1);

  const handleSelectSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getRowLabel = (rowNum: number) => {
    return String.fromCharCode(64 + rowNum); // A, B, C, etc.
  };

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
            Show {storeShowId || queryShowId} • Screen {screenId}
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
        <View className="flex-row justify-center items-center space-x-6 mb-6 px-4">
          <View className="flex-row items-center space-x-2">
            <View className="w-6 h-6 bg-gray-200 rounded-md border border-gray-300" />
            <Text className="text-xs text-gray-600">Available</Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <View className="w-6 h-6 bg-blue-500 rounded-md" />
            <Text className="text-xs text-gray-600">Selected</Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <View className="w-6 h-6 bg-gray-400 rounded-md" />
            <Text className="text-xs text-gray-600">Occupied</Text>
          </View>
        </View>

        {/* Seat Grid */}
        <View className="px-4">
          {rows.map((rowNum) => (
            <View key={rowNum} className="mb-3">
              <View className="flex-row items-center">
                {/* Row Label */}
                <View className="w-8 justify-center items-center">
                  <Text className="text-sm font-bold text-gray-600">
                    {getRowLabel(rowNum)}
                  </Text>
                </View>

                {/* Seats Row */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 32 }}
                >
                  <View className="flex-row space-x-2">
                    {columns.map((colNum) => {
                      const seatId = `${getRowLabel(rowNum)}${colNum}`;
                      const isSelected = selectedSeats.includes(seatId);

                      return (
                        <TouchableOpacity
                          key={colNum}
                          className={`w-9 h-9 rounded-lg justify-center items-center border-2 transition-all
                            ${
                              isSelected
                                ? "bg-blue-500 border-blue-600"
                                : "bg-gray-200 border-gray-300"
                            }`}
                          onPress={() => handleSelectSeat(seatId)}
                          activeOpacity={0.7}
                        >
                          <Text
                            className={`text-xs font-semibold ${
                              isSelected ? "text-white" : "text-gray-600"
                            }`}
                          >
                            {colNum}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>

                {/* Row Label (Right) */}
                <View className="w-8 justify-center items-center">
                  <Text className="text-sm font-bold text-gray-600">
                    {getRowLabel(rowNum)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      {selectedSeats.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text className="text-xs text-gray-500">Selected Seats</Text>
              <Text className="text-lg font-bold text-gray-900">
                {selectedSeats.join(", ")}
              </Text>
            </View>
            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <Text className="text-blue-600 font-bold">
                {selectedSeats.length}{" "}
                {selectedSeats.length === 1 ? "Seat" : "Seats"}
              </Text>
            </View>
          </View>

          <TouchableOpacity className="bg-blue-600 py-4 rounded-xl items-center shadow-sm">
            <Text className="text-white text-base font-bold">
              Continue to Payment
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
