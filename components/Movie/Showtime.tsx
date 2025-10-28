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
            className={`px-4 py-2 rounded-full border 
              ${isActive ? "bg-blue-500 border-blue-500" : "border-gray-400"} 
              ${isDisabled && "bg-gray-300 border-gray-400"}`}
          >
            <Text
              className={`text-sm ${isDisabled ? "opacity-60 text-black" : ""} ${
                isActive && "text-white"
              } `}
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
