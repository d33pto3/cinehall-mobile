import { Slots } from "@/constants/showtime";
import { Show } from "@/types/show";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ShowtimeProps {
  selectedSlot: string | null;
  showtimes: Show[];
  onSelect: (slot: string, showId: string | undefined) => void;
}

const Showtime = ({ selectedSlot, showtimes, onSelect }: ShowtimeProps) => {
  console.log("selected Slot", selectedSlot);
  return (
    <View className="flex-row flex-wrap gap-2 mt-4">
      {Object.entries(Slots).map(([key, label]) => {
        const isActive = selectedSlot === key;
        const isDisabled = !showtimes?.some((show) => show.slot === key);
        const showId = showtimes?.find((show) => show.slot === key)?._id;

        return (
          <TouchableOpacity
            key={key}
            onPress={() => onSelect(key, showId)}
            disabled={isDisabled}
            style={{
              backgroundColor: isActive ? "#FAAA47" : isDisabled ? "#1A1A1A" : "#1E1E1E",
              borderColor: isActive ? "#FAAA47" : "#2E2E2E",
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 10,
              opacity: isDisabled ? 0.3 : 1,
            }}
          >
            <Text
              style={{
                color: isActive ? "#000" : "#FFF",
                fontWeight: isActive ? "800" : "500",
                fontSize: 13,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Showtime;
