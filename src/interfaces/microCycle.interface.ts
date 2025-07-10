import { z } from "zod";
import { createMicroCycleSchema } from "../schemas/microCycle.schema";

export type iCreateMicroCycle = z.infer<typeof createMicroCycleSchema>;