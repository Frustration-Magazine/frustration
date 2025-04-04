"use server";

import {
  // fetchStripeNewCustomers,
  Customer,
  fetchStripeNewCustomers,
} from "@data-access/stripe";
import { fetchNumberOfActiveCustomersLastMonth } from "@data-access/database";

export async function fetchCustomers({
  from,
  to,
}: {
  from: Date;
  to: Date;
}): Promise<Customer[]> {
  const newSubscriptions = await fetchStripeNewCustomers({ from, to });
  return newSubscriptions;
}

export async function fetchActiveCustomersLastMonth() {
  const numberOfActiveCustomers = fetchNumberOfActiveCustomersLastMonth();
  return numberOfActiveCustomers;
}
