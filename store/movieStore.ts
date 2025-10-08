// store/movieStore.ts
import { Movie } from "@/schemas/movieSchema";
import { create } from "zustand";

interface MovieState {
  movies: Movie[];
  nowShowing: Movie[];
  setMovies: (movies: Movie[]) => void;
  setNowShowing: (movies: Movie[]) => void;
}

export const useMovieStore = create<MovieState>((set) => ({
  movies: [],
  nowShowing: [],
  setMovies: (movies) => set({ movies }),
  setNowShowing: (movies) => set({ nowShowing: movies }),
}));
