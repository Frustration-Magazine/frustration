"use server";

import { prisma } from "data-access/prisma";
import { DEFAULT_RESPONSE_STATUS, type ResponseStatus } from "@/actions/models";

export async function deleteEvent(id: number): Promise<ResponseStatus & { id?: number }> {
  let response = { ...DEFAULT_RESPONSE_STATUS };

  try {
    const deletedEvent = await prisma.events.delete({ where: { id } });
    return { ...response, success: "✅ L'événement a été supprimé avec succès!", id: deletedEvent.id };
  } catch (error) {
    return { ...response, error: "❌ Une erreur est survenue lors de la suppression de l'événement." };
  }
}
