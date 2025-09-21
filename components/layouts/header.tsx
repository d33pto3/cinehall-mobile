import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";

const HeaderReel: React.FC = () => {
  const [lenSmall, setLenSmall] = useState(0);
  const [lenMid, setLenMid] = useState(0);

  useEffect(() => {
    // Calculate number of items to cover screen width
    const calculateItems = () => {
      const { width } = Dimensions.get("window");
      // Small blocks: w-1 (4px) + m-0.5 (2px per side) = 8px total
      const smallBlockWidth = 8;
      // Middle blocks: w-6 (24px) + m-1 (4px per side) = 32px total
      const midBlockWidth = 32;
      // Ensure enough blocks to cover screen width, doubled by [...Array(2)]
      setLenSmall(Math.ceil(width / smallBlockWidth));
      setLenMid(Math.ceil(width / midBlockWidth));
    };

    calculateItems();
    const subscription = Dimensions.addEventListener("change", calculateItems);
    return () => subscription?.remove();
  }, []);

  return (
    <View className="absolute top-0 left-0 w-full z-50">
      <View className="overflow-hidden bg-black py-1 flex-col gap-0.5">
        {/* Top reel */}
        <View className="flex-row w-[200%]">
          {[...Array(2)].map((_, loopIndex) => (
            <View key={`top-${loopIndex}`} className="flex-row">
              {Array.from({ length: lenSmall }, (_, index) => (
                <View
                  key={`top-${loopIndex}-${index}`}
                  className="w-1 h-1 m-0.5 bg-white rounded-sm"
                />
              ))}
            </View>
          ))}
        </View>

        {/* Middle reel */}
        <View className="flex-row w-[200%]">
          {[...Array(2)].map((_, loopIndex) => (
            <View key={`mid-${loopIndex}`} className="flex-row">
              {Array.from({ length: lenMid }, (_, index) => (
                <View
                  key={`mid-${loopIndex}-${index}`}
                  className="w-6 h-4 m-1 bg-[#8F8F8F] rounded"
                />
              ))}
            </View>
          ))}
        </View>

        {/* Bottom reel */}
        <View className="flex-row w-[200%]">
          {[...Array(2)].map((_, loopIndex) => (
            <View key={`bot-${loopIndex}`} className="flex-row">
              {Array.from({ length: lenSmall }, (_, index) => (
                <View
                  key={`bot-${loopIndex}-${index}`}
                  className="w-1 h-1 m-0.5 bg-white rounded-sm"
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default HeaderReel;
