import { Router } from "express";
import { createUserController } from "../controllers/users.controller";
import { userSchema } from "../schemas/user.schema";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";

const userRoutes: Router = Router();

userRoutes.post(
  "",
  ensureDataIsValidMiddleware(userSchema),
  createUserController
);

export default userRoutes