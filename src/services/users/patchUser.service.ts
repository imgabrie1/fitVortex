import { z } from "zod";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";
import { iUserReturn } from "../../interfaces/user.interface";
import { returnUserSchema, updateUser } from "../../schemas/user.schema";

const patchUserService = async (
  updatedData: z.infer<typeof updateUser>,
  userID: string,
): Promise<iUserReturn> => {
  const userRepo = AppDataSource.getRepository(User);

  const oldUser = await userRepo.findOne({ where: { id: userID } });
  if (!oldUser) throw new AppError("Usuário não encontrado", 404);

  Object.assign(oldUser, updatedData);
  await userRepo.save(oldUser);

  return returnUserSchema.parse(oldUser);
};

export default patchUserService;
