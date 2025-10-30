import { Router } from "express";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import { createMacroCycleSchema, patchMacroCycleSchema } from "../schemas/macroCycle.schema";
import ensureUserIsAuthenticatedMiddleware from "../middlewares/ensureUserIsAuthenticated.middleware";
import { addMicroCycleToMacroCycleController, createMacroCycleController, deleteMacroCycleController, getMacroCycleByIDController, adjustVolumeController, getAllMacroCycleController, patchMacroCycleController } from "../controllers/macroCycle.controller";
import { generateNextMacroCycleController } from "../controllers/generateNextMacroCycle.controller";

const macroCycleRoutes: Router = Router();

macroCycleRoutes.post(
  "",
  ensureUserIsAuthenticatedMiddleware,
  ensureDataIsValidMiddleware(createMacroCycleSchema),
  createMacroCycleController
);

macroCycleRoutes.patch(
  "/:id",
  ensureUserIsAuthenticatedMiddleware,
  ensureDataIsValidMiddleware(patchMacroCycleSchema),
  patchMacroCycleController
);


macroCycleRoutes.post(
  "/:id/generate-next",
  ensureUserIsAuthenticatedMiddleware,
  generateNextMacroCycleController
);

macroCycleRoutes.get(
    "/:id",
    ensureUserIsAuthenticatedMiddleware,
    getMacroCycleByIDController
);

macroCycleRoutes.get(
    "",
    ensureUserIsAuthenticatedMiddleware,
    getAllMacroCycleController
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
