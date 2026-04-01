import { z } from "zod";

export const rewardSchema = z.object({
  businessId: z.string().min(1, "Selecciona un negocio."),
  title: z.string().min(2, "Introduce un titulo."),
  description: z.string().min(4, "Introduce una descripcion."),
  rewardType: z.enum(["standard", "special", "bonus"]),
  pointsRequired: z.coerce.number().int().positive("Los puntos deben ser mayores que cero."),
  startsAt: z.string().min(1, "Introduce la fecha de inicio."),
  endsAt: z.string().min(1, "Introduce la fecha de fin."),
  isActive: z.enum(["true", "false"])
});

export type RewardInput = z.infer<typeof rewardSchema>;
