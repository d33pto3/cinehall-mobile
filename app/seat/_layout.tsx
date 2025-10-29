import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function SeatLayout() {
  const router = useRouter();
  //   const { id } = useLocalSearchParams();
  //   const movieId = Array.isArray(id) ? id[0] : id;

  // Fetch movie details just for the title
  //   const { data } = useQuery({
  //     queryKey: movieKeys.details(movieId),
  //     queryFn: () => getMovie(movieId),
  //     enabled: !!movieId,
  //   });
  return (
    <Stack>
      <Stack.Screen
        name="[showId]"
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color="black" />
            </TouchableOpacity>
          ),
          //   headerTitle: data?.title || "Loading...",
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
