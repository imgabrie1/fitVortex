import { Router } from "express";
import { createExerciseController, getExerciseController } from "../controllers/exercise.controller";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import { exerciseSchema } from "../schemas/exercise.schema";
import ensureUserIsAuthenticatedMiddleware from "../middlewares/ensureUserIsAuthenticated.middleware";

const exerciseRoutes: Router = Router();

exerciseRoutes.post(
  "",
  ensureDataIsValidMiddleware(exerciseSchema),
  createExerciseController
);

exerciseRoutes.get(
  "/:id",
  ensureUserIsAuthenticatedMiddleware,
  getExerciseController)

export default exerciseRoutes;
