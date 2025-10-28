import React from "react";
import { prisma, Prisma } from "data-access/prisma";
import { redirectIfNotSignedIn } from "@/app/auth/auth";
import { PaperItemsPage } from "./components/PaperItemsPage";
import { RedeployButton } from "@/app/_components/RedeployButton";
import { isEnvironmentProduction } from "@/lib/utils";

export type PaperItemWithRelations = Prisma.PaperItemGetPayload<{
  include: {
    author: true;
    image: true;
  };
}>;

export default async function Page() {
  await redirectIfNotSignedIn();

  const paperItems = await prisma.paperItem.findMany({
    orderBy: { releaseDate: "desc" },
    include: { author: true, image: true },
  });

  return (
    <>
      <PaperItemsPage paperItems={paperItems} />
      {!isEnvironmentProduction && <RedeployButton />}
    </>
  );
}
