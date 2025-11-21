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

  const workout = await workoutRepo.findOne({
    where: { id: workoutID },
    relations: ["workoutExercises", "workoutExercises.exercise"],
  });

  if (!workout) {
    throw new AppError("Treino não encontrado", 404);
  }

  if (updatedData.name) {
    workout.name = updatedData.name;
    await workoutRepo.save(workout);
  }

  if (updatedData.exercises && Array.isArray(updatedData.exercises)) {
    const exercisesPayload = updatedData.exercises as {
      exerciseId: string;
      targetSets: number;
      is_unilateral?: boolean;
    }[];

    const currentMaxPosition =
      workout.workoutExercises.length > 0
        ? Math.max(...workout.workoutExercises.map((we) => we.position))
        : -1;

    let nextPosition = currentMaxPosition + 1;

    for (const incoming of exercisesPayload) {
      const { exerciseId, targetSets } = incoming;

      const alreadyExists = workout.workoutExercises.some(
        (we) => String(we.exercise.id) === String(exerciseId)
      );
      if (alreadyExists) continue;

      const exercise = await exerciseRepo.findOneBy({ id: exerciseId });
      if (!exercise) {
        throw new AppError(
          `Exercício com ID ${exerciseId} não encontrado`,
          404
        );
      }

      const finalIsUnilateral =
        incoming.is_unilateral ?? exercise.default_unilateral ?? false;

      const newWorkoutExercise = workoutExerciseRepo.create({
        targetSets,
        is_unilateral: finalIsUnilateral,
        position: nextPosition++,
        workout,
        exercise,
      });

      await workoutExerciseRepo.save(newWorkoutExercise);
    }
  }

  const updatedWorkout = await workoutRepo.findOne({
    where: { id: workoutID },
    relations: ["workoutExercises", "workoutExercises.exercise"],
  });

  if (!updatedWorkout) {
    throw new AppError("Erro ao recarregar treino atualizado", 500);
  }

  updatedWorkout.workoutExercises.sort((a, b) => a.position - b.position);

  return returnWorkoutSchema.parse(updatedWorkout);
};

export default patchWorkoutService;
