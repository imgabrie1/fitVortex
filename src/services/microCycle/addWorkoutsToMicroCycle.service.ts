import { AppDataSource } from "../../data-source";
import { MicroCycle } from "../../entities/microCycle.entity";
import { Workout } from "../../entities/workout.entity";
import { AppError } from "../../errors";
import { iAddWorkoutsToMicroCycle } from "../../interfaces/microCycle.interface";

export const addWorkoutsToMicroCycleService = async (
  microCycleId: string,
  workoutData: iAddWorkoutsToMicroCycle,
  userId: string
): Promise<MicroCycle> => {
  const microCycleRepository = AppDataSource.getRepository(MicroCycle);
  const workoutRepository = AppDataSource.getRepository(Workout);

  const microCycle = await microCycleRepository.findOne({
    where: { id: microCycleId },
    relations: ["workouts", "user"],
  });

  if (!microCycle) {
    throw new AppError("MicroCycle not found", 404);
  }

  if (microCycle.user.id !== userId) {
    throw new AppError("You don't have permission to add workouts to this microCycle", 403);
  }

  const workoutsToAdd = await workoutRepository.findByIds(workoutData.workoutIds);

  if (workoutsToAdd.length !== workoutData.workoutIds.length) {
    throw new AppError("One or more workouts not found", 404);
  }

  microCycle.workouts = [...microCycle.workouts, ...workoutsToAdd];

  await microCycleRepository.save(microCycle);

  return microCycle;
};
