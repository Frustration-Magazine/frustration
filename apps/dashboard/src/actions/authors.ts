"use server";

import { prisma } from "data-access/prisma";
import { type Author } from "@prisma/client";
import { requireSession } from "@/lib/auth";

export async function getAuthors(): Promise<Author[]> {
  await requireSession();
  const authors = await prisma.author.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return authors;
}
