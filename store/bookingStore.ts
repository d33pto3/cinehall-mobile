import { Movie } from "@/schemas/movieSchema";
import { Seat } from "@/types/seat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookingState {
  step: number;
  movie: Movie | null;
  date: Date | null;
  hallId: string | null;
  screenId: string | null;
  slot: string | null;
  seats: Seat[] | [];
  showId: string | null;

  setMovie: (movie: Movie) => void;
  setDate: (date: Date | null) => void;
  setHall: (hallId: string | null) => void;
  setShow: (showId: string | null) => void;
  setScreen: (screenId: string | null) => void;
  setSlot: (slot: string) => void;
  addSeat: (seat: Seat) => void;
  removeSeat: (seatId: string) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      // step 1: no data is set
      step: 1,
      movie: null,
      date: null,
      hallId: null,
      screenId: null,
      slot: null,
      showId: null,
      seats: [],

      setMovie: (movie) => {
        const { movie: currentMovie } = get();

        // If same movie → do nothing
        if (currentMovie?._id === movie?._id) return;

        // step 2: New movie → reset dependent fields
        set({
          step: 2,
          movie,
          date: null,
          hallId: null,
          screenId: null,
          slot: null,
          showId: null,
          seats: [],
        });
      },

      // step 3: set Date
      setDate: (selectedDate) => {
        const { date: currentDate } = get();

        if (!selectedDate) {
          return set({
            step: 2,
            date: null,
            hallId: null,
            screenId: null,
            slot: null,
            showId: null,
            seats: [],
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
          step: 3,
          date: selectedDate,
          hallId: null,
          screenId: null,
          slot: null,
          showId: null,
          seats: [],
        });
      },

      // step 4: set Hall
      setHall: (selectedHall) => {
        const { hallId: currentHall } = get();
        if (selectedHall === currentHall) return;
        set({
          step: 4,
          hallId: selectedHall,
          screenId: null,
          slot: null,
          showId: null,
          seats: [],
        });
      },

      // step 5: set Screen
      setScreen: (selectedScreen) => {
        const { screenId: currentScreen } = get();
        if (selectedScreen === currentScreen) return;
        set({
          step: 5,
          screenId: selectedScreen,
          slot: null,
          showId: null,
          seats: [],
        });
      },

      // step 6: set Slot
      setSlot: (selectedSlot) => {
        const { slot: currentSlot } = get();
        if (currentSlot === selectedSlot) return;
        set({
          step: 6,
          slot: selectedSlot,
          showId: null,
          seats: [],
        });
      },

      // step 7: set Show
      setShow: (selectedShowId) => {
        const { showId: currentShowId } = get();
        if (selectedShowId === currentShowId) return;
        set({
          step: 7,
          showId: selectedShowId,
          seats: [],
        });
      },

      // Step 8: Add seat
      addSeat: (seat) =>
        set((state) => {
          const alreadySelected = state.seats.some((s) => s._id === seat._id);
          if (alreadySelected) return state;
          return { seats: [...state.seats, seat], step: 8 };
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
