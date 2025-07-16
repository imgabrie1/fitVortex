import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { MicroCycle } from "../../entities/microCycle.entity";
import { AppError } from "../../errors";

export const addMicroCycleToMacroCycleService = async (
  macroCycleId: string,
  microCycleId: string,
  userId: string
): Promise<MacroCycle> => {
  const macroRepo = AppDataSource.getRepository(MacroCycle);
  const microRepo = AppDataSource.getRepository(MicroCycle);

  const macroCycle = await macroRepo.findOne({
    where: { id: macroCycleId },
    relations: ["microCycles", "user"],
  });

  if (!macroCycle) {
    throw new AppError("Macro ciclo não encontrado", 404);
  }

  if (!macroCycle.user) {
    throw new AppError("O macro ciclo não está associado a um usuário", 404);
  }

  if (macroCycle.user.id !== userId) {
    throw new AppError("Não pode adicionar micro‑ciclos de terceiros", 403);
  }

  if (macroCycle.microCycles.length >= macroCycle.microQuantity) {
    throw new AppError("Já atingiu o limite estipulado pelo usuário", 403);
  }

  const microToAdd = await microRepo.findOneBy({ id: microCycleId });

  if (!microToAdd) {
    throw new AppError("Micro ciclo não encontrado", 404);
  }

  macroCycle.microCycles.push(microToAdd);

  await macroRepo.save(macroCycle);

  return macroCycle;
};
