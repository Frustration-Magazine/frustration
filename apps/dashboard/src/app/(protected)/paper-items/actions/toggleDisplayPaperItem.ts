"use server";

import { prisma } from "data-access/prisma";
import { PaperItemWithRelations } from "../page";
import { DEFAULT_RESPONSE_STATUS, type ResponseStatus } from "@/actions/models";

export async function toggleDisplayPaperItem(
  id: number,
  displayItem: boolean,
): Promise<ResponseStatus & { result?: PaperItemWithRelations }> {
  let response = { ...DEFAULT_RESPONSE_STATUS };

  try {
    const updatedPaperItem = await prisma.paperItem.update({
      where: { id },
      data: {
        displayItem,
      },
      include: { image: true, author: true },
    });
    return { ...response, success: "✅ L'item papier a été modifié avec succès !", result: updatedPaperItem };
  } catch (error) {
    response.error = "❌ Une erreur est survenue lors de la modification de l'item papier.";
    console.error(response.error, error);
    return response;
  }
}
