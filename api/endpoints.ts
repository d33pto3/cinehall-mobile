export const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GET_USER: "/user",
  MOVIES: "/movie",
  SHOWTIME: "/show",
  HALL: "/hall",
  HALL_BY_MOVIE: "/hall/by-movie",
  MOVIE_DETAIL: (id: number) => `/movie/${id}`,
};
