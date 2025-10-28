import { PaperItemType } from "@prisma/client";
import { z } from "zod";

export const PaperItemFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  imageId: z.string(),
  authorId: z.string().min(1, "L'auteur est requis"),
  link: z.string().refine((val) => val === "" || z.string().url().safeParse(val).success, {
    message: "Veuillez renseigner un lien valide",
  }),
  type: z.enum(Object.values(PaperItemType) as [PaperItemType, ...PaperItemType[]]),
  releaseDate: z
    .date({
      required_error: "La date de sortie est requise",
    })
    .refine((date) => !isNaN(date.getTime()), {
      message: "Date invalide",
    }),
  displayItem: z.boolean({
    required_error: "Veuillez indiquer si l'item doit être affiché",
  }),
});

export type PaperItemFormType = z.infer<typeof PaperItemFormSchema>;
