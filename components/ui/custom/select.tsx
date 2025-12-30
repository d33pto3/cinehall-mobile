import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Select = ({
  options,
  onSelect,
}: {
  options: { key: string; text: string }[];
  onSelect: (id: string) => void;
}) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <View className="relative">
      <TouchableOpacity
        className="relative w-full rounded-xl border border-primary/50 bg-card mt-1 px-3 py-2"
        onPress={() => {
          setShowOptions((prev) => !prev);
        }}
      >
        <Text className="text-white font-medium">Select...</Text>
        <Text className="absolute top-[50%] -translate-y-1/2 right-3 text-primary font-bold">v</Text>
      </TouchableOpacity>
      {showOptions && (
        <View
          className="absolute top-[105%] w-full flex gap-1 border border-primary/30 bg-card rounded-xl overflow-hidden"
          style={{ elevation: 10, zIndex: 100 }}
        >
          {options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              className="border-b border-border/10 p-3 active:bg-primary/20"
              onPress={() => {
                onSelect(opt.key);
                setShowOptions(false);
              }}
            >
              <Text className="text-white font-medium">{opt.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default Select;
