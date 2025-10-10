import React from "react";
import { EventsPage } from "./components/EventsPage";
import { readRecords } from "data-access/prisma";
import { redirectIfNotSignedIn } from "@/app/auth/auth";
import { type events as Event } from "@prisma/client";

async function Page() {
  await redirectIfNotSignedIn();

  const { data: events }: { data: Event[] } = await readRecords({
    table: "events",
    where: {},
    orderBy: { date: "desc" },
    success: "Events read !",
  });

  return <EventsPage events={events} />;
}

export default Page;
