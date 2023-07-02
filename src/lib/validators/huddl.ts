import { z } from "zod";

export const huddlValidator = z.object({
  name: z.string().min(3).max(21),
});

export const huddlSubscriptionValidator = z.object({
  subredditId: z.string(),
});

export type createHuddlPayload = z.infer<typeof huddlValidator>;
export type subscribeToHuddlPayload = z.infer<
  typeof huddlSubscriptionValidator
>;
