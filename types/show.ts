export interface Show {
  _id: string;
  basePrice: number;
  endTime: Date;
  movieId: {
    _id: string;
    title: string;
  };
  screenId: {
    _id: string;
    name: string;
  };
  slot: string;
  // createdAt: Date;
  // updatedAt: Date;
}
