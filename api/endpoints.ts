export const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GET_USER: "/user",
  MOVIES: "/movie",
  SHOWTIME: "/show",
  HALL: "/hall",
  HALL_BY_MOVIE: "/hall/by-movie",
  SCREEN_BY_MOVIE: "/screen/by-movie-hall-date",
  GET_SCREEN: (id: string) => `/screen/${id}`,
  GET_SEATS: (showId: string) => `/seat/shows/${showId}`,
  HOLD_SEATS: (showId: string) => `/seat/shows/${showId}/hold`,
  RELEASE_SEATS: (showId: string) => `/seat/shows/${showId}/release`,
  BOOK_SEATS: (showId: string) => `/seat/shows/${showId}/book`,
  MOVIE_DETAIL: (id: number) => `/movie/${id}`,
  CREATE_BOOKING: "/booking",
  GET_USER_BOOKINGS: (userId: string) => `/booking/user/${userId}`,
};

