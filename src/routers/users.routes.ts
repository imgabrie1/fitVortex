import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getUserByIDController,
  getUsersController,
  patchPasswordController,
  patchUserController,
} from "../controllers/users.controller";
import { createUserSchema } from "../schemas/user.schema";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import ensureUserIsAuthenticatedMiddleware from "../middlewares/ensureUserIsAuthenticated.middleware";
import ensureUserIsAdminMiddleware from "../middlewares/ensureIsAdmin.middleware";

const userRoutes: Router = Router();

userRoutes.post(
  "",
  ensureDataIsValidMiddleware(createUserSchema),
  createUserController,
);

userRoutes.get(
  "",
  ensureUserIsAuthenticatedMiddleware,
  ensureUserIsAdminMiddleware,
  getUsersController,
);

userRoutes.get(
  "/:id",
  ensureUserIsAuthenticatedMiddleware,
  getUserByIDController,
);

userRoutes.delete(
  "/:id",
  ensureUserIsAuthenticatedMiddleware,
  deleteUserController,
);

userRoutes.patch(
  "/:id",
  ensureUserIsAuthenticatedMiddleware,
  patchUserController,
);

userRoutes.patch(
  "/:id/password",
  ensureUserIsAuthenticatedMiddleware,
  patchPasswordController,
);

export default userRoutes;
