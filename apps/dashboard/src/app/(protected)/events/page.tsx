import React from "react";
import { readRecords } from "data-access/prisma";
import { type events as Event } from "@prisma/client";
import EventEditor from "./components/EventEditor";
import { redirectIfNotSignedIn } from "@/app/auth/auth";

async function Page() {
  await redirectIfNotSignedIn();

  const { data: events }: { data: Event[] } = await readRecords({
    table: "events",
    where: {
      date: {
        gte: new Date(),
      },
    },
    orderBy: { date: "desc" },
    success: "Events read !",
  });

  return <EventEditor events={events} />;
}

export default Page;
