import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { MicroCycleItem } from "../../entities/microCycleItem.entity";
import { Set } from "../../entities/set.entity";
import { WorkoutVolumeEntry } from "../../entities/workoutVolumeEntry.entity";
import { AppError } from "../../errors";
import { TRecordWorkout } from "../../interfaces/set.interface";
import {
  MuscleGroup,
  getMuscleGroupParents,
} from "../../enum/muscleGroup.enum";
import { MicroCycleVolume } from "../../entities/microCycleVolume.entity";
import { Side } from "../../enum/side.enum";
import { Workout } from "../../entities/workout.entity";

export const editRecordedWorkoutService = async (
  microCycleID: string,
  workoutID: string,
  payload: TRecordWorkout,
  secondaryMuscleMultiplier: number = 0.5
): Promise<MicroCycleItem> => {
  const microCycleItemRepo = AppDataSource.getRepository(MicroCycleItem);
  const setRepo = AppDataSource.getRepository(Set);
  const volumeEntryRepo = AppDataSource.getRepository(WorkoutVolumeEntry);
  const microCycleVolumeRepo = AppDataSource.getRepository(MicroCycleVolume);
  const exerciseRepo = AppDataSource.getRepository(Exercise);
  const workoutRepo = AppDataSource.getRepository(Workout);

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

  if (!microCycleItem.workout.volume) {
    throw new AppError(
      "Este treino nunca foi gravado, não é possível editá-lo.",
      404
    );
  }

  const oldSets = await setRepo.find({
    where: { microCycleItem: { id: microCycleItem.id } },
    relations: ["exercise"],
  });

  if (oldSets.length > 0) {
    const oldVolumeByMuscleGroup: { [key in MuscleGroup]?: number } = {};
    const oldSetsByPrimaryMuscle: { [key in MuscleGroup]?: number } = {};

    const subtractVolumeFromHierarchy = (
      muscle: MuscleGroup,
      volume: number
    ) => {
      oldVolumeByMuscleGroup[muscle] =
        (oldVolumeByMuscleGroup[muscle] || 0) + volume;
      const parents = getMuscleGroupParents(muscle);
      for (const parent of parents) {
        oldVolumeByMuscleGroup[parent] =
          (oldVolumeByMuscleGroup[parent] || 0) + volume;
      }
    };

    for (const set of oldSets) {
      if (set.exercise.primaryMuscle) {
        oldSetsByPrimaryMuscle[set.exercise.primaryMuscle] =
          (oldSetsByPrimaryMuscle[set.exercise.primaryMuscle] || 0) + 1;
      }
      const setVolume = set.reps * set.weight;
      if (set.exercise.primaryMuscle) {
        subtractVolumeFromHierarchy(set.exercise.primaryMuscle, setVolume);
      }
      if (set.exercise.secondaryMuscle) {
        for (const muscle of set.exercise.secondaryMuscle) {
          subtractVolumeFromHierarchy(
            muscle,
            setVolume * secondaryMuscleMultiplier
          );
        }
      }
    }

    for (const muscleGroupStr in oldVolumeByMuscleGroup) {
      const muscleGroup = muscleGroupStr as MuscleGroup;
      const volumeToSubtract = oldVolumeByMuscleGroup[muscleGroup]!;
      const setsToSubtract = oldSetsByPrimaryMuscle[muscleGroup] || 0;

      const volumeEntry = await volumeEntryRepo.findOne({
        where: {
          workoutVolume: { id: microCycleItem.workout.volume.id },
          muscleGroup: muscleGroup,
        },
      });
      if (volumeEntry) {
        volumeEntry.volume = Math.max(
          0,
          Number(volumeEntry.volume) - volumeToSubtract
        );
        volumeEntry.sets = Math.max(
          0,
          Number(volumeEntry.sets) - setsToSubtract
        );
        await volumeEntryRepo.save(volumeEntry);
      }

      const microCycleVolume = await microCycleVolumeRepo.findOne({
        where: {
          microCycle: { id: microCycleID },
          muscleGroup: muscleGroup,
        },
      });
      if (microCycleVolume) {
        microCycleVolume.totalVolume = Math.max(
          0,
          Number(microCycleVolume.totalVolume) - volumeToSubtract
        );
        await microCycleVolumeRepo.save(microCycleVolume);
      }
    }

    await setRepo.remove(oldSets);
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

  await Promise.all(
    payload.exercises.map(async (exerciseData) => {
      const exercise = await exerciseRepo.findOneBy({
        id: exerciseData.exerciseID,
      });
      if (!exercise) {
        throw new AppError(
          `Exercício com ID ${exerciseData.exerciseID} não encontrado`,
          404
        );
      }

      const setsToCreate = exerciseData.sets.map((setData) => {
        return setRepo.create({
          reps: setData.reps,
          weight: setData.weight,
          side: setData.side || Side.BOTH,
          microCycleItem,
          exercise,
        });
      });

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
    })
  );

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

    let microCycleVolume = await microCycleVolumeRepo.findOne({
      where: {
        microCycle: { id: microCycleID },
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
    throw new AppError("Ocorreu um erro ao tentar gravar o treino", 500);
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
