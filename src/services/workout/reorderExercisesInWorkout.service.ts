import { AppDataSource } from "../../data-source";
import { WorkoutExercise } from "../../entities/workoutExercise.entity";
import { AppError } from "../../errors";
import { branchWorkoutIfNeeded } from "./_shared/branchWorkoutIfNeeded.service";

export const reorderExercisesInWorkoutService = async (
  microCycleId: string,
  workoutId: string,
  orderedWorkoutExerciseIds: string[],
): Promise<void> => {
  const workoutExerciseRepo = AppDataSource.getRepository(WorkoutExercise);

  const originals = await workoutExerciseRepo.find({
    where: { workout: { id: workoutId } },
    relations: ["exercise"],
    order: { position: "ASC" },
  });

  if (originals.length === 0) {
    throw new AppError("Treino não encontrado ou sem exercícios", 404);
  }

  const { finalWorkout } = await branchWorkoutIfNeeded(workoutId, microCycleId);

  const finalExercises = await workoutExerciseRepo.find({
    where: { workout: { id: finalWorkout.id } },
    relations: ["exercise"],
  });

  const originalById = new Map(originals.map((o) => [o.id, o]));

  const orderedFinal: WorkoutExercise[] = [];

  for (const originalId of orderedWorkoutExerciseIds) {
    const orig = originalById.get(originalId);
    if (!orig) {
      throw new AppError(
        `WorkoutExercise ${originalId} não pertence a este treino`,
        404,
      );
    }

    let match: WorkoutExercise | undefined;

    if (orig.position != null) {
      match = finalExercises.find(
        (fe) =>
          fe.exercise.id === orig.exercise.id && fe.position === orig.position,
      );
    }

    if (!match) {
      match = finalExercises.find((fe) => fe.exercise.id === orig.exercise.id);
    }

    if (!match) {
      throw new AppError(
        `WorkoutExercise correspondente não encontrado após branch`,
        500,
      );
    }

    orderedFinal.push(match);
  }

  for (let i = 0; i < orderedFinal.length; i++) {
    if (orderedFinal[i].position !== i) {
      orderedFinal[i].position = i;
      await workoutExerciseRepo.save(orderedFinal[i]);
    }
  }
};
