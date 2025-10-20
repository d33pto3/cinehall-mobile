import api from "@/services/api";
import { ENDPOINTS } from "../endpoints";

export const fetchShowtimes = async (movieId: string, date: Date) => {
  const res = await api.get(ENDPOINTS.SHOWTIME, {
    params: {
      movieId,
      date,
    },
  });

  return res.data.data;
};
