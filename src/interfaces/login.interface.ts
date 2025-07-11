import { z } from "zod";
import { createLoginSchema } from "../schemas/login.schema";

export type iLogin = z.infer<typeof createLoginSchema>