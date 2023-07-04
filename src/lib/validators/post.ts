import { z } from "zod";

export const postValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Must be longer than 3 characters." })
    .max(128, { message: "Title must be less than 128 characters." }),
  huddlId: z.string(),
  content: z.any(),
});

export type postCreationRequest = z.infer<typeof postValidator>;
