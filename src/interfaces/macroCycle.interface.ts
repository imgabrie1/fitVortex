import { z } from "zod";
import { returnMacroCycleSchema, createMacroCycleSchema } from "../schemas/macroCycle.schema";

export type IMacroCycle = z.infer<typeof returnMacroCycleSchema>;
export type ICreateMacroCycle = z.infer<typeof createMacroCycleSchema>;
