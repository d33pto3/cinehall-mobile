import { getAllHalls, Hall } from "@/api/hall/hall";
import { TheaterCard } from "@/components/Theaters/TheaterCard";
import { EmptyTheatersFallback } from "@/components/shared/EmptyTheatersFallback";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Theaters() {
  const insets = useSafeAreaInsets();

  const { data, isLoading, isError } = useQuery<Hall[]>({
    queryKey: ["theaters"],
    queryFn: getAllHalls,
  });

  return (
    <View className="flex-1 bg-background">
      <View 
        style={{ paddingTop: insets.top + 20 }}
        className="px-6 pb-6 bg-[#1A1A1A] border-b border-border"
      >
        <Text className="text-3xl font-black text-white italic uppercase">Our Theaters</Text>
        <Text className="text-muted text-xs font-bold uppercase tracking-widest mt-1">
          Experience Cinema Like Never Before
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FAAA47" />
          <Text className="text-muted mt-4 font-bold uppercase tracking-widest text-xs">Loading Locations...</Text>
        </View>
      ) : isError ? (
         <View className="flex-1 px-6 justify-center">
          <Text className="text-red-500 text-center font-bold">Failed to load theaters.</Text>
        </View>
      ) : !data || data.length === 0 ? (
        <View className="flex-1 px-6 justify-center">
          <EmptyTheatersFallback />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          renderItem={({ item }) => <TheaterCard hall={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
