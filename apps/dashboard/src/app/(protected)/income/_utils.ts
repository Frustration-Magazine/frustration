import type { Payment, PaymentType } from "data-access/_models";

/* Convert number in euros */
/* ----------------------- */

export const inEuros = (number: number): string =>
  Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);

/* Get % difference */
/* ---------------- */

export const diffInPercent = (prev: number, current: number): string => {
  if (prev === 0) return "N/A";
  const percent = ((current - prev) / prev) * 100;
  const roundedPercent = percent.toFixed(0);

  // Early return if the difference is near zero
  const isNearZero = roundedPercent === "0";
  if (isNearZero) return "- %";

  const sign = percent > 0 ? "+" : "";

  // Return the percentage with its sign
  return `${sign}${roundedPercent}%`;
};

/* Debounce */
/* -------- */

// biome-ignore lint/suspicious/noExplicitAny: any function can be passed here
export const debounce = (fn: (...args: any[]) => void, delay: number): ((...args: any[]) => void) => {
  let timer: NodeJS.Timeout;
  // biome-ignore lint/suspicious/noExplicitAny: any function can be passed here
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

/* Filter by types */
/* --------------- */

export const filterByTypes = (payments: Payment[], paymentsTypes: PaymentType[]): Payment[] => {
  const filtered = payments.filter(({ type }) => paymentsTypes.some((paymentType) => type.startsWith(paymentType)));
  return filtered;
};

/* Aggregate by month */
/* ------------------ */

type PaymentByMonth = { date: Date; amount: number };

export const aggregateByMonth = (payments: PaymentByMonth[]): PaymentByMonth[] => {
  const aggregated = payments.reduce((acc: PaymentByMonth[], payment: PaymentByMonth) => {
    const existingEntry = acc.find(({ date }) => date && date.getTime() === payment.date.getTime());
    if (existingEntry?.amount) {
      existingEntry.amount += payment.amount;
    } else {
      acc.push({ date: payment.date, amount: payment.amount });
    }
    return acc;
  }, []);
  return aggregated;
};
