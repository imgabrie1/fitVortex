import { In } from "typeorm";
import { AppDataSource } from "../../data-source";
import { MicroCycle } from "../../entities/microCycle.entity";
import { Workout } from "../../entities/workout.entity";
import { AppError } from "../../errors";

export const addWorkoutsToMicroCycleService = async (
  microCycleId: string,
  workoutId: string,
  userId: string
): Promise<MicroCycle> => {
  const microCycleRepository = AppDataSource.getRepository(MicroCycle);
  const workoutRepository = AppDataSource.getRepository(Workout);

  const microCycle = await microCycleRepository.findOne({
    where: { id: microCycleId },
    relations: ["workouts", "user"],
  });

  if (!microCycle) {
    throw new AppError("Micro ciclo não encontrado", 404);
  }

  if (microCycle.user.id !== userId) {
    throw new AppError(
      "Não pode adicionar treinos em micro ciclos terceiros",
      403
    );
  }

  const workoutToAdd = await workoutRepository.findOneBy({
    id: workoutId
  });

  if (!workoutToAdd) {
    throw new AppError("Workout not found", 404);
  }

  microCycle.workouts = [...microCycle.workouts, workoutToAdd];

  await microCycleRepository.save(microCycle);

  return microCycle;
};