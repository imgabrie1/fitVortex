import { Router } from "express";
import { createExerciseController } from "../controllers/exercise.controller";
import { exerciseSchema } from "../schemas/exercise.schema";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";

const exerciseRoutes: Router = Router();

exerciseRoutes.post(
  "",
  ensureDataIsValidMiddleware(exerciseSchema),
  createExerciseController
);

export default exerciseRoutes;
