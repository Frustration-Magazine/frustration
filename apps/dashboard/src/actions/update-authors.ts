"use server";

import { fetchAuthors } from "data-access/wordpress";
import { createManyRecords } from "data-access/prisma";

export async function updateAuthors() {
    const authorsFromWordpress = await fetchAuthors();
    const { status, result } = await createManyRecords({ table: "authors", data: authorsFromWordpress, success: true });
    return { status, result };
}