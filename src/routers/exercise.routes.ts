import { Router } from "express";
import { createExerciseController, deleteExerciseController, getExerciseByIDController, getExercisesController, patchExerciseController } from "../controllers/exercise.controller";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import { exerciseSchema } from "../schemas/exercise.schema";
import ensureUserIsAuthenticatedMiddleware from "../middlewares/ensureUserIsAuthenticated.middleware";
import ensureIsAdminMiddleware from "../middlewares/ensureIsAdmin.middleware";
import { deleteUserController } from "../controllers/users.controller";
import deleteExerciseService from "../services/exercise/deleteExercise.service";

const exerciseRoutes: Router = Router();

exerciseRoutes.post(
  "",
  ensureDataIsValidMiddleware(exerciseSchema),
  createExerciseController
);

exerciseRoutes.get(
  "/:id",
  ensureUserIsAuthenticatedMiddleware,
  getExerciseByIDController
)

exerciseRoutes.get(
  "",
  ensureUserIsAuthenticatedMiddleware,
  getExercisesController
)

exerciseRoutes.patch(
  "/:id",
  ensureUserIsAuthenticatedMiddleware,
  ensureIsAdminMiddleware,
  patchExerciseController
)

exerciseRoutes.delete(
  "/:id",
  ensureUserIsAuthenticatedMiddleware,
  ensureIsAdminMiddleware,
  deleteExerciseController
)


export default exerciseRoutes;
