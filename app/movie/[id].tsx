// app/movie/[id].tsx
import { getMovie } from "@/api/movie/movie";
import { movieKeys } from "@/api/movie/movieKeys";
import { getDay } from "@/lib/getDay";
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

// const oneDayTime = 60 * 60 * 24 * 1000;

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const movieId = Array.isArray(id) ? id[0] : id;
  const todate = new Date().getTime();
  const [selectedDate, setSelectedDate] = useState(new Date(todate).getDate());

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
        {Array.from({ length: 5 }, (_, index) => {
          const date = new Date(todate);
          // 1. set the date based on index (0,1,2,3,4)
          date.setDate(date.getDate() + index);

          const weekday = getDay(date.getDay());
          // 2. now, get the updated date
          const dayNum = date.getDate();
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedDate(dayNum);
              }}
              className={`flex items-center ${selectedDate === dayNum ? "bg-black" : "bg-gray-50"} p-2 rounded-md`}
            >
              <Text
                className={`${selectedDate === dayNum && "text-white"} font-semibold text-sm`}
              >
                {dayNum}
              </Text>
              <Text className={`${selectedDate === dayNum && "text-white"}`}>
                {weekday}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
