import api from "@/services/api";
import { ENDPOINTS } from "../endpoints";

export const getHallsByMovieAndDate = async (movieId: string, date: Date) => {
  try {
    const response = await api.get(ENDPOINTS.HALL_BY_MOVIE, {
      params: {
        movieId,
        date,
      },
    });

    return response.data.data;
  } catch (err) {
    throw err;
  }
};
