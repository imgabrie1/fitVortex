import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { Workout } from "../../entities/workout.entity";
import { AppError } from "../../errors";
import { iWorkout } from "../../interfaces/workout.interface";
import { WorkoutExercise } from "../../entities/workoutExercise.entity";
import { returnWorkoutSchema } from "../../schemas/workout.schema";

export const createWorkoutService = async (
  workoutData: iWorkout
): Promise<any> => {
  const workoutRepo = AppDataSource.getRepository(Workout);
  const exerciseRepo = AppDataSource.getRepository(Exercise);
  const workoutExerciseRepo = AppDataSource.getRepository(WorkoutExercise);

  const workout = workoutRepo.create({
    name: workoutData.name,
  });
  await workoutRepo.save(workout);

  const workoutExercisesPromises = workoutData.exercises.map(
    async (workoutExerciseData) => {
      const exercise = await exerciseRepo.findOneBy({
        id: workoutExerciseData.exerciseId,
      });

      if (!exercise) {
        throw new AppError(
          `Exercício com ID ${workoutExerciseData.exerciseId} não encontrado`,
          404
        );
      }

      const finalIsUnilateral =
        typeof workoutExerciseData.is_unilateral === "boolean"
          ? workoutExerciseData.is_unilateral
          : exercise.default_unilateral;

      const workoutExercise = workoutExerciseRepo.create({
        targetSets: workoutExerciseData.targetSets,
        is_unilateral: finalIsUnilateral,
        workout: workout,
        exercise: exercise,
      });

      return await workoutExerciseRepo.save(workoutExercise);
    }
  );

  const workoutExercises = await Promise.all(workoutExercisesPromises);

  workout.workoutExercises = workoutExercises;

  return returnWorkoutSchema.parse(workout);
};
