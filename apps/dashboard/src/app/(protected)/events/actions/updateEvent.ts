"use server";

import { EventFormSchema, EventFormType } from "../models/models";
import { updateRecord } from "data-access/prisma";

type State = {
  success: string | null;
  error: string | null;
};

const ERROR = {
  success: null,
  error: "Il y a une erreur",
};

export async function updateEvent(data: EventFormType): Promise<State> {
  const parsed = EventFormSchema.safeParse(data);
  if (!parsed.success) return ERROR;

  let result = null;
  result = await updateRecord({ table: "events", data, success: "L'événement a été modifié avec succès!" });
  return result;
}
