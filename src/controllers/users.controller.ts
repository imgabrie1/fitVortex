import { iUser } from "../interfaces/user.interface";
import createUserService from "../services/users/createUser.service";
import getUsersService from "../services/users/getUsers.service";
import { Request, Response } from "express";

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

