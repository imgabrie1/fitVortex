import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { WorkoutExercise } from "../../entities/workoutExercise.entity";
import { Workout } from "../../entities/workout.entity";
import { AppError } from "../../errors";
import { iWorkoutReturn } from "../../interfaces/workout.interface";
import { returnWorkoutSchema } from "../../schemas/workout.schema";
import { branchWorkoutIfNeeded } from "./_shared/branchWorkoutIfNeeded.service";

interface IReplaceExercisePayload {
  newExerciseId: string;
  targetSets: number;
  is_unilateral?: boolean;
  notes?: string | null;
}

export const replaceExerciseInWorkoutService = async (
  microCycleId: string,
  workoutId: string,
  workoutExerciseId: string,
  payload: IReplaceExercisePayload,
): Promise<iWorkoutReturn> => {
  const workoutExerciseRepo = AppDataSource.getRepository(WorkoutExercise);
  const exerciseRepo = AppDataSource.getRepository(Exercise);
  const workoutRepo = AppDataSource.getRepository(Workout);

  const original = await workoutExerciseRepo.findOne({
    where: {
      id: workoutExerciseId,
      workout: { id: workoutId },
    },
    relations: ["exercise"],
  });

  if (!original) {
    throw new AppError("Exercício não encontrado neste treino", 404);
  }

  const newExercise = await exerciseRepo.findOneBy({
    id: payload.newExerciseId,
  });
  if (!newExercise) {
    throw new AppError(
      `Exercício substituto com ID ${payload.newExerciseId} não encontrado`,
      404,
    );
  }

  const { finalWorkout } = await branchWorkoutIfNeeded(workoutId, microCycleId);

  let targetWe: WorkoutExercise | null = null;

  if (original.position != null) {
    targetWe = await workoutExerciseRepo.findOne({
      where: {
        workout: { id: finalWorkout.id },
        exercise: { id: original.exercise.id },
        position: original.position,
      },
    });
  }

  if (!targetWe) {
    targetWe = await workoutExerciseRepo.findOne({
      where: {
        workout: { id: finalWorkout.id },
        exercise: { id: original.exercise.id },
      },
      order: { position: "ASC" },
    });
  }

  if (!targetWe) {
    throw new AppError(
      "Exercício não encontrado no treino alvo após branch",
      404,
    );
  }

  const dup = await workoutExerciseRepo.findOne({
    where: {
      workout: { id: finalWorkout.id },
      exercise: { id: payload.newExerciseId },
    },
  });
  if (dup && dup.id !== targetWe.id) {
    throw new AppError("Este exercício já está neste treino", 409);
  }

  targetWe.exercise = newExercise;
  targetWe.targetSets = payload.targetSets;
  targetWe.is_unilateral =
    payload.is_unilateral ?? newExercise.default_unilateral ?? false;
  targetWe.notes =
    payload.notes !== undefined ? (payload.notes ?? null) : targetWe.notes;

  await workoutExerciseRepo.save(targetWe);

  const updated = await workoutRepo.findOne({
    where: { id: finalWorkout.id },
    relations: ["workoutExercises", "workoutExercises.exercise"],
  });

  if (!updated) throw new AppError("Erro ao recarregar treino atualizado", 500);

  updated.workoutExercises.sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  );
  return returnWorkoutSchema.parse(updated);
};
