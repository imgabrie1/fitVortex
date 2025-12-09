import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { MacroCycleItem } from "../../entities/macroCycleItem.entity";
import { MicroCycle } from "../../entities/microCycle.entity";
import { Workout } from "../../entities/workout.entity";
import { AppError } from "../../errors";

export const deleteMacroCycleService = async (
  macroCycleID: string,
  userID: string
): Promise<void> => {
  const macroRepo = AppDataSource.getRepository(MacroCycle);
  const microRepo = AppDataSource.getRepository(MicroCycle);
  const itemRepo = AppDataSource.getRepository(MacroCycleItem);
  const workoutRepo = AppDataSource.getRepository(Workout);

  const macroCycle = await macroRepo.findOne({
    where: { id: macroCycleID },
    relations: ["user", "items", "items.microCycle", "items.microCycle.cycleItems", "items.microCycle.cycleItems.workout"],
  });

  if (!macroCycle) {
    throw new AppError("Macro ciclo não encontrado", 404);
  }

  if (macroCycle.user.id !== userID) {
    throw new AppError("Só pode excluir o próprio macro ciclo", 403);
  }

  if (macroCycle.items && macroCycle.items.length > 0) {
    const microCyclesToRemove = macroCycle.items.map((item) => item.microCycle);
    const workoutsToRemove: Workout[] = [];

    for (const microCycle of microCyclesToRemove) {
      if (microCycle.cycleItems) {
        for (const cycleItem of microCycle.cycleItems) {
          workoutsToRemove.push(cycleItem.workout);
        }
      }
    }

    await itemRepo.remove(macroCycle.items);

    if (workoutsToRemove.length > 0) {
      await workoutRepo.remove(workoutsToRemove);
    }

    if (microCyclesToRemove.length > 0) {
      await microRepo.remove(microCyclesToRemove);
    }
  }

  await macroRepo.remove(macroCycle);
};
