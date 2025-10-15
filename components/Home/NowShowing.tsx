import { getNowShowingMovies } from "@/api/movie/movie";
import { movieKeys } from "@/api/movie/movieKeys";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, View } from "react-native";
import Filters from "./Filters";
import MovieCard from "./MovieCard";

export default function NowShowing() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: movieKeys.nowShowing(),
    queryFn: getNowShowingMovies,
    retry: 2,
  });

  const router = useRouter();

  const goToMovie = (movieId: string) => {
    router.push(`/movie/${movieId}`);
  };

  if (isLoading) return <Text>Loading...</Text>;

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
          <MovieCard movie={item} onPress={goToMovie} />
        )}
      />
    </View>
  );
}
