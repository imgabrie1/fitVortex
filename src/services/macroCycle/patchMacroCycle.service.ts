import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { AppError } from "../../errors";
import { IMacroCycle } from "../../interfaces/macroCycle.interface";
import { returnMacroCycleSchema } from "../../schemas/macroCycle.schema";
import { formatDateToDDMMYYYY } from "../../utils/formatDate";

const patchMacroCycleService = async (
  updatedData: Partial<MacroCycle>,
  macroCycleID: string
): Promise<IMacroCycle> => {
  const macroCycleRepo = AppDataSource.getRepository(MacroCycle);

  const oldMacroCycle = await macroCycleRepo.findOne({
    where: { id: macroCycleID },
  });

  if (!oldMacroCycle) {
    throw new AppError("Macro Ciclo não encontrado", 404);
  }

  const updatedMacroCycle = macroCycleRepo.create({
    ...oldMacroCycle,
    ...updatedData,
  });

  await macroCycleRepo.save(updatedMacroCycle);

  const formatted = {
    ...updatedMacroCycle,
    startDate: formatDateToDDMMYYYY(updatedMacroCycle.startDate),
    endDate: formatDateToDDMMYYYY(updatedMacroCycle.endDate),
  };

  return returnMacroCycleSchema.parse(formatted);
};

export default patchMacroCycleService;
