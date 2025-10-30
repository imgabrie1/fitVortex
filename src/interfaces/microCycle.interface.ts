import { z } from "zod";
import { createMicroCycleSchema, returnMicroCycleNoRelationsSchema } from "../schemas/microCycle.schema";

export type iCreateMicroCycle = z.infer<typeof createMicroCycleSchema>;
export type ireturnMicroCycleWithNoRelations = z.infer<typeof returnMicroCycleNoRelationsSchema>;