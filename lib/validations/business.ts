import { z } from "zod";

export const businessSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  ownerName: z.string().min(2, "Introduce el nombre de la persona responsable."),
  slug: z
    .string()
    .min(2, "El slug es obligatorio.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa minusculas, numeros y guiones."),
  ownerEmail: z.string().email("Introduce un email valido."),
  ownerPhone: z.string().min(6, "Introduce un telefono valido."),
  primaryColor: z.string().min(4, "Color invalido."),
  accentColor: z.string().min(4, "Color invalido."),
  secondaryColor: z.string().min(4, "Color invalido.").default("#F7F2E8"),
  welcomeText: z.string().min(8, "Introduce un texto de bienvenida.")
});

export type BusinessInput = z.infer<typeof businessSchema>;
