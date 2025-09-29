// store/movieStore.ts
import { Movie } from "@/schemas/movieSchema";
import { create } from "zustand";

interface MovieState {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
}

export const useMovieStore = create<MovieState>((set) => ({
  movies: [],
  setMovies: (movies) => set({ movies }),
}));
