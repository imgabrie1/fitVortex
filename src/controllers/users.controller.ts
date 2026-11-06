import { hashSync } from "bcryptjs";
import { AppError } from "../errors";
import { iUser, iUserReturn } from "../interfaces/user.interface";
import createUserService from "../services/users/createUser.service";
import deleteUserService from "../services/users/deleteUser.service";
import getUserByIDService from "../services/users/getUserByID.service";
import getUsersService from "../services/users/getUsers.service";
import { Request, Response } from "express";
import patchUserService from "../services/users/patchUser.service";
import { createUserSchema, updatePasswordSchema, updateUser } from "../schemas/user.schema";
import patchPasswordService from "../services/users/patchPassword.service";

export const createUserController = async (req: Request, res: Response) => {
  const data = createUserSchema.parse(req.body);
  const user = await createUserService({ ...data, admin: false });
  return res.status(201).json(user);
};

export const getUsersController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const users = await getUsersService();
  return res.status(200).json(users);
};

export const getUserByIDController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const user = await getUserByIDService(id);

  if (!user) {
    throw new AppError("usuário não encontrado", 404);
  }

  return res.status(200).json(user);
};

export const deleteUserController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req;
  if (id !== req.params.id) {
    throw new AppError("Oh besta, tu só pode deletar tua própria conta", 401);
  }
  const user = await deleteUserService(id);

  if (!user) {
    throw new AppError("usuário não encontrado", 404);
  }

  return res.status(204).send();
};
export const patchUserController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req;

  if (id !== req.params.id) {
    throw new AppError("Você só pode editar sua própria conta", 401);
  }

  const data = updateUser.parse(req.body);
  const user = await patchUserService(data, id);

  return res.status(200).json(user);
};

export const patchPasswordController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req;

  if (id !== req.params.id) {
    throw new AppError("Você só pode editar sua própria conta", 401);
  }

  const { currentPassword, newPassword } = updatePasswordSchema.parse(req.body);
  await patchPasswordService(id, currentPassword, newPassword);

  return res.status(204).send();
};
