import Stripe from "stripe";
import { prisma } from "./prisma/client";
import { TRANSACTION_TYPES, TRANSACTION_SUBTYPES, Transaction } from "./models/transactions";
import { convertUTCtoDate } from "@/utils/dates";

/* ------------------- */
/*        STRIPE       */
/* ------------------- */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: null as any,
  telemetry: false
});

export const { STRIPE_PRICE_SUBSCRIPTION_MINI, STRIPE_PRICE_SUBSCRIPTION_MEDIUM, STRIPE_PRICE_SUBSCRIPTION_MAXI } = process.env;

/* ================== */
/*      FORMAT        */
/* ================== */

function getTransactionType(description: string): string {
  if (/(Subscription creation)|(Subscription update)/.test(description)) return TRANSACTION_TYPES.SUBSCRIPTION;
  if (/numéro/gi.test(description)) return TRANSACTION_TYPES.SALE;
  if (/(🙏 Faire un don)|(Montant libre)|(\d+€)/.test(description)) return TRANSACTION_TYPES.DONATION;
  if (/STRIPE PAYOUT/.test(description)) return TRANSACTION_TYPES.PAYOUT;
  if (/REFUND FOR CHARGE/.test(description)) return TRANSACTION_TYPES.REFUND;
  if (/Payment for Invoice/.test(description)) return TRANSACTION_TYPES.PAYMENT_FOR_INVOICE;
  if (/^Billing/.test(description)) return TRANSACTION_TYPES.FEE;
  else return TRANSACTION_TYPES.OTHER;
}

function getTransactionSubtype(description: string): "creation" | "update" | null {
  if (/Subscription creation/.test(description)) return TRANSACTION_SUBTYPES.SUBSCRIPTION_CREATION;
  if (/Subscription update/.test(description)) return TRANSACTION_SUBTYPES.SUBSCRIPTION_UPDATE;
  else return null;
}

const formatStripeTransactions = ({ id, description, amount, net, available_on, created, status }: StripeTransaction): Transaction => {
  const transactionType = getTransactionType(description);
  const transactionSubtype = getTransactionSubtype(description);
  if (transactionType === TRANSACTION_TYPES.OTHER) {
    console.info(`Unknown type: ${description}\n`);
    console.info({
      id,
      description,
      amount,
      net,
      available_on,
      created,
      status
    });
  }
  return {
    id,
    created: convertUTCtoDate(created),
    available: convertUTCtoDate(available_on),
    amount: amount / 100,
    net: net / 100,
    source: "stripe",
    type: transactionType,
    subtype: transactionSubtype,
    status
  };
};

/* ================== */
/*        READ        */
/* ================== */

async function fetchStripeData({ getAll, afterTimestamp } = { getAll: false, afterTimestamp: 0 }): Promise<any[]> {
  const PAGE_SIZE = 100;
  let data = [];
  let hasMore = true;
  let starting_after;
  let page = 0;

  console.info(`📄 [STRIPE] Récupération des données...`);

  do {
    try {
      console.info(`📄 [STRIPE] Page de résultats : ${page + 1}`);
      let listOptions: any = {
        limit: PAGE_SIZE,
        starting_after
      };

      // List options
      if (afterTimestamp) {
        listOptions = {
          ...listOptions,
          created: { gt: afterTimestamp }
        };
      }
      const { data: stripeData, has_more } = await stripe.balanceTransactions.list({
        limit: PAGE_SIZE,
        starting_after,
        created: { gt: afterTimestamp }
      });

      data.push(...stripeData);
      hasMore = has_more;
      if (hasMore) {
        const lastItem: any = data.slice(-1)[0];
        starting_after = lastItem.id;
        page++;
      }
    } catch (error: any) {
      if (error.type === "StripeInvalidRequestError") {
        console.info("Invalid request error:", error.message);
      } else {
        console.info("Unexpected error:", error);
      }
    }
  } while (getAll && hasMore);

  return data;
}

/*    TRANSACTIONS     */
/* ------------------- */

interface StripeTransaction {
  id: string;
  amount: number;
  available_on: number;
  created: number;
  description: string;
  net: number;
  status: string;
}

export async function fetchStripeTransactions({ afterTimestamp } = { afterTimestamp: 0 }) {
  let balanceTransactions: StripeTransaction[] = [];
  balanceTransactions = await fetchStripeData({ getAll: true, afterTimestamp });

  const formattedBalanceTransactions: Transaction[] = balanceTransactions.map(formatStripeTransactions);

  return formattedBalanceTransactions;
}

/*    CUSTOMERS     */
/* ---------------- */

export interface Customer {
  id: string;
  created: Date;
  name: string;
  email: string;
  adresse: string;
  code_postal: string;
  ville: string;
  amount: number;
}

export async function fetchStripeCustomers(
  { from, to } = {
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  }
) {
  const beginTimestamp = Math.floor(from.getTime() / 1000);
  const endTimestamp = Math.floor(to.getTime() / 1000);

  let hasMore;
  let subscriptions: any[] = [];
  let customersId: any[] = [];

  do {
    const { data, has_more } = await stripe.subscriptions.list({
      created: {
        gte: beginTimestamp,
        lte: endTimestamp
      },
      limit: 100,
      starting_after: subscriptions.at(-1)?.id
    });

    hasMore = has_more;
    // Filter out non valid subscriptions
    const newSubscriptions = data.filter((subscription: any) => subscription.status === "active");
    subscriptions = [...subscriptions, ...newSubscriptions];
    customersId = [...customersId, ...newSubscriptions.map((subscription: any) => subscription.customer)];
  } while (hasMore);

  if (Array.isArray(customersId)) {
    let customers: any[] = [];

    for (let i = 0; customersId?.[i]; i += 100) {
      const sliceCustomersId = customersId.slice(i, i + 99);
      const temp_customers = await Promise.all(sliceCustomersId.map((customerId: any) => stripe.customers.retrieve(customerId)));
      customers = [...customers, ...temp_customers];
    }

    const formattedCustomers: Customer[] = customers.map(({ id, created, name, email }) => {
      const subscription = subscriptions.find((subscription) => subscription.customer === id);
      return {
        id,
        created: new Date(created * 1000),
        name,
        email,
        adresse: subscription.metadata.adresse,
        code_postal: subscription.metadata.code_postal,
        ville: subscription.metadata.ville,
        amount: subscription.items.data[0].price.unit_amount
      };
    });
    return formattedCustomers;
  }
  return [];
}

/*    BALANCE     */
/* -------------- */

export async function fetchStripeBalance(): Promise<{
  available: number;
  pending: number;
}> {
  const balance = await stripe.balance.retrieve();
  const formattedBalance = {
    available: balance.available[0].amount / 100,
    pending: balance.pending[0].amount / 100
  };
  return formattedBalance;
}

/*    LAST UPDATE     */
/* ------------------ */

export async function fetchLastUpdate(): Promise<Date | null> {
  try {
    const lastBalanceRow = await prisma.balance.findFirst({});
    if (lastBalanceRow?.updatedAt) {
      const date = new Date(lastBalanceRow.updatedAt);
      return date;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
  return null;
}

/* ==================== */
/*        CREATE        */
/* ==================== */

export async function createStripeSubscription(customerId: string, priceId: string) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }]
  });
  return subscription;
}
