import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { MacroCycleItem } from "../../entities/macroCycleItem.entity";
import { MicroCycle } from "../../entities/microCycle.entity";
import { AppError } from "../../errors";

export const addMicroCycleToMacroCycleService = async (
  macroCycleId: string,
  microCycleId: string,
  userId: string
): Promise<MacroCycle> => {
  const macroRepo = AppDataSource.getRepository(MacroCycle);
  const itemRepo = AppDataSource.getRepository(MacroCycleItem);
  const microRepo = AppDataSource.getRepository(MicroCycle);

  const macro = await macroRepo.findOne({
    where: { id: macroCycleId },
    relations: ["user", "items"],
  });
  if (!macro) throw new AppError("Macro ciclo não encontrado", 404);
  if (macro.user.id !== userId) throw new AppError("Não autorizado", 403);

  const currentCount = macro.items.length;
  if (currentCount >= macro.microQuantity) {
    throw new AppError("Limite de micros atingido", 403);
  }

  const micro = await microRepo.findOneBy({ id: microCycleId });
  if (!micro) throw new AppError("Micro ciclo não encontrado", 404);

  const newItem = itemRepo.create({ macroCycle: macro, microCycle: micro });
  await itemRepo.save(newItem);

  const updated = await macroRepo.findOne({
    where: { id: macroCycleId },
    relations: ["user", "items", "items.microCycle", "volumes"],
  });
  if (!updated) throw new AppError("Erro ao recarregar MacroCycle", 500);

  return updated;
};