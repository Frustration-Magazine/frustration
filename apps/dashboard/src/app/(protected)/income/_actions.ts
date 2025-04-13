"use server";
import { prisma } from "data-access/prisma";

export async function getPayments() {
  const firstDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const transactions = await prisma.payments.findMany({
    orderBy: {
      date: "desc",
    },
    where: {
      date: {
        lt: firstDayOfCurrentMonth,
      },
    },
  });
  return transactions;
}
