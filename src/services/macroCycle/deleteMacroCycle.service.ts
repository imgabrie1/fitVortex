import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { AppError } from "../../errors";

export const deleteMacroCycleService = async (
  macroCycleId: string,
  userId: string
): Promise<void> => {
  const macroRepo = AppDataSource.getRepository(MacroCycle);

  const macroCycle = await macroRepo.findOne({
    where: { id: macroCycleId },
    relations: ["user", "items"],
  });

  if (!macroCycle) {
    throw new AppError("Macro ciclo não encontrado", 404);
  }

  if (macroCycle.user.id !== userId) {
    throw new AppError("Só pode excluir o próprio macro ciclo", 403);
  }

  await macroRepo.remove(macroCycle);
};
