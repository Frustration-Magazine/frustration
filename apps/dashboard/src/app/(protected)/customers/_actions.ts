"use server";

import { Customer, fetchStripeNewCustomers } from "data-access/stripe";
import { prisma } from "data-access/prisma";

export async function fetchCustomers({ from, to }: { from: Date; to: Date }): Promise<Customer[]> {
  const newSubscriptions = await fetchStripeNewCustomers({ from, to });
  return newSubscriptions;
}

export async function fetchActiveCustomers() {
  const firstDayOfLastMonth = new Date();
  firstDayOfLastMonth.setMonth(firstDayOfLastMonth.getMonth() - 1);
  firstDayOfLastMonth.setDate(1);
  firstDayOfLastMonth.setHours(0, 0, 0, 0);

  const firstDayOfCurrentMonth = new Date();
  firstDayOfCurrentMonth.setMonth(firstDayOfCurrentMonth.getMonth());
  firstDayOfCurrentMonth.setDate(1);
  firstDayOfCurrentMonth.setHours(0, 0, 0, 0);

  try {
    const paymentsLastMonth = await prisma.payments.findMany({
      where: {
        AND: [
          {
            date: {
              gte: firstDayOfLastMonth,
              lt: firstDayOfCurrentMonth,
            },
          },
          {
            type: {
              in: ["subscription", "subscription_creation", "subscription_update"],
            },
          },
        ],
      },
    });

    const activeCustomers = paymentsLastMonth.reduce((acc, payment) => acc + payment.customers, 0);
    return activeCustomers;
  } catch (error) {
    console.error("Error fetching active customers");
    console.error(error);
  }
  return 0;
}
