import Stripe from "stripe";
import { type Payment } from "./_models";
import { convertUTCtoDate, truncateDateToDay, explicitDate, areSameMonth, truncateMonth } from "utils";
import { convertCountryInitials, prettifyName } from "utils";

/* ------------------- */
/*        STRIPE       */
/* ------------------- */
// Please check https://docs.stripe.com/changelog/basil/2025-03-31/adds-new-parent-field-to-invoicing-objects for stripe api upgrades and use correct api version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
  telemetry: false
});

export const { STRIPE_PRICE_SUBSCRIPTION_MINI, STRIPE_PRICE_SUBSCRIPTION_MEDIUM, STRIPE_PRICE_SUBSCRIPTION_MAXI } = process.env;

/* ================== */
/*     Payments       */
/* ================== */

export async function fetchStripePayments({ afterTimestamp } = { afterTimestamp: 0 }): Promise<any[]> {
  let payments = [];
  const limit = 100;
  let hasMore = true;
  let starting_after;
  let page = 0;

  // 1️⃣ We fetch all payments
  // -----------------------
  console.info(`📄 [STRIPE] Fetching data from ${explicitDate(convertUTCtoDate(afterTimestamp))}...`);
  try {
    do {
      console.info(`📄 [STRIPE] Page ${page + 1}`);
      let listOptions: any = {
        limit,
        starting_after,
        ...(afterTimestamp ? { created: { gte: afterTimestamp } } : null)
      };

      const { data, has_more } = await stripe.balanceTransactions.list(listOptions);
      payments.push(...data);
      hasMore = has_more;

      if (hasMore) {
        const { id } = data.slice(-1)[0];
        starting_after = id;
        page++;
      }
    } while (hasMore);
  } catch (error) {
    handleStripeError(error);
  }

  // 2️⃣ Filter, format, reduce, sort
  // ---------------------------------
  payments = payments.map(formatStripePayments);
  payments = payments.filter((payment: Payment) => payment.type !== "other");
  payments = payments.reduce((acc: Payment[], payment: Payment) => {
    const existingPayment = acc.find(({ date, type }) => areSameMonth(date, payment.date) && type === payment.type);
    if (existingPayment) {
      existingPayment.amount += payment.amount;
      existingPayment.customers += 1;
    } else {
      acc.push({
        ...payment,
        date: truncateMonth(payment.date)
      });
    }
    return acc;
  }, []);

  payments.sort((a: Payment, b: Payment) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
  });

  return payments;
}

function handleStripeError(error: any) {
  if (!error?.type) console.error("[❌ Stripe API] Unknown error:", error);
  switch (error.type) {
    case "StripeInvalidRequestError":
      console.error("[❌ Stripe API] Invalid request error:", error.message);
      break;
    case "StripeAPIError":
      console.error("[❌ Stripe API] API error:", error.message);
      break;
    case "StripeAuthenticationError":
      console.error("[❌ Stripe API] Authentication error:", error.message);
      break;
    case "StripePermissionError":
      console.error("[❌ Stripe API] Permission error:", error.message);
      break;
    case "StripeRateLimitError":
      console.error("[❌ Stripe API] Rate limit error:", error.message);
      break;
    case "StripeConnectionError":
      console.error("[❌ Stripe API] Connection error:", error.message);
      break;
    case "StripeCardError":
      console.error("[❌ Stripe API] Card error:", error.message);
      break;
    default:
      console.error("[❌ Stripe API] Unexpected error:", error.message);
      break;
  }
}

function getTransactionType(description: string): "donation" | "subscription_creation" | "subscription_update" | "other" {
  if (/^(Subscription creation)/.test(description)) return "subscription_creation";
  if (/^(Subscription update)/.test(description)) return "subscription_update";
  if (/(🙏 Faire un don)|(Montant libre)|(\d+€)/.test(description)) return "donation";
  return "other";
}

export function formatStripePayments({ description, net, created }: any): Payment {
  const transactionType = getTransactionType(description);
  if (transactionType === "other") console.info(`Unknown type: ${description}\n`);
  return {
    date: truncateDateToDay(convertUTCtoDate(created)),
    amount: Math.round(net / 100),
    source: "stripe",
    type: transactionType,
    customers: 1
  };
}

/*    Payments     */
/* ------------------- */

interface StripePayment {
  id: string;
  created: number;
  description: string;
  net: number;
}

/*    SUBSCRIPTIONS     */
/* -------------------- */

export async function fetchActiveSubscriptions(
  { from, to } = {
    from: firstDayOfCurrentYear,
    to: now
  }
) {
  let hasMore;
  let subscriptions: any[] = [];

  // 1️⃣ We fetch active subscriptions
  do {
    console.log("start fetching subscriptions...");
    const { data, has_more } = await stripe.subscriptions.list({
      limit: 100,
      created: {
        gte: convertDateTimestamp(from),
        lt: convertDateTimestamp(to)
      },
      starting_after: subscriptions.at(-1)?.id
    });
    hasMore = has_more;
    const newSubscriptions = data.filter((subscription: any) => subscription.status === "active");
    subscriptions = [...subscriptions, ...newSubscriptions];
  } while (hasMore);

  const subscriptions_f = subscriptions.map((subscription) => {
    return {
      id: subscription.id,
      name: "",
      email: "",
      created: new Date(subscription.created * 1000),
      amount: subscription.items.data[0].price.unit_amount / 100,
      customerId: subscription.customer,
      line1: (subscription.metadata.line1 || subscription.metadata.adresse) ?? "",
      city: (subscription.metadata.city || subscription.metadata.ville) ?? "",
      postal_code: (subscription.metadata.postal_code || subscription.metadata.code_postal) ?? "",
      country: (subscription.metadata.country || subscription.metadata.pays) ?? "",
      state: subscription.metadata.state ?? ""
    };
  });

  // 2️⃣ We fetch customers to get additional information
  let customers: any = [];
  let paymentMethods: any = [];
  const customersId: any = subscriptions_f.map(({ customerId }: { customerId: string }) => customerId);

  for (let i = 0; i < customersId.length; i += 100) {
    const sliceCustomersId = customersId.slice(i, i + 100);
    const sliceCustomers = await Promise.all(sliceCustomersId.map((customerId: any) => stripe.customers.retrieve(customerId)));
    customers = [...customers, ...sliceCustomers];
    console.log("wait to avoid rate limit...");
    await wait(100);
    let slicePaymentMethods = await Promise.all(sliceCustomersId.map((customerId: any) => stripe.paymentMethods.list({ customer: customerId })));
    slicePaymentMethods = slicePaymentMethods.map((paymentMethod: any) => paymentMethod?.data.at(0));
    paymentMethods = [...paymentMethods, ...slicePaymentMethods];
    console.log("wait to avoid rate limit...");
    await wait(100);
  }
  subscriptions_f.forEach((subscription) => {
    const customer = customers.find((customer: any) => customer.id === subscription.customerId);
    const paymentMethod = paymentMethods.find((paymentMethod: any) => paymentMethod.customer === subscription.customerId);

    subscription.name = customer?.name;
    subscription.email = customer?.email;
    subscription.country = convertCountryInitials(subscription.country || paymentMethod?.card?.country);
  });

  return subscriptions_f;
}

/*    CUSTOMERS     */
/* ---------------- */

export interface Customer {
  id: string;
  name: string;
  email: string;
  created: Date;
  amount: number;
  customerId: string;
  line1: string;
  postal_code: string;
  city: string;
  country: string;
  state: string;
}

const firstDayOfCurrentYear = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const now = new Date();

const convertDateTimestamp = (date: Date) => Math.floor(date.getTime() / 1000);

function wait(ns: number) {
  return new Promise((resolve) => setTimeout(resolve, ns));
}

export async function fetchStripeNewCustomers(
  { from, to } = {
    from: firstDayOfCurrentYear,
    to: now
  }
) {
  let hasMore;
  let subscriptions: any[] = [];
  let customersId: any[] = [];

  // 1️⃣ We fetch new subscriptions
  do {
    console.log("start fetching subscriptions...");
    const lastSubscription = subscriptions.at(-1);

    const { data, has_more } = await stripe.subscriptions.list({
      created: {
        gte: convertDateTimestamp(from),
        lte: convertDateTimestamp(to)
      },
      limit: 100,
      starting_after: lastSubscription?.id
    });
    hasMore = has_more;

    // Filter out non valid subscriptions
    const newSubscriptions = data.filter((subscription: any) => subscription.status === "active");
    subscriptions = [...subscriptions, ...newSubscriptions];
  } while (hasMore);

  const subscriptions_f = subscriptions.map((subscription) => {
    return {
      id: subscription.id,
      name: "",
      email: "",
      created: new Date(subscription.created * 1000),
      amount: subscription.items.data[0].price.unit_amount / 100,
      customerId: subscription.customer,
      line1: (subscription.metadata.line1 || subscription.metadata.adresse) ?? "",
      city: (subscription.metadata.city || subscription.metadata.ville) ?? "",
      postal_code: (subscription.metadata.postal_code || subscription.metadata.code_postal) ?? "",
      country: (subscription.metadata.country || subscription.metadata.pays) ?? "",
      state: subscription.metadata.state ?? ""
    };
  });

  // 2️⃣ We fetch new customers
  let customers: any[] = [];
  let paymentMethods: any[] = [];
  customersId = subscriptions_f.map(({ customerId }: { customerId: string }) => customerId);

  for (let i = 0; i < customersId.length; i += 100) {
    console.log("start fetching customers...");
    const sliceCustomersId = customersId.slice(i, i + 99);
    const sliceCustomers = await Promise.all(sliceCustomersId.map((customerId: any) => stripe.customers.retrieve(customerId)));
    customers = [...customers, ...sliceCustomers];
    let slicePaymentMethods = await Promise.all(sliceCustomersId.map((customerId: any) => stripe.paymentMethods.list({ customer: customerId })));
    slicePaymentMethods = slicePaymentMethods.map((paymentMethod: any) => paymentMethod?.data.at(0));
    paymentMethods = [...paymentMethods, ...slicePaymentMethods];
  }

  subscriptions_f.forEach((subscription) => {
    const customer = customers.find((customer: any) => customer.id === subscription.customerId);
    const paymentMethod = paymentMethods.find((paymentMethod: any) => paymentMethod.customer === subscription.customerId);

    // ❗ Customers informations should take precedence over subscription informations (because it's more accurate and updated)
    subscription.name = customer?.name ? prettifyName(customer.name) : "";
    subscription.email = customer?.email;
    subscription.country = convertCountryInitials(customer?.address?.country || subscription.country || paymentMethod?.card?.country);
    subscription.line1 = customer?.address?.line1 ?? subscription.line1;
    subscription.city = customer?.address?.city ?? subscription.city;
    subscription.postal_code = customer?.address?.postal_code ?? subscription.postal_code;
    subscription.state = customer?.address?.state ?? subscription.state;
  });

  return subscriptions_f;
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
