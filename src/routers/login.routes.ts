import { Router } from "express";
import createLoginController from "../controllers/login.controller";
import refreshTokenController from "../controllers/refreshToken.controller";
import ensureDataIsValidMiddleware from "../middlewares/ensureDataIsValid.middleware";
import { createLoginSchema } from "../schemas/login.schema";

const loginRoutes: Router = Router();

loginRoutes.post(
  "/",
  ensureDataIsValidMiddleware(createLoginSchema),
  createLoginController
);
loginRoutes.post("/refresh-token", refreshTokenController);

export default loginRoutes;
