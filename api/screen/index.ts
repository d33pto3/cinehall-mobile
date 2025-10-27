import api from "@/services/api";
import { ENDPOINTS } from "../endpoints";

export const getScreensByHallMovieAndDate = async (
  movieId: string,
  hallId: string,
  date: Date
) => {
  try {
    const response = await api.get(ENDPOINTS.SCREEN_BY_MOVIE, {
      params: {
        movieId,
        hallId,
        date,
      },
    });

    return response.data.data;
  } catch (err) {
    throw err;
  }
};
