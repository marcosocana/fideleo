import { z } from "zod";

export const adminUserSchema = z.object({
  firstName: z.string().min(2, "Introduce el nombre."),
  lastName: z.string().min(2, "Introduce los apellidos."),
  email: z.string().email("Introduce un email valido."),
  phone: z.string().optional(),
  role: z.enum(["customer", "business_admin"]),
  businessId: z.string().optional(),
  password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres.").optional()
});

export type AdminUserInput = z.infer<typeof adminUserSchema>;
