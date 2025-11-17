import z from "zod";
import { MuscleGroup } from "../enum/muscleGroup.enum";

const dateSchema = z.string().refine(
  (date) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  },
  {
    message: "Date must be in YYYY-MM-DD format",
  }
);

export const createMacroCycleSchema = z.object({
  macroCycleName: z.string(),
  microQuantity: z.number().int().positive(),
  startDate: dateSchema,
  endDate: dateSchema,
});

export const patchMacroCycleSchema = createMacroCycleSchema
  .omit({
    startDate: true,
    endDate: true,
  })
  .partial();

export const returnMacroCycleSchema = z.object({
  id: z.string().uuid(),
  macroCycleName: z.string(),
  startDate: z.string().regex(/^\d{2}-\d{2}-\d{4}$/),
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
