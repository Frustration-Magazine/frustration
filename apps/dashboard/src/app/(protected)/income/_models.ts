export type TabTransactions = {
  id: string;
  name: string;
  transactionType: "all" | "subscription" | "donation";
};

export const TABS_TRANSACTIONS: TabTransactions[] = [
  { id: "global", name: "Global", transactionType: "all" },
  { id: "subscriptions", name: "Abonnements", transactionType: "subscription" },
  { id: "donations", name: "Dons", transactionType: "donation" },
];
