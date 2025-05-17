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

export async function updateTipeee({ amount, customers, date }: { amount: number; customers: number; date: Date }) {
  try {
    await prisma.payments.create({
      data: {
        amount,
        source: "tipeee",
        customers,
        date,
        type: "subscription",
      },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
