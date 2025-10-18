import { days } from "@/constants/day";

export const getDay = (day: number): string => {
  return days[day % 7] ?? "noday";
};
