import { AppDataSource } from "../../data-source";
import { MicroCycle } from "../../entities/microCycle.entity";
import { Workout } from "../../entities/workout.entity";
import { MicroCycleItem } from "../../entities/microCycleItem.entity";
import { AppError } from "../../errors";

export const addWorkoutsToMicroCycleService = async (
  microCycleID: string,
  workoutID: string,
  userID: string
): Promise<MicroCycle> => {
  const microRepo   = AppDataSource.getRepository(MicroCycle);
  const workoutRepo = AppDataSource.getRepository(Workout);
  const itemRepo    = AppDataSource.getRepository(MicroCycleItem);

  const micro = await microRepo.findOne({
    where: { id: microCycleID },
    relations: ["cycleItems", "user"],
  });
  if (!micro) throw new AppError("Micro ciclo não encontrado", 404);
  if (micro.user.id !== userID) throw new AppError("Não autorizado", 403);

  if (micro.cycleItems.length >= micro.trainingDays) {
    throw new AppError("Limite de treinos atingido", 403);
  }

  const workout = await workoutRepo.findOne({ where: { id: workoutID } });
  if (!workout) throw new AppError("Treino não encontrado", 404);

  const newPosition = micro.cycleItems.length;

  const newItem = itemRepo.create({
    microCycle: micro,
    workout,
    position: newPosition,
  });
  await itemRepo.save(newItem);

  const updated = await microRepo.findOne({
    where: { id: microCycleID },
    relations: ["user", "volumes", "cycleItems", "cycleItems.workout"],
  });
  if (!updated) throw new AppError("Erro ao recarregar MicroCycle", 500);

  return updated;
};
