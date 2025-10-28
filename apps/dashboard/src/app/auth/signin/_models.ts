import { z } from "zod";

export const schema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide." }),
});
