import { days, months } from "@/constants/date";

export const getDay = (day: number): string => {
  return days[day % 7] ?? "noday";
};

export const getMonth = (month: number): string => {
  return months[month] ?? "not valid";
};
