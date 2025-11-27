import { Router } from "express";
import {
  addWorkoutsToMicroCycleController,
  createMicroCycleController,
  deleteMicroCycleController,
  getAllMicroCycleController,
  getMicroCycleByIDController,
  patchMicroCycleController,
  reorderWorkoutsController,
} from "../controllers/microCycle.controller";
import { recordWorkoutController } from "../controllers/recordWorkout.controller";
import { editRecordedWorkoutController } from "../controllers/editRecordedWorkout.controller";
import { skipWorkoutController } from "../controllers/skipWorkout.controller";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import ensureUserIsAuthenticatedMiddleware from "../middlewares/ensureUserIsAuthenticated.middleware";
import {
  createMicroCycleSchema,
  patchMicroCycleSchema,
  reorderWorkoutsSchema,
} from "../schemas/microCycle.schema";
import { recordWorkoutSchema } from "../schemas/set.schema";

const microCycleRoutes: Router = Router();

microCycleRoutes.post(
  "",
  ensureUserIsAuthenticatedMiddleware,
  ensureDataIsValidMiddleware(createMicroCycleSchema),
  createMicroCycleController
);

microCycleRoutes.patch(
  "/:id",
  ensureUserIsAuthenticatedMiddleware,
  ensureDataIsValidMiddleware(patchMicroCycleSchema),
  patchMicroCycleController
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

microCycleRoutes.patch(
  "/:microCycleID/workouts/:workoutID/skip",
  ensureUserIsAuthenticatedMiddleware,
  skipWorkoutController
);

microCycleRoutes.patch(
  "/:microCycleID/reorder",
  ensureUserIsAuthenticatedMiddleware,
  ensureDataIsValidMiddleware(reorderWorkoutsSchema),
  reorderWorkoutsController
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
