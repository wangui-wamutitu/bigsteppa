import { z } from "zod";

export const createChallengeSchema = z.object({
  name: z.string().min(1, "Challenge name is required"),
  userId: z.string().uuid("Invalid user ID"),
  durationValue: z.number().int().min(1, "Duration must be at least 1"),
  durationUnit: z.enum(["Days", "Weeks", "Months", "Years"]),
  startDate: z.coerce.date(), // allows string/Date and coerces it
  reminderTime: z
    .string()
    .regex(
      /^([0-1]\d|2[0-3]):([0-5]\d)$/,
      "Reminder time must be in HH:mm format"
    ),
  description: z.string().optional()
});

export const createChallengeLogSchema = z.object({
    challengeId: z.string().uuid("Invalid challenge ID"),
    dailyReflection: z.string().optional(),
    url: z.string().url()
})

export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
export type CreateChallengeLogInput = z.infer<typeof createChallengeLogSchema>;
