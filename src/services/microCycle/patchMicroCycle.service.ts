import { AppDataSource } from "../../data-source";
import { MicroCycle } from "../../entities/microCycle.entity";
import { AppError } from "../../errors";
import { ireturnMicroCycleWithNoRelations } from "../../interfaces/microCycle.interface";
import { returnMicroCycleNoRelationsSchema } from "../../schemas/microCycle.schema";

const patchMicroCycleService = async (
  updatedData: Partial<MicroCycle>,
  microCycleID: string
): Promise<ireturnMicroCycleWithNoRelations> => {
  const microCycleRepo = AppDataSource.getRepository(MicroCycle);

  const oldMicroCycle = await microCycleRepo.findOne({
    where: { id: microCycleID },
  });

  if (!oldMicroCycle) {
    throw new AppError("Micro Ciclo não encontrado", 404);
  }

  const updatedMicroCycle = microCycleRepo.create({
    ...oldMicroCycle,
    ...updatedData,
  });

  await microCycleRepo.save(updatedMicroCycle);

  return returnMicroCycleNoRelationsSchema.parse(updatedMicroCycle);
};

export default patchMicroCycleService;
