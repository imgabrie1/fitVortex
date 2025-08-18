import { z } from 'zod';
import { MuscleGroup } from '../enum/muscleGroup.enum';

export const exerciseSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().nullable().optional(),
  primaryMuscle: z.nativeEnum(MuscleGroup),
  secondaryMuscle: z.array(z.nativeEnum(MuscleGroup)).nullable().default(null),
});

export const returnExerciseSchema = exerciseSchema.extend({
  id: z.string().uuid(),
});

export const returnMultipleExerciseSchema = z.array(returnExerciseSchema);