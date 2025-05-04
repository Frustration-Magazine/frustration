"use server";

import { type Event, EventFormSchema } from "../models/models";
import { createRecord } from "data-access/prisma";

type Status = {
  success: string | null;
  error: string | null;
};

const STATUS_ERROR = {
  success: null,
  error: "Il y a une erreur",
};

export async function createEvent(data: Event): Promise<Status & { result?: Event }> {
  const parsed = EventFormSchema.safeParse(data);
  if (!parsed.success) return STATUS_ERROR;

  const { status, result } = await createRecord({
    table: "events",
    data,
    success: "L'événement a été créé avec succès!",
  });
  return { ...status, result };
}
