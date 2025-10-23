import { Router } from "express";
import { getMuscleGroupsController } from "../controllers/muscles.controller";

export const muscleRoutes = Router();

muscleRoutes.get("/", getMuscleGroupsController);
