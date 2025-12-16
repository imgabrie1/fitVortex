import { string, z } from "zod";
import { ResistanceType } from "../entities/exercise.entity";
import { MuscleGroup } from "../enum/muscleGroup.enum";

const workoutExerciseSchema = z.object({
  exerciseId: z.string().uuid("ID de exercício inválido"),
  notes: z.string().max(255).optional(),
  targetSets: z
    .number()
    .int()
    .min(1, "O número de séries alvo deve ser no mínimo 1"),
  is_unilateral: z.boolean(),
});

export const workoutSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres"),
  exercises: z.array(workoutExerciseSchema),
  // .min(1, "O treino deve ter no mínimo 1 exercício"),
});

export const returnWorkoutSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  workoutExercises: z.array(
    z.object({
      id: z.string().uuid(),
      targetSets: z.number(),
      exercise: z.object({
        id: z.string().uuid(),
        name: z.string(),
        description: z.string().nullable(),
        primaryMuscle: z.string(),
        secondaryMuscle: z.array(z.string()).nullable(),
      }),
    })
  ),
});

export const updateWorkoutSchema = workoutSchema.partial();
