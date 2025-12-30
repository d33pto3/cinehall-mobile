import { Movie } from "@/schemas/movieSchema";
import { getAllMovies } from "@/api/movie/movie";
import MovieCard from "@/components/Home/MovieCard";
import { useMovieStore } from "@/store/movieStore";
import { EmptyMoviesFallback } from "@/components/shared/EmptyMoviesFallback";
import { IconSearch } from "@tabler/icons-react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { 
  ActivityIndicator, 
  FlatList, 
  Text, 
  TextInput, 
  View 
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MoviesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setMovies } = useMovieStore();

  const { data, isLoading, isError } = useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: getAllMovies,
  });

  useEffect(() => {
    if (data) setMovies(data);
  }, [data]);

  const filteredMovies = data?.filter((m: Movie) => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goToMovie = (id: string) => {
    router.push(`/movie/${id}`);
  };

  return (
    <View className="flex-1 bg-background">
      <View 
        style={{ paddingTop: insets.top + 20 }}
        className="px-6 pb-6 bg-[#1A1A1A] border-b border-border"
      >
        <Text className="text-3xl font-black text-white italic uppercase mb-6">Explore Movies</Text>
        
        <View className="relative">
          <View className="absolute left-4 top-4 z-10">
            <IconSearch size={20} color="#FAAA47" />
          </View>
          <TextInput
            placeholder="Search by title..."
            placeholderTextColor="#737373"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="bg-card border border-border rounded-2xl px-12 py-4 text-white font-medium"
          />
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FAAA47" />
          <Text className="text-muted mt-4 font-bold uppercase tracking-widest text-xs">Loading Experience...</Text>
        </View>
      ) : isError || !filteredMovies || filteredMovies.length === 0 ? (
        <View className="flex-1 px-6 justify-center">
          <EmptyMoviesFallback title="Movies" />
        </View>
      ) : (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingVertical: 20 }}
          renderItem={({ item }) => (
            <MovieCard movie={item} onPress={goToMovie} />
          )}
        />
      )}
    </View>
  );
}
