import { AppDataSource } from "../../data-source";
import { In } from "typeorm";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { MacroCycleItem } from "../../entities/macroCycleItem.entity";
import { MicroCycle } from "../../entities/microCycle.entity";
import { AppError } from "../../errors";
import { MicroCycleItem as MicroItem } from "../../entities/microCycleItem.entity";
import { Workout } from "../../entities/workout.entity";

export const deleteMacroCycleService = async (
  macroCycleID: string,
  userID: string
): Promise<void> => {
  const macroRepo = AppDataSource.getRepository(MacroCycle);
  const microRepo = AppDataSource.getRepository(MicroCycle);
  const itemRepo = AppDataSource.getRepository(MacroCycleItem);
  const microItemRepo = AppDataSource.getRepository(MicroItem);
  const workoutRepo = AppDataSource.getRepository(Workout);

  const macroCycle = await macroRepo.findOne({
    where: { id: macroCycleID },
    relations: ["user", "items", "items.microCycle"],
  });

  if (!macroCycle) {
    throw new AppError("Macro ciclo não encontrado", 404);
  }

  if (macroCycle.user.id !== userID) {
    throw new AppError("Só pode excluir o próprio macro ciclo", 403);
  }

  if (macroCycle.items && macroCycle.items.length > 0) {
    const microCycleIds = macroCycle.items.map((item) => item.microCycle.id);

    if (microCycleIds.length > 0) {
      const microItems = await microItemRepo.find({
        where: { microCycle: { id: In(microCycleIds) } },
        relations: ["workout"],
      });

      const workoutsToRemove = microItems
        .map((item) => item.workout)
        .filter((workout): workout is Workout => !!workout);

      const uniqueWorkoutsToRemove = [...new Set(workoutsToRemove)];

      if (uniqueWorkoutsToRemove.length > 0) {
        await workoutRepo.remove(uniqueWorkoutsToRemove);
      }
    }

    const microCyclesToRemove = macroCycle.items.map((item) => item.microCycle);

    await itemRepo.remove(macroCycle.items);

    if (microCyclesToRemove.length > 0) {
      await microRepo.remove(microCyclesToRemove);
    }
  }

  await macroRepo.remove(macroCycle);
};
