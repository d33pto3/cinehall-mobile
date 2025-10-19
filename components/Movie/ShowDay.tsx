import { getDay } from "@/lib/getCalendar";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ShowDayProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

const ShowDay = ({ selectedDate, onSelect }: ShowDayProps) => {
  const today = useMemo(() => new Date(), []);
  return (
    <View className="flex flex-row gap-2">
      {Array.from({ length: 5 }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index); // next 5 days

        const weekday = getDay(date.getDay());
        const isSelected = selectedDate.toDateString() === date.toDateString(); // compare full date

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onSelect(date)} // ✅ store full date
            className={`flex items-center p-2 rounded-md ${
              isSelected ? "bg-black" : "bg-gray-50"
            }`}
          >
            <Text
              className={`font-semibold text-sm ${
                isSelected ? "text-white" : "text-black"
              }`}
            >
              {date.getDate()}
            </Text>
            <Text className={`${isSelected ? "text-white" : "text-gray-700"}`}>
              {weekday}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default React.memo(ShowDay);
