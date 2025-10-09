import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { Workout } from "../../entities/workout.entity";
import { WorkoutExercise } from "../../entities/workoutExercise.entity";
import { AppError } from "../../errors";
import {
  iWorkoutReturn,
  iWorkoutUpdate,
} from "../../interfaces/workout.interface";
import { returnWorkoutSchema } from "../../schemas/workout.schema";

const patchWorkoutService = async (
  updatedData: iWorkoutUpdate,
  workoutID: string
): Promise<iWorkoutReturn> => {
  const workoutRepo = AppDataSource.getRepository(Workout);
  const workoutExerciseRepo = AppDataSource.getRepository(WorkoutExercise);
  const exerciseRepo = AppDataSource.getRepository(Exercise);

  const oldWorkout = await workoutRepo.findOne({
    where: { id: workoutID },
  });

  if (!oldWorkout) {
    throw new AppError("Treino não encontrado", 404);
  }

  if (updatedData.name) {
    oldWorkout.name = updatedData.name;
    await workoutRepo.save(oldWorkout);
  }

  if (updatedData.exercises && updatedData.exercises.length >= 0) {
    await workoutExerciseRepo.delete({ workout: { id: workoutID } });

    const exercisesPayload = updatedData.exercises as {
      exerciseId: string;
      targetSets: number;
    }[];

    const workoutExercisesPromises = exercisesPayload.map(
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

        const newWorkoutExercise = workoutExerciseRepo.create({
          targetSets: workoutExerciseData.targetSets,
          workout: oldWorkout,
          exercise: exercise,
        });

        return await workoutExerciseRepo.save(newWorkoutExercise);
      }
    );

    await Promise.all(workoutExercisesPromises);
  }

  const updatedWorkout = await workoutRepo.findOne({
    where: { id: workoutID },
    relations: ["workoutExercises", "workoutExercises.exercise"],
  });

  return returnWorkoutSchema.parse(updatedWorkout);
};

export default patchWorkoutService;