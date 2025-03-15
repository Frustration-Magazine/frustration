import React from "react";
import { readRecords } from "@data-access/prisma";
import { type Event } from "./models/models";
import EventEditor from "./components/EventEditor";

const { data: events }: { data: Event[] } = await readRecords({
  table: "events",
  where: {},
  orderBy: { date: "asc" },
  success: "Events read!",
});

function Page() {
  return <EventEditor events={events} />;
}

export default Page;
