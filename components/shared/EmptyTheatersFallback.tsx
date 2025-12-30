import { IconBuildingStore } from "@tabler/icons-react-native";
import React from "react";
import { Text, View } from "react-native";

interface EmptyTheatersFallbackProps {
  className?: string;
}

export const EmptyTheatersFallback = ({ className }: EmptyTheatersFallbackProps) => {
  return (
    <View className={`w-full py-12 px-6 flex flex-col items-center justify-center bg-card/30 rounded-[32px] border border-border/50 ${className}`}>
      <View className="mb-4">
        <IconBuildingStore size={40} color="#FAAA47" />
      </View>
      <Text className="text-xl font-black text-white italic uppercase mb-1">No Theaters Found</Text>
      <Text className="text-muted text-center uppercase tracking-widest text-[10px] max-w-[250px]">
        We are expanding our cinematic universe. Check back soon for new locations!
      </Text>
    </View>
  );
};
