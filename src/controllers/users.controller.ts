import { iUser } from "../interfaces/user.interface";
import createUserService from "../services/users/createUser.service";
import { Request, Response } from "express";

export const createUserController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userData: iUser = req.body;

  const newUser = await createUserService(userData);


  return res.status(201).json(newUser);
};