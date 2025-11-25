import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";
import {
  ICreateMacroCycle,
  IMacroCycle,
} from "../../interfaces/macroCycle.interface";
import { formatDateToDDMMYYYY } from "../../utils/formatDate";

export const createMacroCycleService = async (
  data: ICreateMacroCycle,
  userID: string
): Promise<IMacroCycle> => {
  const macroRepo = AppDataSource.getRepository(MacroCycle);
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOneBy({ id: userID });
  if (!user) throw new AppError("Usuário não encontrado", 404);

  const newMacro = macroRepo.create({
    macroCycleName: data.macroCycleName,
    microQuantity: data.microQuantity,
    startDate: data.startDate,
    endDate: data.endDate,
    user: user,
  });

  await macroRepo.save(newMacro);

  const response: IMacroCycle = {
    ...newMacro,
    startDate: formatDateToDDMMYYYY(newMacro.startDate),
    endDate: formatDateToDDMMYYYY(newMacro.endDate),
  };

  return response;
};
