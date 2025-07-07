import { z } from "zod";

export const createLoginSchema = z.object({
    email: z.string().email().max(50),
    password: z.string().min(4).max(120)
})