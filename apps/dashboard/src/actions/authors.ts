"use server";

import { prisma } from "data-access/prisma";
import { type Author } from "@prisma/client";

/**
 * Get all authors from the database
 */
export async function getAuthors(): Promise<Author[]> {
  const authors = await prisma.author.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return authors;
}
