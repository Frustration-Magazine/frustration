"use server";
import { prisma } from "data-access/prisma";
import { updatePayments } from "@/actions/update-payments";

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

export type UpdateStatus = "idle" | "loading" | "success" | "error";

export async function triggerUpdatePayments(): Promise<{ status: UpdateStatus; message?: string }> {
  try {
    await updatePayments();
    return { status: "success", message: "Paiements mis à jour avec succès" };
  } catch (error) {
    console.error("Error updating payments:", error);
    return { 
      status: "error", 
      message: error instanceof Error ? error.message : "Erreur lors de la mise à jour des paiements" 
    };
  }
}
