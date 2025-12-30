import { getMovie } from "@/api/movie/movie";
import { movieKeys } from "@/api/movie/movieKeys";
import { fetchShowtimes } from "@/api/showtime/showtime";
import HallPicker from "@/components/Movie/HallPicker";
import ScreenPicker from "@/components/Movie/ScreenPicker";
import ShowDay from "@/components/Movie/ShowDay";
import Showtime from "@/components/Movie/Showtime";
import { Slots } from "@/constants/showtime";
import { useBookingStore } from "@/store/bookingStore";
import { Show } from "@/types/show";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
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
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const {
    movie: currentMovie,
    hallId: currentHallId,
    screenId: currentScreenId,
    slot,
    date,
    step,
    setMovie,
    setDate,
    setSlot,
    setShow,
  } = useBookingStore();

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
  useEffect(() => {
    if (slot) setSelectedSlot(slot);
  }, [slot]);

  // select date handler function
  const handleSelectDate = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setSelectedSlot(null);
      setDate(date);
    },
    [setDate]
  );

  useEffect(() => {
    if (!currentMovie || !showtimes) {
      setCanBookSeat(false);
      return;
    }

    const hasShowtimeForDate =
      selectedSlot &&
      showtimes.some((show: Show) => show.slot === selectedSlot);

    setCanBookSeat(
      !!selectedSlot && !!currentMovie && !!selectedDate && hasShowtimeForDate
    );
  }, [selectedSlot, currentMovie, selectedDate, showtimes]);

  const handleSelectSlot = useCallback(
    (slot: string) => {
      setSelectedSlot(slot);
      setSlot(slot);
    },
    [setSlot]
  );

  const handleProceedToSeat = useCallback(() => {
    const selectedShow = showtimes?.find(
      (show: Show) => show.slot === selectedSlot
    );
    if (!selectedShow) return;

    setShow(selectedShow._id);
    router.push(`/seat/${selectedShow._id}?screenId=${currentScreenId}`);
  }, [showtimes, selectedSlot, setShow, currentScreenId]);

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#FAAA47" />
      </View>
    );

  if (isError || !movie)
    return (
      <View className="flex-1 justify-center items-center bg-background p-6">
        <Text className="text-white text-lg font-bold text-center">Curtains closed. Error loading details.</Text>
      </View>
    );

  return (
    <ScrollView className="flex-1 bg-background px-4">
      {/* Step 1: Selected Movie */}
      <Image
        source={{ uri: movie.imageUrl }}
        className="w-full h-[500px] rounded-2xl mb-6 shadow-2xl"
        resizeMode="cover"
      />
      <View className="mb-6">
        <Text className="text-3xl font-black text-white mb-2 italic">
          {movie.title.toUpperCase()}
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-primary font-bold">{movie.genre}</Text>
          <View className="w-1 h-1 rounded-full bg-muted" />
          <Text className="text-muted font-medium">{movie.duration} min</Text>
        </View>
      </View>

      {/*Step 2: Date picker */}
      <View className="mb-6">
        <Text className="text-white font-bold mb-4 uppercase tracking-widest text-xs">
          Step 1: Select Date
        </Text>
        <ShowDay selectedDate={selectedDate} onSelect={handleSelectDate} />
      </View>

      {/* Step 3: Hall picker */}
      <View className="mb-6">
        <Text className="text-white font-bold mb-2 uppercase tracking-widest text-xs opacity-60">
          Step 2: Choose Cinema
        </Text>
        <HallPicker movieId={movieId} date={selectedDate} />
      </View>

      {/* Step 4: Screen Picker */}
      {step >= 4 && currentHallId && (
        <View className="mb-6">
          <Text className="text-white font-bold mb-2 uppercase tracking-widest text-xs opacity-60">
            Step 3: Select Screen Type
          </Text>
          <ScreenPicker
            hallId={currentHallId}
            movieId={movieId}
            date={selectedDate}
          />
        </View>
      )}

      {/*Step 5: Time Slots */}
      {step >= 5 && (
        <View className="mb-8">
          <Text className="text-white font-bold mb-4 uppercase tracking-widest text-xs">
            Step 4: Available Showtime
          </Text>
          {showtimeLoading ? (
            <ActivityIndicator size="small" color="#FAAA47" />
          ) : (
            <Showtime
              selectedSlot={selectedSlot as keyof typeof Slots}
              showtimes={showtimes}
              onSelect={handleSelectSlot}
            />
          )}
        </View>
      )}

      {/*Step 6: Goto Seat Booking page and select seats */}
      {canBookSeat && step >= 6 && (
        <TouchableOpacity
          className="mt-4 mb-20 p-5 rounded-2xl bg-primary shadow-xl shadow-primary/30"
          onPress={handleProceedToSeat}
        >
          <Text className="text-black text-center font-black uppercase text-lg tracking-widest">
            Select Seats
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
