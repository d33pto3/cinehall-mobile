import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const HallPicker = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [placeholder, setPlaceholder] = useState("Select Hall");

  return (
    <View className="mt-2">
      <Text>Halls:</Text>

      <View className="relative">
        <TouchableOpacity
          className="relative w-[30%] rounded-sm border-[1px] mt-1"
          onPress={() => {
            setShowOptions((prev) => !prev);
          }}
        >
          <Text className="p-1 border-sm">{placeholder}</Text>
          <Text className="absolute top-[50%] -translate-y-1/2 right-1">v</Text>
        </TouchableOpacity>
        {showOptions && (
          <View className="absolute top-[100%] flex gap-1 border-x-[1px] rounded-tl-sm rounded-tr-sm w-[30%]">
            <TouchableOpacity
              className="border-b-[1px] p-1"
              onPress={() => setPlaceholder("Option 1")}
            >
              <Text>Option 1</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border-b-[1px] p-1">
              <Text>Option 2</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border-b-[1px] p-1">
              <Text>Option 3</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text>ABCD</Text>
    </View>
  );
};

export default HallPicker;
