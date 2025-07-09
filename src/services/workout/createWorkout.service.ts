import { In } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { Workout } from "../../entities/workout.entity";
import { AppError } from "../../errors";
import { iWorkout, iWorkoutReturn } from "../../interfaces/workout.interface";
import { returnWorkoutSchema } from "../../schemas/workout.schema";

export const createWorkoutService = async (
  workoutData: iWorkout
): Promise<iWorkoutReturn> => {
  const workoutRepo  = AppDataSource.getRepository(Workout);
  const exerciseRepo = AppDataSource.getRepository(Exercise);

  const exercises = await exerciseRepo.findBy({
    id: In(workoutData.exerciseIds)
  });

  if (exercises.length !== workoutData.exerciseIds.length) {
    throw new AppError("Algum exercício não foi encontrado", 404);
  }

  const workout = workoutRepo.create({
    name: workoutData.name,
    exercises
  });
  await workoutRepo.save(workout);

  const output = {
    id: workout.id,
    name: workout.name,
    exerciseIds: workoutData.exerciseIds
  };

  const returnData = returnWorkoutSchema.parse(output);

  return returnData;
};
