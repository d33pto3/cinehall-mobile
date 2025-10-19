import { getMovie } from "@/api/movie/movie";
import { movieKeys } from "@/api/movie/movieKeys";
import ShowDay from "@/components/Movie/ShowDay";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const movieId = Array.isArray(id) ? id[0] : id;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data, isLoading, isError } = useQuery({
    queryKey: movieKeys.details(movieId),
    queryFn: () => getMovie(movieId),
    enabled: !!movieId,
  });

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

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

      {/* Date picker */}
      <ShowDay selectedDate={selectedDate} onSelect={handleSelectDate} />
    </ScrollView>
  );
}
