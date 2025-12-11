import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { MicroCycleItem } from "../../entities/microCycleItem.entity";
import { Set } from "../../entities/set.entity";
import { WorkoutVolume } from "../../entities/workoutVolume.entity";
import { WorkoutVolumeEntry } from "../../entities/workoutVolumeEntry.entity";
import { AppError } from "../../errors";
import {
  MuscleGroup,
  getMuscleGroupParents,
} from "../../enum/muscleGroup.enum";
import { Workout } from "../../entities/workout.entity";
import { MicroCycleVolume } from "../../entities/microCycleVolume.entity";
import { Side } from "../../enum/side.enum";
import { WorkoutExercise } from "../../entities/workoutExercise.entity";
import { MicroCycle } from "../../entities/microCycle.entity";

export const skipWorkoutService = async (
  microCycleID: string,
  workoutID: string,
  secondaryMuscleMultiplier: number = 0.5
): Promise<MicroCycleItem> => {
  const microCycleItemRepo = AppDataSource.getRepository(MicroCycleItem);
  const setRepo = AppDataSource.getRepository(Set);
  const volumeRepo = AppDataSource.getRepository(WorkoutVolume);
  const volumeEntryRepo = AppDataSource.getRepository(WorkoutVolumeEntry);
  const workoutRepo = AppDataSource.getRepository(Workout);
  const microCycleVolumeRepo = AppDataSource.getRepository(MicroCycleVolume);

  const microCycleItem = await microCycleItemRepo.findOne({
    where: {
      microCycle: { id: microCycleID },
      workout: { id: workoutID },
    },
    relations: ["workout", "workout.volume", "microCycle"],
  });

  if (!microCycleItem) {
    throw new AppError("Itens do micro ciclo não encontrados", 404);
  }

  microCycleItem.isSkipped = true;
  await microCycleItemRepo.save(microCycleItem);

  const workout = await workoutRepo.findOne({
    where: { id: workoutID },
    relations: ["workoutExercises", "workoutExercises.exercise"],
  });

  if (!workout) {
    throw new AppError("Treino não encontrado", 404);
  }

  if (!microCycleItem.workout.volume) {
    const newVolume = volumeRepo.create({ workout: microCycleItem.workout });
    await volumeRepo.save(newVolume);
    microCycleItem.workout.volume = newVolume;
  }

  let previousSets: Set[] = [];
  const microCycleRepo = AppDataSource.getRepository(MicroCycle);

  const currentMicroCycle = await microCycleRepo.findOne({
    where: { id: microCycleID },
    relations: ["macroCycle", "macroCycle.microCycles"],
  });

  if (currentMicroCycle && currentMicroCycle.macroCycle) {
    const macroCycle = currentMicroCycle.macroCycle;
    const allMicroCyclesInMacro = macroCycle.microCycles.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    const currentIndex = allMicroCyclesInMacro.findIndex(
      (mc) => mc.id === microCycleID
    );

    if (currentIndex > 0) {
      const previousMicroCycle = allMicroCyclesInMacro[currentIndex - 1];

      const previousMicroCycleItem = await microCycleItemRepo.findOne({
        where: {
          microCycle: { id: previousMicroCycle.id },
          position: microCycleItem.position,
        },
        relations: ["sets", "sets.exercise"],
      });

      if (previousMicroCycleItem && previousMicroCycleItem.sets) {
        previousSets = previousMicroCycleItem.sets;
      }
    }
  }

  const volumeByMuscleGroup: { [key in MuscleGroup]?: number } = {};
  const setsByPrimaryMuscle: { [key in MuscleGroup]?: number } = {};

  const addVolumeToHierarchy = (muscle: MuscleGroup, volume: number) => {
    volumeByMuscleGroup[muscle] = (volumeByMuscleGroup[muscle] || 0) + volume;
    const parents = getMuscleGroupParents(muscle);
    for (const parent of parents) {
      volumeByMuscleGroup[parent] = (volumeByMuscleGroup[parent] || 0) + volume;
    }
  };

  for (const workoutExercise of workout.workoutExercises) {
    const exercise = workoutExercise.exercise;
    const numSets = workoutExercise.targetSets;
    const setsToCreate: Set[] = [];

    const previousSetsForExercise = previousSets.filter(
      (set) => set.exercise.id === exercise.id
    );

    for (let i = 0; i < numSets; i++) {
      const prevSet = previousSetsForExercise[i];
      const newSet = setRepo.create({
        reps: prevSet ? prevSet.reps : 1,
        weight: prevSet ? prevSet.weight : 1,
        side: prevSet ? prevSet.side : Side.BOTH,
        microCycleItem,
        exercise,
      });
      setsToCreate.push(newSet);
    }

    await setRepo.save(setsToCreate);

    if (exercise.primaryMuscle) {
      setsByPrimaryMuscle[exercise.primaryMuscle] =
        (setsByPrimaryMuscle[exercise.primaryMuscle] || 0) +
        setsToCreate.length;
    }

    for (const set of setsToCreate) {
      const setVolume = set.reps * set.weight;

      if (exercise.primaryMuscle) {
        addVolumeToHierarchy(exercise.primaryMuscle, setVolume);
      }
      if (exercise.secondaryMuscle) {
        for (const muscle of exercise.secondaryMuscle) {
          addVolumeToHierarchy(muscle, setVolume * secondaryMuscleMultiplier);
        }
      }
    }
  }

  for (const muscleGroupStr in volumeByMuscleGroup) {
    const muscleGroup = muscleGroupStr as MuscleGroup;
    const calculatedVolume = volumeByMuscleGroup[muscleGroup]!;
    const calculatedSets = setsByPrimaryMuscle[muscleGroup] || 0;

    let volumeEntry = await volumeEntryRepo.findOne({
      where: {
        workoutVolume: { id: microCycleItem.workout.volume.id },
        muscleGroup: muscleGroup,
      },
    });

    if (volumeEntry) {
      volumeEntry.volume = Number(volumeEntry.volume) + calculatedVolume;
      volumeEntry.sets = Number(volumeEntry.sets) + calculatedSets;
    } else {
      volumeEntry = volumeEntryRepo.create({
        muscleGroup: muscleGroup,
        volume: calculatedVolume,
        sets: calculatedSets,
        workoutVolume: microCycleItem.workout.volume,
      });
    }
    await volumeEntryRepo.save(volumeEntry);
  }

  for (const muscleGroupStr in volumeByMuscleGroup) {
    const muscleGroup = muscleGroupStr as MuscleGroup;
    const calculatedVolume = volumeByMuscleGroup[muscleGroup]!;

    let microCycleVolume = await microCycleVolumeRepo.findOne({
      where: {
        microCycle: { id: microCycleItem.microCycle.id },
        muscleGroup: muscleGroup,
      },
    });

    if (microCycleVolume) {
      microCycleVolume.totalVolume =
        Number(microCycleVolume.totalVolume) + calculatedVolume;
    } else {
      microCycleVolume = microCycleVolumeRepo.create({
        microCycle: microCycleItem.microCycle,
        muscleGroup: muscleGroup,
        totalVolume: calculatedVolume,
      });
    }
    await microCycleVolumeRepo.save(microCycleVolume);
  }

  const finalMicroCycleItem = await microCycleItemRepo.findOne({
    where: { id: microCycleItem.id },
    relations: { sets: { exercise: true } },
  });

  if (!finalMicroCycleItem) {
    throw new AppError("Ocorreu um erro ao tentar pular o treino", 500);
  }

  const finalWorkout = await workoutRepo.findOne({
    where: { id: workoutID },
    relations: [
      "workoutExercises",
      "workoutExercises.exercise",
      "volume",
      "volume.entries",
    ],
  });

  finalMicroCycleItem.workout = finalWorkout!;

  return finalMicroCycleItem;
};
