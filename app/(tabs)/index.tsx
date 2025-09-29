import { getAllMovies } from "@/api/movie";
import MovieCarousel from "@/components/Home/MovieCarousel";
import { Movie } from "@/schemas/movieSchema";
import { useMovieStore } from "@/store/movieStore";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
const HEADER_HEIGHT = 46;

const HomePage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["movies"],
    queryFn: getAllMovies,
    retry: 2,
  });

  // Use Zustand for global client state
  const { setMovies } = useMovieStore();

  // Sync React Query data to Zustand when data is available
  useEffect(() => {
    if (data) {
      setMovies(data);
    }
  }, [data, setMovies]);

  const movieUrls = data?.map((movie: Movie) => movie.imageUrl);

  return (
    <View className="flex-1">
      {/* Sticky Header */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: "#fff",
          paddingHorizontal: 24,
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderColor: "#d4d4d4",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: HEADER_HEIGHT,
        }}
        className="absolute top-0 left-0 right-0 z-10 bg-white px-6 py-2 border-b border-neutral-300 flex-row items-center justify-between"
      >
        <Text className="text-lg font-bold">Cinehall</Text>
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <EvilIcons name="search" size={24} color="black" />
          <Feather name="bell" size={20} color="black" />
        </View>
      </View>

      {/* Scroll Content with padding to avoid overlap */}
      <ScrollView contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}>
        <MovieCarousel
          urls={movieUrls}
          isLoading={isLoading}
          error={error}
          isError={isError}
          // refetch={refetch}
        />
      </ScrollView>
    </View>
  );
};

export default HomePage;
