import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { AppError } from "../../errors";

export const deleteMacroCycleService = async (
  macroCycleID: string,
  userID: string
): Promise<void> => {
  const macroRepo = AppDataSource.getRepository(MacroCycle);

  const macroCycle = await macroRepo.findOne({
    where: { id: macroCycleID },
    relations: ["user"],
  });

  if (!macroCycle) {
    throw new AppError("Macro ciclo não encontrado", 404);
  }

  if (macroCycle.user.id !== userID) {
    throw new AppError("Só pode excluir o próprio macro ciclo", 403);
  }

  await macroRepo.remove(macroCycle);
};
