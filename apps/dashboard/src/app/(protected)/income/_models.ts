export type TabTransactions = {
  id: string;
  name: string;
  transactionType: "all" | "subscription" | "donation";
};

export const TABS_TRANSACTIONS: TabTransactions[] = [
  { id: "tt_1", name: "Global", transactionType: "all" },
  { id: "tt_2", name: "Abonnements", transactionType: "subscription" },
  { id: "tt_3", name: "Dons", transactionType: "donation" },
];
