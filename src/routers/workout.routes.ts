import { Router } from "express";
import {
  createWorkoutController,
  getAllUserWorkoutsController,
  patchWorkoutController,
} from "../controllers/workout.controller";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import { updateWorkoutSchema, workoutSchema } from "../schemas/workout.schema";
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

workoutRoutes.patch(
  "/:id",
  ensureUserIsAuthenticatedMiddleware,
  ensureDataIsValidMiddleware(updateWorkoutSchema),
  patchWorkoutController
);

export default workoutRoutes;
