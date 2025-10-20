import { getMovie } from "@/api/movie/movie";
import { movieKeys } from "@/api/movie/movieKeys";
import { fetchShowtimes } from "@/api/showtime/showtime";
import ShowDay from "@/components/Movie/ShowDay";
import Showtime from "@/components/Movie/Showtime";
import { Slots } from "@/constants/showtime";
import { useBookingStore } from "@/store/bookingStore";
import { Show } from "@/types/show";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
  const [canBookSeat, setCanBookSeat] = useState(false);

  const {
    movie,
    showtime,
    step,
    setMovie,
    setDate,
    setShowtime: setSlot,
  } = useBookingStore();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Fetch movie details
  const { data, isLoading, isError } = useQuery({
    queryKey: movieKeys.details(movieId),
    queryFn: () => getMovie(movieId),
    enabled: !!movieId,
  });

  // Fetch showtimes for that date
  const { data: showtimes, isLoading: showtimeLoading } = useQuery({
    queryKey: ["showtimes", movieId, selectedDate],
    queryFn: () => fetchShowtimes(movieId, selectedDate),
    enabled: !!movieId && !!selectedDate,
  });

  useEffect(() => {
    if (data) setMovie(data);
  }, [data, setMovie]);

  useEffect(() => {
    if (selectedDate) setDate(selectedDate);
  }, [selectedDate, setDate]);

  useEffect(() => {
    if (!movie || !showtimes) return;

    // ✅ Check if the showtime in store is valid for this date
    const hasShowtimeForDate =
      showtime && showtimes.some((show: Show) => show.slot === showtime);

    // ✅ Sync local slot with valid store showtime
    if (hasShowtimeForDate) {
      setSelectedSlot(showtime);
    } else {
      setSelectedSlot(null);
    }

    // ✅ Decide if the user can book a seat
    const canProceed =
      !!movie &&
      !!selectedDate &&
      !!showtime &&
      hasShowtimeForDate &&
      step >= 3; // or step === 4, depending on your flow

    setCanBookSeat(canProceed);
  }, [movie, showtime, showtimes, selectedDate, step]);

  const handleSelectDate = useCallback(
    (date: Date) => {
      setSelectedSlot("");
      setSelectedDate(date);
      setDate(date);
    },
    [setDate]
  );

  const handleSelectSlot = useCallback(
    (slot: string) => {
      setSelectedSlot(slot);
      setSlot(slot);
    },
    [setSlot]
  );

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
      {/* Step 1: Selected Movie */}
      <Image
        source={{ uri: data.imageUrl }}
        className="w-full h-96 rounded-xl mb-4"
        resizeMode="cover"
      />
      <Text className="text-2xl font-bold mb-2">{data.title}</Text>
      <Text className="text-gray-500 mb-2">
        {data.genre} | {data.duration} minutes
      </Text>

      {/*Step 2: Date picker */}
      <ShowDay selectedDate={selectedDate} onSelect={handleSelectDate} />

      {/*Step 3: Time Slots */}
      {showtimeLoading ? (
        <ActivityIndicator size="small" className="mt-4" />
      ) : (
        <Showtime
          selectedSlot={selectedSlot as keyof typeof Slots}
          showtimes={showtimes}
          onSelect={handleSelectSlot}
        />
      )}

      {/*Step 4: Goto Seat Booking page and select seats */}
      {canBookSeat && (
        <TouchableOpacity className="mt-2 p-2 rounded-md bg-black">
          <Text className="text-white text-center">Select seats</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
