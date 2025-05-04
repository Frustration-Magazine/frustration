"use server";

import { type Event, EventFormSchema } from "../models/models";
import { deleteRecord, updateRecord } from "data-access/prisma";

type State = {
  success: string | null;
  error: string | null;
};

const ERROR = {
  success: null,
  error: "Il y a une erreur",
};

export async function deleteEvent(id: number): Promise<State> {
  let status = null;
  status = await deleteRecord({ table: "events", id, success: "L'événement a été supprimé avec succès!" });
  return status;
}
