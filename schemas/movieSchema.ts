import * as z from "zod";

export const MovieSchema = z.object({
  _id: z.string(),
  title: z.string(),
  duration: z.number(),
  genre: z.string(),
  releaseDate: z.string(),
  imageUrl: z.string().optional(),
  imageId: z.string().optional(),
});

export const MovieResponesSchema = z.array(MovieSchema);

export type Movie = z.infer<typeof MovieSchema>;
export type Movies = z.infer<typeof MovieResponesSchema>;
