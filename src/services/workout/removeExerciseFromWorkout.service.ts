import { AppDataSource } from "../../data-source";
import { WorkoutExercise } from "../../entities/workoutExercise.entity";
import { AppError } from "../../errors";
import { branchWorkoutIfNeeded } from "./_shared/branchWorkoutIfNeeded.service";

export const removeExerciseFromWorkoutService = async (
  microCycleId: string,
  workoutId: string,
  workoutExerciseId: string,
): Promise<void> => {
  const workoutExerciseRepo = AppDataSource.getRepository(WorkoutExercise);

  const workoutExercise = await workoutExerciseRepo.findOne({
    where: {
      id: workoutExerciseId,
      workout: { id: workoutId },
    },
    relations: ["exercise"],
  });

  if (!workoutExercise) {
    throw new AppError("Exercício não encontrado neste treino", 404);
  }

  const { finalWorkout } = await branchWorkoutIfNeeded(
    workoutId,
    microCycleId,
  );

  let targetWe: WorkoutExercise | null = null;

  if (workoutExercise.position != null) {
    targetWe = await workoutExerciseRepo.findOne({
      where: {
        workout: { id: finalWorkout.id },
        exercise: { id: workoutExercise.exercise.id },
        position: workoutExercise.position,
      },
    });
  }

  if (!targetWe) {
    targetWe = await workoutExerciseRepo.findOne({
      where: {
        workout: { id: finalWorkout.id },
        exercise: { id: workoutExercise.exercise.id },
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

  await workoutExerciseRepo.remove(targetWe);

  const remaining = await workoutExerciseRepo.find({
    where: { workout: { id: finalWorkout.id } },
    order: { position: "ASC" },
  });

  for (let i = 0; i < remaining.length; i++) {
    if (remaining[i].position !== i) {
      remaining[i].position = i;
      await workoutExerciseRepo.save(remaining[i]);
    }
  }
};