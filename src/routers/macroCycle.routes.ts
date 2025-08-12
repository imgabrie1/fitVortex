import { Router } from "express";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import { createMacroCycleSchema } from "../schemas/macroCycle.schema";
import ensureUserIsAuthenticatedMiddleware from "../middlewares/ensureUserIsAuthenticated.middleware";
import { addMicroCycleToMacroCycleController, createMacroCycleController, deleteMacroCycleController, getMacroCycleByIDController, adjustVolumeController } from "../controllers/macroCycle.controller";

const macroCycleRoutes: Router = Router();

macroCycleRoutes.post(
  "",
  ensureUserIsAuthenticatedMiddleware,
  ensureDataIsValidMiddleware(createMacroCycleSchema),
  createMacroCycleController
);

macroCycleRoutes.get(
    "/:id",
    ensureUserIsAuthenticatedMiddleware,
    getMacroCycleByIDController
);

macroCycleRoutes.patch(
  "/:macroCycleID/micro/:microCycleID",
  ensureUserIsAuthenticatedMiddleware,
  addMicroCycleToMacroCycleController
);

macroCycleRoutes.delete(
    "/:macroCycleID",
    ensureUserIsAuthenticatedMiddleware,
    deleteMacroCycleController
  );

macroCycleRoutes.post(
    "/:macroCycleId/adjust-volume",
    ensureUserIsAuthenticatedMiddleware,
    adjustVolumeController
);

export default macroCycleRoutes;
