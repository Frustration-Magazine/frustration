"use server";

import { Customer, fetchStripeNewCustomers } from "@data-access/stripe";

export async function fetchCustomers({ from, to }: { from: Date; to: Date }): Promise<Customer[]> {
  const newSubscriptions = await fetchStripeNewCustomers({ from, to });
  return newSubscriptions;
}

// Implement this
export async function fetchActiveCustomers() {
  const activeCustomers = null;
  return activeCustomers;
}
