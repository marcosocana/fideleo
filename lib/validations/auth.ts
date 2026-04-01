import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email("Introduce un email valido."),
  password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres.")
});

export const customerLoginSchema = adminLoginSchema;

export const customerRegisterSchema = z
  .object({
    firstName: z.string().min(2, "Introduce el nombre."),
    lastName: z.string().min(2, "Introduce los apellidos."),
    email: z.string().email("Introduce un email valido."),
    phone: z.string().optional(),
    password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres."),
    confirmPassword: z.string().min(6, "Confirma la contrasena."),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "Debes aceptar los terminos." })
    })
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Las contrasenas no coinciden.",
    path: ["confirmPassword"]
  });

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type CustomerLoginInput = z.infer<typeof customerLoginSchema>;
export type CustomerRegisterInput = z.infer<typeof customerRegisterSchema>;
