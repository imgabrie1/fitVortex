import { AppDataSource } from "../../data-source";
import { MacroCycleItem } from "../../entities/macroCycleItem.entity";
import { MicroCycle } from "../../entities/microCycle.entity";
import { AppError } from "../../errors";

export const deleteMicroCycleService = async (
  microCycleID: string,
  userID: string
): Promise<void> => {
  const microRepo = AppDataSource.getRepository(MicroCycle);
  const itemRepo = AppDataSource.getRepository(MacroCycleItem);

  const microCycle = await microRepo.findOne({
    where: { id: microCycleID },
    relations: ["user"],
  });

  if (!microCycle) {
    throw new AppError("Micro ciclo não encontrado", 404);
  }

  if (microCycle.user.id !== userID) {
    throw new AppError("Só pode excluir o próprio micro ciclo", 403);
  }

  const itemsToRemove = await itemRepo.find({
    where: { microCycle: { id: microCycleID } },
  });

  if (itemsToRemove.length > 0) {
    await itemRepo.remove(itemsToRemove);
  }

  await microRepo.remove(microCycle);
};
