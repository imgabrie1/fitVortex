import { Router } from "express";
import {
  createWorkoutController,
  getAllUserWorkoutsController,
  patchWorkoutController,
  removeExerciseFromWorkoutController,
  replaceExerciseInWorkoutController,
  reorderExercisesInWorkoutController,
} from "../controllers/workout.controller";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import { updateWorkoutSchema, workoutSchema } from "../schemas/workout.schema";
import ensureUserIsAuthenticatedMiddleware from "../middlewares/ensureUserIsAuthenticated.middleware";

const workoutRoutes: Router = Router();

workoutRoutes.post(
  "",
  ensureDataIsValidMiddleware(workoutSchema),
  createWorkoutController,
);

workoutRoutes.get(
  "/:id",
  ensureUserIsAuthenticatedMiddleware,
  getAllUserWorkoutsController,
);

workoutRoutes.patch(
  "/:id",
  ensureUserIsAuthenticatedMiddleware,
  ensureDataIsValidMiddleware(updateWorkoutSchema),
  patchWorkoutController,
);

workoutRoutes.delete(
  "/micro-cycle/:microCycleId/workout/:workoutId/exercise/:workoutExerciseId",
  ensureUserIsAuthenticatedMiddleware,
  removeExerciseFromWorkoutController,
);

workoutRoutes.patch(
  "/micro-cycle/:microCycleId/workout/:workoutId/exercise/:workoutExerciseId",
  ensureUserIsAuthenticatedMiddleware,
  replaceExerciseInWorkoutController,
);

workoutRoutes.patch(
  "/micro-cycle/:microCycleId/workout/:workoutId/reorder-exercises",
  ensureUserIsAuthenticatedMiddleware,
  reorderExercisesInWorkoutController,
);

export default workoutRoutes;
