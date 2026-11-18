import { AppDataSource } from "../../../data-source";
import { MacroCycle } from "../../../entities/macroCycle.entity";
import { MicroCycle } from "../../../entities/microCycle.entity";
import { MicroCycleItem } from "../../../entities/microCycleItem.entity";
import { Workout } from "../../../entities/workout.entity";
import { WorkoutExercise } from "../../../entities/workoutExercise.entity";
import { WorkoutVolume } from "../../../entities/workoutVolume.entity";
import { WorkoutVolumeEntry } from "../../../entities/workoutVolumeEntry.entity";
import { AppError } from "../../../errors";

interface IBranchResult {
  finalWorkout: Workout;
  targetItems: MicroCycleItem[];
  wasBranched: boolean;
}

export const branchWorkoutIfNeeded = async (
  workoutId: string,
  microCycleId: string,
): Promise<IBranchResult> => {
  const microRepo = AppDataSource.getRepository(MicroCycle);
  const macroRepo = AppDataSource.getRepository(MacroCycle);
  const workoutRepo = AppDataSource.getRepository(Workout);
  const workoutExerciseRepo = AppDataSource.getRepository(WorkoutExercise);
  const microCycleItemRepo = AppDataSource.getRepository(MicroCycleItem);
  const volumeRepo = AppDataSource.getRepository(WorkoutVolume);
  const volumeEntryRepo = AppDataSource.getRepository(WorkoutVolumeEntry);

  const currentMicro = await microRepo.findOne({
    where: { id: microCycleId },
    relations: [
      "macroCycle",
      "cycleItems",
      "cycleItems.workout",
      "cycleItems.sets",
    ],
  });

  if (!currentMicro) throw new AppError("Microciclo não encontrado", 404);

  const currentWorkout = await workoutRepo.findOne({
    where: { id: workoutId },
    relations: [
      "workoutExercises",
      "workoutExercises.exercise",
      "volume",
      "volume.entries",
    ],
  });

  if (!currentWorkout) throw new AppError("Treino não encontrado", 404);

  const currentItem = currentMicro.cycleItems.find(
    (ci) => ci.workout?.id === workoutId,
  );

  if (!currentItem) {
    throw new AppError("Treino não encontrado neste microciclo", 404);
  }

  const targetItems: MicroCycleItem[] = [currentItem];

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

    if (macro?.microCycles) {
      const getMicroNumber = (name: string) => {
        const match = name.match(/(\d+)/g);
        return match && match.length > 0
          ? parseInt(match[match.length - 1], 10)
          : 0;
      };

      const sortedMicros = [...macro.microCycles].sort((a, b) => {
        const na = getMicroNumber(a.microCycleName);
        const nb = getMicroNumber(b.microCycleName);
        if (na !== nb) return na - nb;
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

      const currentIdx = sortedMicros.findIndex(
        (m) => m.id === currentMicro.id,
      );

      if (currentIdx !== -1) {
        for (let i = currentIdx + 1; i < sortedMicros.length; i++) {
          const futureMicro = sortedMicros[i];
          const matchingItems = futureMicro.cycleItems?.filter(
            (ci) => ci.workout?.name === currentWorkout.name,
          );

          if (!matchingItems) continue;

          for (const matchingItem of matchingItems) {
            const isPerformed =
              matchingItem.completedAt !== null ||
              (matchingItem.sets && matchingItem.sets.length > 0) ||
              matchingItem.isSkipped;

            if (!isPerformed) targetItems.push(matchingItem);
          }
        }
      }
    }
  }

  const targetIds = targetItems.map((ci) => ci.id);

  const otherRefsCount = await microCycleItemRepo
    .createQueryBuilder("ci")
    .where("ci.workoutId = :wId", { wId: currentWorkout.id })
    .andWhere("ci.id NOT IN (:...ids)", { ids: targetIds })
    .getCount();

  if (otherRefsCount === 0) {
    return {
      finalWorkout: currentWorkout,
      targetItems,
      wasBranched: false,
    };
  }

  const clonedVolume = volumeRepo.create({});
  await volumeRepo.save(clonedVolume);

  if (currentWorkout.volume?.entries?.length) {
    for (const entry of currentWorkout.volume.entries) {
      const newEntry = volumeEntryRepo.create({
        muscleGroup: entry.muscleGroup,
        volume: entry.volume,
        sets: entry.sets,
        workoutVolume: clonedVolume,
      });
      await volumeEntryRepo.save(newEntry);
    }
  }

  const cloned = workoutRepo.create({
    name: currentWorkout.name,
    volume: clonedVolume,
  });
  await workoutRepo.save(cloned);

  const sortedExercises = (currentWorkout.workoutExercises || [])
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  for (const we of sortedExercises) {
    const newWe = workoutExerciseRepo.create({
      workout: cloned,
      exercise: we.exercise,
      targetSets: we.targetSets,
      is_unilateral: we.is_unilateral,
      notes: we.notes,
      position: we.position,
    });
    await workoutExerciseRepo.save(newWe);
  }

  for (const ci of targetItems) {
    ci.workout = cloned;
    await microCycleItemRepo.save(ci);
  }

  const reloaded = await workoutRepo.findOne({
    where: { id: cloned.id },
    relations: [
      "workoutExercises",
      "workoutExercises.exercise",
      "volume",
      "volume.entries",
    ],
  });

  return {
    finalWorkout: reloaded!,
    targetItems,
    wasBranched: true,
  };
};
