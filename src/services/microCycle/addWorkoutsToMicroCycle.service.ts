import { AppDataSource } from "../../data-source";
import { MicroCycle } from "../../entities/microCycle.entity";
import { Workout } from "../../entities/workout.entity";
import { AppError } from "../../errors";

export const addWorkoutsToMicroCycleService = async (
  microCycleId: string,
  workoutId: string,
  userId: string
): Promise<MicroCycle> => {
  const microCycleRepo = AppDataSource.getRepository(MicroCycle);
  const workoutRepo = AppDataSource.getRepository(Workout);

  const microCycle = await microCycleRepo.findOne({
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

  const currentCount = microCycle.workouts.length;
  if (currentCount >= microCycle.trainingDays) {
    throw new AppError("Limite de micros atingido", 403);
  }

  const workoutToAdd = await workoutRepo.findOneBy({
    id: workoutId,
  });

  if (!workoutToAdd) {
    throw new AppError("Treino não encontrado", 404);
  }

  microCycle.workouts = [...microCycle.workouts, workoutToAdd];

  await microCycleRepo.save(microCycle);

  return microCycle;
};
