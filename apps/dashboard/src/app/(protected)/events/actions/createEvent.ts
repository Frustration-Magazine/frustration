"use server";

import { prisma } from "data-access/prisma";
import { EventWithImage } from "../page";
import { EventFormSchema, type EventFormType } from "../models/EventFormSchema";
import { DEFAULT_RESPONSE_STATUS, type ResponseStatus } from "@/actions/models";

export async function createEvent(data: EventFormType): Promise<ResponseStatus & { result?: EventWithImage }> {
  let response = { ...DEFAULT_RESPONSE_STATUS };

  // Validation des données client côté serveur avec Zod
  const parsed = EventFormSchema.safeParse(data);
  if (!parsed.success) {
    response.error = "❌ Les données de l'événement sont invalides.";
    console.error(response.error, parsed.error.message);
    return response;
  }

  // Convertir les données client en données pour la base de données
  const dataForDb = {
    ...data,
    contact: data.contact === "" ? null : data.contact,
    entrance: data.entrance === "" ? null : data.entrance,
    link: data.link === "" ? null : data.link,
    imageId: data.imageId === "" ? null : data.imageId,
  };

  try {
    const createdEvent = await prisma.events.create({
      data: dataForDb,
      include: { image: true },
    });
    return { ...response, success: "✅ L'événement a été créé avec succès!", result: createdEvent };
  } catch (error) {
    return { ...response, error: "❌ Une erreur est survenue lors de la création de l'événement." };
  }
}
