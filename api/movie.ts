import api from "@/services/api";
import { ENDPOINTS } from "./endpoints";

export const getAllMovies = async () => {
  try {
    const response = await api.get(ENDPOINTS.MOVIES);
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
