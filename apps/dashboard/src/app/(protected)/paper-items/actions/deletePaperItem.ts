"use server";

import { prisma } from "data-access/prisma";
import { DEFAULT_RESPONSE_STATUS, type ResponseStatus } from "@/actions/_models";
import { requireSession } from "@/lib/auth";

export async function deletePaperItem(id: number): Promise<ResponseStatus & { id?: number }> {
  await requireSession();
  let response = { ...DEFAULT_RESPONSE_STATUS };

  try {
    const deletedPaperItem = await prisma.paperItem.delete({ where: { id } });
    return { ...response, success: "L'item papier a été supprimé avec succès!", id: deletedPaperItem.id };
  } catch (error) {
    return { ...response, error: "Une erreur est survenue lors de la suppression de l'item papier." };
  }
}
