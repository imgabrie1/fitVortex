import { Router } from "express";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import { createMacroCycleSchema } from "../schemas/macroCycle.schema";
import ensureUserIsAuthenticatedMiddleware from "../middlewares/ensureUserIsAuthenticated.middleware";
import { addMicroCycleToMacroCycleController, createMacroCycleController, deleteMacroCycleController } from "../controllers/macroCycle.controller";

const macroCycleRoutes: Router = Router();

macroCycleRoutes.post(
  "",
  ensureUserIsAuthenticatedMiddleware,
  ensureDataIsValidMiddleware(createMacroCycleSchema),
  createMacroCycleController
);

macroCycleRoutes.patch(
  "/:macroCycleId/micro/:microCycleId",
  ensureUserIsAuthenticatedMiddleware,
  addMicroCycleToMacroCycleController
);

macroCycleRoutes.delete(
    "/:macroCycleId",
    ensureUserIsAuthenticatedMiddleware,
    deleteMacroCycleController
  );

export default macroCycleRoutes;
