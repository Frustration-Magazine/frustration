import { PaperItemsPage } from "./components/PaperItemsPage";
import { RedeployButton } from "@/app/_components/RedeployButton";
import { prisma, Prisma } from "data-access/prisma";
import { redirectIfNotSignedIn } from "@/lib/auth";
import { isEnvironmentProduction } from "@/lib/utils";

const query = {
  include: {
    author: true,
    image: true,
  },
} satisfies Prisma.PaperItemDefaultArgs;

export type PaperItemWithRelations = Prisma.PaperItemGetPayload<typeof query>;

export default async function Page() {
  await redirectIfNotSignedIn();

  const paperItems = await prisma.paperItem.findMany(query);

  return (
    <>
      <PaperItemsPage paperItems={paperItems} />
      {isEnvironmentProduction && <RedeployButton />}
    </>
  );
}
