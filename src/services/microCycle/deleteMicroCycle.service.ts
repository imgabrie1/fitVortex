import { AppDataSource } from "../../data-source";
import { MicroCycle } from "../../entities/microCycle.entity";
import { AppError } from "../../errors";


export const deleteMicroCycleService = async (
  microCycleId: string,
  userId: string
): Promise<void> => {
  const microRepo = AppDataSource.getRepository(MicroCycle);

  const microCycle = await microRepo.findOne({
    where: { id: microCycleId },
    relations: ["user"],
  });

  if (!microCycle) {
    throw new AppError("Micro ciclo não encontrado", 404);
  }

  if (microCycle.user.id !== userId) {
    throw new AppError("Só pode excluir o próprio micro ciclo", 403);
  }

  await microRepo.remove(microCycle);
};
