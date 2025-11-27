import { AppDataSource } from "../../data-source";
import { MicroCycleItem } from "../../entities/microCycleItem.entity";
import { MicroCycleVolume } from "../../entities/microCycleVolume.entity";
import { Set } from "../../entities/set.entity";
import { WorkoutVolume } from "../../entities/workoutVolume.entity";
import { WorkoutVolumeEntry } from "../../entities/workoutVolumeEntry.entity";
import { getMuscleGroupParents, MuscleGroup } from "../../enum/muscleGroup.enum";
import { AppError } from "../../errors";

export const deleteWorkoutFromMicroCycleService = async (
  microCycleID: string,
  workoutID: string,
  secondaryMuscleMultiplier: number = 0.5
): Promise<void> => {
  const microCycleItemRepo = AppDataSource.getRepository(MicroCycleItem);
  const microCycleVolumeRepo = AppDataSource.getRepository(MicroCycleVolume);
  const setRepo = AppDataSource.getRepository(Set);
  const volumeEntryRepo = AppDataSource.getRepository(WorkoutVolumeEntry);
  const workoutVolumeRepo = AppDataSource.getRepository(WorkoutVolume);

  const microCycleItem = await microCycleItemRepo.findOne({
    where: {
      microCycle: { id: microCycleID },
      workout: { id: workoutID },
    },
    relations: ["microCycle", "sets", "sets.exercise", "workout.volume"],
  });

  if (!microCycleItem) {
    throw new AppError("Workout not found in this microcycle", 404);
  }

  const workoutVolume = microCycleItem.workout.volume;

  if (microCycleItem.sets && microCycleItem.sets.length > 0) {
    const volumeByMuscleGroup: { [key in MuscleGroup]?: number } = {};
    const setsByPrimaryMuscle: { [key in MuscleGroup]?: number } = {};

    const addVolumeToHierarchy = (muscle: MuscleGroup, volume: number) => {
      volumeByMuscleGroup[muscle] = (volumeByMuscleGroup[muscle] || 0) + volume;
      const parents = getMuscleGroupParents(muscle);
      for (const parent of parents) {
        volumeByMuscleGroup[parent] = (volumeByMuscleGroup[parent] || 0) + volume;
      }
    };

    for (const set of microCycleItem.sets) {
      const setVolume = set.reps * set.weight;
      const { exercise } = set;

      if (exercise.primaryMuscle) {
        setsByPrimaryMuscle[exercise.primaryMuscle] = (setsByPrimaryMuscle[exercise.primaryMuscle] || 0) + 1;
        addVolumeToHierarchy(exercise.primaryMuscle, setVolume);
      }
      if (exercise.secondaryMuscle) {
        for (const muscle of exercise.secondaryMuscle) {
          addVolumeToHierarchy(muscle, setVolume * secondaryMuscleMultiplier);
        }
      }
    }

    for (const muscleGroupStr in volumeByMuscleGroup) {
      const muscleGroup = muscleGroupStr as MuscleGroup;
      const volumeToRemove = volumeByMuscleGroup[muscleGroup]!;
      
      const microCycleVolume = await microCycleVolumeRepo.findOne({
        where: { microCycle: { id: microCycleID }, muscleGroup },
      });

      if (microCycleVolume) {
        microCycleVolume.totalVolume = Math.max(0, Number(microCycleVolume.totalVolume) - volumeToRemove);
        await microCycleVolumeRepo.save(microCycleVolume);
      }
      
      if(workoutVolume){
        const workoutVolumeEntry = await volumeEntryRepo.findOne({
          where: { workoutVolume: { id: workoutVolume.id }, muscleGroup },
        });
  
        if (workoutVolumeEntry) {
          const setsToRemove = setsByPrimaryMuscle[muscleGroup] || 0;
          workoutVolumeEntry.volume = Math.max(0, Number(workoutVolumeEntry.volume) - volumeToRemove);
          workoutVolumeEntry.sets = Math.max(0, Number(workoutVolumeEntry.sets) - setsToRemove);
          await volumeEntryRepo.save(workoutVolumeEntry);
        }
      }

    }

    await setRepo.remove(microCycleItem.sets);
  }
  
  const entries = await volumeEntryRepo.find({where: {workoutVolume: {id: workoutVolume.id}}})
  const hasEntries = entries.some(e => e.volume > 0 || e.sets > 0);

  if (!hasEntries && workoutVolume) {
    await workoutVolumeRepo.remove(workoutVolume);
  }

  await microCycleItemRepo.remove(microCycleItem);
};
