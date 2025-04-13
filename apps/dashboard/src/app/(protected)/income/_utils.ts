import { type Payment } from "data-access/_models";

/* ----------------------- */
/* Convert number in euros */
/* ----------------------- */

/*
  Input : 1235
  Output: "1 235 €"
*/

export const inEuros = (number: number): string =>
  Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);

/* ---------------- */
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

/* --------------------------------------------------------------------- */
/* Get total month and evolution compared to the previous month (if any) */
/* --------------------------------------------------------------------- */

/*
Input

monthToSearch : Fri Oct 01 2023 00:00:00 GMT+0200 (Central European Summer Time)

transactionsByMonth : [
  { month: Fri Sep 01 2023 00:00:00 GMT+0200 (Central European Summer Time), total: 200 },
  { month: Fri Oct 01 2023 00:00:00 GMT+0200 (Central European Summer Time), total: 400 },
  { month: Fri Nov 01 2023 00:00:00 GMT+0200 (Central European Summer Time), total: 800 },
];

Output

  {
    monthTotal: 400,
    evolution: "+100%"
  }
*/

export const computeTotalAndEvolution = (
  date: Date,
  payments: any[],
): {
  monthTotal: number | null;
  evolution: string;
} => {
  const FALLBACK = { monthTotal: null, evolution: "" };

  // Early return if no transactions by month to compare with
  if (payments.length === 0) return FALLBACK;

  const matchingIndex = payments.findIndex(({ date }) => date.getTime() === date.getTime());

  // Early return if no matching month
  if (matchingIndex === -1) return FALLBACK;

  const [prevMonth, month] = [payments[matchingIndex - 1], payments[matchingIndex]];

  let evolution = prevMonth ? diffInPercent(prevMonth.amount, month.amount) : "";

  return { monthTotal: month.amount, evolution };
};

/* --------------------- */
/* Arrays equals */
/* --------------------- */
export function arraysEqual(arr1: any[], arr2: any[]) {
  if (arr1.length !== arr2.length) return false; // Check length
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false; // Check each element
  }
  return true; // All elements are equal
}

/* -------- */
/* Debounce */
/* -------- */

export const debounce = (fn: any, delay: number): ((...args: any) => void) => {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

/* ------------------------------------- */
/* Process from stripe to data for chart */
/* ------------------------------------- */

export const filterByTypes = (payments: Payment[], paymentsTypes: any): Payment[] => {
  const filtered = payments.filter(({ type }: { type: string }) =>
    paymentsTypes.some((paymentType: string) => type.startsWith(paymentType)),
  );

  return filtered;
};

export const aggregateByMonth = (payments: Payment[]): Payment[] => {
  const aggregated = payments.reduce((acc: any, payment: any) => {
    const existingEntry = acc.find(({ date }: { date: Date }) => date.getTime() === payment.date.getTime());
    if (existingEntry) {
      existingEntry.amount += payment.amount;
    } else {
      acc.push({ date: payment.date, amount: payment.amount });
    }
    return acc;
  }, []);
  return aggregated;
};
