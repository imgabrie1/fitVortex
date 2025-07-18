import { Router } from "express";
import {
  addWorkoutsToMicroCycleController,
  createMicroCycleController,
  deleteMicroCycleController,
} from "../controllers/microCycle.controller";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import ensureUserIsAuthenticatedMiddleware from "../middlewares/ensureUserIsAuthenticated.middleware";
import { createMicroCycleSchema } from "../schemas/microCycle.schema";

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

microCycleRoutes.delete(
  "/:microCycleId",
  ensureUserIsAuthenticatedMiddleware,
  deleteMicroCycleController
);

export default microCycleRoutes;
