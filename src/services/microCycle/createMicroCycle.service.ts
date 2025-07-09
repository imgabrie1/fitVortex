// src/services/microCycle/createMicroCycle.service.ts
import { AppDataSource } from "../../data-source";
import { MicroCycle } from "../../entities/microCycle.entity";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";
import { iCreateMicroCycle } from "../../interfaces/microCycle.interface";

export const createMicroCycleService = async (
  data: iCreateMicroCycle,
  userId: string
): Promise<MicroCycle> => {
  const microRepo = AppDataSource.getRepository(MicroCycle);
  const macroRepo = AppDataSource.getRepository(MacroCycle);
  const userRepo  = AppDataSource.getRepository(User);

  const user = await userRepo.findOneBy({ id: userId });
  if (!user) throw new AppError("Usuário não encontrado", 404);

  let macroCycleId: string | undefined;
  if (data.macroCycleId) {
    const macro = await macroRepo.findOneBy({ id: data.macroCycleId });
    if (!macro) throw new AppError("Macro Ciclo não encontrado", 404);
    macroCycleId = macro.id;
  }

  const newMicro = microRepo.create({
    createdAt: data.startDate.split("-").reverse().join("-"), // "DD-MM-YYYY" → "YYYY-MM-DD"
    trainingDays: data.trainingDays,
    userId: user.id,
    ...(macroCycleId && { macroCycleId })
  });

  await microRepo.save(newMicro);
  return newMicro;
};
