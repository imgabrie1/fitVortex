import { string, z } from "zod";
import { returnWorkoutSchema } from "./workout.schema";

export const createMicroCycleSchema = z.object({
  microCycleName: z.string(),
  trainingDays: z.number().int().positive()
});

export const returnMicroCycleSchema = z.object({
  id: z.string().uuid(),
  microCycleName: z.string(),
  createdAt: z.date().or(string()),
  trainingDays: z.number().int().positive(),
  user: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
  }),
});

export const returnMicroCycleWithWorkoutsSchema = returnMicroCycleSchema.extend(
  { workouts: z.array(returnWorkoutSchema)}
);