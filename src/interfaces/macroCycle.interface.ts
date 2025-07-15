import { z } from "zod";
import { macroCycleSchema, createMacroCycleSchema } from "../schemas/macroCycle.schema";

export type IMacroCycle = z.infer<typeof macroCycleSchema>;
export type ICreateMacroCycle = z.infer<typeof createMacroCycleSchema>;
