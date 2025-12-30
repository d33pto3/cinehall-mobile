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
            className={`flex items-center justify-center w-16 h-16 rounded-2xl border ${
              isSelected ? "bg-primary border-primary" : "bg-card border-border"
            }`}
          >
            <Text
              className={`font-black text-lg ${
                isSelected ? "text-black" : "text-white"
              }`}
            >
              {date.getDate()}
            </Text>
            <Text className={`text-[10px] uppercase font-bold ${isSelected ? "text-black" : "text-muted"}`}>
              {weekday}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default React.memo(ShowDay);
