import { z } from 'zod';

export const setSchema = z.object({
  reps: z.number().int().positive(),
  weight: z.number().positive(),
  notes: z.string().max(255).optional(),
});

export const recordWorkoutSchema = z.object({
  exercises: z.array(
    z.object({
      exerciseID: z.string().uuid(),
      sets: z.array(setSchema).min(1, { message: 'É necessário registrar pelo menos uma série por exercício.' }),
    })
  ).min(1, { message: 'É necessário registrar pelo menos um exercício.' }),
});
