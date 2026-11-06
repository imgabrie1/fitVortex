import { string, z } from "zod";

export const userSchema = z.object({
  name: z.string().max(50),
  email: z.string().max(50).email(),
  admin: z.boolean().default(false),
  password: z.string().max(120),
});

export const createUserSchema = userSchema.omit({ admin: true }).strict();

export const returnUserSchema = userSchema
  .extend({
    id: z.string(),
  })
  .omit({ password: true });

export const returnUserSchemaComplete = returnUserSchema.extend({
  createdAt: z.date().or(string()),
  updatedAt: z.date().or(string()),
});

export const updateUser = userSchema
  .partial()
  .omit({ admin: true, password: true })
  .strict();

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(6, "Nova senha deve ter ao menos 6 caracteres")
      .max(120),
  })
  .strict();

export const returnMultipleUserSchema = returnUserSchemaComplete.array();
