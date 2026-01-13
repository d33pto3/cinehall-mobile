import { getAllMovies } from "@/api/movie/movie";
import MovieCarousel from "@/components/Home/MovieCarousel";
import NowShowing from "@/components/Home/NowShowing";
import { useMovieStore } from "@/store/movieStore";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
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

  const headerHeight = insets.top + (insets.top > 0 ? 40 : 60);

  return (
    <View className="flex-1 bg-background">
      {/* Sticky Header */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: "rgba(26, 26, 26, 0.95)",
          paddingHorizontal: 24,
          borderBottomWidth: 1,
          borderColor: "#333333",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: headerHeight,
          paddingTop: insets.top,
        }}
      >
        <Text className="text-xl font-black italic text-primary">CINEHALL</Text>
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <EvilIcons name="search" size={28} color="#CAC1C1" />
          <Feather name="bell" size={22} color="#CAC1C1" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ paddingTop: headerHeight }}>
          <MovieCarousel
            isLoading={isLoading}
            error={error}
            isError={isError}
          />
          <NowShowing />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomePage;
