import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide." }),
});
