import { Router } from "express";
import { createExerciseController } from "../controllers/exercise.controller";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import { exerciseSchema } from "../schemas/exercise.schema";

const exerciseRoutes: Router = Router();

exerciseRoutes.post(
  "",
  ensureDataIsValidMiddleware(exerciseSchema),
  createExerciseController
);

export default exerciseRoutes;
