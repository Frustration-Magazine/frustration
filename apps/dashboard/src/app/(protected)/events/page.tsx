import React from "react";
import { readRecords } from "data-access/prisma";
import { type Event } from "./models/models";
import EventEditor from "./components/EventEditor";
import { redirect } from "next/navigation";
import { signedIn } from "@/auth";

const { data: events }: { data: Event[] } = await readRecords({
  table: "events",
  where: {},
  orderBy: { date: "asc" },
  success: "Events read!",
});

async function Page() {
  const isSignedIn = await signedIn();
  if (!isSignedIn) redirect("/auth/signin");

  return <EventEditor events={events} />;
}

export default Page;
