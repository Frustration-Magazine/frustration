import { type Payment } from "./_models";
import { areSameMonth, explicitDate, truncateMonth } from "utils";

/* ----------------------- */
/*     Authentication      */
/* ----------------------- */

async function fetchHelloAssoToken({
  endpoint_access_token,
}: {
  endpoint_access_token: string;
}): Promise<string | null> {
  console.info("🔁 Récupération d'un token HelloAsso");
  let accessToken = null;

  if (!process.env.HELLOASSO_CLIENT_SECRET || !process.env.HELLOASSO_CLIENT_ID) {
    console.error("❌ Missing HelloAsso credentials");
    return null;
  }

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_secret: process.env.HELLOASSO_CLIENT_SECRET,
    client_id: process.env.HELLOASSO_CLIENT_ID,
  });

  await fetch(endpoint_access_token, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  })
    .then((response) => response.json())
    .then(({ access_token }) => {
      console.info("✅ Authentication token HelloAsso retrieved successfully");
      accessToken = access_token;
    })
    .catch((err) => console.error("❌ Error while trying to get Helloasso access token", err));

  return accessToken;
}

/* --------------- */
/*    PAYMENTS     */
/* --------------- */

const START_DATE_STRING = "2020-01-01T00:00:00Z";

export interface HelloAssoPayment {
  id: string;
  date: string;
  amount: number;
  items: { type: string }[];
  state: string;
}

export async function fetchHelloAssoPayments({ from } = { from: START_DATE_STRING }): Promise<any[]> {
  if (
    !process.env.HELLOASSO_API_PAYMENTS ||
    !process.env.HELLOASSO_API_TOKEN ||
    !process.env.HELLOASSO_ORGANIZATION_SLUG
  ) {
    console.error("❌ Missing HelloAsso API URL or slug");
    return [];
  }

  const pageSize = "100";
  let hasMore = false;
  let payments = [];

  let continuationToken = null;
  let counter = 1;

  const startingDate = new Date(from);
  let endingDate = new Date();

  console.info(`Récupération des données entre le ${explicitDate(startingDate)} et le ${explicitDate(endingDate)}`);

  const params = new URLSearchParams({
    organizationSlug: process.env.HELLOASSO_ORGANIZATION_SLUG,
    from,
    to: endingDate.toISOString(),
    pageSize,
  });

  const access_token = await fetchHelloAssoToken({
    endpoint_access_token: process.env.HELLOASSO_API_TOKEN,
  });

  do {
    console.info(`📄 [HELLO ASSO] Page de paiements : ${counter}`);
    if (continuationToken) params.set("continuationToken", continuationToken);
    const endpoint = `${process.env.HELLOASSO_API_PAYMENTS}?${params}`;

    console.info("🔁 Récupération d'une page de paiements \r\n");
    const {
      data,
      pagination: { continuationToken: newContinuationToken },
    } = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((res) => res.json())
      .catch((error) => console.error(error));

    hasMore = data && data.length > 0;

    if (hasMore) {
      payments.push(...data);
      continuationToken = newContinuationToken;
      ++counter;
    }
  } while (hasMore);

  // 2️⃣ Filter, format, reduce, sort
  // ---------------------------------
  payments = payments.filter(({ state }) => state === "Authorized");
  payments = payments.map(formatHelloAssoPayments);
  payments = payments.reduce((acc: Payment[], payment: Payment) => {
    const existingPayment = acc.find(({ date, type }) => areSameMonth(date, payment.date) && type === payment.type);
    if (existingPayment) {
      existingPayment.amount += payment.amount;
      existingPayment.customers += 1;
    } else {
      acc.push({
        ...payment,
        date: truncateMonth(payment.date),
      });
    }
    return acc;
  }, []);
  payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return payments;
}

function getTransactionType(helloassoType: string): "subscription" | "donation" | "other" {
  if (helloassoType === "MonthlyDonation") return "subscription";
  if (helloassoType === "Donation" || helloassoType === "Payment") return "donation";
  return "other";
}

function formatHelloAssoPayments({ date, amount, items }: HelloAssoPayment): Payment {
  const type = items?.[0]?.type;
  const transactionType = getTransactionType(type);
  if (transactionType === "other") console.info(`Unknown type: ${type}\n`);
  return {
    date: new Date(date),
    amount: Math.round(amount / 100),
    source: "helloasso",
    type: transactionType,
    customers: 1,
  };
}
