import { Router } from "express";
import {
  addWorkoutsToMicroCycleController,
  createMicroCycleController,
  deleteMicroCycleController,
} from "../controllers/microCycle.controller";
import { recordWorkoutController } from "../controllers/recordWorkout.controller";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import ensureUserIsAuthenticatedMiddleware from "../middlewares/ensureUserIsAuthenticated.middleware";
import { createMicroCycleSchema } from "../schemas/microCycle.schema";
import { recordWorkoutSchema } from "../schemas/set.schema";

const microCycleRoutes: Router = Router();

microCycleRoutes.post(
  "",
  ensureUserIsAuthenticatedMiddleware,
  ensureDataIsValidMiddleware(createMicroCycleSchema),
  createMicroCycleController
);

microCycleRoutes.patch(
  "/:microCycleId/workouts/:workoutId",
  ensureUserIsAuthenticatedMiddleware,
  addWorkoutsToMicroCycleController
);

microCycleRoutes.patch(
  "/:microCycleId/workouts/:workoutId/record",
  ensureUserIsAuthenticatedMiddleware,
  ensureDataIsValidMiddleware(recordWorkoutSchema),
  recordWorkoutController
);

microCycleRoutes.delete(
  "/:microCycleId",
  ensureUserIsAuthenticatedMiddleware,
  deleteMicroCycleController
);

export default microCycleRoutes;
