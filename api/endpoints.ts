export const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GET_USER: "/user",
  MOVIES: "/movie",
  MOVIE_DETAIL: (id: number) => `/movie/${id}`,
};
