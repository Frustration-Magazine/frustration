import { EventsPage } from "./components/EventsPage";
import { RedeployButton } from "@/app/_components/RedeployButton";

import { prisma } from "data-access/prisma";
import { redirectIfNotSignedIn } from "@/app/auth/auth";
import { Prisma } from "@prisma/client";
import { isEnvironmentProduction } from "@/lib/utils";

export type EventWithImage = Prisma.eventsGetPayload<{
  include: {
    image: true;
  };
}>;

export default async function Page() {
  await redirectIfNotSignedIn();

  const events = await prisma.events.findMany({
    include: {
      image: true,
    },
  });

  return (
    <>
      <EventsPage events={events} />
      {isEnvironmentProduction && <RedeployButton />}
    </>
  );
}
