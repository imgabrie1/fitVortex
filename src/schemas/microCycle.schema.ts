import { z } from 'zod';


export const addWorkoutsToMicroCycleSchema = z.object({
  workoutIds: z.array(z.string().uuid()),
});

export const returnUserMinimalSchema = z.object({
  id: z.string().uuid()
});


export const createMicroCycleSchema = z.object({
  startDate: z.string().regex(
    /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-(\d{4})$/,
    "Invalid date format, must be DD-MM-YYYY"
  ),
  trainingDays: z.number().int().positive(),       // novo campo
  macroCycleId: z.string().uuid().nullable().optional(),
});

export const returnMicroCycleSchema = z.object({
  id: z.string().uuid(),
  startDate: z.string().or(z.date()),
  trainingDays: z.number().int().positive(),
  macroCycleId: z.string().uuid().nullable(),
  user: z.object({ id: z.string().uuid() }),
});
