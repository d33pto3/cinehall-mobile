import { getMovie } from "@/api/movie/movie";
import { movieKeys } from "@/api/movie/movieKeys";
import { fetchShowtimes } from "@/api/showtime/showtime";
import HallPicker from "@/components/Movie/HallPicker";
import ScreenPicker from "@/components/Movie/ScreenPicker";
import ShowDay from "@/components/Movie/ShowDay";
import { useBookingStore } from "@/store/bookingStore";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const movieId = Array.isArray(id) ? id[0] : id;

  const [canBookSeat, setCanBookSeat] = useState(false);

  const {
    movie: currentMovie,
    hallId: currentHallId,
    slot,
    date,
    step,
    setMovie,
    setDate,
    // setSlot,
  } = useBookingStore();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Fetch movie details
  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
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

  // If got movie from server then set movie in the store
  useEffect(() => {
    if (movie) setMovie(movie);
  }, [movie, setMovie]);

  // If the stored date in the store is less than the present day,
  // then remove the day from the store [goes to step -> 2]
  useEffect(() => {
    if (!date) return;

    const storedDate = new Date(date);
    const today = new Date();

    // Compare only the date part, not time
    const storedDay = new Date(storedDate.toLocaleDateString()).getTime();
    const todayDay = new Date(today.toLocaleDateString()).getTime();

    if (storedDay < todayDay) {
      setDate(null);
    }
  }, [date, setDate]);

  // If selectedDate changes then set date in the store
  useEffect(() => {
    if (selectedDate) setDate(selectedDate);
  }, [selectedDate, setDate]);

  // set the slot in react state
  // useEffect(() => {
  //   if (slot) setSelectedSlot(slot);
  // }, [slot]);

  // select date handler function
  const handleSelectDate = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      // setSelectedSlot(null);
      setDate(date);
    },
    [setDate]
  );

  // useEffect(() => {
  //   if (!currentMovie || !showtimes) {
  //     setCanBookSeat(false);
  //     return;
  //   }

  //   const hasShowtimeForDate =
  //     selectedSlot &&
  //     showtimes.some((show: Show) => show.slot === selectedSlot);

  //   setCanBookSeat(
  //     !!selectedSlot && !!currentMovie && !!selectedDate && hasShowtimeForDate
  //   );
  // }, [selectedSlot, currentMovie, selectedDate, showtimes]);

  // const handleSelectSlot = useCallback(
  //   (slot: string) => {
  //     setSelectedSlot(slot);
  //     setSlot(slot);
  //   },
  //   [setSlot]
  // );

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );

  if (isError || !movie)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error loading movie details.</Text>
      </View>
    );

  console.log(step, currentMovie?.title, currentHallId);

  return (
    <ScrollView className="flex-1 px-4">
      {/* Step 1: Selected Movie */}
      <Image
        source={{ uri: movie.imageUrl }}
        className="w-full h-96 rounded-xl mb-4"
        resizeMode="cover"
      />
      <Text className="text-2xl font-bold mb-2">{movie.title}</Text>
      <Text className="text-gray-500 mb-2">
        {movie.genre} | {movie.duration} minutes
      </Text>

      {/*Step 2: Date picker */}
      <ShowDay selectedDate={selectedDate} onSelect={handleSelectDate} />

      {/* Step 3: Hall picker */}
      <HallPicker movieId={movieId} date={selectedDate} />

      {/* Step 4: Screen Picker */}
      {step === 4 && currentHallId && (
        <ScreenPicker
          hallId={currentHallId}
          movieId={movieId}
          date={selectedDate}
        />
      )}

      {/*Step 4: Time Slots */}
      {/* {showtimeLoading ? (
        <ActivityIndicator size="small" className="mt-4" />
      ) : (
        <Showtime
          selectedSlot={selectedSlot as keyof typeof Slots}
          showtimes={showtimes}
          onSelect={handleSelectSlot}
        />
      )} */}

      {/*Step 5: Goto Seat Booking page and select seats */}
      {/* {canBookSeat && (
        <TouchableOpacity
          className="mt-2 p-2 rounded-md bg-black"
          onPress={() =>
            router.push(`/seat?movieId=${currentMovie?._id}showId=`)
          }
        >
          <Text className="text-white text-center">Select seats</Text>
        </TouchableOpacity>
      )} */}
    </ScrollView>
  );
}
