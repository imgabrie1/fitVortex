import { Router } from "express";
import { createWorkoutController, getAllUserWorkoutsController } from "../controllers/workout.controller";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import { workoutSchema } from "../schemas/workout.schema";
import ensureUserIsAuthenticatedMiddleware from "../middlewares/ensureUserIsAuthenticated.middleware";

const workoutRoutes: Router = Router();

workoutRoutes.post(
  "",
  ensureDataIsValidMiddleware(workoutSchema),
  createWorkoutController
);

workoutRoutes.get(
  "/:id",
  ensureUserIsAuthenticatedMiddleware,
  getAllUserWorkoutsController
);

export default workoutRoutes;
