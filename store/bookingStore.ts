import { Movie } from "@/schemas/movieSchema";
import { Seat } from "@/types/seat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookingState {
  movie: Movie | null;
  hallId: string | null;
  screenId: string | null;
  date: Date | null;
  slot: string | null;
  seats: Seat[];
  step: number;

  setMovie: (movie: Movie) => void;
  setDate: (date: Date | null) => void;
  setHall: (hallId: string | null) => void;
  setScreen: (screenId: string | null) => void;
  setSlot: (slot: string) => void;
  addSeat: (seat: Seat) => void;
  removeSeat: (seatId: string) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      movie: null,
      date: null,
      slot: null,
      hallId: null,
      screenId: null,
      seats: [],
      step: 1,

      setMovie: (movie) => {
        const { movie: currentMovie } = get();

        // If same movie → do nothing
        if (currentMovie?._id === movie?._id) return;

        // New movie → reset dependent fields
        set({
          movie,
          date: null,
          hallId: null,
          slot: null,
          seats: [],
          step: 2,
        });
      },

      setDate: (selectedDate) => {
        const { date: currentDate } = get();

        if (!selectedDate) {
          return set({
            date: null,
            hallId: null,
            screenId: null,
            slot: null,
            seats: [],
            step: 2,
          });
        }

        if (
          currentDate &&
          new Date(currentDate).toLocaleDateString() ===
            selectedDate?.toLocaleDateString()
        ) {
          return;
        }

        // New date → reset slot and seats
        set({
          date: selectedDate,
          hallId: null,
          screenId: null,
          slot: null,
          seats: [],
          step: 3,
        });
      },

      // step 4: set Hall
      setHall: (selectedHall) => {
        const { hallId: currentHall } = get();
        if (selectedHall === currentHall) return;
        set({ hallId: selectedHall, screenId: null, step: 4, slot: null });
      },

      // step 5: set Screen
      setScreen: (selectedScreen) => {
        const { screenId: currentScreen } = get();
        if (selectedScreen === currentScreen) return;
        set({ screenId: selectedScreen, slot: null, step: 5 });
      },

      setSlot: (slot) => {
        const { slot: currentSlot } = get();
        if (currentSlot === slot) return;
        set({ slot, step: 4, seats: [] });
      },

      addSeat: (seat) =>
        set((state) => {
          const alreadySelected = state.seats.some((s) => s._id === seat._id);
          if (alreadySelected) return state;
          return { seats: [...state.seats, seat], step: 5 };
        }),

      removeSeat: (seatId) =>
        set((state) => ({
          seats: state.seats.filter((s) => s._id !== seatId),
        })),

      resetBooking: () =>
        set({
          movie: null,
          date: null,
          slot: null,
          seats: [],
          step: 1,
        }),
    }),
    {
      name: "booking-storage",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          if (!value) return null;
          const parsed = JSON.parse(value);
          return {
            ...parsed,
            date: parsed.date ? new Date(parsed.date) : null,
          };
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
