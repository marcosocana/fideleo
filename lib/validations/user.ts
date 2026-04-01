import { z } from "zod";

export const adminUserSchema = z.object({
  firstName: z.string().min(2, "Introduce el nombre."),
  lastName: z.string().min(2, "Introduce los apellidos."),
  email: z.string().email("Introduce un email valido."),
  phone: z.string().optional(),
  role: z.enum(["superadmin", "customer", "business_admin"]),
  businessId: z.string().optional(),
  password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres.").optional()
}).superRefine((value, ctx) => {
  if (value.role !== "superadmin" && !value.businessId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["businessId"],
      message: "Selecciona un negocio."
    });
  }
});

export type AdminUserInput = z.infer<typeof adminUserSchema>;
