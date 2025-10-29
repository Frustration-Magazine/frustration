"use server";

import { prisma } from "data-access/prisma";
import { PaperItemWithRelations } from "../page";
import { PaperItemFormSchema, type PaperItemFormType } from "../models/PaperItemFormSchema";
import { DEFAULT_RESPONSE_STATUS, type ResponseStatus } from "@/actions/_models";
import { requireSession } from "@/lib/auth";

export async function updatePaperItem(
  data: PaperItemFormType,
): Promise<ResponseStatus & { result?: PaperItemWithRelations }> {
  await requireSession();
  let response = { ...DEFAULT_RESPONSE_STATUS };

  // Validation des données client côté serveur avec Zod
  const parsed = PaperItemFormSchema.safeParse(data);
  if (!parsed.success) {
    response.error = "Les données de l'item papier sont invalides.";
    console.error(response.error, parsed.error.message);
    return response;
  }

  // Convertir les données client en données pour la base de données
  const { id, ...dataForDb } = {
    ...data,
    link: data.link === "" ? null : data.link,
    description: data.description === "" ? null : data.description,
    imageId: data.imageId === "" ? null : data.imageId,
  };

  try {
    const updatedPaperItem = await prisma.paperItem.update({
      where: { id },
      data: {
        ...dataForDb,
      },
      include: { image: true, author: true },
    });
    return { ...response, success: "L'item papier a été modifié avec succès !", result: updatedPaperItem };
  } catch (error) {
    response.error = "Une erreur est survenue lors de la modification de l'item papier.";
    console.error(response.error, error);
    return response;
  }
}
