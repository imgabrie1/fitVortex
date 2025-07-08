import { z } from "zod";
import { MuscleGroup } from "../enum/muscleGroup.enum";

export const exerciseSchema = z.object({
  name: z.string().max(50),
  description: z.string().nullable(),
  primaryMuscle: z.nativeEnum(MuscleGroup),
  secondaryMuscle: z.nativeEnum(MuscleGroup).nullable().optional(),
});

export const returnExerciseSchema = exerciseSchema.extend({
  id: z.string(),
});

export const returnMultipleExerciseSchema = returnExerciseSchema.array();
