"use server";

import { prisma } from "data-access/prisma";
import { EventWithImage } from "../page";
import { DEFAULT_RESPONSE_STATUS, type ResponseStatus } from "@/actions/models";

export async function toggleDisplayEvent(
  id: number,
  displayEvent: boolean,
): Promise<ResponseStatus & { result?: EventWithImage }> {
  let response = { ...DEFAULT_RESPONSE_STATUS };

  try {
    const updatedEvent = await prisma.events.update({
      where: { id },
      data: {
        displayEvent,
      },
      include: { image: true },
    });
    return { ...response, success: "✅ L'événement a été modifié avec succès !", result: updatedEvent };
  } catch (error) {
    response.error = "❌ Une erreur est survenue lors de la modification de l'événement.";
    console.error(response.error, error);
    return response;
  }
}
