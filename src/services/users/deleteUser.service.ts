import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";

const deleteUserService = async (userID: string) => {
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOne({ where: { id: userID } });
  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  await userRepo.delete(user.id);

  return { message: "Usuário removido com sucesso" };
};

export default deleteUserService;
