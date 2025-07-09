// src/interfaces/microCycle.interface.ts
import { z } from "zod";
import { createMicroCycleSchema, addWorkoutsToMicroCycleSchema } from "../schemas/microCycle.schema";

export type iCreateMicroCycle = z.infer<typeof createMicroCycleSchema>;
export type iAddWorkoutsToMicroCycle = z.infer<typeof addWorkoutsToMicroCycleSchema>;
