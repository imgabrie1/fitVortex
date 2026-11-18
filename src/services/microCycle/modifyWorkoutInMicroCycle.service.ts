import { In, Not } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { MicroCycle } from "../../entities/microCycle.entity";
import { MicroCycleItem } from "../../entities/microCycleItem.entity";
import { Workout } from "../../entities/workout.entity";
import { WorkoutExercise } from "../../entities/workoutExercise.entity";
import { AppError } from "../../errors";
import { getMicroCycleByIDService } from "./getMicroCycleById.service";

export type WorkoutModifyOperation =
  | { type: "REMOVE"; exerciseId: string }
  | {
      type: "REPLACE";
      oldExerciseId: string;
      newExerciseId: string;
      targetSets: number;
      is_unilateral?: boolean;
      notes?: string | null;
    }
  | { type: "REORDER"; orderedExerciseIds: string[] }
  | {
      type: "ADD";
      exerciseId: string;
      targetSets: number;
      is_unilateral?: boolean;
      notes?: string | null;
    };

export interface IModifyWorkoutInMicroCycle {
  cycleItemId?: string;
  operation: WorkoutModifyOperation;
}

export const modifyWorkoutInMicroCycleService = async (
  microCycleId: string,
  workoutId: string,
  userID: string,
  payload: IModifyWorkoutInMicroCycle
): Promise<MicroCycle> => {
  const microRepo = AppDataSource.getRepository(MicroCycle);
  const macroRepo = AppDataSource.getRepository(MacroCycle);
  const workoutRepo = AppDataSource.getRepository(Workout);
  const workoutExerciseRepo = AppDataSource.getRepository(WorkoutExercise);
  const exerciseRepo = AppDataSource.getRepository(Exercise);
  const microCycleItemRepo = AppDataSource.getRepository(MicroCycleItem);

  const currentMicro = await microRepo.findOne({
    where: { id: microCycleId },
    relations: [
      "user",
      "macroCycle",
      "cycleItems",
      "cycleItems.workout",
      "cycleItems.workout.workoutExercises",
      "cycleItems.workout.workoutExercises.exercise",
      "cycleItems.sets",
    ],
  });

  if (!currentMicro) throw new AppError("Microciclo não encontrado", 404);
  if (currentMicro.user.id !== userID) throw new AppError("Não autorizado", 403);

  const currentItem = currentMicro.cycleItems.find(
    (ci) =>
      (payload.cycleItemId && ci.id === payload.cycleItemId) ||
      ci.workout?.id === workoutId
  );

  if (!currentItem) {
    throw new AppError("Treino não encontrado neste microciclo", 404);
  }

  const currentWorkout = await workoutRepo.findOne({
    where: { id: currentItem.workout.id },
    relations: ["workoutExercises", "workoutExercises.exercise", "volume"],
  });

  if (!currentWorkout) {
    throw new AppError("Treino não encontrado", 404);
  }

  const currentExercises = (currentWorkout.workoutExercises || []).sort(
    (a, b) => a.position - b.position
  );

  let updatedList: {
    exercise: Exercise;
    targetSets: number;
    is_unilateral: boolean;
    notes: string | null;
    position: number;
  }[] = [];

  const { operation } = payload;

  if (operation.type === "REMOVE") {
    updatedList = currentExercises
      .filter((we) => we.exercise.id !== operation.exerciseId)
      .map((we, idx) => ({
        exercise: we.exercise,
        targetSets: we.targetSets,
        is_unilateral: we.is_unilateral,
        notes: we.notes,
        position: idx,
      }));
  } else if (operation.type === "REPLACE") {
    const newEx = await exerciseRepo.findOneBy({ id: operation.newExerciseId });
    if (!newEx) {
      throw new AppError(
        `Exercício substituto ${operation.newExerciseId} não encontrado`,
        404
      );
    }

    updatedList = currentExercises.map((we, idx) => {
      if (we.exercise.id === operation.oldExerciseId) {
        return {
          exercise: newEx,
          targetSets: operation.targetSets,
          is_unilateral:
            operation.is_unilateral ?? newEx.default_unilateral ?? false,
          notes: operation.notes !== undefined ? operation.notes : we.notes,
          position: idx,
        };
      }
      return {
        exercise: we.exercise,
        targetSets: we.targetSets,
        is_unilateral: we.is_unilateral,
        notes: we.notes,
        position: idx,
      };
    });
  } else if (operation.type === "REORDER") {
    for (let i = 0; i < operation.orderedExerciseIds.length; i++) {
      const exId = operation.orderedExerciseIds[i];
      const found = currentExercises.find((we) => we.exercise.id === exId);
      if (found) {
        updatedList.push({
          exercise: found.exercise,
          targetSets: found.targetSets,
          is_unilateral: found.is_unilateral,
          notes: found.notes,
          position: i,
        });
      }
    }
  } else if (operation.type === "ADD") {
    const newEx = await exerciseRepo.findOneBy({ id: operation.exerciseId });
    if (!newEx) {
      throw new AppError(`Exercício ${operation.exerciseId} não encontrado`, 404);
    }

    updatedList = currentExercises.map((we, idx) => ({
      exercise: we.exercise,
      targetSets: we.targetSets,
      is_unilateral: we.is_unilateral,
      notes: we.notes,
      position: idx,
    }));

    updatedList.push({
      exercise: newEx,
      targetSets: operation.targetSets,
      is_unilateral:
        operation.is_unilateral ?? newEx.default_unilateral ?? false,
      notes: operation.notes ?? null,
      position: updatedList.length,
    });
  } else {
    throw new AppError("Operação inválida", 400);
  }

  const targetCycleItems: MicroCycleItem[] = [currentItem];

  if (currentMicro.macroCycle) {
    const macro = await macroRepo.findOne({
      where: { id: currentMicro.macroCycle.id },
      relations: [
        "microCycles",
        "microCycles.cycleItems",
        "microCycles.cycleItems.workout",
        "microCycles.cycleItems.sets",
      ],
    });

    if (macro && macro.microCycles) {
      const getMicroNumber = (name: string) => {
        const match = name.match(/(\d+)/g);
        if (match && match.length > 0) {
          return parseInt(match[match.length - 1], 10);
        }
        return 0;
      };

      const sortedMicros = [...macro.microCycles].sort((a, b) => {
        const numA = getMicroNumber(a.microCycleName);
        const numB = getMicroNumber(b.microCycleName);
        if (numA !== numB) return numA - numB;
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

      const currentMicroIndex = sortedMicros.findIndex(
        (m) => m.id === currentMicro.id
      );

      if (currentMicroIndex !== -1) {
        for (let i = currentMicroIndex + 1; i < sortedMicros.length; i++) {
          const futureMicro = sortedMicros[i];
          const matchingItem = futureMicro.cycleItems?.find(
            (ci) => ci.workout?.name === currentWorkout.name
          );

          if (matchingItem) {
            const isPerformed =
              matchingItem.completedAt !== null ||
              (matchingItem.sets && matchingItem.sets.length > 0) ||
              matchingItem.isSkipped;

            if (!isPerformed) {
              targetCycleItems.push(matchingItem);
            }
          }
        }
      }
    }
  }

  const targetItemIds = targetCycleItems.map((ci) => ci.id);

  const otherReferencesCount = await microCycleItemRepo
    .createQueryBuilder("ci")
    .where("ci.workoutId = :wId", { wId: currentWorkout.id })
    .andWhere("ci.id NOT IN (:...targetItemIds)", { targetItemIds })
    .getCount();

  let finalWorkout: Workout;

  if (otherReferencesCount > 0) {
    finalWorkout = workoutRepo.create({
      name: currentWorkout.name,
      volume: currentWorkout.volume,
    });
    await workoutRepo.save(finalWorkout);

    for (const item of updatedList) {
      const newWe = workoutExerciseRepo.create({
        workout: finalWorkout,
        exercise: item.exercise,
        targetSets: item.targetSets,
        is_unilateral: item.is_unilateral,
        notes: item.notes,
        position: item.position,
      });
      await workoutExerciseRepo.save(newWe);
    }

    for (const ci of targetCycleItems) {
      ci.workout = finalWorkout;
      await microCycleItemRepo.save(ci);
    }
  } else {
    finalWorkout = currentWorkout;

    await workoutExerciseRepo.delete({ workout: { id: currentWorkout.id } });

    for (const item of updatedList) {
      const newWe = workoutExerciseRepo.create({
        workout: finalWorkout,
        exercise: item.exercise,
        targetSets: item.targetSets,
        is_unilateral: item.is_unilateral,
        notes: item.notes,
        position: item.position,
      });
      await workoutExerciseRepo.save(newWe);
    }

    for (const ci of targetCycleItems) {
      if (ci.workout?.id !== finalWorkout.id) {
        ci.workout = finalWorkout;
        await microCycleItemRepo.save(ci);
      }
    }
  }

  return getMicroCycleByIDService(microCycleId, userID);
};
