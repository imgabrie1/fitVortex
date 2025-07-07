import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";
import { iLogin } from "../../interfaces/login.interface";
import { iRepoUser } from "../../interfaces/user.interface";

const createLoginService = async (loginData: iLogin): Promise<string> => {
  const repoUser: iRepoUser = AppDataSource.getRepository(User);

  const user: User | null = await repoUser.findOneBy({
    email: loginData.email,
  });

  if (!user) {
    throw new AppError("Credenciais inválidas", 401);
  }

  const passwordMatch = await compare(loginData.password, user.password);
  if (!passwordMatch) {
    throw new AppError("As senhas não coincidem. Insira-os novamente", 401);
  }

  const token: string = jwt.sign(
    {
      admin: user.admin,
    },
    process.env.SECRET_KEY!,
    {
      expiresIn: "24h",
      subject: String(user.id),
    }
  );

  return token;
};

export default createLoginService;
