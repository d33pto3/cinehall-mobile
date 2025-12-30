import { IconMovieOff } from "@tabler/icons-react-native";
import React from "react";
import { Text, View } from "react-native";

interface EmptyMoviesFallbackProps {
  title: string;
  className?: string;
}

export const EmptyMoviesFallback = ({ title, className }: EmptyMoviesFallbackProps) => {
  return (
    <View className={`w-full py-12 px-6 flex flex-col items-center justify-center bg-card/30 rounded-[32px] border border-border/50 ${className}`}>
      <View className="mb-4">
        <IconMovieOff size={40} color="#FAAA47" />
      </View>
      <Text className="text-xl font-black text-white italic uppercase mb-1">No {title} Found</Text>
      <Text className="text-muted text-center uppercase tracking-widest text-[10px] max-w-[200px]">
        The cinematic curtain is closed here. Check back soon for movie magic!
      </Text>
    </View>
  );
};
