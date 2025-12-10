import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { MicroCycle } from "../../entities/microCycle.entity";
import { MicroCycleItem } from "../../entities/microCycleItem.entity";
import { AppError } from "../../errors";

export const reorderWorkoutsService = async (
  microCycleID: string,
  userID: string,
  orderedIds: string[]
): Promise<void> => {
  const microRepo = AppDataSource.getRepository(MicroCycle);
  const macroRepo = AppDataSource.getRepository(MacroCycle);

  const micro = await microRepo.findOne({
    where: { id: microCycleID },
    relations: ["cycleItems.workout", "user", "macroCycle"],
  });

  if (!micro) {
    throw new AppError("Micro ciclo não encontrado", 404);
  }

  if (micro.user.id !== userID) {
    throw new AppError("Não autorizado", 403);
  }

  if (micro.cycleItems.length !== orderedIds.length) {
    throw new AppError("A lista de treinos para reordenar está incompleta.", 400);
  }

  const microCycleItemIds = micro.cycleItems.map((item) => item.id);
  const allIdsMatch = orderedIds.every((id) => microCycleItemIds.includes(id));

  if (!allIdsMatch) {
    throw new AppError("IDs de treino inválidos para este microciclo.", 400);
  }

  const workoutIdMap = new Map(
    micro.cycleItems.map((item) => [item.id, item.workout.id])
  );
  const orderedWorkoutIds = orderedIds.map((itemId) => workoutIdMap.get(itemId));

  if (!micro.macroCycle) {
    throw new AppError("Microciclo não está associado a um macrociclo.", 400);
  }

  const macroCycleId = micro.macroCycle.id;
  const fullMacroCycle = await macroRepo.findOne({
    where: { id: macroCycleId },
    relations: ["microCycles.cycleItems.workout"],
  });

  if (!fullMacroCycle) {
    throw new AppError("Macrociclo não encontrado.", 404);
  }

  const allMicroCycles = fullMacroCycle.microCycles;

  await AppDataSource.transaction(async (transactionalEntityManager) => {
    const updatePromises: Promise<any>[] = [];

    for (const currentMicro of allMicroCycles) {
      if (currentMicro.cycleItems.length > 0) {
        const workoutToItemMap = new Map(
          currentMicro.cycleItems.map((item) => [item.workout.id, item])
        );

        orderedWorkoutIds.forEach((workoutId, index) => {
          if (workoutId) {
            const itemToUpdate = workoutToItemMap.get(workoutId);

            if (itemToUpdate) {
              updatePromises.push(
                transactionalEntityManager.update(
                  MicroCycleItem,
                  itemToUpdate.id,
                  { position: index }
                )
              );
            }
          }
        });
      }
    }

    await Promise.all(updatePromises);
  });
};