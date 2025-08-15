import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { MicroCycleItem } from "../../entities/microCycleItem.entity";
import { Set } from "../../entities/set.entity";
import { WorkoutVolume } from "../../entities/workoutVolume.entity";
import { WorkoutVolumeEntry } from "../../entities/workoutVolumeEntry.entity";
import { AppError } from "../../errors";
import { TRecordWorkout } from "../../interfaces/set.interface";
import { MuscleGroup } from "../../enum/muscleGroup.enum";
import { Workout } from "../../entities/workout.entity";
import { MicroCycle } from "../../entities/microCycle.entity";
import { MicroCycleVolume } from "../../entities/microCycleVolume.entity";

export const recordWorkoutService = async (
  microCycleID: string,
  workoutID: string,
  payload: TRecordWorkout,
  secondaryMuscleMultiplier: number = 0.5
): Promise<MicroCycleItem> => {
  const microCycleItemRepo = AppDataSource.getRepository(MicroCycleItem);
  const exerciseRepo = AppDataSource.getRepository(Exercise);
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
    relations: ["workout", "workout.volume"],
  });

  if (!microCycleItem) {
    throw new AppError("Itens do micro ciclo não encontrados", 404);
  }

  if (!microCycleItem.workout.volume) {
    const newVolume = volumeRepo.create({ workout: microCycleItem.workout });
    await volumeRepo.save(newVolume);
    microCycleItem.workout.volume = newVolume;
  }

  const volumeByMuscleGroup: { [key in MuscleGroup]?: number } = {};
  const setsByPrimaryMuscle: { [key in MuscleGroup]?: number } = {};

  await Promise.all(
    payload.exercises.map(async (exerciseData) => {
      const exercise = await exerciseRepo.findOneBy({ id: exerciseData.exerciseID });
      if (!exercise) {
        throw new AppError(`Exercício com ID ${exerciseData.exerciseID} não encontrado`, 404);
      }

      const setsToCreate = exerciseData.sets.map((setData) => {
        return setRepo.create({
          reps: setData.reps,
          weight: setData.weight,
          notes: setData.notes || null,
          microCycleItem,
          exercise,
        });
      });

      await setRepo.save(setsToCreate);

      if (exercise.primaryMuscle) {
        setsByPrimaryMuscle[exercise.primaryMuscle] =
          (setsByPrimaryMuscle[exercise.primaryMuscle] || 0) + setsToCreate.length;
      }

      for (const set of setsToCreate) {
        const setVolume = set.reps * set.weight;
        if (exercise.primaryMuscle) {
          volumeByMuscleGroup[exercise.primaryMuscle] =
            (volumeByMuscleGroup[exercise.primaryMuscle] || 0) + setVolume;
        }
        if (exercise.secondaryMuscle) {
          volumeByMuscleGroup[exercise.secondaryMuscle] =
            (volumeByMuscleGroup[exercise.secondaryMuscle] || 0) + setVolume * secondaryMuscleMultiplier;
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
  }

  const microCycleItemWithMicroCycle = await microCycleItemRepo.findOne({
      where: { id: microCycleItem.id },
      relations: ["microCycle"]
  });

  if (!microCycleItemWithMicroCycle) {
      throw new AppError("Item do microciclo não encontrado após o registro do treino.", 500);
  }

  for (const muscleGroupStr in volumeByMuscleGroup) {
    const muscleGroup = muscleGroupStr as MuscleGroup;
    const calculatedVolume = volumeByMuscleGroup[muscleGroup]!;

    let microCycleVolume = await microCycleVolumeRepo.findOne({
        where: {
            microCycle: { id: microCycleItemWithMicroCycle.microCycle.id },
            muscleGroup: muscleGroup
        }
    });

    if (microCycleVolume) {
        microCycleVolume.totalVolume = Number(microCycleVolume.totalVolume) + calculatedVolume;
    } else {
        microCycleVolume = microCycleVolumeRepo.create({
            microCycle: microCycleItemWithMicroCycle.microCycle,
            muscleGroup: muscleGroup,
            totalVolume: calculatedVolume
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
    relations: ["workoutExercises", "workoutExercises.exercise", "volume", "volume.entries"],
  });

  finalMicroCycleItem.workout = finalWorkout!;

  return finalMicroCycleItem;
};
