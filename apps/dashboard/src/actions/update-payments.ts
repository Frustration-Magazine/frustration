"use server";

import { fetchStripePayments } from "data-access/stripe";
import { fetchHelloAssoPayments } from "data-access/helloasso";
import { fetchTipeeeTotal } from "data-access/tipeee";
import { prisma } from "data-access/prisma";

export async function updatePayments(): Promise<void> {
  let tipeeePayments: any = [];
  let stripePayments: any = [];
  let helloassoPayments: any = [];
  const now = new Date();
  const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const oneYearAgo = new Date(
    firstDayOfCurrentMonth.getFullYear() - 1,
    firstDayOfCurrentMonth.getMonth(),
    1,
    0,
    0,
    0,
    0,
  );

  const convertDateToTimestamp = (date: Date) => Math.floor(date.getTime() / 1000);

  try {
    const { amount, customers } = await fetchTipeeeTotal();
    tipeeePayments = [
      {
        date: firstDayOfCurrentMonth,
        amount,
        customers,
        source: "tipeee",
        type: "subscription",
      },
    ];

    stripePayments = await fetchStripePayments({
      afterTimestamp: convertDateToTimestamp(oneYearAgo),
    });

    helloassoPayments = await fetchHelloAssoPayments({
      from: oneYearAgo.toISOString(),
    });
  } catch (error) {
    console.error("Error while fetching payments :", error);
    return;
  }

  let payments = [...stripePayments, ...helloassoPayments, ...tipeeePayments];

  // 1️⃣ Delete old payments for selected period
  /* ------------------------------------------ */
  console.info("Deleting old payments stripe and helloasso...");
  try {
    await prisma.payments.deleteMany({
      where: {
        source: {
          in: ["stripe", "helloasso"],
        },
      },
    });
  } catch (error) {
    console.error("Failed to delete old payments", error);
  }

  // 2️⃣ Insert unique payments
  /* ------------------------- */
  console.info("Inserting new payments...");
  try {
    await prisma.payments.createMany({
      data: payments,
    });
    console.info(`${payments.length} transaction(s) inserted.`);
  } catch (error) {
    console.error("Failed to insert new payments", error);
  }
}
