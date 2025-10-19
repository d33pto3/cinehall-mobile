import { Movie } from "@/schemas/movieSchema";
import { Seat } from "@/types/seat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookingState {
  movie: Movie | null;
  date: Date | null;
  showtime: string | null;
  seats: Seat[];
  step: number;

  setMovie: (movie: Movie) => void;
  setDate: (date: Date) => void;
  setShowtime: (showtime: string) => void;
  addSeat: (seat: Seat) => void;
  removeSeat: (seatId: string) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      movie: null,
      date: null,
      showtime: null,
      seats: [],
      step: 1,

      setMovie: (movie) => set({ movie, step: 2 }),
      setDate: (date) => set({ date, step: 3 }),
      setShowtime: (showtime) => set({ showtime, step: 4 }),

      addSeat: (seat) =>
        set((state) => {
          // prevent duplicate seats
          const alreadySelected = state.seats.some((s) => s._id === seat._id);
          if (alreadySelected) return state;
          return { seats: [...state.seats, seat] };
        }),

      removeSeat: (seatId) =>
        set((state) => ({
          seats: state.seats.filter((s) => s._id !== seatId),
        })),

      resetBooking: () =>
        set({
          movie: null,
          date: null,
          showtime: null,
          seats: [],
          step: 1,
        }),
    }),
    {
      name: "booking-storage", // key in AsyncStorage/localStorage
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
