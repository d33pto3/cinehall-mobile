import { getNowShowingMovies } from "@/api/movie";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Filters from "./Filters";

export default function NowShowing() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["nowShowingMovies"],
    queryFn: getNowShowingMovies,
    retry: 2,
  });

  return (
    <View className="flex-1 py-2 px-3">
      <Text style={{ fontSize: 16, fontWeight: "500" }}>Now Showing</Text>
      <Filters />
      <FlatList
        data={data}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <View className="w-[48%] flex mb-4">
            <TouchableOpacity>
              <Image
                source={{ uri: item.imageUrl }}
                className="w-full h-60 rounded-tl-xl rounded-tr-xl"
                resizeMode="cover"
              />
              <View className="border-l-[1px] border-r-[1px] border-b-[1px] border-gray-300 rounded-bl-xl rounded-br-xl p-2">
                <Text className="text-base font-semibold">{item.title}</Text>
                <View className="flex-row items-center gap-1">
                  <Text>{item.genre}</Text>
                  <Text>|</Text>
                  <Text>{new Date(item.releaseDate).getFullYear()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
