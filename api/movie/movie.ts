import api from "@/services/api";
import { ENDPOINTS } from "../endpoints";

export const getAllMovies = async () => {
  try {
    const response = await api.get(ENDPOINTS.MOVIES);
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getNowShowingMovies = async () => {
  try {
    const response = await api.get("/movie/now-showing");
    return response.data.movies;
  } catch (error) {
    throw error;
  }
};

export const getMovie = async (id: string) => {
  try {
    const response = await api.get(`/movie/${id}`);
    return response.data.movie;
  } catch (error) {
    throw error;
  }
};
