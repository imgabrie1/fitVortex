import z from "zod";
import { MuscleGroup } from "../enum/muscleGroup.enum";

export const createMacroCycleSchema = z.object({
  macroCycleName: z.string(),
  microQuantity: z.number().int().positive(),
  startDate: z.string().regex(/^\d{2}-\d{2}-\d{4}$/),
  endDate: z.string().regex(/^\d{2}-\d{2}-\d{4}$/),
});

export const patchMacroCycleSchema = createMacroCycleSchema.omit({
  startDate: true,
  endDate: true,
}).partial()

export const returnMacroCycleSchema = z.object({
  id: z.string().uuid(),
  macroCycleName: z.string(),
  endDate: z.string().regex(/^\d{2}-\d{2}-\d{4}$/),
  microQuantity: z.number().int().positive(),
  volumes: z
    .array(
      z.object({
        muscleGroup: z.nativeEnum(MuscleGroup),
        totalVolume: z.number().int(),
        changePct: z.number().int(),
        recommendation: z.enum(["up", "same", "down"]),
      })
    )
    .optional(),
});
