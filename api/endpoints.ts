export const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GET_USER: "/user",
  MOVIES: "/movie",
  SHOWTIME: "/show",
  HALL: "/hall",
  HALL_BY_MOVIE: "/hall/by-movie",
  SCREEN_BY_MOVIE: "/screen/by-movie-hall-date",
  GET_SCREEN: (id: string) => `screen/${id}`,
  MOVIE_DETAIL: (id: number) => `/movie/${id}`,
};
