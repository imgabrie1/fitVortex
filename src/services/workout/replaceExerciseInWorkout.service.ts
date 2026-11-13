import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { WorkoutExercise } from "../../entities/workoutExercise.entity";
import { AppError } from "../../errors";
import { iWorkoutReturn } from "../../interfaces/workout.interface";
import { Workout } from "../../entities/workout.entity";
import { returnWorkoutSchema } from "../../schemas/workout.schema";

interface IReplaceExercisePayload {
  newExerciseId: string;
  targetSets: number;
  is_unilateral?: boolean;
  notes?: string | null;
}

export const replaceExerciseInWorkoutService = async (
  workoutId: string,
  workoutExerciseId: string,
  payload: IReplaceExercisePayload
): Promise<iWorkoutReturn> => {
  const workoutExerciseRepo = AppDataSource.getRepository(WorkoutExercise);
  const exerciseRepo = AppDataSource.getRepository(Exercise);
  const workoutRepo = AppDataSource.getRepository(Workout);

  const workoutExercise = await workoutExerciseRepo.findOne({
    where: {
      id: workoutExerciseId,
      workout: { id: workoutId },
    },
    relations: ["workout", "exercise"],
  });

  if (!workoutExercise) {
    throw new AppError("Exercício não encontrado neste treino", 404);
  }

  const newExercise = await exerciseRepo.findOneBy({ id: payload.newExerciseId });
  if (!newExercise) {
    throw new AppError(`Exercício substituto com ID ${payload.newExerciseId} não encontrado`, 404);
  }

  const alreadyExists = await workoutExerciseRepo.findOne({
    where: {
      workout: { id: workoutId },
      exercise: { id: payload.newExerciseId },
    },
  });

  if (alreadyExists && alreadyExists.id !== workoutExerciseId) {
    throw new AppError("Este exercício já está neste treino", 409);
  }


  workoutExercise.exercise = newExercise;
  workoutExercise.targetSets = payload.targetSets;
  workoutExercise.is_unilateral =
    payload.is_unilateral ?? newExercise.default_unilateral ?? false;
  workoutExercise.notes = payload.notes !== undefined ? payload.notes ?? null : workoutExercise.notes;

  await workoutExerciseRepo.save(workoutExercise);

  const updatedWorkout = await workoutRepo.findOne({
    where: { id: workoutId },
    relations: ["workoutExercises", "workoutExercises.exercise"],
  });

  if (!updatedWorkout) {
    throw new AppError("Erro ao recarregar treino atualizado", 500);
  }

  updatedWorkout.workoutExercises.sort((a, b) => a.position - b.position);

  return returnWorkoutSchema.parse(updatedWorkout);
};
