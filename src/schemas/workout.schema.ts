import { z } from 'zod';

export const workoutSchema = z.object({
  name: z.string().min(3).max(50),
  exerciseIDs: z.array(z.string().uuid()),
});

export const returnWorkoutSchema = workoutSchema.extend({
  id: z.string().uuid(),
});
