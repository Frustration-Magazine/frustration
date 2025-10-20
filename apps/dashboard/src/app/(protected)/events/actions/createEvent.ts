"use server";

import { type events as Event } from "@prisma/client";
import { EventFormSchema, EventFormType } from "../models/models";
import { createRecord } from "data-access/prisma";

type Status = {
  success: string | null;
  error: string | null;
};

const STATUS_ERROR = {
  success: null,
  error: "Il y a une erreur",
};

export async function createEvent(data: EventFormType): Promise<Status & { result?: Event }> {
  const parsed = EventFormSchema.safeParse(data);
  if (!parsed.success) return STATUS_ERROR;

  const dataWithNulls = {
    ...data,
    contact: data.contact === "" ? null : data.contact,
    entrance: data.entrance === "" ? null : data.entrance,
    link: data.link === "" ? null : data.link,
  };

  const { status, result } = await createRecord({
    table: "events",
    data: dataWithNulls,
    success: "L'événement a été créé avec succès!",
  });
  return { ...status, result };
}
