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

  const dataWithNulls = {
    ...data,
    contact: data.contact === "" ? null : data.contact,
    entrance: data.entrance === "" ? null : data.entrance,
    link: data.link === "" ? null : data.link,
  };

  let result = null;
  result = await updateRecord({
    table: "events",
    data: dataWithNulls,
    success: "L'événement a été modifié avec succès!",
  });
  return result;
}
