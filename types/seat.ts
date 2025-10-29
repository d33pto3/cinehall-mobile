// types/seat.ts
export interface Seat {
  _id: string;
  showId: string;
  seatNumber: string;
  row: string;
  column: number;
  status?: "AVAILABLE" | "BOOKED" | "HELD";
  heldBy?: string | null;
  isHeld: boolean | null;
  heldUntil?: string | null;
}
