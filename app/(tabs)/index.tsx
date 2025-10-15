import { getAllMovies } from "@/api/movie/movie";
import MovieCarousel from "@/components/Home/MovieCarousel";
import NowShowing from "@/components/Home/NowShowing";
import { useMovieStore } from "@/store/movieStore";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomePage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["movies"],
    queryFn: getAllMovies,
    retry: 2,
  });

  const insets = useSafeAreaInsets();

  // Use Zustand for global client state
  const { setMovies } = useMovieStore();

  // Sync React Query data to Zustand when data is available
  useEffect(() => {
    if (data) {
      setMovies(data);
    }
  }, [data, setMovies]);

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
          // backgroundColor: "#fff",
          backgroundColor: "#ccc",
          paddingHorizontal: 24,
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderColor: "#d4d4d4",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: insets.top,
          paddingBottom: 5,
          minHeight: 40,
        }}
        // className="absolute top-0 left-0 right-0 z-10 bg-white px-6 py-2 border-b border-neutral-300 flex-row items-center justify-between"
      >
        <Text className="text-lg font-bold">Cinehall</Text>
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <EvilIcons name="search" size={24} color="black" />
          <Feather name="bell" size={20} color="black" />
        </View>
      </View>

      {/* Scroll Content with padding to avoid overlap */}
      <MovieCarousel
        isLoading={isLoading}
        error={error}
        isError={isError}
        // refetch={refetch}
      />
      <View
      // contentContainerStyle={{
      //   paddingTop: insets.top + 5,
      //   paddingBottom: 50,
      // }}
      ></View>
      <NowShowing />
    </View>
  );
};

export default HomePage;
