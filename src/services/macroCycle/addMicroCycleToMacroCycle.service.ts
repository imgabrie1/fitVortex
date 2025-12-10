import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { MicroCycle } from "../../entities/microCycle.entity";
import { AppError } from "../../errors";

export const addMicroCycleToMacroCycleService = async (
  macroCycleID: string,
  microCycleID: string,
  userID: string
): Promise<MacroCycle> => {
  const macroRepo = AppDataSource.getRepository(MacroCycle);
  const microRepo = AppDataSource.getRepository(MicroCycle);

  const macro = await macroRepo.findOne({
    where: { id: macroCycleID },
    relations: ["user", "microCycles"],
  });
  if (!macro) throw new AppError("Macro ciclo não encontrado", 404);
  if (macro.user.id !== userID) throw new AppError("Não autorizado", 403);

  const currentCount = macro.microCycles.length;
  if (currentCount >= macro.microQuantity) {
    throw new AppError("Limite de micros atingido", 403);
  }

  const micro = await microRepo.findOneBy({ id: microCycleID });
  if (!micro) throw new AppError("Micro ciclo não encontrado", 404);

  micro.macroCycle = macro;
  await microRepo.save(micro);

  const updated = await macroRepo.findOne({
    where: { id: macroCycleID },
    relations: ["user", "microCycles", "volumes"],
  });
  if (!updated) throw new AppError("Erro ao recarregar MacroCycle", 500);

  return updated;
};