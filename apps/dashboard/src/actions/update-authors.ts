"use server";

import { fetchAuthors } from "data-access/wordpress";
import { createManyRecords } from "data-access/prisma";

export async function updateAuthors() {
    console.log("updateAuthors!");
    const authorsFromWordpress = await fetchAuthors();
    console.log("authorsFromWordpress", authorsFromWordpress);
    console.log("Current date and time:", new Date().toLocaleString());
    const { status, result } = await createManyRecords({ table: "authors", data: authorsFromWordpress, success: true });
    console.log("status", status);
    console.log("result", result);
}