import { compare, hash } from "bcryptjs";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";

const patchPasswordService = async (
  userID: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOne({ where: { id: userID } });
  if (!user) throw new AppError("Usuário não encontrado", 404);

  const isMatch = await compare(currentPassword, user.password);
  if (!isMatch) throw new AppError("Senha atual incorreta", 400);

  if (currentPassword === newPassword) {
    throw new AppError("A nova senha deve ser diferente da atual", 400);
  }

  const hashed = await hash(newPassword, 10);
  await userRepo.update(userID, { password: hashed });
};

export default patchPasswordService;
