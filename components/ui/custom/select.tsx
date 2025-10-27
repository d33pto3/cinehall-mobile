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
        className="relative w-full rounded-sm border-[1px] mt-1"
        onPress={() => {
          setShowOptions((prev) => !prev);
        }}
      >
        <Text className="py-1 pr-4 pl-1">Select...</Text>
        <Text className="absolute top-[50%] -translate-y-1/2 right-1">v</Text>
      </TouchableOpacity>
      {showOptions && (
        <View
          className="absolute top-[100%] w-full flex gap-1 border-x-[1px] bg-white"
          style={{ elevation: 5 }}
        >
          {options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              className="border-b-[1px] p-1"
              onPress={() => {
                // setPlaceholder(opt.text);
                onSelect(opt.key);
                setShowOptions(false);
              }}
            >
              <Text>{opt.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default Select;
