import { Request, Response } from "express";
import { iLogin } from "../interfaces/login.interface";
import createLoginService from "../services/login/createLogin.service";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { AppError } from "../errors";

const createLoginController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userRepository = AppDataSource.getRepository(User);
  const loginData: iLogin = req.body;
  const user = await userRepository.findOne({
    where: { email: loginData.email },
  });

  const token = await createLoginService(loginData);

  if (user) {
    const { password, ...userWithoutPassword } = user;
    return res.json({
      user: userWithoutPassword,
      token: token,
    });
  } else {
    throw new AppError("Usuário não encontrado", 404);
  }
};

export default createLoginController;
