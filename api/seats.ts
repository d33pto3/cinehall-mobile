import api from "@/services/api";
import { ENDPOINTS } from "./endpoints";

export const getSeats = async (showId: string) => {
  try {
    const response = await api.get(ENDPOINTS.GET_SEATS(showId));
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const holdSeats = async (
  showId: string,
  seatIds: string[],
  userId: string
) => {
  try {
    const response = await api.post(ENDPOINTS.HOLD_SEATS(showId), {
      seatIds,
      userId,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const releaseSeats = async (
  showId: string,
  seatIds: string[],
  userId: string
) => {
  try {
    const response = await api.post(ENDPOINTS.RELEASE_SEATS(showId), {
      seatIds,
      userId,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
