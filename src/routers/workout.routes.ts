import { Router } from "express";
import { createWorkoutController } from "../controllers/workout.controller";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import { workoutSchema } from "../schemas/workout.schema";

const workoutRoutes: Router = Router();

workoutRoutes.post(
  "",
  ensureDataIsValidMiddleware(workoutSchema),
  createWorkoutController
);

export default workoutRoutes;
