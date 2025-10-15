// app/movie/[id].tsx
import { getMovie } from "@/api/movie/movie";
import { movieKeys } from "@/api/movie/movieKeys";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const movieId = Array.isArray(id) ? id[0] : id;
  const today = new Date().getDate();
  const [selectedDate, setSelectedDate] = useState(today);

  const { data, isLoading, isError } = useQuery({
    queryKey: movieKeys.details(movieId),
    queryFn: () => getMovie(movieId),
    enabled: !!movieId,
  });

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );

  if (isError || !data)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error loading movie details.</Text>
      </View>
    );

  return (
    <ScrollView className="flex-1 px-4">
      <Image
        source={{ uri: data.imageUrl }}
        className="w-full h-96 rounded-xl mb-4"
        resizeMode="cover"
      />
      <Text className="text-2xl font-bold mb-2">{data.title}</Text>
      <Text className="text-gray-500 mb-2">
        {data.genre} | {data.duration} minutes
      </Text>

      <View className="flex flex-row gap-2">
        <View></View>
        {Array.from({ length: 5 }, (_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedDate(today + index)}
            className={`flex items-center p-2 ${selectedDate === today + index ? "bg-black" : "bg-gray-50"} rounded-md`}
          >
            <Text
              className={`${selectedDate === today + index && "text-white"} font-semibold text-sm`}
            >
              {today + index}
            </Text>
            <Text className=""></Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
