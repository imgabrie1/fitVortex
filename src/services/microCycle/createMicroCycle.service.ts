import { AppDataSource } from "../../data-source";
import { MicroCycle } from "../../entities/microCycle.entity";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";
import { iCreateMicroCycle } from "../../interfaces/microCycle.interface";

export const createMicroCycleService = async (
  data: iCreateMicroCycle,
  userID: string
): Promise<MicroCycle> => {
  const microRepo = AppDataSource.getRepository(MicroCycle);
  const userRepo  = AppDataSource.getRepository(User);

  const user = await userRepo.findOneBy({ id: userID });
  if (!user) throw new AppError("Usuário não encontrado", 404);

  const newMicro = microRepo.create({
    microCycleName: data.microCycleName,
    trainingDays: data.trainingDays,
    user: user
  });

  await microRepo.save(newMicro);
  return newMicro;
};