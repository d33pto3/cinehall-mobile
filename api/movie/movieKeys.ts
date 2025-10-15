// api/movieKeys.ts
export const movieKeys = {
  all: ["movies"] as const,
  lists: () => [...movieKeys.all, "list"] as const,
  nowShowing: () => [...movieKeys.lists(), "nowShowing"] as const,
  details: (id: string) => [...movieKeys.all, "detail", id] as const,
};
