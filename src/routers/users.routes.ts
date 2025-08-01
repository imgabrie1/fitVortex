import { Router } from "express";
import { createUserController, deleteUserController, getUserByIDController, getUsersController, patchUserController } from "../controllers/users.controller";
import { userSchema } from "../schemas/user.schema";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import ensureUserIsAuthenticatedMiddleware from "../middlewares/ensureUserIsAuthenticated.middleware";
import ensureUserIsAdminMiddleware from "../middlewares/ensureIsAdmin.middleware";

const userRoutes: Router = Router();

userRoutes.post(
  "",
  ensureDataIsValidMiddleware(userSchema),
  createUserController
);

userRoutes.get(
    "",
    ensureUserIsAuthenticatedMiddleware,
    ensureUserIsAdminMiddleware,
    getUsersController
);

userRoutes.get(
    "/:id",
    ensureUserIsAuthenticatedMiddleware,
    getUserByIDController
);

userRoutes.delete(
    "/:id",
    ensureUserIsAuthenticatedMiddleware,
    deleteUserController
);

userRoutes.patch(
    "/:id",
    ensureUserIsAuthenticatedMiddleware,
    patchUserController
);

export default userRoutes