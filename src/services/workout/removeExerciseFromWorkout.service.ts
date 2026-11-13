import { AppDataSource } from "../../data-source";
import { WorkoutExercise } from "../../entities/workoutExercise.entity";
import { AppError } from "../../errors";

export const removeExerciseFromWorkoutService = async (
  workoutId: string,
  workoutExerciseId: string
): Promise<void> => {
  const workoutExerciseRepo = AppDataSource.getRepository(WorkoutExercise);

  const workoutExercise = await workoutExerciseRepo.findOne({
    where: {
      id: workoutExerciseId,
      workout: { id: workoutId },
    },
    relations: ["workout"],
  });

  if (!workoutExercise) {
    throw new AppError("Exercício não encontrado neste treino", 404);
  }

  await workoutExerciseRepo.remove(workoutExercise);
};
