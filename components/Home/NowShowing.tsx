import { getNowShowingMovies } from "@/api/movie/movie";
import { movieKeys } from "@/api/movie/movieKeys";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, View, ActivityIndicator } from "react-native";
import Filters from "./Filters";
import MovieCard from "./MovieCard";
import { EmptyMoviesFallback } from "../shared/EmptyMoviesFallback";

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

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center py-20">
        <ActivityIndicator size="large" color="#FAAA47" />
      </View>
    );

  return (
    <View className="flex-1 py-1 px-4">
      <Text className="text-xl font-bold text-white mb-2">Now Showing</Text>
      <Filters />
      <FlatList
        data={data}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListEmptyComponent={<EmptyMoviesFallback title="Movies" className="mt-10" />}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={goToMovie} />
        )}
      />
    </View>
  );
}
