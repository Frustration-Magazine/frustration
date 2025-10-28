"use server";

import { prisma } from "data-access/prisma";
import { EventWithImage } from "../page";
import { EventFormSchema, EventFormType } from "../models/EventFormSchema";
import { DEFAULT_RESPONSE_STATUS, type ResponseStatus } from "@/actions/models";

export async function updateEvent(data: EventFormType): Promise<ResponseStatus & { result?: EventWithImage }> {
  let response = { ...DEFAULT_RESPONSE_STATUS };

  // Validation des données client côté serveur avec Zod
  const parsed = EventFormSchema.safeParse(data);
  if (!parsed.success) {
    response.error = "❌ Les données de l'événement sont invalides.";
    console.error(response.error, parsed.error.message);
    return response;
  }

  // Convertir les données client en données pour la base de données
  const { id, ...dataForDb } = {
    ...data,
    contact: data.contact === "" ? null : data.contact,
    entrance: data.entrance === "" ? null : data.entrance,
    link: data.link === "" ? null : data.link,
    imageId: data.imageId === "" ? null : data.imageId,
  };

  try {
    const updatedEvent = await prisma.events.update({
      where: { id },
      data: {
        ...dataForDb,
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
