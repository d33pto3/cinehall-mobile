import { getMovie } from "@/api/movie/movie";
import { movieKeys } from "@/api/movie/movieKeys";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function MovieLayout() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const movieId = Array.isArray(id) ? id[0] : id;

  // Fetch movie details just for the title
  const { data } = useQuery({
    queryKey: movieKeys.details(movieId),
    queryFn: () => getMovie(movieId),
    enabled: !!movieId,
  });

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) router.back();
                else router.push("/");
              }}
            >
              <Ionicons name="arrow-back" size={18} color="black" />
            </TouchableOpacity>
          ),
          headerTitle: data?.title || "Loading...",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 14,
          },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
