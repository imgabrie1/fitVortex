import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { AppError } from "../../errors";
import { IMacroCycle } from "../../interfaces/macroCycle.interface";
import { returnMacroCycleSchema } from "../../schemas/macroCycle.schema";

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
    startDate: formatDate(updatedMacroCycle.startDate),
    endDate: formatDate(updatedMacroCycle.endDate),
  };

  return returnMacroCycleSchema.parse(formatted);
};

function formatDate(date?: string | Date): string | undefined {
  if (!date) return undefined;

  const d = new Date(date);
  if (isNaN(d.getTime())) return undefined;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

export default patchMacroCycleService;
