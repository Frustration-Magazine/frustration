"use server";

import { prisma } from "data-access/prisma";
import { PaperItemWithRelations } from "../page";
import { PaperItemFormSchema, type PaperItemFormType } from "../models/PaperItemFormSchema";
import { DEFAULT_RESPONSE_STATUS, type ResponseStatus } from "@/actions/models";

export async function createPaperItem(
  data: PaperItemFormType,
): Promise<ResponseStatus & { result?: PaperItemWithRelations }> {
  let response = { ...DEFAULT_RESPONSE_STATUS };

  // Validation des données client côté serveur avec Zod
  const parsed = PaperItemFormSchema.safeParse(data);
  if (!parsed.success) {
    response.error = "❌ Les données de l'item papier sont invalides.";
    console.error(response.error, parsed.error.message);
    return response;
  }

  // Convertir les données client en données pour la base de données
  const dataForDb = {
    ...data,
    link: data.link === "" ? null : data.link,
    description: data.description === "" ? null : data.description,
    imageId: data.imageId === "" ? null : data.imageId,
  };

  try {
    const createdPaperItem = await prisma.paperItem.create({
      data: dataForDb,
      include: { image: true, author: true },
    });
    return { ...response, success: "✅ L'item papier a été créé avec succès!", result: createdPaperItem };
  } catch (error) {
    return { ...response, error: "❌ Une erreur est survenue lors de la création de l'item." };
  }
}
