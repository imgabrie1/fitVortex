import { Router } from "express";
import {
  addWorkoutsToMicroCycleController,
  createMicroCycleController,
  deleteMicroCycleController,
  getAllMicroCycleController,
  getMicroCycleByIDController,
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
  "/:microCycleID/workouts/:workoutID",
  ensureUserIsAuthenticatedMiddleware,
  addWorkoutsToMicroCycleController
);

microCycleRoutes.patch(
  "/:microCycleID/workouts/:workoutID/record",
  ensureUserIsAuthenticatedMiddleware,
  ensureDataIsValidMiddleware(recordWorkoutSchema),
  recordWorkoutController
);

microCycleRoutes.delete(
  "/:microCycleID",
  ensureUserIsAuthenticatedMiddleware,
  deleteMicroCycleController
);

microCycleRoutes.get(
  "/:id",
  ensureUserIsAuthenticatedMiddleware,
  getMicroCycleByIDController
);

microCycleRoutes.get(
    "",
    ensureUserIsAuthenticatedMiddleware,
    getAllMicroCycleController
);

export default microCycleRoutes;
