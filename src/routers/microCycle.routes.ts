import { Router } from "express";
import { addWorkoutsToMicroCycleController, createMicroCycleController } from "../controllers/microCycle.controller";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import ensureUserIsAuthenticatedMiddleware from "../middlewares/ensureUserIsAuthenticated.middleware";
import { addWorkoutsToMicroCycleSchema, createMicroCycleSchema } from "../schemas/microCycle.schema";

const microCycleRoutes: Router = Router();

microCycleRoutes.post(
  "",
  ensureUserIsAuthenticatedMiddleware,
  ensureDataIsValidMiddleware(createMicroCycleSchema),
  createMicroCycleController
);

microCycleRoutes.patch(
  "/:microCycleId/workouts",
  ensureUserIsAuthenticatedMiddleware,
  ensureDataIsValidMiddleware(addWorkoutsToMicroCycleSchema),
  addWorkoutsToMicroCycleController
);

export default microCycleRoutes;
