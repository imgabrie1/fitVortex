import { hashSync } from "bcryptjs";
import { AppError } from "../errors";
import { iUser, iUserReturn } from "../interfaces/user.interface";
import createUserService from "../services/users/createUser.service";
import deleteUserService from "../services/users/deleteUser.service";
import getUserByIDService from "../services/users/getUserByID.service";
import getUsersService from "../services/users/getUsers.service";
import { Request, Response } from "express";
import patchUserService from "../services/users/patchUser.service";


export const createUserController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userData: iUser = req.body;

  const newUser = await createUserService(userData);

  return res.status(201).json(newUser);
};

export const getUsersController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const users = await getUsersService();
  return res.status(200).json(users);
};

export const getUserByIDController = async (
  req: Request,
  res: Response
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
  res: Response
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
  res: Response
): Promise<Response> => {
  const { id } = req;
  if (id !== req.params.id) {
    throw new AppError("Oh besta, tu só pode editar tua própria conta", 401);
  }

  let newPassword = req.body.password
  let updatedData = {... req.body}

  if(newPassword) {
    newPassword = hashSync(newPassword, 10);
    updatedData.password = newPassword
  } else {
    delete updatedData.password
  }

  const user = await patchUserService(updatedData, id)

  return res.status(200).json(user)
};
